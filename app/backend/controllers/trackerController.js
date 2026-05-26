const Sighting = require("../models/Sighting");
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'sightings.json');

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, '[]', 'utf8');
}

function readSightingsFromFile() {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

function writeSightingsToFile(arr) {
  ensureDataFile();
  fs.writeFileSync(dataFile, JSON.stringify(arr, null, 2), 'utf8');
}

exports.addSighting = async (req, res) => {
  try {
    if (Sighting && Sighting.create) {
      const sighting = await Sighting.create(req.body);
      return res.json(sighting);
    }
  } catch (err) {
    console.warn('Sighting.create failed, falling back to file:', err.message);
  }

  try {
    const arr = readSightingsFromFile();
    const record = Object.assign({}, req.body, { time: new Date().toISOString(), id: Date.now() });
    arr.unshift(record);
    writeSightingsToFile(arr);
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSightings = async (req, res) => {
  try {
    if (Sighting && Sighting.find) {
      const data = await Sighting.find().sort({ time: -1 });
      return res.json(data);
    }
  } catch (err) {
    console.warn('Sighting.find failed, falling back to file:', err.message);
  }

  try {
    const arr = readSightingsFromFile();
    res.json(arr);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};