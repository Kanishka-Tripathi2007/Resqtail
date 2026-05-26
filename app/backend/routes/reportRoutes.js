const express = require("express");
const router = express.Router();
const path = require('path');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const { createReport, getReports, getReport, updateReportStatus } = require("../controllers/reportController");
const { isCloudinaryConfigured, createCloudinaryStorage } = require('../config/cloudinary');

// Use Cloudinary when configured, otherwise fall back to local disk
let storage;
if (isCloudinaryConfigured()) {
	storage = createCloudinaryStorage('resqtail/reports');
} else {
	const uploadDir = path.join(__dirname, '..', 'uploads', 'reports');
	storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, uploadDir);
		},
		filename: function (req, file, cb) {
			const ext = path.extname(file.originalname);
			const base = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
			cb(null, base + ext);
		}
	});
}

function fileFilter(req, file, cb) {
	if (!file.mimetype.startsWith('image/')) return cb(null, false);
	cb(null, true);
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

const validateReport = [
	body('animal').notEmpty().withMessage('animal is required'),
	body('condition').notEmpty().withMessage('condition is required'),
	body('location').notEmpty().withMessage('location is required')
];

function handleValidation(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
	next();
}

router.post("/", upload.single('photo'), validateReport, handleValidation, createReport);
router.get("/", getReports);
router.get("/:id", getReport);
router.patch("/:id/status", updateReportStatus);

module.exports = router;