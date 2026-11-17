## Remove `autoStart` and `Group.update` `preserve` (`#655`)

`Tween.update(time?)`, `Timeline.update(time?)`, and `Group.update(time?)` only
advance time; they never implicitly start, restart, or remove animations.

- Removed the `autoStart` parameter from `Tween.update()` and `Timeline.update()`.
- Removed `Tween.autoStartOnUpdate` and `Timeline.autoStartOnUpdate`.
- Removed the deprecated `preserve` parameter and auto-removal conditional from
  `Group.update(time?)`, so grouped tweens and timelines always remain in the
  group until removed explicitly via `group.remove()`, `tween.remove()`, or
  `group.removeAll()`.
- Updated user guides (`docs/user_guide.md`, `docs/user_guide_zh-CN.md`) and
  unit tests (`src/tests.ts`) to cover explicit `start()`/`stop()` and group
  retention lifecycle across `Tween`, `Group`, and `Timeline`.

Deferred (tracked separately under `#655`):

- Firing `onStart` synchronously inside `start()` instead of on the first
  `update()` call.

✅ Implemented
