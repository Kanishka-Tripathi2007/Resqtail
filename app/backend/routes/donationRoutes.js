const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { createOrder, verifyPayment, webhookHandler } = require('../controllers/donationController');

const validateCreate = [
	body('amount').isFloat({ gt: 0 }).withMessage('amount must be a number > 0'),
	body('ngo').optional().isString()
];

const validateVerify = [
	body('razorpay_order_id').notEmpty(),
	body('razorpay_payment_id').notEmpty(),
	body('razorpay_signature').notEmpty()
];

function handleValidation(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
	next();
}

router.post('/create-order', validateCreate, handleValidation, createOrder);
router.post('/verify', validateVerify, handleValidation, verifyPayment);

// Razorpay webhook endpoint (Razorpay will POST JSON with signature header)
router.post('/webhook', webhookHandler);

module.exports = router;
