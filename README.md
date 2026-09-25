# StreamVault - YouTube Video & Audio Downloader

A modern, production-ready web application that enables users to inspect media metadata and download audio, video, and thumbnails with real-time conversion and progress feedback. Built with a sleek dark SaaS interface and secure, modular architecture.

---

## Features

- **YouTube URL Analysis**: Supports standard watch URLs (`https://www.youtube.com/watch?v=...`), short URLs (`https://youtu.be/...`), and Shorts (`https://www.youtube.com/shorts/...`).
- **Verified Quality Options**:
  - `Original`
  - `1080p`
  - `720p`
  - `480p`
  - `360p`
  - Only displays and enables resolutions provided by the source media. Non-existent resolutions are clearly marked **`Unavailable`** and disabled.
- **Multiple Output Formats**:
  - **Video**: `MP4` (universal H.264/AAC compatibility), `WEBM` (modern VP9/Opus compression)
  - **Audio**: `MP3` (transcoded with FFmpeg `libmp3lame` @ 320 kbps), `WAV` (lossless linear PCM)
  - **Thumbnail**: `JPG` (maximum resolution cover image)
- **Live Progress Feedback**: Dynamic state tracking (`Idle` → `Analyzing` → `Preparing...` → `Processing 37%` → `Download Ready` → `Completed`).
- **Enterprise Security**:
  - Strict server-side URL and 11-char ID validation.
  - SSRF protection: Strict hostname whitelist, loopback/private IP blocking.
  - Rate limiting via `express-rate-limit`.
  - HTTP security headers with `helmet` and CORS protection.
  - Automatic temporary file cleanup and background garbage sweep.
  - No permanent media storage or DRM circumvention.

---

## Tech Stack

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS** (Dark SaaS dashboard theme with glassmorphism)
- **Lucide React** (Icons)
- **Axios** (API communication)

### Backend
- **Node.js** + **Express.js** (ES Modules)
- **yt-dlp** (Python 3) for media metadata extraction and stream retrieval
- **FFmpeg** for video remuxing and audio transcoding
- **Helmet**, **CORS**, **express-rate-limit**, **uuid**

---

## Directory Architecture

```text
dynamictitle/
├── client/                      # Frontend Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx             # Brand navigation & engine status
│   │   │   ├── Hero.jsx               # Hero banner, input bar & Analyze button
│   │   │   ├── MediaCard.jsx          # Thumbnail, title, duration & metadata
│   │   │   ├── DownloadConfig.jsx     # Quality & Format selector with Unavailable badges
│   │   │   ├── DownloadProgressBar.jsx# Live progress tracker & Download trigger
│   │   │   ├── SupportedFormats.jsx   # Format feature cards
│   │   │   ├── HowItWorks.jsx         # 3-step visual workflow
│   │   │   ├── FAQ.jsx                # Accordion FAQ
│   │   │   ├── LegalNotice.jsx        # Terms and compliance banner
│   │   │   └── Footer.jsx             # SaaS footer
│   │   ├── hooks/
│   │   │   └── useMediaDownloader.js  # State machine & polling hook
│   │   ├── services/
│   │   │   └── api.js                 # Axios API client
│   │   ├── utils/
│   │   │   └── formatters.js          # Duration & file size formatters
│   │   ├── App.jsx
│   │   ├── index.css                  # Tailwind styles and glass tokens
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                      # Backend API Service
│   ├── config/
│   │   └── index.js             # Environment variables & constants
│   ├── controllers/
│   │   └── mediaController.js   # API controllers (analyze, download, progress, stream)
│   ├── middleware/
│   │   ├── errorHandler.js      # Centralized error handler
│   │   └── rateLimiter.js       # Express rate limiters
│   ├── routes/
│   │   └── mediaRoutes.js       # Route registrations
│   ├── services/
│   │   ├── mediaService.js      # Job orchestrator
│   │   ├── mediaProcessor.js    # FFmpeg / yt-dlp transcoding pipeline
│   │   └── ytDlpProvider.js     # Media metadata and format extractor
│   ├── utils/
│   │   ├── logger.js            # Structured logger
│   │   └── tempFileManager.js   # Isolated temp folders & auto-cleanup
│   ├── validators/
│   │   └── urlValidator.js      # Server-side YouTube & SSRF validator
│   ├── test/                    # Unit and integration test suites
│   ├── package.json
│   └── server.js                # Express app entry
├── .env.example
├── package.json
└── README.md
```

---

## Installation & Setup

### Prerequisites
1. **Node.js** (v18 or higher) & **npm**
2. **Python 3** with `yt-dlp`:
   ```bash
   pip install yt-dlp
   ```
3. **FFmpeg** installed and accessible in system `PATH`:
   ```bash
   ffmpeg -version
   ```

### 1. Install Dependencies

In the backend:
```bash
cd server
npm install
```

In the frontend:
```bash
cd client
npm install
```

### 2. Configure Environment

Copy `.env.example` to `server/.env`:
```bash
cp .env.example server/.env
```

Environment variables:
| Variable | Default | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Express server port |
| `NODE_ENV` | `development` | Environment mode (`development`, `production`, `test`) |
| `FRONTEND_URL` | `http://localhost:5173` | Allowed frontend origin for CORS |
| `TEMP_DIRECTORY` | System Temp | Working directory for media files |
| `MAX_FILE_SIZE` | `500` | Maximum file size in MB |
| `PYTHON_PATH` | `python` | Python executable containing `yt-dlp` |
| `RATE_LIMIT_MAX` | `100` | Max requests per IP per 15 minutes |

---

## Running the Application

### Development Mode

Run backend server:
```bash
cd server
npm run dev
```

Run Vite frontend in another terminal:
```bash
cd client
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

Build the React frontend:
```bash
cd client
npm run build
```
The optimized bundle will be compiled to `client/dist`.

Start the backend:
```bash
cd server
npm start
```

---

## API Endpoints

### 1. Health Check
- **`GET /api/media/health`**
- Returns engine status and service health.

### 2. Analyze Media
- **`POST /api/media/analyze`**
- **Body**:
  ```json
  {
    "url": "https://www.youtube.com/watch?v=jNQXAC9IVRw"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "media": {
      "id": "jNQXAC9IVRw",
      "title": "Me at the zoo",
      "channel": "jawed",
      "duration": 19,
      "formattedDuration": "0:19",
      "thumbnail": "https://i.ytimg.com/vi/jNQXAC9IVRw/maxresdefault.jpg",
      "canonicalUrl": "https://www.youtube.com/watch?v=jNQXAC9IVRw",
      "qualities": [
        { "key": "original", "label": "Original", "available": true, "badge": "240p" },
        { "key": "1080p", "label": "1080p", "available": false, "badge": "Unavailable" },
        { "key": "720p", "label": "720p", "available": false, "badge": "Unavailable" },
        { "key": "480p", "label": "480p", "available": false, "badge": "Unavailable" },
        { "key": "360p", "label": "360p", "available": false, "badge": "Unavailable" }
      ],
      "formats": {
        "video": [{ "key": "mp4", "label": "MP4" }, { "key": "webm", "label": "WEBM" }],
        "audio": [{ "key": "mp3", "label": "MP3" }, { "key": "wav", "label": "WAV" }],
        "thumbnail": [{ "key": "jpg", "label": "JPG" }]
      }
    }
  }
  ```

### 3. Initiate Download Job
- **`POST /api/media/download`**
- **Body**:
  ```json
  {
    "url": "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    "format": "mp3",
    "quality": "original"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "jobId": "086f4035-f29d-41ca-aece-ba890889d382",
    "status": "preparing",
    "message": "Preparing request..."
  }
  ```

### 4. Check Job Progress
- **`GET /api/media/progress/:jobId`**
- **Response**:
  ```json
  {
    "success": true,
    "job": {
      "id": "086f4035-f29d-41ca-aece-ba890889d382",
      "status": "processing",
      "percent": 37,
      "message": "Processing 37%",
      "isReady": false
    }
  }
  ```

### 5. Stream Downloaded File
- **`GET /api/media/file/:jobId`**
- Streams file as attachment with `Content-Disposition`.
- Automatic temp file removal 10 seconds post-stream.

---

## Security Model

1. **SSRF Prevention**: The backend strictly validates domain names and video IDs against an allowlist (`youtube.com`, `youtu.be`). It blocks intranet IP ranges (`127.0.0.1`, `10.0.0.0/8`, `192.168.0.0/16`, cloud metadata `169.254.169.254`) and arbitrary proxying.
2. **Abuse & Rate Limiting**: `express-rate-limit` enforces 30 analyze requests and 15 download jobs per 5 minutes per IP.
3. **No DRM Circumvention**: Content requiring authentication, membership, or DRM encryption is rejected with clear messages.
4. **Temporary Storage Isolation**: Each job writes to an isolated UUID folder. Files are purged immediately after client download and periodically via background garbage collection.
5. **No Information Leaks**: Stack traces, server file paths, and internal exceptions are sanitized before responding to users.

---

## Automated Tests

Run backend validator and integration tests:
```bash
cd server
npm test
node test/integration.test.js
```

Run live public video analyze and media conversion tests:
```bash
cd server
node test/analyze.test.js
node test/download.test.js
```
