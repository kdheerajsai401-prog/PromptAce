# Requirements: PromptForge

**Defined:** 2026-03-14
**Updated:** 2026-03-20 — removed GATE, AUTH, PAY requirement groups (freemium model dropped)
**Core Value:** Turn any plain English description into the perfect AI prompt instantly — so anyone can get professional-quality results from AI tools without knowing how to prompt.

## v1 Requirements

### Core Engine

- [ ] **ENG-01**: User submits plain English description and receives structured ForgeResult JSON from Anthropic API
- [ ] **ENG-02**: System prompt with all 16 intent categories is deployed server-side in lib/system-prompt.ts and never trimmed
- [ ] **ENG-03**: API key is stored server-side only in route.ts — never exposed to the client bundle
- [ ] **ENG-04**: server-only package guards lib/system-prompt.ts from being imported in client components
- [ ] **ENG-05**: Forge route handles malformed JSON from LLM gracefully (retry once, return user-facing error on second failure)
- [ ] **ENG-06**: Input is capped at 2000 characters and max_tokens is set on every API call to prevent runaway costs

### Preset Selection

- [ ] **PSET-01**: User sees a grid of preset category cards on the hero/landing area (Photo Generation, Video Generation, Game Design, AI Prompt Enhancer, Music Generation, Creative Writing, Business Writing, Code Generation — 8 visible, expandable)
- [ ] **PSET-02**: Clicking a preset pre-selects that category and optionally pre-fills the input with a contextual placeholder
- [ ] **PSET-03**: Selected preset is visually highlighted and passed as a hint to the forge engine alongside the user's input
- [ ] **PSET-04**: User can still type freely without selecting a preset (forge engine auto-detects intent from free text)
- [ ] **PSET-05**: Presets have icons and short descriptions that communicate what they generate

### UI

- [ ] **UI-01**: Fully redesigned dark premium UI (not a v10 copy) — built with ui-ux-pro-max skill. Two-panel layout on desktop; single column on mobile.
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
- [ ] **UI-15**: Example chips or quick-start suggestions within or below the preset selector area
- [ ] **UI-16**: Dark premium design system — base tokens from v10 (bg #030407, DM Sans + JetBrains Mono) as starting point, extended with richer visual hierarchy, gradients, and micro-interactions designed by ui-ux-pro-max

### Infrastructure

- [ ] **INFRA-01**: Next.js app deploys to Vercel with export const maxDuration = 60 on forge route
- [ ] **INFRA-02**: ANTHROPIC_API_KEY stored in Vercel environment variables
- [ ] **INFRA-03**: .env.local documented in README with required variable names (no values)

## v2 Requirements (Future — not in scope)

### Growth

- **GROW-01**: Per-category landing pages (/image-generation, /video-generation, etc.) for SEO
- **GROW-02**: Rate limiting per IP to prevent API cost abuse
- **GROW-03**: Admin dashboard showing daily forge volume and cost

## Out of Scope

| Feature | Reason |
|---------|--------|
| Auth / login / accounts | Tool is free and anonymous — no identity needed |
| Usage gating / freemium limits | Tool is completely free, no limits |
| Stripe payments | No monetization in v1 |
| Multi-model support (GPT, Gemini) | Dilutes focus — PromptForge is about the engine |
| Social features (sharing, ratings) | Not needed for v1 |
| Team/agency features | Single-user focus for MVP |
| Image/file uploads | We generate prompts, we don't process media |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| ENG-01 | Phase 1 | Pending |
| ENG-02 | Phase 1 | Pending |
| ENG-03 | Phase 1 | Pending |
| ENG-04 | Phase 1 | Pending |
| ENG-05 | Phase 1 | Pending |
| ENG-06 | Phase 1 | Pending |
| PSET-01 | Phase 1 | Pending |
| PSET-02 | Phase 1 | Pending |
| PSET-03 | Phase 1 | Pending |
| PSET-04 | Phase 1 | Pending |
| PSET-05 | Phase 1 | Pending |
| UI-01 | Phase 1 | Pending |
| UI-02 | Phase 1 | Pending |
| UI-03 | Phase 1 | Pending |
| UI-04 | Phase 1 | Pending |
| UI-05 | Phase 1 | Pending |
| UI-06 | Phase 1 | Pending |
| UI-07 | Phase 1 | Pending |
| UI-08 | Phase 1 | Pending |
| UI-09 | Phase 1 | Pending |
| UI-10 | Phase 1 | Pending |
| UI-11 | Phase 1 | Pending |
| UI-12 | Phase 1 | Pending |
| UI-13 | Phase 1 | Pending |
| UI-14 | Phase 1 | Pending |
| UI-15 | Phase 1 | Pending |
| UI-16 | Phase 1 | Pending |
| INFRA-01 | Phase 1 | Pending |
| INFRA-02 | Phase 1 | Pending |
| INFRA-03 | Phase 1 | Pending |

**Coverage: 30/30 v1 requirements mapped to Phase 1**

---
*Requirements defined: 2026-03-14*
*Last updated: 2026-03-20 — GATE (×6), AUTH (×4), PAY (×5) removed; tool is free and unlimited*
