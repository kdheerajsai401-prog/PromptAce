# ROADMAP: PromptForge

**Project:** Universal Prompt Intelligence Engine SaaS
**Model:** One-time payment — freemium (3 free uses) → Clerk auth → Stripe Checkout
**Granularity:** Coarse (3 delivery phases)
**Created:** 2026-03-14
**Coverage:** 40/40 v1 requirements mapped

---

## Phases

- [ ] **Phase 1: Foundation + Core Forge Engine** - Working end-to-end forge with full v10 UI fidelity for anonymous users
- [ ] **Phase 2: Freemium Gate + Auth** - Server-side usage tracking, Clerk authentication, and conversion funnel
- [ ] **Phase 3: Stripe Payments** - One-time payment, webhook sync, and paid-user gate enforcement

---

## Phase Details

### Phase 1: Foundation + Core Forge Engine

**Goal**: Any visitor can paste plain English, hit Forge, and receive a structured specialist prompt rendered with full v10 UI fidelity — including score animation, intent badge, 4 output tabs, copy UX, example chips, Brand DNA accordion, and all security baselines wired in from day one.

**Depends on**: Nothing (first phase)

**Requirements**: ENG-01, ENG-02, ENG-03, ENG-04, ENG-05, ENG-06, UI-01, UI-02, UI-03, UI-04, UI-05, UI-06, UI-07, UI-08, UI-09, UI-10, UI-11, UI-12, UI-13, UI-14, UI-15, UI-16, INFRA-01, INFRA-02, INFRA-03

**Success Criteria** (what must be TRUE when this phase completes):
  1. A visitor types any plain-English description, clicks Forge, and receives a fully rendered ForgeResult with intent badge, both score counters animated from 0 to their target values, and all 4 output tabs populated.
  2. Clicking any of the 12 example chips in the header populates the input and triggers a forge automatically — no blank-slate paralysis on first visit.
  3. The "Copy Everything" button and per-section copy buttons work on all output sections; the user can paste a complete, formatted prompt directly into any AI tool.
  4. The app renders pixel-faithfully to the v10 reference on desktop and stacks the left panel above the right panel on mobile — all design tokens (bg #030407, fonts DM Sans + JetBrains Mono, etc.) applied exactly.
  5. The Anthropic API key is provably absent from the client bundle; the system prompt loads server-side only via `import 'server-only'`; input is hard-capped at 2,000 characters server-side; and the forge route has `maxDuration = 60` with `runtime = 'nodejs'`.

**Note on UI fidelity**: This phase uses the `ui-ux-pro-max` skill profile. The v10 reference component at `/reference/referencepromptforge-v10.jsx` is the exact source of truth for every visual detail.

**Plans**: TBD

---

### Phase 2: Freemium Gate + Auth

**Goal**: The anonymous 3-use experience is enforced server-side with a visible usage counter, a conversion-optimized auth wall modal, and full Clerk authentication — so usage can never be bypassed client-side and authenticated users get proper session-aware gate logic.

**Depends on**: Phase 1

**Requirements**: GATE-01, GATE-02, GATE-03, GATE-04, GATE-05, GATE-06, AUTH-01, AUTH-02, AUTH-03, AUTH-04

**Success Criteria** (what must be TRUE when this phase completes):
  1. A new anonymous visitor sees "3 of 3 free forges remaining" on their first use; after each forge the counter decrements; on their 4th attempt the forge does not fire — an auth wall modal appears instead.
  2. The usage counter is driven by a server-side DB row keyed to a visitor UUID in an httpOnly cookie — resetting the cookie in DevTools does not restore the free quota (server-side enforcement).
  3. A user can create an account with email/password via Clerk, log in, and remain logged in across browser refreshes and new tabs.
  4. After login, the auth wall dismisses and forge resumes — the authenticated user's remaining free-tier quota is reflected in the counter, and paid users forge without any counter.

**Plans**: TBD

---

### Phase 3: Stripe Payments

**Goal**: A logged-in user on the free-tier limit can click "Upgrade", complete a one-time Stripe Checkout payment, and immediately forge without restriction — with the paid status durably synced to the DB via a verified, idempotent webhook.

**Depends on**: Phase 2

**Requirements**: PAY-01, PAY-02, PAY-03, PAY-04, PAY-05

**Success Criteria** (what must be TRUE when this phase completes):
  1. A free-tier user who hits the upgrade wall clicks "Upgrade", is redirected to Stripe Checkout, completes a one-time payment, and returns to the app where the usage gate is gone — they can forge immediately.
  2. The forge API route enforces paid status from the DB — a user who never completed payment cannot forge past the free limit even if they manipulate client-side state.
  3. The Stripe webhook receives `payment_intent.succeeded`, verifies the signature using raw body (not parsed JSON), marks the user as paid in the DB, and does so idempotently — a duplicate event delivery does not double-grant or corrupt the record.

**Plans**: TBD

---

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation + Core Forge Engine | 0/? | Not started | - |
| 2. Freemium Gate + Auth | 0/? | Not started | - |
| 3. Stripe Payments | 0/? | Not started | - |

---

## Coverage Map

| Category | Requirements | Phase |
|----------|-------------|-------|
| Core Engine | ENG-01, ENG-02, ENG-03, ENG-04, ENG-05, ENG-06 | 1 |
| UI | UI-01 through UI-16 (16 requirements) | 1 |
| Infrastructure | INFRA-01, INFRA-02, INFRA-03 | 1 |
| Freemium Gating | GATE-01, GATE-02, GATE-03, GATE-04, GATE-05, GATE-06 | 2 |
| Authentication | AUTH-01, AUTH-02, AUTH-03, AUTH-04 | 2 |
| Payments | PAY-01, PAY-02, PAY-03, PAY-04, PAY-05 | 3 |

**Total mapped: 40/40 v1 requirements**

---

## Key Decisions Encoded in This Roadmap

| Decision | Impact on Phases |
|----------|-----------------|
| One-time payment (not subscription) | Phase 3 handles only `payment_intent.succeeded` — no subscription lifecycle events, no `invoice.payment_failed` |
| INFRA requirements in Phase 1 | Vercel `maxDuration`, env vars, and `.env.local` docs must exist before any phase can deploy — no retrofit |
| Brand DNA (UI-14) in Phase 1 | Ships as a free-tier differentiator from day one; does not require auth to function |
| Usage gate (GATE) before Payments (PAY) | Stripe requires a user identity — auth must precede payments |
| Security baselines (ENG-03, ENG-04, ENG-06) in Phase 1 | API key exposure, system prompt leakage, and cost blowup cannot be retrofitted — wired in from the start |

---
*Roadmap created: 2026-03-14*
*Last updated: 2026-03-14 by roadmapper*
