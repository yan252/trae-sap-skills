# Planning API Reference

Complete reference for planning operations in SAP Analytics Cloud scripting.

**Source**: [Analytics Designer API Reference 2025.14](https://help.sap.com/doc/958d4c11261f42e992e8d01a4c0dde25/release/en-US/index.html)

---

## Table of Contents

1. [Getting Planning Reference](#getting-planning-reference)
2. [Version Management](#version-management)
3. [Data Operations](#data-operations)
4. [Data Locking](#data-locking)
5. [Data Actions](#data-actions)
6. [Multi-Actions](#multi-actions)
7. [Planning Enumerations](#planning-enumerations)
8. [Complete Examples](#complete-examples)

---

## Getting Planning Reference

Access Planning API via Table widget:

```javascript
var planning = Table_1.getPlanning();
```

**Note**: Planning features require a planning-enabled model connected to the table.

---

## Version Management

### Public Versions

#### getPublicVersion(versionId)

Returns a public version object.

```javascript
var budgetVersion = Table_1.getPlanning().getPublicVersion("Budget2024");
```

#### getPublicVersions()

Returns all public versions.

```javascript
var allPublicVersions = Table_1.getPlanning().getPublicVersions();
```

### Private Versions

#### getPrivateVersion(versionId)

Returns a private version object.

```javascript
var draftVersion = Table_1.getPlanning().getPrivateVersion("myDraft");
```

#### getPrivateVersions()

Returns all private versions.

```javascript
var allPrivateVersions = Table_1.getPlanning().getPrivateVersions();
```

#### createPrivateVersion(versionId, options)

Creates a new private version.

```javascript
var newDraft = Table_1.getPlanning()
    .createPrivateVersion("Draft_" + Date.now().toString());
```

### Version Object Methods

#### isDirty()

Checks if version has unsaved changes.

```javascript
var version = Table_1.getPlanning().getPublicVersion("Budget2024");
if (version.isDirty()) {
    console.log("Version has unsaved changes");
}
```

#### publish()

Publishes changes to the version.

```javascript
var version = Table_1.getPlanning().getPublicVersion("Budget2024");
if (version) {
    if (version.isDirty()) {
        version.publish();
    }
}
```

#### copy(targetVersionId, copyOption, category?)

Copies version to a new version.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| targetVersionId | string | Yes | Name for new version |
| copyOption | PlanningCopyOption | Yes | What to copy |
| category | PlanningCategory | No | Version category |

```javascript
// Copy public version to new private version
var budgetVersion = Table_1.getPlanning().getPublicVersion("Budget2024");
if (budgetVersion) {
    budgetVersion.copy(
        "Budget_Copy_" + Date.now().toString(),
        PlanningCopyOption.PlanningArea
    );
}

// Copy with category
var sourceVersion = Table_1.getPlanning().getPrivateVersion("Source");
if (sourceVersion) {
    sourceVersion.copy(
        "TargetVersion",
        PlanningCopyOption.AllData,
        PlanningCategory.Budget
    );
}

// Copy as Forecast
var forecastSource = Table_1.getPlanning().getPrivateVersion("ForecastDraft");
if (forecastSource) {
    forecastSource.copy(
        "Forecast_" + Date.now().toString(),
        PlanningCopyOption.PlanningArea,
        PlanningCategory.Forecast
    );
}
```

#### revert()

Reverts unsaved changes in the version.

```javascript
var version = Table_1.getPlanning().getPublicVersion("Budget2024");
version.revert();
```

#### delete()

Deletes a private version.

```javascript
var draft = Table_1.getPlanning().getPrivateVersion("OldDraft");
if (draft) {
    draft.delete();
}
```

---

## Data Operations

### submitData()

Submits pending data changes.

```javascript
Table_1.getPlanning().submitData();
```

### getPlanningArea()

Returns planning area configuration.

```javascript
var planningArea = Table_1.getPlanning().getPlanningArea();
```

---

## Data Locking

### getDataLocking()

Returns data locking interface.

```javascript
var dataLocking = Table_1.getPlanning().getDataLocking();
```

### getState(selection)

Returns lock state for a selection.

```javascript
var selection = Table_1.getSelections()[0];
var lockState = Table_1.getPlanning().getDataLocking().getState(selection);
```

**Lock States**:
- `Locked` - Data is locked by another user
- `Unlocked` - Data is available for editing
- `LockedByMe` - Data is locked by current user

### Example: Check Before Edit

```javascript
var selection = Table_1.getSelections()[0];
var lockState = Table_1.getPlanning().getDataLocking().getState(selection);

if (lockState === DataLockingState.Locked) {
    Application.showMessage(
        ApplicationMessageType.Warning,
        "Data is locked by another user"
    );
} else {
    // Proceed with edit
    performEdit();
}
```

---

## Data Actions

Execute predefined data actions.

### Execute Data Action

```javascript
// Simple execution
DataAction_1.execute();

// With parameters
DataAction_1.setParameterValue("YEAR", "2024");
DataAction_1.setParameterValue("VERSION", "Budget");
DataAction_1.execute();
```

### Data Action Events

```javascript
DataAction_1.onBeforeExecute = function() {
    Application.showBusyIndicator();
};

DataAction_1.onAfterExecute = function(result) {
    Application.hideBusyIndicator();
    if (result.success) {
        Application.showMessage(ApplicationMessageType.Info, "Data action completed");
    } else {
        Application.showMessage(ApplicationMessageType.Error, "Data action failed");
    }
};
```

### Background Execution

```javascript
// Execute in background
DataAction_1.executeInBackground();

// Monitor status
DataAction_1.onExecutionStatusUpdate = function(status) {
    console.log("Status:", status);
    if (status === ExecutionStatus.Completed) {
        Table_1.getDataSource().refreshData();
    }
};
```

---

## Multi-Actions

Execute multiple data actions in sequence.

### Execute Multi-Action

```javascript
MultiAction_1.execute();
```

### With Parameters

```javascript
MultiAction_1.setParameterValue("YEAR", "2024");
MultiAction_1.setParameterValue("SCENARIO", "Actual");
MultiAction_1.execute();
```

### Events

```javascript
MultiAction_1.onBeforeExecute = function() {
    Application.showBusyIndicator();
};

MultiAction_1.onAfterExecute = function(result) {
    Application.hideBusyIndicator();
    Table_1.getDataSource().refreshData();
};
```

---

## Planning Enumerations

### PlanningCopyOption

```javascript
PlanningCopyOption.AllData       // Copy all data
PlanningCopyOption.PlanningArea  // Copy planning area only
```

### PlanningCategory

```javascript
PlanningCategory.Budget          // Budget category
PlanningCategory.Forecast        // Forecast category
PlanningCategory.Actual          // Actual category
PlanningCategory.Plan            // Plan category
```

### DataLockingState

```javascript
DataLockingState.Locked          // Locked by another user
DataLockingState.Unlocked        // Available for editing
DataLockingState.LockedByMe      // Locked by current user
```

### ExecutionStatus

```javascript
ExecutionStatus.Running          // In progress
ExecutionStatus.Completed        // Successfully completed
ExecutionStatus.Failed           // Execution failed
ExecutionStatus.Cancelled        // Cancelled by user
```

---

## Complete Examples

### Example 1: Version Publishing Workflow

```javascript
// Button: Publish Budget
Button_Publish.onClick = function() {
    Application.showBusyIndicator();

    try {
        var budgetVersion = Table_1.getPlanning().getPublicVersion("Budget2024");

        if (!budgetVersion) {
            Application.showMessage(
                ApplicationMessageType.Error,
                "Budget version not found"
            );
            return;
        }

        if (!budgetVersion.isDirty()) {
            Application.showMessage(
                ApplicationMessageType.Info,
                "No changes to publish"
            );
            return;
        }

        budgetVersion.publish();
        Application.showMessage(
            ApplicationMessageType.Success,
            "Budget published successfully"
        );

    } catch (error) {
        console.log("Error:", error);
        Application.showMessage(
            ApplicationMessageType.Error,
            "Failed to publish budget"
        );
    } finally {
        Application.hideBusyIndicator();
    }
};
```

### Example 2: Create Working Copy

```javascript
// Button: Create Working Copy
Button_CreateCopy.onClick = function() {
    var sourceVersion = Table_1.getPlanning().getPublicVersion("Budget2024");

    if (sourceVersion) {
        var timestamp = Date.now().toString();
        var copyName = "WorkingCopy_" + timestamp;

        sourceVersion.copy(copyName, PlanningCopyOption.AllData);

        Application.showMessage(
            ApplicationMessageType.Info,
            "Created working copy: " + copyName
        );
    }
};
```

### Example 3: Data Action with Confirmation

```javascript
// Button: Run Allocation
Button_RunAllocation.onClick = function() {
    Popup_Confirm.open();
};

// Confirm button in popup
Button_ConfirmYes.onClick = function() {
    Popup_Confirm.close();

    Application.showBusyIndicator();

    // Set parameters from dropdown selections
    DataAction_Allocation.setParameterValue(
        "SOURCE_VERSION",
        Dropdown_SourceVersion.getSelectedKey()
    );
    DataAction_Allocation.setParameterValue(
        "TARGET_VERSION",
        Dropdown_TargetVersion.getSelectedKey()
    );
    DataAction_Allocation.setParameterValue(
        "YEAR",
        Dropdown_Year.getSelectedKey()
    );

    DataAction_Allocation.execute();
};

DataAction_Allocation.onAfterExecute = function(result) {
    Application.hideBusyIndicator();

    if (result.success) {
        // Refresh data
        Table_1.getDataSource().refreshData();
        Application.showMessage(
            ApplicationMessageType.Success,
            "Allocation completed successfully"
        );
    } else {
        Application.showMessage(
            ApplicationMessageType.Error,
            "Allocation failed: " + result.message
        );
    }
};
```

### Example 4: Find Active Planning Cycle

```javascript
// Find active planning cycle from attribute
function findActivePlanningCycle() {
    var allCycles = PlanningModel_1.getMembers("PlanningCycle");
    var activeCycle = null;

    for (var i = 0; i < allCycles.length; i++) {
        if (allCycles[i].properties.IsActive === "X") {
            activeCycle = allCycles[i].id;
            break;
        }
    }

    return activeCycle;
}

// Use in initialization or filter setup
var activeCycle = findActivePlanningCycle();
if (activeCycle) {
    Table_1.getDataSource().setDimensionFilter(
        "PlanningCycle",
        activeCycle
    );
}
```

### Example 5: Revert Changes

```javascript
// Button: Discard Changes
Button_Revert.onClick = function() {
    var version = Table_1.getPlanning().getPublicVersion("Budget2024");

    if (version && version.isDirty()) {
        version.revert();
        Table_1.getDataSource().refreshData();
        Application.showMessage(
            ApplicationMessageType.Info,
            "Changes discarded"
        );
    } else {
        Application.showMessage(
            ApplicationMessageType.Info,
            "No changes to discard"
        );
    }
};
```

---

## Best Practices

1. **Always check version exists** before operations
2. **Use isDirty()** before publish to avoid unnecessary saves
3. **Show busy indicator** during long operations
4. **Handle errors** with try-catch blocks
5. **Refresh data** after successful operations
6. **Check lock state** before editing shared data

---

## Related Documentation

- [DataSource API](api-datasource.md)
- [Widgets API](api-widgets.md)
- [Application API](api-application.md)

**Official Reference**: [https://help.sap.com/doc/958d4c11261f42e992e8d01a4c0dde25/release/en-US/index.html](https://help.sap.com/doc/958d4c11261f42e992e8d01a4c0dde25/release/en-US/index.html)
