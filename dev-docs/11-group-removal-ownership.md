## Preserve ownership when removing a moved child

After a child moves from group A to group B, a late `A.remove(child)` call
must not clear its reference to B. Previously that call left the child in
B's registry without its owner reference: `Tween.remove()` became a no-op,
and adding the child to a third group left it registered in both groups.

`Group.remove()` now clears `_group` only when it points to that group. It
still removes the child from both of its own registries, including children
added during an update.

Regression tests cover `Tween.remove()` after stale cleanup and a subsequent
transfer for both supported child types, `Tween` and `Timeline`.

✅ Implemented
