const express = require('express');
const router = express.Router();

const authRoutes = require('./auth-routes');
const contactRoutes = require("./contact-routes");
const searchRoutes = require("./search-routes");

router.use("/auth", authRoutes);
router.use("/contact", contactRoutes);
router.use("/search", searchRoutes);

module.exports = router;