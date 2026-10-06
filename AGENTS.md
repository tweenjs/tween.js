# AGENTS.md — Instructions for AI coding agents

## Start here

Always read [`NOTES.md`](NOTES.md) first — it records architectural decisions,
standing conventions, and implementation notes. It is the authoritative map of
this codebase.

## Documentation practices

- New implementation notes for specific changes, bug investigations, or design
  decisions go into `dev-docs/` as numbered documents (`01-…`, `02-…`, etc.).
- Each `dev-docs/` document ends with its current status (`✅ Implemented`,
  `🚧 In progress`, etc.).
- Update [`NOTES.md`](NOTES.md) to link new dev-docs entries and to record
  standing rules that outlive any single change.
