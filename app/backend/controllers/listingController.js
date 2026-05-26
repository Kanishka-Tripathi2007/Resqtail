const Listing = require('../models/Listing');
const fs = require('fs');
const path = require('path');
let sharp;
try { sharp = require('sharp'); } catch (e) { sharp = null; }

const uploadsDir = path.join(__dirname, '..', 'uploads', 'listings');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'listings.json');

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, '[]', 'utf8');
}

function readListingsFromFile() {
  try { ensureDataFile(); return JSON.parse(fs.readFileSync(dataFile, 'utf8') || '[]'); }
  catch (e) { return []; }
}

function writeListingsToFile(arr) {
  ensureDataFile();
  fs.writeFileSync(dataFile, JSON.stringify(arr, null, 2), 'utf8');
}

exports.createListing = async (req, res) => {
  try {
    const { name, type, breed, age, sex, shelter, description, contact, vaccination, location, listerType } = req.body || {};
    if (!name || !name.trim()) return res.status(400).json({ error: 'Pet name is required' });

    const photos = [];
    if (req.files && req.files.length) {
      for (const f of req.files) {
        if (f.path && f.path.startsWith('http')) {
          // Cloudinary upload — path is already a full CDN URL
          photos.push(f.path);
        } else if (f.filename) {
          // Local disk upload — store relative path
          const rel = '/uploads/listings/' + f.filename;
          photos.push(rel);
          // Resize image to reasonable max width to save space (only for local files)
          try {
            if (sharp && f.path) {
              const tmp = f.path + '.resized';
              await sharp(f.path).resize({ width: 1200, withoutEnlargement: true }).toFile(tmp);
              fs.renameSync(tmp, f.path);
              // create thumbnail
              const thumbPath = f.path.replace(path.extname(f.path), '') + '-thumb' + path.extname(f.path);
              await sharp(f.path).resize(400, 400, { fit: 'cover' }).toFile(thumbPath);
            }
          } catch (e) {
            // if resizing fails, continue with original file
            console.warn('Image resize failed', e && e.message ? e.message : e);
          }
        }
      }
    }

    const payload = { name, type, breed, age, sex, shelter, description, contact, photos, vaccination, location, listerType };

    // Try MongoDB first
    try {
      if (Listing && Listing.create) {
        const saved = await Listing.create(payload);
        return res.json(saved);
      }
    } catch (dbErr) {
      console.warn('Listing.create failed, falling back to file:', dbErr && dbErr.message ? dbErr.message : dbErr);
    }

    // Fallback to file storage
    const arr = readListingsFromFile();
    const record = Object.assign({}, payload, { createdAt: new Date().toISOString(), id: Date.now(), status: 'available' });
    arr.unshift(record);
    writeListingsToFile(arr);
    res.json(record);
  } catch (err) {
    console.error('createListing error', err);
    res.status(500).json({ error: 'Could not create listing' });
  }
};

exports.getListings = async (req, res) => {
  try {
    const { species, location: loc, status } = req.query || {};
    let listings = [];

    // Try MongoDB first
    let usedDb = false;
    try {
      if (Listing && Listing.find) {
        const query = {};
        if (species) query.type = new RegExp(species, 'i');
        if (loc) query.location = new RegExp(loc, 'i');
        if (status) query.status = status;
        listings = await Listing.find(query).sort({ createdAt: -1 });
        usedDb = true;
      }
    } catch (err) {
      console.warn('Listing.find failed, falling back to file:', err && err.message ? err.message : err);
    }

    if (!usedDb) {
      listings = readListingsFromFile();
      // Apply filters in-memory
      if (species) listings = listings.filter(l => l.type && l.type.toLowerCase().includes(species.toLowerCase()));
      if (loc) listings = listings.filter(l => l.location && l.location.toLowerCase().includes(loc.toLowerCase()));
      if (status) listings = listings.filter(l => l.status === status);
    }

    res.json(listings);
  } catch (err) {
    console.error('getListings error', err);
    res.status(500).json({ error: 'Could not fetch listings' });
  }
};

// Get single listing
exports.getListing = async (req, res) => {
  try {
    const { id } = req.params;
    if (Listing && Listing.findById) {
      try {
        const listing = await Listing.findById(id);
        if (listing) return res.json(listing);
      } catch (e) { /* fall through */ }
    }
    const arr = readListingsFromFile();
    const found = arr.find(l => String(l.id) === id || String(l._id) === id);
    if (found) return res.json(found);
    res.status(404).json({ error: 'Listing not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Submit adoption inquiry
exports.submitInquiry = async (req, res) => {
  try {
    const { listingId, name, email, phone, message } = req.body || {};
    if (!listingId || !name || !email) return res.status(400).json({ error: 'Name and email are required' });

    // Try to send email notification to listing owner
    try {
      const jobQueue = require('../utils/jobQueue');
      const mailOptions = {
        from: process.env.SMTP_FROM || (process.env.SMTP_USER || 'no-reply@example.com'),
        to: process.env.REPORT_NOTIFY_EMAIL || process.env.SMTP_USER,
        subject: `🐾 Adoption Inquiry for listing ${listingId}`,
        html: `<p><strong>Adoption Inquiry</strong></p>
               <p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Phone:</strong> ${phone || '—'}</p>
               <p><strong>Message:</strong></p>
               <p>${(message || '').replace(/\n/g, '<br/>')}</p>
               <p><strong>Listing ID:</strong> ${listingId}</p>`
      };
      jobQueue.enqueue({ type: 'sendEmail', payload: { mailOptions } });
    } catch (e) { /* ignore */ }

    res.json({ success: true, message: 'Inquiry submitted successfully. The shelter/owner will be notified.' });
  } catch (err) {
    res.status(500).json({ error: 'Could not submit inquiry' });
  }
};
