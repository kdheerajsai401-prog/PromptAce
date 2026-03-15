---
phase: 1
slug: foundation-core-forge-engine
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-14
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (unit) + Playwright (e2e) — Wave 0 installs |
| **Config file** | `vitest.config.ts` — Wave 0 creates |
| **Quick run command** | `npx vitest run` |
| **Full suite command** | `npx vitest run && npx playwright test` |
| **Estimated runtime** | ~15 seconds (unit) / ~45 seconds (with e2e) |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run`
- **After every plan wave:** Run `npx vitest run && npx playwright test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| project-setup | 01 | 0 | INFRA-01 | build | `npm run build` exits 0 | ❌ W0 | ⬜ pending |
| system-prompt | 01 | 1 | ENG-02, ENG-04 | grep | `grep "server-only" lib/system-prompt.ts` | ❌ W0 | ⬜ pending |
| api-key-security | 01 | 1 | ENG-03 | build+grep | `npm run build` + bundle analysis | ❌ W0 | ⬜ pending |
| forge-route | 01 | 1 | ENG-01, ENG-05, ENG-06 | unit | `npx vitest run __tests__/forge-route.test.ts` | ❌ W0 | ⬜ pending |
| types | 01 | 0 | ENG-01 | type-check | `npx tsc --noEmit` | ❌ W0 | ⬜ pending |
| preset-selector | 02 | 1 | PSET-01–05 | manual+unit | Playwright: click preset, verify input populates | ❌ W0 | ⬜ pending |
| ui-layout | 02 | 1 | UI-01, UI-16 | manual | Visual review + mobile viewport check | manual | ⬜ pending |
| score-animation | 02 | 2 | UI-03 | manual | Verify counters animate 0→target on forge | manual | ⬜ pending |
| output-tabs | 02 | 2 | UI-04 | unit | `npx vitest run __tests__/output-tabs.test.ts` | ❌ W0 | ⬜ pending |
| copy-ux | 02 | 2 | UI-05, UI-06 | manual | Click copy → paste into text editor, verify content | manual | ⬜ pending |
| brand-dna | 02 | 2 | UI-14 | unit | `npx vitest run __tests__/brand-dna.test.ts` | ❌ W0 | ⬜ pending |
| infra-deploy | 03 | 1 | INFRA-01–03 | manual | `vercel --prod` deploy succeeds | manual | ⬜ pending |

---

## Wave 0 Requirements

- [ ] `__tests__/forge-route.test.ts` — stubs for ENG-01, ENG-05, ENG-06 (input cap, retry logic, JSON parse)
- [ ] `__tests__/output-tabs.test.ts` — stubs for UI-04 (tab switching state)
- [ ] `__tests__/brand-dna.test.ts` — stubs for UI-14 (brand DNA accordion state)
- [ ] `vitest.config.ts` — vitest configuration for Next.js
- [ ] `package.json` test scripts — `"test": "vitest run"`, `"test:watch": "vitest"`
- [ ] Next.js 14 project scaffolded with TypeScript + Tailwind (prerequisite for all other tasks)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Score counters animate 0→target | UI-03 | DOM animation timing — not automatable in unit tests | Trigger forge, observe both score chips animate from 0 |
| Design token fidelity | UI-16 | Visual review required | Open DevTools, verify bg-color is `#030407`, fonts are DM Sans + JetBrains Mono |
| Mobile stacking layout | UI-01 | Responsive layout needs viewport | Resize to 375px, verify left panel stacks above right |
| Loading rotating messages | UI-07 | Text rotation requires timing observation | Click Forge, verify message changes during wait |
| Copy Everything content | UI-06 | Clipboard API requires real browser | Click Copy Everything, paste into text editor, verify formatted output |
| API key absent from bundle | ENG-03 | Bundle analysis — run `grep -r "sk-ant" .next/` — must return empty | After `npm run build`, confirm no API key in build artifacts |
| System prompt not in client bundle | ENG-04 | Bundle analysis | After `npm run build`, verify `server-only` import prevents system prompt in client chunks |
| text_risk alert appearance | UI-09 | Requires specific LLM response — hard to unit test | Craft input that triggers text risk, verify orange alert renders |
| unknown_technique alert | UI-10 | Same as above | Craft input with obscure technique, verify green alert renders |
| Preset hint passed to engine | PSET-03 | Requires full request/response cycle | Select preset, forge, verify ForgeResult category matches preset hint |

---

## Security Verification Checks (Grep-Based)

Run after each wave:

```bash
# ENG-03: API key never in client code
grep -r "ANTHROPIC_API_KEY" app/components/ && echo "FAIL: key in client" || echo "PASS"
grep -r "sk-ant" .next/static/ 2>/dev/null && echo "FAIL: key in bundle" || echo "PASS"

# ENG-04: server-only guard on system prompt
grep "server-only" lib/system-prompt.ts && echo "PASS" || echo "FAIL: missing server-only"

# ENG-06: Input cap enforced
grep "2000" app/api/forge/route.ts && echo "PASS" || echo "FAIL: no input cap"
grep "max_tokens" app/api/forge/route.ts && echo "PASS" || echo "FAIL: no max_tokens"

# INFRA-01: maxDuration and runtime
grep "maxDuration" app/api/forge/route.ts && echo "PASS" || echo "FAIL"
grep "runtime.*nodejs" app/api/forge/route.ts && echo "PASS" || echo "FAIL"
```

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
