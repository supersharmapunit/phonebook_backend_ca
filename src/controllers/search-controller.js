const { z } = require("zod");
const { searchByNameSchema, searchByPhoneNumberSchema } = require('../validations/search-validations');
const { searchUser } = require("../services/search-service");

const searchByName = async (req, res) => {
  try {
    const query = searchByNameSchema.parse(req.query.name);
    const results = await searchUser(query, 'name');
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
    const results = await searchUser(phoneNumber, 'phoneNumber');

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