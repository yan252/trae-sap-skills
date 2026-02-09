# DataSource API Reference

Complete reference for the DataSource API in SAP Analytics Cloud scripting.

**Source**: [Analytics Designer API Reference 2025.14](https://help.sap.com/doc/958d4c11261f42e992e8d01a4c0dde25/release/en-US/index.html)

---

## Table of Contents

1. [Getting DataSource Reference](#getting-datasource-reference)
2. [Information Methods](#information-methods)
3. [Dimension Methods](#dimension-methods)
4. [Measure Methods](#measure-methods)
5. [Filter Methods](#filter-methods)
6. [Variable Methods](#variable-methods)
7. [Data Access Methods](#data-access-methods)
8. [Hierarchy Methods](#hierarchy-methods)
9. [Refresh Control](#refresh-control)
10. [DataSource Types](#datasource-types)

---

## Getting DataSource Reference

DataSources cannot be referenced directly. Obtain reference via widget:

```javascript
// From Chart
var ds = Chart_1.getDataSource();

// From Table
var ds = Table_1.getDataSource();

// From GeoMap Layer
var ds = GeoMap_1.getLayer("LayerName").getDataSource();
```

Returns `undefined` if widget has no data binding.

---

## Information Methods

### getInfo()

Returns information about the data source.

```javascript
var info = ds.getInfo();
// Returns: DataSourceInfo object
// - id: string
// - description: string
// - modelId: string
// - type: DataSourceType
```

### getDataSourceInfo()

Returns detailed data source metadata.

```javascript
var dsInfo = ds.getDataSourceInfo();
```

---

## Dimension Methods

### getDimensions()

Returns all dimensions of the data source.

```javascript
var dimensions = ds.getDimensions();
// Returns: Array of DimensionInfo objects
// Each contains: { id: string, description: string }
```

**Example**:
```javascript
var dims = Chart_1.getDataSource().getDimensions();
for (var i = 0; i < dims.length; i++) {
    console.log(dims[i].id + ": " + dims[i].description);
}
```

### getMembers(dimensionId, options)

Returns members of a dimension.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| dimensionId | string | Yes | Dimension identifier |
| options | object | No | Filter options |

**Options**:
- `accessMode`: `MemberAccessMode.BookedValues` | `MemberAccessMode.All`
- `hierarchyId`: string - Specific hierarchy
- `level`: number - Hierarchy level

```javascript
// All members
var members = ds.getMembers("Location");

// Booked values only
var bookedMembers = ds.getMembers("Location", {
    accessMode: MemberAccessMode.BookedValues
});

// Specific hierarchy level
var levelMembers = ds.getMembers("Date", {
    hierarchyId: "YQM",
    level: 2
});
```

**Returns**: Array of MemberInfo objects
```javascript
{
    dimensionId: string,
    id: string,           // Full qualified ID
    description: string,
    displayId: string,    // Short ID
    properties: object    // Custom attributes
}
```

**Performance Note**: `getMembers()` always triggers backend request. Use `getResultSet()` when possible.

### getMember(dimensionId, memberId)

Returns specific member info.

```javascript
var member = ds.getMember("Location", "[Location].[Country].&[US]");
```

### getMemberDisplayMode(dimensionId)

Returns display mode for dimension (Key, Description, Text, etc.).

```javascript
var mode = ds.getMemberDisplayMode("Product");
// Returns: "Description" | "Key" | "KeyDescription" | etc.
```

---

## Measure Methods

### getMeasures()

Returns all measures of the data source.

```javascript
var measures = ds.getMeasures();
// Returns: Array of MeasureInfo objects
// dimensionId is always "@MeasureDimension"
```

**Example**:
```javascript
var measures = Chart_1.getDataSource().getMeasures();
measures.forEach(function(m) {
    console.log(m.id + ": " + m.description);
});
```

---

## Filter Methods

### setDimensionFilter(dimensionId, filterValue)

Sets filter on a dimension. Overwrites existing filter.

```javascript
// Single value
ds.setDimensionFilter("Year", "2024");

// Qualified member ID
ds.setDimensionFilter("Date", "[Date].[YQM].&[2024]");

// Multiple values (array)
ds.setDimensionFilter("Region", ["EMEA", "APAC", "AMER"]);
```

**Important**: Does not affect Advanced Filters set in designer.

### removeDimensionFilter(dimensionId)

Removes filter from dimension.

```javascript
ds.removeDimensionFilter("Year");
```

### getDimensionFilters(dimensionId)

Returns current filters on a dimension.

```javascript
var filters = ds.getDimensionFilters("Year");
// Returns: Array of FilterInfo objects
// { value: string, type: "Single" | "Range" | "Multiple" }
```

**Example**:
```javascript
var yearFilter = ds.getDimensionFilters("Year")[0];
console.log(yearFilter);
// { value: '[Date].[YQM].&[2024]', type: 'Single' }
```

### copyDimensionFilterFrom(sourceDataSource, dimensionId?)

Copies filters from another data source.

```javascript
// Copy all filters
Table_1.getDataSource().copyDimensionFilterFrom(Chart_1.getDataSource());

// Copy specific dimension filter
Table_1.getDataSource().copyDimensionFilterFrom(
    Chart_1.getDataSource(),
    "Location"
);
```

**Performance Tip**: More efficient than setting filters individually.

### clearAllFilters()

Removes all dimension filters.

```javascript
ds.clearAllFilters();
```

---

## Variable Methods

### getVariables()

Returns all variables of the data source.

```javascript
var variables = ds.getVariables();
// Returns: Array of VariableInfo objects
```

### getVariableValues(variableId)

Returns values of a variable.

```javascript
var values = ds.getVariableValues("VAR_YEAR");
// Returns: Array of VariableValue objects
```

### setVariableValue(variableId, value)

Sets value of a variable.

```javascript
ds.setVariableValue("VAR_YEAR", "2024");
```

---

## Data Access Methods

### getData(selection)

Returns data values for a specific selection.

```javascript
var selection = {
    "@MeasureDimension": "[Account].[parentId].&[Revenue]",
    "Location": "[Location].[Country].&[US]"
};

var data = ds.getData(selection);
// Returns: { formattedValue: string, rawValue: number }
```

**Example**:
```javascript
var data = Chart_1.getDataSource().getData({
    "@MeasureDimension": "[Account].[parentId].&[Quantity_sold]",
    "Location": "[Location].[State].&[CA]"
});
console.log("Formatted:", data.formattedValue);
console.log("Raw:", data.rawValue);
```

### getResultSet()

Returns current result set without backend trip.

```javascript
var resultSet = ds.getResultSet();
```

**Performance**: Significantly faster than `getMembers()`. Use when possible.

### getResultMember(dimensionId, selection)

Returns member details from result set.

```javascript
var member = ds.getResultMember("Location", selection);
// Includes parent relationship info
```

### getDataSelections()

Returns current data selections as key-value pairs.

```javascript
var selections = ds.getDataSelections();
// Returns: Object mapping dimension IDs to member IDs
```

---

## Hierarchy Methods

### getHierarchies(dimensionId)

Returns hierarchies for a dimension.

```javascript
var hierarchies = ds.getHierarchies("Date");
// Returns: Array of { id: string, description: string }
```

### collapseNode(dimensionId, selection)

Collapses hierarchy node.

```javascript
ds.collapseNode("Date", {
    "@MeasureDimension": "[Account].[Revenue]",
    "Date": "[Date].[YQM].&[2024]"
});
```

### expandNode(dimensionId, selection)

Expands hierarchy node.

```javascript
ds.expandNode("Date", selection);
```

---

## Refresh Control

### refreshData()

Refreshes data from backend.

```javascript
ds.refreshData();
```

### setRefreshPaused(paused)

Pauses or resumes automatic refresh.

```javascript
// Pause before multiple operations
ds.setRefreshPaused(true);

// Apply multiple changes
ds.setDimensionFilter("Year", "2024");
ds.setDimensionFilter("Region", "EMEA");
ds.setDimensionFilter("Product", "Widget");

// Resume (single backend call)
ds.setRefreshPaused(false);
```

**Best Practice**: Always use for batch filter operations.

### isRefreshPaused()

Returns current pause state.

```javascript
if (ds.isRefreshPaused()) {
    console.log("Refresh is paused");
}
```

---

## DataSource Types

### DataSourceType Enumeration

```javascript
DataSourceType.Model        // SAC model
DataSourceType.Query        // Live query
DataSourceType.Calculation  // Calculated source
```

### MemberAccessMode Enumeration

```javascript
MemberAccessMode.All          // All master data members
MemberAccessMode.BookedValues // Only members with data
```

---

## Complete Example

```javascript
// Complex filtering scenario
function applyComplexFilters(chartDs, tableDs, year, region, product) {
    // Pause both data sources
    chartDs.setRefreshPaused(true);
    tableDs.setRefreshPaused(true);

    try {
        // Apply filters to chart
        chartDs.setDimensionFilter("Year", year);
        chartDs.setDimensionFilter("Region", region);
        chartDs.setDimensionFilter("Product", product);

        // Copy filters to table
        tableDs.copyDimensionFilterFrom(chartDs);

    } catch (error) {
        console.log("Error applying filters:", error);
    }

    // Resume both (triggers single refresh each)
    chartDs.setRefreshPaused(false);
    tableDs.setRefreshPaused(false);
}

// Usage
var chartDs = Chart_1.getDataSource();
var tableDs = Table_1.getDataSource();
applyComplexFilters(chartDs, tableDs, "2024", "EMEA", "Widget-A");
```

---

## Related Documentation

- [Widgets API](api-widgets.md)
- [Planning API](api-planning.md)
- [Application API](api-application.md)

**Official Reference**: [https://help.sap.com/doc/958d4c11261f42e992e8d01a4c0dde25/release/en-US/index.html](https://help.sap.com/doc/958d4c11261f42e992e8d01a4c0dde25/release/en-US/index.html)
