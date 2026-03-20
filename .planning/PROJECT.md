# PromptForge

## What This Is

PromptForge is a Universal Prompt Intelligence Engine. Anyone describes what they want in plain English — PromptForge detects intent across 16 AI tool categories, applies deep specialist principles, and outputs the perfect prompt for the right AI tool. Built through 10 iterations, v10 is the AI brain reference. The UI is being fully redesigned (not a copy of v10) — dark, premium, modern, with a preset category selector as the entry point.

## Core Value

Turn any plain English description into the perfect AI prompt instantly — so anyone can get professional-quality results from AI tools without knowing how to prompt.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] User inputs plain English → forge detects intent → outputs structured prompt JSON
- [ ] Preset category selector (Photo Gen, Video Gen, Game Design, AI Prompt Enhancer, Music, Writing, etc.) as primary entry point
- [ ] Fully redesigned dark UI using ui-ux-pro-max skill — more visually interesting than v10, premium feel
- [ ] All v10 AI output features preserved: intent badge, score animation, 4 output tabs, alerts, copy UX
- [ ] Brand DNA accordion — brand context injected into every forge
- [ ] API key secured server-side — never client-side
- [ ] Mobile responsive
- [ ] Vercel deployment
- [ ] Completely free — no login, no usage limits, no payments

### Out of Scope

- Auth / login / accounts — not needed, tool is fully anonymous and free
- Usage gating / freemium limits — tool is free and unlimited
- Stripe payments — no monetization in v1
- Prompt history / saving — complexity not needed for v1
- Multi-model support (GPT, Gemini) — stay focused on the engine
- Team/agency features — single-user focus for MVP
- Image/file uploads to PromptForge itself — we generate prompts, we don't process media
- Custom intent categories — v1 ships with the 16 trained categories only

## Context

- v10 reference component lives at `/reference/referencepromptforge-v10.jsx` — the AI system prompt (16 intent categories + specialist formulas) is the sacred IP reference. UI/UX from v10 is the functional baseline only — the visual design is being fully redesigned.
- The system prompt is the product's core IP — it lives in `lib/system-prompt.ts` and must never be shortened or trimmed.
- UI redesign direction: dark, premium, modern. Use ui-ux-pro-max skill. Inspired by generateprompt.ai's per-category UX structure. Preset selector is the hero element (replaces example chips). More visual hierarchy, better empty states, richer output display.
- Competitor reference: generateprompt.ai — liked their category-focused approach. PromptForge's engine is superior — the UI should reflect that premium positioning.
- The 16 intent categories span: IMAGE_GENERATION · PHOTO_TRANSFORMATION · FACE_SWAP_SCENE · ART_STYLE_TRANSFER · THREE_D_LOGO_RENDER · VIDEO_GENERATION · VIDEO_SERIES · IMAGE_TO_VIDEO · INTERACTIVE_SESSION · MUSIC_GENERATION · VOICE_DESIGN · CONTENT_STRATEGY · BUSINESS_WRITING · EDUCATION_LEARNING · CREATIVE_WRITING · CODE_GENERATION
- Model: `claude-sonnet-4-6` via Anthropic API
- Target: Vercel deployment

## Constraints

- **API Security**: Anthropic API key must only exist server-side in route.ts — hard requirement
- **System Prompt Integrity**: Full system prompt must be preserved exactly — it's the trained intelligence
- **UI Direction**: Dark, premium redesign using ui-ux-pro-max skill — inspired by generateprompt.ai UX structure but with PromptForge's superior engine. v10 design tokens are a starting point, not a constraint. Preset selector replaces example chips as primary entry.
- **Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS — no deviation
- **Deployment**: Vercel — infrastructure choice already made
- **Free Forever**: No auth, no usage limits, no payments — completely open access

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js 14 App Router | Standard for modern Next.js, server components, server actions | — Pending |
| Anthropic API server-side only | Security — API key exposure risk in client | — Pending |
| Completely free | Max reach, zero friction — anyone can use it without signing up | — Decided |
| Brand DNA accordion in v1 | Differentiator — brand context improves prompt quality for content creators | — Pending |
| No auth / no DB needed | Free + anonymous model eliminates Clerk, Neon, Drizzle entirely | — Decided |

---
*Last updated: 2026-03-20 — business model changed from freemium to completely free*
