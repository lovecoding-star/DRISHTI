# DRISHTI — Exam Integrity Intelligence Platform

DRISHTI is a demo-ready AI-powered exam integrity platform built with a single FastAPI backend and a React frontend.

## Structure

- `backend/` — FastAPI application, data generation, threat simulation, Gemini fallback logic, alert storage
- `frontend/` — Vite + React interface with executive dashboard, watchdog panel, anomaly table, and forensic report flow
- `data/` — empty data folder for future datasets
- `run.bat` — starts the backend on `http://localhost:8000` and frontend on `http://localhost:5173`

## Setup

1. Open a terminal in `drishti/backend`
2. Install Python dependencies:
   ```powershell
   pip install fastapi "uvicorn[standard]" pandas scipy numpy networkx google-generativeai python-dotenv requests telethon scikit-learn aiofiles python-multipart openpyxl sqlalchemy aiosqlite
   ```
3. Open a terminal in `drishti/frontend`
4. Install Node dependencies:
   ```powershell
   npm install
   ```

## Demo mode

- If `backend/.env` is missing or Telegram credentials are absent, DRISHTI starts in demo mode.
- If `GEMINI_API_KEY` is missing, Gemini fallbacks produce hardcoded analysis and reports.
- No API keys are required to demo the platform.

## Run

From the repository root, run:

```powershell
run.bat
```

Then visit:

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173`
- API docs: `http://localhost:8000/docs`

## Notes

- All backend imports are flat and use the `backend/` root module path.
- The platform includes a real-time WebSocket alert feed, simulated Telegram threat flow, post-exam forensic analysis, and advisory language on every report and alert.
- `backend/.env.example` contains run-time key templates; do not hardcode keys in the repository.
