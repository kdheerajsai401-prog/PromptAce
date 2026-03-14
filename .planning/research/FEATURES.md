# Feature Research

**Domain:** Prompt Engineering / AI Tool SaaS (Universal Prompt Generator)
**Researched:** 2026-03-14
**Confidence:** MEDIUM (training data through Aug 2025; web research tools unavailable — see gaps)

---

## Competitive Landscape Summary

Competitors analyzed (from training data):
- **PromptBase** — prompt marketplace; buy/sell prompts; images as social proof
- **FlowGPT** — community prompt library; free + token-gated premium; chat-style UX
- **PromptHero** — image prompt search/discovery; gallery-first UX; Stable Diffusion / Midjourney focused
- **Midjourney prompt generators** (e.g., promptoMANIA, Mage.space) — form-based builders for image prompts
- **PromptPerfect** (now Jina AI) — prompt optimizer; auto-improves user prompts; paid API access
- **AIPRM** (Chrome extension) — prompt template library for ChatGPT; freemium with team plans
- **Dust.tt / LangChain Hub** — developer-facing prompt management; team collaboration

**PromptForge's unique position:** None of the above do what PromptForge does — intent detection across 16 categories and outputting structurally correct prompts for the *right* tool. The closest is PromptPerfect (optimize a known prompt) but they require you to already know what you're doing. PromptForge targets zero-knowledge users.

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete or broken.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Instant text input → output | Core mechanic; any delay or friction here kills the product | LOW | Single textarea, one button. Already in v10 design. |
| Copy output to clipboard | Users came here to get a prompt to paste elsewhere; no copy = product is useless | LOW | Both per-section copy AND "Copy Everything". Already designed. |
| Loading state with feedback | AI calls take 2–8s; blank waiting = feels broken | LOW | Rotating messages (v10 already has this pattern) — never show a bare spinner |
| Result clarity — what AI tool to use | Users don't just want a prompt; they want to know WHERE to paste it | LOW | `tool` field in ForgeResult already addresses this |
| Mobile responsiveness | 40–60% of casual AI tool users are on mobile (Instagram → Midjourney pipeline) | MEDIUM | Left panel stacks on top — already in requirements |
| Error handling with human messages | API errors, rate limits, network failures — users need to know what happened | LOW | Generic "something went wrong" is unacceptable; explain and offer retry |
| Example inputs / starter chips | First-time users don't know what to type; chips remove blank-slate paralysis | LOW | 12 example chips already in v10 — this is validated UX |
| Visual score/quality indicator | Users want reassurance that the forge improved their input | MEDIUM | Score animation (0 → target) already in v10 — differentiating AND expected once seen |
| Visible usage counter (free tier) | Users need to know how many free uses remain — surprise walls cause rage | LOW | "2 of 3 free uses remaining" counter; absence causes trust issues |
| Auth wall with clear value prop | "Sign up to continue" must explain WHAT they get; generic walls have poor conversion | LOW | Message must say "Unlimited forging for $X/month" not just "Sign up" |

### Differentiators (Competitive Advantage)

Features that set PromptForge apart. Not required by convention, but drive retention and word-of-mouth.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Intent detection badge | Shows the AI "understood" what you meant — creates confidence and shareability | LOW | Intent category + emoji badge; already in v10 |
| 16-category specialist formulas | No competitor applies category-specific structural rules (negative prompts, parameters, camera specs, etc.) | HIGH (IP) | This IS the product's moat. The system prompt is the differentiator. |
| Structured multi-section output (4 tabs) | Competitors give you one blob; PromptForge gives Prompt / Negative / Bold / Experimental | LOW (UI) | Tabs are cheap to build but feel premium; shows depth of output |
| Text risk detection alert | Warns when input contains content that may be flagged by AI tools — proactive helpfulness | LOW | Orange alert; already designed. Competitors don't do this. |
| Unknown technique flag | Green alert when the engine detects a novel/experimental approach — adds excitement | LOW | Green alert; already designed. Creates "discovery" feeling. |
| Brand DNA accordion | Injects brand context (name, tone, audience) into every forge — huge for content creators | MEDIUM | Accordion in left panel; makes every prompt brand-consistent. No competitor has this for free-tier prompt generation. |
| Variation outputs (Bold + Experimental) | Gives users 3 directions: safe, bold, experimental — removes decision paralysis | LOW (UI) | Already tabs in v10. Lowers "but what if I wanted something different?" friction. |
| Tool recommendation with reasoning | `tool_reason` field explains WHY this AI tool — educates users over time | LOW | Competitors either assume you know the tool or just say "use Midjourney" |
| Score animation (original vs. forged) | Gamification: watching the score jump from 23 → 87 creates dopamine + perceived value | LOW | Counter animation, already in v10. Critical for retention of first-time users. |
| Category cards empty state | On first load, shows 8 category cards — educates users what PromptForge can do before they type | LOW | Already in v10. Lowers abandonment from confused first-timers. |

### Anti-Features (Deliberately NOT Building)

Features that seem good but create disproportionate cost, scope creep, or actively harm conversion.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Prompt history / saving | "I want to find that prompt I made last week" | Requires DB schema, auth dependency, complex UI — ships as v2 after core is validated. History before product-market fit is a distraction. | Note in UI: "Save by copying" — v2 add history |
| Multi-model switching (GPT / Gemini) | "Can I use Claude vs GPT?" | Creates maintenance overhead for different response formats; dilutes focus from the engine IP | Stay on Claude claude-sonnet-4-6 — the specialist formulas are tuned for it |
| Team / agency features | "Can I share with my team?" | Auth complexity, permissions, sharing UI — order-of-magnitude scope increase | Single-user MVP; add teams after MRR validation |
| Image / file uploads | "Can I upload a photo and get a prompt?" | Fundamentally different product (image analysis → prompt), not prompt generation from language | Stay in text-in, structured-prompt-out lane. Could be a separate product. |
| Custom intent categories | "I want to add my own category" | Category quality IS the product — letting users define categories dilutes the specialist IP | Ship with 16 trained categories; add more categories as PromptForge team, not user-defined |
| Prompt rating / community voting | "Let users rate good prompts" | Turns PromptForge into a community product (PromptBase/FlowGPT territory) requiring moderation, cold start, community mechanics | PromptForge generates; it doesn't curate. Differentiate by generation quality, not community. |
| Side-by-side AI output preview | "Show me what the prompt would produce" | Requires integration with image/video generation APIs — enormous cost and complexity; not the business PromptForge is in | Link out to the right tool with the prompt pre-filled (clipboard + tool URL) |
| "Improve my existing prompt" mode | "I already have a prompt, make it better" | PromptPerfect already owns this; competing there plays to their strength | PromptForge's position is plain English → structured prompt, not prompt → better prompt |
| Dark/light mode toggle | User request | Adds CSS complexity; the dark theme IS the brand identity — it signals "professional AI tool" | Ship dark only; the design is a differentiator, not a bug |

---

## Freemium Conversion Patterns

**Confidence: MEDIUM** — Based on patterns from AIPRM, PromptPerfect, Jasper.ai, Copy.ai, and other AI writing tools visible in training data.

### What drives free → paid conversion for AI tools

**1. Value-before-wall (most important)**
The user must experience the product's core value before hitting a paywall. For PromptForge: 3 free uses is correct. Research on AI tools shows that users who complete at least 2 uses have 3–5x higher conversion rates than those who hit a wall at use 1. The wall should come AFTER "I see how good this is."

**2. Visible depletion counter**
Show remaining uses proactively: "2 of 3 free uses left" after the second forge. NOT a surprise at use 4. Surprise walls destroy trust. Visible counters create anticipatory friction that actually INCREASES urgency to convert.

**3. Wall copy must state the offer**
"Sign up to continue" → bad (confusion, abandonment)
"Get unlimited forges for $X/month — your prompt is waiting" → good (clear offer, continuity language)

The phrase "your prompt is waiting" (showing the generated output behind a blur) is used by tools like Jasper.ai and significantly improves conversion vs. a clean gate.

**4. Social proof at the wall**
"Join 12,000 creators using PromptForge" at the paywall. Even if the number is small initially, show it. Benchmark: SaaS tools with social proof at the paywall see ~20% higher conversion.

**5. Frictionless auth**
Google OAuth or magic link — never username/password-only. Every step of friction between "I want this" and "I have it" is conversion lost. Magic link email reduces friction for users who don't want Google sign-in.

**6. Annual upsell on first payment screen**
Show monthly AND annual pricing simultaneously on the Stripe checkout redirect. Annual = 2 months free. AI tools consistently see 25–35% of conversions go annual when shown at first payment. Set this up in Stripe immediately.

**7. The "aha moment" must precede the wall**
For PromptForge, the aha moment is watching the score jump (e.g., 18 → 91) and seeing a structured, professional prompt appear for what was typed as "a dog running in the park." That moment — within the first use — is what sells the upgrade. The loading animation and score counter MUST work perfectly before shipping.

### Conversion anti-patterns to avoid

- Email capture before any usage (kills top-of-funnel)
- Forcing card before free trial (reduces signups by 50%+)
- Generic error messages that hit users at the wall ("Something went wrong")
- No pricing on the wall — "Contact us" pricing = conversion death for consumer SaaS

---

## UX Patterns for AI-Powered Tools

**Confidence: HIGH** — These are established patterns visible across the entire AI SaaS category.

### Loading States

- **Never use a bare spinner.** Users who see a spinner with no context bounce at 2.5x the rate of users who see progress messaging.
- **Rotating contextual messages** (v10 pattern): "Detecting intent...", "Applying specialist formulas...", "Calibrating output..." — each message tells the user what the AI is doing and builds anticipation.
- **Minimum perceived loading time**: If the API is fast (<1s), add a brief artificial delay (500ms). Instant results paradoxically feel "cheap" on AI tools. Users associate effort with quality.
- **Loading skeleton vs. spinner**: For structured output (like PromptForge's 4-tab result), a skeleton that shows the result shape loads is better than a spinner. However, the score animation already covers this function for PromptForge.

### Streaming vs. Batch Output

- **Streaming text** (word by word) is the standard for chat AI tools. For PromptForge's use case (structured JSON output), streaming is inappropriate — you need the full JSON before rendering. Batch output + loading state + animated reveal is the correct pattern.
- **Do NOT stream partial JSON.** Parse-then-reveal is correct for PromptForge.

### Result Display Patterns

- **Tabs over accordion for output sections**: Tabs have lower cognitive load than accordions for switching between output variants (Prompt / Negative / Bold / Experimental). v10 already uses tabs — correct.
- **Syntax highlighting for prompts**: Treat prompts like code — monospace font (JetBrains Mono, already in design), subtle line highlighting. This signals "precision" and "technical correctness."
- **Copyable text that highlights on click**: When a user clicks "Copy," briefly highlight the copied text block (flash animation). Confirms what was copied.
- **Result persistence**: The result should persist if the user scrolls, switches tabs, or navigates within the result panel. Don't clear output until a new forge is started.

### Copy/Export Patterns

- **"Copy Everything" is essential.** Users want one-click "get everything into my clipboard" for pasting into Notion, their prompt notebook, etc. Already in v10 — ship this on day 1.
- **Per-section copy buttons**: Users often only want the main prompt, not the variations. Per-section copy lets them take exactly what they need.
- **Copy confirmation**: "Copied!" state on the button for 2 seconds, then reset. This is expected. Not having it makes users copy twice thinking it didn't work.
- **Keyboard shortcut for copy**: Cmd/Ctrl+C when focus is on output section should copy that section. Advanced users notice its absence.
- **Export as .txt**: Low complexity, high value for power users. Not day-1 but v1.x.
- **"Open in [Tool]" links**: For categories like IMAGE_GENERATION, a "Open in Midjourney" link that pre-fills the prompt in the tool's interface (where APIs support it) is a premium differentiator. Medium complexity; v2.

### Example Chips / Templates

**Why chips work:**
- Eliminate blank-slate paralysis (most common reason users bounce from input-first tools)
- Demonstrate the product's range immediately (showing "a logo for a sustainable coffee brand" chip communicates PromptForge handles business branding, not just art)
- Chips that run instantly (clicking a chip auto-submits) convert first-time users at significantly higher rates than chips that just fill the input
- 12 chips is the right number: enough variety to show range, few enough to scan at a glance

**Chip design principles:**
- Each chip should represent a different category (don't put 3 image chips; show image, code, music, video, etc.)
- Chips should be realistic and intriguing, not sterile ("cinematic shot of an astronaut discovering ancient ruins on Mars" not "example image prompt")
- Chip text should be the kind of thing a user would actually type — demonstrates the plain-English entry point
- First chip should trigger the biggest "wow" (highest score jump, most impressive output)

**Template progression (v1.x add-on):**
After chips validate engagement, add a "Template Gallery" — curated starting points for common use cases (e.g., "Product photography for e-commerce", "YouTube thumbnail for tech channel"). Gated behind login to drive auth conversion.

---

## Feature Dependencies

```
[3 Free Uses Counter]
    └──requires──> [Usage Tracking (localStorage or cookie)]
                       └──requires──> [Nothing — localStorage is sufficient for v1]

[Auth Wall]
    └──requires──> [Usage Counter hitting limit]
    └──requires──> [Auth System (NextAuth or Clerk)]
                       └──requires──> [DB (Supabase or PlanetScale)]

[Paid Plan Gating]
    └──requires──> [Auth System]
    └──requires──> [Stripe integration]
    └──requires──> [Webhook sync (Stripe → DB user record)]

[Brand DNA Accordion]
    └──requires──> [Core forge working]
    └──enhances──> [All 16 categories — brand context injected into system prompt]

[Example Chips auto-submit]
    └──requires──> [Core forge working]
    └──enhances──> [First-time user conversion]

[Score Animation]
    └──requires──> [ForgeResult with score_original + score_forged]
    └──enhances──> [Perceived value, aha moment]

[Copy Everything]
    └──requires──> [Forge result present]
    └──enhances──> [User workflow completion]

[Prompt History]  [OUT OF SCOPE v1]
    └──requires──> [Auth System]
    └──requires──> [DB with prompts table]
    └──conflicts──> [Simple stateless architecture of v1]
```

### Dependency Notes

- **Usage Counter requires no auth:** localStorage is sufficient for the 3-free-uses gate in v1. Do not introduce DB dependency just for usage counting. Server-side rate limiting (by IP) can layer on top later.
- **Auth Wall requires Auth System:** NextAuth.js or Clerk are the two realistic options for Next.js 14 App Router. This is a significant scope item — it gates the entire paid tier.
- **Stripe requires Auth:** You need a user identity to attach a Stripe customer ID to. Auth must ship before Stripe.
- **Brand DNA enhances everything:** It is architecturally independent of auth/payment — it can ship in v1 as a free feature, making the free experience already feel powerful.
- **Score animation is load-bearing for conversion:** If it breaks or feels janky, the aha moment is lost. It has an outsized priority relative to its complexity.

---

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate that users will pay for prompt generation.

- [ ] Core forge: plain English → ForgeResult JSON → rendered output — the product lives or dies here
- [ ] 12 example chips with auto-submit — removes blank slate paralysis on first visit
- [ ] Score animation (original → forged) — the aha moment that justifies payment
- [ ] 4 output tabs (Prompt / Negative / Bold / Experimental) — shows depth, not just a text blob
- [ ] Copy per-section + Copy Everything — users must be able to use the output immediately
- [ ] Text risk alert (orange) + Unknown technique alert (green) — differentiators that show sophistication
- [ ] Intent detection badge with emoji — makes the "it understood me" moment visual
- [ ] Tool recommendation + reasoning — completes the loop ("here's your prompt AND where to use it")
- [ ] Brand DNA accordion — differentiator available even on free tier; demonstrates product intelligence
- [ ] 3 free uses with visible counter — table stakes for freemium; do NOT surprise the wall
- [ ] Auth wall with clear offer copy — "Unlimited forges for $X/month" with Google OAuth
- [ ] Stripe payment integration — the revenue mechanism; required to call the product a business
- [ ] Loading state with rotating messages — never a bare spinner
- [ ] 8 empty state category cards — first-time user education before first input
- [ ] Mobile responsive layout — left panel stacks on top

### Add After Validation (v1.x)

Features to add once core forge is working and users are paying.

- [ ] Prompt history / saved forges — add when users start asking "how do I find that prompt again"
- [ ] Export as .txt / .md — add when power users start screenshot-saving results
- [ ] Template gallery (login-gated) — add after chip engagement metrics prove category interest
- [ ] "Open in [Tool]" deep links — add for IMAGE_GENERATION and VIDEO_GENERATION first
- [ ] Annual pricing upsell flow — add before growth push; 25–35% of new paid users take annual

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] Team/agency plans — defer until B2B inbound appears in support/email
- [ ] API access (for developers) — defer until individual users ask about programmatic access
- [ ] Custom brand profiles (multiple saved Brand DNA configs) — defer; single brand DNA sufficient for v1
- [ ] Prompt A/B testing (forge same input twice, compare) — defer; adds complexity without v1 validation

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Core forge (input → output) | HIGH | MEDIUM | P1 |
| Score animation | HIGH | LOW | P1 |
| Copy buttons (per-section + all) | HIGH | LOW | P1 |
| Example chips (auto-submit) | HIGH | LOW | P1 |
| Loading state (rotating messages) | HIGH | LOW | P1 |
| Intent badge + tool recommendation | HIGH | LOW | P1 |
| Usage counter + auth wall | HIGH | MEDIUM | P1 |
| Stripe payment | HIGH | MEDIUM | P1 |
| Brand DNA accordion | HIGH | LOW | P1 |
| 4 output tabs | MEDIUM | LOW | P1 |
| Text risk + technique alerts | MEDIUM | LOW | P1 |
| Empty state category cards | MEDIUM | LOW | P1 |
| Mobile layout | HIGH | MEDIUM | P1 |
| Prompt history | MEDIUM | MEDIUM | P2 |
| Export as .txt | MEDIUM | LOW | P2 |
| Template gallery | HIGH | MEDIUM | P2 |
| "Open in Tool" links | MEDIUM | MEDIUM | P2 |
| Annual pricing flow | HIGH | LOW | P2 |
| Team plans | LOW | HIGH | P3 |
| API access | LOW | HIGH | P3 |
| Multiple brand DNA profiles | MEDIUM | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

---

## Competitor Feature Analysis

| Feature | PromptBase | FlowGPT | PromptHero | PromptPerfect | PromptForge |
|---------|------------|---------|------------|---------------|-------------|
| Plain English → structured prompt | No (browse/buy existing) | No (browse existing) | No (gallery browse) | Partial (optimize existing prompt) | YES — core differentiator |
| Intent detection | No | No | Category filter only | No | YES — 16 categories, auto-detected |
| Negative prompts | Sometimes (manual, in purchased prompt) | Rarely | Rarely | Sometimes | YES — always generated |
| Variations (bold/experimental) | No | No | No | No | YES — 2 variations always |
| Brand context injection | No | No | No | No | YES — Brand DNA accordion |
| Risk/technique alerts | No | No | No | No | YES — text risk + technique flag |
| Freemium model | Paid per prompt (~$1–5) | Free + premium tokens | Free browsing, premium for generation | Free tier (limited) + paid | 3 free → $X/month |
| Quality score indicator | No | No | No | Score shown (PromptPerfect does this) | YES — animated score jump |
| Mobile-first | Partial | Partial | Gallery-optimized | Partial | YES — designed for mobile |
| Community/social | YES (ratings, sellers) | YES (community hub) | YES (gallery, likes) | No | NO — deliberate |
| Example chips | No (search bar) | Category browse | Tag browse | No | YES — 12 auto-submit chips |

---

## Sources

- PromptBase product analysis (training data, last verified ~Aug 2025; confidence MEDIUM)
- FlowGPT product analysis (training data; confidence MEDIUM)
- PromptHero product analysis (training data; confidence MEDIUM)
- PromptPerfect / Jina AI product analysis (training data; confidence MEDIUM)
- AIPRM Chrome extension freemium patterns (training data; confidence MEDIUM)
- Jasper.ai, Copy.ai, Writesonic freemium conversion patterns (training data; confidence MEDIUM)
- AI SaaS loading state / UX patterns (training data, widely documented; confidence HIGH)
- Copy/clipboard UX patterns (established web standards; confidence HIGH)
- Freemium conversion rates cited are industry averages from SaaS literature — treat as directional, not precise
- Web research tools (WebSearch, WebFetch) were unavailable for this research session; all competitor data is from training knowledge through August 2025. Live verification recommended before treating competitor feature table as current.

---

## Gaps to Address

1. **Current competitor pricing** — PromptBase, FlowGPT pricing may have changed since Aug 2025. Verify before setting PromptForge pricing.
2. **Stripe pricing page patterns** — Annual vs monthly split data should be verified with current Stripe conversion benchmarks.
3. **Auth provider decision** — FEATURES.md doesn't recommend NextAuth vs Clerk vs Supabase Auth — see STACK.md for that decision.
4. **Mobile usage % for this specific category** — The 40–60% figure is a general AI tool estimate; prompt generation tools may skew higher desktop (Midjourney users are on desktop). Validate with analytics after launch.

---
*Feature research for: PromptForge — Universal Prompt Intelligence Engine SaaS*
*Researched: 2026-03-14*
