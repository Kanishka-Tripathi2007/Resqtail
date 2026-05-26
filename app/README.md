# 🐾 ResQtail — Every Life Matters

ResQtail is a street-animal rescue web application for finding nearby help, reporting injured animals, supporting adoption, accepting donations, and providing immediate animal-care guidance. The main application is an Express server exposing REST APIs and serving a single-page HTML/CSS/JavaScript frontend.

## ✨ Features

- 📞 Emergency SOS: helpline calls, location sharing, and WhatsApp sharing.
- 🗺️ Live nearby-help discovery for veterinary clinics, shelters, NGOs, and animal hospitals.
- 📍 Browser geolocation, reverse geocoding, and a Leaflet/OpenStreetMap rescue map.
- 🩺 Injury report submission with GPS details, optional photo, and status tracking.
- 🐶 Rescue & adoption listings with photo upload, filtering, and inquiry support.
- 💳 Razorpay donation checkout and payment verification (when configured).
- 🤖 ResQBot chat assistant with OpenAI/OpenRouter support and built-in fallback guidance.
- 📚 Built-in first-aid, rescue, feeding, donation, and volunteering information.
- 🗄️ MongoDB support with JSON-file fallback for core records.

## 🛠️ Tech Stack

| Area | Technology |
| --- | --- |
| 🌐 Frontend | HTML, CSS, vanilla JavaScript, ES modules, Leaflet |
| ⚙️ Server | Node.js, Express |
| 🗄️ Database | MongoDB with Mongoose; JSON file fallback |
| 🗺️ Location search | OpenStreetMap, Overpass API, Nominatim |
| 📤 Uploads | Multer, Sharp, optional Cloudinary storage |
| 🤖 Chat | OpenAI or OpenRouter API; local fallback responses |
| 💳 Payments | Razorpay |
| ✉️ Email | Nodemailer over SMTP |
| 🔒 Security | Helmet, CORS, request rate limiting, Mongo sanitize, XSS clean, validation |

## 🗂️ Project Layout

```text
app/
|-- backend/
|   |-- config/                 # MongoDB and Cloudinary configuration
|   |-- controllers/            # API behavior
|   |-- data/                   # JSON fallback storage
|   |-- models/                 # Mongoose schemas
|   |-- routes/                 # Express API routes
|   |-- scripts/smokeTest.js    # Manual API smoke test
|   |-- src/dataconnect-generated/
|   |-- resqtail-location/      # Separate Vite/React scaffold, not served by the main app
|   |-- utils/jobQueue.js       # In-memory email job processing
|   |-- .env.example
|   |-- package.json
|   `-- server.js               # Main application entry point
|-- frontend/
|   |-- src/                    # Map, geocoding, report modules and services
|   |-- vendor/leaflet/         # Locally served Leaflet assets
|   |-- app.js
|   |-- nearby.js
|   |-- styles.css
|   `-- index.html
`-- README.md
```

## 🚀 Getting Started

### 🔧 Requirements

- Node.js 18 or newer
- npm
- Internet access for map tiles and live nearby-place lookup
- Optional: MongoDB and credentials for third-party integrations

### ▶️ Run the Main Application

From this `app` directory in PowerShell:

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm start
```

For Bash-compatible shells, replace `Copy-Item .env.example .env` with:

```bash
cp .env.example .env
```

Then open:

```text
http://localhost:5000
```

Location features require browser permission. They work on `localhost` in supported browsers.

### ⚙️ Running Without External Services

The application can start without API credentials:

- If MongoDB is unavailable, reports, listings, sightings, and completed donation records fall back to JSON files under `backend/data/`.
- If `OPENAI_API_KEY` is not set, ResQBot returns built-in animal-care guidance.
- If Cloudinary is not configured, uploaded report and listing images are stored locally under `backend/uploads/`.
- SMTP is optional; notification and receipt emails are skipped when it is not configured.

Real online payments require valid Razorpay credentials. Live nearby search and map services require internet access.

## ⚙️ Configuration

Create `backend/.env` from [`backend/.env.example`](backend/.env.example). Do not commit real credentials.

| Variable | Purpose | Required |
| --- | --- | --- |
| `PORT` | Express port; defaults to `5000` | No |
| `MONGO_URI` | Local MongoDB or MongoDB Atlas connection string | No |
| `OPENAI_API_KEY` | Enables API-backed ResQBot; an OpenRouter `sk-or-...` key is also supported | No |
| `OPENAI_MODEL` | Chat model name; defaults to `gpt-3.5-turbo` | No |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud for image storage | For Cloudinary |
| `CLOUDINARY_API_KEY` | Cloudinary API key | For Cloudinary |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | For Cloudinary |
| `RZP_KEY_ID` | Razorpay checkout key ID | For payments |
| `RZP_KEY_SECRET` | Razorpay verification/webhook secret | For payments |
| `SMTP_HOST` | SMTP host for report and donation emails | For email |
| `SMTP_PORT` | SMTP port; defaults to `587` | No |
| `SMTP_USER` | SMTP user | For authenticated email |
| `SMTP_PASS` | SMTP password/key | For authenticated email |
| `SMTP_SECURE` | Set to `true` for secure SMTP transport | No |
| `SMTP_FROM` | Sender address for outgoing emails | No |
| `REPORT_NOTIFY_EMAIL` | Recipient for reports and adoption inquiries | For notifications |
| `ALLOWED_ORIGINS` | Comma-separated CORS allowlist; allows all origins when blank | No |
| `RATE_LIMIT_WINDOW_MS` | General API rate-limit window; defaults to `900000` | No |
| `RATE_LIMIT_MAX` | General API request limit; defaults to `200` | No |
| `RATE_LIMIT_CHAT_WINDOW_MS` | Chat rate-limit window; defaults to `60000` | No |
| `RATE_LIMIT_CHAT_MAX` | Chat request limit; defaults to `10` | No |

## API Reference

All API routes are served from the same Express server as the frontend.

### Reports

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/reports` | Create an injury report as `multipart/form-data`; required fields are `animal`, `condition`, and `location`; optional photo field is `photo` |
| `GET` | `/api/reports` | List reports, newest first |
| `GET` | `/api/reports/:id` | Get one report |
| `PATCH` | `/api/reports/:id/status` | Update status with `{ "status": "...", "note": "..." }` |

Valid report statuses are `pending`, `acknowledged`, `in_progress`, and `resolved`. A report photo is limited to 5 MB and must be an image.

### Nearby Help

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/nearby?lat=...&lng=...&radius=5000&type=all` | Search nearby animal help through Overpass |
| `GET` | `/api/nearby/geocode?lat=...&lng=...` | Reverse geocode a GPS position through Nominatim |

Supported `type` values are `all`, `vets`, `shelters`, `ngos`, and `clinics`. The nearby route supports `force=true` to bypass its five-minute cache and `fallback=nominatim` to attempt a Nominatim search if Overpass finds no places.

### Adoption Listings

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/listings` | Create a listing as `multipart/form-data`; `name` is required and `photos` accepts up to six images |
| `GET` | `/api/listings?species=Dog&location=Jaipur&status=available` | List and filter adoption entries |
| `GET` | `/api/listings/:id` | Get one listing |
| `POST` | `/api/listings/inquiry` | Submit an inquiry; `listingId`, `name`, and a valid `email` are required |

Each listing image is limited to 5 MB.

### Donations

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/donations/create-order` | Create a Razorpay order; body includes a positive `amount` in rupees |
| `POST` | `/api/donations/verify` | Verify a completed checkout signature and save the donation |
| `POST` | `/api/donations/webhook` | Receive Razorpay webhook events signed with `x-razorpay-signature` |

### ResQBot

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/chat` | Send `{ "message": "...", "conversationId": "optional" }` and receive a chat reply |

The response includes a `mode` of `openai`, `local`, or `fallback`, indicating whether the API or built-in guidance generated the reply.

### Tracker

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/tracker` | Add an animal sighting |
| `GET` | `/api/tracker` | List sightings |

## Storage and Integrations

- MongoDB is attempted on startup; when a database operation fails, supported controllers store records in JSON files under `backend/data/`.
- Report and listing uploads use Cloudinary only when all three Cloudinary credentials are provided; otherwise they use local upload directories.
- Uploaded local files are served at `/uploads/...`, and Sharp generates resized images or thumbnails where applicable.
- Report notifications, adoption inquiries, and donation receipts are queued in memory and sent through SMTP when configured.
- Nearby-place responses are cached in memory for five minutes to reduce calls to public OpenStreetMap services.

## Manual Smoke Test

With the application already running on port `5000`, open another terminal:

```powershell
cd backend
node scripts/smokeTest.js
```

The smoke script creates sample listing, report, and donation-order requests, then retrieves listings and reports. It writes sample records when file fallback storage is active.

