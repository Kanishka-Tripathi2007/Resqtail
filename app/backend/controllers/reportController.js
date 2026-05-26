const Report = require("../models/Report");
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
let sharp;
try { sharp = require('sharp'); } catch (e) { sharp = null; }

const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'reports.json');
const uploadsDir = path.join(__dirname, '..', 'uploads', 'reports');

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, '[]', 'utf8');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
}

function readReportsFromFile() {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

function writeReportsToFile(arr) {
  ensureDataFile();
  fs.writeFileSync(dataFile, JSON.stringify(arr, null, 2), 'utf8');
}

function buildEmailHtml(report, baseUrl) {
  const rawPhotoUrl = report.photoUrl || report.photo;
  const photoUrl = rawPhotoUrl
    ? (String(rawPhotoUrl).startsWith('http') ? rawPhotoUrl : `${baseUrl}${rawPhotoUrl}`)
    : null;
  const lat = report.latitude || (report.location && report.location.lat);
  const lon = report.longitude || (report.location && report.location.lon);
  const locationText = typeof report.location === 'object'
    ? `${report.location.lat}, ${report.location.lon} (accuracy: ${report.location.accuracy || 'unknown'}m)`
    : (report.location || report.address || 'N/A');
  return `<p><strong>Animal:</strong> ${report.animalType || report.animal || 'N/A'}</p>
         <p><strong>Condition:</strong> ${report.condition || 'N/A'}</p>
         <p><strong>Address:</strong> ${report.address || 'N/A'}</p>
         <p><strong>Location:</strong> ${locationText}</p>
         ${lat !== undefined && lat !== null && lon !== undefined && lon !== null ? `<p><strong>GPS:</strong> <a href="https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=17/${lat}/${lon}" target="_blank">${lat}, ${lon}</a></p>` : ''}
         <p><strong>Contact:</strong> ${report.phone || 'N/A'}</p>
         <p><strong>Description:</strong><br/>${(report.description || '').replace(/\n/g,'<br/>')}</p>
         ${photoUrl ? `<p><strong>Photo:</strong> <a href="${photoUrl}" target="_blank">View image</a></p>` : ''}
         <p>Received at: ${new Date(report.createdAt || Date.now()).toLocaleString()}</p>`;
}

exports.createReport = async (req, res) => {
  try {
    ensureDataFile();
    const {
      animal,
      animalType,
      condition,
      location,
      address,
      description,
      phone,
      latitude,
      longitude,
      accuracy,
      reporterName,
      reporterEmail,
      createdAt
    } = req.body || {};
    let photoPath = null;
    if (req.file) {
      if (req.file.path && req.file.path.startsWith('http')) {
        // Cloudinary upload — path is already a full CDN URL
        photoPath = req.file.path;
      } else if (req.file.filename) {
        // Local disk upload — store relative path
        photoPath = '/uploads/reports/' + req.file.filename;
        // try to resize image to save space (only for local files)
        try {
          if (sharp && req.file.path) {
            const tmp = req.file.path + '.resized';
            await sharp(req.file.path).resize({ width: 1200, withoutEnlargement: true }).toFile(tmp);
            fs.renameSync(tmp, req.file.path);
            const thumb = req.file.path.replace(path.extname(req.file.path), '') + '-thumb' + path.extname(req.file.path);
            await sharp(req.file.path).resize(400, 400, { fit: 'cover' }).toFile(thumb);
          }
        } catch (e) { console.warn('report image resize failed', e && e.message ? e.message : e); }
      }
    }

    const latNumber = parseFloat(latitude);
    const lngNumber = parseFloat(longitude);
    const accuracyNumber = parseFloat(accuracy);
    const lat = Number.isFinite(latNumber) ? latNumber : null;
    const lng = Number.isFinite(lngNumber) ? lngNumber : null;
    const accuracyMeters = Number.isFinite(accuracyNumber) ? accuracyNumber : null;
    const normalizedAnimalType = animalType || animal;
    const normalizedAddress = address || location || '';
    const structuredLocation = lat !== null && lng !== null
      ? { lat, lon: lng, accuracy: accuracyMeters }
      : (location || normalizedAddress);

    const payload = {
      animal: normalizedAnimalType,
      animalType: normalizedAnimalType,
      condition,
      location: structuredLocation,
      address: normalizedAddress,
      description,
      phone,
      photo: photoPath,
      photoUrl: photoPath,
      latitude: lat,
      longitude: lng,
      accuracy: accuracyMeters,
      reporterName: reporterName || '',
      reporterEmail: reporterEmail || '',
      status: 'pending',
      statusHistory: [{ status: 'pending', note: 'Report submitted', updatedAt: new Date() }]
    };
    if (createdAt) payload.createdAt = new Date(createdAt);

    // Try DB first
    let savedReport = null;
    try {
      if (Report && Report.create) {
        savedReport = await Report.create(payload);
      }
    } catch (err) {
      console.warn('Report.create failed, falling back to file:', err && err.message ? err.message : err);
    }

    if (!savedReport) {
      // Fallback to file storage
      const arr = readReportsFromFile();
      savedReport = Object.assign({}, payload, { createdAt: new Date().toISOString(), id: Date.now() });
      arr.unshift(savedReport);
      writeReportsToFile(arr);
    }

    // Enqueue notification email (non-blocking)
    try {
      const jobQueue = require('../utils/jobQueue');
      const baseUrl = req ? `${req.protocol}://${req.get('host')}` : '';
      const mailOptions = {
        from: process.env.SMTP_FROM || (process.env.SMTP_USER || 'no-reply@example.com'),
        to: process.env.REPORT_NOTIFY_EMAIL || process.env.SMTP_USER,
        subject: `🚨 New Animal Report: ${savedReport.animal} (${savedReport.condition})`,
        html: buildEmailHtml(savedReport, baseUrl)
      };
      jobQueue.enqueue({ type: 'sendEmail', payload: { mailOptions } });
    } catch (e) { /* ignore queue errors */ }

    res.json(savedReport);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReports = async (req, res) => {
  try {
    if (Report && Report.find) {
      const reports = await Report.find().sort({ createdAt: -1 });
      return res.json(reports);
    }
  } catch (err) {
    console.warn('Report.find failed, falling back to file:', err && err.message ? err.message : err);
  }

  try {
    const arr = readReportsFromFile();
    res.json(arr);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single report by ID
exports.getReport = async (req, res) => {
  try {
    const { id } = req.params;
    if (Report && Report.findById) {
      const report = await Report.findById(id);
      if (report) return res.json(report);
    }
    // Fallback: search file
    const arr = readReportsFromFile();
    const found = arr.find(r => String(r.id) === id || String(r._id) === id);
    if (found) return res.json(found);
    res.status(404).json({ error: 'Report not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update report status (admin)
exports.updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body || {};
    const validStatuses = ['pending', 'acknowledged', 'in_progress', 'resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') });
    }

    if (Report && Report.findById) {
      const report = await Report.findById(id);
      if (report) {
        report.status = status;
        report.statusHistory.push({ status, note: note || '', updatedAt: new Date() });
        await report.save();
        return res.json(report);
      }
    }

    // Fallback: update in file
    const arr = readReportsFromFile();
    const idx = arr.findIndex(r => String(r.id) === id || String(r._id) === id);
    if (idx === -1) return res.status(404).json({ error: 'Report not found' });
    arr[idx].status = status;
    if (!arr[idx].statusHistory) arr[idx].statusHistory = [];
    arr[idx].statusHistory.push({ status, note: note || '', updatedAt: new Date().toISOString() });
    writeReportsToFile(arr);
    res.json(arr[idx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
