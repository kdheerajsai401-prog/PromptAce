# PromptForge

## What This Is

PromptForge is a Universal Prompt Intelligence Engine SaaS. Anyone describes what they want in plain English — PromptForge detects intent across 16 AI tool categories, applies deep specialist principles, and outputs the perfect prompt for the right AI tool. Built through 10 iterations, v10 is the reference implementation being converted to a production Next.js app.

## Core Value

Turn any plain English description into the perfect AI prompt instantly — so anyone can get professional-quality results from AI tools without knowing how to prompt.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] User inputs plain English → forge detects intent → outputs structured prompt JSON
- [ ] Full v10 UI faithfully converted to Next.js (intent badge, score animation, 4 output tabs, alerts, copy UX)
- [ ] 12 example chips in header for instant exploration
- [ ] Text risk detection alert (orange) + unknown technique alert (green)
- [ ] Copy individual sections + "Copy Everything" button
- [ ] API key secured server-side in route.ts — never client-side
- [ ] 3 free forge uses per visitor (no account required)
- [ ] Login/signup wall after 3 free uses
- [ ] Paid plan gating via Stripe
- [ ] Dark theme exactly: bg #030407, surface #070910, card #0B0D16, DM Sans + JetBrains Mono
- [ ] Mobile responsive (left panel stacks on top)
- [ ] Brand DNA accordion (brand name, tone, audience — injected as context into forge)
- [ ] Vercel deployment with environment variables

### Out of Scope

- Prompt history / saving — complexity not needed for v1, add in v2 after validating core value
- Multi-model support (GPT, Gemini) — stay focused on the engine, not model switching
- Team/agency features — single-user focus for MVP
- Image/file uploads to PromptForge itself — we generate prompts, we don't process media
- Custom intent categories — v1 ships with the 16 trained categories only

## Context

- v10 reference component lives at `/reference/referencepromptforge-v10.jsx` — exact UI/UX and AI system prompt reference. The JSX contains the full embedded system prompt with specialist formulas for all 16 intent categories.
- The system prompt is the product's core IP — it lives in `lib/system-prompt.ts` and must never be shortened or trimmed.
- Design tokens are locked (see CLAUDE.md). UI fidelity to the v10 design is mandatory.
- The 16 intent categories span: IMAGE_GENERATION · PHOTO_TRANSFORMATION · FACE_SWAP_SCENE · ART_STYLE_TRANSFER · THREE_D_LOGO_RENDER · VIDEO_GENERATION · VIDEO_SERIES · IMAGE_TO_VIDEO · INTERACTIVE_SESSION · MUSIC_GENERATION · VOICE_DESIGN · CONTENT_STRATEGY · BUSINESS_WRITING · EDUCATION_LEARNING · CREATIVE_WRITING · CODE_GENERATION
- Model: `claude-sonnet-4-6` via Anthropic API
- Target: Vercel deployment

## Constraints

- **API Security**: Anthropic API key must only exist server-side in route.ts — hard requirement
- **System Prompt Integrity**: Full system prompt must be preserved exactly — it's the trained intelligence
- **UI Fidelity**: Dark theme design tokens are non-negotiable — exact colors, fonts, layout
- **Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS — no deviation
- **Deployment**: Vercel — infrastructure choice already made
- **Business Model**: Freemium — 3 free uses → login wall → Stripe payment. Auth + DB needed.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js 14 App Router | Standard for modern Next.js, server components, server actions | — Pending |
| Anthropic API server-side only | Security — API key exposure risk in client | — Pending |
| Freemium with 3 free uses | Low friction to try, captures value before payment friction | — Pending |
| Brand DNA accordion in v1 | Differentiator — brand context improves prompt quality for content creators | — Pending |
| Stripe for payments | Industry standard, good Next.js integration, webhooks for auth sync | — Pending |

---
*Last updated: 2026-03-14 after initialization*
