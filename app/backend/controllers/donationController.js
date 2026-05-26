const Razorpay = require('razorpay');
const Donation = require('../models/Donation');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'donations.json');

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, '[]', 'utf8');
}

function readDonationsFromFile() {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return [];
  }
}

function writeDonationsToFile(arr) {
  ensureDataFile();
  fs.writeFileSync(dataFile, JSON.stringify(arr, null, 2), 'utf8');
}

const hasRazorpayCredentials = Boolean(process.env.RZP_KEY_ID && process.env.RZP_KEY_SECRET);
let razorpay = null;
if (hasRazorpayCredentials) {
  try {
    razorpay = new Razorpay({ key_id: process.env.RZP_KEY_ID, key_secret: process.env.RZP_KEY_SECRET });
  } catch (e) {
    console.warn('Razorpay not initialized:', e && e.message);
  }
}

exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body || {};
    const rupees = Number(amount || 0);
    if (!rupees || isNaN(rupees) || rupees < 1) return res.status(400).json({ error: 'Invalid amount' });
    const paise = Math.round(rupees * 100);

    if (!razorpay) {
      const order = { id: 'local_' + Date.now(), amount: paise, currency: 'INR', receipt: 'rcpt_' + Date.now(), status: 'created' };
      return res.json({ order, keyId: process.env.RZP_KEY_ID || 'rzp_test_dummy', isTestMode: true });
    }

    const options = { amount: paise, currency: 'INR', receipt: 'rcpt_' + Date.now(), payment_capture: 1 };
    const order = await razorpay.orders.create(options);
    res.json({ order, keyId: process.env.RZP_KEY_ID, isTestMode: false });
  } catch (err) {
    console.error('createOrder error', err);
    res.status(500).json({ error: 'Could not create order' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, name, email, phone, ngo, amount, message } = req.body || {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) return res.status(400).json({ error: 'Missing payment fields' });
    const secret = process.env.RZP_KEY_SECRET;
    if (!secret) return res.status(500).json({ error: 'Server misconfigured: RZP_KEY_SECRET missing' });

    const expected = crypto.createHmac('sha256', secret).update(razorpay_order_id + '|' + razorpay_payment_id).digest('hex');
    if (expected !== razorpay_signature) return res.status(400).json({ error: 'Invalid signature' });

    const amountPaise = Number(amount) || null;
    const amountINR = amountPaise ? Math.round((amountPaise / 100) * 100) / 100 : null;

    let record = { name, email, phone, ngo, message: message || '', amount: amountINR, orderId: razorpay_order_id, paymentId: razorpay_payment_id, signature: razorpay_signature, status: 'paid', createdAt: new Date().toISOString() };

    try {
      if (Donation && Donation.create) {
        const saved = await Donation.create(record);
        record = saved;
      } else {
        const arr = readDonationsFromFile();
        arr.unshift(record);
        writeDonationsToFile(arr);
      }
    } catch (e) {
      const arr = readDonationsFromFile();
      arr.unshift(record);
      writeDonationsToFile(arr);
    }

    // enqueue receipt email if SMTP configured (non-blocking)
    try {
      const jobQueue = require('../utils/jobQueue');
      const mailOptions = {
        from: process.env.SMTP_FROM || (process.env.SMTP_USER || 'no-reply@example.com'),
        to: record.email || process.env.REPORT_NOTIFY_EMAIL || process.env.SMTP_USER,
        subject: `Thank you for your donation — ${record.ngo || 'ResQtail'}`,
        html: `<p>Dear ${record.name || 'Supporter'},</p>
               <p>Thank you for your generous donation of <strong>₹${record.amount || ''}</strong> to <strong>${record.ngo || 'ResQtail'}</strong>.</p>
               <p><strong>Order ID:</strong> ${record.orderId || ''}<br/><strong>Payment ID:</strong> ${record.paymentId || ''}</p>
               <p>If you have questions, reply to this email.</p>
               <p>— ResQtail Team</p>`
      };
      jobQueue.enqueue({ type: 'sendEmail', payload: { mailOptions } });
    } catch (e) { /* ignore */ }

    res.json({ success: true, donation: record });
  } catch (err) {
    console.error('verifyPayment error', err);
    res.status(500).json({ error: 'Verification failed' });
  }
};

async function sendDonationReceiptEmail(donation, req) {
  try {
    const smtpHost = process.env.SMTP_HOST;
    if (!smtpHost) return;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
    });

    const baseUrl = req ? `${req.protocol}://${req.get('host')}` : '';

    const mailOptions = {
      from: process.env.SMTP_FROM || (process.env.SMTP_USER || 'no-reply@example.com'),
      to: donation.email || process.env.REPORT_NOTIFY_EMAIL || process.env.SMTP_USER,
      subject: `Thank you for your donation — ${donation.ngo || 'ResQtail'}`,
      html: `<p>Dear ${donation.name || 'Supporter'},</p>
             <p>Thank you for your generous donation of <strong>₹${donation.amount || ''}</strong> to <strong>${donation.ngo || 'ResQtail'}</strong>.</p>
             <p><strong>Order ID:</strong> ${donation.orderId || ''}<br/><strong>Payment ID:</strong> ${donation.paymentId || ''}</p>
             <p>If you have questions, reply to this email.</p>
             <p>— ResQtail Team</p>`
    };

    await transporter.sendMail(mailOptions);
  } catch (e) {
    console.warn('Donation receipt email failed:', e && e.message ? e.message : e);
  }
}

exports.webhookHandler = async (req, res) => {
  try {
    const secret = process.env.RZP_KEY_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    if (!signature || !secret) return res.status(400).send('Missing signature or secret');

    const raw = req.rawBody ? req.rawBody.toString() : JSON.stringify(req.body || {});
    const expected = crypto.createHmac('sha256', secret).update(raw).digest('hex');
    if (expected !== signature) return res.status(400).send('Invalid signature');

    const event = JSON.parse(raw);
    const evName = event && event.event;

    // handle payment captured or order paid
    if (evName === 'payment.captured' || evName === 'order.paid') {
      const payload = event.payload || {};
      const payment = payload.payment && payload.payment.entity ? payload.payment.entity : null;
      const order = payload.order && payload.order.entity ? payload.order.entity : null;

      const orderId = (order && order.id) || (payment && payment.order_id) || null;
      const paymentId = payment && payment.id ? payment.id : null;
      const amount = payment && payment.amount ? payment.amount : (order && order.amount ? order.amount : null);

      let record = { orderId, paymentId, amount: amount ? Math.round(amount / 100) : null, status: 'paid', createdAt: new Date().toISOString() };
      try {
        if (Donation && Donation.findOneAndUpdate) {
          const updated = await Donation.findOneAndUpdate({ orderId: orderId }, { $set: { paymentId: paymentId, status: 'paid', amount: record.amount } }, { new: true, upsert: true });
          record = updated;
        }
      } catch (e) {
        try {
          const arr = readDonationsFromFile();
          arr.unshift(record);
          writeDonationsToFile(arr);
        } catch (err) { /* ignore */ }
      }

      // Send receipt if possible
      sendDonationReceiptEmail(record, req).catch(() => {});
    }

    res.status(200).send('ok');
  } catch (e) {
    console.error('webhookHandler error', e && e.message ? e.message : e);
    res.status(500).send('webhook error');
  }
};
