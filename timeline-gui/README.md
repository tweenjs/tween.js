# tween.js — Timeline GUI

A zero-dependency, vanilla ESM visual editor for tween.js `Timeline`s.
Inspired by [timeline-css](https://github.com/solomon-gumball/timeline-css)
(track visualization + two-way binding) and
[ShapeShifter](https://shapeshifter.design) (animation timeline UX),
driven by the vision in
[tween.js#647](https://github.com/tweenjs/tween.js/issues/647) and
[tween.js#710](https://github.com/tweenjs/tween.js/issues/710).

## Run it

The GUI vendors the built lib (`vendor/tween/tween.esm.js`, copied from
the repo `dist/` build), so **any static server root works** — the repo
root, the `timeline-gui/` folder itself (f.e. VS Code Live Server / Live
Preview on this folder), or any subpath host:

```sh
# from the repo root (also refreshes the vendored copy)
npm run build
cd timeline-gui && npm run vendor

# serve from anywhere that covers timeline-gui/
npx --yes serve .
# open http://localhost:3000/ (or http://localhost:3000/timeline-gui/
# when serving the repo root)
```

No `npm install` needed inside `timeline-gui/` — there are no dependencies.

Opening `index.html` directly does **not** work: browsers refuse to load
ES modules from `file://` URLs, so the page stays empty. If you see the
red boot banner instead of tracks, serve the folder over HTTP as above
(in VS Code, the Live Server extension&#39;s “Open with Live Server” does
the same).

## What it does

- **Tracks view**: one row per timeline entry, positioned by offset/duration
  (sequential by default, parallel via explicit offsets — same semantics as
  `Timeline.add`). Nested timelines render as collapsible group rows.
- **Ruler + labels**: tick ruler, named labels (`addLabel`), click/drag to scrub.
- **Explicit-clock playback**: the GUI owns the clock and drives the timeline
  with `tl.start(0)` + `tl.update(v)` (the pattern from
  `examples/21_timeline_slider.html`, cf. issue #560), so scrubbing,
  pause, speed, and loop are exact.
- **Editing**: drag clips to move, drag the right edge to resize, inspector
  for name/offset/duration/easing/target values, duplicate/delete, add
  tween / nested timeline / label at the playhead.
- **Code ↔ timeline (two-way binding, cf. timeline-css)**: the code box is
  editable — Apply (Ctrl/Cmd+Enter) parses it back into tracks, while
  track edits rewrite the code. Only the generated statement shapes (one
  per line; trailing `// name` comments label tracks) are accepted;
  invalid code stops playback and shows the error. Object literals are
  parsed by a strict built-in parser (no `eval`). The code (not a model
  dump) is what persists to `localStorage`. Highlighting via vendored
  [speed-highlight](https://github.com/speed-highlight/core) (CC0-1.0);
  autocomplete for `Tween`/`Timeline`/`Easing` (+ `Easing` tree, `tl.`
  methods; Tab/Enter accept, Up/Down cycle, Esc closes, Ctrl+Space
  suggests). Undo/Redo buttons (or Cmd/Ctrl+Z outside the code box)
  restore track edits; text edits undo natively.
- **Live stage**: a preview box driven by the same timeline being edited.

## Layout

- `index.html` — page shell, import map (`@tweenjs/tween.js` →
  `./vendor/tween/tween.esm.js`).
- `src/model.js` — pure: clips, labels, time↔px, CRUD, codegen + code parser.
- `src/app.js` — DOM wiring: transport, tracks, inspector, code box, persistence.
- `src/styles.css` — dark track-editor theme.
- `test/smoke.mjs` — model tests: `node test/smoke.mjs`.
- `vendor/tween/tween.esm.js` — copy of the repo `dist/` build so the GUI
  runs from any static root. Refresh after rebuilding the lib with
  `npm run vendor`; the smoke test fails if the copy drifts from `dist/`.
- `vendor/speed-highlight/` — pinned vendored highlighter (CC0-1.0, zero
  deps); refresh with:
  `for f in index.js languages/js.js languages/jsdoc.js languages/todo.js languages/regex.js themes/dark.css; do curl -sL -o vendor/speed-highlight/$f https://cdn.jsdelivr.net/npm/@speed-highlight/core@2.1.0/dist/$f; done`

## Scope notes

- The GUI keeps its own model and builds a `Timeline` from it; no core
  library changes were needed (first version deliberately avoids a
  `Timeline.getEntries()` introspection API).
- Nested editing is one level deep in the UI; the model/codegen support
  arbitrary nesting for the future.
