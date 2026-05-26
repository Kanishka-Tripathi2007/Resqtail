const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const { createListing, getListings, getListing, submitInquiry } = require('../controllers/listingController');
const { isCloudinaryConfigured, createCloudinaryStorage } = require('../config/cloudinary');

// Use Cloudinary when configured, otherwise fall back to local disk
let storage;
if (isCloudinaryConfigured()) {
  storage = createCloudinaryStorage('resqtail/listings');
} else {
  const uploadDir = path.join(__dirname, '..', 'uploads', 'listings');
  storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, uploadDir); },
    filename: function (req, file, cb) { cb(null, Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,8) + path.extname(file.originalname)); }
  });
}

function fileFilter(req, file, cb) {
  if (!file.mimetype.startsWith('image/')) return cb(null, false);
  cb(null, true);
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

const validateInquiry = [
  body('listingId').notEmpty().withMessage('listingId is required'),
  body('name').notEmpty().withMessage('name is required'),
  body('email').isEmail().withMessage('valid email is required')
];

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}

router.post('/', upload.array('photos', 6), createListing);
router.get('/', getListings);
router.get('/:id', getListing);
router.post('/inquiry', validateInquiry, handleValidation, submitInquiry);

module.exports = router;
