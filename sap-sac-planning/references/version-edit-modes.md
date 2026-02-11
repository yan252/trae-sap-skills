# Version Edit Modes & Publishing (SAC 2025.23)

## Modes
- **Public version (view)**: read-only until edit started.
- **Edit Mode (planning area)**: creates a temporary private copy scoped to planning area; locks same scope for others.
- **Private versions**: user-only until shared/published; good for simulations.

## Running actions on versions
- Data/multi actions on public versions run only inside the planning area (or recommended planning area if enabled) when edit mode is active.
- To affect full public data, publish first or widen planning area before run.
- Background runs still obey planning area scope.

## Publishing options (multi action or manual)
- **Publish and fail on warnings**: stops if locks/restrictions encountered.
- **Publish and ignore warnings**: publishes allowed data; drops blocked records.
- **Publish As**: create new public version from private.

## Good practice
- Use private versions for what-if; publish only after validation.
- Coordinate planning area scope with scheduled actions to avoid partial updates.

Related: `references/multi-actions.md` (publish steps) and `references/data-actions.md` (write modes).
