const express = require("express");
const router = express.Router();
const { addSighting, getSightings } = require("../controllers/trackerController");

router.post("/", addSighting);
router.get("/", getSightings);

module.exports = router;