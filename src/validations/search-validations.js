const { z } = require('zod');

const searchByNameSchema = z.string().min(1, 'Name is required');

const searchByPhoneNumberSchema = z.object({
    phoneNumber: z.string().min(1, 'Phone number is required'),
});

module.exports = { searchByNameSchema, searchByPhoneNumberSchema };