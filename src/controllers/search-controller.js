// src/controllers/searchController.js
const { z } = require("zod");
const { searchByNameSchema, searchByPhoneNumberSchema } = require('../validations/search-validations');

const prisma = require("../config/dbClient");

const searchByName = async (req, res) => {
  try {
    const query = searchByNameSchema.parse(req.query.name);
    
    // Search for users and contacts with names matching the query
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

    
    

    return res.status(200).json(results);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }

    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const searchByPhoneNumber = async (req, res) => {
  try {
    const { phoneNumber } = searchByPhoneNumberSchema.parse(req.query);

    // Search for users and contacts with the given phone number
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

    return res.status(200).json(results);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }

    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { searchByName, searchByPhoneNumber };