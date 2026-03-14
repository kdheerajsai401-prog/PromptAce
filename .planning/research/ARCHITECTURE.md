# Architecture Research

**Domain:** AI SaaS — two-panel prompt generation tool with freemium gating
**Researched:** 2026-03-14
**Confidence:** HIGH (sourced from official Next.js docs v16.1.6, dated 2026-02-27)

---

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (Client)                         │
├──────────────────────────┬──────────────────────────────────────┤
│   Left Panel             │   Right Panel                        │
│  ┌────────────────────┐  │  ┌─────────────────────────────────┐ │
│  │  PromptInput       │  │  │  ForgeOutput                    │ │
│  │  (textarea)        │  │  │  (intent badge, score, tabs)    │ │
│  │  BrandDNA          │  │  │  OutputTabs                     │ │
│  │  (accordion)       │  │  │  (PROMPT/NEG/BOLD/EXPERIMENTAL) │ │
│  │  ForgeButton       │  │  │  AlertBanner (risk/technique)   │ │
│  │  ExampleChips      │  │  │  CopyButtons                    │ │
│  └────────────────────┘  │  └─────────────────────────────────┘ │
│                           │                                      │
│  PromptForge.tsx — "use client" — owns all interactive state    │
└──────────────────────────┴──────────────────────────────────────┘
         │ fetch POST /api/forge
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Next.js Server                           │
├─────────────────────────────────────────────────────────────────┤
│  app/api/forge/route.ts   (POST handler)                        │
│    1. Read session cookie → verify usage count or auth          │
│    2. Check gating: free uses remaining? or paid user?          │
│    3. Call Anthropic API with full system prompt + user input   │
│    4. Decrement usage counter in DB (unauthenticated users)     │
│    5. Return ForgeResult JSON                                   │
├─────────────────────────────────────────────────────────────────┤
│  app/api/stripe/webhook/route.ts  (POST handler)                │
│    1. Verify Stripe signature                                   │
│    2. On checkout.session.completed → set user.paid = true      │
├─────────────────────────────────────────────────────────────────┤
│  lib/system-prompt.ts     (sacred — never modified)             │
│  lib/session.ts           (encrypt/decrypt JWT via jose)        │
│  lib/dal.ts               (data access layer — verifySession)   │
│  lib/usage.ts             (read/write usage count in DB)        │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                         External Services                        │
├──────────────────────────┬──────────────────────────────────────┤
│  Anthropic API           │  Stripe API + Webhooks               │
│  (claude-sonnet-4-6)     │  (checkout + webhook verification)   │
├──────────────────────────┴──────────────────────────────────────┤
│  Database (Postgres/Neon or Supabase)                           │
│  Tables: users(id, email, paid, stripe_customer_id)            │
│          free_uses(visitor_id, count, created_at)              │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Type |
|-----------|---------------|------|
| `app/page.tsx` | Shell layout, renders PromptForge client component | Server Component |
| `app/layout.tsx` | Font loading (DM Sans, JetBrains Mono), metadata, theme | Server Component |
| `components/PromptForge.tsx` | All UI state — input, output, loading, tabs, copy | Client Component |
| `components/InputPanel.tsx` | Textarea, BrandDNA accordion, ExampleChips, ForgeButton | Client Component |
| `components/OutputPanel.tsx` | Intent badge, score animation, tab switcher, alerts, copy | Client Component |
| `components/UsageGate.tsx` | Modal/wall shown when free uses exhausted | Client Component |
| `app/api/forge/route.ts` | POST handler: gating check + Anthropic call + usage decrement | Route Handler |
| `app/api/stripe/webhook/route.ts` | POST handler: webhook signature verify + DB update | Route Handler |
| `app/api/auth/route.ts` | Login/signup/logout endpoints | Route Handler |
| `lib/system-prompt.ts` | Full AI system prompt — sacred, never trimmed | Server-only module |
| `lib/session.ts` | JWT encrypt/decrypt via `jose` | Server-only module |
| `lib/dal.ts` | `verifySession()` with `React.cache` memoization | Server-only module |
| `lib/usage.ts` | `getUsageCount()`, `decrementUsage()`, `setUserPaid()` | Server-only module |
| `types/index.ts` | `ForgeResult`, `Session`, `UsageState` TypeScript types | Shared types |

---

## Recommended Project Structure

```
promptforge/
├── app/
│   ├── page.tsx                    # Server component shell
│   ├── layout.tsx                  # Font, metadata, global styles
│   ├── login/
│   │   └── page.tsx                # Login/signup form (Server Component with Client form)
│   └── api/
│       ├── forge/
│       │   └── route.ts            # POST — LLM call with gating
│       ├── auth/
│       │   └── route.ts            # Login/signup/logout
│       └── stripe/
│           └── webhook/
│               └── route.ts        # Stripe webhook handler
├── components/
│   ├── PromptForge.tsx             # Root client component ("use client")
│   ├── InputPanel.tsx              # Left panel
│   ├── OutputPanel.tsx             # Right panel
│   ├── BrandDNAAccordion.tsx       # Brand context inputs
│   ├── ExampleChips.tsx            # 12 example prompts
│   ├── IntentBadge.tsx             # Intent category display
│   ├── ScoreDisplay.tsx            # Animated score counter
│   ├── OutputTabs.tsx              # PROMPT/NEG/BOLD/EXPERIMENTAL tabs
│   ├── AlertBanner.tsx             # text_risk + unknown_technique alerts
│   ├── CopyButton.tsx              # Reusable copy button with state
│   └── UsageGate.tsx               # Free use wall modal
├── lib/
│   ├── system-prompt.ts            # Sacred — full AI instructions
│   ├── session.ts                  # JWT session management (jose)
│   ├── dal.ts                      # Data access layer (verifySession)
│   ├── usage.ts                    # Usage count read/write
│   └── db.ts                       # Database client (Drizzle/Prisma)
├── types/
│   └── index.ts                    # ForgeResult + app types
├── proxy.ts                        # Next.js proxy (replaces middleware.ts in v16)
└── .env.local                      # ANTHROPIC_API_KEY, SESSION_SECRET, DATABASE_URL, STRIPE_*
```

### Structure Rationale

- **`components/` split by concern:** PromptForge.tsx is the top-level `"use client"` boundary. Sub-components (InputPanel, OutputPanel) inherit client context without needing their own directive.
- **`lib/` as server-only modules:** Add `import 'server-only'` to session.ts, dal.ts, usage.ts, and system-prompt.ts — Next.js will throw a build-time error if these are imported by client code.
- **`app/api/` separated by domain:** forge, auth, and stripe/webhook are distinct concerns with different security profiles. Keep them separate.
- **`proxy.ts` not `middleware.ts`:** Next.js v16 (released ~Feb 2026) renamed `middleware.ts` to `proxy.ts`. Use proxy.ts for all new projects. The underlying API is identical — just the filename and export name changed.

---

## Architectural Patterns

### Pattern 1: Non-Streaming JSON Response for Forge

**What:** The Anthropic call returns a complete JSON object (ForgeResult). Use a standard `await`-to-completion response, not streaming.
**When to use:** When the output is structured JSON (not prose). Streaming partial JSON is unparseable — the client can't display tabs until the full object arrives anyway.
**Trade-offs:** User waits for the full response before anything renders, but the loading state (rotating messages) covers this UX gap. Simpler implementation — no SSE/ReadableStream complexity.

```typescript
// app/api/forge/route.ts
export async function POST(request: Request) {
  const { prompt, brandContext } = await request.json()

  // 1. Gating check (see Pattern 2)
  const gateResult = await checkUsageGate(request)
  if (gateResult.blocked) {
    return Response.json({ error: 'usage_limit' }, { status: 402 })
  }

  // 2. Call Anthropic — await full response
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildUserMessage(prompt, brandContext) }],
  })

  // 3. Parse JSON from text block
  const result: ForgeResult = JSON.parse(message.content[0].text)

  // 4. Decrement usage for unauthenticated users
  await gateResult.postForgeAction?.()

  return Response.json(result)
}
```

**Vercel timeout note:** Vercel Hobby has 10s function timeout; Pro has 60s. LLM calls for this use case typically complete in 5-15s. Add `export const maxDuration = 30` to the route file for Vercel Pro, or use `export const runtime = 'nodejs'` to opt into Node.js runtime (not Edge).

### Pattern 2: Usage Gating in the API Route (not middleware/proxy)

**What:** Check and decrement usage count inside `app/api/forge/route.ts`, not in proxy.ts.
**When to use:** For usage gating that requires DB access. Proxy runs at the Edge and cannot make direct database queries. The API route runs in the Node.js runtime and can query the DB.
**Trade-offs:** Proxy can only read cookies for optimistic redirects (login wall). The actual enforcement must happen in the route handler.

```typescript
// lib/usage.ts (server-only)
import 'server-only'

export async function checkAndGate(request: Request): Promise<GateResult> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')

  if (sessionCookie) {
    // Authenticated user — check paid status from DB
    const session = await decrypt(sessionCookie.value)
    const user = await db.query.users.findFirst({ where: eq(users.id, session.userId) })
    if (user?.paid) return { blocked: false, postForgeAction: null }
    // Authenticated free users also get 3 uses stored in DB against their user ID
    return checkFreeUses(user.id, 'user')
  } else {
    // Anonymous visitor — use a persistent visitor cookie (UUID)
    let visitorId = cookieStore.get('visitor_id')?.value
    if (!visitorId) {
      visitorId = crypto.randomUUID()
      // Set visitor_id on response via headers (handled after gate check)
    }
    return checkFreeUses(visitorId, 'visitor')
  }
}
```

**Why not middleware/proxy:** Next.js docs explicitly state proxy should only do optimistic checks from cookies — no DB calls. "Avoid database checks to prevent performance issues" (official Next.js auth docs).

### Pattern 3: Free Use Persistence — DB Row, not Cookie Value

**What:** Store the usage count as a DB row keyed on visitor UUID (cookie), not as a number inside the cookie itself.
**When to use:** Always, for freemium gating that needs to be tamper-proof.
**Trade-offs:** Requires a DB read on every forge call. Worth it because cookie-stored counts are trivially bypassed (user deletes cookie or edits value).

```
free_uses table:
  visitor_id  TEXT PRIMARY KEY   -- UUID stored in cookie
  count       INTEGER DEFAULT 0  -- forge calls made
  created_at  TIMESTAMP          -- for cleanup
```

The visitor UUID cookie is `httpOnly: true, sameSite: 'lax', maxAge: 365 days`. The count lives in the DB. The cookie is just a lookup key.

**Auth users:** Authenticated free users have their usage count on the `users` table (`forge_uses_count INT DEFAULT 0`). When they upgrade via Stripe, set `paid = true` — the count no longer matters.

### Pattern 4: Stripe Webhook Architecture

**What:** Stripe sends a POST to `/api/stripe/webhook` when payment completes. Verify signature with raw body, then update user's `paid` status in DB.
**When to use:** All Stripe integrations. Never trust query parameters or client-side redirects for payment confirmation.
**Trade-offs:** Requires storing the raw request body (not parsed JSON) for signature verification — use `request.text()` not `request.json()`.

```typescript
// app/api/stripe/webhook/route.ts
export const runtime = 'nodejs' // Required: Edge runtime lacks Buffer

export async function POST(request: Request) {
  const body = await request.text()  // RAW body for signature verification
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId  // Set this when creating checkout session
    await db.update(users).set({ paid: true }).where(eq(users.id, userId))
  }

  return new Response('OK', { status: 200 })
}
```

### Pattern 5: Client-Side State Management — useState + useReducer, No External Store

**What:** All forge UI state lives in `PromptForge.tsx` using React's built-in hooks. No Zustand, Redux, or Jotai needed.
**When to use:** Single-page tool with co-located state. The PromptForge component is the only consumer of forge state — there's no cross-component sharing that would justify a global store.
**Trade-offs:** State lives in one large-ish component. Use `useReducer` for the forge response state machine to keep transitions explicit.

```typescript
// State shape in PromptForge.tsx
type ForgeState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; result: ForgeResult }
  | { status: 'error'; message: string }
  | { status: 'gated' }  // 402 from API = show usage wall

// Local state pieces
const [forgeState, dispatch] = useReducer(forgeReducer, { status: 'idle' })
const [activeTab, setActiveTab] = useState<'prompt' | 'negative' | 'bold' | 'experimental'>('prompt')
const [copiedField, setCopiedField] = useState<string | null>(null)
const [brandOpen, setBrandOpen] = useState(false)
const [brandName, setBrandName] = useState('')
const [brandTone, setBrandTone] = useState('')
const [brandAudience, setBrandAudience] = useState('')
```

---

## Data Flow

### Forge Request Flow

```
User types input → clicks Forge
    ↓
PromptForge.tsx: dispatch({ type: 'LOADING' })
    ↓
fetch POST /api/forge { prompt, brandContext }
    ↓
app/api/forge/route.ts:
    ├── checkAndGate(request) → blocked? → return 402
    ├── anthropic.messages.create(system + user message)
    ├── parse JSON → ForgeResult
    └── decrementUsage() → return ForgeResult
    ↓
Client receives response:
    ├── 402 → dispatch({ type: 'GATED' }) → show UsageGate modal
    ├── 200 → dispatch({ type: 'SUCCESS', result }) → render OutputPanel
    └── 5xx → dispatch({ type: 'ERROR', message }) → show error state
    ↓
OutputPanel renders:
    ├── IntentBadge (intent_emoji + intent_label)
    ├── ScoreDisplay (animate 0 → score_original, 0 → score_forged)
    ├── OutputTabs (default to 'prompt' tab)
    ├── AlertBanner (if text_risk or unknown_technique)
    └── CopyButtons (per section + "Copy Everything")
```

### Auth + Usage Flow

```
Anonymous visitor arrives
    ↓
proxy.ts: read session cookie
    ├── Has valid session → NextResponse.next()
    └── No session → NextResponse.next() (homepage is public)

Visitor clicks Forge (3rd time is OK, 4th is blocked)
    ↓
POST /api/forge
    ├── No session cookie: read visitor_id cookie → query DB
    │   ├── count < 3 → allow, increment count
    │   └── count >= 3 → return 402 { error: 'usage_limit' }
    └── Has session cookie:
        ├── user.paid = true → allow
        └── user.paid = false → check forge_uses_count < 3

402 received on client
    ↓
dispatch({ type: 'GATED' })
    ↓
UsageGate modal renders: "Sign up free" or "Upgrade to Pro"
    ↓
User authenticates (email/password via /api/auth)
    → Session cookie set (httpOnly JWT via jose)
    → Modal dismisses, forge retries

Paid user flow:
    ↓
Stripe checkout session created with metadata: { userId }
    ↓
User pays → Stripe sends webhook to /api/stripe/webhook
    ↓
users.paid = true in DB
    ↓
All subsequent forge calls → no gating check blocks them
```

### Server vs Client Component Decision Tree

```
Does this component need:
  - onClick, onChange, or any event handler?        → Client Component
  - useState or useEffect?                          → Client Component
  - Browser APIs (localStorage, window)?            → Client Component
  - Real-time UI updates (score animation, copy)?   → Client Component

  - Data from DB/API at render time?                → Server Component (fetch in component)
  - Environment secrets (API keys)?                 → Server Component or Route Handler
  - Reduced JS bundle (static content, SEO)?        → Server Component
  - No interactivity at all?                        → Server Component
```

**PromptForge application decisions:**

| Component | Decision | Reason |
|-----------|----------|--------|
| `app/page.tsx` | Server | No interactivity; renders PromptForge as a shell |
| `app/layout.tsx` | Server | Font loading, metadata — no client state needed |
| `components/PromptForge.tsx` | Client | Owns all UI state: input, loading, result, tabs |
| `components/InputPanel.tsx` | Client (inherits from parent) | textarea onChange, BrandDNA inputs |
| `components/OutputPanel.tsx` | Client (inherits from parent) | Tab switching, copy states, score animation |
| `components/UsageGate.tsx` | Client | Modal open/close state |
| `app/login/page.tsx` | Server shell + Client form | Form uses `useActionState` for validation |

**Key rule:** Put `"use client"` on `PromptForge.tsx` only. All sub-components it imports become client components automatically — don't add `"use client"` to every sub-component.

---

## ForgeResult Type System

The `ForgeResult` type (already established in v10) is the single contract between the API route and the client. It is the canonical output shape from every successful forge call.

```typescript
// types/index.ts — the complete type
interface ForgeResult {
  // Intent classification
  intent_category: string        // e.g. "IMAGE_GENERATION"
  intent_subtype: string         // e.g. "HUMAN"
  intent_label: string           // e.g. "Portrait Photography"
  intent_emoji: string           // e.g. "📸"

  // Quality scores (0-100)
  score_original: number         // score of user's raw input
  score_forged: number           // score of the forged prompt
  score_reason: string           // explanation of score delta

  // Optional risk/technique flags
  text_risk?: boolean            // scene has risky background text
  text_risk_note?: string        // specific advice for text risk
  unknown_technique?: boolean    // technique not in training data
  technique_flag?: string        // guidance for unknown technique

  // Core outputs
  prompt: string                 // the forged prompt (always present)
  negative_prompt?: string       // negative prompt (not all categories)
  tool: string                   // recommended AI tool
  tool_reason: string            // why this tool was chosen

  // Optional structured parameters
  parameters?: string            // tool-specific params (e.g. aspect ratio)
  parameters_label?: string      // human label for parameters section

  // Tips and variations
  tips: string[]                 // 3-5 actionable tips
  variation_bold: string         // bolder interpretation
  variation_experimental: string // experimental/unexpected direction
}

// Usage state passed as API response for gating
interface UsageStatus {
  used: number     // forge calls made (0-3)
  limit: number    // always 3 for free tier
  paid: boolean    // true if on paid plan
}

// Session payload stored in JWT
interface SessionPayload {
  userId: string
  expiresAt: Date
}
```

**Type safety rule:** The API route must validate the Anthropic response JSON against `ForgeResult` before returning it. Use `zod` to parse and validate — if Claude returns unexpected shape, return 500 rather than passing malformed data to the client.

---

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k users | Current architecture is fine. SQLite via Turso or Neon's free tier handles this. No queue needed. |
| 1k-10k users | Add DB connection pooling (PgBouncer on Neon). Consider rate limiting in proxy.ts. Monitor Anthropic API rate limits. |
| 10k+ users | Add Redis for usage count caching (reduce DB reads on every forge call). Consider request queue to stay within Anthropic rate limits. |

### Scaling Priorities

1. **First bottleneck: Anthropic API rate limits** — claude-sonnet-4-6 has per-minute token limits. At volume, add a queue (BullMQ or Upstash Queue) so requests don't fail, they wait.
2. **Second bottleneck: DB connection exhaustion** — Vercel serverless creates a new DB connection per invocation. Neon/Supabase connection poolers handle this; raw Postgres will not.

---

## Anti-Patterns

### Anti-Pattern 1: Usage Gating in Middleware/Proxy

**What people do:** Check usage count in `proxy.ts` to block the forge route before it runs.
**Why it's wrong:** Proxy runs at the Edge runtime. Edge runtime cannot make Node.js database connections. You'll get a runtime error or be forced to use an HTTP fetch to your own API (adds latency and complexity). Official docs explicitly say "avoid database checks in proxy."
**Do this instead:** Check usage in `app/api/forge/route.ts`. Use proxy only for optimistic cookie-based redirects (e.g. redirect `/dashboard` to `/login` if no session cookie).

### Anti-Pattern 2: Storing Usage Count in the Cookie

**What people do:** Set a `forge_count=2` cookie and decrement it client-side or read it in the route.
**Why it's wrong:** Cookies are readable and writable by the user. `document.cookie = 'forge_count=0'` bypasses the entire gate. Even httpOnly cookies can be deleted (clearing them resets the counter).
**Do this instead:** Store the count in the database. The cookie holds only a UUID lookup key. The server always queries the DB to get the authoritative count.

### Anti-Pattern 3: Streaming JSON from the LLM

**What people do:** Use `StreamingTextResponse` to stream the Anthropic response to the client.
**Why it's wrong:** ForgeResult is a single JSON object. Partial JSON arriving over a stream is not parseable until the stream closes. You'd need to buffer the entire response client-side anyway, gaining nothing from streaming. Worse, it adds complexity (SSE parsing, abort handling).
**Do this instead:** `await anthropic.messages.create(...)` — get the full JSON, parse it, return it as a standard JSON response. Use the loading state (rotating messages) to cover the wait time.

### Anti-Pattern 4: "use client" on Every Component

**What people do:** Add `"use client"` to InputPanel, OutputPanel, CopyButton, etc. individually.
**Why it's wrong:** Once a component imports another component, both are in the same client bundle. Adding `"use client"` to every leaf component is redundant. It also prevents Server Component children (passed as props/children) from being server-rendered.
**Do this instead:** Put `"use client"` on `PromptForge.tsx` only. All components it directly imports become client components. Only add `"use client"` to components that are independently imported by Server Components.

### Anti-Pattern 5: Accepting Raw Anthropic JSON Without Validation

**What people do:** Return `message.content[0].text` directly after `JSON.parse()`.
**Why it's wrong:** Claude occasionally returns malformed JSON (extra text, markdown fences, truncated output). Without validation, a malformed response reaches the client and causes a runtime error.
**Do this instead:** Wrap the parse in a try/catch. Use Zod to validate the parsed object against the `ForgeResult` schema. On failure, return HTTP 500 with a descriptive error so the client can show a retry message.

---

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Anthropic API | `@anthropic-ai/sdk` in `app/api/forge/route.ts` only | Key in `ANTHROPIC_API_KEY` env var; never in client bundle |
| Stripe | `stripe` npm package; webhook at `/api/stripe/webhook` | Requires raw body for `webhooks.constructEvent()`; use `runtime = 'nodejs'` |
| Database | `drizzle-orm` or `prisma` with Neon/Supabase Postgres | Connection via `DATABASE_URL` env var; add pooler URL for serverless |
| Vercel | Deploy via `vercel.json` or dashboard; set all env vars in project settings | Set `maxDuration = 30` on forge route for Pro plan |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `PromptForge.tsx` → `/api/forge` | `fetch` POST with JSON body | Client sends `{ prompt, brandContext }`, receives `ForgeResult` or `{ error }` |
| `/api/forge` → Anthropic | `@anthropic-ai/sdk` `messages.create()` | All API calls from server only; key never reaches client |
| `/api/forge` → `lib/usage.ts` | Direct function call (same Node.js runtime) | Server-only module; validates gating before forwarding to Anthropic |
| `/api/stripe/webhook` → `lib/dal.ts` | Direct DB write via drizzle/prisma | Updates `users.paid = true`; no response to client needed |
| `proxy.ts` → `lib/session.ts` | Cookie read + `decrypt()` from jose | Only optimistic check — no DB query in proxy |

---

## Build Order (Dependency Chain)

Build in this order to avoid circular dependencies and blocked work:

1. **Types** (`types/index.ts`) — ForgeResult, SessionPayload, UsageStatus. Everything depends on this.
2. **Core UI without data** — PromptForge.tsx with static/mock data. Validates layout, design tokens, v10 fidelity.
3. **Forge API route** (`app/api/forge/route.ts`) without gating — just Anthropic call + JSON return. Gets the engine working.
4. **DB schema + usage lib** (`lib/db.ts`, `lib/usage.ts`) — free_uses table, visitor UUID logic. Needed for gating.
5. **Usage gating** — Add gate check to forge route. Free tier now functional end-to-end.
6. **Auth** (`lib/session.ts`, `/api/auth/route.ts`, `app/login/page.tsx`) — Session management. Enables registered user tracking.
7. **Usage gate modal** (`components/UsageGate.tsx`) — Client-side UI for the 402 response. Links to login/signup.
8. **Stripe checkout + webhook** — Paid plan. Last because it requires everything above to be stable.
9. **proxy.ts** — Optimistic route protection (redirect unauthenticated users away from `/dashboard` etc). Low priority since no protected dashboard routes exist yet.

---

## Sources

- Next.js App Router Route Handlers: https://nextjs.org/docs/app/api-reference/file-conventions/route (v16.1.6, 2026-02-27)
- Next.js Server and Client Components: https://nextjs.org/docs/app/getting-started/server-and-client-components (v16.1.6, 2026-02-27)
- Next.js Authentication Guide: https://nextjs.org/docs/app/guides/authentication (v16.1.6, 2026-02-27)
- Next.js Proxy (formerly Middleware): https://nextjs.org/docs/app/api-reference/file-conventions/proxy (v16.1.6, 2026-02-27)
- PromptForge CLAUDE.md and PROJECT.md (project context)
- PromptForge v10 reference component (`/reference/referencepromptforge-v10.jsx`)

---
*Architecture research for: PromptForge — Next.js 14+ App Router AI SaaS*
*Researched: 2026-03-14*
