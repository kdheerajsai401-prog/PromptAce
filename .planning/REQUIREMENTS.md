# Requirements: PromptForge

**Defined:** 2026-03-14
**Core Value:** Turn any plain English description into the perfect AI prompt instantly — so anyone can get professional-quality results from AI tools without knowing how to prompt.

## v1 Requirements

### Core Engine

- [ ] **ENG-01**: User submits plain English description and receives structured ForgeResult JSON from Anthropic API
- [ ] **ENG-02**: System prompt with all 16 intent categories is deployed server-side in lib/system-prompt.ts and never trimmed
- [ ] **ENG-03**: API key is stored server-side only in route.ts — never exposed to the client bundle
- [ ] **ENG-04**: server-only package guards lib/system-prompt.ts from being imported in client components
- [ ] **ENG-05**: Forge route handles malformed JSON from LLM gracefully (retry once, return user-facing error on second failure)
- [ ] **ENG-06**: Input is capped at 2000 characters and max_tokens is set on every API call to prevent runaway costs

### UI

- [ ] **UI-01**: Two-panel layout rendered exactly matching v10 design — left panel (input) stacks above right panel (output) on mobile
- [ ] **UI-02**: Intent badge displays detected category emoji + label after forge
- [ ] **UI-03**: Score counter animates from 0 to target value for both score_original and score_forged
- [ ] **UI-04**: Output panel has 4 tabs: PROMPT / NEGATIVE / BOLD / EXPERIMENTAL
- [ ] **UI-05**: Copy button on each output section copies content to clipboard
- [ ] **UI-06**: "Copy Everything" button at bottom copies all output sections as formatted text
- [ ] **UI-07**: Loading state displays rotating messages while forging
- [ ] **UI-08**: Empty state displays 8 category cards before first forge
- [ ] **UI-09**: text_risk flag displays orange alert with text_risk_note
- [ ] **UI-10**: unknown_technique flag displays green alert with technique_flag message
- [ ] **UI-11**: Tool recommendation displays tool name + tool_reason
- [ ] **UI-12**: Tips section displays all tips[] items
- [ ] **UI-13**: parameters section displays when present with parameters_label
- [ ] **UI-14**: Brand DNA accordion — expandable panel for brand name, tone, target audience — content appended to forge context
- [ ] **UI-15**: 12 example chips in header — one per distinct intent category — clicking populates input and triggers forge
- [ ] **UI-16**: All design tokens applied exactly: bg #030407, surface #070910, card #0B0D16, border #12172A, red #E03020, gold #C88A08, goldBright #F0AA20, green #1E9A5A, text #E2DDD8, muted #384060, DM Sans + JetBrains Mono fonts

### Freemium Gating

- [ ] **GATE-01**: Anonymous visitor receives UUID stored in cookie on first visit
- [ ] **GATE-02**: Forge usage is tracked server-side in DB keyed by visitor UUID (not localStorage)
- [ ] **GATE-03**: Usage counter UI shows "X of 3 remaining" proactively on every forge
- [ ] **GATE-04**: On 4th forge attempt by anonymous user, login/signup modal appears instead of forging
- [ ] **GATE-05**: Logged-in users on free plan get additional free forges before hitting payment wall
- [ ] **GATE-06**: Paid users can forge without limit

### Authentication

- [ ] **AUTH-01**: User can sign up with email and password via Clerk
- [ ] **AUTH-02**: User can log in and session persists across browser refresh
- [ ] **AUTH-03**: User can log out from any page
- [ ] **AUTH-04**: Auth state is reflected in the usage counter and gate logic

### Payments

- [ ] **PAY-01**: User can click "Upgrade" and be redirected to Stripe Checkout for one-time payment
- [ ] **PAY-02**: Stripe webhook handler syncs payment_intent.succeeded event to mark user as paid in DB
- [ ] **PAY-03**: Webhook handler is idempotent — duplicate events do not double-grant access
- [ ] **PAY-04**: Paid status is enforced in /api/forge route before processing request
- [ ] **PAY-05**: Webhook uses raw body (not parsed JSON) for Stripe signature verification

### Infrastructure

- [ ] **INFRA-01**: Next.js app deploys to Vercel with export const maxDuration = 60 on forge route
- [ ] **INFRA-02**: All secrets stored in Vercel environment variables (ANTHROPIC_API_KEY, STRIPE_SECRET_KEY, CLERK_SECRET_KEY, etc.)
- [ ] **INFRA-03**: .env.local documented in README with required variable names (no values)

## v2 Requirements

### History

- **HIST-01**: Logged-in user can view list of previous forged prompts
- **HIST-02**: User can click a history item to re-populate the input field
- **HIST-03**: User can delete individual history items

### Growth

- **GROW-01**: Per-category landing pages (/image-generation, /video-generation, etc.) for SEO
- **GROW-02**: Rate limiting per IP to prevent API cost abuse
- **GROW-03**: Admin dashboard showing daily forge volume and cost
- **GROW-04**: Referral system — share link gives both users extra free forges

## Out of Scope

| Feature | Reason |
|---------|--------|
| Multi-model support (GPT, Gemini) | Dilutes focus — PromptForge is about the engine, not model switching |
| Social features (sharing, ratings) | Community is an anti-feature here; competes on generation quality not curation |
| Team/agency features | Single-user focus for MVP |
| Image/file uploads to PromptForge | We generate prompts, we don't process media |
| Subscription billing | One-time payment simpler for MVP; evaluate post-launch |
| OAuth social login | Email/password sufficient for v1 |

## Traceability

*(Populated by roadmapper)*

| Requirement | Phase | Status |
|-------------|-------|--------|
| ENG-01 | TBD | Pending |
| ENG-02 | TBD | Pending |
| ENG-03 | TBD | Pending |
| ENG-04 | TBD | Pending |
| ENG-05 | TBD | Pending |
| ENG-06 | TBD | Pending |
| UI-01 | TBD | Pending |
| UI-02 | TBD | Pending |
| UI-03 | TBD | Pending |
| UI-04 | TBD | Pending |
| UI-05 | TBD | Pending |
| UI-06 | TBD | Pending |
| UI-07 | TBD | Pending |
| UI-08 | TBD | Pending |
| UI-09 | TBD | Pending |
| UI-10 | TBD | Pending |
| UI-11 | TBD | Pending |
| UI-12 | TBD | Pending |
| UI-13 | TBD | Pending |
| UI-14 | TBD | Pending |
| UI-15 | TBD | Pending |
| UI-16 | TBD | Pending |
| GATE-01 | TBD | Pending |
| GATE-02 | TBD | Pending |
| GATE-03 | TBD | Pending |
| GATE-04 | TBD | Pending |
| GATE-05 | TBD | Pending |
| GATE-06 | TBD | Pending |
| AUTH-01 | TBD | Pending |
| AUTH-02 | TBD | Pending |
| AUTH-03 | TBD | Pending |
| AUTH-04 | TBD | Pending |
| PAY-01 | TBD | Pending |
| PAY-02 | TBD | Pending |
| PAY-03 | TBD | Pending |
| PAY-04 | TBD | Pending |
| PAY-05 | TBD | Pending |
| INFRA-01 | TBD | Pending |
| INFRA-02 | TBD | Pending |
| INFRA-03 | TBD | Pending |

**Coverage:**
- v1 requirements: 38 total
- Mapped to phases: 0 (roadmapper will populate)
- Unmapped: 38 ⚠️

---
*Requirements defined: 2026-03-14*
*Last updated: 2026-03-14 after initial definition*
