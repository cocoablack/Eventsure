# EventSure deployment runbook

## 1. Prerequisites

- A MongoDB Atlas deployment with a least-privilege application user and production network rules.
- A Render account for the Express API and a Vercel account for the Vite frontend (or equivalent Node/static hosts).
- Optional Paystack production credentials for checkout and optional Cloudinary credentials for private KYC uploads.
- A production domain using HTTPS.

Run `npm run check` from a clean checkout before deploying. Never deploy the development seed flags or fixture data.

## 2. Backend on Render

Create the service from `render.yaml`. Set these secrets in the Render dashboard:

- `MONGODB_URI`
- `JWT_SECRET` — at least 32 random characters; Render can generate it
- `CLIENT_URL`, `APP_URL` — the exact Vercel origin, without a trailing slash
- `CORS_ORIGINS` — comma-separated allowed frontend origins
- `PAYSTACK_SECRET_KEY` — optional; omit to keep payment actions unavailable
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — optional as a complete set

The build command is `npm ci`, the start command is `npm start`, and the health check is `/api/health`. Deploy and confirm a 200 response before building the frontend.

Create the first admin through a one-time Render shell or local machine connected to production:

```powershell
$env:ADMIN_EMAIL="admin@example.com"
$env:ADMIN_PASSWORD="use-a-long-unique-password"
$env:ADMIN_FULL_NAME="EventSure Administrator"
npm --prefix backend run admin:create
Remove-Item Env:ADMIN_PASSWORD
```

Do not expose the database URI or admin password in command history, logs, screenshots, or tickets.

## 3. Frontend on Vercel

Import the repository, keep the root directory at the repository root, and set:

- `VITE_API_URL=https://your-api.example.com/api`

Vite embeds this value at build time, so changing it requires a redeploy. `vercel.json` supplies the `dist` output and SPA fallback. Add the final Vercel/custom-domain origin to backend `CLIENT_URL` and `CORS_ORIGINS` before testing authentication.

## 4. Paystack and KYC

If Paystack is enabled, configure its webhook URL as:

`https://your-api.example.com/api/payments/webhook/paystack`

Use a real low-value test booking first. Confirm that a browser callback without successful server verification cannot change payment state, repeated callbacks are idempotent, and signed webhook events update the matching reference.

Cloudinary KYC uploads use authenticated delivery. Confirm an unauthenticated user cannot submit or retrieve documents and that only an administrator can see document metadata in the review detail endpoint.

## 5. Smoke checklist

1. Health endpoint returns 200 without revealing secrets.
2. User and vendor registration/login work; attempted `admin` self-registration is stored as a non-admin role.
3. Role guards prevent cross-dashboard access.
4. A user creates an event, books a verified vendor, negotiates an offer, and opens provider checkout.
5. A vendor sees only its assigned bookings and can respond to an offer.
6. Messages and notifications are visible only to their participants/recipient.
7. KYC returns a clear unavailable response if Cloudinary is absent, or uploads and reviews correctly when configured.
8. Admin lists, details, actions, reports, CSV export, settings, and audit-chain validation return live data or an explicit empty/error state.
9. Public pages contain no demo vendor records, false certification claims, or broken internal links.

## 6. Monitoring, backup, and rollback

Use Render request/error logs and MongoDB Atlas alerts. Add an external uptime check for `/api/health`. Configure Atlas backups and test a restore before launch. Do not log JWTs, passwords, Paystack secrets, or KYC document URLs.

Rollback application code by redeploying the previous known-good Render and Vercel builds. Avoid backward-incompatible schema changes without a migration and backup. Payment and audit records should be corrected through append-only operational actions, not deleted.

## Known launch dependencies

- Automated vendor payouts and a ledger/reconciliation job are not implemented.
- Paid subscription and Spotlight billing are deliberately disabled.
- Staff invitation requires a transactional email provider.
- Password reset/email verification and automated dispute communications require an email provider.
- Approved account-deletion requests are recorded and scheduled, but destructive execution remains a manual administrator operation until a retention-aware background job is implemented.
- Legal/privacy text is an accurate product disclosure, not jurisdiction-specific legal advice; obtain counsel before public launch.
