# 🐾 ResQtail — Every Life Matters

An emergency animal rescue platform that connects users with nearby vets, NGOs, clinics, rescuers, and adoption centers across India.

## Features

- **🆘 Emergency SOS** — One-tap emergency with auto GPS detection, helpline calls, WhatsApp share
- **🏥 Nearby Help** — Real-time search for vets, shelters, NGOs using OpenStreetMap Overpass API with GPS
- **🤖 ResQBot AI** — AI chatbot powered by OpenAI for animal care advice, first aid, and rescue tips
- **💳 Donations** — Razorpay integration for secure payments with receipt emails
- **📢 Report System** — Report injured animals with photo upload, GPS tracking, and status workflow
- **❤️ Adoption Marketplace** — List and browse animals with filters (species, location), inquiry system
- **🩹 First Aid Guide** — Step-by-step emergency guides for common injuries
- **🍖 Feeding Guide** — Season-specific feeding advice for dogs, cats, cows, birds, monkeys

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js + Express |
| Database | MongoDB (with JSON file fallback) |
| AI | OpenAI GPT API |
| Payments | Razorpay |
| Email | Nodemailer (SMTP) |
| Geo | OpenStreetMap Overpass API + Browser Geolocation |
| Security | Helmet, rate limiting, mongo-sanitize, XSS-clean, express-validator |

## Quick Start

### Prerequisites
- Node.js 16+
- Optional: MongoDB (app uses JSON fallback if unavailable)

### Setup

```bash
cd app/backend
copy .env.example .env   # Edit .env with your real API keys
npm install
npm start
```

Open **http://localhost:5000** in your browser.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | For chatbot | OpenAI API key for ResQBot |
| `OPENAI_MODEL` | No | Model override (default: gpt-3.5-turbo) |
| `MONGO_URI` | No | MongoDB connection string (default: localhost) |
| `RZP_KEY_ID` | For donations | Razorpay key ID |
| `RZP_KEY_SECRET` | For donations | Razorpay key secret |
| `SMTP_HOST` | For emails | SMTP server host |
| `SMTP_PORT` | For emails | SMTP port (default: 587) |
| `SMTP_USER` | For emails | SMTP username |
| `SMTP_PASS` | For emails | SMTP password |
| `SMTP_FROM` | For emails | From email address |
| `REPORT_NOTIFY_EMAIL` | For emails | Admin email for report notifications |
| `PORT` | No | Server port (default: 5000) |

See [`backend/.env.example`](backend/.env.example) for the full template.

## API Endpoints

### Reports
- `POST /api/reports` — Create report (multipart: photo, animal, condition, location, lat, lng)
- `GET /api/reports` — List all reports
- `GET /api/reports/:id` — Get single report
- `PATCH /api/reports/:id/status` — Update report status (pending → acknowledged → in_progress → resolved)

### Nearby
- `GET /api/nearby?lat=...&lng=...&radius=10000` — Search nearby vets/shelters via Overpass API

### Chat
- `POST /api/chat` — Send message to ResQBot AI (`{ message, conversationId }`)

### Donations
- `POST /api/donations/create-order` — Create Razorpay order
- `POST /api/donations/verify` — Verify payment signature
- `POST /api/donations/webhook` — Razorpay webhook handler

### Listings (Adoption)
- `POST /api/listings` — Create adoption listing (multipart with photos)
- `GET /api/listings?species=Dog&location=Jaipur` — List/filter listings
- `GET /api/listings/:id` — Get single listing
- `POST /api/listings/inquiry` — Submit adoption inquiry

### Tracker
- `POST /api/tracker` — Add animal sighting
- `GET /api/tracker` — List sightings

## Project Structure

```
app/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── controllers/          # Business logic
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express routes
│   ├── utils/jobQueue.js     # Email job queue
│   ├── data/                 # JSON fallback storage
│   ├── uploads/              # Uploaded images
│   ├── server.js             # Entry point
│   └── .env.example
├── frontend/
│   ├── index.html            # Single-page app
│   ├── app.js                # Frontend logic
│   └── styles.css            # Styles
└── README.md
```

## Notes

- If MongoDB is unreachable, the app gracefully falls back to JSON files in `backend/data/`
- The nearby search uses the free OpenStreetMap Overpass API (no API key needed)
- For donations, use Razorpay test keys in development
- All animal helpline numbers are publicly available Indian numbers
- Run `npm audit fix` after install to address any dependency vulnerabilities

---

Built with ❤️ for India's street animals.
