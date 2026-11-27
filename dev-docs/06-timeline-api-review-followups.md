## Timeline API review follow-ups

- `Timeline.add()` supports `stagger` (not `each`) when adding arrays, so the
  public API uses clearer orchestration terminology.
- `Timeline.interpolation()` is removed to avoid carrying a new API that is
  already planned for replacement on `Tween`.
- `Timeline.easing()` is renamed to `easingAll()`; recursion into nested
  timelines is opt-in via a second `recurse` argument, so direct-child and
  nested-child behavior stays explicit.
- The guide moves Tween deprecation callouts directly under each affected API
  heading so readers see replacements before reading legacy usage details.

✅ Implemented
