// src/middlewares/authMiddleware.js
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/server-config');

const prisma = new PrismaClient();

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authentication token missing' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid authentication token' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Invalid authentication token' });
    }
};

module.exports = authMiddleware;