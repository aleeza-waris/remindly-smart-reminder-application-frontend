# Remindly — Smart Reminder Application

Remindly helps you plan one-time reminders, track your progress, and receive scheduled email reminders.

**Live demo:** https://remindly-smart-reminder-application.vercel.app

**Frontend repository:** https://github.com/aleeza-waris/remindly-smart-reminder-application-frontend

## Features

- Create an account or sign in with email and password or Google.
- Create, edit, complete, reopen, and delete one-time reminders.
- Choose a due date, category, priority, and email advance notice.
- Search, filter, and paginate reminders; sort the current page and switch between card and table views. The selected view is remembered.
- Review upcoming and overdue reminders, dashboard statistics, completion progress, and category summaries.
- Update your display name, time zone, default advance notice, and Email Alerts setting. Your email address is read-only.
- Switch between light and dark themes.

Email delivery requires the backend Gmail sender to be configured.

## Pages

- `/` — Public landing page
- `/auth` — Sign In and Create Account
- `/login` and `/register` — Compatibility routes to the corresponding `/auth` mode
- `/dashboard` — Reminder overview and statistics
- `/reminders` — Reminder management
- `/settings` — Profile and reminder preferences

## Technology Stack

- Next.js App Router, React, TypeScript, Tailwind CSS v4, and Ant Design
- TanStack Query, Axios, React Hook Form, and Zod
- Redux Toolkit, Lucide icons, and `@react-oauth/google`

## Prerequisites

- Node.js 20.9 or newer
- npm
- A running Remindly backend for account and reminder features

## Local Setup

Install dependencies from the repository root:

```bash
npm install
```

Copy `.env.example` to `.env` and configure the local values:

```bash
cp .env.example .env
```

In PowerShell, use:

```powershell
Copy-Item .env.example .env
```

### Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL, including `/api`. Local example: `http://localhost:5000/api`. Production builds require this value. |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Public Google OAuth client ID. Configure the same client ID on the backend to enable Google Sign-In. |

The API URL must be an absolute HTTP or HTTPS URL ending in `/api`. Configure the backend to allow the frontend origin in `CLIENT_ORIGINS`.

## Available Scripts

```bash
npm run dev    # Start the Next.js development server
npm test       # Run frontend Node.js tests
npm run build  # Create the production build
npm start      # Serve the production build
```

The current frontend test suite covers reminder creation-time ordering.

## Deploy to Vercel

1. Import the frontend GitHub repository into Vercel. The repository root is the frontend project root.
2. Set `NEXT_PUBLIC_API_URL` to the backend API base URL ending in `/api`.
3. Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to enable Google Sign-In.
4. Add the exact Vercel deployment HTTPS origin to the backend's `CLIENT_ORIGINS` and to the Google OAuth authorized origins.
5. Deploy and verify sign-in and API connectivity.

## Project Structure

```text
frontend/
├── public/              # Brand assets and icons
├── src/app/             # Landing, auth, dashboard, reminders, and settings routes
├── src/components/      # Page and shared UI
├── src/services/        # Backend API calls
├── src/schemas/         # Form validation
├── src/lib/             # API, theme, session, and timezone helpers
└── tests/               # Frontend tests
```
