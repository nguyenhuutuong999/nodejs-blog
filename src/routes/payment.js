const express = require('express');
const router = express.Router();
const paymentController = require('../app/controllers/PaymentController')

router.post('/create', paymentController.create);
router.get('/success', paymentController.success);

module.exports = router;