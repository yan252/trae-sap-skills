# Chart Variance Script APIs

New in SAC Q4 2025 (2025.21): Script APIs for managing chart variances programmatically.

---

## Overview

Chart variance APIs allow developers to dynamically add, remove, update, and retrieve variance configurations on charts in the optimized story experience.

**Availability**: Optimized Story Experience (Q4 2025+)
**Widget Types**: Bar Chart, Column Chart, Line Chart, Combo Chart

---

## API Reference

### getVariances()

Get all configured variances on a chart.

```javascript
var variances = Chart_1.getVariances();

// Returns array of variance objects
variances.forEach(function(v) {
    console.log("Variance:", v.id, v.referenceMeasure, v.comparisonMeasure);
});
```

**Returns**: `Array<Variance>`

### addVariance(options)

Add a new variance to the chart.

```javascript
Chart_1.addVariance({
    referenceMeasure: "Actual",
    comparisonMeasure: "Budget",
    varianceType: VarianceType.Absolute,
    showLabel: true,
    position: VariancePosition.Right
});
```

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| referenceMeasure | string | Yes | Measure to compare from |
| comparisonMeasure | string | Yes | Measure to compare to |
| varianceType | VarianceType | No | Absolute, Percentage, or Both |
| showLabel | boolean | No | Show variance label |
| position | VariancePosition | No | Left, Right, Top, Bottom |
| color | string | No | Variance indicator color |

### updateVariance(varianceId, options)

Update an existing variance configuration.

```javascript
// Toggle to percentage display
Chart_1.updateVariance("var_001", {
    varianceType: VarianceType.Percentage,
    showAsPositiveGreen: true
});
```

### removeVariance(varianceId)

Remove a variance from the chart.

```javascript
Chart_1.removeVariance("var_001");
```

### removeAllVariances()

Remove all variances from the chart.

```javascript
Chart_1.removeAllVariances();
```

---

## Enumerations

### VarianceType

```javascript
VarianceType.Absolute      // Show absolute difference
VarianceType.Percentage    // Show percentage difference
VarianceType.Both          // Show both absolute and percentage
```

### VariancePosition

```javascript
VariancePosition.Left
VariancePosition.Right
VariancePosition.Top
VariancePosition.Bottom
VariancePosition.Inline    // Inline with data label
```

---

## Common Patterns

### Dynamic Variance Toggle

```javascript
// Toggle button onClick
var variances = Chart_1.getVariances();

if (variances.length > 0) {
    // Remove existing variance
    Chart_1.removeAllVariances();
    Button_Toggle.setText("Show Variance");
} else {
    // Add variance
    Chart_1.addVariance({
        referenceMeasure: "Actual",
        comparisonMeasure: "Plan",
        varianceType: VarianceType.Both
    });
    Button_Toggle.setText("Hide Variance");
}
```

### Conditional Variance Display

```javascript
// Show variance only for specific dimension members
var selections = Chart_1.getSelections();

if (selections.length > 0 && selections[0]["Category"] === "Revenue") {
    Chart_1.addVariance({
        referenceMeasure: "Current Year",
        comparisonMeasure: "Prior Year",
        varianceType: VarianceType.Percentage
    });
}
```

### Variance Based on Dropdown Selection

```javascript
// Dropdown onChange event
var selectedComparison = Dropdown_Comparison.getSelectedKey();

Chart_1.removeAllVariances();

if (selectedComparison !== "none") {
    Chart_1.addVariance({
        referenceMeasure: "Actual",
        comparisonMeasure: selectedComparison,
        varianceType: VarianceType.Absolute
    });
}
```

---

## Event: onVarianceChange

Fires when variance configuration changes.

```javascript
// In Chart_1 onVarianceChange event
var changeInfo = event.getChangeInfo();

console.log("Variance changed:", changeInfo.type); // "added", "updated", "removed"
console.log("Variance ID:", changeInfo.varianceId);

// Update status text
Text_Status.setText("Variance " + changeInfo.type);
```

---

## Export Considerations

When exporting charts with variances:

```javascript
Application.exportToPDF({
    includeVariance: true,
    varianceFormat: "inline" // or "separate_column"
});
```

---

## Best Practices

1. **Check Measures Exist**: Verify measures are available before adding variance
2. **Clear Before Adding**: Use `removeAllVariances()` before adding new ones to avoid duplicates
3. **Provide User Feedback**: Show busy indicator during variance recalculation
4. **Consider Mobile**: Test variance display on mobile devices

---

**Version**: Q4 2025 (2025.21)
**Last Updated**: 2025-12-27
