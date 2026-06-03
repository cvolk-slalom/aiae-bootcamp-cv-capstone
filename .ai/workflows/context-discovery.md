# Workflow: Context Discovery

Use before writing code in an unfamiliar area, or when picking up a task cold.

## Token-cheap order (stop as soon as you have enough)

1. **Read [AGENTS.md](../../AGENTS.md)** if you haven't this session.
2. **Read the relevant silo file(s)** from `.ai/context/silos/`. That's it for orientation — do not load other silos.
3. **Skim [.ai/decisions/README.md](../decisions/README.md)** for recently-relevant ADR titles. Open only the ADRs that touch your silo or the decision you're about to repeat.
4. **Check [.ai/requirements/backlog.md](../requirements/backlog.md)** for status of related items; open the matching brief if one exists.
5. **Search code** (`grep_search`, `file_search`, `semantic_search`) — scoped to the silo path. Prefer exact matches; semantic search last.
6. **Skim the last 1–2 journal entries** if recent work overlaps your area.

## Stop conditions
- You can name the file(s) you'll edit and the pattern to follow → stop searching.
- Overlapping hits across two queries → stop searching.

## If context is missing
- Add it. Update the silo file, write an ADR, or append to the glossary in the same change. Don't leave the next agent guessing.
