const nodemailer = require('nodemailer');

const queue = [];
let running = false;
const MAX_ATTEMPTS = 3;

function getTransporter() {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
  });
}

async function processQueue() {
  if (running) return;
  running = true;
  while (queue.length) {
    const job = queue.shift();
    try {
      if (job.type === 'sendEmail') {
        const transporter = getTransporter();
        if (!transporter) {
          console.warn('SMTP not configured, dropping email job');
          continue; // drop job
        }
        await transporter.sendMail(job.payload.mailOptions);
      } else {
        // unknown job type
        console.warn('Unknown job type', job.type);
      }
    } catch (err) {
      job.attempts = (job.attempts || 0) + 1;
      if (job.attempts < MAX_ATTEMPTS) {
        // requeue with backoff
        const delay = 1000 * Math.pow(2, job.attempts);
        setTimeout(() => queue.push(job) && processQueue(), delay);
      } else {
        console.warn('Job failed after retries', err && err.message ? err.message : err);
      }
    }
  }
  running = false;
}

function enqueue(job) {
  queue.push(job);
  processQueue().catch(e => console.warn('processQueue error', e && e.message ? e.message : e));
}

module.exports = { enqueue };
