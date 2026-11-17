## Remove `autoStart` from `update()` (`#655`)

`Tween.update(time?)` and `Timeline.update(time?)` only advance time on an
already-playing instance; they never start or restart a stopped one.

- Removed the `autoStart` parameter from `Tween.update()` and `Timeline.update()`.
- Removed `Tween.autoStartOnUpdate` and `Timeline.autoStartOnUpdate`.
- Updated `Group.update()` to call `tween.update(time)` directly without
  passing `!preserve` as `autoStart`, so calling `stop()` on a grouped tween
  followed by `group.update(time, false)` will not restart it.
- Updated user guides (`docs/user_guide.md`, `docs/user_guide_zh-CN.md`) and
  unit tests (`src/tests.ts`) to cover explicit `start()`/`stop()` lifecycle
  across `Tween`, `Group`, and `Timeline`.

Deferred (tracked separately under `#655`):

- Firing `onStart` synchronously inside `start()` instead of on the first
  `update()` call.
- Removing the deprecated `preserve` parameter from `Group.update()`.

✅ Implemented
