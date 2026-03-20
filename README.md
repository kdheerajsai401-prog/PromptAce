# PromptAce ✦

**Turn plain English into professionally optimized AI prompts — instantly.**

![Next.js](https://img.shields.io/badge/Next.js_14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Claude API](https://img.shields.io/badge/Claude_API-CC785C?style=flat-square&logo=anthropic&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-black?style=flat-square&logo=vercel)
![Status](https://img.shields.io/badge/Status-In_Development-F0AA20?style=flat-square)

---

## What Is PromptAce?

Most people get mediocre results from AI tools because crafting a great prompt takes skill, experience, and domain knowledge they don't have.

**PromptAce solves that.** Describe what you want in plain English — PromptAce's intelligence engine detects your intent across **16 AI categories**, applies deep specialist principles, and outputs a professionally engineered prompt ready to drop into any AI tool.

No prompt engineering knowledge required.

---

## Screenshot

> UI in active development — screenshot coming soon.

---

## Features

### Core Engine
- **16 intent categories** — Automatically detects whether you're doing image generation, video creation, music production, code generation, business writing, and more
- **Specialist prompt formulas** — Each category has its own deeply trained prompting principles applied to your input
- **4 output variants** — Primary prompt, negative prompt, bold variation, and experimental variation
- **Quality scoring** — Animated score showing the jump from your raw input to the forged result
- **Tool recommendation** — Tells you which AI tool to use and why

### UI & UX
- **Dark premium design** — Built for focus. Custom design tokens, DM Sans + JetBrains Mono
- **Preset category selector** — Jump straight to Photo Gen, Video Gen, Music, Code, and more
- **Brand DNA accordion** — Inject your brand voice, colors, and style into every forge
- **Copy everything** — Per-section copy buttons + one-click "Copy Everything"
- **Mobile responsive** — Input panel stacks above output on small screens

### Security
- **API key never client-side** — Anthropic key lives server-side only in the forge route
- **System prompt locked** — Loaded with `server-only` guard, never exposed to the client
- **Input capped** — 2,000 character hard limit enforced server-side

---

## 16 Intent Categories

| Category | Examples |
|----------|---------|
| `IMAGE_GENERATION` | Text-to-image prompts for Midjourney, DALL·E, Flux |
| `PHOTO_TRANSFORMATION` | Edit, enhance, or relight existing photos |
| `FACE_SWAP_SCENE` | Place a face into a new scene or context |
| `ART_STYLE_TRANSFER` | Apply an artistic style to an image |
| `THREE_D_LOGO_RENDER` | 3D logo and brand mark rendering |
| `VIDEO_GENERATION` | Text-to-video prompts for Sora, Kling, Runway |
| `VIDEO_SERIES` | Multi-clip, episodic video content |
| `IMAGE_TO_VIDEO` | Animate a still image |
| `INTERACTIVE_SESSION` | Roleplay, simulation, and interactive AI sessions |
| `MUSIC_GENERATION` | Prompts for Suno, Udio, and other music AI |
| `VOICE_DESIGN` | Voice character and narration design |
| `CONTENT_STRATEGY` | Social media, marketing, and content plans |
| `BUSINESS_WRITING` | Emails, proposals, reports, documentation |
| `EDUCATION_LEARNING` | Tutoring, lesson plans, study guides |
| `CREATIVE_WRITING` | Stories, scripts, poetry, worldbuilding |
| `CODE_GENERATION` | Code, architecture, debugging, and technical prompts |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI | Anthropic API — `claude-sonnet-4-6` |
| Deployment | Vercel |

---

## Getting Started

> **Note:** The app code ships with Phase 1. Instructions below will work once Phase 1 is complete.

```bash
# Clone the repo
git clone https://github.com/kdheerajsai401-prog/PromptAce.git
cd promptace

# Install dependencies
npm install

# Set up your environment variables
cp .env.local.example .env.local
# Open .env.local and add your ANTHROPIC_API_KEY
# Get yours free at console.anthropic.com

# Run locally
npm run dev
# → Open http://localhost:3000
```

The only key needed to run the core forge engine is `ANTHROPIC_API_KEY`. Auth and payment keys are only needed for Phases 2 and 3 — see [`.env.local.example`](.env.local.example) for the full list.

---

## Project Status

| Phase | Description | Status |
|-------|-------------|--------|
| **Phase 1** | Foundation + Core Forge Engine | 🔨 In Progress |

**Goal:** Any visitor can paste plain English, hit Forge, and receive a fully rendered result with intent badge, score animation, 4 output tabs, and copy UX. No login, no limits, completely free.

---

## Output Structure

Every forge returns a structured JSON result:

```typescript
interface ForgeResult {
  intent_category: string;      // Detected category
  intent_label: string;         // Human-readable label with emoji
  score_original: number;       // Quality score of raw input (0-100)
  score_forged: number;         // Quality score of forged output (0-100)
  prompt: string;               // The primary optimized prompt
  negative_prompt?: string;     // Things to exclude (for image/video)
  variation_bold: string;       // Bolder interpretation
  variation_experimental: string; // Experimental take
  tool: string;                 // Recommended AI tool
  tool_reason: string;          // Why this tool
  tips: string[];               // Usage tips
}
```

---

## License

MIT
