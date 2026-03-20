# STATE: PromptForge

**Project:** Universal Prompt Intelligence Engine
**Core Value:** Turn any plain English description into the perfect AI prompt instantly — so anyone can get professional-quality results from AI tools without knowing how to prompt.
**Last Updated:** 2026-03-20

---

## Project Reference

| Field | Value |
|-------|-------|
| Core value | Plain English → specialist AI prompt for 16 intent categories |
| Business model | **Completely free** — no auth, no usage limits, no payments |
| Stack | Next.js 14 App Router, TypeScript, Tailwind CSS, Anthropic SDK |
| Model | claude-sonnet-4-6 (server-side only) |
| Deployment | Vercel |
| UI reference | /reference/referencepromptforge-v10.jsx — exact source of truth |
| UI skill | ui-ux-pro-max |

---

## Current Position

| Field | Value |
|-------|-------|
| Current phase | Phase 1: Foundation + Core Forge Engine |
| Current plan | None — planning not yet started |
| Phase status | Not started |
| Overall progress | 0% |

```
Progress: [ ] Phase 1
           Foundation + Core Forge Engine (all 30 requirements)
```

---

## Phase Summary

| Phase | Name | Requirements | Status |
|-------|------|-------------|--------|
| 1 | Foundation + Core Forge Engine | ENG-01–06, PSET-01–05, UI-01–16, INFRA-01–03 (30 req) | Not started |

**Total:** 30 requirements in 1 phase

---

## Performance Metrics

| Metric | Value |
|--------|-------|
| Requirements defined | 30 |
| Requirements mapped | 30 |
| Phases planned | 1 |
| Plans created | 0 |
| Plans complete | 0 |
| Phases complete | 0 |

---

## Accumulated Context

### Key Decisions

- **Completely free model confirmed** — no Clerk, no Neon, no Drizzle, no Stripe. Zero auth. Zero usage tracking. Anyone can forge unlimited times.
- **INFRA in Phase 1** — Vercel env vars, `maxDuration = 60`, `.env.local` docs are pre-conditions for deploy.
- **Brand DNA (UI-14) in Phase 1** — Free differentiator. Ships with the core engine.
- **Security baselines in Phase 1** — API key server-side only (ENG-03), `server-only` guard (ENG-04), input cap 2000 chars (ENG-06), JSON retry logic (ENG-05). Non-retrofittable.
- **Tailwind v3.4.x** — Use v3, not v4.
- **No DB required** — Removing freemium model means no database, no sessions, no cookies for tracking.

### Architectural Constraints

- Anthropic API key: server-side only, never in client bundle
- System prompt: `lib/system-prompt.ts` with `import 'server-only'`, never trimmed
- Forge route: `export const maxDuration = 60`, `export const runtime = 'nodejs'`
- LLM response: batch JSON (not streaming) — ForgeResult complete before render
- No auth middleware, no session cookies, no DB connections

### Design Tokens (Locked)

```
bg: #030407 | surface: #070910 | card: #0B0D16 | border: #12172A
red: #E03020 | gold: #C88A08 | goldBright: #F0AA20 | green: #1E9A5A
text: #E2DDD8 | muted: #384060
fonts: DM Sans (body) + JetBrains Mono (code/output)
```

### Risks to Watch

- **API cost blowup** — Hard-cap input at 2000 chars server-side + `max_tokens: 1500` on every call (ENG-06). Since it's free and unlimited, monitor usage closely post-launch.
- **Vercel timeout** — `maxDuration = 60` + `runtime = 'nodejs'` (INFRA-01)
- **LLM JSON parse failure** — Retry once with explicit JSON instruction, never clear user input on error (ENG-05)
- **Abuse / high volume** — No rate limiting in v1. Add IP rate limiting in v2 (GROW-02) if needed.

### Todos / Blockers

- [ ] Verify Tailwind v4 compatibility before Phase 1 setup
- [ ] Confirm Vercel plan supports maxDuration = 60 (Hobby tier supports up to 60s as of 2025)

---

## Session Continuity

| Field | Value |
|-------|-------|
| Last action | Business model changed to completely free; GATE/AUTH/PAY removed; planning files updated |
| Next action | Run `/gsd:plan-phase 1` to plan Foundation + Core Forge Engine |
| Blocking | Nothing |

---
*STATE initialized: 2026-03-14*
*Last updated: 2026-03-20 — freemium model dropped, collapsed to single phase, stack simplified*
