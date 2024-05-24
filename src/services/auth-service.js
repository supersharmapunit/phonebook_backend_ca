const bcrypt = require('bcrypt');
const { SALTS } = require('../config/server-config');
const prisma = require("../config/dbClient");

const saveUser = async (userData) => {
    try {
        const hashedPassword = await bcrypt.hash(userData.password, bcrypt.genSaltSync(parseInt(SALTS) || 10));

        const newUser = await prisma.user.create({
            data: {
                name: userData.name,
                phoneNumber: userData.phoneNumber,
                email: userData.email,
                password: hashedPassword,
            },
        });
        return newUser;
    } catch (error) {
        throw {
            error: "Error creating user",
            status: 500
        };
    }
}

module.exports = { saveUser };