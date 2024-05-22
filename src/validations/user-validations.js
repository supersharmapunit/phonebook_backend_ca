const z = require('zod');

const userSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    phoneNumber: z.string().min(1, 'Phone number is required'),
    email: z.string().email().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const userLoginRequestSchema = z.object({
    phoneNumber: z.string().min(1, 'Phone number is required'),
    password: z.string().min(6, 'Password must be at least 6 characters long and is required'),
});

module.exports = { userSchema, userLoginRequestSchema };