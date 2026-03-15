# Phase 1: Foundation + Core Forge Engine — Context

**Gathered:** 2026-03-14
**Status:** Ready for planning
**Source:** Direct user input during GSD new-project initialization

<domain>
## Phase Boundary

Phase 1 delivers a fully working PromptForge for anonymous visitors — they can arrive, select a preset or type freely, forge their description into a specialist AI prompt, and see the full output rendered with all UX features. No auth, no payment, no usage limits. Just the core engine and the full UI.

Security baselines (API key protection, system prompt server-only, input caps) are wired in from day one — they cannot be retrofitted later.

</domain>

<decisions>
## Implementation Decisions

### UI Redesign Direction
- The v10 React artifact at `/reference/referencepromptforge-v10.jsx` is the **AI brain reference only** — the ForgeResult schema, output structure, and specialist formulas are sacred. The visual design is NOT a copy.
- The UI must be **fully redesigned** using the `ui-ux-pro-max` skill — dark, premium, modern, visually interesting.
- Inspiration: generateprompt.ai (https://generateprompt.ai/en) — liked their per-category UX approach and clean structure. PromptForge's engine is superior — the UI should reflect that premium positioning.
- Dark theme is kept but extended: bg #030407 and DM Sans + JetBrains Mono are baseline tokens, not a constraint ceiling. Richer gradients, micro-interactions, and visual hierarchy are expected.

### Preset Category Selector — PRIMARY ENTRY POINT
- Replace the v10 "example chips in header" with a **hero preset selector** as the primary entry UX.
- Presets are the first thing users see. They replace blank-slate paralysis.
- Required presets (minimum 8, visible in hero):
  - 📸 Photo Generation
  - 🎬 Video Generation
  - 🎮 Game Design
  - ✨ AI Prompt Enhancer
  - 🎵 Music Generation
  - ✍️ Creative Writing
  - 💼 Business Writing
  - 💻 Code Generation
- Presets map to PromptForge's 16 intent categories (many presets cover multiple categories).
- Clicking a preset: highlights the card, pre-fills a contextual placeholder in the text input, passes the preset hint to the forge engine.
- User can ignore presets and type freely — the engine auto-detects intent regardless.

### Output Display
- All v10 output features are preserved functionally:
  - Intent badge (emoji + category label)
  - Score animation (0 → target for both original and forged scores)
  - Score reason displayed below scores
  - 4 output tabs: PROMPT / NEGATIVE / BOLD / EXPERIMENTAL
  - Tool recommendation with reason
  - Tips list
  - Parameters section (when present)
  - text_risk orange alert
  - unknown_technique green alert
  - Copy per section + "Copy Everything"
- The visual presentation of these can be redesigned (better cards, better tabs, richer layout) — but the data and interactions must all work.

### Brand DNA Accordion
- Ships in Phase 1 as a free-tier differentiator.
- Expandable accordion in the input panel.
- Fields: Brand Name, Tone of Voice, Target Audience, (optionally: Industry, Keywords).
- Content is appended to the forge request as additional context.
- No auth required to use it.

### Loading State
- Rotating messages while forging (not a generic spinner).
- Messages should feel intelligent and playful — e.g., "Detecting intent...", "Applying specialist principles...", "Crafting your perfect prompt...".
- The forge call is NOT streamed — it awaits complete JSON then reveals with animation.

### Empty State
- When no forge has run yet, show the preset selector prominently + the text input.
- After preset selection, the output panel should show contextual "what you'll get" previews.

### Security (Non-Negotiable)
- `server-only` package on `lib/system-prompt.ts` — verified at build time.
- API key only in `app/api/forge/route.ts` — never in client bundle.
- Input cap: 2000 chars enforced server-side before calling Anthropic.
- `max_tokens: 2000` on every Anthropic API call.
- Forge route: `export const maxDuration = 60; export const runtime = 'nodejs'`.

### Next.js Setup
- Next.js 14 App Router.
- Tailwind CSS v3 (verify v4 compat before starting — use v3 if uncertain).
- TypeScript throughout.
- Zustand for client state (loading state, active tab, forge result, selected preset, brand DNA values).
- Do NOT stream the response — batch await + animated reveal on completion.

### Vercel Infrastructure (in this phase)
- `vercel.json` or `next.config.ts` with maxDuration.
- `.env.local` with ANTHROPIC_API_KEY (documented in README with no values).
- All secrets via Vercel environment variables.

### What is NOT in Phase 1
- No auth (Clerk setup is Phase 2)
- No usage tracking/gating (Phase 2)
- No Stripe (Phase 3)
- No per-category routes/pages (v2)
- No prompt history (v2)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### AI Brain (Sacred — Never Modify)
- `reference/referencepromptforge-v10.jsx` — Full v10 component with embedded system prompt. Extract ONLY the SYSTEM const for lib/system-prompt.ts. Do not copy UI code.

### Project Context
- `.planning/PROJECT.md` — Project goals, constraints, decisions
- `.planning/REQUIREMENTS.md` — Full v1 requirements (focus on ENG-*, PSET-*, UI-*, INFRA-*)
- `.planning/ROADMAP.md` — Phase structure and success criteria
- `.planning/research/SUMMARY.md` — Research synthesis (stack, features, architecture, pitfalls)
- `.planning/research/STACK.md` — Tech stack decisions (Clerk, Neon, Drizzle, Zustand, Tailwind v3)
- `.planning/research/ARCHITECTURE.md` — Component structure, data flow, build order
- `.planning/research/PITFALLS.md` — Critical pitfalls to avoid in Phase 1

### UI Skill
- `.claude/skills/ui-ux-pro-max/SKILL.md` — ui-ux-pro-max skill. MUST be used for all UI/component design work in this phase.

</canonical_refs>

<specifics>
## Specific Ideas

### Preset Selector Visual Ideas
- Grid of cards (2×4 or 3×3 layout) with icon, label, short description
- Hover: subtle glow effect matching the category color
- Selected: border highlight, card lifts with shadow
- Possibly show a "Popular" badge on top presets (Photo Gen, Video Gen)
- Below the grid: "Or describe anything →" to encourage free-text input

### Score Display
- Two score chips side by side: "ORIGINAL: 23" and "FORGED: 91"
- Arrow or contrast visual between them to show the improvement
- Counter animates up from 0 on result display
- Score reason shown as a small italic caption

### Output Tabs
- Pill-style tabs: PROMPT | NEGATIVE | BOLD | EXPERIMENTAL
- Active tab has accent color (gold/goldBright from design tokens)
- Tab content shown in JetBrains Mono (monospace, code-like)
- Copy button per tab, top-right corner

### generateprompt.ai Inspiration
- Their approach of having per-category entry points is the key takeaway
- The preset selector IS our version of that — a category-aware entry that makes the tool feel tailored
- Their site is lighter (indigo/white) — PromptForge stays dark but should feel equally organized and clear

</specifics>

<deferred>
## Deferred Ideas

- Per-category landing pages (/image-generation, /video-generation) — v2, SEO phase
- Prompt history — explicitly v2
- Social sharing of forged prompts — out of scope
- Custom presets / user-defined categories — out of scope for v1

</deferred>

---
*Phase: 01-foundation-core-forge-engine*
*Context gathered: 2026-03-14 from user direction during GSD initialization*
