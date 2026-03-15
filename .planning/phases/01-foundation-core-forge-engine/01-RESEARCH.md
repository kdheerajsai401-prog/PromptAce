# Phase 1: Foundation + Core Forge Engine — Research

**Researched:** 2026-03-14
**Domain:** Next.js 14 App Router, Anthropic SDK, Tailwind v3, Zustand, premium dark SaaS UI
**Confidence:** HIGH (stack fully verified in prior project research; v10 reference read directly)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **UI Redesign Direction:** The v10 React artifact at `/reference/referencepromptforge-v10.jsx` is the AI brain reference only — the ForgeResult schema, output structure, and specialist formulas are sacred. The visual design is NOT a copy. The UI must be fully redesigned using the `ui-ux-pro-max` skill — dark, premium, modern, visually interesting.
- **Inspiration:** generateprompt.ai (https://generateprompt.ai/en) — per-category UX and clean structure. PromptForge's engine is superior — the UI should reflect premium positioning. Dark theme stays but is extended: bg #030407 and DM Sans + JetBrains Mono are baseline tokens, not a constraint ceiling. Richer gradients, micro-interactions, and visual hierarchy are expected.
- **Preset Category Selector — PRIMARY ENTRY POINT:** Replace the v10 example chips in the header. Presets are the first thing users see. Required 8 presets (minimum, visible in hero): Photo Generation, Video Generation, Game Design, AI Prompt Enhancer, Music Generation, Creative Writing, Business Writing, Code Generation. Presets map to 16 intent categories. Clicking a preset highlights the card, pre-fills contextual placeholder, passes preset hint to the forge engine. User can ignore presets and type freely.
- **Output Display:** All v10 output features preserved functionally: intent badge, score animation (0 → target both scores), score reason, 4 tabs (PROMPT / NEGATIVE / BOLD / EXPERIMENTAL), tool recommendation + reason, tips, parameters, text_risk orange alert, unknown_technique green alert, copy per section + Copy Everything. Visual presentation can be redesigned.
- **Brand DNA Accordion:** Ships in Phase 1 as free-tier differentiator. Expandable accordion. Fields: Brand Name, Tone of Voice, Target Audience (optionally Industry, Keywords). Content appended to forge request.
- **Loading State:** Rotating messages while forging (not a generic spinner). Forge call is NOT streamed — awaits complete JSON then reveals with animation.
- **Security (Non-Negotiable):** `server-only` package on `lib/system-prompt.ts`. API key only in `app/api/forge/route.ts`. Input cap 2000 chars enforced server-side. `max_tokens: 2000` on every Anthropic API call. Forge route: `export const maxDuration = 60; export const runtime = 'nodejs'`.
- **Next.js Setup:** Next.js 14 App Router. Tailwind CSS v3. TypeScript throughout. Zustand for client state. Do NOT stream the response — batch await + animated reveal on completion.
- **Vercel Infrastructure (this phase):** `vercel.json` or `next.config.ts` with maxDuration. `.env.local` with ANTHROPIC_API_KEY documented in README. All secrets via Vercel env vars.

### Claude's Discretion

- Richer gradients, micro-interactions, visual hierarchy beyond the base design tokens are expected — exact choices are the implementer's creative call, informed by `ui-ux-pro-max`.
- Preset card visual design (colors, glow effects, "Popular" badge choices) is discretionary.
- Score display layout (side-by-side chips, arrow/contrast visual between them) is discretionary.
- Output tab style (pill-style vs other) is discretionary but gold/goldBright accent is specified.
- Preset selector card layout (2×4 or 3×3 grid) is discretionary.
- Whether to use Framer Motion or pure CSS setInterval animation for the score counter is discretionary.
- Exact Brand DNA field names can be adjusted (Brand Name, Tone of Voice, Target Audience suggested; Industry, Keywords optional).

### Deferred Ideas (OUT OF SCOPE)

- Per-category landing pages (/image-generation, /video-generation) — v2, SEO phase
- Prompt history — explicitly v2
- Social sharing of forged prompts — out of scope
- Custom presets / user-defined categories — out of scope for v1
- Auth (Clerk setup is Phase 2)
- Usage tracking/gating (Phase 2)
- Stripe (Phase 3)
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ENG-01 | User submits plain English description and receives structured ForgeResult JSON from Anthropic API | Anthropic SDK `messages.create()` non-streaming pattern; Zod validation of response |
| ENG-02 | System prompt with all 16 intent categories deployed server-side in lib/system-prompt.ts, never trimmed | `server-only` package pattern; extract SYSTEM const from v10 reference verbatim |
| ENG-03 | API key stored server-side only in route.ts — never exposed to client bundle | Route Handler isolation; `server-only` guard; never `NEXT_PUBLIC_` prefix |
| ENG-04 | `server-only` package guards lib/system-prompt.ts from being imported in client components | `import 'server-only'` pattern; Next.js build-time error on client import |
| ENG-05 | Forge route handles malformed JSON from LLM gracefully (retry once, return user-facing error on second failure) | Try/catch + markdown fence strip + Zod validation + retry-once pattern |
| ENG-06 | Input capped at 2000 characters and max_tokens set on every API call | Server-side length check in route.ts; `max_tokens: 2000` in SDK call |
| PSET-01 | User sees grid of 8 preset category cards in hero/landing area | Card grid component; 8 presets mapped to Lucide icons + descriptions |
| PSET-02 | Clicking preset pre-selects category and pre-fills input with contextual placeholder | Zustand store selectedPreset state; textarea placeholder swap |
| PSET-03 | Selected preset visually highlighted and passed as hint to forge engine | Zustand store; API body includes `presetHint` field; card border/glow |
| PSET-04 | User can type freely without selecting preset (engine auto-detects intent from free text) | Preset is advisory only; no required field; engine always detects intent |
| PSET-05 | Presets have icons and short descriptions communicating what they generate | Lucide icons (SVG) + short descriptions in preset config array |
| UI-01 | Fully redesigned dark premium UI (not v10 copy) — two-panel desktop, single column mobile | ui-ux-pro-max design system invocation; Tailwind responsive grid |
| UI-02 | Intent badge displays detected category emoji + label after forge | IntentBadge component; reads `intent_emoji` + `intent_label` from ForgeResult |
| UI-03 | Score counter animates from 0 to target for both score_original and score_forged | setInterval-based counter or Framer Motion; triggers on result state change |
| UI-04 | Output panel has 4 tabs: PROMPT / NEGATIVE / BOLD / EXPERIMENTAL | Radix UI Tabs or custom pill tabs; activeTab Zustand state |
| UI-05 | Copy button on each output section copies to clipboard | navigator.clipboard.writeText(); copied state per section |
| UI-06 | Copy Everything button copies all output sections as formatted text | Composite string builder; single clipboard write |
| UI-07 | Loading state displays rotating messages while forging | setInterval cycling LOAD_MSGS array; messages feel intelligent |
| UI-08 | Empty state displays 8 category cards before first forge | Same preset card components reused in output area empty state |
| UI-09 | text_risk flag displays orange alert with text_risk_note | Conditional AlertBanner; orange border-left card pattern |
| UI-10 | unknown_technique flag displays green alert with technique_flag message | Conditional AlertBanner; green border-left card pattern |
| UI-11 | Tool recommendation displays tool name + tool_reason | Tool card component; reads `tool` + `tool_reason` |
| UI-12 | Tips section displays all tips[] items | Numbered list; reads `tips` array |
| UI-13 | Parameters section displays when present with parameters_label | Conditional panel; reads `parameters` + `parameters_label` |
| UI-14 | Brand DNA accordion — expandable panel, fields appended to forge context | Controlled accordion; Zustand brandDNA state; appended to API body |
| UI-15 | Example chips or quick-start suggestions within/below preset selector | Chip row below preset grid or within text input area |
| UI-16 | Dark premium design system — base tokens as starting point, extended | tailwind.config.ts custom colors; richer gradients/interactions via ui-ux-pro-max |
| INFRA-01 | Next.js app deploys to Vercel with maxDuration = 60 on forge route | `export const maxDuration = 60` + `export const runtime = 'nodejs'` in route.ts |
| INFRA-02 | All secrets stored in Vercel environment variables | Document in .env.local; set in Vercel dashboard; never NEXT_PUBLIC_ for secrets |
| INFRA-03 | .env.local documented in README with required variable names (no values) | README section listing ANTHROPIC_API_KEY |
</phase_requirements>

---

## Summary

Phase 1 delivers the complete PromptForge experience for anonymous visitors: preset selection, text input, forge → ForgeResult, animated output display with all 4 tabs, copy UX, Brand DNA, and all security hardening. The project starts from a blank directory — no Next.js app has been initialized yet.

The primary technical complexity is concentrated in two areas: (1) the Anthropic Route Handler with correct security posture (server-only system prompt, API key isolation, input caps, JSON parse/retry), and (2) the UI redesign using `ui-ux-pro-max` to produce a premium dark SaaS aesthetic that is visually superior to the v10 artifact while preserving all functional output features exactly.

The v10 reference at `/reference/referencepromptforge-v10.jsx` contains the complete AI system prompt (the SYSTEM const starting at line 14) — this must be extracted verbatim into `lib/system-prompt.ts`. The v10 UI code (inline styles, component structure) must NOT be copied — it is a React artifact, not a Next.js app, and the design direction requires a full redesign via `ui-ux-pro-max`.

**Primary recommendation:** Initialize the Next.js 14 app first, define all TypeScript types and the Zustand store, wire the forge API route with security hardening, then build the redesigned UI components invoking `ui-ux-pro-max` for each design decision. Build in the order: setup → types → store → API route → components.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 14.x | Full-stack framework, App Router | App Router collocates server Route Handlers for API key isolation |
| typescript | 5.x | Type safety | Non-negotiable; catches ForgeResult shape mismatches at compile time |
| tailwindcss | 3.4.x | Utility CSS | Ships with create-next-app@14; v3 has zero Next.js 14 integration risk |
| @anthropic-ai/sdk | latest | Anthropic API client | Official SDK; `messages.create()` for batch JSON response |
| zustand | 4.x | Client state management | 2KB; zero boilerplate; correct fit for forge input/result/tab/preset state |
| zod | 3.x | Schema validation | Validates ForgeResult shape from LLM before passing to client |
| server-only | latest | Build-time guard for server modules | Throws Next.js build error if `lib/system-prompt.ts` is imported client-side |
| lucide-react | latest | SVG icon library | Tree-shakeable; consistent stroke style; no emoji-as-icons (per ui-ux-pro-max) |
| clsx + tailwind-merge | latest | Conditional className utility | Standard pattern for Tailwind class merging without conflicts |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| framer-motion | 11.x | Score counter animation + micro-interactions | Use if smooth spring-physics animation is needed (ui-ux-pro-max recommends spring curves); adds ~30KB |
| @radix-ui/react-tabs | latest | Accessible headless tab primitive | Use for the 4-tab output panel if building custom tab UI on top of Radix |
| @radix-ui/react-accordion | latest | Accessible headless accordion | Use for Brand DNA accordion — keyboard nav, ARIA attributes built in |
| sonner | latest | Toast notifications | Better RSC/Next.js 14 dark theme compat than react-hot-toast |
| next/font | built-in | Google font loading (DM Sans, JetBrains Mono) | Eliminates FOUT; subsets automatically |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Zustand | useState in PromptForge.tsx | useState is fine if ALL state lives in one component. Zustand adds preset selection from child without prop drilling. Either works for Phase 1. |
| Radix UI Tabs | Custom tab pill buttons | Custom pills require manual ARIA; Radix handles keyboard nav and focus management. Custom is fine for this simple use case. |
| Framer Motion | setInterval counter (v10 approach) | v10's setInterval (n += 2, every 14ms) is smooth and adds zero bundle weight. Use this unless spring physics are needed. |
| tailwindcss v3 | tailwindcss v4 | v4 may be viable by March 2026 but STACK.md recommends v3 for safety. Verify before setup. |

**Installation:**
```bash
npx create-next-app@14 promptforge --typescript --tailwind --app --src-dir=false
npm install @anthropic-ai/sdk zustand zod server-only lucide-react clsx tailwind-merge
npm install @radix-ui/react-tabs @radix-ui/react-accordion sonner
npm install framer-motion  # optional — only if using Framer for score animation
npm install -D prettier prettier-plugin-tailwindcss
```

---

## Architecture Patterns

### Recommended Project Structure

```
promptforge/
├── app/
│   ├── page.tsx                    # Server Component shell — renders PromptForge client component
│   ├── layout.tsx                  # Font loading (next/font), metadata, global CSS, bg #030407
│   ├── globals.css                 # Tailwind directives + custom CSS (scrollbar, placeholder styles)
│   └── api/
│       └── forge/
│           └── route.ts            # POST handler — Anthropic call with all security hardening
├── components/
│   ├── PromptForge.tsx             # "use client" root — owns ALL interactive state via Zustand
│   ├── PresetSelector.tsx          # 8-card grid; selected state; placeholder injection
│   ├── InputPanel.tsx              # Left panel — PresetSelector + textarea + BrandDNA + ForgeButton
│   ├── OutputPanel.tsx             # Right panel — empty state / loading / result
│   ├── BrandDNAAccordion.tsx       # Radix Accordion with 3 fields
│   ├── ForgeButton.tsx             # Disabled/loading/active states
│   ├── IntentBadge.tsx             # intent_emoji + intent_label card
│   ├── ScoreDisplay.tsx            # Original + Forged scores with animation
│   ├── OutputTabs.tsx              # 4-tab pill bar + tab content
│   ├── AlertBanner.tsx             # Reusable: text_risk (orange) + unknown_technique (green)
│   ├── ToolCard.tsx                # tool + tool_reason display
│   ├── TipsList.tsx                # Numbered tips[] display
│   ├── CopyButton.tsx              # Reusable copy with "COPIED" state flash
│   └── LoadingState.tsx            # Rotating messages + animated indicator
├── lib/
│   ├── system-prompt.ts            # import 'server-only'; export const SYSTEM_PROMPT = `...` (from v10)
│   ├── forge-types.ts              # ForgeResult TypeScript interface (re-exported from types)
│   └── presets.ts                  # Preset config array (label, icon, description, hint, placeholder)
├── store/
│   └── forge-store.ts              # Zustand store — all client state
├── types/
│   └── index.ts                    # ForgeResult, ForgeRequest, PresetConfig types
├── .env.local                      # ANTHROPIC_API_KEY=sk-ant-... (gitignored)
├── tailwind.config.ts              # Custom color tokens + font families
├── next.config.ts                  # Standard Next.js 14 config
└── README.md                       # Setup instructions + .env.local variables documented
```

### Pattern 1: Non-Streaming Anthropic Route Handler with Security Hardening

**What:** The forge Route Handler calls Anthropic with `messages.create()` (not `stream()`), awaits the complete JSON response, validates it with Zod, then returns it as a standard JSON response. This is the correct pattern because ForgeResult is a structured JSON object — streaming partial JSON is unparseable.

**When to use:** Any LLM call where the output is consumed as a complete JSON object, not displayed as streaming prose.

```typescript
// app/api/forge/route.ts
import 'server-only' // Belt-and-suspenders guard (server-only is also enforced by Next.js route location)
import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT } from '@/lib/system-prompt'
import { ForgeResultSchema } from '@/types'

export const maxDuration = 60
export const runtime = 'nodejs'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  const { input, presetHint, brandDNA } = await request.json()

  // SECURITY: Server-side input cap (2000 chars) — do not trust client validation
  if (!input || typeof input !== 'string') {
    return Response.json({ error: 'Invalid input' }, { status: 400 })
  }
  if (input.length > 2000) {
    return Response.json({ error: 'Input exceeds 2000 character limit' }, { status: 400 })
  }

  // Build user message with optional preset hint and Brand DNA
  let userMessage = input.trim()
  if (presetHint) userMessage = `[Category hint: ${presetHint}]\n\n${userMessage}`
  if (brandDNA?.brandName || brandDNA?.tone || brandDNA?.audience) {
    userMessage += '\n\nBrand DNA:'
    if (brandDNA.brandName) userMessage += `\nBrand: ${brandDNA.brandName}`
    if (brandDNA.tone) userMessage += `\nTone: ${brandDNA.tone}`
    if (brandDNA.audience) userMessage += `\nAudience: ${brandDNA.audience}`
  }

  // Attempt 1
  const raw = await callAnthropic(userMessage)
  const result1 = tryParse(raw)
  if (result1.ok) return Response.json(result1.data)

  // Retry with explicit JSON instruction (ENG-05)
  const retryMessage = userMessage + '\n\nIMPORTANT: Respond with pure JSON only. No markdown fences, no explanation.'
  const raw2 = await callAnthropic(retryMessage)
  const result2 = tryParse(raw2)
  if (result2.ok) return Response.json(result2.data)

  return Response.json({ error: 'Failed to generate. Try rephrasing your idea.' }, { status: 500 })
}

async function callAnthropic(userMessage: string) {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000, // ENG-06: always set max_tokens
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  })
  return message.content[0].type === 'text' ? message.content[0].text : ''
}

function tryParse(raw: string) {
  try {
    // Strip markdown code fences before parsing (ENG-05)
    const clean = raw.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
    const parsed = JSON.parse(clean)
    const validated = ForgeResultSchema.parse(parsed) // Zod validation
    return { ok: true as const, data: validated }
  } catch {
    return { ok: false as const }
  }
}
```

### Pattern 2: Server-Only System Prompt Module

**What:** `lib/system-prompt.ts` contains the full SYSTEM const from the v10 reference. The `import 'server-only'` guard causes a Next.js build error if this module is accidentally imported from a client component.

**When to use:** Any module that contains API keys, secrets, or code that must never reach the browser bundle.

```typescript
// lib/system-prompt.ts
import 'server-only'

// SOURCE: reference/referencepromptforge-v10.jsx — SYSTEM const (lines 14–516)
// SACRED: Never trim, never modify, never abbreviate.
export const SYSTEM_PROMPT = `You are PromptForge v10 — the world's most advanced Universal Prompt Intelligence Engine.
// ... full SYSTEM const extracted verbatim from v10 reference ...
`
```

### Pattern 3: Zustand Store for All Client State

**What:** A single Zustand store owns all interactive state. `PromptForge.tsx` is the single `"use client"` boundary — all child components read/write via the store without `"use client"` on each.

**When to use:** Multi-component client state where prop drilling would be required.

```typescript
// store/forge-store.ts
import { create } from 'zustand'
import type { ForgeResult, PresetConfig } from '@/types'

type ForgeStatus = 'idle' | 'loading' | 'success' | 'error'

interface ForgeStore {
  // Forge state
  input: string
  status: ForgeStatus
  result: ForgeResult | null
  errorMessage: string | null
  // UI state
  activeTab: 'prompt' | 'negative' | 'bold' | 'experimental'
  loadMsgIndex: number
  // Preset state
  selectedPreset: PresetConfig | null
  // Brand DNA state
  brandDNAOpen: boolean
  brandDNA: { brandName: string; tone: string; audience: string }
  // Actions
  setInput: (input: string) => void
  setStatus: (status: ForgeStatus) => void
  setResult: (result: ForgeResult) => void
  setError: (msg: string) => void
  setActiveTab: (tab: ForgeStore['activeTab']) => void
  setLoadMsgIndex: (idx: number) => void
  selectPreset: (preset: PresetConfig | null) => void
  setBrandDNAOpen: (open: boolean) => void
  setBrandDNA: (dna: Partial<ForgeStore['brandDNA']>) => void
  reset: () => void
}

export const useForgeStore = create<ForgeStore>((set) => ({
  input: '',
  status: 'idle',
  result: null,
  errorMessage: null,
  activeTab: 'prompt',
  loadMsgIndex: 0,
  selectedPreset: null,
  brandDNAOpen: false,
  brandDNA: { brandName: '', tone: '', audience: '' },
  setInput: (input) => set({ input }),
  setStatus: (status) => set({ status }),
  setResult: (result) => set({ result, status: 'success' }),
  setError: (errorMessage) => set({ errorMessage, status: 'error' }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setLoadMsgIndex: (loadMsgIndex) => set({ loadMsgIndex }),
  selectPreset: (selectedPreset) => set({ selectedPreset }),
  setBrandDNAOpen: (brandDNAOpen) => set({ brandDNAOpen }),
  setBrandDNA: (dna) => set((s) => ({ brandDNA: { ...s.brandDNA, ...dna } })),
  reset: () => set({ result: null, errorMessage: null, status: 'idle' }),
}))
```

### Pattern 4: ForgeResult TypeScript Type + Zod Schema

**What:** The ForgeResult interface is extracted from the v10 reference and CLAUDE.md. A Zod schema mirrors the interface for runtime validation of Anthropic responses.

```typescript
// types/index.ts
export interface ForgeResult {
  intent_category: string
  intent_subtype: string
  intent_label: string
  intent_emoji: string
  score_original: number
  score_forged: number
  score_reason: string
  text_risk?: boolean
  text_risk_note?: string
  unknown_technique?: boolean
  technique_flag?: string
  prompt: string
  negative_prompt?: string
  tool: string
  tool_reason: string
  parameters?: string
  parameters_label?: string
  tips: string[]
  variation_bold: string
  variation_experimental: string
}

export interface PresetConfig {
  id: string
  label: string
  icon: string           // Lucide icon name
  description: string    // Short "what you'll get" copy
  hint: string           // Sent to API as presetHint
  placeholder: string    // Shown in textarea when preset selected
}

export interface ForgeRequest {
  input: string
  presetHint?: string
  brandDNA?: {
    brandName?: string
    tone?: string
    audience?: string
  }
}

// Zod schema for runtime validation (in lib/forge-schema.ts or types/index.ts)
import { z } from 'zod'

export const ForgeResultSchema = z.object({
  intent_category: z.string(),
  intent_subtype: z.string(),
  intent_label: z.string(),
  intent_emoji: z.string(),
  score_original: z.number(),
  score_forged: z.number(),
  score_reason: z.string(),
  text_risk: z.boolean().optional(),
  text_risk_note: z.string().optional(),
  unknown_technique: z.boolean().optional(),
  technique_flag: z.string().optional(),
  prompt: z.string(),
  negative_prompt: z.string().optional(),
  tool: z.string(),
  tool_reason: z.string(),
  parameters: z.string().optional(),
  parameters_label: z.string().optional(),
  tips: z.array(z.string()),
  variation_bold: z.string(),
  variation_experimental: z.string(),
})
```

### Pattern 5: Score Counter Animation (setInterval, no Framer dependency)

**What:** The v10 approach — increment by 2 every 14ms — produces a smooth counter that takes ~700ms for a score of 91. This is the simplest approach with zero extra bundle cost.

**When to use:** Score animation on result reveal. Run both score_original and score_forged animations simultaneously, triggered by `result` state change.

```typescript
// Inside ScoreDisplay.tsx (client component, inherits from PromptForge.tsx)
useEffect(() => {
  if (!result) return
  let orig = 0
  let forged = 0
  const targetOrig = result.score_original
  const targetForged = result.score_forged
  const t = setInterval(() => {
    orig = Math.min(orig + 2, targetOrig)
    forged = Math.min(forged + 2, targetForged)
    setOrigAnim(orig)
    setForgedAnim(forged)
    if (orig >= targetOrig && forged >= targetForged) clearInterval(t)
  }, 14)
  return () => clearInterval(t)
}, [result])
```

### Pattern 6: Preset Selector Component

**What:** An 8-card grid (CSS Grid 2×4 or 4×2 responsive) where each card shows an SVG icon (Lucide), label, and short description. Selection state drives a highlighted card and injects a contextual placeholder into the textarea.

```typescript
// lib/presets.ts
import type { PresetConfig } from '@/types'

export const PRESETS: PresetConfig[] = [
  {
    id: 'photo',
    label: 'Photo Generation',
    icon: 'Camera',
    description: 'Photorealistic images with specialist lighting and composition',
    hint: 'IMAGE_GENERATION',
    placeholder: 'Describe a scene, subject, or mood you want to visualize...',
  },
  {
    id: 'video',
    label: 'Video Generation',
    icon: 'Video',
    description: 'Cinematic video prompts with physics-first movement direction',
    hint: 'VIDEO_GENERATION',
    placeholder: 'Describe a video scene — what moves, how it moves, the atmosphere...',
  },
  {
    id: 'game',
    label: 'Game Design',
    icon: 'Gamepad2',
    description: 'Game concept, mechanics, narrative, and world-building',
    hint: 'GENERAL',
    placeholder: 'Describe your game concept, genre, or specific design challenge...',
  },
  {
    id: 'prompt-enhancer',
    label: 'AI Prompt Enhancer',
    icon: 'Wand2',
    description: 'Take an existing prompt and make it specialist-grade',
    hint: 'GENERAL',
    placeholder: 'Paste a prompt you want improved or describe what you\'re trying to achieve...',
  },
  {
    id: 'music',
    label: 'Music Generation',
    icon: 'Music',
    description: 'Full songs, instrumentals, and jingles via Suno and ElevenLabs',
    hint: 'MUSIC_GENERATION',
    placeholder: 'Describe the mood, genre, tempo, and feel of the music you want...',
  },
  {
    id: 'creative-writing',
    label: 'Creative Writing',
    icon: 'PenLine',
    description: 'Stories, screenplays, poetry, and world-building narratives',
    hint: 'CREATIVE_WRITING',
    placeholder: 'Describe the story, characters, or creative piece you want to write...',
  },
  {
    id: 'business',
    label: 'Business Writing',
    icon: 'Briefcase',
    description: 'Proposals, pitch decks, cold emails, and business plans',
    hint: 'BUSINESS_WRITING',
    placeholder: 'Describe the business document, audience, and goal...',
  },
  {
    id: 'code',
    label: 'Code Generation',
    icon: 'Code2',
    description: 'Feature builds, bug fixes, architecture, and code reviews',
    hint: 'CODE_GENERATION',
    placeholder: 'Describe the feature, bug, or code challenge you need help with...',
  },
]
```

### Pattern 7: Tailwind v3 Config with Design Tokens

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Locked base tokens from v10 / CLAUDE.md
        bg: '#030407',
        surface: '#070910',
        card: '#0B0D16',
        border: '#12172A',
        'border-hover': '#1C2540',
        red: '#E03020',
        'red-hover': '#CC2010',
        gold: '#C88A08',
        'gold-bright': '#F0AA20',
        'gold-dim': 'rgba(200, 138, 8, 0.15)',
        green: '#1E9A5A',
        orange: '#D06820',
        purple: '#7060CC',
        text: '#E2DDD8',
        muted: '#384060',
        dim: '#161C2C',
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 1s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
```

### Pattern 8: Font Loading via next/font (Next.js 14)

```typescript
// app/layout.tsx
import { DM_Sans, JetBrains_Mono } from 'next/font/google'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-bg text-text font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
```

### Pattern 9: ui-ux-pro-max Invocation for Component Design

**What:** Before designing each UI component, invoke the `ui-ux-pro-max` skill using the Python CLI at `d:\vsc claude\.claude\skills\ui-ux-pro-max\scripts\search.py`. This generates a design system appropriate for the product type.

**How to invoke for PromptForge:**

```bash
# Generate full design system first (one time for the project)
python3 "d:/vsc claude/.claude/skills/ui-ux-pro-max/scripts/search.py" \
  "AI tool SaaS dark premium prompt generation" --design-system -p "PromptForge"

# Then supplement for specific components as needed:
python3 "d:/vsc claude/.claude/skills/ui-ux-pro-max/scripts/search.py" \
  "card grid selection state hover glow" --domain ux

python3 "d:/vsc claude/.claude/skills/ui-ux-pro-max/scripts/search.py" \
  "dark mode premium SaaS tool" --domain style

python3 "d:/vsc claude/.claude/skills/ui-ux-pro-max/scripts/search.py" \
  "score counter number animation" --domain ux
```

**Note on the skill:** SKILL.md indicates the script is at `skills/ui-ux-pro-max/scripts/search.py` relative to the project. Since the skill is in `d:\vsc claude\.claude\skills\ui-ux-pro-max\`, the implementer should use the absolute path. Only `SKILL.md` was found in the directory — confirm the `scripts/` subdirectory exists before attempting to run.

**Key rules from SKILL.md relevant to PromptForge:**
- Priority 4 (Style Selection): Use SVG icons (Lucide), NOT emojis as structural icons
- Priority 7 (Animation): Duration 150–300ms for micro-interactions; use `transform/opacity` only, not `width/height`
- Score counter: setInterval-based is fine (pure CSS alternative avoids dependency)
- Card hover states: `scale-feedback` rule — subtle scale (0.95–1.05) on press for tappable cards
- Preset grid: `stagger-sequence` — stagger list/grid item entrance by 30–50ms per item

**Important:** The preset cards use emojis in the CONTEXT.md (📸, 🎬, etc.) — these should be used as visual accent/decoration within a card that ALSO has a proper Lucide SVG icon for the primary icon role. Do not use emoji as the structural/primary icon per ui-ux-pro-max rules.

### Pattern 10: Copy to Clipboard

**What:** `navigator.clipboard.writeText()` is the standard API. It requires HTTPS (Vercel provides this). Add a fallback for older browsers using `document.execCommand('copy')`.

```typescript
// components/CopyButton.tsx
'use client' (inherited from parent — no directive needed if PromptForge.tsx is the boundary)

const copy = async (text: string, key: string) => {
  try {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  } catch {
    // Fallback for older browsers or non-HTTPS contexts
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }
}
```

### Pattern 11: Loading Messages (Rotating)

**What:** The v10 pattern uses setInterval cycling LOAD_MSGS every 1000ms. For this redesign, messages rotate every ~2s to feel more intelligent.

```typescript
const LOAD_MSGS = [
  'Detecting intent...',
  'Applying specialist principles...',
  'Crafting your perfect prompt...',
  'Selecting the right AI tool...',
  'Adding expert-level detail...',
  'Polishing to professional grade...',
  'Almost ready...',
]
```

### Anti-Patterns to Avoid

- **Streaming the Anthropic response:** ForgeResult is complete JSON — streaming partial JSON is unparseable. Use `messages.create()`, not `messages.stream()`. The loading state (rotating messages) covers the wait UX.
- **Putting `"use client"` on sub-components:** Only `PromptForge.tsx` needs it. All components it imports become client components automatically.
- **Calling the Anthropic API from a client component:** The API key would end up in the browser bundle. Route Handler only.
- **Storing forge count in localStorage or cookies (value):** Phase 1 has no gate, but when Phase 2 is added, the gate must be DB-based. Do not pre-build a client-side counter.
- **Using emoji as primary structural icons:** Use Lucide SVG icons. Emoji can be used as accent decoration within cards.
- **Not stripping markdown fences before JSON.parse():** Claude occasionally wraps JSON in ```json ... ``` fences. Always strip before parsing.
- **Setting `export const runtime = 'edge'` on the forge route:** The Anthropic SDK requires Node.js runtime. Edge runtime has a 4MB memory limit and restricted APIs.
- **Using `NEXT_PUBLIC_ANTHROPIC_API_KEY`:** The `NEXT_PUBLIC_` prefix exposes variables to the client bundle. Never use this prefix for secrets.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| JSON validation of LLM response | Manual field checks | Zod schema (`ForgeResultSchema.parse()`) | Handles optional fields, type coercion, descriptive errors |
| Accessible tabs with keyboard nav | Custom tab click handler | Radix UI `@radix-ui/react-tabs` | Handles focus management, ARIA roles, keyboard arrows automatically |
| Accessible accordion (Brand DNA) | Custom expand/collapse | Radix UI `@radix-ui/react-accordion` | ARIA expanded/collapsed states, keyboard support, animation hooks |
| Font loading with zero FOIT | Manual `<link>` + CSS | `next/font/google` | Automatic subsetting, no FOIT, CSS variable output for Tailwind |
| Class name merging | String concatenation | `clsx` + `tailwind-merge` | Resolves Tailwind class conflicts (e.g., `text-muted` vs `text-gold`) |
| Toast notifications | Custom state + portal | `sonner` | Handles stacking, animations, dark theme, a11y automatically |

**Key insight:** The most dangerous hand-roll in this phase is building a custom JSON validation layer instead of using Zod. Claude's JSON output has enough edge cases (markdown fences, optional fields, occasionally wrong types) that Zod's `.safeParse()` with detailed error logging is worth the 2-minute setup cost.

---

## Common Pitfalls

### Pitfall 1: API Key in Client Bundle

**What goes wrong:** A developer adds `'use client'` to a component that imports from `lib/system-prompt.ts`, or moves Anthropic client initialization outside the route handler. The API key appears in browser DevTools > Sources.

**Why it happens:** The `'use client'` directive propagates through all imports. A refactoring that moves state logic pulls server modules into the client boundary.

**How to avoid:** `import 'server-only'` in `lib/system-prompt.ts`. Never import Anthropic SDK in any file that could reach the client. Keep `PromptForge.tsx` purely presentational — it calls `/api/forge` via `fetch()`.

**Warning signs:** Build warnings about server modules in client bundle. Run `npx @next/bundle-analyzer` and search for `sk-ant-` in the output.

### Pitfall 2: LLM JSON Parse Failures Crashing the Route

**What goes wrong:** Claude returns ```json\n{...}\n``` with markdown fences, or a partial JSON response, or a rare refusal message. `JSON.parse()` throws, the route crashes with a 500, the user sees a blank screen.

**How to avoid:** Implement `tryParse()` as a standalone function that (1) strips markdown fences, (2) calls `JSON.parse()` in try/catch, (3) validates with Zod. Retry once with explicit JSON instruction on failure.

### Pitfall 3: Vercel Function Timeout on First Deploy

**What goes wrong:** The forge route times out because `export const maxDuration = 60` was forgotten, or the Hobby plan has a lower default.

**How to avoid:** Add `export const maxDuration = 60` and `export const runtime = 'nodejs'` as the first exports in `route.ts`. Verify in Vercel dashboard after first deploy.

### Pitfall 4: System Prompt Extraction Errors

**What goes wrong:** The SYSTEM const is extracted from v10 but accidentally trimmed, modified, or formatted. The system prompt is sacred IP — any modification changes forging behavior.

**How to avoid:** Extract the SYSTEM const from `reference/referencepromptforge-v10.jsx` lines 14–516 **verbatim** — character for character, including all Unicode characters (━, ▸, etc.). Do not remove blank lines, do not reformat. Add a comment: `// SOURCE: reference/referencepromptforge-v10.jsx lines 14-516. NEVER MODIFY.`

### Pitfall 5: Empty State / Preset Selector UX Disconnect

**What goes wrong:** The preset selector is implemented as a separate "section" from the main UI, and the output panel's empty state doesn't reference presets. The user sees two disconnected UX patterns.

**How to avoid:** The preset selector IS the empty state. When no forge has run, the output panel shows the 8 preset cards prominently (the same cards as the input selector). After a preset is selected, the right panel shows contextual "what you'll get" preview text. This creates a unified entry flow.

### Pitfall 6: Mobile Layout — Output Panel Off-Screen

**What goes wrong:** On mobile, the left panel (input) renders and the user clicks Forge. The result renders in the right panel, which is below the fold in the stacked mobile layout. The user sees "loading → nothing" and assumes it broke.

**How to avoid:** After successful forge on mobile (`window.innerWidth < 768`), auto-scroll to the output panel using `scrollIntoView({ behavior: 'smooth' })`.

### Pitfall 7: Tailwind v3 Custom Color Conflicts

**What goes wrong:** Custom colors like `bg-bg`, `text-text`, `border-border` conflict with Tailwind's built-in utilities or cause confusion.

**How to avoid:** Name the tokens consistently with the design: `bg-bg` (background), `bg-surface`, `bg-card`, `border-border` (custom border color). Test the config against a simple component before building the full UI. Use `tailwind-merge` for any dynamic class merging.

### Pitfall 8: Score Animation Triggers on Wrong State

**What goes wrong:** The score animation `useEffect` triggers whenever `result` changes, including on re-forge while a result is already showing. The counter jumps from the old value to 0 then animates, causing a visual glitch.

**How to avoid:** Reset animation state to 0 at the start of the `useEffect` (as v10 does with `setScoreAnim(0)`). Also reset score animation state when forge starts (`setStatus('loading')`), not just when result arrives.

---

## Code Examples

### Forge API Call from Client (PromptForge.tsx)

```typescript
// Source: Pattern 1 above + ARCHITECTURE.md
const forge = async () => {
  const { input, selectedPreset, brandDNA, setStatus, setResult, setError, setActiveTab } = useForgeStore.getState()
  if (!input.trim()) return

  setStatus('loading')
  setActiveTab('prompt')

  try {
    const response = await fetch('/api/forge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: input.trim(),
        presetHint: selectedPreset?.hint,
        brandDNA: {
          brandName: brandDNA.brandName || undefined,
          tone: brandDNA.tone || undefined,
          audience: brandDNA.audience || undefined,
        },
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      setError(err.error || 'Something went wrong. Try rephrasing.')
      return
    }

    const result = await response.json()
    setResult(result)
  } catch {
    setError('Network error. Please try again.')
  }
}
```

### Two-Panel Responsive Layout (Tailwind v3)

```typescript
// app/page.tsx (Server Component)
import PromptForge from '@/components/PromptForge'

export default function Home() {
  return <PromptForge />
}

// components/PromptForge.tsx — "use client"
// Two-panel desktop, stacked mobile
<div className="min-h-dvh bg-bg text-text font-sans">
  <Header />
  <main className="grid grid-cols-1 md:grid-cols-[380px_1fr] min-h-[calc(100dvh-56px)]">
    <InputPanel />
    <OutputPanel />
  </main>
</div>
```

### Vercel Environment Variable Documentation (README)

```
## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values.

Required:
- ANTHROPIC_API_KEY=        # Your Anthropic API key (sk-ant-...)

Phase 2 (not needed for Phase 1):
- CLERK_SECRET_KEY=
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
- DATABASE_URL=

Phase 3 (not needed for Phase 1):
- STRIPE_SECRET_KEY=
- STRIPE_WEBHOOK_SECRET=
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `middleware.ts` | `proxy.ts` | Next.js v16 (~Feb 2026) | New projects use `proxy.ts`; API identical, just filename changed |
| `export const maxDuration` on Pro only | Hobby gets 300s with Fluid Compute enabled | 2025 | Hobby plan viable for dev/staging; Pro still recommended for production |
| Framer Motion for all animations | setInterval for simple counters, CSS for micro-interactions | Ongoing | Reduces bundle weight; Framer only for complex spring physics |
| Tailwind v3 config file | v4 CSS-first config (no config file) | Tailwind v4 early 2025 | v3 still recommended for Next.js 14; verify v4 ecosystem by March 2026 |

**Deprecated/outdated in this context:**
- Streaming the forge response: Not applicable to ForgeResult JSON output; adds complexity with no UX benefit given the loading state UX
- localStorage for usage tracking: Never ship this for any phase; always DB-based

---

## Open Questions

1. **Tailwind v4 compatibility as of March 2026**
   - What we know: v3 is safe; v4 had incomplete Next.js 14 integration as of mid-2025
   - What's unclear: Whether v4 + Next.js 14 + shadcn/ui ecosystem is fully stable by March 2026
   - Recommendation: Check `npm info tailwindcss version` and the Tailwind v4 migration guide before Phase 1 setup. If v4 ecosystem is confirmed stable, use v4. If any doubt, use v3.4.x.

2. **ui-ux-pro-max script availability**
   - What we know: `SKILL.md` references `skills/ui-ux-pro-max/scripts/search.py` — only `SKILL.md` was found in the directory
   - What's unclear: Whether `scripts/` subdirectory and `search.py` exist
   - Recommendation: Check `d:\vsc claude\.claude\skills\ui-ux-pro-max\` for `scripts/search.py` before planning tasks that invoke it. If missing, use SKILL.md Quick Reference directly for design decisions.

3. **Score counter animation choice: setInterval vs Framer Motion**
   - What we know: v10 uses setInterval (increment by 2 every 14ms) — works perfectly, zero dependencies
   - What's unclear: Whether the redesigned UI warrants a spring-physics feel (Framer Motion)
   - Recommendation: Default to setInterval (v10 approach). Use Framer Motion only if the design review from ui-ux-pro-max recommends spring-based easing for this specific animation.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None yet — project is empty. Wave 0 establishes testing. |
| Config file | `jest.config.ts` or `vitest.config.ts` — to be created in Wave 0 |
| Quick run command | `npm run test -- --testPathPattern=forge` (after setup) |
| Full suite command | `npm run test` |

For Phase 1, most validation is manual or browser-based rather than automated unit tests, given the UI-heavy nature and the LLM integration. However, a few critical automated checks are viable:

### Phase Requirements → Test/Validation Map

| Req ID | Behavior | Validation Type | Check |
|--------|----------|-----------------|-------|
| ENG-01 | ForgeResult JSON received from API | Manual browser test | Forge a prompt; verify network tab returns valid JSON |
| ENG-02 | System prompt never trimmed | Code inspection | Read `lib/system-prompt.ts`; compare SYSTEM const length to v10 reference |
| ENG-03 | API key not in client bundle | Bundle analysis | `npx @next/bundle-analyzer`; grep build output for `sk-ant-` |
| ENG-04 | `server-only` guard works | Build verification | Add temporary `import '@/lib/system-prompt'` in a client component; verify build error |
| ENG-05 | JSON parse retry fires on malformed response | Unit test | Mock Anthropic to return `\`\`\`json\n{"bad": true}\n\`\`\``; verify `tryParse()` strips fences and succeeds |
| ENG-06 | 2000 char input cap enforced server-side | `curl` test | `curl -X POST /api/forge -d '{"input":"x".repeat(2001)}'`; verify 400 response |
| PSET-01 | 8 preset cards visible | Visual | Count cards in browser on empty state |
| PSET-02 | Preset pre-fills placeholder | Manual | Click preset; verify textarea placeholder changes |
| PSET-03 | Preset hint sent to API | Network tab | Click preset; forge; inspect POST body for `presetHint` field |
| PSET-04 | Free text works without preset | Manual | Clear preset selection; type and forge; verify result |
| UI-03 | Score counter animates 0 → target | Visual | Forge; watch scores increment |
| UI-05 | Copy button works | Manual | Click COPY on prompt tab; paste into editor; verify content |
| UI-06 | Copy Everything includes all sections | Manual | Click COPY EVERYTHING; paste into editor; verify prompt + tool + tips present |
| UI-07 | Loading messages rotate | Manual + timing | Forge; watch messages cycle during loading |
| UI-09 | text_risk alert shows for risky prompts | Manual | Input "a classroom with alphabet chart" or similar scene with text risk; verify orange alert |
| UI-10 | unknown_technique alert shows | Manual | Input a highly unusual/niche technique name; verify green alert if triggered |
| UI-14 | Brand DNA appended to API body | Network tab | Expand Brand DNA; fill fields; forge; inspect POST body for `brandDNA` fields |
| INFRA-01 | `maxDuration = 60` present in route | Grep | `grep -r "maxDuration" app/api/forge/route.ts` |
| INFRA-01 | `runtime = 'nodejs'` present | Grep | `grep -r "runtime" app/api/forge/route.ts` |
| INFRA-02 | No secrets in client bundle | Grep | `grep -r "ANTHROPIC" .next/static` — should return empty |
| INFRA-03 | README has env var documentation | File read | Read `README.md`; verify ANTHROPIC_API_KEY listed |

### Security-Specific Grep-Verifiable Checks

After `npm run build`, run these checks:

```bash
# ENG-03: API key pattern must NOT appear in client bundle
grep -r "sk-ant" .next/static/ && echo "FAIL: API key in bundle" || echo "PASS: No API key in bundle"

# ENG-03: ANTHROPIC_API_KEY must NOT appear in client bundle
grep -r "ANTHROPIC_API_KEY" .next/static/ && echo "FAIL: Env var ref in bundle" || echo "PASS"

# ENG-04: server-only import present in system-prompt.ts
grep "server-only" lib/system-prompt.ts && echo "PASS: server-only guard present" || echo "FAIL: Missing guard"

# INFRA-01: maxDuration set
grep "maxDuration" app/api/forge/route.ts && echo "PASS" || echo "FAIL: Missing maxDuration"

# INFRA-01: runtime = nodejs set
grep "runtime.*nodejs" app/api/forge/route.ts && echo "PASS" || echo "FAIL: Missing runtime"

# ENG-06: server-side input length check exists
grep "input.length" app/api/forge/route.ts && echo "PASS" || echo "FAIL: Missing input cap"

# ENG-06: max_tokens set in API call
grep "max_tokens" app/api/forge/route.ts && echo "PASS" || echo "FAIL: Missing max_tokens"
```

### UI Acceptance Criteria (Manual Verification)

Before marking Phase 1 complete, verify ALL of the following by manually operating the app in a browser:

**Core Engine:**
- [ ] Type any plain English input, click Forge → ForgeResult JSON received and rendered within 60s
- [ ] Input > 2000 chars → "Input exceeds 2000 character limit" error shown (test via DevTools fetch override)
- [ ] Two-word input (e.g., "sunset beach") → valid ForgeResult received (engine auto-detects intent)

**Preset Selector:**
- [ ] All 8 preset cards visible on first load with SVG icon, label, and description
- [ ] Clicking a preset card: (a) card becomes visually highlighted, (b) textarea placeholder changes contextually, (c) other cards become deselected
- [ ] Clicking the selected preset again deselects it (returns to free-text mode)
- [ ] Typing without selecting a preset and forging works normally

**Output Display:**
- [ ] Intent badge shows emoji + label after forge
- [ ] Both score counters (original + forged) animate from 0 to their target values
- [ ] Score reason caption displayed below scores
- [ ] All 4 tabs present: PROMPT, NEGATIVE, BOLD, EXPERIMENTAL
- [ ] NEGATIVE tab only shown when `negative_prompt` field is present in result
- [ ] Each tab shows the correct content (prompt, negative_prompt, variation_bold, variation_experimental)
- [ ] COPY button on each tab: clicking shows "COPIED" for 2s then resets; clipboard contains correct content
- [ ] COPY EVERYTHING copies prompt + negative + tool + tips as formatted text
- [ ] text_risk orange alert shown when `text_risk: true` in result
- [ ] unknown_technique green alert shown when `unknown_technique: true` in result
- [ ] Tool name + reason displayed
- [ ] Tips list displayed with all items
- [ ] Parameters section only shown when `parameters` field is present

**Brand DNA:**
- [ ] Brand DNA accordion closed by default
- [ ] Clicking accordion header expands it smoothly
- [ ] Filling in Brand Name, Tone, Audience fields and forging → API POST body contains `brandDNA` values
- [ ] Forging without Brand DNA filled → API POST body has no `brandDNA` (or empty values ignored)

**Loading State:**
- [ ] During forge: button shows loading state (disabled), rotating message visible
- [ ] Messages change every ~2s while loading
- [ ] After error: input is preserved (not cleared), error message shown, retry is possible

**Security:**
- [ ] API key not in browser bundle (confirmed with bundle analyzer or grep)
- [ ] `server-only` import in `lib/system-prompt.ts` confirmed

**Layout:**
- [ ] Desktop (>= 768px): two-panel layout — input on left, output on right
- [ ] Mobile (< 768px): single column, input panel on top, output panel below
- [ ] Mobile after forge: output panel scrolls into view automatically
- [ ] All design tokens applied: bg #030407, surface #070910, DM Sans body, JetBrains Mono for output text

### Wave 0 Gaps

Since the project is a clean slate (no Next.js app yet), Wave 0 for this phase is the project initialization itself:

- [ ] `npx create-next-app@14 . --typescript --tailwind --app` in the project directory
- [ ] `tailwind.config.ts` — must be created with custom design tokens (not the default config)
- [ ] `app/globals.css` — must include custom scrollbar styles, placeholder colors, bg-bg on body
- [ ] `.env.local` — must be created from template; `ANTHROPIC_API_KEY` must be set before any API testing
- [ ] Verify `lib/` directory exists for `system-prompt.ts` and `store/` for Zustand store
- [ ] Verify `reference/referencepromptforge-v10.jsx` is readable before extracting SYSTEM const

---

## Sources

### Primary (HIGH confidence)

- `reference/referencepromptforge-v10.jsx` — Sacred AI brain reference; ForgeResult type extracted directly; score animation pattern (setInterval); forge function pattern; copyAll function; loading messages pattern
- `CLAUDE.md` (promptforge/claude.md) — ForgeResult TypeScript interface definition; design tokens; project structure
- `.planning/research/ARCHITECTURE.md` — Component boundaries, data flow, anti-patterns; sourced from Next.js official docs v16.1.6 (2026-02-27)
- `.planning/research/STACK.md` — Library versions, installation commands, Tailwind v3 config pattern, Zustand store pattern, Anthropic non-streaming route handler pattern
- `.planning/research/PITFALLS.md` — Security pitfalls, JSON parse patterns, verified against official Vercel docs (2026-03-14)
- `01-CONTEXT.md` — Locked user decisions, preset definitions, security requirements

### Secondary (MEDIUM confidence)

- `.planning/research/SUMMARY.md` — Synthesized stack and feature analysis; Anthropic SDK usage pattern
- `.claude/skills/ui-ux-pro-max/SKILL.md` — Animation rules, accessibility rules, icon usage rules; directly applicable to component design

### Tertiary (LOW confidence, verify before use)

- Tailwind v4 compatibility status as of March 2026 — not independently verified; assume v3 is still safer unless confirmed otherwise by checking npm registry or official Tailwind docs

---

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — all packages verified in STACK.md research from official sources; versions confirmed
- Architecture: HIGH — sourced from Next.js official docs v16.1.6 via ARCHITECTURE.md; component boundaries match the actual v10 reference code
- ForgeResult type: HIGH — extracted directly from v10 reference JSX and CLAUDE.md; confirmed they match
- Pitfalls: HIGH — critical security pitfalls verified against Vercel docs; JSON parse patterns extracted from v10 reference
- ui-ux-pro-max invocation: MEDIUM — SKILL.md read fully; script availability unconfirmed (only SKILL.md found in directory)
- Tailwind v4: MEDIUM — v3 is known safe; v4 compatibility as of March 2026 not verified

**Research date:** 2026-03-14
**Valid until:** 2026-06-14 (stable stack — 90 days)
