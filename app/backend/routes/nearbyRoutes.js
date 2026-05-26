const express = require('express');
const router = express.Router();
const { getNearby, reverseGeocode } = require('../controllers/nearbyController');

router.get('/', getNearby);
router.get('/geocode', reverseGeocode);

module.exports = router;
