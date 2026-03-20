# ROADMAP: PromptForge

**Project:** Universal Prompt Intelligence Engine
**Model:** Completely free — no auth, no limits, no payments
**Granularity:** Single phase (all requirements in Phase 1)
**Created:** 2026-03-14
**Updated:** 2026-03-20 — collapsed to one phase after removing freemium model
**Coverage:** 30/30 v1 requirements mapped

---

## Phases

- [ ] **Phase 1: Foundation + Core Forge Engine** - Working end-to-end forge with full v10 UI fidelity for all users, unlimited and free

---

## Phase Details

### Phase 1: Foundation + Core Forge Engine

**Goal**: Any visitor can paste plain English, hit Forge, and receive a structured specialist prompt rendered with full v10 UI fidelity — including score animation, intent badge, 4 output tabs, copy UX, preset selector, Brand DNA accordion, and all security baselines wired in from day one. Completely free, no login required.

**Depends on**: Nothing (only phase)

**Requirements**: ENG-01, ENG-02, ENG-03, ENG-04, ENG-05, ENG-06, PSET-01, PSET-02, PSET-03, PSET-04, PSET-05, UI-01, UI-02, UI-03, UI-04, UI-05, UI-06, UI-07, UI-08, UI-09, UI-10, UI-11, UI-12, UI-13, UI-14, UI-15, UI-16, INFRA-01, INFRA-02, INFRA-03

**Success Criteria** (what must be TRUE when this phase completes):
  1. A visitor types any plain-English description, clicks Forge, and receives a fully rendered ForgeResult with intent badge, both score counters animated from 0 to their target values, and all 4 output tabs populated.
  2. The preset category selector is the hero element — clicking a preset pre-fills the input with a contextual placeholder and passes it as a hint to the forge engine.
  3. The "Copy Everything" button and per-section copy buttons work on all output sections.
  4. The app renders pixel-faithfully to the v10 reference on desktop and stacks on mobile — all design tokens applied exactly.
  5. The Anthropic API key is provably absent from the client bundle; the system prompt loads server-side only via `import 'server-only'`; input is hard-capped at 2,000 characters server-side.
  6. No login prompt, no usage counter, no payment wall — the tool is completely free to use without any account.

**Note on UI fidelity**: This phase uses the `ui-ux-pro-max` skill profile. The v10 reference component at `/reference/referencepromptforge-v10.jsx` is the exact source of truth for every visual detail.

**Plans**: TBD

---

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation + Core Forge Engine | 0/1 | Not started | - |

---

## Coverage Map

| Category | Requirements | Phase |
|----------|-------------|-------|
| Core Engine | ENG-01 through ENG-06 | 1 |
| Preset Selection | PSET-01 through PSET-05 | 1 |
| UI | UI-01 through UI-16 | 1 |
| Infrastructure | INFRA-01 through INFRA-03 | 1 |

**Total mapped: 30/30 v1 requirements**

---

## Key Decisions Encoded in This Roadmap

| Decision | Impact |
|----------|--------|
| No freemium / no auth / no payments | Phases 2 and 3 dropped entirely — Clerk, Neon, Drizzle, Stripe all removed from stack |
| INFRA requirements in Phase 1 | Vercel `maxDuration`, env vars, and `.env.local` docs must exist before deploy |
| Brand DNA (UI-14) in Phase 1 | Ships as a free differentiator — no auth dependency |
| Security baselines (ENG-03, ENG-04, ENG-06) in Phase 1 | API key exposure and cost blowup cannot be retrofitted |

---
*Roadmap created: 2026-03-14*
*Last updated: 2026-03-20 — collapsed from 3 phases to 1 after freemium model dropped*
