# EventSure

EventSure is a full-stack marketplace for event planners and verified vendors. It includes role-based user, vendor, and administrator workspaces; event and booking workflows; offers and messaging; KYC review; notifications; subscriptions; Paystack transaction verification; and an audit-logged admin API.

## Stack and layout

- `src/` — React 19, React Router, Tailwind CSS, Vite
- `backend/` — Express 5, Mongoose, JWT, Vitest/Supertest
- `render.yaml` — backend web-service blueprint
- `vercel.json` — frontend build and SPA rewrite configuration
- `DEPLOYMENT.md` — production deployment and launch checklist

Amounts are stored and displayed in Nigerian naira. Booking amounts use major NGN units; Paystack requests and `Payment.amountKobo` use kobo.

## Local setup

Requirements: Node.js 20.19 or newer (below 26), npm, and MongoDB.

```powershell
Copy-Item .env.example .env
Copy-Item backend/.env.example backend/.env
npm ci
npm --prefix backend ci
npm --prefix backend run dev
```

In a second terminal:

```powershell
npm run dev
```

The frontend defaults to `http://localhost:5173`; the API defaults to `http://localhost:5000`, with health at `http://localhost:5000/api/health`.

## Commands

```powershell
npm run lint                 # repository ESLint
npm run build                # production frontend build
npm test                     # backend integration tests
npm run check                # full lint/build/syntax/test gate
npm --prefix backend start   # production API process
```

To create or rotate an administrator, set `ADMIN_EMAIL`, `ADMIN_PASSWORD` (12+ characters), and optionally `ADMIN_FULL_NAME` in `backend/.env`, run `npm --prefix backend run admin:create`, then remove the password value.

Seed scripts contain intentionally destructive development fixtures. They refuse to run unless `ALLOW_DESTRUCTIVE_SEED=true`; never set that variable on a production service.

## Security and integration behavior

- Public registration accepts only `user` and `vendor`; admin role assignment is not accepted from clients.
- Protected routes verify JWTs and roles. Sensitive auth endpoints and the API are rate-limited.
- Passwords are bcrypt-hashed. KYC uploads are type/size-limited and require authenticated Cloudinary storage.
- Payments are initialized and verified server-side with Paystack. A client redirect alone cannot mark a payment successful; webhooks require a valid HMAC signature.
- Paid subscriptions, Spotlight purchases, staff invitation email, and automated vendor payouts fail explicitly until their supporting integrations are configured. The UI does not fabricate successful states.
- Real `.env` files are ignored and must not be committed. Rotate any secret that has previously entered version control.

## Main API groups

All application endpoints are under `/api`: `auth`, `users`, `vendors`, `events`, `bookings`, `payments`, `messages`, `notifications`, `kyc`, `subscriptions`, `policies`, `support`, and role-protected `admin` resources.

API responses use `{ success, message, data }`; errors use `{ success: false, message, errors }`. Pagination metadata is returned by admin collection endpoints.

## Verification

Backend integration tests cover health, role-safe registration, normalized login, authentication and authorization failures, verified public vendor filtering, event creation, booking ownership, and notification scoping. Run the full gate before release:

```powershell
npm run check
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for environment variables, Paystack webhook setup, deployment order, smoke checks, rollback, and known launch dependencies.
