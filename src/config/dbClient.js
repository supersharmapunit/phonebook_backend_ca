const { PrismaClient } = require('@prisma/client');

const prismaClientSingleton = () => {
    return new PrismaClient();
};

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

module.exports = prisma;