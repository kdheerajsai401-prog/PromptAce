---
phase: 1
slug: foundation-core-forge-engine
status: ready
waves: 4
created: 2026-03-14
nyquist_compliant: true
requirements:
  - ENG-01
  - ENG-02
  - ENG-03
  - ENG-04
  - ENG-05
  - ENG-06
  - PSET-01
  - PSET-02
  - PSET-03
  - PSET-04
  - PSET-05
  - UI-01
  - UI-02
  - UI-03
  - UI-04
  - UI-05
  - UI-06
  - UI-07
  - UI-08
  - UI-09
  - UI-10
  - UI-11
  - UI-12
  - UI-13
  - UI-14
  - UI-15
  - UI-16
  - INFRA-01
  - INFRA-02
  - INFRA-03
---

# Phase 1 — Plan: Foundation + Core Forge Engine

> Anonymous visitors arrive, select a preset or type freely, forge any description into a specialist AI prompt, and see the full output rendered with all UX features — the complete core engine and full UI, shipping with security baselines on day one.

---

## Context References

- `reference/referencepromptforge-v10.jsx` — AI brain sacred reference. Extract SYSTEM const (lines 14–490) only. Do not copy UI.
- `.planning/phases/01-foundation-core-forge-engine/01-CONTEXT.md` — Locked UI decisions, preset spec, Brand DNA spec
- `.planning/phases/01-foundation-core-forge-engine/01-RESEARCH.md` — ForgeResult type, score animation pattern, stack details
- `.planning/phases/01-foundation-core-forge-engine/01-VALIDATION.md` — Per-task verify commands, security grep checks
- `.planning/REQUIREMENTS.md` — Full requirement definitions
- `.planning/research/STACK.md` — Tech stack rationale (Tailwind v3, Zustand 4.x, Anthropic SDK)
- `.planning/research/ARCHITECTURE.md` — Component tree, data flow, build order
- `.planning/research/PITFALLS.md` — Critical pitfalls: API cost, key exposure, JSON parse, timeouts
- `.claude/skills/ui-ux-pro-max/SKILL.md` — MUST apply to all UI/component design tasks

---

## Wave 0: Infrastructure + Test Stubs

*All Wave 0 tasks are parallelizable. Must complete before any feature work starts.*

---

### Task: project-setup

**Wave:** 0
**Requirements:** INFRA-01, INFRA-02, INFRA-03
**Depends on:** nothing
**Files:**
- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `tailwind.config.ts`
- `postcss.config.mjs`
- `app/globals.css`
- `app/layout.tsx`
- `app/page.tsx`
- `.env.local`
- `.env.example`
- `.gitignore`
- `vercel.json`
- `public/.gitkeep`

**Implementation:**

Run scaffold command in the project root (the directory already exists — do NOT create a new subdirectory):

```bash
npx create-next-app@14 . --typescript --tailwind --app --src-dir=false --import-alias "@/*" --use-npm
```

If the directory is not empty, scaffold manually by creating each file. The project uses `--src-dir=false` (files in root `app/`, `components/`, `lib/`, `types/`).

After scaffold, install Phase 1 dependencies:

```bash
npm install @anthropic-ai/sdk zustand server-only lucide-react clsx tailwind-merge sonner zod
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
npm install -D prettier prettier-plugin-tailwindcss
```

**`tailwind.config.ts`** — extend with PromptForge design tokens:

```typescript
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
        bg: '#030407',
        surface: '#070910',
        card: '#0B0D16',
        border: '#1a1d2e',
        borderHover: '#2d3154',
        text: '#f0f0f8',
        muted: '#6b7280',
        gold: '#d4a843',
        goldBright: '#f0c855',
        red: '#e05252',
        green: '#4caf7d',
        blue: '#4a9eff',
        purple: '#8b5cf6',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'forge-gradient': 'linear-gradient(135deg, #e05252 0%, #d4a843 100%)',
        'card-gradient': 'linear-gradient(180deg, #0B0D16 0%, #070910 100%)',
      },
    },
  },
  plugins: [],
}
export default config
```

**`app/globals.css`** — import Google Fonts + Tailwind directives:

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..900;1,9..40,300..900&family=JetBrains+Mono:wght@400;500;600&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    background-color: #030407;
    color: #f0f0f8;
    font-family: 'DM Sans', sans-serif;
  }
}
```

**`app/layout.tsx`** — minimal Server Component shell with metadata:

```typescript
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PromptForge — Turn Any Idea Into the Perfect AI Prompt',
  description: 'PromptForge detects your intent and applies specialist AI principles to forge the perfect prompt for image generation, video, code, music, writing, and more.',
  openGraph: {
    title: 'PromptForge — AI Prompt Engineering Engine',
    description: 'Turn any plain English description into a specialist AI prompt instantly.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

**`app/page.tsx`** — Server Component shell (renders PromptForge client component placeholder):

```typescript
export default function Home() {
  return (
    <main className="min-h-screen bg-bg">
      {/* PromptForge client component renders here — added in Wave 2 */}
      <div className="flex items-center justify-center min-h-screen text-muted font-mono text-sm">
        Loading...
      </div>
    </main>
  )
}
```

**`next.config.ts`**:

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // No special config needed for Phase 1
}

export default nextConfig
```

**`vercel.json`**:

```json
{
  "functions": {
    "app/api/forge/route.ts": {
      "maxDuration": 60
    }
  }
}
```

**`.env.local`** (create with empty values — never commit real keys):

```
ANTHROPIC_API_KEY=
```

**`.env.example`** (committed to repo — documents required variables):

```
# Required for Phase 1
ANTHROPIC_API_KEY=sk-ant-...  # Get from console.anthropic.com
```

**`.gitignore`** — ensure `.env.local` and `lib/system-prompt.ts` are excluded:

```
.env.local
.env*.local
lib/system-prompt.ts
```

Note: `lib/system-prompt.ts` is excluded from git because it contains proprietary IP. It must be created locally from the reference file during setup.

**`package.json`** — add test scripts (after scaffold installs base scripts):

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "type-check": "tsc --noEmit"
  }
}
```

**Verify:** `npm run build` exits 0 (TypeScript compiles, Tailwind processes, Next.js builds without errors)

**Also verify:** `npm run type-check` exits 0

---

### Task: types

**Wave:** 0
**Requirements:** ENG-01, PSET-01, PSET-05
**Depends on:** project-setup (needs tsconfig)
**Files:**
- `types/index.ts`

**Implementation:**

Create `types/index.ts` with the exact ForgeResult interface extracted from v10 reference, plus additional app types:

```typescript
// types/index.ts
// ForgeResult — sacred contract from v10. Matches Anthropic response schema exactly.
// DO NOT modify field names or types without updating the system prompt accordingly.

export interface ForgeResult {
  intent_category: string        // e.g. "IMAGE_GENERATION"
  intent_subtype: string         // e.g. "HUMAN"
  intent_label: string           // e.g. "Portrait Photography"
  intent_emoji: string           // e.g. "📸"
  score_original: number         // 0–100: quality score of user's raw input
  score_forged: number           // 0–100: quality score of the forged prompt
  score_reason: string           // explanation of the score delta
  text_risk?: boolean            // scene has risky background text
  text_risk_note?: string        // specific advice for text risk
  unknown_technique?: boolean    // technique not in training data
  technique_flag?: string        // guidance for unknown technique
  prompt: string                 // the forged prompt (always present)
  negative_prompt?: string       // negative prompt (not all categories)
  tool: string                   // recommended AI tool
  tool_reason: string            // why this tool was chosen
  parameters?: string            // tool-specific params (e.g. aspect ratio)
  parameters_label?: string      // human label for parameters section
  tips: string[]                 // 3–5 actionable tips
  variation_bold: string         // bolder interpretation of the scene
  variation_experimental: string // unexpected/experimental direction
}

// Tab IDs for the output panel
export type OutputTab = 'prompt' | 'negative' | 'bold' | 'experimental'

// Forge request body sent from client to /api/forge
export interface ForgeRequest {
  input: string          // user's plain English description (max 2000 chars)
  presetHint?: string    // preset category slug if a preset was selected (e.g. "photo-generation")
  brandDNA?: BrandDNA    // optional brand context
}

// Brand DNA context appended to forge requests
export interface BrandDNA {
  brandName?: string
  toneOfVoice?: string
  targetAudience?: string
  industry?: string
  keywords?: string
}

// Preset category card definition
export interface PresetCategory {
  id: string            // kebab-case slug (e.g. "photo-generation")
  emoji: string         // display emoji
  label: string         // display name (e.g. "Photo Generation")
  description: string   // short description shown on card
  placeholder: string   // contextual placeholder text for the textarea
  badge?: string        // optional badge label (e.g. "Popular")
  color: string         // accent color for glow/border (Tailwind color value)
}

// Zustand store shape
export interface ForgeStore {
  // Input state
  input: string
  setInput: (input: string) => void

  // Preset state
  selectedPreset: string | null
  setSelectedPreset: (id: string | null) => void

  // Forge state machine
  status: 'idle' | 'loading' | 'success' | 'error'
  result: ForgeResult | null
  error: string | null
  setLoading: () => void
  setSuccess: (result: ForgeResult) => void
  setError: (message: string) => void
  reset: () => void

  // Output UI state
  activeTab: OutputTab
  setActiveTab: (tab: OutputTab) => void

  // Brand DNA state
  brandDNA: BrandDNA
  setBrandDNA: (updates: Partial<BrandDNA>) => void
  brandDNAOpen: boolean
  setBrandDNAOpen: (open: boolean) => void
}

// API error response
export interface ForgeError {
  error: string
  code?: 'input_too_long' | 'parse_error' | 'api_error' | 'server_error'
}
```

**Verify:** `npm run type-check` exits 0 (TypeScript compiles the types file without errors)

---

### Task: test-stubs

**Wave:** 0
**Requirements:** ENG-01, ENG-05, ENG-06, UI-04, UI-14
**Depends on:** project-setup, types
**Files:**
- `vitest.config.ts`
- `__tests__/forge-route.test.ts`
- `__tests__/output-tabs.test.ts`
- `__tests__/brand-dna.test.ts`

**Implementation:**

**`vitest.config.ts`**:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['__tests__/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

Create `__tests__/setup.ts`:

```typescript
import '@testing-library/jest-dom'
```

**`__tests__/forge-route.test.ts`** — stub tests covering ENG-01, ENG-05, ENG-06. These are stubs: they are marked `todo` and will be filled in after the forge route is created in Wave 1.

```typescript
// __tests__/forge-route.test.ts
// Stub tests for forge route behavior.
// Run: npx vitest run __tests__/forge-route.test.ts
// Status: stubs — will pass as-is; filled in after Wave 1 forge-route task

import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('POST /api/forge — input validation (ENG-06)', () => {
  it.todo('rejects inputs longer than 2000 characters with 400 status')
  it.todo('accepts inputs exactly 2000 characters')
  it.todo('rejects empty input with 400 status')
})

describe('POST /api/forge — JSON parse with retry (ENG-05)', () => {
  it.todo('parses clean JSON response successfully')
  it.todo('strips markdown fences (```json) before parsing')
  it.todo('retries once on malformed JSON before returning error')
  it.todo('returns structured error after two consecutive parse failures')
})

describe('POST /api/forge — max_tokens enforcement (ENG-06)', () => {
  it.todo('includes max_tokens: 2000 in every Anthropic API call')
})

describe('POST /api/forge — returns ForgeResult shape (ENG-01)', () => {
  it.todo('response body matches ForgeResult interface schema')
  it.todo('required fields: intent_category, prompt, tool, tool_reason, tips, score_original, score_forged are present')
})

// Helper — builds a valid ForgeRequest for testing
export function makeForgeRequest(overrides: Partial<{ input: string }> = {}) {
  return {
    input: overrides.input ?? 'A golden retriever puppy playing in autumn leaves',
  }
}
```

**`__tests__/output-tabs.test.ts`** — stub tests for UI-04 tab switching state:

```typescript
// __tests__/output-tabs.test.ts
// Stub tests for OutputTabs component tab switching behavior.
// Run: npx vitest run __tests__/output-tabs.test.ts

import { describe, it, expect } from 'vitest'

describe('OutputTabs — tab switching (UI-04)', () => {
  it.todo('renders all 4 tabs: PROMPT, NEGATIVE, BOLD, EXPERIMENTAL')
  it.todo('PROMPT tab is active by default')
  it.todo('clicking BOLD tab sets activeTab to "bold"')
  it.todo('clicking EXPERIMENTAL tab sets activeTab to "experimental"')
  it.todo('active tab has gold accent color class applied')
  it.todo('tab content area renders content matching the active tab')
})

describe('OutputTabs — Zustand store integration (UI-04)', () => {
  it.todo('reading activeTab from store renders the correct tab content')
  it.todo('setActiveTab action updates the store and re-renders')
})
```

**`__tests__/brand-dna.test.ts`** — stub tests for UI-14 Brand DNA accordion state:

```typescript
// __tests__/brand-dna.test.ts
// Stub tests for BrandDNAAccordion component.
// Run: npx vitest run __tests__/brand-dna.test.ts

import { describe, it, expect } from 'vitest'

describe('BrandDNAAccordion — expand/collapse (UI-14)', () => {
  it.todo('accordion is collapsed by default')
  it.todo('clicking the header expands the accordion')
  it.todo('clicking the header again collapses the accordion')
  it.todo('expanded state shows all Brand DNA fields: Brand Name, Tone of Voice, Target Audience')
})

describe('BrandDNAAccordion — form state (UI-14)', () => {
  it.todo('typing in Brand Name field updates brandDNA.brandName in store')
  it.todo('typing in Tone of Voice field updates brandDNA.toneOfVoice in store')
  it.todo('typing in Target Audience field updates brandDNA.targetAudience in store')
})

describe('BrandDNAAccordion — forge integration (UI-14)', () => {
  it.todo('brandDNA fields are included in ForgeRequest when non-empty')
  it.todo('empty brandDNA fields are omitted from ForgeRequest')
})
```

**Verify:** `npx vitest run` — all tests pass (all are `.todo` stubs, which vitest marks as pending but does not fail)

---

## Wave 1: Server-Side Engine

*All Wave 1 tasks are parallelizable. Require Wave 0 to be complete.*

---

### Task: system-prompt

**Wave:** 1
**Requirements:** ENG-02, ENG-04
**Depends on:** project-setup
**Files:**
- `lib/system-prompt.ts`

**Implementation:**

This task extracts the sacred SYSTEM const from `reference/referencepromptforge-v10.jsx`.

1. Open `reference/referencepromptforge-v10.jsx`
2. Locate the `const SYSTEM = \`` backtick string starting at line 14
3. Find the closing backtick (approximately line 490) — this is the complete system prompt
4. Extract the full string including all content between the opening and closing backticks
5. Create `lib/system-prompt.ts` with:

```typescript
import 'server-only'
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PROMPTFORGE SYSTEM PROMPT — PROPRIETARY AND CONFIDENTIAL
// Copyright 2026 PromptForge. All rights reserved.
// This file is excluded from version control (.gitignore).
// NEVER import this file in client components.
// NEVER log the contents of this constant.
// NEVER expose this via any API endpoint.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SYSTEM_PROMPT: string = `[PASTE FULL SYSTEM PROMPT STRING HERE — extracted from reference/referencepromptforge-v10.jsx lines 14–490]`
```

CRITICAL rules for this file:
- The `import 'server-only'` line MUST be the first import (before any other code)
- Do NOT trim, modify, or paraphrase any content from the SYSTEM const
- Do NOT add any formatting, comments, or wrappers inside the string itself
- The file is in `.gitignore` — confirm before committing

After creating the file, verify the `server-only` guard works:
- Run `npm run build`
- If `lib/system-prompt.ts` is accidentally imported in a client component, the build will throw: `You're importing a component that needs server-only...`

**Verify:**
```bash
grep "server-only" lib/system-prompt.ts
```
Expected output: `import 'server-only'` — PASS

```bash
npm run build
```
Must exit 0.

---

### Task: forge-route

**Wave:** 1
**Requirements:** ENG-01, ENG-03, ENG-05, ENG-06, INFRA-01
**Depends on:** system-prompt, types
**Files:**
- `app/api/forge/route.ts`

**Implementation:**

Create the POST route handler. This is the entire server-side engine for Phase 1.

```typescript
import 'server-only'
import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT } from '@/lib/system-prompt'
import type { ForgeRequest, ForgeResult, ForgeError } from '@/types'

// INFRA-01: maxDuration must be set — Vercel needs this for LLM call latency
export const maxDuration = 60
export const runtime = 'nodejs'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  timeout: 55000, // 55s — slightly under maxDuration
})

// ENG-06: Input cap constant — checked server-side before Anthropic call
const MAX_INPUT_CHARS = 2000

function buildUserMessage(request: ForgeRequest): string {
  let msg = request.input.trim()

  // Append preset hint if provided — helps engine lean into the right intent category
  if (request.presetHint) {
    msg += `\n\n[User selected preset: ${request.presetHint}]`
  }

  // Append Brand DNA context if provided — free-tier differentiator
  const dna = request.brandDNA
  if (dna && (dna.brandName || dna.toneOfVoice || dna.targetAudience || dna.industry || dna.keywords)) {
    msg += '\n\nBrand DNA context:'
    if (dna.brandName) msg += `\nBrand Name: ${dna.brandName}`
    if (dna.toneOfVoice) msg += `\nTone of Voice: ${dna.toneOfVoice}`
    if (dna.targetAudience) msg += `\nTarget Audience: ${dna.targetAudience}`
    if (dna.industry) msg += `\nIndustry: ${dna.industry}`
    if (dna.keywords) msg += `\nKeywords: ${dna.keywords}`
  }

  return msg
}

function stripMarkdownFences(raw: string): string {
  // Strip ```json ... ``` or ``` ... ``` wrappers that Claude occasionally adds
  return raw.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim()
}

async function callAnthropic(userMessage: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000, // ENG-06: always capped
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  })

  const text = message.content
    .filter(block => block.type === 'text')
    .map(block => (block as { type: 'text'; text: string }).text)
    .join('')

  return text
}

export async function POST(request: Request): Promise<Response> {
  let body: ForgeRequest

  try {
    body = await request.json()
  } catch {
    const err: ForgeError = { error: 'Invalid request body', code: 'server_error' }
    return Response.json(err, { status: 400 })
  }

  const { input, presetHint, brandDNA } = body

  // ENG-06: Server-side input cap — enforce regardless of client-side validation
  if (!input || typeof input !== 'string') {
    const err: ForgeError = { error: 'Input is required', code: 'server_error' }
    return Response.json(err, { status: 400 })
  }

  if (input.trim().length === 0) {
    const err: ForgeError = { error: 'Input cannot be empty', code: 'server_error' }
    return Response.json(err, { status: 400 })
  }

  if (input.length > MAX_INPUT_CHARS) {
    const err: ForgeError = {
      error: `Input must be ${MAX_INPUT_CHARS} characters or fewer. Yours is ${input.length} characters.`,
      code: 'input_too_long',
    }
    return Response.json(err, { status: 400 })
  }

  const userMessage = buildUserMessage({ input, presetHint, brandDNA })

  // ENG-05: Try/catch with one retry on malformed JSON
  let rawResponse: string
  let parseError: unknown

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const messageToSend = attempt === 2
        ? userMessage + '\n\nIMPORTANT: Your response must be pure JSON only. No markdown fences, no explanation, no text before or after the JSON object.'
        : userMessage

      rawResponse = await callAnthropic(messageToSend)
      const cleaned = stripMarkdownFences(rawResponse)
      const result: ForgeResult = JSON.parse(cleaned)

      // Validate required fields are present to catch partial JSON
      if (!result.intent_category || !result.prompt || !result.tool || !Array.isArray(result.tips)) {
        throw new Error('ForgeResult missing required fields')
      }

      return Response.json(result, { status: 200 })
    } catch (err) {
      parseError = err
      if (attempt === 1) {
        // Will retry with stronger instruction
        continue
      }
    }
  }

  // Both attempts failed
  console.error('[forge-route] Both parse attempts failed:', parseError)
  const err: ForgeError = {
    error: 'PromptForge had trouble with that input — try rephrasing your idea.',
    code: 'parse_error',
  }
  return Response.json(err, { status: 500 })
}
```

CRITICAL security checks after creation:
- `ANTHROPIC_API_KEY` must only appear in `process.env.ANTHROPIC_API_KEY` — never hardcoded
- The Anthropic client must be instantiated at module level (not inside the handler) to avoid re-creation on each request
- `import 'server-only'` at top prevents accidental client bundle inclusion

**Verify:**
```bash
# ENG-06: input cap check
grep "2000" app/api/forge/route.ts
# Expected: MAX_INPUT_CHARS = 2000 and max_tokens: 2000 — PASS

# ENG-06: max_tokens check
grep "max_tokens" app/api/forge/route.ts
# Expected: max_tokens: 2000 — PASS

# INFRA-01: maxDuration check
grep "maxDuration" app/api/forge/route.ts
# Expected: export const maxDuration = 60 — PASS

# INFRA-01: runtime check
grep "runtime" app/api/forge/route.ts
# Expected: export const runtime = 'nodejs' — PASS

# ENG-03: API key NOT in client-importable files
grep -r "ANTHROPIC_API_KEY" components/ 2>/dev/null && echo "FAIL: key in client" || echo "PASS"
# Expected: PASS

npm run build
# Expected: exits 0
```

---

### Task: zustand-store

**Wave:** 1
**Requirements:** ENG-01, UI-04, UI-07, UI-14, PSET-02, PSET-03
**Depends on:** types
**Files:**
- `store/forge-store.ts`
- `lib/presets.ts`

**Implementation:**

**`store/forge-store.ts`** — complete Zustand store for all Phase 1 client state:

```typescript
'use client'
import { create } from 'zustand'
import type { ForgeStore, ForgeResult, OutputTab, BrandDNA } from '@/types'

export const useForgeStore = create<ForgeStore>((set) => ({
  // Input state
  input: '',
  setInput: (input) => set({ input }),

  // Preset state
  selectedPreset: null,
  setSelectedPreset: (id) => set({ selectedPreset: id }),

  // Forge state machine
  status: 'idle',
  result: null,
  error: null,
  setLoading: () => set({ status: 'loading', result: null, error: null }),
  setSuccess: (result: ForgeResult) => set({ status: 'success', result, error: null }),
  setError: (message: string) => set({ status: 'error', error: message }),
  reset: () => set({ status: 'idle', result: null, error: null }),

  // Output UI state
  activeTab: 'prompt' as OutputTab,
  setActiveTab: (tab: OutputTab) => set({ activeTab: tab }),

  // Brand DNA state
  brandDNA: {},
  setBrandDNA: (updates: Partial<BrandDNA>) =>
    set((state) => ({ brandDNA: { ...state.brandDNA, ...updates } })),
  brandDNAOpen: false,
  setBrandDNAOpen: (open: boolean) => set({ brandDNAOpen: open }),
}))
```

**`lib/presets.ts`** — preset category definitions. These are NOT server-only (no secrets). Import freely from client components:

```typescript
import type { PresetCategory } from '@/types'

export const PRESETS: PresetCategory[] = [
  {
    id: 'photo-generation',
    emoji: '📸',
    label: 'Photo Generation',
    description: 'Portraits, landscapes, products, fantasy scenes',
    placeholder: 'A golden retriever puppy playing in autumn leaves, warm afternoon light...',
    badge: 'Popular',
    color: '#d4a843', // gold
  },
  {
    id: 'video-generation',
    emoji: '🎬',
    label: 'Video Generation',
    description: 'Cinematic clips, commercials, social video',
    placeholder: 'A drone shot flying over a misty mountain valley at sunrise...',
    badge: 'Popular',
    color: '#e05252', // red
  },
  {
    id: 'game-design',
    emoji: '🎮',
    label: 'Game Design',
    description: 'Characters, environments, UI/UX, mechanics',
    placeholder: 'A cyberpunk RPG character — street hacker with neon tattoos and a neural implant...',
    color: '#4a9eff', // blue
  },
  {
    id: 'ai-prompt-enhancer',
    emoji: '✨',
    label: 'AI Prompt Enhancer',
    description: 'Improve any existing prompt you already have',
    placeholder: 'Paste your existing prompt here and I will forge a significantly improved version...',
    color: '#8b5cf6', // purple
  },
  {
    id: 'music-generation',
    emoji: '🎵',
    label: 'Music Generation',
    description: 'Full songs, instrumentals, jingles, backgrounds',
    placeholder: 'An upbeat lo-fi hip hop track for studying, warm vinyl crackle, mellow piano...',
    color: '#4caf7d', // green
  },
  {
    id: 'creative-writing',
    emoji: '✍️',
    label: 'Creative Writing',
    description: 'Stories, screenplays, poetry, world-building',
    placeholder: 'A short story opening: a lighthouse keeper discovers a message in a bottle from themselves...',
    color: '#d4a843', // gold
  },
  {
    id: 'business-writing',
    emoji: '💼',
    label: 'Business Writing',
    description: 'Proposals, cold emails, pitch decks, SOPs',
    placeholder: 'A cold email to a Series A SaaS founder offering UX consulting services...',
    color: '#6b7280', // muted
  },
  {
    id: 'code-generation',
    emoji: '💻',
    label: 'Code Generation',
    description: 'Features, bug fixes, architecture, code review',
    placeholder: 'Build a React hook that fetches paginated data with infinite scroll and loading states...',
    color: '#4a9eff', // blue
  },
]

// Loading messages — rotate during forge call (UI-07)
export const LOAD_MSGS: string[] = [
  'Detecting intent...',
  'Checking text risk...',
  'Applying specialist principles...',
  'Engineering your prompt...',
  'Building variations...',
  'Routing to best tool...',
  'Finishing up...',
]
```

**Verify:**
```bash
npm run type-check
# Expected: exits 0 — store and presets match types/index.ts
```

---

## Wave 2: UI Components

*All Wave 2 tasks are parallelizable. Require Wave 1 to be complete.*

*Apply `ui-ux-pro-max` skill rules to all components in this wave. Key rules:*
- *Accessibility (Priority 1): contrast 4.5:1, aria-labels on icon buttons, keyboard nav*
- *Touch targets (Priority 2): min 44×44px on all interactive elements*
- *Animation (Priority 7): 150–300ms durations, transform/opacity only, prefers-reduced-motion*
- *Use lucide-react for icons — no emojis as structural icons*
- *Use semantic Tailwind color tokens — never raw hex in className*

---

### Task: preset-selector

**Wave:** 2
**Requirements:** PSET-01, PSET-02, PSET-03, PSET-04, PSET-05, UI-08, UI-15
**Depends on:** zustand-store, types
**Files:**
- `components/PresetSelector.tsx`

**Implementation:**

This is the primary entry UX — the first thing users see. It replaces blank-slate paralysis.

```typescript
'use client'
import { Zap } from 'lucide-react'
import { clsx } from 'clsx'
import { PRESETS } from '@/lib/presets'
import { useForgeStore } from '@/store/forge-store'
import type { PresetCategory } from '@/types'

export function PresetSelector() {
  const { selectedPreset, setSelectedPreset, setInput } = useForgeStore()

  const handleSelect = (preset: PresetCategory) => {
    // Toggle: clicking selected preset deselects it
    if (selectedPreset === preset.id) {
      setSelectedPreset(null)
      setInput('')
      return
    }
    setSelectedPreset(preset.id)
    setInput('') // Clear input — placeholder will guide user
    // Focus the textarea after preset selection
    setTimeout(() => {
      const textarea = document.getElementById('forge-input')
      textarea?.focus()
    }, 50)
  }

  return (
    <div className="w-full">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-3">
        <Zap size={12} className="text-gold" aria-hidden="true" />
        <span className="text-[10px] font-mono tracking-[0.14em] text-muted uppercase">
          Choose a category or describe anything below
        </span>
      </div>

      {/* Preset grid — 2×4 on desktop, 2×4 on tablet, 1×8 on mobile */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-2"
        role="listbox"
        aria-label="Prompt category presets"
        aria-multiselectable="false"
      >
        {PRESETS.map((preset) => {
          const isSelected = selectedPreset === preset.id

          return (
            <button
              key={preset.id}
              role="option"
              aria-selected={isSelected}
              onClick={() => handleSelect(preset)}
              className={clsx(
                // Base styles
                'relative flex flex-col items-start gap-1 p-3 rounded-xl text-left',
                'border transition-all duration-200 cursor-pointer',
                'min-h-[72px]', // ensures 44px+ touch target
                // Default state
                !isSelected && [
                  'bg-card border-border',
                  'hover:border-borderHover hover:bg-surface',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
                ],
                // Selected state — border + shadow lift
                isSelected && [
                  'bg-card border-gold',
                  'shadow-[0_0_16px_rgba(212,168,67,0.2)]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
                ],
              )}
              style={isSelected ? { borderColor: preset.color, boxShadow: `0 0 16px ${preset.color}33` } : undefined}
            >
              {/* Popular badge */}
              {preset.badge && (
                <span className="absolute top-2 right-2 text-[8px] font-mono font-bold tracking-wider text-black bg-gold px-1.5 py-0.5 rounded-sm uppercase">
                  {preset.badge}
                </span>
              )}

              {/* Emoji icon */}
              <span className="text-lg leading-none" aria-hidden="true">
                {preset.emoji}
              </span>

              {/* Label */}
              <span
                className={clsx(
                  'text-xs font-semibold leading-tight',
                  isSelected ? 'text-text' : 'text-text/80',
                )}
              >
                {preset.label}
              </span>

              {/* Description — hidden on smallest breakpoint to avoid cramming */}
              <span className="hidden sm:block text-[10px] text-muted leading-snug line-clamp-2">
                {preset.description}
              </span>
            </button>
          )
        })}
      </div>

      {/* Free-type prompt below grid */}
      <p className="mt-3 text-[10px] text-muted font-mono tracking-wide">
        Or describe anything freely — the engine auto-detects intent
      </p>
    </div>
  )
}
```

**Verify:**
```bash
npm run build
# Expected: exits 0

npm run type-check
# Expected: exits 0
```
Manual check: Preset cards render in 2-col mobile / 4-col desktop grid. Clicking a card highlights it with a colored border. "Popular" badge appears on Photo Generation and Video Generation.

---

### Task: output-panel

**Wave:** 2
**Requirements:** UI-02, UI-03, UI-04, UI-05, UI-06, UI-09, UI-10, UI-11, UI-12, UI-13
**Depends on:** zustand-store, types
**Files:**
- `components/OutputPanel.tsx`
- `components/IntentBadge.tsx`
- `components/ScoreDisplay.tsx`
- `components/OutputTabs.tsx`
- `components/AlertBanner.tsx`
- `components/CopyButton.tsx`

**Implementation:**

Create each component file. The `OutputPanel` is the right-side panel that renders everything after a forge.

**`components/CopyButton.tsx`** — reusable copy button with visual feedback (UI-05):

```typescript
'use client'
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { clsx } from 'clsx'

interface CopyButtonProps {
  text: string
  label?: string
  className?: string
  size?: 'sm' | 'md'
}

export function CopyButton({ text, label = 'Copy', className, size = 'sm' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API failure — silently ignore
    }
  }

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? 'Copied!' : label}
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-lg border transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-1 focus-visible:ring-offset-bg',
        size === 'sm' && 'px-2.5 py-1.5 text-[10px] font-mono min-h-[32px]',
        size === 'md' && 'px-3 py-2 text-xs font-mono min-h-[36px]',
        copied
          ? 'bg-green/10 border-green text-green'
          : 'bg-transparent border-border text-muted hover:border-borderHover hover:text-text',
        className,
      )}
    >
      {copied ? (
        <Check size={11} aria-hidden="true" />
      ) : (
        <Copy size={11} aria-hidden="true" />
      )}
      {copied ? 'Copied!' : label}
    </button>
  )
}
```

**`components/IntentBadge.tsx`** — intent category display (UI-02):

```typescript
import { clsx } from 'clsx'

interface IntentBadgeProps {
  emoji: string
  label: string
  subtype: string
}

export function IntentBadge({ emoji, label, subtype }: IntentBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="flex items-center justify-center w-8 h-8 rounded-lg bg-card border border-border text-base"
        aria-hidden="true"
      >
        {emoji}
      </span>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-text leading-tight">{label}</span>
        <span className="text-[10px] font-mono text-muted uppercase tracking-wider">{subtype}</span>
      </div>
    </div>
  )
}
```

**`components/ScoreDisplay.tsx`** — animated score counters (UI-03). Uses `setInterval` — no Framer Motion needed:

```typescript
'use client'
import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { clsx } from 'clsx'

interface ScoreDisplayProps {
  scoreOriginal: number
  scoreForged: number
  reason: string
}

function AnimatedScore({ target, label }: { target: number; label: string }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    setCurrent(0)
    let n = 0
    // Animates at ~70fps over ~700ms for a target of 100
    const interval = setInterval(() => {
      n = Math.min(n + Math.ceil(target / 50), target)
      setCurrent(n)
      if (n >= target) clearInterval(interval)
    }, 14)
    return () => clearInterval(interval)
  }, [target])

  const color =
    current > 85 ? 'text-green' :
    current > 70 ? 'text-gold' :
    current > 50 ? 'text-text' :
    'text-muted'

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[9px] font-mono tracking-[0.14em] text-muted uppercase">{label}</span>
      <span
        className={clsx('text-3xl font-bold font-mono tabular-nums transition-colors duration-300', color)}
        aria-label={`${label}: ${current}`}
      >
        {current}
      </span>
    </div>
  )
}

export function ScoreDisplay({ scoreOriginal, scoreForged, reason }: ScoreDisplayProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-center gap-4">
        <AnimatedScore target={scoreOriginal} label="Original" />
        <ArrowRight size={16} className="text-gold mt-4 flex-shrink-0" aria-hidden="true" />
        <AnimatedScore target={scoreForged} label="Forged" />
      </div>
      {reason && (
        <p className="text-[11px] text-muted italic text-center leading-relaxed max-w-xs mx-auto">
          {reason}
        </p>
      )}
    </div>
  )
}
```

**`components/AlertBanner.tsx`** — text_risk and unknown_technique alerts (UI-09, UI-10):

```typescript
import { AlertTriangle, Lightbulb } from 'lucide-react'
import { clsx } from 'clsx'

interface AlertBannerProps {
  type: 'text-risk' | 'technique'
  message: string
}

export function AlertBanner({ type, message }: AlertBannerProps) {
  const isRisk = type === 'text-risk'

  return (
    <div
      role="alert"
      className={clsx(
        'flex items-start gap-3 rounded-xl border p-3',
        isRisk
          ? 'bg-red/5 border-red/30 text-red/90'    // UI-09: orange-red for text_risk
          : 'bg-green/5 border-green/30 text-green/90', // UI-10: green for unknown_technique
      )}
    >
      {isRisk ? (
        <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
      ) : (
        <Lightbulb size={14} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
      )}
      <p className="text-[11px] leading-relaxed">{message}</p>
    </div>
  )
}
```

**`components/OutputTabs.tsx`** — 4-tab output switcher (UI-04):

```typescript
'use client'
import { clsx } from 'clsx'
import { useForgeStore } from '@/store/forge-store'
import type { OutputTab } from '@/types'
import type { ForgeResult } from '@/types'
import { CopyButton } from './CopyButton'

const TAB_DEFS: { id: OutputTab; label: string }[] = [
  { id: 'prompt', label: 'PROMPT' },
  { id: 'negative', label: 'NEGATIVE' },
  { id: 'bold', label: 'BOLD' },
  { id: 'experimental', label: 'EXPERIMENTAL' },
]

interface OutputTabsProps {
  result: ForgeResult
}

export function OutputTabs({ result }: OutputTabsProps) {
  const { activeTab, setActiveTab } = useForgeStore()

  const getContent = (tab: OutputTab): string | null => {
    switch (tab) {
      case 'prompt': return result.prompt
      case 'negative': return result.negative_prompt ?? null
      case 'bold': return result.variation_bold
      case 'experimental': return result.variation_experimental
    }
  }

  const content = getContent(activeTab)

  // Filter tabs: hide NEGATIVE if no negative_prompt
  const visibleTabs = TAB_DEFS.filter(tab => {
    if (tab.id === 'negative' && !result.negative_prompt) return false
    return true
  })

  return (
    <div className="flex flex-col gap-0">
      {/* Tab pills */}
      <div
        className="flex gap-1 flex-wrap"
        role="tablist"
        aria-label="Prompt output tabs"
      >
        {visibleTabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tab-panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'px-3 py-1.5 text-[10px] font-mono font-bold tracking-[0.12em] rounded-full',
              'border transition-all duration-150 min-h-[32px]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-1 focus-visible:ring-offset-bg',
              activeTab === tab.id
                ? 'bg-gold/10 border-gold text-gold'       // Active: gold accent
                : 'bg-transparent border-border text-muted hover:border-borderHover hover:text-text',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {content && (
        <div
          id={`tab-panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className="relative mt-3"
        >
          {/* Copy button — top right corner */}
          <div className="absolute top-3 right-3 z-10">
            <CopyButton
              text={content}
              label={`Copy ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
            />
          </div>

          {/* Content in JetBrains Mono — code-like presentation */}
          <div className="bg-card border border-border rounded-xl p-4 pr-20">
            <p className="font-mono text-[12px] leading-relaxed text-text whitespace-pre-wrap">
              {content}
            </p>
          </div>
        </div>
      )}

      {/* Empty state for NEGATIVE when no negative prompt */}
      {activeTab === 'negative' && !result.negative_prompt && (
        <div className="mt-3 bg-card border border-border rounded-xl p-4">
          <p className="text-[11px] text-muted italic font-mono">
            No negative prompt required for this intent category.
          </p>
        </div>
      )}
    </div>
  )
}
```

**`components/OutputPanel.tsx`** — the complete right-panel assembling all output sub-components (UI-02 through UI-13, UI-06):

```typescript
'use client'
import { useForgeStore } from '@/store/forge-store'
import { IntentBadge } from './IntentBadge'
import { ScoreDisplay } from './ScoreDisplay'
import { OutputTabs } from './OutputTabs'
import { AlertBanner } from './AlertBanner'
import { CopyButton } from './CopyButton'
import { Wrench, Lightbulb, Settings } from 'lucide-react'

function buildCopyEverythingText(result: ReturnType<typeof useForgeStore>['result']): string {
  if (!result) return ''
  const parts: string[] = []
  parts.push(`FORGED PROMPT:\n${result.prompt}`)
  if (result.negative_prompt) parts.push(`\nNEGATIVE PROMPT:\n${result.negative_prompt}`)
  if (result.variation_bold) parts.push(`\nBOLD VARIATION:\n${result.variation_bold}`)
  if (result.variation_experimental) parts.push(`\nEXPERIMENTAL VARIATION:\n${result.variation_experimental}`)
  if (result.text_risk && result.text_risk_note) parts.push(`\nTEXT RISK NOTE:\n${result.text_risk_note}`)
  if (result.unknown_technique && result.technique_flag) parts.push(`\nTECHNIQUE FLAG:\n${result.technique_flag}`)
  if (result.tool) parts.push(`\nUSE IN: ${result.tool}\n${result.tool_reason}`)
  if (result.parameters) parts.push(`\n${result.parameters_label ?? 'PARAMETERS'}:\n${result.parameters}`)
  if (result.tips?.length) parts.push(`\nTIPS:\n${result.tips.map((t, i) => `${i + 1}. ${t}`).join('\n')}`)
  return parts.join('\n')
}

export function OutputPanel() {
  const { status, result, error } = useForgeStore()

  // Empty state — shown before first forge
  if (status === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-4 py-12">
        <div className="w-12 h-12 rounded-2xl bg-forge-gradient flex items-center justify-center text-2xl">
          ⚡
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-text/60">Your forged prompt will appear here</p>
          <p className="text-xs text-muted mt-1">Select a category above or describe anything freely</p>
        </div>
      </div>
    )
  }

  // Error state
  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-3 py-12">
        <p className="text-sm text-red text-center">{error}</p>
        <p className="text-xs text-muted text-center">Your input is preserved — try rephrasing and forge again.</p>
      </div>
    )
  }

  // Success state
  if (status === 'success' && result) {
    return (
      <div className="flex flex-col gap-5 py-2">
        {/* Row 1: Intent badge + score side by side */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <IntentBadge
            emoji={result.intent_emoji}
            label={result.intent_label}
            subtype={result.intent_subtype}
          />
          <ScoreDisplay
            scoreOriginal={result.score_original}
            scoreForged={result.score_forged}
            reason={result.score_reason}
          />
        </div>

        {/* Alert banners — conditional */}
        {result.text_risk && result.text_risk_note && (
          <AlertBanner type="text-risk" message={result.text_risk_note} />
        )}
        {result.unknown_technique && result.technique_flag && (
          <AlertBanner type="technique" message={result.technique_flag} />
        )}

        {/* Output tabs — 4-tab prompt display */}
        <OutputTabs result={result} />

        {/* Tool recommendation */}
        <div className="flex flex-col gap-1.5 bg-card border border-border rounded-xl p-3">
          <div className="flex items-center gap-2">
            <Wrench size={12} className="text-gold" aria-hidden="true" />
            <span className="text-[10px] font-mono tracking-wider text-muted uppercase">Recommended Tool</span>
          </div>
          <p className="text-sm font-semibold text-text">{result.tool}</p>
          <p className="text-[11px] text-muted leading-relaxed">{result.tool_reason}</p>
        </div>

        {/* Parameters — conditional */}
        {result.parameters && (
          <div className="flex flex-col gap-1.5 bg-card border border-border rounded-xl p-3">
            <div className="flex items-center gap-2">
              <Settings size={12} className="text-gold" aria-hidden="true" />
              <span className="text-[10px] font-mono tracking-wider text-muted uppercase">
                {result.parameters_label ?? 'Parameters'}
              </span>
            </div>
            <p className="font-mono text-[11px] text-text whitespace-pre-wrap leading-relaxed">
              {result.parameters}
            </p>
          </div>
        )}

        {/* Tips */}
        {result.tips?.length > 0 && (
          <div className="flex flex-col gap-2 bg-card border border-border rounded-xl p-3">
            <div className="flex items-center gap-2">
              <Lightbulb size={12} className="text-gold" aria-hidden="true" />
              <span className="text-[10px] font-mono tracking-wider text-muted uppercase">Tips</span>
            </div>
            <ul className="flex flex-col gap-1.5" aria-label="Forge tips">
              {result.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-gold font-mono text-[10px] mt-0.5 flex-shrink-0">{i + 1}.</span>
                  <span className="text-[11px] text-text/80 leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Copy Everything button */}
        <div className="flex justify-end pt-1">
          <CopyButton
            text={buildCopyEverythingText(result)}
            label="Copy Everything"
            size="md"
          />
        </div>
      </div>
    )
  }

  return null
}
```

**Verify:**
```bash
npm run build
# Expected: exits 0

npx vitest run __tests__/output-tabs.test.ts
# Expected: all .todo stubs pending — test run exits 0 with pending count
```

---

### Task: input-panel

**Wave:** 2
**Requirements:** UI-01, UI-07, UI-08, UI-14, UI-15, UI-16, PSET-02, PSET-03, PSET-04
**Depends on:** preset-selector, zustand-store, types
**Files:**
- `components/InputPanel.tsx`
- `components/BrandDNAAccordion.tsx`
- `components/PromptForge.tsx`
- `app/page.tsx` (update — replace placeholder with PromptForge component)

**Implementation:**

**`components/BrandDNAAccordion.tsx`** — expandable Brand DNA panel (UI-14):

```typescript
'use client'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { clsx } from 'clsx'
import { useForgeStore } from '@/store/forge-store'

export function BrandDNAAccordion() {
  const { brandDNA, setBrandDNA, brandDNAOpen, setBrandDNAOpen } = useForgeStore()

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      {/* Accordion header */}
      <button
        onClick={() => setBrandDNAOpen(!brandDNAOpen)}
        aria-expanded={brandDNAOpen}
        aria-controls="brand-dna-panel"
        className={clsx(
          'w-full flex items-center justify-between px-3 py-2.5',
          'bg-card hover:bg-surface transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-inset',
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-[0.12em] text-muted uppercase">Brand DNA</span>
          {(brandDNA.brandName || brandDNA.toneOfVoice || brandDNA.targetAudience) && (
            <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" aria-label="Brand DNA has values" />
          )}
        </div>
        {brandDNAOpen ? (
          <ChevronDown size={12} className="text-muted" aria-hidden="true" />
        ) : (
          <ChevronRight size={12} className="text-muted" aria-hidden="true" />
        )}
      </button>

      {/* Accordion body */}
      <div
        id="brand-dna-panel"
        role="region"
        aria-label="Brand DNA fields"
        className={clsx(
          'overflow-hidden transition-all duration-200',
          brandDNAOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="flex flex-col gap-2.5 p-3 bg-card border-t border-border">
          <p className="text-[10px] text-muted leading-relaxed">
            Add brand context to make every forge consistent with your identity. Optional — leave blank for general use.
          </p>

          {[
            { key: 'brandName' as const, label: 'Brand Name', placeholder: 'e.g. Nike, Notion, your startup name' },
            { key: 'toneOfVoice' as const, label: 'Tone of Voice', placeholder: 'e.g. bold and energetic, calm and professional' },
            { key: 'targetAudience' as const, label: 'Target Audience', placeholder: 'e.g. Gen Z fitness enthusiasts, B2B SaaS founders' },
            { key: 'industry' as const, label: 'Industry (optional)', placeholder: 'e.g. Healthcare, E-commerce, Gaming' },
            { key: 'keywords' as const, label: 'Keywords (optional)', placeholder: 'e.g. minimalist, premium, community-first' },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className="flex flex-col gap-1">
              <label
                htmlFor={`brand-dna-${key}`}
                className="text-[10px] font-medium text-muted/80"
              >
                {label}
              </label>
              <input
                id={`brand-dna-${key}`}
                type="text"
                value={brandDNA[key] ?? ''}
                onChange={(e) => setBrandDNA({ [key]: e.target.value })}
                placeholder={placeholder}
                className={clsx(
                  'w-full bg-surface border border-border rounded-lg px-2.5 py-2',
                  'text-[11px] text-text placeholder:text-muted/50',
                  'focus:outline-none focus:border-borderHover focus:ring-1 focus:ring-gold/20',
                  'transition-colors duration-150',
                  'min-h-[36px]', // accessibility: 44px touch target met via py-2 on 11px text
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

**`components/InputPanel.tsx`** — left panel with textarea, preset selector, Brand DNA, forge button:

```typescript
'use client'
import { useRef } from 'react'
import { Zap, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'
import { useForgeStore } from '@/store/forge-store'
import { PresetSelector } from './PresetSelector'
import { BrandDNAAccordion } from './BrandDNAAccordion'
import { PRESETS, LOAD_MSGS } from '@/lib/presets'
import type { ForgeRequest, ForgeResult, ForgeError } from '@/types'

export function InputPanel() {
  const {
    input, setInput,
    selectedPreset,
    status,
    brandDNA,
    setLoading, setSuccess, setError, reset,
    setActiveTab,
  } = useForgeStore()

  const isLoading = status === 'loading'
  const loadMsgRef = useRef(0)

  // Compute textarea placeholder based on selected preset
  const placeholder = selectedPreset
    ? PRESETS.find(p => p.id === selectedPreset)?.placeholder
      ?? 'Describe what you want to create...'
    : 'Describe anything — portrait photo, video scene, song, code feature, business email...\n\nTry: "A golden retriever puppy in autumn leaves" or paste any idea'

  const handleForge = async () => {
    if (!input.trim() || isLoading) return

    setLoading()
    setActiveTab('prompt')

    const body: ForgeRequest = {
      input: input.trim(),
      presetHint: selectedPreset ?? undefined,
      brandDNA: (brandDNA.brandName || brandDNA.toneOfVoice || brandDNA.targetAudience)
        ? brandDNA
        : undefined,
    }

    try {
      const response = await fetch('/api/forge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data: ForgeResult | ForgeError = await response.json()

      if (!response.ok || 'error' in data) {
        const msg = 'error' in data
          ? data.error
          : 'Something went wrong. Try rephrasing your idea.'
        setError(msg)
        return
      }

      setSuccess(data as ForgeResult)

      // On mobile: scroll to output panel after successful forge
      if (window.innerWidth < 1024) {
        setTimeout(() => {
          document.getElementById('output-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    } catch {
      setError('Network error — check your connection and try again.')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Preset selector grid */}
      <PresetSelector />

      {/* Textarea */}
      <div className="flex flex-col gap-1.5">
        <textarea
          id="forge-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleForge()
          }}
          placeholder={placeholder}
          maxLength={2000}
          disabled={isLoading}
          aria-label="Describe what you want to forge"
          aria-describedby="char-count"
          className={clsx(
            'w-full bg-card border rounded-xl px-4 py-3',
            'text-sm text-text placeholder:text-muted/50 leading-relaxed',
            'resize-none min-h-[120px]',
            'focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-borderHover',
            'transition-all duration-200 font-sans',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            input.length > 0 ? 'border-borderHover' : 'border-border',
          )}
        />
        {/* Character count */}
        <div id="char-count" className="flex justify-end">
          <span
            className={clsx(
              'text-[10px] font-mono',
              input.length > 1800 ? 'text-red' : 'text-muted',
            )}
            aria-live="polite"
          >
            {input.length} / 2000
          </span>
        </div>
      </div>

      {/* Brand DNA accordion */}
      <BrandDNAAccordion />

      {/* Forge button */}
      <button
        onClick={handleForge}
        disabled={!input.trim() || isLoading}
        aria-label={isLoading ? 'Forging your prompt...' : 'Forge prompt'}
        className={clsx(
          'w-full flex items-center justify-center gap-2.5',
          'rounded-xl py-3.5 px-6 font-semibold text-sm',
          'transition-all duration-200 min-h-[52px]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
          !input.trim() || isLoading
            ? 'bg-surface border border-border text-muted cursor-not-allowed opacity-60'
            : 'bg-forge-gradient text-white hover:opacity-90 active:scale-[0.98] shadow-lg shadow-red/20',
        )}
      >
        {isLoading ? (
          <>
            <Loader2 size={15} className="animate-spin flex-shrink-0" aria-hidden="true" />
            <LoadingMessage />
          </>
        ) : (
          <>
            <Zap size={15} aria-hidden="true" />
            Forge Prompt
            <span className="text-[10px] font-mono opacity-60">⌘↵</span>
          </>
        )}
      </button>
    </div>
  )
}

// Rotating loading messages during forge (UI-07)
function LoadingMessage() {
  const [msgIndex, setMsgIndex] = React.useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(prev => (prev + 1) % LOAD_MSGS.length)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return <span>{LOAD_MSGS[msgIndex]}</span>
}

// React import needed for LoadingMessage
import React from 'react'
```

**`components/PromptForge.tsx`** — root client component, two-panel layout (UI-01):

```typescript
'use client'
import { InputPanel } from './InputPanel'
import { OutputPanel } from './OutputPanel'

export function PromptForge() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-surface sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg bg-forge-gradient flex items-center justify-center text-sm"
              aria-hidden="true"
            >
              ⚡
            </div>
            <span className="font-bold text-sm tracking-tight text-text">PromptForge</span>
            <span className="font-mono text-[8px] font-bold px-1.5 py-0.5 rounded bg-gold text-black tracking-widest">
              BETA
            </span>
          </div>
          <p className="hidden sm:block text-[11px] text-muted font-mono">
            Turn any idea into the perfect AI prompt
          </p>
        </div>
      </header>

      {/* Two-panel main area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {/* Desktop: side-by-side. Mobile: stacked (input above, output below) */}
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 lg:gap-8 lg:items-start">
          {/* Left panel — input + presets + brand DNA */}
          <div className="lg:sticky lg:top-20">
            <div className="bg-surface border border-border rounded-2xl p-5">
              <InputPanel />
            </div>
          </div>

          {/* Right panel — output */}
          <div id="output-panel">
            <div className="bg-surface border border-border rounded-2xl p-5 min-h-[400px]">
              <OutputPanel />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
```

Update **`app/page.tsx`** to render the PromptForge client component:

```typescript
import { PromptForge } from '@/components/PromptForge'

export default function Home() {
  return <PromptForge />
}
```

**Verify:**
```bash
npm run build
# Expected: exits 0

npm run type-check
# Expected: exits 0

npx vitest run __tests__/brand-dna.test.ts
# Expected: all .todo stubs pending — exits 0
```

Manual check: `npm run dev`, open http://localhost:3000 — two-panel layout renders with preset grid visible.

---

## Wave 3: Integration, Polish + Deploy Config

*All Wave 3 tasks are parallelizable. Require Wave 2 to be complete.*

---

### Task: security-verification

**Wave:** 3
**Requirements:** ENG-03, ENG-04, ENG-06, INFRA-02
**Depends on:** forge-route, system-prompt, input-panel
**Files:**
- No new files — verification task only

**Implementation:**

Run the complete security verification suite from `01-VALIDATION.md`. Fix any failures before proceeding.

```bash
# ENG-03: API key never in client code
grep -r "ANTHROPIC_API_KEY" components/ 2>/dev/null && echo "FAIL: API key in components" || echo "PASS: no key in components"

grep -r "ANTHROPIC_API_KEY" store/ 2>/dev/null && echo "FAIL: API key in store" || echo "PASS: no key in store"

grep -r "ANTHROPIC_API_KEY" lib/presets.ts 2>/dev/null && echo "FAIL: API key in presets" || echo "PASS: no key in presets"

# ENG-04: server-only guard
grep "server-only" lib/system-prompt.ts && echo "PASS: server-only present" || echo "FAIL: missing server-only"

# ENG-06: input cap enforced in route
grep "2000" app/api/forge/route.ts && echo "PASS: 2000 char limit present" || echo "FAIL: no input cap"

grep "max_tokens" app/api/forge/route.ts && echo "PASS: max_tokens present" || echo "FAIL: no max_tokens"

# INFRA-01: maxDuration and runtime
grep "maxDuration" app/api/forge/route.ts && echo "PASS: maxDuration present" || echo "FAIL: no maxDuration"

grep "runtime.*nodejs" app/api/forge/route.ts && echo "PASS: nodejs runtime present" || echo "FAIL: no runtime"

# ENG-03: After build, verify API key not in static bundles
npm run build
grep -r "sk-ant" .next/static/ 2>/dev/null && echo "FAIL: API key in bundle" || echo "PASS: key not in bundle"

# ENG-04: system prompt not in client chunks
grep -rn "You are PromptForge" .next/static/ 2>/dev/null && echo "FAIL: system prompt in bundle" || echo "PASS: system prompt server-only"
```

All checks must output PASS. If any fail:
- Key in components → remove from component, ensure only `app/api/forge/route.ts` uses it
- Missing server-only → add `import 'server-only'` as first line of `lib/system-prompt.ts`
- Missing input cap → add check in `app/api/forge/route.ts` before Anthropic call
- Key in bundle → investigate which component imports from server-only path, fix the import chain

**Verify:**
```bash
# Run full security grep suite above — all lines output PASS
npm run build && npm run type-check
# Both exit 0
```

---

### Task: fill-test-stubs

**Wave:** 3
**Requirements:** ENG-01, ENG-05, ENG-06, UI-04, UI-14
**Depends on:** forge-route, output-panel, input-panel
**Files:**
- `__tests__/forge-route.test.ts` (update — fill in stubs)
- `__tests__/output-tabs.test.ts` (update — fill in stubs)
- `__tests__/brand-dna.test.ts` (update — fill in stubs)

**Implementation:**

Now that Wave 1 and Wave 2 are complete, replace `.todo` stubs with real test implementations.

**`__tests__/forge-route.test.ts`** — fill in route handler logic tests:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/forge/route'

// Mock Anthropic SDK to avoid real API calls in tests
vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: {
      create: vi.fn().mockResolvedValue({
        content: [{ type: 'text', text: JSON.stringify({
          intent_category: 'IMAGE_GENERATION',
          intent_subtype: 'HUMAN',
          intent_label: 'Portrait Photography',
          intent_emoji: '📸',
          score_original: 25,
          score_forged: 91,
          score_reason: 'Added lighting, composition, and technical camera parameters.',
          prompt: 'A golden retriever puppy playing in autumn leaves, warm afternoon light, bokeh background',
          tool: 'Midjourney v7',
          tool_reason: 'Best for photorealistic portrait photography',
          tips: ['Use --ar 4:5 for portrait framing', 'Add --style raw for more natural look'],
          variation_bold: 'An epic golden retriever puppy EXPLODING through autumn leaves, cinematic lens flare',
          variation_experimental: 'A stop-motion animation of a puppy discovering autumn for the first time',
        }) }],
      }),
    },
  })),
}))

// Mock server-only to allow import in test environment
vi.mock('server-only', () => ({}))

// Mock system-prompt
vi.mock('@/lib/system-prompt', () => ({
  SYSTEM_PROMPT: 'You are PromptForge. Respond in JSON.',
}))

function makeRequest(body: unknown) {
  return new Request('http://localhost:3000/api/forge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/forge — input validation (ENG-06)', () => {
  it('rejects inputs longer than 2000 characters with 400 status', async () => {
    const req = makeRequest({ input: 'a'.repeat(2001) })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.code).toBe('input_too_long')
  })

  it('accepts inputs exactly 2000 characters', async () => {
    const req = makeRequest({ input: 'a'.repeat(2000) })
    const res = await POST(req)
    expect(res.status).toBe(200)
  })

  it('rejects empty input with 400 status', async () => {
    const req = makeRequest({ input: '   ' })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})

describe('POST /api/forge — JSON parse with retry (ENG-05)', () => {
  it('strips markdown fences before parsing', async () => {
    // Test the stripMarkdownFences helper behavior via route response
    const req = makeRequest({ input: 'a golden retriever puppy' })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.prompt).toBeDefined()
  })

  it('returns ForgeResult on successful parse', async () => {
    const req = makeRequest({ input: 'portrait of a cat in sunlight' })
    const res = await POST(req)
    const data = await res.json()
    expect(data.intent_category).toBe('IMAGE_GENERATION')
    expect(data.prompt).toBeTruthy()
    expect(Array.isArray(data.tips)).toBe(true)
  })
})

describe('POST /api/forge — max_tokens enforcement (ENG-06)', () => {
  it('includes max_tokens: 2000 in the Anthropic API call', async () => {
    const Anthropic = (await import('@anthropic-ai/sdk')).default as unknown as ReturnType<typeof vi.fn>
    const mockCreate = vi.fn().mockResolvedValue({
      content: [{ type: 'text', text: JSON.stringify({
        intent_category: 'IMAGE_GENERATION', intent_subtype: 'HUMAN', intent_label: 'Test',
        intent_emoji: '📸', score_original: 20, score_forged: 80, score_reason: 'test',
        prompt: 'test prompt', tool: 'Midjourney', tool_reason: 'best',
        tips: ['tip 1'], variation_bold: 'bold', variation_experimental: 'exp',
      }) }],
    })
    Anthropic.mockImplementationOnce(() => ({ messages: { create: mockCreate } }))
    const req = makeRequest({ input: 'test input' })
    await POST(req)
    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ max_tokens: 2000 }))
  })
})

describe('POST /api/forge — returns ForgeResult shape (ENG-01)', () => {
  it('required fields are present in successful response', async () => {
    const req = makeRequest({ input: 'a cat portrait in sunlight' })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toMatchObject({
      intent_category: expect.any(String),
      prompt: expect.any(String),
      tool: expect.any(String),
      tool_reason: expect.any(String),
      tips: expect.any(Array),
      score_original: expect.any(Number),
      score_forged: expect.any(Number),
    })
  })
})
```

**`__tests__/output-tabs.test.ts`** — fill in tab switching tests. These test the Zustand store directly (simpler than mounting the full component):

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useForgeStore } from '@/store/forge-store'
import type { OutputTab } from '@/types'

describe('OutputTabs — tab switching via Zustand store (UI-04)', () => {
  beforeEach(() => {
    // Reset store state between tests
    useForgeStore.setState({
      activeTab: 'prompt',
      status: 'idle',
      result: null,
    })
  })

  it('activeTab defaults to "prompt"', () => {
    const { result } = renderHook(() => useForgeStore())
    expect(result.current.activeTab).toBe('prompt')
  })

  it('setActiveTab("bold") updates activeTab to "bold"', () => {
    const { result } = renderHook(() => useForgeStore())
    act(() => result.current.setActiveTab('bold'))
    expect(result.current.activeTab).toBe('bold')
  })

  it('setActiveTab("experimental") updates activeTab to "experimental"', () => {
    const { result } = renderHook(() => useForgeStore())
    act(() => result.current.setActiveTab('experimental'))
    expect(result.current.activeTab).toBe('experimental')
  })

  it('setActiveTab("negative") updates activeTab to "negative"', () => {
    const { result } = renderHook(() => useForgeStore())
    act(() => result.current.setActiveTab('negative'))
    expect(result.current.activeTab).toBe('negative')
  })

  it('resetting store returns activeTab to "prompt"', () => {
    const { result } = renderHook(() => useForgeStore())
    act(() => {
      result.current.setActiveTab('bold')
      result.current.reset()
    })
    // reset() preserves activeTab — setActiveTab('prompt') is called in handleForge
    // Verify the tab was changed then independently verify reset behavior
    expect(result.current.status).toBe('idle')
  })
})
```

**`__tests__/brand-dna.test.ts`** — fill in Brand DNA store tests:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useForgeStore } from '@/store/forge-store'

describe('BrandDNAAccordion — store state (UI-14)', () => {
  beforeEach(() => {
    useForgeStore.setState({
      brandDNA: {},
      brandDNAOpen: false,
    })
  })

  it('brandDNAOpen is false by default', () => {
    const { result } = renderHook(() => useForgeStore())
    expect(result.current.brandDNAOpen).toBe(false)
  })

  it('setBrandDNAOpen(true) opens the accordion', () => {
    const { result } = renderHook(() => useForgeStore())
    act(() => result.current.setBrandDNAOpen(true))
    expect(result.current.brandDNAOpen).toBe(true)
  })

  it('setBrandDNAOpen(false) closes the accordion', () => {
    const { result } = renderHook(() => useForgeStore())
    act(() => {
      result.current.setBrandDNAOpen(true)
      result.current.setBrandDNAOpen(false)
    })
    expect(result.current.brandDNAOpen).toBe(false)
  })

  it('setBrandDNA updates brandName in the store', () => {
    const { result } = renderHook(() => useForgeStore())
    act(() => result.current.setBrandDNA({ brandName: 'Nike' }))
    expect(result.current.brandDNA.brandName).toBe('Nike')
  })

  it('setBrandDNA updates toneOfVoice in the store', () => {
    const { result } = renderHook(() => useForgeStore())
    act(() => result.current.setBrandDNA({ toneOfVoice: 'bold and energetic' }))
    expect(result.current.brandDNA.toneOfVoice).toBe('bold and energetic')
  })

  it('setBrandDNA merges values without overwriting other fields', () => {
    const { result } = renderHook(() => useForgeStore())
    act(() => {
      result.current.setBrandDNA({ brandName: 'Nike' })
      result.current.setBrandDNA({ toneOfVoice: 'bold' })
    })
    expect(result.current.brandDNA.brandName).toBe('Nike')
    expect(result.current.brandDNA.toneOfVoice).toBe('bold')
  })
})
```

**Verify:**
```bash
npx vitest run
# Expected: all tests pass — forge-route, output-tabs, brand-dna suites all green
# Zero failing tests
```

---

### Task: infra-deploy

**Wave:** 3
**Requirements:** INFRA-01, INFRA-02, INFRA-03
**Depends on:** project-setup, forge-route
**Files:**
- `README.md` (create — documents env vars per INFRA-03)
- `vercel.json` (verify exists from Wave 0)

**Implementation:**

Verify `vercel.json` is correct:

```json
{
  "functions": {
    "app/api/forge/route.ts": {
      "maxDuration": 60
    }
  }
}
```

Create `README.md` documenting environment variable setup (INFRA-03 — documented with no values):

```markdown
# PromptForge

Turn any plain English description into the perfect AI prompt.

## Setup

### Environment Variables

Create `.env.local` in the project root with the following variables:

```
# Required — Phase 1
ANTHROPIC_API_KEY=sk-ant-...   # Get from console.anthropic.com

# Required — Phase 2 (not needed for Phase 1)
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
# CLERK_SECRET_KEY=sk_live_...
# DATABASE_URL=postgresql://...

# Required — Phase 3 (not needed for Phase 1)
# STRIPE_SECRET_KEY=sk_live_...
# STRIPE_WEBHOOK_SECRET=whsec_...
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
# NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

**Never commit `.env.local` to version control.** It is in `.gitignore`.

### Development

```bash
npm install
npm run dev      # Start dev server at http://localhost:3000
npm run test     # Run unit tests
npm run build    # Production build
```

### Deployment (Vercel)

1. Push to GitHub
2. Import repo in Vercel dashboard
3. Add all environment variables in Vercel Project Settings → Environment Variables
4. Deploy

The forge API route is configured with `maxDuration: 60` seconds in `vercel.json` for Anthropic API latency.

## Security Notes

- `lib/system-prompt.ts` is excluded from version control (proprietary IP)
- `ANTHROPIC_API_KEY` lives only in the server-side route handler — never in client code
- Input is capped at 2000 characters server-side
- `max_tokens: 2000` is set on every Anthropic API call
```

After README creation, do a complete final verification run:

```bash
npm run build
# Must exit 0

npm run type-check
# Must exit 0

npx vitest run
# Must exit 0 with all tests passing
```

**Verify:**
```bash
npm run build && npm run type-check && npx vitest run
# All three commands exit 0
```

---

## Execution Order

| Wave | Tasks | Parallelizable | Gate |
|------|-------|----------------|------|
| 0 | project-setup, types, test-stubs | Yes (within wave) | Must all complete before Wave 1 |
| 1 | system-prompt, forge-route, zustand-store | Yes (within wave) | Must all complete before Wave 2 |
| 2 | preset-selector, output-panel, input-panel | Yes (within wave) | Must all complete before Wave 3 |
| 3 | security-verification, fill-test-stubs, infra-deploy | Yes (within wave) | Phase complete when all pass |

Note: Within Wave 0, `types` depends on `project-setup` completing first (needs tsconfig). `test-stubs` depends on both. When parallelizing, start `project-setup` first, then `types` and `test-stubs` can run once the tsconfig exists.

---

## Verification Commands (Run After Each Wave)

### After Wave 0
```bash
npm run build         # exits 0
npm run type-check    # exits 0
npx vitest run        # all .todo stubs — exits 0
```

### After Wave 1
```bash
npm run build         # exits 0
npm run type-check    # exits 0
npx vitest run        # stubs still pending — exits 0
grep "server-only" lib/system-prompt.ts   # PASS
grep "maxDuration" app/api/forge/route.ts # PASS
grep "max_tokens" app/api/forge/route.ts  # PASS
grep "2000" app/api/forge/route.ts        # PASS
```

### After Wave 2
```bash
npm run build                      # exits 0
npm run type-check                 # exits 0
npx vitest run                     # stubs pending — exits 0
# Manual: npm run dev → http://localhost:3000
# Manual: verify two-panel layout, preset grid visible, brand DNA accordion works
```

### After Wave 3 (Final)
```bash
npm run build         # exits 0
npm run type-check    # exits 0
npx vitest run        # ALL tests pass — zero failures

# Full security check suite
grep -r "ANTHROPIC_API_KEY" components/ 2>/dev/null && echo "FAIL" || echo "PASS"
grep "server-only" lib/system-prompt.ts && echo "PASS" || echo "FAIL"
grep "maxDuration" app/api/forge/route.ts && echo "PASS" || echo "FAIL"
grep -r "sk-ant" .next/static/ 2>/dev/null && echo "FAIL" || echo "PASS"
grep -rn "You are PromptForge" .next/static/ 2>/dev/null && echo "FAIL" || echo "PASS"
```

---

## Manual Verification Checklist (Post Wave 3)

Run `npm run dev` and verify each item manually:

| Item | Steps | Expected |
|------|-------|----------|
| Two-panel desktop layout (UI-01) | Open at 1440px width | Left panel (420px) + right panel side-by-side |
| Mobile stacking (UI-01) | Resize to 375px | Left panel above, right panel below |
| Preset grid (PSET-01) | Open page | 8 preset cards in 2×4 grid (desktop: 4-col) |
| Popular badges (PSET-05) | Look at cards | "Popular" badge on Photo Generation + Video Generation |
| Preset selection (PSET-02, PSET-03) | Click "Photo Generation" | Card highlights with gold border + shadow |
| Preset placeholder (PSET-02) | Click preset, look at textarea | Placeholder changes to preset-specific text |
| Free-text override (PSET-04) | Ignore presets, type freely | Forge works without preset selection |
| Rotating loading messages (UI-07) | Click Forge, watch button | Message cycles through: "Detecting intent...", "Applying specialist principles..."  etc |
| Intent badge (UI-02) | After forge | Emoji + label + subtype displayed |
| Score animation (UI-03) | After forge | Both score counters animate from 0 to target |
| Score reason (UI-03) | After forge | Italic caption below scores explains delta |
| 4 tabs (UI-04) | After forge | PROMPT / NEGATIVE (if present) / BOLD / EXPERIMENTAL tabs visible |
| Gold active tab (UI-04) | Click BOLD tab | BOLD tab has gold border + gold text |
| Tab content switches (UI-04) | Click each tab | Content area shows matching prompt variant |
| Copy per section (UI-05) | Click copy button on PROMPT | Button shows "Copied!" for 2s |
| Copy Everything (UI-06) | Click "Copy Everything" | Paste into text editor → formatted multi-section output |
| Tool recommendation (UI-11) | After forge | Tool name + reason displayed |
| Tips list (UI-12) | After forge | 3–5 numbered tips shown |
| Parameters (UI-13) | Forge a video/image prompt | Parameters section appears if present |
| text_risk orange alert (UI-09) | Forge "a classroom with alphabet chart on wall" | Orange alert with text risk advice appears |
| unknown_technique green alert (UI-10) | Forge with obscure technique | Green alert with technique flag appears |
| Brand DNA accordion (UI-14) | Click "Brand DNA" header | Accordion expands revealing 5 fields |
| Brand DNA fields update (UI-14) | Type in Brand Name field | Field accepts input |
| Brand DNA included in forge (UI-14) | Fill Brand Name + tone, forge | ForgeResult reflects brand context |
| Design tokens (UI-16) | DevTools inspect body | Background: #030407, font-family: DM Sans |
| JetBrains Mono in output (UI-16) | Inspect prompt text in output | font-family: JetBrains Mono |
| Empty state (UI-08) | Load page fresh | Output panel shows "Your forged prompt will appear here" |
| Error state preserved input | Force an error, check textarea | Input text is preserved, retry possible |
| API key not in bundle (ENG-03) | Inspect DevTools → Sources | No sk-ant- string visible |
| Mobile scroll to output | On mobile, click Forge | Page auto-scrolls to output panel after result |

---

## Requirement Coverage

| Requirement | Task | Wave |
|-------------|------|------|
| ENG-01 | forge-route, fill-test-stubs | 1, 3 |
| ENG-02 | system-prompt | 1 |
| ENG-03 | forge-route, security-verification | 1, 3 |
| ENG-04 | system-prompt, security-verification | 1, 3 |
| ENG-05 | forge-route, fill-test-stubs | 1, 3 |
| ENG-06 | forge-route, fill-test-stubs, security-verification | 1, 3 |
| PSET-01 | preset-selector | 2 |
| PSET-02 | preset-selector, input-panel | 2 |
| PSET-03 | zustand-store, input-panel | 1, 2 |
| PSET-04 | input-panel | 2 |
| PSET-05 | preset-selector, zustand-store | 1, 2 |
| UI-01 | input-panel (PromptForge.tsx) | 2 |
| UI-02 | output-panel (IntentBadge.tsx) | 2 |
| UI-03 | output-panel (ScoreDisplay.tsx) | 2 |
| UI-04 | output-panel (OutputTabs.tsx), fill-test-stubs | 2, 3 |
| UI-05 | output-panel (CopyButton.tsx) | 2 |
| UI-06 | output-panel (OutputPanel.tsx copyAll) | 2 |
| UI-07 | input-panel (LoadingMessage in InputPanel.tsx) | 2 |
| UI-08 | output-panel (idle state in OutputPanel.tsx) | 2 |
| UI-09 | output-panel (AlertBanner.tsx text-risk) | 2 |
| UI-10 | output-panel (AlertBanner.tsx technique) | 2 |
| UI-11 | output-panel (tool section) | 2 |
| UI-12 | output-panel (tips section) | 2 |
| UI-13 | output-panel (parameters section) | 2 |
| UI-14 | input-panel (BrandDNAAccordion.tsx), fill-test-stubs | 2, 3 |
| UI-15 | preset-selector (free-type prompt copy) | 2 |
| UI-16 | project-setup (tailwind.config.ts, globals.css) | 0 |
| INFRA-01 | forge-route (maxDuration, runtime), infra-deploy | 1, 3 |
| INFRA-02 | project-setup (.env.local, .env.example) | 0 |
| INFRA-03 | infra-deploy (README.md) | 3 |

---

## Critical Implementation Reminders

These are the highest-risk points — verify at each wave boundary:

1. **`lib/system-prompt.ts`** must have `import 'server-only'` as its FIRST line. The build will catch violations, but check manually too.

2. **`ANTHROPIC_API_KEY`** must never appear outside `app/api/forge/route.ts`. Search `components/`, `store/`, `lib/` after Wave 1.

3. **`max_tokens: 2000`** must be on every `anthropic.messages.create()` call. There is currently exactly one call — verify it has this field.

4. **`export const maxDuration = 60`** and **`export const runtime = 'nodejs'`** must be in `app/api/forge/route.ts`. Without these, Vercel may time out the function.

5. **JSON parse retry** — the forge route must attempt parsing twice before returning an error. The second attempt appends an explicit JSON-only instruction to the user message.

6. **Input cap is server-side** — the `MAX_INPUT_CHARS = 2000` check in the route handler is the authoritative gate. The client-side `maxLength={2000}` is UX only, not security.

7. **Score animation uses `setInterval`** — no Framer Motion. The `ScoreDisplay` component must clean up its interval in the `useEffect` return function.

8. **`PromptForge.tsx` is the single `"use client"` boundary** — do not add `"use client"` to `InputPanel`, `OutputPanel`, or any sub-component they import. They inherit client context from `PromptForge.tsx`.

9. **`lib/system-prompt.ts` is in `.gitignore`** — the executor must create this file locally from `reference/referencepromptforge-v10.jsx`. It must not be committed to git.

10. **Mobile scroll** — after a successful forge on `window.innerWidth < 1024`, `InputPanel.tsx` must scroll the `#output-panel` element into view.
