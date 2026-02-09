# Data Actions Enhancements - Q4 2025

New data action scripting capabilities in SAC Q4 2025 (2025.21).

---

## Overview

Q4 2025 brings significant enhancements to data action scripting, including automatic dimension mapping for cross-model operations and input control binding.

---

## Automatic Dimension Mapping

### Cross-Model Copy with Auto-Mapping

Data actions now automatically map dimensions when copying between models with similar structures.

```javascript
var dataAction = DataAction_CrossModelCopy;

// Set source and target models
dataAction.setParameterValue("SourceModel", "Model_Budget_2024");
dataAction.setParameterValue("TargetModel", "Model_Budget_2025");

// Dimensions are automatically mapped by:
// 1. Technical name match
// 2. Description match
// 3. Configured mappings

dataAction.execute().then(function(result) {
    if (result.success) {
        console.log("Copied records:", result.recordCount);
        console.log("Mapped dimensions:", result.mappedDimensions);
    }
});
```

### Configure Manual Mappings

Override automatic mapping for specific dimensions:

```javascript
var dataAction = DataAction_Copy;

// Set explicit dimension mapping
dataAction.setDimensionMapping("SOURCE_PRODUCT", "TARGET_PRODUCT_NEW");
dataAction.setDimensionMapping("SOURCE_REGION", "TARGET_GEOGRAPHY");

// Execute with custom mappings
dataAction.execute();
```

### Get Mapping Preview

Preview dimension mappings before execution:

```javascript
var dataAction = DataAction_Copy;

var mappingPreview = dataAction.getDimensionMappingPreview();

mappingPreview.forEach(function(mapping) {
    console.log(
        mapping.sourceDimension,
        "->",
        mapping.targetDimension,
        "(",
        mapping.matchType, // "exact", "description", "manual", "unmapped"
        ")"
    );
});

// Check for unmapped dimensions
var unmapped = mappingPreview.filter(function(m) {
    return m.matchType === "unmapped";
});

if (unmapped.length > 0) {
    Application.showMessage(
        ApplicationMessageType.Warning,
        "Unmapped dimensions: " + unmapped.map(function(m) {
            return m.sourceDimension;
        }).join(", ")
    );
}
```

---

## Input Control Binding

### Bind Input Controls to Parameters

Directly bind input controls to data action parameters for dynamic execution.

```javascript
var dataAction = DataAction_Allocate;

// Bind dropdowns to parameters
dataAction.bindParameterToInputControl("Period", Dropdown_Period);
dataAction.bindParameterToInputControl("Version", Dropdown_Version);
dataAction.bindParameterToInputControl("CostCenter", MultiSelect_CostCenter);

// Execute - parameter values taken from bound controls
dataAction.execute().then(function(result) {
    if (result.success) {
        Table_1.getDataSource().refreshData();
    }
});
```

### Get Bound Values

Retrieve current values from bound controls:

```javascript
var dataAction = DataAction_Process;

// Check bound parameter values before execution
var boundValues = dataAction.getBoundParameterValues();

console.log("Period:", boundValues["Period"]);
console.log("Version:", boundValues["Version"]);

// Validate before execution
if (!boundValues["Period"]) {
    Application.showMessage(
        ApplicationMessageType.Warning,
        "Please select a period"
    );
    return;
}

dataAction.execute();
```

### Clear Bindings

Remove input control bindings:

```javascript
// Remove specific binding
dataAction.unbindParameter("Period");

// Remove all bindings
dataAction.unbindAllParameters();
```

---

## Enhanced Execution Options

### Execution with Callback

```javascript
var dataAction = DataAction_Calculate;

dataAction.execute({
    async: true,
    showProgress: true,
    progressMessage: "Calculating allocations..."
}).then(function(result) {
    Application.showMessage(
        ApplicationMessageType.Success,
        "Completed: " + result.recordsProcessed + " records"
    );
}).catch(function(error) {
    Application.showMessage(
        ApplicationMessageType.Error,
        "Failed: " + error.message
    );
});
```

### Batch Execution

Execute multiple data actions in sequence:

```javascript
async function runDataActionSequence() {
    Application.showBusyIndicator("Running data actions...");

    try {
        // Step 1: Clear existing data
        await DataAction_Clear.execute();

        // Step 2: Copy from source
        await DataAction_Copy.execute();

        // Step 3: Calculate allocations
        await DataAction_Allocate.execute();

        // Step 4: Aggregate results
        await DataAction_Aggregate.execute();

        Application.showMessage(
            ApplicationMessageType.Success,
            "All data actions completed successfully"
        );

        // Refresh all data sources
        Table_1.getDataSource().refreshData();
        Chart_1.getDataSource().refreshData();

    } catch (error) {
        Application.showMessage(
            ApplicationMessageType.Error,
            "Data action failed: " + error.message
        );
    } finally {
        Application.hideBusyIndicator();
    }
}
```

### Conditional Execution

```javascript
var dataAction = DataAction_Adjust;

// Set conditional execution
dataAction.setExecutionCondition({
    dimension: "Status",
    operator: "equals",
    value: "Draft"
});

// Only executes for records where Status = Draft
dataAction.execute();
```

---

## Parameter Types

### Supported Input Control Types

| Parameter Type | Compatible Controls |
|---------------|---------------------|
| Single Value | Dropdown, RadioButtonGroup |
| Multiple Values | MultiSelect, CheckboxGroup |
| Range | RangeSlider, DateRange |
| Hierarchy | HierarchyDropdown |

### Type Conversion

```javascript
// Automatic type conversion for parameters
dataAction.setParameterValue("Amount", "1000"); // String to number
dataAction.setParameterValue("Date", new Date()); // Date object
dataAction.setParameterValue("Flag", true); // Boolean
```

---

## Error Handling

### Typed Exceptions

```javascript
try {
    await dataAction.execute();
} catch (e) {
    if (e instanceof DataActionValidationError) {
        // Parameter validation failed
        console.log("Invalid parameters:", e.invalidParameters);
    } else if (e instanceof DataActionExecutionError) {
        // Execution failed
        console.log("Failed at step:", e.failedStep);
        console.log("Error details:", e.details);
    } else if (e instanceof DataActionTimeoutError) {
        // Execution timed out
        console.log("Timeout after:", e.elapsedTime, "ms");
    }
}
```

### Rollback on Failure

```javascript
var dataAction = DataAction_Complex;

dataAction.execute({
    transactional: true, // Enable rollback on failure
    rollbackOnError: true
}).catch(function(error) {
    Application.showMessage(
        ApplicationMessageType.Info,
        "Changes rolled back due to error"
    );
});
```

---

## Best Practices

1. **Preview Mappings**: Always check `getDimensionMappingPreview()` for cross-model copies
2. **Validate Bindings**: Check bound values before execution
3. **Use Async**: Execute long-running data actions asynchronously
4. **Show Progress**: Provide user feedback during execution
5. **Handle Errors**: Implement comprehensive error handling
6. **Refresh After**: Always refresh affected data sources after execution

---

**Version**: Q4 2025 (2025.21)
**Last Updated**: 2025-12-27
