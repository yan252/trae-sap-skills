# Application API Reference

Complete reference for the Application object and utility APIs in SAP Analytics Cloud scripting.

**Source**: [Analytics Designer API Reference 2025.14](https://help.sap.com/doc/958d4c11261f42e992e8d01a4c0dde25/release/en-US/index.html)

---

## Table of Contents

1. [Application Object](#application-object)
2. [User Feedback](#user-feedback)
3. [Application Information](#application-information)
4. [Navigation](#navigation)
5. [Export Functions](#export-functions)
6. [Theme and Styling](#theme-and-styling)
7. [Application Events](#application-events)
8. [Utility APIs](#utility-apis)
9. [Enumerations](#enumerations)

---

## Application Object

The global `Application` object provides access to application-level functionality.

```javascript
// Always available - no need to get reference
Application.showBusyIndicator();
```

---

## User Feedback

### showBusyIndicator()

Shows loading indicator overlay.

```javascript
Application.showBusyIndicator();

// Perform long operation
await someAsyncOperation();

Application.hideBusyIndicator();
```

### hideBusyIndicator()

Hides loading indicator.

```javascript
Application.hideBusyIndicator();
```

### showMessage(type, message)

Displays message to user.

**Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| type | ApplicationMessageType | Message type |
| message | string | Message text |

```javascript
// Info message
Application.showMessage(ApplicationMessageType.Info, "Operation completed");

// Success message
Application.showMessage(ApplicationMessageType.Success, "Data saved");

// Warning message
Application.showMessage(ApplicationMessageType.Warning, "Unsaved changes");

// Error message
Application.showMessage(ApplicationMessageType.Error, "Operation failed");
```

### Confirm Dialog Pattern

```javascript
// Use popup/dialog for confirmations
// Create Popup_Confirm with Yes/No buttons

Button_Delete.onClick = function() {
    Popup_Confirm.open();
};

Button_Yes.onClick = function() {
    // Perform action
    performDelete();
    Popup_Confirm.close();
};

Button_No.onClick = function() {
    Popup_Confirm.close();
};
```

---

## Application Information

### getInfo()

Returns application metadata.

```javascript
var info = Application.getInfo();
// Returns: ApplicationInfo object
// - id: string
// - name: string
// - description: string
```

### getUserInfo()

Returns current user information.

```javascript
var user = Application.getUserInfo();
// Returns: UserInfo object
// - id: string
// - displayName: string
// - email: string
```

**Example**:
```javascript
var user = Application.getUserInfo();
Text_Welcome.setText("Welcome, " + user.displayName);
```

### getRolesInfo()

Returns user roles.

```javascript
var roles = Application.getRolesInfo();
```

### getMode()

Returns current application mode.

```javascript
var mode = Application.getMode();
// Returns: ApplicationMode enum value
// - ApplicationMode.View
// - ApplicationMode.Present
// - ApplicationMode.Embed
```

**Example: Conditional Display**:
```javascript
if (Application.getMode() === ApplicationMode.Present) {
    Button_Edit.setVisible(false);
}
```

---

## Navigation

### NavigationUtils

Navigate to other applications or stories.

#### openApplication(appId, options)

Opens another analytic application.

```javascript
NavigationUtils.openApplication("APP_ID", {
    mode: ApplicationMode.View,
    newWindow: true
});
```

#### openStory(storyId, options)

Opens a story.

```javascript
NavigationUtils.openStory("STORY_ID", {
    newWindow: false
});
```

#### createApplicationUrl(appId, parameters)

Creates URL for an application with parameters.

```javascript
var url = NavigationUtils.createApplicationUrl("APP_ID", {
    p_year: "2024",
    p_region: "EMEA"
});
// Returns: URL string with encoded parameters
```

### Page Navigation (Within Application)

```javascript
// Get active page
var page = Application.getActivePage();

// Set active page
Application.setActivePage("Page_Detail");
```

### Tab Navigation

```javascript
// Switch tab
TabStrip_1.setSelectedTab("Tab_Chart");
```

---

## Export Functions

### Export PDF

```javascript
Application.export(ExportType.PDF, {
    scope: ExportScope.All,
    header: "Sales Report",
    footer: "Confidential - Page {page}",
    orientation: "landscape",
    paperSize: "A4"
});
```

### Export Excel

```javascript
Application.export(ExportType.Excel, {
    scope: ExportScope.All,
    includeHierarchy: true,
    fileName: "SalesData"
});
```

### Export CSV (Widget Level)

```javascript
Table_1.export(ExportType.CSV, {
    fileName: "TableExport"
});
```

### Export PowerPoint

```javascript
Application.export(ExportType.PowerPoint, {
    scope: ExportScope.All,
    header: "Quarterly Review"
});
```

---

## Theme and Styling

### getTheme()

Returns current theme.

```javascript
var theme = Application.getTheme();
// Returns: "sap_fiori_3" | "sap_fiori_3_dark" | etc.
```

### setTheme(themeId)

Sets application theme.

```javascript
Application.setTheme("sap_fiori_3_dark");
```

### getCssClass()

Returns application CSS class.

```javascript
var cssClass = Application.getCssClass();
```

### setCssClass(className)

Sets application CSS class.

```javascript
Application.setCssClass("myCustomTheme");
```

---

## Application Events

### onInitialization

Fires once when application loads.

```javascript
Application.onInitialization = function() {
    // Initialize application state
    // BEST PRACTICE: Keep this empty for performance
};
```

**Best Practice**: Avoid heavy operations. Use:
- URL parameters for initial values
- Static widget filters
- Background loading for hidden widgets

### onResize

Fires when application is resized.

```javascript
Application.onResize = function(width, height) {
    console.log("New size:", width, height);

    // Adjust layout
    if (width < 768) {
        Chart_1.setVisible(false);
        Table_1.setVisible(true);
    } else {
        Chart_1.setVisible(true);
        Table_1.setVisible(true);
    }
};
```

### onOrientationChange

Fires on mobile when orientation changes.

```javascript
Application.onOrientationChange = function(orientation) {
    console.log("Orientation:", orientation);
    // "portrait" | "landscape"
};
```

---

## Utility APIs

### ConvertUtils

Type conversion utilities.

```javascript
// String to Integer
var num = ConvertUtils.stringToInteger("42");
// Returns: 42

// Number to String
var str = ConvertUtils.numberToString(42);
// Returns: "42"

// String to Number (with decimals)
var decimal = ConvertUtils.stringToNumber("42.5");
// Returns: 42.5
```

### NumberFormat

Number formatting options.

```javascript
var format = {
    decimalPlaces: 2,
    scalingFactor: 1000,      // Display in thousands
    showSign: true,
    groupingSeparator: ","
};
```

### DateFormat

Date formatting utilities.

```javascript
// Format date
var formatted = DateFormat.format(dateValue, "yyyy-MM-dd");
// Returns: "2024-01-15"

// Parse date
var parsed = DateFormat.parse("2024-01-15", "yyyy-MM-dd");
```

### StringUtils

String manipulation.

```javascript
// Available utilities for string operations
var trimmed = myString.trim();
var upper = myString.toUpperCase();
var lower = myString.toLowerCase();
```

### ArrayUtils

Array operations.

```javascript
// Standard JavaScript array methods
var arr = [1, 2, 3, 4, 5];

// Filter
var filtered = arr.filter(function(item) {
    return item > 2;
});

// Map
var doubled = arr.map(function(item) {
    return item * 2;
});

// Find
var found = arr.find(function(item) {
    return item === 3;
});
```

---

## Enumerations

### ApplicationMessageType

```javascript
ApplicationMessageType.Info      // Informational
ApplicationMessageType.Success   // Success/confirmation
ApplicationMessageType.Warning   // Warning
ApplicationMessageType.Error     // Error
```

### ApplicationMode

```javascript
ApplicationMode.View      // Normal view mode
ApplicationMode.Present   // Presentation mode
ApplicationMode.Embed     // Embedded in another app
```

### ExportType

```javascript
ExportType.PDF            // PDF export
ExportType.Excel          // Excel export
ExportType.CSV            // CSV export
ExportType.PowerPoint     // PowerPoint export
```

### ExportScope

```javascript
ExportScope.All           // All content
ExportScope.PointOfView   // Current point of view only
```

---

## Debugging Helpers

### console.log()

Print debug information.

```javascript
console.log("Debug message");
console.log("Variable:", myVariable);
console.log("Object:", JSON.stringify(myObject));
```

**Access Console**:
1. Run application
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Look in "sandbox.worker.main.*.js"

### Debug Mode

Enable enhanced debugging:

```javascript
// Add to URL
// ?debug=true

// Or at end of existing URL
// ;debug=true
```

### debugger Statement

Pause execution for step-through debugging.

```javascript
debugger;  // Execution pauses here
var value = someCalculation();
```

### Performance Logging

```javascript
// Add URL parameter
// ?APP_PERFORMANCE_LOGGING=true

// In console
window.sap.raptr.getEntriesByMarker("(Application)")
    .filter(e => e.entryType === 'measure')
    .sort((a,b) => (a.startTime + a.duration) - (b.startTime + b.duration));
```

---

## Complete Examples

### Example 1: User-Aware Application

```javascript
Application.onInitialization = function() {
    // Get user info
    var user = Application.getUserInfo();
    Text_Welcome.setText("Welcome, " + user.displayName);

    // Check roles
    var roles = Application.getRolesInfo();
    var isAdmin = roles.some(function(role) {
        return role.id === "ADMIN";
    });

    // Show admin controls if authorized
    Panel_AdminControls.setVisible(isAdmin);
};
```

### Example 2: Responsive Layout

```javascript
Application.onResize = function(width, height) {
    // Mobile layout (< 768px)
    if (width < 768) {
        Chart_1.setVisible(false);
        Table_1.setVisible(true);
        Button_ToggleView.setVisible(true);
    }
    // Tablet layout (768-1024px)
    else if (width < 1024) {
        Chart_1.setVisible(true);
        Table_1.setVisible(false);
        Button_ToggleView.setVisible(true);
    }
    // Desktop layout (>= 1024px)
    else {
        Chart_1.setVisible(true);
        Table_1.setVisible(true);
        Button_ToggleView.setVisible(false);
    }
};
```

### Example 3: Export Report

```javascript
Button_ExportPDF.onClick = function() {
    var year = Dropdown_Year.getSelectedKey();
    var region = Dropdown_Region.getSelectedKey();

    Application.export(ExportType.PDF, {
        scope: ExportScope.All,
        header: "Sales Report - " + year + " - " + region,
        footer: "Generated on " + new Date().toLocaleDateString() + " | Page {page}",
        orientation: "landscape",
        paperSize: "A4"
    });
};

Button_ExportExcel.onClick = function() {
    Table_1.export(ExportType.Excel, {
        fileName: "SalesData_" + new Date().toISOString().split('T')[0]
    });
};
```

### Example 4: Navigation with Parameters

```javascript
// Navigate to detail application
Button_ViewDetails.onClick = function() {
    var selections = Table_1.getSelections();
    if (selections.length > 0) {
        var productId = selections[0]["Product"];
        var year = Dropdown_Year.getSelectedKey();

        NavigationUtils.openApplication("PRODUCT_DETAIL_APP", {
            mode: ApplicationMode.View,
            newWindow: true,
            parameters: {
                p_product: productId,
                p_year: year
            }
        });
    } else {
        Application.showMessage(
            ApplicationMessageType.Warning,
            "Please select a product first"
        );
    }
};
```

---

## Related Documentation

- [DataSource API](api-datasource.md)
- [Widgets API](api-widgets.md)
- [Planning API](api-planning.md)

**Official Reference**: [https://help.sap.com/doc/958d4c11261f42e992e8d01a4c0dde25/release/en-US/index.html](https://help.sap.com/doc/958d4c11261f42e992e8d01a4c0dde25/release/en-US/index.html)
