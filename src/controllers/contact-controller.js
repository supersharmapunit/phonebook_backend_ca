// src/controllers/contactController.js
const { PrismaClient } = require('@prisma/client');
const { contactSchema, markSpamSchema, getContactDetailsSchema } = require('../validations/contact-validations');
const { z } = require("zod");
const prisma = new PrismaClient();

const addContact = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have implemented authentication middleware
        const contactData = contactSchema.parse(req.body);

        // Check if the contact already exists for the user
        const existingContact = await prisma.contact.findFirst({
            where: {
                userId,
                phoneNumber: contactData.phoneNumber,
            },
        });

        if (existingContact) {
            return res.status(400).json({ error: 'Contact already exists' });
        }

        // Create a new contact
        const newContact = await prisma.contact.create({
            data: {
                name: contactData.name,
                phoneNumber: contactData.phoneNumber,
                email: contactData.email,
                user: { connect: { id: userId } },
            },
        });

        return res.status(201).json({ message: 'Contact added successfully', contact: newContact });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const markNumberAsSpam = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have implemented authentication middleware
        const { phoneNumber } = markSpamSchema.parse(req.body);

        // Find the contact with the given phone number
        const contact = await prisma.contact.findFirst({
            where: {
                phoneNumber,
            },
        });

        if (!contact) {
            // Create a new contact and mark it as spam
            const newContact = await prisma.contact.create({
                data: {
                    name: "unknown",
                    phoneNumber,
                    isSpam: true,
                    user: { connect: { id: userId } },
                },
            });

            return res.status(201).json({ message: 'Number marked as spam', contact: newContact });
        } else {
            // Update the existing contact and mark it as spam
            const updatedContact = await prisma.contact.update({
                where: { id: contact.id },
                data: { isSpam: true },
            });

            return res.status(200).json({ message: 'Number marked as spam', contact: updatedContact });
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getContactDetails = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have implemented authentication middleware
        const { phoneNumber } = getContactDetailsSchema.parse(req.params);

        // Find the contact with the given phone number
        const contact = await prisma.contact.findFirst({
            where: { phoneNumber },
            include: { user: true },
        });

        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        // Check if the user is a registered user
        const isRegisteredUser = !!contact.user;

        // Check if the user requesting the details is in the contact's contact list
        const isInContactList = isRegisteredUser && !!(await prisma.contact.findFirst({
            where: {
                userId: contact.user.id,
                phoneNumber: req.user.phoneNumber,
            },
        }));

        // Prepare the response data
        const responseData = {
            name: contact.name,
            phoneNumber: contact.phoneNumber,
            isSpam: contact.isSpam,
            email: isRegisteredUser && isInContactList ? contact.user.email : undefined,
        };

        return res.status(200).json(responseData);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { addContact, markNumberAsSpam, getContactDetails };