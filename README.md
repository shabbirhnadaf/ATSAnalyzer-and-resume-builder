# AI ASSISTED RESUME SCANNER AND BUILDER
A full-stack AI-powered resume builder with resume creation, ATS scanning, AI ATS analysis, scan history, resume preview, and tailoring workflows.

# Features
Resume builder with profile, summary, education, experience, skills, certifications, and projects.

ATS scanner for saved resumes against a job description.

AI ATS analysis for pasted or uploaded PDF/DOCX resumes.

Scan history with score tracking, matched keywords, missing keywords, suggestions, and scan comparison.

Resume preview and tailored resume workflows.

MongoDB-backed persistence for resumes and scan history.

# Tech stack
Frontend
React
TypeScript
Vite
React Router
Tailwind CSS
pdfjs-dist
mammoth
Axios

Backend
Node.js
Express
TypeScript
MongoDB with Mongoose
JWT/Auth middleware

# Deploy on Vercel (with GitHub)

This repository has two apps:
- `client` (Vite React frontend)
- `server` (Express API)

Deploy them as **two separate Vercel projects** connected to the same GitHub repository.

## 1) Push to GitHub

1. Create a GitHub repo (or use existing one).
2. Push this codebase to GitHub.

## 2) Deploy API (`server`) on Vercel

1. In Vercel, click **Add New Project** and import your GitHub repo.
2. Set **Root Directory** to `server`.
3. Vercel should detect `vercel.json` and deploy the serverless API.
4. Add environment variables in Vercel project settings:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_ACCESS_EXPIRES_IN` (example: `15m`)
   - `JWT_REFRESH_EXPIRES_IN` (example: `7d`)
   - `CLIENT_URLS` (set later to frontend URL, comma-separated if multiple)
   - `NODE_ENV=production`
5. Deploy and copy the API URL (example: `https://resume-builder-api.vercel.app`).

## 3) Deploy Frontend (`client`) on Vercel

1. Create another Vercel project from same GitHub repo.
2. Set **Root Directory** to `client`.
3. Add environment variable:
   - `VITE_API_BASE_URL=https://your-api-project.vercel.app/api`
4. Deploy and copy frontend URL (example: `https://resume-builder-app.vercel.app`).

## 4) Update CORS and redeploy API

In API project (`server`) settings, set:
- `CLIENT_URLS=https://your-frontend-project.vercel.app`

If you have multiple frontends, separate with commas:
- `CLIENT_URLS=https://app1.vercel.app,https://app2.vercel.app`

Redeploy API after updating env vars.

## 5) Verify

1. Open frontend URL.
2. Register/login.
3. Confirm requests hit API project successfully.
4. Check `/api/health` on API URL.