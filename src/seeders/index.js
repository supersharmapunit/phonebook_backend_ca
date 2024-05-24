const bcrypt = require('bcrypt');
const { fakerEN } = require('@faker-js/faker');
const prisma = require("../config/dbClient");

const generateUsers = async (numUsers) => {
    const users = [];

    for (let i = 0; i < numUsers; i++) {
        const name = fakerEN.person.fullName();
        const phoneNumber = fakerEN.phone.number().toString();
        const email = fakerEN.internet.email();
        const password = await bcrypt.hash('password', 10);

        const user = await prisma.user.create({
            data: {
                name,
                phoneNumber,
                email,
                password,
            },
        });

        users.push(user);
    }

    return users;
};

const generateContacts = async (numContacts, users) => {
    const contacts = [];

    for (let i = 0; i < numContacts; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const name = fakerEN.person.fullName();
        const phoneNumber = fakerEN.phone.number().toString();
        const email = fakerEN.internet.email();
        const isSpam = fakerEN.datatype.boolean();

        const contact = await prisma.contact.create({
            data: {
                name,
                phoneNumber,
                email,
                isSpam,
                user: { connect: { id: randomUser.id } },
            },
        });

        contacts.push(contact);
    }

    return contacts;
};

const seedData = async () => {
    const numUsers = 10;
    const numContacts = 100;
    console.log("starting to add users...");
    const users = await generateUsers(numUsers);
    console.log("users added!");
    console.log("starting to add contacts...");
    const contacts = await generateContacts(numContacts, users);
    console.log("contact added!");
    console.log(`Generated ${users.length} users and ${contacts.length} contacts.`);
};

seedData()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
