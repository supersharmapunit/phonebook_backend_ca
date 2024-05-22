const { z } = require('zod');

const contactSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    phoneNumber: z.string().min(1, 'Phone number is required'),
    email: z.string().email().optional(),
});

const markSpamSchema = z.object({
    phoneNumber: z.string().min(1, 'Phone number is required'),
});

const getContactDetailsSchema = z.object({
    phoneNumber: z.string().min(1, 'Phone number is required'),
});

module.exports = { contactSchema, markSpamSchema, getContactDetailsSchema };