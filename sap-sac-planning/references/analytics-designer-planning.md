# SAP Analytics Cloud - Analytics Designer Planning Reference

**Source**: SAP Analytics Designer Planning Documentation (Planning.pdf)
**Last Updated**: 2025-11-23

---

## Table of Contents

1. [Overview](#overview)
2. [Getting the Planning Object](#getting-the-planning-object)
3. [Enabling and Disabling Planning](#enabling-and-disabling-planning)
4. [Refreshing Data](#refreshing-data)
5. [User Input and Data Entry](#user-input-and-data-entry)
6. [Planning Versions](#planning-versions)
7. [Version Management Operations](#version-management-operations)
8. [Version Copying](#version-copying)
9. [Data Locking](#data-locking)
10. [Planning Events](#planning-events)
11. [Members on the Fly](#members-on-the-fly)
12. [Planning Categories](#planning-categories)

---

## Overview

Analytics Designer reuses the Planning features of SAP Analytics Cloud and leverages capabilities through flexible scripting for customizing applications according to user requirements. Planning Data Models, Allocations, Data Action Triggers, and all Planning features can be integrated into applications.

### What Analytics Designer CAN Do

- Integrate Planning Data Models
- Trigger Allocations via scripting
- Execute Data Actions
- Manage Versions programmatically
- Control Data Locking via API
- Create/Update/Delete dimension members dynamically

### What Analytics Designer CANNOT Do

- Use Input Tasks
- Planning scripting for models based on BPC Write-Back

---

## Getting the Planning Object

Access planning functionality through the Table widget's `getPlanning()` method.

### Syntax

```javascript
Table.getPlanning(): Planning | undefined
```

### Return Value

- Returns `Planning` object if the table has a planning model assigned
- Returns `undefined` if no planning model is assigned

### Example

```javascript
var planning = Table_1.getPlanning();
if (planning) {
    console.log("Planning model is assigned");
} else {
    console.log("No planning model assigned to this table");
}
```

---

## Enabling and Disabling Planning

Planning can be enabled/disabled both at design time and runtime.

### Design Time Configuration

In the Table's Builder panel, under **Properties** section:
- **Planning enabled**: Checkbox to enable planning capabilities
- **Mass Data Entry as default**: Optional setting for bulk data entry

### Runtime Scripting

#### Enable/Disable Planning

```javascript
setEnabled(boolean): void
```

**Use Case**: Disable planning based on business rules (e.g., no budget changes in Q4).

```javascript
// Disable planning if current date is in Q4
var currentMonth = new Date().getMonth() + 1;
if (currentMonth >= 10) {
    Table_Budget.getPlanning().setEnabled(false);
    Application.showMessage("Budget changes are locked in Q4");
}
```

#### Check Planning Status

```javascript
isEnabled(): boolean
```

**Example**:

```javascript
var planning = Table_1.getPlanning();
if (planning && planning.isEnabled()) {
    // Proceed with planning operations
    performPlanningUpdate();
} else {
    Application.showMessage("Planning is not enabled");
}
```

### Unbooked Data Configuration

In the Table's Builder panel, configure **Unbooked Data** per dimension to show dimension members without existing data. Useful when:
- Planning model has no booked data yet
- End users need to see available members for planning

---

## Refreshing Data

The `refreshData()` method refreshes all data models and widgets in the application.

### Syntax

```javascript
Application.refreshData(): void
```

### When to Use

- After data model updates via Live Connectivity
- When background process finishes updating master data
- After application is reopened
- After external data changes

### Example

```javascript
// Refresh button onClick event
function onRefreshClick() {
    Application.showBusyIndicator();
    Application.refreshData();
    Application.hideBusyIndicator();
    Application.showMessage("Data refreshed successfully");
}
```

---

## User Input and Data Entry

### Setting User Input

Update cell values programmatically using `setUserInput()`.

```javascript
setUserInput(selectedData: Selection, value: String): boolean
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `selectedData` | Selection | Cell selection from table |
| `value` | String | Value to set (max 17 characters) |

### Return Value

- `true`: Value was set successfully
- `false`: Value could not be set (locked cell, invalid value)

### Value Format Rules

| Format Type | Example | Description |
|-------------|---------|-------------|
| Raw Value | `"1234.567"` | Direct numeric value (uses user's formatting settings) |
| Scale Factor | `"*0.5"` | Multiply current value by factor |
| Scale Factor | `"*2"` | Double the current value |

### Scaling Examples (Million Scale)

| Input | Raw Value | Formatted Display |
|-------|-----------|-------------------|
| `"12345678"` | 12345678 | "12.35" |
| `"123456789"` | 123456789 | "123.46" |
| `"*0.5"` of 123456789 | 61728394.5 | "61.73" |

### Constraints

- Maximum value length: **17 characters**
- If value is scaled: **less than 7 digits**
- Can be performed from widget events or table events

### Data Validation Behavior

| Scenario | API Return | User Feedback |
|----------|------------|---------------|
| Invalid value | `false` | Error/warning message shown |
| Same value planned twice | `true` | Value is set |
| Cell is locked | `false` | Warning message shown |

### Example: Custom Input Form

```javascript
// Save Data button onClick
function onSaveData() {
    var selection = Table_1.getSelections()[0];
    var newValue = InputField_Value.getValue();

    if (!selection) {
        Application.showMessage("Please select a cell first");
        return;
    }

    var success = Table_1.getPlanning().setUserInput(selection, newValue);

    if (success) {
        Table_1.getPlanning().submitData();
        Application.showMessage("Value saved successfully");
    } else {
        Application.showMessage("Failed to save value - check if cell is locked");
    }
}
```

### Submitting Data

Submit all pending changes to the planning model.

```javascript
submitData(): boolean
```

**Important**: Always call `submitData()` after `setUserInput()` to persist changes.

```javascript
// Submit all changes
Table_1.getPlanning().submitData();
```

---

## Planning Versions

SAP Analytics Cloud supports two types of planning versions: Private and Public.

### Private Versions

Private versions are only visible to the user who created them and other SAP Analytics Cloud solutions cannot see this data.

#### Get All Private Versions

```javascript
getPrivateVersions(): [Array of Planning Private Versions] | empty array
```

#### Get Specific Private Version

```javascript
getPrivateVersion(versionId: String): Planning Private Version | undefined
```

#### Get Owner ID

Returns the user ID of the user who created the private version.

```javascript
getOwnerID(): String
```

### Public Versions

Public versions are visible to all users and all solutions of SAP Analytics Cloud.

#### Get All Public Versions

```javascript
getPublicVersions(): [Array of Planning Public Versions] | empty array
```

#### Get Specific Public Version

```javascript
getPublicVersion(versionId: String): Planning Public Version | undefined
```

### Version Common Methods

Both version types support:

```javascript
// Get internal ID (for getData() calls)
getId(): String

// Get display ID (for UI dropdowns/texts)
getDisplayId(): String

// Delete version (all versions except 'Actual' can be deleted)
deleteVersion(): boolean
```

### Example: List All Versions

```javascript
function listAllVersions() {
    var planning = Table_1.getPlanning();

    console.log("=== Private Versions ===");
    var privateVersions = planning.getPrivateVersions();
    for (var i = 0; i < privateVersions.length; i++) {
        var pv = privateVersions[i];
        console.log(pv.getId() + " - Owner: " + pv.getOwnerID());
    }

    console.log("=== Public Versions ===");
    var publicVersions = planning.getPublicVersions();
    for (var j = 0; j < publicVersions.length; j++) {
        var pub = publicVersions[j];
        console.log(pub.getId() + " (" + pub.getDisplayId() + ")");
    }
}
```

---

## Version Management Operations

### Automatic Save Behavior

Any change in data in any type of version is **automatically saved**. Even if the browser is closed unexpectedly, data will still be present when the application is reopened by the same user who changed the data.

### Publishing and Reverting

To make private data visible to other users, publish the public version.

#### Check for Unpublished Changes (Dirty Check)

```javascript
isDirty(): boolean
```

**Visual Indicator**: Dirty versions show an asterisk (*) after the version name.

```javascript
// Check before showing publish dialog
var version = Table_1.getPlanning().getPublicVersion("Forecast");
if (version.isDirty()) {
    // Show publish option
    Button_Publish.setEnabled(true);
} else {
    Application.showMessage("No changes to publish");
}
```

#### Revert Changes

Discard all data changes.

```javascript
revert(): boolean
```

#### Publish Changes

Make changes visible to other users.

```javascript
publish(): boolean
```

### Success/Failure Messages

After executing `publish()` or `revert()`:

| Scenario | Message |
|----------|---------|
| Success | "Version has been published successfully" |
| No Changes | "You can't publish or revert version 'X' because you have not modified it" |

### Publishing Private Versions

Private versions have two publishing options:

#### Option 1: Publish to Original Source

```javascript
publish(): boolean
```

#### Option 2: Publish As New Public Version

```javascript
publishAs(newVersionName: String, versionCategory: PlanningCategory): boolean
```

**Parameters**:
- `newVersionName`: Name for the new public version
- `versionCategory`: Category for the new version (see Planning Categories)

### Example: Version Publish Dialog in Popup

```javascript
// Useful when planning table is in a popup
// (toolbar is in background Canvas)

function onPublishButtonClick() {
    var planning = Table_1.getPlanning();
    var privateVersion = planning.getPrivateVersion();

    if (!privateVersion) {
        Application.showMessage("No private version available");
        return;
    }

    if (!privateVersion.isDirty()) {
        Application.showMessage("No changes to publish");
        return;
    }

    Application.showBusyIndicator();

    var success = privateVersion.publish();

    Application.hideBusyIndicator();

    if (success) {
        Application.showMessage("Published successfully");
        Popup_Planning.close();
    } else {
        Application.showMessage("Publish failed");
    }
}
```

### Publish and Leave Dialog

SAP Analytics Cloud reminds users to publish data changes before leaving the application.

**To disable this dialog**:
1. Go to Canvas **Styling** panel at design time
2. Under **Planning Settings**
3. Deselect "Remind of publishing all data changes before leaving"

---

## Version Copying

Create copies of versions using the `copy()` method.

### Syntax

```javascript
copy(newVersionName: string, planningCopyOption: PlanningCopyOption, versionCategory?: PlanningCategory): boolean
```

### PlanningCopyOptions Enumeration

| Option | Description |
|--------|-------------|
| `PlanningCopyOptions.NoData` | Create a new empty version |
| `PlanningCopyOptions.AllData` | Copy all data from the source version |
| `PlanningCopyOptions.PlanningArea` | Copy only planning area data from source |

### Example: Copy Version

```javascript
function copyActualToBudget() {
    var planning = Table_1.getPlanning();
    var actualVersion = planning.getPublicVersion("Actual");

    if (actualVersion) {
        var success = actualVersion.copy(
            "Budget_2025",
            PlanningCopyOptions.AllData,
            PlanningCategory.Budget
        );

        if (success) {
            Application.showMessage("Budget version created");
            Application.refreshData();
        }
    }
}
```

---

## Data Locking

The Data Locking script API allows checking and setting lock states even if the table isn't planning-enabled.

### Data Locking API Methods

```javascript
// Get data locking object
Table.getPlanning().getDataLocking()

// Get lock state for selection
Table.getPlanning().getDataLocking().getState(selection)

// Set lock state for selection
Table.getPlanning().getDataLocking().setState(selection, state)
```

### Checking Data Locking Enabled

```javascript
var planning = Table_1.getPlanning();
var dataLocking = planning.getDataLocking();

if (dataLocking) {
    console.log("Data locking is enabled on this model");
} else {
    console.log("Data locking is not enabled");
}
```

**Note**: You can also verify data locking in SAP Analytics Cloud Model Preferences.

### Getting Lock State

```javascript
getState(selection): DataLockingState | undefined
```

**Returns**: One of the `DataLockingState` values or `undefined` if state cannot be determined.

#### DataLockingState Enumeration

| State | Description |
|-------|-------------|
| `DataLockingState.Open` | Data can be edited by anyone |
| `DataLockingState.Restricted` | Only owner can edit |
| `DataLockingState.Locked` | No edits allowed by anyone |
| `DataLockingState.Mixed` | Selection contains multiple lock states |

#### Undefined Return Conditions

`getState()` returns `undefined` when:
- Selection is invalid
- Cell referenced by selection isn't found
- Cell is in unknown state
- Cell was created using "Add Calculation" at runtime

### Example: Get Lock State

```javascript
var selection = Table_1.getSelections()[0];
var dataLocking = Table_1.getPlanning().getDataLocking();

var lockState = dataLocking.getState(selection);

switch (lockState) {
    case DataLockingState.Open:
        console.log("Cell is open for editing");
        break;
    case DataLockingState.Restricted:
        console.log("Only owner can edit");
        break;
    case DataLockingState.Locked:
        console.log("Cell is fully locked");
        break;
    case DataLockingState.Mixed:
        console.log("Selection has mixed lock states");
        break;
    default:
        console.log("Lock state unknown");
}
```

### Setting Lock State

```javascript
setState(selection, state): boolean
```

**Returns**: `true` if successful, `false` otherwise.

#### Restrictions

- **Cannot set on private versions**: Error message: "You can only set data locks on public versions. Please use a public version and try again."
- **Cannot set Mixed state**: Error message: "You can't set the state with the value 'mixed'. Please specify either 'open', 'restricted' or 'locked' as value."
- **Multiple cell selection**: Lock state is applied to first selection only

#### Valid States to Set

- `DataLockingState.Open`
- `DataLockingState.Restricted`
- `DataLockingState.Locked`

### Example: Set Lock State

```javascript
var selection = Table_1.getSelections()[0];
var dataLocking = Table_1.getPlanning().getDataLocking();

var success = dataLocking.setState(selection, DataLockingState.Locked);

if (success) {
    Application.showMessage("Data locked successfully");
} else {
    Application.showMessage("Failed to lock data");
}
```

### Show Locks Option

If **Show Locks** option is activated for the table, lock icons update automatically after `getState()` or `setState()` completes.

### Important Notes

- Disabling data locking on a model **deletes all locks**
- Re-enabling data locking resets all members to **default locking state**
- Same behavior if default locking state or driving dimensions are changed

---

## Planning Events

Two planning-related widgets provide `onBeforeExecute` events.

### BpcPlanningSequence Widget

```javascript
onBeforeExecute(): boolean
```

Called when user clicks the BPC planning sequence trigger.

| Return Value | Behavior |
|--------------|----------|
| `true` or no value | BPC planning sequence executes |
| `false` | BPC planning sequence is ignored |

### DataActionTrigger Widget

```javascript
onBeforeExecute(): boolean
```

Called when user clicks the data action trigger.

| Return Value | Behavior |
|--------------|----------|
| `true` or no value | Data action executes |
| `false` | Data action is ignored |

### Example: Conditional Data Action Execution

```javascript
// DataActionTrigger onBeforeExecute event
function onBeforeExecuteDataAction() {
    // Check if user has confirmed
    if (!userConfirmed) {
        Application.showMessage("Please confirm before executing");
        return false; // Prevent execution
    }

    // Check data locks
    var selection = Table_1.getSelections()[0];
    var lockState = Table_1.getPlanning().getDataLocking().getState(selection);

    if (lockState === DataLockingState.Locked) {
        Application.showMessage("Cannot execute - data is locked");
        return false; // Prevent execution
    }

    return true; // Allow execution
}
```

---

## Members on the Fly

The PlanningModel script API allows adding, updating, retrieving, and deleting dimension members dynamically.

### Create Members

```javascript
PlanningModel_1.createMembers(dimensionId, memberData)
```

**Example**:

```javascript
PlanningModel_1.createMembers("LOCATION", {
    id: "BERLIN",
    description: "Berlin"
});
```

**Note**: Creating multiple members with same ID results in an error.

### Update Members

```javascript
PlanningModel_1.updateMembers(dimensionId, memberData)
```

**Example** (adding data locking owner):

```javascript
PlanningModel_1.updateMembers("LOCATION", {
    id: "BERLIN",
    dataLockingOwners: [{
        id: "ADMIN",
        type: UserType.User
    }]
});
```

### Get Single Member

```javascript
var member = PlanningModel_1.getMember(dimensionId, memberId);
console.log(member.description);
```

### Get Multiple Members (with Pagination)

```javascript
var members = PlanningModel_1.getMembers(dimensionId, options);
```

**Example** (get members 5-12):

```javascript
var members = PlanningModel_1.getMembers("LOCATION", {
    offset: "4",  // 0-indexed, so 4 = 5th member
    limit: "8"    // Return 8 members
});
```

### Member Property Access Rights

Certain member properties require specific rights/access on the dimension:

| Property | Required Right/Access |
|----------|----------------------|
| `dataLockingOwner` | Data Locking Ownership |
| `responsible` | Responsible |
| `readers` | Data Access Control |
| `writers` | Data Access Control |

### Important Notes

#### Dimension Type Restriction

Members can only be added to dimensions of type **"Generic"**. Adding members to these types is NOT supported:
- Account
- Version
- Time
- Organization

#### Refresh After Changes

After adding, updating, or deleting members, call refresh:

```javascript
DataSource.refreshData()
// or
Application.refreshData()
```

This is required for charts/tables to reflect modified members in subsequent calls to:
- `DataSource.getPlanning().getState()`
- `DataSource.getPlanning().setState()`
- `DataSource.getData()`
- `Planning.setUserInput()`

#### Large Model Considerations

After adding members to very large models (millions of members), not all members may display immediately after refresh due to asynchronous background operations. Repeat the refresh after a short delay.

#### Custom Property Naming

When adding custom properties to planning members, use a **prefix** to avoid name conflicts with existing properties.

### Complete Member Management Example

```javascript
// Create new cost center
function createCostCenter(id, description, region) {
    Application.showBusyIndicator();

    try {
        PlanningModel_1.createMembers("CostCenter", {
            id: id,
            description: description,
            properties: {
                "CUSTOM_Region": region,
                "CUSTOM_Status": "Active"
            },
            dataLockingOwners: [{
                id: Application.getUserInfo().userId,
                type: UserType.User
            }]
        });

        // Refresh to see new member
        Application.refreshData();

        Application.showMessage("Cost center created: " + id);
    } catch (e) {
        Application.showMessage("Error: " + e.message);
    } finally {
        Application.hideBusyIndicator();
    }
}
```

---

## Planning Categories

Version categories classify versions in planning models.

### PlanningCategory Enumeration

| Category | Description |
|----------|-------------|
| `PlanningCategory.Actual` | Historical/actual data (auto-created, cannot be deleted) |
| `PlanningCategory.Planning` | General planning version |
| `PlanningCategory.Budget` | Budget version |
| `PlanningCategory.Forecast` | Forecast version |
| `PlanningCategory.RollingForecast` | Rolling forecast version |

### Usage in Version Operations

```javascript
// Create new version with specific category
privateVersion.publishAs("Forecast_Q4", PlanningCategory.Forecast);

// Copy with category
sourceVersion.copy("Budget_2025", PlanningCopyOptions.AllData, PlanningCategory.Budget);
```

---

## Quick Reference Cheat Sheet

```javascript
// === PLANNING OBJECT ===
var planning = Table_1.getPlanning();  // Returns Planning | undefined
planning.isEnabled();                   // Check if planning enabled
planning.setEnabled(true);              // Enable/disable planning

// === DATA ENTRY ===
planning.setUserInput(selection, "100");    // Set absolute value
planning.setUserInput(selection, "*1.1");   // Increase by 10%
planning.submitData();                       // Submit changes

// === REFRESH ===
Application.refreshData();  // Refresh all data sources

// === VERSIONS ===
planning.getPublicVersions();                    // All public versions
planning.getPublicVersion("Budget");             // Specific public version
planning.getPrivateVersions();                   // User's private versions
planning.getPrivateVersion("MyDraft");           // Specific private version

// === VERSION OPERATIONS ===
version.getId();              // Internal ID
version.getDisplayId();       // Display ID
version.isDirty();            // Has unsaved changes?
version.publish();            // Publish to source
version.publishAs("NewVer", PlanningCategory.Budget);  // Publish as new
version.revert();             // Discard changes
version.deleteVersion();      // Delete version
version.copy("Copy", PlanningCopyOptions.AllData);     // Copy version

// === DATA LOCKING ===
var locking = planning.getDataLocking();
locking.getState(selection);  // Open, Restricted, Locked, Mixed
locking.setState(selection, DataLockingState.Locked);

// === MEMBERS ON THE FLY ===
PlanningModel_1.createMembers("Dim", {id: "X", description: "Y"});
PlanningModel_1.updateMembers("Dim", {id: "X", description: "Z"});
PlanningModel_1.getMember("Dim", "X");
PlanningModel_1.getMembers("Dim", {offset: "0", limit: "100"});

// === ENUMERATIONS ===
// DataLockingState: Open, Restricted, Locked, Mixed
// PlanningCopyOptions: NoData, AllData, PlanningArea
// PlanningCategory: Actual, Planning, Budget, Forecast, RollingForecast
// UserType: User
```

---

**Documentation Links**:
- Analytics Designer API Reference: [https://help.sap.com/doc/958d4c11261f42e992e8d01a4c0dde25/2025.23/en-US/index.html](https://help.sap.com/doc/958d4c11261f42e992e8d01a4c0dde25/2025.23/en-US/index.html)
- Planning Overview: [https://help.sap.com/docs/SAP_ANALYTICS_CLOUD/18850a0e13944f53aa8a8b7c094ea29e/cd897576c3344475a208c2f7a52f151e.html](https://help.sap.com/docs/SAP_ANALYTICS_CLOUD/18850a0e13944f53aa8a8b7c094ea29e/cd897576c3344475a208c2f7a52f151e.html)
- Data Locking: [https://help.sap.com/docs/SAP_ANALYTICS_CLOUD/18850a0e13944f53aa8a8b7c094ea29e/e07d46e950794d5a928a9b16d1394de6.html](https://help.sap.com/docs/SAP_ANALYTICS_CLOUD/18850a0e13944f53aa8a8b7c094ea29e/e07d46e950794d5a928a9b16d1394de6.html)
