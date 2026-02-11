# Explorer & Smart Insights (2025.23)

Source: `help-portal-a7bd9775a97748d685464b2ef58bce21.md` (Work with Explorer and Smart Insights).

## Launch Explorer
- Manual: Save/run app → select chart/table → More Actions → Open Explorer.
- Script API: launch via script; can add extra dimensions/measures to exploration scope.

## Explorer features
- Change dimensions/measures, chart types; show/hide elements.
- Table sorting; export data to file.
- “Open in New Story” (enable in widget styling quick menus).

## Apply explorer results
1. Create **Data Explorer Configuration** technical object (Outline → Scripting).
2. Add custom menu items in Menu Settings.
3. Implement `onMenuItemSelect()` script.
4. Users pick custom menu items in explorer visualization area.

## Saving results
- Bookmark the application.
- Publish to PDF.

## Smart Insights (requires Explorer enabled)
1. Select a data point (chart) or cell (table).
2. Choose **Smart Insights** in context menu.
3. Insights include correlations, exceptions, clusters, links, predictions.
4. Continue exploration or create story (if Open in New Story enabled).

## Implementation notes
- Smart Insights depends on Explorer being enabled.
- Custom menu items let users apply exploration results to other widgets.

