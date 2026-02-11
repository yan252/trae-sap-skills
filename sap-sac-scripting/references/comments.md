# Comments in Analytic Applications (2025.23)

Source: `help-portal-0f47c5728c484f5c86db06b43f11b1db.md` (Work with Comments in Analytic Applications).

## Supported widgets
- Chart, table, geo map, image, shape, text, RSS reader, web page, R visualization, clock.

## Runtime behavior
- Users can view/create comments on widgets or table cells for analytic and planning models.
- Comment mode toggle available in toolbar during view mode.
- Embedded apps: enable Commenting in Embedded Mode via System Administration → System Configuration.

## Script APIs (design time)
- Show/hide comments programmatically.
- Table cell comment APIs: get comments (by ID or data context), post comments, remove comments.

## Implementation notes
- Same table-cell commenting pattern as stories; scripting provides additional control.
- Works across analytic and planning models.

