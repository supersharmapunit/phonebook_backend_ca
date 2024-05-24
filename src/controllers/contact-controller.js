// src/controllers/contactController.js
const { contactSchema, markSpamSchema, getContactDetailsSchema } = require('../validations/contact-validations');
const { z } = require("zod");
const prisma = require("../config/dbClient");
const { PrismaClientKnownRequestError } = require('@prisma/client');

const addContact = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("here", userId, req.body);
        const contactData = contactSchema.parse(req.body);

        const existingContact = await prisma.contact.findFirst({
            where: {
                userId,
                phoneNumber: contactData.phoneNumber,
            },
        });

        if (existingContact) {
            return res.status(400).json({ error: 'Contact already exists' });
        }

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
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return res.status(400).json({ error: 'Phone number already exists' });
            }
            console.error(error);
            return res.status(500).json({ error: 'Database error' });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const markNumberAsSpam = async (req, res) => {
    try {
        const userId = req.user.id;
        const { phoneNumber } = markSpamSchema.parse(req.body);
        const contact = await prisma.contact.findFirst({
            where: {
                phoneNumber,
            },
        });

        if (!contact) {
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
        const userId = req.user.id; 
        const { phoneNumber } = getContactDetailsSchema.parse(req.params);

        const contact = await prisma.contact.findFirst({
            where: { phoneNumber },
            include: { user: true },
        });

        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        const isRegisteredUser = !!contact.user;

        const isInContactList = isRegisteredUser && !!(await prisma.contact.findFirst({
            where: {
                userId: contact.user.id,
                phoneNumber: req.user.phoneNumber,
            },
        }));

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