# Planning Model Basics (SAC 2025.23)

Sources: 003-about-planning.md, 004-planning-model-data.md, 005-enter-planning-data-tables.md, 006-planning-panel.md, 009-create-dimension-members.md.

## Required dimensions
- **Version** (mandatory) and **Date** (mandatory).
- **Account** recommended for measures; include hierarchy and sign rules.
- Add business dimensions (Org, Product, etc.) with hierarchies for planning grain.

## Model data setup
- Fact data stored at leaf members; avoid booking to non-leaf (causes action errors).
- Use data foundation to define measures, currency/unit settings, and validation rules.
- Enable data access control where needed for write permissions.

## Planning panel essentials (stories)
- Enable planning on tables; choose version (public/private/edit mode).
- Spreading/distribution from the Planning panel for quick allocations.
- Data locking status visible; submit data after entry.

## Entering data
- Editable cells depend on model rights + locks + version mode.
- Use mass data entry/spreading; undo available before submit.

## Master data maintenance
- Create/update/delete members via PlanningModel API or modeler; ensure IDs unique and hierarchies updated.

## Good practices
- Define clear leaf level for booking; reserve aggregated nodes for read only.
- Keep dimensions consistent across models to simplify cross-model copy and parameters.
- Test write-back with small scope before broad rollout.
