const express = require('express');
const router = express.Router();

const { searchByName, searchByPhoneNumber } = require('../../controllers/search-controller');
const authMiddleware = require('../../middlewares/auth-middleware');

router.get('/name', authMiddleware, searchByName);
router.get('/phone', authMiddleware, searchByPhoneNumber);

module.exports = router;