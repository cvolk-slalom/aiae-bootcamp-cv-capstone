# Workflow: Record a Decision

Trigger: you're about to choose a framework, library, pattern, data shape, convention, or anything that future work will inherit.

## Steps
1. Open [.ai/decisions/README.md](../decisions/README.md). Get the next ADR number.
2. Copy [.ai/decisions/template.md](../decisions/template.md) → `NNNN-kebab-title.md`.
3. Fill in: Context (why now), Decision (what), Alternatives (≥ 2, with one-line rejection reasons), Consequences.
4. Set status `Accepted` (or `Proposed` if you need user sign-off first).
5. Add the row to the ADR index table in `README.md`.
6. Update any affected `.ai/context/` files in the same change (architecture.md, silo file, glossary).
7. Proceed with the work.

## Tips
- **Cheap decisions still get an ADR.** They're a few lines. The value is the trail.
- **Superseding > editing.** If a decision changes later, write a new ADR that supersedes the old one; mark the old one `Superseded by ADR-XXXX`.
