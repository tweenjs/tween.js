# tween.js — Timeline GUI

A zero-dependency, vanilla ESM visual editor for tween.js `Timeline`s.
Inspired by [timeline-css](https://github.com/solomon-gumball/timeline-css)
(track visualization + two-way binding) and
[ShapeShifter](https://shapeshifter.design) (animation timeline UX),
driven by the vision in
[tween.js#647](https://github.com/tweenjs/tween.js/issues/647) and
[tween.js#710](https://github.com/tweenjs/tween.js/issues/710).

## Run it

`tween.esm.js` is imported from the repo `dist/` build via a relative
import map (`../dist/tween.esm.js`), so serve from the **repo root**
and open the `timeline-gui/` path:

```sh
# from the repo root
npm run build
npx --yes serve .
# open http://localhost:3000/timeline-gui/
```

(or `npm run dev` inside `timeline-gui/`, which serves the parent dir).
No `npm install` needed inside `timeline-gui/` — there are no dependencies.

## What it does

- **Tracks view**: one row per timeline entry, positioned by offset/duration
  (sequential by default, parallel via explicit offsets — same semantics as
  `Timeline.add`). Nested timelines render as collapsible group rows.
- **Ruler + labels**: tick ruler, named labels (`addLabel`), click/drag to scrub.
- **Explicit-clock playback**: the GUI owns the clock and drives the timeline
  with `tl.start(0)` + `tl.update(v)` (the pattern from
  `examples/21_timeline_slider.html`, cf. issue #560), so scrubbing,
  pause, speed, and loop are exact.
- **Editing:** drag clips to move, drag the right edge to resize, inspector
  for name/offset/duration/easing/target values, duplicate/delete, add
  tween / nested timeline / label at the playhead.
- **Code ↔ timeline (two-way binding, cf. timeline-css)**: the code box is
  editable — Apply (Ctrl/Cmd+Enter) parses it back into tracks, while
  track edits rewrite the code. Only the generated statement shapes (one
  per line; trailing `// name` comments label tracks) are accepted;
  invalid code stops playback and shows the error. The code (not a model
  dump) is what persists to `localStorage`. Highlighting via an editable
  overlay (transparent textarea over highlighted HTML); autocomplete for
  `Tween`/`Timeline`/`Easing` (Tab/Enter accept, Up/Down cycle, Esc closes).
- **Live stage**: a preview box driven by the same timeline being edited.

## Layout

- `index.html` — page shell, import map (`@tweenjs/tween.js` → `../dist`).
- `src/model.js` — pure: clips, labels, time↔px, CRUD, codegen + code parser.
- `src/app.js` — DOM wiring: transport, tracks, inspector, persistence.
- `src/styles.css` — dark track-editor theme.
- `test/smoke.mjs` — model tests: `node test/smoke.mjs`.

## Scope notes

- The GUI keeps its own model and builds a `Timeline` from it; no core
  library changes were needed (first version deliberately avoids a
  `Timeline.getEntries()` introspection API).
- Nested editing is one level deep in the UI; the model/codegen support
  arbitrary nesting for the future.
