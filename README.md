
 # CITE Admin Panel

 A modern admin dashboard for CITE attendance monitoring with a minimalist login/forgot-password flow and responsive layout.

 ## Features
 - Admin login and forgot-password screens
 - Dashboard overview with charts and alerts
 - Reports table with CSV export
 - User management, settings, and audit logs sections
 - Responsive sidebar and layout

 ## Tech Stack
 - React + TypeScript (Vite)
 - Tailwind CSS + shadcn/ui components
 - Recharts for data visualizations
 - Lucide icons

## Getting Started
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```

## Scripts (Frontend)
- `npm run dev` - start development server
- `npm run build` - build for production
- `npm run preview` - preview the production build

## Laravel API connection

The Laravel backend and database are maintained in a separate repository. The frontend
does not connect directly to GitHub or MySQL; it sends requests to the Laravel API.

Create `frontend/.env` from `frontend/.env.example` and set the API origin:

```env
VITE_API_URL=http://localhost:8000
```

For production, replace it with the deployed Laravel API origin, for example:

```env
VITE_API_URL=https://api.example.com
```

The Laravel application must allow the frontend origin through CORS and provide the
API routes used by this application under `/api`.

## Invite Link Registration
- Admins and teachers generate invite links from **Invite Students** in the dashboard.
- Copy the link and send it to the student (e.g., via email).
- Student clicks the link → opens registration form in browser → creates account.
- Each invite link expires in 7 days (configurable) and can be used once.

## IoT / Fingerprint Attendance
- Fingerprint scanners can record attendance by calling:
  - `POST /api/iot/attendance` with `X-API-Key` header (set `IOT_API_KEY` in `.env`)
  - Body: `{ "userId": "..." }` or `{ "email": "student@phinmaed.edu.ph" }` and optional `"status": "Present"|"Late"`, `"deviceId"`
- The IoT device should identify the student (e.g., from fingerprint match) and send the request to record check-in.

## Notes
- The backend and database are intentionally not part of this repository.
- Set `VITE_API_URL` in the frontend environment; never put database credentials in it.
