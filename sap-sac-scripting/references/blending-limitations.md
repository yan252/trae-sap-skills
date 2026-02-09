# Blending Limitations (2025.23)

Source: `help-portal-77eb1188969e4e0ea7dfe92b73e67ee2.md` (Blend Data in Analytic Applications).

## General restrictions
- All story restrictions also apply to analytic applications.
- Analytics Designer specifics: filter line, data point comment, navigation panel not supported.

## Scripting considerations
- APIs/value help only operate on the **primary** model of blended charts/tables.
- Dimension/measure member IDs include modelId in blended scenarios.
- Calculated measures use UUID (no modelId); value help for blended charts returns no modelId.
- Log chart/table selections in console to capture full IDs.

## Unsupported APIs for blending
- **Planning APIs**: all.
- **Navigation panel APIs**: all.
- **Comment APIs**: all.
- **Data explorer APIs**: all.
- **Filter APIs**: `Chart.getDataSource().setDimensionFilter()`, `.removeDimensionFilter()`, `DataSource.copyDimensionFilterFrom()`, `DataSource.copyVariableValueFrom()`.
- **Table APIs**: `Table.sortByMember()`, `sortByValue()`, `removeSorting()`, `rankBy()`, `removeRanking()`, `setBreakGroupingEnabled()`.

## Implementation notes
- Always confirm dimension IDs when reusing API outputs.
- Test carefully—many operations are unsupported in blended mode.

