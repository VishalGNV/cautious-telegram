# AI agent guide for this repo

This is a Next.js App Router + Supabase Auth starter using cookie-based sessions via @supabase/ssr. Follow these project-specific patterns to be productive and avoid breaking auth.

## Big picture
- Next.js (App Router, TypeScript) + Tailwind + shadcn/ui + next-themes.
- Supabase SSR client manages cookies; middleware refreshes sessions and handles redirects.
- Client components use `createBrowserClient`; server components/route handlers use `createServerClient` per request.

## Key locations
- Client Supabase: `lib/supabase/client.ts` (createBrowserClient)
- Server Supabase: `lib/supabase/server.ts` (createServerClient via `cookies()`)
- Middleware gate: `lib/supabase/middleware.ts` (export `updateSession`), wired by `middleware.ts` (custom matcher)
- Auth flows: `app/auth/**/*` (login, sign-up, forgot/reset, confirm via route handler)
- Protected example: `app/protected/*` (SSR auth check + user claims)
- UI primitives: `components/ui/*`; feature components in `components/*`

## Auth/session rules (do not violate)
- Create a NEW server client per request; never keep it in module globals (“Fluid compute”).
- In middleware, return the same `NextResponse` that Supabase mutates; don’t recreate without copying cookies. See `lib/supabase/middleware.ts`.
- Call `supabase.auth.getClaims()` immediately after client creation in server code; avoid code between these calls to prevent random logouts.
- Unauthed redirect is to `/auth/login` except for `/auth/**` and static assets (see `middleware.ts` matcher). Adjust if you change public routes.

## Typical patterns
- Server page guard (see `app/protected/page.tsx`): create server client, `getClaims()`, `redirect("/auth/login")` if missing.
- Client forms (see `components/login-form.tsx`, `components/sign-up-form.tsx`): mark `"use client"`, call browser client, then route (e.g., to `/protected`).
- Email flows: `app/auth/confirm/route.ts` handles `token_hash` + `type` via `verifyOtp`; forgot/reset in `components/forgot-password-form.tsx` redirects to `/auth/update-password`.

## Environment and workflows
- Required env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (legacy anon key value also works). `lib/utils.hasEnvVars` shows a banner and relaxes middleware when unset.
- Scripts: dev `npm run dev` (Turbopack, http://localhost:3000), build `npm run build`, start `npm run start`, lint `npm run lint`.
- Styling: Tailwind + shadcn; `components.json` drives shadcn setup.

## Adding protected routes/APIs
- Rely on middleware for baseline protection, and prefer explicit checks in pages/route handlers for UX (fast redirects) and defense-in-depth.
- For route handlers, create server client and check `getClaims()` before doing work.

## Pitfalls to avoid
- Replacing the response (or dropping cookies) in middleware.
- Sharing Supabase client instances across requests.
- Modifying code between server client creation and `getClaims()`.

## Quick references
- Protected page: `app/protected/page.tsx`
- Middleware: `lib/supabase/middleware.ts` + `middleware.ts`
- Auth UI: `components/login-form.tsx`, `components/sign-up-form.tsx`

If any workflow here is unclear (e.g., alternate auth flows, deployment knobs), ask for specifics and we’ll refine this guide.
