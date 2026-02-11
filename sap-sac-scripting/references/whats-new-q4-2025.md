# What's New in SAC Scripting - Q4 2025 (2025.21)

Complete overview of new scripting features in SAP Analytics Cloud Q4 2025 release.

**Release**: Q4 2025 (Version 2025.21)
**Release Date**: December 2025
**Documentation**: https://help.sap.com/docs/SAP_ANALYTICS_CLOUD/00f68c2e08b941f081002fd3691d86a7/c96a267c5da04fff90bb55313ee9f77c.html

---

## Major Scripting Enhancements

### 1. Chart Variance Script APIs

Story developers can now use script APIs to add, remove, update, or get variances of charts in the optimized story experience.

**New Methods**:
```javascript
// Get current variances
var variances = Chart_1.getVariances();

// Add a variance
Chart_1.addVariance({
    referenceMeasure: "Actual",
    comparisonMeasure: "Budget",
    varianceType: VarianceType.Absolute
});

// Update variance settings
Chart_1.updateVariance(varianceId, {
    showAsPercentage: true,
    position: VariancePosition.Right
});

// Remove a variance
Chart_1.removeVariance(varianceId);
```

**Use Cases**:
- Dynamic variance display based on user selection
- Toggle between absolute and percentage variance
- Conditional variance visibility

### 2. Data Actions Enhancements

**Automatic Dimension Mapping**:
Data actions now support automatic dimension mapping for cross-model copy operations.

```javascript
var dataAction = DataAction_Copy;

// Dimension mapping handled automatically
dataAction.setParameterValue("SourceModel", "Model_A");
dataAction.setParameterValue("TargetModel", "Model_B");
dataAction.execute();
```

**Input Control Binding**:
Bind input controls directly to data action parameters.

```javascript
// Bind dropdown to data action parameter
DataAction_1.bindParameterToInputControl("Period", Dropdown_Period);

// Execute with bound values
DataAction_1.execute();
```

### 4. Time Series Forecast API (Enhanced)

Additional forecasting controls for programmatic time series analysis.

```javascript
// Configure forecast
Chart_1.setTimeSeriesForecastOptions({
    forecastPeriods: 4,
    confidenceLevel: 0.95,
    algorithm: ForecastAlgorithm.AutoML
});

// Get forecast results
var forecastData = Chart_1.getTimeSeriesForecastResults();
```

### 5. Comments API Enhancements

Extended comment management capabilities.

```javascript
// Get comments on a widget
var comments = Chart_1.getComments();

// Add a new comment
Chart_1.addComment({
    text: "Review Q4 numbers",
    priority: CommentPriority.High
});

// Table cell comments
Table_1.addCellComment(rowIndex, columnIndex, "Needs verification");
```

---

## Analytics Designer Updates

### New Widget Events

**onVarianceChange**:
Fires when chart variance configuration changes.

```javascript
// In Chart onVarianceChange event
var newVariance = event.getVariance();
console.log("Variance updated:", newVariance.type);
```

**onForecastComplete**:
Fires when time series forecast calculation completes.

```javascript
// In Chart onForecastComplete event
var results = event.getForecastResults();
Text_Status.setText("Forecast complete: " + results.periods + " periods");
```

### Enhanced Export APIs

**PDF Export with Variance**:
```javascript
Application.exportToPDF({
    includeVariance: true,
    varianceFormat: "absolute_and_percentage"
});
```

**PowerPoint with Forecast**:
```javascript
Application.exportToPPT({
    includeForecast: true,
    forecastHighlight: true
});
```

---

## Optimized Story Experience Updates

### Script Variables Persistence

Script variables can now persist across page navigation within a story.

```javascript
// Set persistent variable
Application.setVariable("selectedRegion", "EMEA", {persist: true});

// Retrieve on another page
var region = Application.getVariable("selectedRegion");
```

### Enhanced Input Control APIs

**Multi-Select Handling**:
```javascript
// Get all selected values
var selectedKeys = MultiSelect_1.getSelectedKeys();
var selectedTexts = MultiSelect_1.getSelectedTexts();

// Set multiple selections
MultiSelect_1.setSelectedKeys(["US", "UK", "DE"]);
```

---

## Performance Improvements

### Optimized getResultSet()

The `getResultSet()` method now supports additional filtering options for better performance.

```javascript
var resultSet = ds.getResultSet({
    dimensions: ["Location", "Product"],
    measures: ["Revenue"],
    limit: 1000
});
```

### Lazy Loading for Large Datasets

```javascript
// Enable lazy loading for tables
Table_1.setLazyLoadingEnabled(true);
Table_1.setPageSize(50);
```

---

## Breaking Changes and Deprecations

### Deprecated APIs

| Deprecated | Replacement | Remove Version |
|------------|-------------|----------------|
| `getData()` without options | `getResultSet()` | 2026.Q2 |
| `getMembers()` without accessMode | Specify accessMode | 2026.Q2 |

### Behavior Changes

1. **Default Refresh Behavior**: Multiple filter operations now auto-batch by default
2. **Error Handling**: Planning operations throw typed exceptions
3. **Console Logging**: Production mode suppresses console.log by default

---

## Migration Guide

### From Previous Versions

1. **Update API Calls**:
   ```javascript
   // Old
   var members = ds.getMembers("Dim");

   // New (recommended)
   var members = ds.getMembers("Dim", {accessMode: MemberAccessMode.BookedValues});
   ```

2. **Use New Variance APIs**:
   ```javascript
   // Replace manual variance calculation with built-in APIs
   Chart_1.addVariance({...});
   ```

3. **Update Error Handling**:
   ```javascript
   try {
       planning.publish();
   } catch (e) {
       if (e instanceof PlanningVersionError) {
           // Handle version conflict
       }
   }
   ```

---

## Related Resources

- **Chart Variance APIs**: `references/chart-variance-apis.md`
- **Data Actions**: `references/data-actions-enhancements.md`
- **Previous Release**: `references/whats-new-2025.23.md`

---

**Last Updated**: 2025-12-27
**SAC Version**: Q4 2025 (2025.21)
**API Reference Version**: 2025.19
