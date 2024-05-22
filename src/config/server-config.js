const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

module.exports = {
    START_SERVER_PORT : process.env.START_SERVER_PORT,
    SALTS: process.env.SALTS,
    JWT_SECRET: process.env.JWT_SECRET
}