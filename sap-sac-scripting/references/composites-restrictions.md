# Composites Restrictions (2025.23)

Source: `help-portal-2249cc4e678e4f46ace92501320f5ef6.md` (Restrictions in Composites).

## File Repository
- Cannot schedule publication or publish to catalog.
- Not shown in Catalog/Favorites/Shared With Me tabs.

## Composite Editor – unsupported
- View mode, multiple pages, page styling, popups, technical objects, export, bookmark.
- Link dimensions/linked models, chart scaling, input task, smart discovery, data analyzer.
- Layouts panel, theme, CSS editor, rename account/measure/dimension.
- Calculation/account/dimension input controls, save as template, publish to catalog.
- Toolbar customization, global settings, copy to, auto refresh, performance tools, loading optimization, filter panel, device preview, commenting.

## Composite Editor – partial
- Widgets: limited set available.
- Linked analysis: only “Only This Widget” or “Only Selected Widgets”.
- Thresholds: adding to tables not supported.
- Edit prompts: auto-open prompt option unavailable.
- Dynamic text sources limited; cannot use input controls, story filters, model variables, page number.
- Hyperlink: cannot link to specific story page.
- Dropdown/checkbox/radio/input: only manual input; write-back unavailable.
- Scripting: widget APIs supported; global APIs only partially.
- Page styling: ID, title, canvas size, page layout unavailable.
- `onInitialization` event: not supported.

## Optimized Story Experience – unsupported
- Linked widgets diagram; video data story.
- Copy/paste composites or pages with composites.
- Save As in view mode.

## Optimized Story Experience – partial
- Chart color: palette retained only when no dimension/account in Color section.
- Export/bookmark: only the composite as a whole, not individual widgets.
- Commenting: supported on individual widgets in view mode only.
- Linked analysis: composites can only be targets for “All Widgets in Story/Page” or “Only Selected Widgets”.

## Implementation notes
- Scripting support limited to widget APIs; many advanced features absent.
- Export works at composite level only.

