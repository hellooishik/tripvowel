# Travel Backend

## Setup
1. `cp .env.example .env` and fill values
2. `npm i`
3. `npm run dev`

## Key URLs
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/trips` (filters: q, location, packageType, minPrice, maxPrice, page, limit)
- `POST /api/bookings`
- `POST /api/payments/create`
- `POST /api/payments/webhook` (Stripe)
- `GET /api/external/*` (admin)
- `POST /api/support`
- `GET /api/admin/dashboard` (admin KPIs)
