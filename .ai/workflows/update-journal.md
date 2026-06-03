# Workflow: Update Journal

Trigger: end of a meaningful work session (feature done, decision made, significant exploration, or user signals wrap-up).

The journal isn't just a change log — it's a **record of how AI accelerated this build**. Every entry captures what changed *and* the AI-leverage angle: which scaffold piece carried the load, what would have been slower without it, what we learned to do faster next time.

## Steps
1. Open `.ai/journal/`. Create or append to today's file: `YYYY-MM-DD.md`.
2. Append a section using the format below.
3. If multiple sessions land in one day, append; don't replace.

## Format

```
## HH:MM — <one-line summary>

**Did:** what changed (bullet list, file/dir level)
**Why:** the driver (link to brief / ADR / user ask)
**AI leverage:** which parts of the AI-SDLC scaffold did the work this session
  (e.g., "silo-scoped context kept BE chat under X tokens", "ADR template short-circuited
  the design debate", "brief drove acceptance, no clarifying questions needed").
  At least one bullet. Be specific — name files/workflows used.
**Patterns / learnings:** anything to harvest into patterns/, instructions, or memory
  for next time. "none" is a valid answer.
**Decisions:** links to any new ADRs (or "none")
**Next:** the obvious next step, if any
```

## What counts as "AI leverage"
Pick whatever fits — one or two angles is plenty:
- **Context routing** — agent oriented from `AGENTS.md` + 1–2 silo files instead of a full repo crawl.
- **Requirements compression** — brief (≤ 30 lines) was enough to drive build without back-and-forth.
- **Decision short-circuit** — ADR template forced fast option capture instead of open-ended debate.
- **Self-maintaining context** — silo / architecture / glossary updated *in the same change* as the code.
- **Automation** — `scripts/ai-commit.sh`, workflows, or other repo automation removed manual steps.
- **Cold-start verification** — work was scoped so a new chat could pick it up next.
- **Anti-pattern avoided** — agent skipped a tempting tangent because a rule/pattern said no.

## Don't
- Don't restate code diffs — git has those.
- Don't write prose paragraphs. Bullets only.
- Don't create a journal entry for trivial changes (typos, formatting).
- Don't skip **AI leverage** — if you genuinely can't name any, the session probably didn't need a journal entry.
