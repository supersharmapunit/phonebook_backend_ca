// src/controllers/authController.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const { userSchema, userLoginRequestSchema } = require('../validations/user-validations');
const { SALTS, JWT_SECRET  } = require('../config/server-config');

const prisma = new PrismaClient();

const register = async (req, res) => {
    try {
        const userData = userSchema.parse(req.body);

        // Check if the phone number already exists
        const existingUser = await prisma.user.findUnique({
            where: { phoneNumber: userData.phoneNumber },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Phone number already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(userData.password, bcrypt.genSaltSync(parseInt(SALTS) || 10));

        // Create a new user
        const newUser = await prisma.user.create({
            data: {
                name: userData.name,
                phoneNumber: userData.phoneNumber,
                email: userData.email,
                password: hashedPassword,
            },
        });
        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const login = async (req, res) => {
    try {
        const userData = userLoginRequestSchema.parse(req.body);
        const { phoneNumber, password } = userData;

        // Find the user by phone number
        const user = await prisma.user.findUnique({
            where: { phoneNumber },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });

        // Authentication successful
        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { register, login };