# Advanced Formulas (SAC 2025.23)

Purpose: scripted calculations in data actions; choose visual editor for simple flows or script editor for full control.

## Authoring modes
- **Visual**: guided blocks for scopes, loops, assignments (027-advanced-formulas-scripts.md, 028-advanced-formulas-visual.md).
- **Script**: free-form syntax; full reference in 029-advanced-formulas-script-reference.md.

## Common patterns
- RESULTLOOKUP for driver retrieval; MEMBERSET for scoped loops; FOREACH for dimension iteration; IF/ENDIF for branching; DATA() for writes.
- Time offsets: use OFFSET on Date; handle week/month/year granularity explicitly.
- Exception aggregation: avoid mixing calculated members in copy rules where not supported.

## Performance tips
- Narrow MEMBERSET scopes (time/version/org) before calculations.
- Use temporary variables; minimize writes inside loops.
- Prefer APPEND vs OVERWRITE intentionally; chunk large periods.

## Testing
- Validate on small slice; check job monitor for syntax/validation errors.

Sources: 027, 028, 029 advanced-formulas docs (SAC Help 2025.23).
