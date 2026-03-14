# STATE: PromptForge

**Project:** Universal Prompt Intelligence Engine SaaS
**Core Value:** Turn any plain English description into the perfect AI prompt instantly — so anyone can get professional-quality results from AI tools without knowing how to prompt.
**Last Updated:** 2026-03-14

---

## Project Reference

| Field | Value |
|-------|-------|
| Core value | Plain English → specialist AI prompt for 16 intent categories |
| Business model | One-time payment, freemium (3 free uses → Clerk auth → Stripe Checkout) |
| Stack | Next.js 14 App Router, TypeScript, Tailwind CSS, Clerk, Neon + Drizzle, Stripe, Anthropic SDK |
| Model | claude-sonnet-4-6 (server-side only) |
| Deployment | Vercel (Pro tier required for maxDuration = 60) |
| UI reference | /reference/referencepromptforge-v10.jsx — exact source of truth |
| UI skill | ui-ux-pro-max |

---

## Current Position

| Field | Value |
|-------|-------|
| Current phase | Phase 1: Foundation + Core Forge Engine |
| Current plan | None — roadmap just created, planning not yet started |
| Phase status | Not started |
| Overall progress | 0% |

```
Progress: [ ] Phase 1 ──────────── [ ] Phase 2 ──── [ ] Phase 3
           Foundation+Engine       Gate+Auth         Payments
```

---

## Phase Summary

| Phase | Name | Requirements | Status |
|-------|------|-------------|--------|
| 1 | Foundation + Core Forge Engine | ENG-01–06, UI-01–16, INFRA-01–03 (25 req) | Not started |
| 2 | Freemium Gate + Auth | GATE-01–06, AUTH-01–04 (10 req) | Not started |
| 3 | Stripe Payments | PAY-01–05 (5 req) | Not started |

**Total:** 40 requirements across 3 phases

---

## Performance Metrics

| Metric | Value |
|--------|-------|
| Requirements defined | 40 |
| Requirements mapped | 40 |
| Phases planned | 3 |
| Plans created | 0 |
| Plans complete | 0 |
| Phases complete | 0 |

---

## Accumulated Context

### Key Decisions

- **One-time payment model confirmed** — not subscription. Stripe implementation handles `payment_intent.succeeded` only. No subscription lifecycle complexity.
- **INFRA in Phase 1** — Vercel env vars, `maxDuration = 60`, `.env.local` docs are pre-conditions for every phase. Must be done first.
- **Brand DNA (UI-14) in Phase 1** — Free-tier differentiator. Ships before auth. Does not require login to use.
- **Security baselines in Phase 1** — API key server-side only (ENG-03), `server-only` guard (ENG-04), input cap 2000 chars (ENG-06), JSON retry logic (ENG-05). Non-retrofittable.
- **proxy.ts not middleware.ts** — Next.js v16 renamed middleware.ts to proxy.ts. New project uses proxy.ts.
- **Tailwind v3.4.x** — Use v3, not v4. Verify v4 compatibility before setup if desired.
- **Drizzle not Prisma** — 5ms cold start vs 200ms+. Important for serverless.

### Architectural Constraints

- Anthropic API key: server-side only, never in client bundle
- System prompt: `lib/system-prompt.ts` with `import 'server-only'`, never trimmed
- Usage tracking: DB row keyed by visitor UUID (httpOnly cookie), never localStorage
- Forge route: `export const maxDuration = 60`, `export const runtime = 'nodejs'`
- Webhook route: raw body (`req.text()`) for Stripe signature verification
- LLM response: batch JSON (not streaming) — ForgeResult complete before render

### Design Tokens (Locked)

```
bg: #030407 | surface: #070910 | card: #0B0D16 | border: #12172A
red: #E03020 | gold: #C88A08 | goldBright: #F0AA20 | green: #1E9A5A
text: #E2DDD8 | muted: #384060
fonts: DM Sans (body) + JetBrains Mono (code/output)
```

### Risks to Watch

- **API cost blowup** — Hard-cap input at 2000 chars server-side + `max_tokens: 1500` on every call (ENG-06 covers this)
- **Vercel timeout** — `maxDuration = 60` + `runtime = 'nodejs'` + Fluid Compute enabled (INFRA-01)
- **LLM JSON parse failure** — Retry once with explicit JSON instruction, Zod validation, never clear user input on error (ENG-05)
- **Webhook reliability** — Idempotency via Stripe event ID, raw body for signature, test with Stripe CLI (PAY-03, PAY-05)

### Todos / Blockers

- [ ] Verify Tailwind v4 compatibility before Phase 1 setup (may be viable as of March 2026)
- [ ] Set pricing before Phase 3 begins (current competitor data is Aug 2025 — verify before launch)
- [ ] Confirm Vercel Pro plan is provisioned (required for maxDuration = 60 reliability)

---

## Session Continuity

| Field | Value |
|-------|-------|
| Last action | Roadmap created — 3 phases, 40 requirements mapped |
| Next action | Run `/gsd:plan-phase 1` to plan Foundation + Core Forge Engine |
| Blocking | Nothing — roadmap is approved, planning can begin |

---
*STATE initialized: 2026-03-14 by roadmapper*
*Next update: after Phase 1 planning*
