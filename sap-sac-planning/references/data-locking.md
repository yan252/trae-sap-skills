# Data Locking (SAC 2025.23)

Purpose: protect planning data by setting lock states on model slices; integrate with multi actions and calendar tasks.

## Concepts
- **States**: Open (editable), Restricted (owner-only), Locked (no changes).
- **Scopes**: defined by driving dimensions (e.g., Version, Time, Org).
- **Owners**: users/teams with effective ownership for Restricted.

## Configuration (modeler)
- Enable data locking on planning model.
- Define default lock state and driving dimensions.
- Assign owners where needed for Restricted.

## Applying locks
- In modeler UI or Data Locking task.
- In multi action via Data Locking Step (set state per filters).
- Respect planning area: locks intersect with planning area scope during edit runs.

## Scheduling
- Use calendar Data Locking tasks to open/close periods; combine with data/multi action tasks.

## Troubleshooting
- Publish failures often due to locks; job monitor shows blocked records.
- Adjust locks or use “publish and ignore warnings” to drop blocked records.

Source: 016-data-locking-configuring.md (SAC Help 2025.23).
