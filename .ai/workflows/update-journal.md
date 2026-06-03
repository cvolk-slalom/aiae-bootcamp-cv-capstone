# Workflow: Update Journal

Trigger: end of a meaningful work session (feature done, decision made, significant exploration, or user signals wrap-up).

## Steps
1. Open `.ai/journal/`. Create or append to today's file: `YYYY-MM-DD.md`.
2. Append a section using the format below. **Be terse — 5–15 lines.**

```
## HH:MM — <one-line summary>

**Did:** what changed (bullet list, file/dir level)
**Why:** the driver (link to brief / ADR / user ask)
**Decisions:** links to any new ADRs (or "none")
**Next:** the obvious next step, if any
```

3. If multiple sessions land in one day, append; don't replace.

## Don't
- Don't restate code diffs — git has those.
- Don't write prose paragraphs. Bullets only.
- Don't create a journal entry for trivial changes (typos, formatting).
