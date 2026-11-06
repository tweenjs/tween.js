# 03 — PR #713 review-condition fixes and diff minimization

**Date:** 2026-10-01
**Status:** ✅ Implemented

Audit of every #713 review condition (typed placement API, no Timeline timing
methods, non-breaking 25.0.0, ESM examples, `GroupChild` typing, tests) found
all satisfied; these gaps were fixed:

| Gap                                                                | Fix                                                                 |
| ------------------------------------------------------------------ | ------------------------------------------------------------------- |
| #655 marks "`Tween.chain` deprecated (done in #713)" but it wasn't | `@deprecated` JSDoc + guide note, matching the other timing methods |
| Guide listed `timeline.onEveryStart(fn)` (deleted in d1fe819)      | removed the line                                                    |
| `package.json` lost `"dependencies": {}` (npm rewrite)             | restored                                                            |
| Invalid `// red` CSS comments in `22_timeline_repeat.html`         | removed                                                             |
| Branch behind `origin/main` (#723/#724 guide fixes)                | merged, clean                                                       |
| Stale PR description (yoyo "throws", reverse "deferred")           | rewritten to final state                                            |

Edge-case tests requested in review were added in `src/tests.ts` (two-level
nesting, scrub-back and pause/resume across nested timelines).

## Affected code

`src/Tween.ts`, `src/tests.ts`, `docs/user_guide.md`, `package.json`,
`examples/22_timeline_repeat.html`, `dist/*` (rebuilt).
