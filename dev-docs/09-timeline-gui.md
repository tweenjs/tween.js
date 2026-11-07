# 09 — Timeline GUI

Visual track editor for tween.js `Timeline`s in `timeline-gui/`
(zero-dependency vanilla ESM, except one vendored highlighter).

## Requirements (from issues and references)

- #710: "create UIs to visualize timelines on tracks", with the
  `timeline-css` screenshot as the visual target; two-way binding
  (edit code ↔ edit timeline) as a useful property.
- #647 / #655: `Timeline` owns orchestration (sequence/parallel, nesting,
  labels); GUI must reflect those semantics, not Tween internals.
- #560: controlled/explicit clock — the GUI must own time and drive
  `start(0)` + `update(v)` (the `examples/21_timeline_slider.html` pattern).
- ShapeShifter: tracks + playhead + scrub UX for animation authoring.
- Repo ethos (Three.js-like): small API, explicit, no magic.

## Decisions

- **Vanilla ESM, no install step.** `timeline-gui/` has no `node_modules`;
  it imports the built lib via import map (`../dist/tween.esm.js`).
  Serve from the repo root so `../dist` resolves. The single
  third-party file set (speed-highlight, CC0-1.0) is vendored, not
  installed; `timeline-gui/vendor/` is prettier-ignored.
- **Editor-first, own model.** The GUI keeps a plain model (`src/model.js`,
  no DOM) and builds a real `Timeline` from it for playback. Per user
  choice, **no core library changes** were made — no `Timeline.getEntries()`
  introspection API. Loading arbitrary existing `Timeline` instances is
  deferred.
- **Explicit clock at GUI level.** Pause is implemented by stopping the rAF
  loop (not `Timeline.pause()`), because updates pass timeline-local times;
  mixing wall-clock pause/resume would corrupt `_startTime`.
- **Rebuild on edit.** Model edits rebuild the `Timeline` (removeAll-style
  fresh build) instead of mutating entries, keeping the playhead via
  `start(0)` + `update(currentMs)`.

## Code as the interchange format (cf. timeline-css)

The bottom `Code` box is an editable textarea; there is no model-JSON UI.
`Apply code` (or Ctrl/Cmd+Enter) parses it back into tracks, while
track/inspector edits regenerate it.

- `model.js` has `parseCode(text) -> {model, state}` accepting only the
  statement shapes emitted by `generateCode` (one per line):
  `import …`, `const state = {…}`,
  `const t = new Tween(state).to(…).easing(…); // name`,
  `const inner = new Timeline(); // name`, `target.add(v[, offset])`,
  `tl.addLabel("name", offset)`, plus the `tl.start()`/rAF harness lines
  (skipped). Anything else throws with a line number.
- Track names round-trip via trailing `// name` comments.
- Object literals (`state`, `to`) are parsed by a strict built-in
  literal parser (objects, arrays, strings, finite numbers) — no `eval`
  or `new Function`. `__proto__` keys and code constructs throw.
  `to` values may nest (arrays / deep objects of numbers and strings).
- Invalid code never runs: Apply failure stops the rAF loop, stops the
  timeline, shows the error, and disables play/pause/stop/scrub until the
  code is fixed (track edits regenerate valid code, which also recovers).
- `localStorage` (key `tweenjs-timeline-gui-v2`) stores the code text, not
  a model dump; unparseable stored code falls back to the demo.

## Editor: highlighting + autocomplete

- Syntax highlighting via vendored `@speed-highlight/core` v2.1.0
  (`vendor/speed-highlight/`: core, JS grammar + sub-grammars, dark
  theme), using the overlay technique: a transparent `<textarea>` over an
  `aria-hidden` `<pre>`. `highlightHTML(code, 'js', {block: false})` is
  async with a stale-request guard; scroll positions sync, `Tab` inserts
  two spaces, selection/caret stay visible.
- Autocomplete for `Tween`/`Timeline`/`Easing`, `Easing` categories and
  variants, and `Timeline` methods after `tl.`: pure
  `extractPrefix`/`getCompletions`/`easingTree` in `model.js`, caret-anchored
  popup in `app.js` (mirror-div measuring, flips above the caret when it
  would overflow). Tab/Enter accept, Up/Down cycle, Esc closes, Ctrl+Space
  forces suggestions (top-level names when there is no prefix), click
  accepts; suppressed inside `//` comments and strings.
- Undo at both levels: code-box text edits use `execCommand('insertText')`
  for Tab/accept so native Cmd/Ctrl+Z keeps working (programmatic
  `value =` assignments would clear the undo stack; regeneration skips
  identical text for the same reason). Track edits push code snapshots to
  an Undo/Redo history (buttons + Cmd/Ctrl+Z outside editable fields).

## Layout

- `index.html` — shell, import map, vendored theme CSS.
- `src/model.js` — pure: clips (`tween`/`timeline`), labels, time↔px,
  CRUD, codegen + code parser + literal parser + completion logic.
- `src/app.js` — transport, ruler scrub, clip drag-move + edge-resize,
  inspector, stage preview, code box (highlight, autocomplete, persistence).
- `src/styles.css` — dark track-editor theme.
- `test/smoke.mjs` — model tests: `node test/smoke.mjs`.
- `vendor/speed-highlight/` — pinned vendored highlighter (see GUI README
  for the refresh command).

## Verification

- 15 model smoke tests pass, including code round-trip (names, offsets,
  labels, state), edited-code parsing, invalid-code and literal-parser
  rejections, and completion/prefix cases.
- Headless-Chromium verification: popup shows/accepts for `Twe`,
  `Easing.`, `tl.`, and Ctrl+Space; popup flips above the caret at
  end-of-file; Tab-accepted text undoes natively; Undo/Redo restores
  track edits (button and shortcut).
- Playback verified against `dist/tween.cjs`: default model (4000ms,
  mid-play, scrub-back, replay) and parsed-model edits take effect.
- `prettier --check timeline-gui/` passes; all DOM ids referenced from
  `app.js` exist in `index.html`; no `eval`/`new Function` remains in
  `timeline-gui/src`.
- Noted core semantic (inherited, same as example 21): after a timeline
  finishes, `start(0)` keeps stale `started` flags, so not-yet-due children
  keep end values until the playhead reaches them again on replay.

## Future work

- Attach mode: visualize an arbitrary live `Timeline` (needs a read-only
  `getEntries()`-style core API — explicitly deferred).
- Nested editing deeper than one level; easing curve previews; keyframe
  dots per property; snap-to-grid; multi-select.

✅ Implemented
