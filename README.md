# TravelWithMe - Sri Lanka

## Shared Public Reviews Setup

This project now includes a public reviews API at `/api/reviews`.

- `GET /api/reviews` fetches reviews
- `POST /api/reviews` creates a review

The API supports two modes:

1. Supabase mode (recommended): reviews are persistent and shared across users.
2. Memory mode (fallback): reviews are temporary and not persistent across deployments.

### 1) Create Supabase table

Run this SQL in your Supabase SQL editor:

```sql
create extension if not exists "pgcrypto";

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  destination text not null,
  rating int not null check (rating between 1 and 5),
  comment text not null,
  quick_tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists reviews_created_at_idx on public.reviews (created_at desc);
```

### 2) Set environment variables

Create `.env.local` values (or set in Vercel project settings):

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ALLOWED_ORIGINS`

Example:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
```

### 3) Run locally

```bash
npm install
npm run dev
```

### 4) Verify it works

1. Submit a review from the form.
2. Open the same site in another browser/device.
3. Confirm the review appears there too.

If the form shows a memory-mode warning, your Supabase env vars are missing or invalid.
