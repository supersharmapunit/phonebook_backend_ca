const prisma = require("../config/dbClient");

const searchUser = async (query, attribute) => {
    try {
        if (attribute == 'name') {
            const queryParam = `%${query}%`;
            const startWithQueryParam = `${query}%`;
            const results = await prisma.$queryRaw`
            WITH "UserContacts" AS (
                SELECT
                id,
                name,
                "phoneNumber",
                CASE
                    WHEN id IS NULL THEN "isSpam"
                    ELSE NULL
                END AS isSpam
                FROM (
                SELECT id, name, "phoneNumber", NULL AS "isSpam" FROM "User"
                UNION ALL
                SELECT NULL AS id, name, "phoneNumber", "isSpam" FROM "Contact"
                ) AS "UnionQuery"
            )
            SELECT * FROM "UserContacts"
            WHERE name ILIKE ${queryParam}
            ORDER BY
                CASE
                WHEN name LIKE ${startWithQueryParam} THEN 1
                ELSE 2
            END,
            name
            `;
            return results;
        } else if(attribute == 'phoneNumber') {
            const phoneNumber = query;
            const user = await prisma.user.findUnique({
                where: { phoneNumber },
                select: {
                    id: true,
                    name: true,
                    phoneNumber: true,
                    isSpam: false,
                },
            });

            const contacts = await prisma.contact.findMany({
                where: { phoneNumber },
                select: {
                    id: true,
                    name: true,
                    phoneNumber: true,
                    isSpam: true,
                },
            });
            const results = user ? [user, ...contacts] : contacts;
            const filteredContacts = [];
            results.forEach(contact => {
                if (!filteredContacts.some(filteredContact => filteredContact.phoneNumber === contact.phoneNumber)) {
                    filteredContacts.push(contact);
                }
            });
            return filteredContacts;
        }
    } catch (error) {
        throw error;
    }
}

module.exports = { searchUser }