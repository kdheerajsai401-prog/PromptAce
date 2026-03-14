# Stack Research

**Domain:** AI SaaS — Freemium Prompt Engineering Tool (Next.js 14 App Router)
**Researched:** 2026-03-14
**Confidence:** MEDIUM-HIGH (training data through Aug 2025; external tool access blocked during research session)

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | 14.x (App Router) | Full-stack framework | Already decided. App Router enables server components for secure API key handling, server actions for mutations, and streaming RSC. The only framework that collocates route handlers, middleware, and UI at this quality. |
| TypeScript | 5.x | Type safety | Non-negotiable for SaaS. Catches auth/payment state bugs at compile time. |
| Tailwind CSS | 3.4.x | Styling | See Tailwind section below — v3 over v4 for Next.js 14 stability. |
| Clerk | 5.x | Authentication | Best App Router DX of the three options. See Auth section. |
| Neon | latest (serverless driver) | PostgreSQL database | Serverless Postgres with connection pooling built for Vercel. See DB section. |
| Drizzle ORM | 0.30.x | Database ORM | Lightweight, type-safe, works perfectly with Neon's serverless driver. Avoids Prisma's cold-start penalty on Vercel. |
| Stripe | latest | Payments + subscriptions | Industry standard. Best webhook tooling. See Payments section. |
| Anthropic SDK | latest (`@anthropic-ai/sdk`) | AI API client | Official SDK. Supports streaming via `stream()` method. Must stay server-side only. |
| Zustand | 4.x | Client state | See State section. Minimal footprint, no boilerplate, works with RSC architecture. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@clerk/nextjs` | 5.x | Clerk Next.js adapter | Always — provides middleware, `auth()`, `currentUser()`, `<UserButton>` |
| `@neondatabase/serverless` | latest | Neon serverless WebSocket driver | Always — standard Neon driver for Vercel/edge environments |
| `drizzle-orm` | 0.30.x | ORM query builder | Always — type-safe SQL without Prisma's startup cost |
| `drizzle-kit` | 0.20.x | Schema migrations CLI | Dev only — `drizzle-kit push` for dev, `drizzle-kit generate` for prod migrations |
| `stripe` | 14.x | Stripe Node.js SDK | Always — server-side only for payment intents + webhook handling |
| `@stripe/stripe-js` | 4.x | Stripe browser SDK | Only needed if using Stripe Elements for card UI; not needed for Checkout redirect flow |
| `svix` | latest | Webhook signature verification | Use for Clerk webhooks if syncing Clerk user events to DB; alternatively use Clerk's built-in |
| `zod` | 3.x | Schema validation | Always — validate API route inputs, Stripe webhook payloads, AI response parsing |
| `lucide-react` | latest | Icon library | Always — pairs with Tailwind, tree-shakeable, consistent icon set |
| `clsx` + `tailwind-merge` | latest | Conditional classnames | Always — standard pattern for conditional Tailwind classes without conflicts |
| `sonner` | latest | Toast notifications | Preferred over react-hot-toast — better RSC/Next.js 14 compatibility, smaller bundle |
| `framer-motion` | 11.x | Animations | For score counter animation from v10 reference. Only if needed — adds ~30KB. |
| `ai` (Vercel AI SDK) | 3.x | Streaming utilities | OPTIONAL — provides `useChat`, `streamText` helpers. Useful but not required if implementing streaming manually. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| `eslint` + `eslint-config-next` | Linting | Ships with Next.js. Add `@typescript-eslint` rules. |
| `prettier` | Formatting | Add `prettier-plugin-tailwindcss` for automatic class sorting. |
| `drizzle-kit` | DB migrations | `npx drizzle-kit push` for local dev against Neon branch. |
| Stripe CLI | Local webhook testing | `stripe listen --forward-to localhost:3000/api/webhooks/stripe` — essential for webhook dev. |
| Clerk Dashboard | Auth management | Web UI for user management, JWT templates, webhook config. |
| Vercel CLI | Local dev + deployment | `vercel dev` mirrors production environment variables. |

---

## Technology Decisions (Detailed Rationale)

### Auth: Clerk (not NextAuth, not Supabase Auth)

**Recommendation: Clerk 5.x** — MEDIUM-HIGH confidence

**Why Clerk wins for this project:**

1. **App Router integration is first-class.** Clerk's `auth()` helper works directly in Server Components and Route Handlers. NextAuth v4 has App Router support but it's retrofitted and requires workarounds. NextAuth v5 (Auth.js) was in beta as of mid-2025 with breaking changes still landing.

2. **Middleware-based route protection is trivial.** One `clerkMiddleware()` call in `middleware.ts` protects routes. With NextAuth you write custom middleware logic. With Supabase Auth you manage session cookies manually in middleware.

3. **Freemium-specific DX.** Clerk's `auth()` returns `userId` in any server context. You can check `if (!userId) redirect('/sign-in')` after 3 free uses with two lines of code. No session fetch, no cookie parsing.

4. **Free tier is generous for MVP.** 10,000 MAU free. PromptForge won't hit this limit early.

5. **`<UserButton>` and `<SignInButton>` are drop-in.** Zero auth UI to build for MVP.

**Why not NextAuth:**
- v4 has awkward App Router adapter (still callback-based, session object not type-safe)
- v5 (Auth.js) was still destabilizing as of Aug 2025
- You own the session logic — more control, but more surface area for bugs in a solo/small-team build

**Why not Supabase Auth:**
- Supabase Auth is excellent if you're already using Supabase DB (avoids split infrastructure)
- For this project: Neon is the database recommendation (see below), so Supabase Auth adds a second third-party with no co-location benefit
- Supabase Auth middleware requires manual cookie handling in Next.js 14 (`@supabase/ssr` package) — more brittle than Clerk's middleware

**Clerk-specific patterns for PromptForge:**
```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)', '/api/forge'])

export default clerkMiddleware((auth, req) => {
  // /api/forge is public — usage gating happens inside the route handler
  if (!isPublicRoute(req)) auth().protect()
})
```

The usage gate lives in `/api/forge/route.ts`: check usage count from DB, increment on success, return 402 if over limit without auth, redirect to sign-in/payment if authenticated but not paid.

---

### Database: Neon (not Supabase, not PlanetScale)

**Recommendation: Neon with Drizzle ORM** — MEDIUM-HIGH confidence

**Why Neon wins for this project:**

1. **Built for serverless/Vercel.** Neon uses WebSocket connections via `@neondatabase/serverless` which bypasses the TCP connection limit that kills traditional Postgres on Vercel serverless functions. Supabase requires connection pooling via PgBouncer (extra config). Neon's pooling is built-in.

2. **Branch-based development.** Neon database branching means each dev/PR gets its own database branch — zero cost for this, huge DX win. Supabase doesn't have true DB branching (as of mid-2025).

3. **Free tier covers MVP.** 0.5 GB storage, unlimited projects on free tier. PromptForge DB needs are minimal: `users` table (synced from Clerk webhooks) + `usage_events` table.

4. **Drizzle ORM is the right pairing.** Drizzle's cold-start is ~5ms vs Prisma's ~200-300ms. On Vercel serverless, every cold start matters for latency. Drizzle is also fully type-safe and SQL-first — no magic abstractions.

**Why not Supabase:**
- Supabase is an excellent all-in-one (DB + Auth + Storage + Realtime) but that breadth adds complexity
- If using Clerk for auth, Supabase's value proposition is halved
- Supabase's free tier pauses DB after 1 week of inactivity — bad for a SaaS with any gap in traffic
- PgBouncer setup for Next.js is required but not trivial

**Why not PlanetScale:**
- PlanetScale removed its free tier in 2024 — non-starter for MVP
- MySQL dialect means no `json` columns, no array types, missing Postgres features useful for storing prompt metadata
- Branching is excellent but Neon now matches it for Postgres

**Schema for PromptForge (minimal):**
```typescript
// db/schema.ts
import { pgTable, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  email: text('email').notNull(),
  stripeCustomerId: text('stripe_customer_id'),
  stripePriceId: text('stripe_price_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  stripeSubscriptionStatus: text('stripe_subscription_status'), // 'active' | 'canceled' | etc
  usageCount: integer('usage_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const anonymousUsage = pgTable('anonymous_usage', {
  sessionId: text('session_id').primaryKey(), // browser fingerprint or cookie
  usageCount: integer('usage_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastUsedAt: timestamp('last_used_at').defaultNow().notNull(),
})
```

---

### Payments: Stripe with Checkout + Webhooks

**Recommendation: Stripe Checkout (redirect) + webhook sync to DB** — HIGH confidence

**Pattern for PromptForge freemium:**

**Do NOT use Stripe Elements (custom card form).** Use Stripe Checkout (hosted page). Reasons:
- PCI compliance is handled by Stripe
- No card form UI to build
- Works identically for one-time payments and subscriptions
- Stripe handles 3D Secure, regional payment methods, retries

**The freemium flow:**
```
[3 free uses] → [usage_count >= 3 AND !authenticated] → redirect /sign-in
[authenticated, not paid] → redirect /upgrade → Stripe Checkout
[Stripe webhook: checkout.session.completed] → update users table (stripeSubscriptionStatus = 'active')
[Each forge API call] → check users.stripeSubscriptionStatus === 'active' OR usage_count < 3
```

**Key webhook events to handle in `/api/webhooks/stripe/route.ts`:**

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Set `stripe_subscription_id`, `stripe_price_id`, `stripe_subscription_status = 'active'` |
| `customer.subscription.updated` | Update `stripe_subscription_status` |
| `customer.subscription.deleted` | Set `stripe_subscription_status = 'canceled'` |
| `invoice.payment_failed` | Set `stripe_subscription_status = 'past_due'`, email user |

**Critical webhook pattern — always verify signature:**
```typescript
// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text() // Must be raw text, not parsed JSON
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }
  // handle event.type ...
}
```

**Idempotency:** Use Stripe's event ID as idempotency key. Check if already processed before updating DB.

**For PromptForge specifically:** A one-time payment (not subscription) may be simpler for v1. "Pay once, unlimited use" removes subscription management complexity. This is a product decision but the Stripe implementation (`payment_intent` vs `subscription`) determines webhook event set.

---

### Tailwind: v3.4.x (not v4)

**Recommendation: Tailwind CSS 3.4.x** — HIGH confidence

**Why v3, not v4:**

Tailwind CSS v4 was released in early 2025. As of mid-2025:
- v4 changed the configuration paradigm (CSS-first config, no `tailwind.config.js`)
- v4's `@tailwindcss/vite` plugin is the primary integration — Next.js uses webpack/turbopack, not Vite
- The `@tailwindcss/postcss` package for Next.js compatibility existed but had documented rough edges
- v4 dropped JIT mode distinction (now always JIT) — this is fine, but config migration is required
- The `tailwindcss-animate` and other ecosystem plugins had incomplete v4 compatibility as of mid-2025

**Use v3.4.x because:**
- Ships with Next.js 14's `create-next-app` template
- Full ecosystem compatibility (shadcn/ui, headlessui, tailwindcss-animate, all work)
- `tailwind.config.ts` with the custom color tokens from v10 reference maps directly
- Zero migration risk

**v4 consideration:** Reconsider for v2/v3 of PromptForge after v4 ecosystem stabilizes.

**Custom color config for PromptForge dark theme:**
```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      bg: '#030407',
      surface: '#070910',
      card: '#0B0D16',
    },
    fontFamily: {
      sans: ['DM Sans', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
  },
}
```

**Component library: No external component library recommended.** The v10 reference has a complete, specific dark-theme design. Installing shadcn/ui or Radix UI primitives and fighting their theming to match `#030407` bg is more work than building components from Tailwind utilities directly. Use Radix UI headless primitives (tabs, dialog, dropdown) only for accessibility-critical interactive components.

---

### State Management: Zustand (not Jotai, not Context)

**Recommendation: Zustand 4.x** — HIGH confidence

**Why Zustand for PromptForge:**

The client state needed is:
- Current forge input text
- Current forge result (JSON object)
- Active output tab (main/parameters/workflow/negative)
- Usage count for anonymous users
- Loading/streaming state
- Brand DNA form values

This is exactly Zustand's sweet spot: a small, bounded set of client state with no server interaction needed for the state itself.

**Why not Context API:**
- Context causes full subtree re-renders on every state change
- The forge result JSON can be large (1000+ char) — re-rendering the entire page on each streaming chunk is expensive
- Multiple pieces of state would require multiple contexts or a combined mega-context

**Why not Jotai:**
- Jotai is atom-based — excellent for highly granular, independent state slices
- For PromptForge, the state is mostly interconnected (forge input → result → tab display) — Zustand's store model fits better
- Jotai has slightly steeper mental model for developers less familiar with it

**Why not Redux/RTK:**
- Massive overkill. RTK adds 40KB+ to bundle for state this simple.

**Zustand store pattern:**
```typescript
// store/forge-store.ts
import { create } from 'zustand'

interface ForgeStore {
  input: string
  result: ForgeResult | null
  isStreaming: boolean
  activeTab: 'main' | 'parameters' | 'workflow' | 'negative'
  usageCount: number
  setInput: (input: string) => void
  setResult: (result: ForgeResult) => void
  setStreaming: (streaming: boolean) => void
  setActiveTab: (tab: ForgeStore['activeTab']) => void
  incrementUsage: () => void
}

export const useForgeStore = create<ForgeStore>((set) => ({
  // initial state + setters
}))
```

Note: `usageCount` in Zustand is for the anonymous guest display only. Source of truth is the DB (for authenticated users) or a cookie/localStorage (for anonymous guests).

---

### Streaming: Anthropic API with Next.js Route Handlers

**Recommendation: Native Anthropic streaming via Route Handler + ReadableStream** — MEDIUM-HIGH confidence

**The architecture (server-side only, mandatory):**

```typescript
// app/api/forge/route.ts
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: Request) {
  // 1. Verify auth + usage gate
  // 2. Call Anthropic with streaming
  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: input }],
  })

  // 3. Return as ReadableStream to client
  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text))
        }
      }
      controller.close()
    },
  })

  return new Response(readableStream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
```

**Critical Vercel consideration: Function timeout.**

Default Vercel serverless function timeout is **10 seconds**. Claude API calls for a full PromptForge output (detailed JSON with 500-1500 tokens) can take 15-30 seconds.

**Solution: Vercel's `maxDuration` export:**
```typescript
// app/api/forge/route.ts
export const maxDuration = 60 // seconds — requires Pro plan for >10s
```

**Alternative — Vercel AI SDK (`ai` package):**
The Vercel AI SDK v3 provides `streamText` which handles the `ReadableStream` setup and includes built-in timeout handling. It also provides `useCompletion` hook for the client. This is OPTIONAL but reduces boilerplate. The tradeoff: it adds a dependency and abstracts the Anthropic SDK response format.

**Recommendation for PromptForge:** Use the native approach (shown above) because:
1. PromptForge expects structured JSON, not a chat stream — the Vercel AI SDK's chat abstractions don't add value
2. You need to parse the complete JSON after streaming completes to display the 4-tab result — accumulating the full response then parsing is cleaner than streaming chat

**Client-side streaming consumption:**
```typescript
// Accumulate stream, then parse JSON on completion
const response = await fetch('/api/forge', { method: 'POST', body: JSON.stringify({ input }) })
const reader = response.body!.getReader()
const decoder = new TextDecoder()
let accumulated = ''

while (true) {
  const { done, value } = await reader.read()
  if (done) break
  accumulated += decoder.decode(value, { stream: true })
  // Optionally: update UI with typing indicator or partial text
}

const result = JSON.parse(accumulated) // ForgeResult type
```

---

### Deployment: Vercel — Configuration for AI Routes

**Recommendation: Vercel Pro (or Hobby with workarounds)** — HIGH confidence

**Key Vercel configurations for PromptForge:**

**1. Function timeout** — Most important issue.
- Hobby plan: 10 seconds max. Anthropic calls often exceed this.
- Pro plan: Up to 300 seconds with `export const maxDuration = 300`
- Workaround for Hobby: Stream immediately to client, Vercel streaming responses don't have the same timeout as blocking responses in some configurations — but this is not guaranteed behavior.
- **Recommendation: Use Pro plan from launch** (~$20/month). The AI route will timeout on Hobby.

**2. Edge Runtime vs Node.js Runtime for `/api/forge`:**
- Do NOT use Edge Runtime for the forge route
- Edge Runtime has a 4MB memory limit and restricted Node.js APIs
- Anthropic SDK requires Node.js runtime (uses `https` module patterns)
- Keep default Node.js runtime:
  ```typescript
  export const runtime = 'nodejs' // explicit (also the default)
  ```

**3. Environment variables:**
```
ANTHROPIC_API_KEY=sk-ant-...        # Server-side only — never prefix with NEXT_PUBLIC_
CLERK_SECRET_KEY=sk_live_...        # Server-side only
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...  # Public, used by Clerk JS
DATABASE_URL=postgresql://...       # Neon connection string (pooled)
STRIPE_SECRET_KEY=sk_live_...       # Server-side only
STRIPE_WEBHOOK_SECRET=whsec_...     # Server-side only
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...  # Public, for Stripe.js
NEXT_PUBLIC_APP_URL=https://...     # For Stripe success/cancel URLs
```

**4. Incremental Static Regeneration:** Not applicable to this app — all routes are dynamic (auth state varies per request).

**5. Vercel Analytics:** Add `@vercel/analytics` package — it's free and provides usage pattern data valuable for a SaaS.

---

## Installation

```bash
# Core framework (already initialized)
npx create-next-app@14 promptforge --typescript --tailwind --app --src-dir=false

# Auth
npm install @clerk/nextjs

# Database
npm install @neondatabase/serverless drizzle-orm
npm install -D drizzle-kit

# Payments
npm install stripe
npm install @stripe/stripe-js  # only if using Stripe Elements

# AI
npm install @anthropic-ai/sdk

# State
npm install zustand

# UI utilities
npm install lucide-react clsx tailwind-merge sonner

# Validation
npm install zod

# Optional: Vercel AI SDK (only if using its streaming utilities)
npm install ai

# Optional: Animations for score counter
npm install framer-motion

# Dev tools
npm install -D prettier prettier-plugin-tailwindcss
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Clerk | NextAuth v5 (Auth.js) | If you need complete auth ownership, custom providers, or self-hosting. Not for MVP. |
| Clerk | Supabase Auth | If you're using Supabase DB (co-location benefit). Switch if Neon is dropped. |
| Neon + Drizzle | Supabase | If you want built-in auth + DB + realtime in one platform. Excellent choice if Clerk is removed. |
| Neon + Drizzle | Prisma + Postgres | If team knows Prisma well and cold starts are acceptable (or using Prisma Accelerate). |
| Stripe Checkout | Stripe Elements | If custom card UI is required by design. Adds PCI scope, more UI work. |
| Zustand | Jotai | If state becomes very granular with many independent atoms. Equivalent quality for different mental models. |
| Native Anthropic streaming | Vercel AI SDK | If building a chat interface or needing multi-provider AI support in future. |
| Tailwind v3 | Tailwind v4 | After v4 ecosystem stabilizes and shadcn/ui fully supports it (expected late 2025 / 2026). |
| Sonner | react-hot-toast | Both fine; react-hot-toast is heavier and has fewer styling options for dark themes. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `NEXT_PUBLIC_ANTHROPIC_API_KEY` | Exposes API key in client bundle — hard requirement violation | `ANTHROPIC_API_KEY` in server-only Route Handler |
| Prisma (without Accelerate) | 200-300ms cold start on Vercel serverless = terrible P99 latency | Drizzle ORM (5ms cold start) |
| PlanetScale | Removed free tier in 2024; MySQL dialect lacks Postgres features | Neon (Postgres, free tier, serverless-native) |
| NextAuth v4 | Retrofitted App Router support, type-unsafe session object | Clerk or NextAuth v5 |
| Tailwind v4 | Breaking config changes, incomplete Next.js 14 integration as of mid-2025 | Tailwind v3.4.x |
| Edge Runtime for AI routes | 4MB memory limit, restricted APIs, incompatible with Anthropic SDK | Node.js runtime (`export const runtime = 'nodejs'`) |
| Redux / RTK | 40KB+ bundle for simple client state | Zustand (2KB) |
| `react-query` / TanStack Query | Unnecessary for this app — no complex server state caching needed | Direct `fetch` in Server Components + Route Handlers |
| Supabase realtime / websockets | Not needed for this use case; adds complexity | Simple HTTP request/response with streaming |
| shadcn/ui (full adoption) | Fighting dark theme overrides adds more work than it saves for this specific design | Radix UI headless primitives for a11y + Tailwind utilities for styling |

---

## Stack Patterns by Variant

**If choosing one-time payment over subscription:**
- Remove `customer.subscription.*` webhook handlers
- Use `payment_intent.succeeded` or `checkout.session.completed` (one-time mode)
- Set `users.isPaid = true` instead of managing subscription status
- Simpler DB schema, simpler webhook logic — recommended for v1 if recurring revenue isn't the immediate priority

**If Vercel Hobby plan (no Pro upgrade):**
- Implement non-streaming fallback (fire request, poll for result via separate status endpoint)
- Or: Move AI route to a separate service (e.g., Vercel Functions on a different project with different limits, or a small Railway/Render Node service)
- Streaming responses MAY avoid timeout on Hobby but this is not Vercel-documented behavior — treat as workaround, not solution

**If usage grows and Neon free tier hits limits:**
- Upgrade to Neon's Launch plan ($19/month) — 10 GB storage, autoscaling
- No code changes required — same connection string, same driver

**If Clerk free tier hits 10K MAU:**
- Migrate to Clerk Pro ($25/month for 10K MAU included, $0.02 per additional)
- No code changes required

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| `@clerk/nextjs@5.x` | `next@14.x` | Clerk 5 requires Next.js 13.5+. Works with App Router and Pages Router. |
| `drizzle-orm@0.30.x` | `@neondatabase/serverless@latest` | Use `drizzle-orm/neon-serverless` adapter. Do NOT use `drizzle-orm/node-postgres` on Vercel. |
| `tailwindcss@3.4.x` | `next@14.x` | Ships in `create-next-app@14` template. No compatibility issues. |
| `stripe@14.x` | `next@14.x` | Webhook handler requires raw request body — use `req.text()` not `req.json()` in Route Handlers. |
| `framer-motion@11.x` | `next@14.x` | Requires `'use client'` directive. Do not import in Server Components. |
| `zustand@4.x` | React 18+ | Use `create` from `zustand` directly. Avoid deprecated `createWithEqualityFn` pattern. |

---

## Confidence Assessment by Dimension

| Dimension | Confidence | Basis |
|-----------|------------|-------|
| Auth (Clerk recommendation) | MEDIUM-HIGH | Clerk 5 + Next.js 14 App Router was well-documented by Aug 2025. Auth.js v5 instability was confirmed by community. |
| Database (Neon + Drizzle) | MEDIUM-HIGH | Neon's serverless driver + Drizzle for Vercel was established best practice by mid-2025. PlanetScale free tier removal is confirmed. |
| Payments (Stripe Checkout) | HIGH | Stripe patterns are stable and well-documented. Webhook pattern unchanged for years. |
| Tailwind v3 over v4 | MEDIUM | v4 released early 2025; ecosystem compatibility state as of Mar 2026 may have improved. Verify current shadcn/ui and ecosystem v4 support before assuming v3 is still safer. |
| Streaming (native Anthropic) | MEDIUM-HIGH | ReadableStream pattern in Next.js 14 Route Handlers is well-established. Vercel timeout issue is documented. |
| State (Zustand) | HIGH | Zustand 4.x is stable, mature, and the standard for this use case. No uncertainty. |
| Vercel deployment patterns | MEDIUM-HIGH | `maxDuration` export and Node.js runtime requirement are documented Vercel behavior. Pro plan requirement for >10s is confirmed pricing policy. |

---

## Sources

- Training data through August 2025 — covers all packages in this stack (HIGH confidence for stable packages)
- Clerk documentation (https://clerk.com/docs/quickstarts/nextjs) — App Router integration patterns
- Neon documentation (https://neon.tech/docs/serverless/serverless-driver) — serverless driver usage
- Drizzle ORM documentation (https://orm.drizzle.team/docs/get-started-postgresql) — Neon adapter
- Stripe documentation (https://stripe.com/docs/webhooks) — webhook handling patterns
- Vercel documentation (https://vercel.com/docs/functions/runtimes) — runtime configuration
- NOTE: External tool access (WebSearch, WebFetch) was blocked during this research session. Tailwind v4 ecosystem state as of March 2026 should be independently verified before committing to v3.

---

*Stack research for: PromptForge — AI SaaS Freemium Prompt Engineering Tool*
*Researched: 2026-03-14*
