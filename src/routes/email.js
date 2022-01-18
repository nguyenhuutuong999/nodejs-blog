const express = require('express');
const router = express.Router();
const emailController = require("./../app/controllers/EmailController");

router.post("/reset-password", emailController.resetPassword);

module.exports = router;