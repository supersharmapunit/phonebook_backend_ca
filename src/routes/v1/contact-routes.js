const express = require('express');
const router = express.Router();

const { addContact, markNumberAsSpam, getContactDetails } = require('../../controllers/contact-controller');
const authMiddleware = require("../../middlewares/auth-middleware");

router.post('/add', authMiddleware, addContact);
router.post('/spam', authMiddleware, markNumberAsSpam);
router.get('/:phoneNumber', authMiddleware, getContactDetails);

module.exports = router;