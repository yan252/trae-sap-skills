# Widget APIs Reference

Complete reference for widget scripting APIs in SAP Analytics Cloud.

**Source**: [Analytics Designer API Reference 2025.14](https://help.sap.com/doc/958d4c11261f42e992e8d01a4c0dde25/release/en-US/index.html)

---

## Table of Contents

1. [Common Widget Methods](#common-widget-methods)
2. [Chart Widget](#chart-widget)
3. [Table Widget](#table-widget)
4. [Input Controls](#input-controls)
5. [Button Widget](#button-widget)
6. [Text Widget](#text-widget)
7. [Image Widget](#image-widget)
8. [GeoMap Widget](#geomap-widget)
9. [Popup and Dialog](#popup-and-dialog)
10. [Feed Constants](#feed-constants)

---

## Common Widget Methods

All widgets share these base methods:

### Visibility

```javascript
Widget_1.setVisible(true);      // Show widget
Widget_1.setVisible(false);     // Hide widget
var isVisible = Widget_1.isVisible();
```

### Enabled State

```javascript
Widget_1.setEnabled(true);      // Enable widget
Widget_1.setEnabled(false);     // Disable widget
var isEnabled = Widget_1.isEnabled();
```

### Styling

```javascript
Widget_1.setCssClass("myCustomClass");
var cssClass = Widget_1.getCssClass();
```

### Focus

```javascript
Widget_1.focus();
```

---

## Chart Widget

### Data Source Access

```javascript
var ds = Chart_1.getDataSource();
```

### Dimension and Measure Management

#### addDimension(feed, dimensionId)

```javascript
Chart_1.addDimension(Feed.CategoryAxis, "Location");
Chart_1.addDimension(Feed.Color, "Product");
```

#### removeDimension(feed, dimensionId)

```javascript
Chart_1.removeDimension(Feed.CategoryAxis, "Location");
```

#### addMeasure(feed, measureId, index?)

```javascript
// Add measure to value axis
Chart_1.addMeasure(Feed.ValueAxis, "[Account].[parentId].&[Revenue]");

// Add at specific position
Chart_1.addMeasure(Feed.ValueAxis, "[Account].[parentId].&[Cost]", 1);
```

#### removeMeasure(feed, measureId)

```javascript
Chart_1.removeMeasure(Feed.ValueAxis, "[Account].[parentId].&[Revenue]");
```

#### getMembers(feed)

```javascript
var measures = Chart_1.getMembers(Feed.ValueAxis);
var dimensions = Chart_1.getMembers(Feed.CategoryAxis);
```

#### removeMember(feed, memberId)

```javascript
var currentMeasures = Chart_1.getMembers(Feed.ValueAxis);
Chart_1.removeMember(Feed.ValueAxis, currentMeasures[0]);
```

### Selections

#### getSelections()

Returns user-selected data points.

```javascript
var selections = Chart_1.getSelections();
// Returns: Array of selection objects
// Each object maps dimension ID to member ID
```

**Example**:
```javascript
var selections = Chart_1.getSelections();
if (selections.length > 0) {
    var selectedLocation = selections[0]["Location"];
    var selectedYear = selections[0]["Date"];
    console.log("Selected:", selectedLocation, selectedYear);
}
```

### Sorting

#### sortByValue(measureId, order)

```javascript
Chart_1.sortByValue("[Account].[parentId].&[Revenue]", SortOrder.Descending);
```

#### sortByMember(dimensionId, memberId, order)

```javascript
Chart_1.sortByMember("Date", "[Date].[Year].&[2024]", SortOrder.Ascending);
```

### Ranking

#### rankBy(measureId, count, order)

```javascript
// Top 10 by revenue
Chart_1.rankBy("[Account].[parentId].&[Revenue]", 10, SortOrder.Descending);

// Bottom 5
Chart_1.rankBy("[Account].[parentId].&[Revenue]", 5, SortOrder.Ascending);
```

### Formatting

#### getNumberFormat(measureId)

```javascript
var format = Chart_1.getNumberFormat("[Account].[parentId].&[Revenue]");
```

#### setNumberFormat(measureId, format)

```javascript
Chart_1.setNumberFormat("[Account].[parentId].&[Revenue]", {
    decimalPlaces: 2,
    scalingFactor: 1000,
    showSign: true
});
```

### Chart Events

```javascript
// onSelect - User selects data point
Chart_1.onSelect = function() {
    var selections = Chart_1.getSelections();
    // Handle selection
};

// onResultChanged - Data changes
Chart_1.onResultChanged = function() {
    // Handle data change
};
```

---

## Table Widget

### Data Source Access

```javascript
var ds = Table_1.getDataSource();
```

### Dimension Management

#### addDimensionToRows(dimensionId)

```javascript
Table_1.addDimensionToRows("Product");
```

#### addDimensionToColumns(dimensionId)

```javascript
Table_1.addDimensionToColumns("Date");
```

#### removeDimensionFromRows(dimensionId)

```javascript
Table_1.removeDimensionFromRows("Product");
```

#### removeDimensionFromColumns(dimensionId)

```javascript
Table_1.removeDimensionFromColumns("Date");
```

### Display Options

#### setZeroSuppressionEnabled(enabled)

```javascript
Table_1.setZeroSuppressionEnabled(true);  // Hide zero rows
```

#### setCompactDisplayEnabled(enabled)

```javascript
Table_1.setCompactDisplayEnabled(true);
```

### Selections

```javascript
var selections = Table_1.getSelections();
```

### Planning Access

```javascript
var planning = Table_1.getPlanning();
// See Planning API reference
```

### Comments

```javascript
var comments = Table_1.getComments();
```

### Table Events

```javascript
// onSelect - User selects cell
Table_1.onSelect = function() {
    var selections = Table_1.getSelections();
};

// onResultChanged - Data changes
Table_1.onResultChanged = function() {
    // Handle data change
};
```

---

## Input Controls

### Dropdown

```javascript
// Get selected value
var value = Dropdown_1.getSelectedKey();

// Set selected value
Dropdown_1.setSelectedKey("2024");

// Get all items
var items = Dropdown_1.getItems();

// Set items
Dropdown_1.setItems([
    { key: "2023", text: "Year 2023" },
    { key: "2024", text: "Year 2024" }
]);
```

**Events**:
```javascript
Dropdown_1.onSelect = function() {
    var selected = Dropdown_1.getSelectedKey();
    // Apply filter
    Chart_1.getDataSource().setDimensionFilter("Year", selected);
};
```

### ListBox

```javascript
// Single selection
var value = ListBox_1.getSelectedKey();

// Multiple selection
var values = ListBox_1.getSelectedKeys();

// Set selection
ListBox_1.setSelectedKey("item1");
ListBox_1.setSelectedKeys(["item1", "item2"]);
```

### CheckboxGroup

```javascript
// Get checked items
var checked = CheckboxGroup_1.getSelectedKeys();

// Set checked items
CheckboxGroup_1.setSelectedKeys(["opt1", "opt3"]);
```

### RadioButtonGroup

```javascript
var selected = RadioButtonGroup_1.getSelectedKey();
RadioButtonGroup_1.setSelectedKey("option2");
```

### Slider

```javascript
// Get value
var value = Slider_1.getValue();

// Set value
Slider_1.setValue(75);

// Set range
Slider_1.setMin(0);
Slider_1.setMax(100);
Slider_1.setStep(5);
```

### RangeSlider

```javascript
// Get range values
var startValue = RangeSlider_1.getStartValue();
var endValue = RangeSlider_1.getEndValue();

// Set range
RangeSlider_1.setStartValue(10);
RangeSlider_1.setEndValue(90);
```

### InputField

```javascript
// Get/Set value
var text = InputField_1.getValue();
InputField_1.setValue("New text");

// Placeholder
InputField_1.setPlaceholder("Enter value...");
```

### Switch

```javascript
// Get state
var isOn = Switch_1.isSelected();

// Set state
Switch_1.setSelected(true);
```

### DatePicker

```javascript
// Get selected date
var date = DatePicker_1.getValue();

// Set date
DatePicker_1.setValue(new Date(2024, 0, 1));
```

---

## Button Widget

### Properties

```javascript
// Set text
Button_1.setText("Click Me");

// Get text
var text = Button_1.getText();

// Set icon
Button_1.setIcon("sap-icon://accept");
```

### Events

```javascript
Button_1.onClick = function() {
    // Handle click
    Application.showMessage(ApplicationMessageType.Info, "Button clicked!");
};
```

---

## Text Widget

```javascript
// Set text
Text_1.setText("Hello World");
Text_1.setText("Value: " + myVariable);

// Get text
var text = Text_1.getText();

// Apply styling
Text_1.setCssClass("highlightText");
```

### Dynamic Text with Placeholders

```javascript
// Set text with bound values
Text_1.setText("Revenue: " + revenue.formattedValue);
```

---

## Image Widget

```javascript
// Set image source
Image_1.setSrc("[https://example.com/image.png](https://example.com/image.png)");

// From content network
Image_1.setSrc("sap-icon://home");

// Alt text
Image_1.setAlt("Company Logo");
```

---

## GeoMap Widget

### Layer Access

```javascript
var layer = GeoMap_1.getLayer("LayerName");
var ds = layer.getDataSource();
```

### Visibility

```javascript
GeoMap_1.setLayerVisible("LayerName", true);
GeoMap_1.setLayerVisible("LayerName", false);
```

### Selection

```javascript
var selections = GeoMap_1.getSelections();
```

---

## Popup and Dialog

### Create and Open

```javascript
// Open popup
Popup_1.open();

// Close popup
Popup_1.close();
```

### Dialog Mode

Enable in Builder panel: "Enable header & footer"

```javascript
// Dialog with custom buttons
// Configure in Builder panel
```

### Popup Events

```javascript
Popup_1.onOpen = function() {
    // Popup opened
};

Popup_1.onClose = function() {
    // Popup closed
};
```

### Example: Confirmation Dialog

```javascript
// Button click opens popup
Button_Confirm.onClick = function() {
    Popup_Confirm.open();
};

// Confirm button in popup
Button_Yes.onClick = function() {
    // Perform action
    Table_1.getPlanning().getPublicVersion("Budget").publish();
    Popup_Confirm.close();
};

// Cancel button
Button_No.onClick = function() {
    Popup_Confirm.close();
};
```

---

## Feed Constants

Use with Chart dimension/measure methods:

```javascript
Feed.CategoryAxis     // X-axis dimension
Feed.Color            // Color/legend dimension
Feed.ValueAxis        // Y-axis measures
Feed.ValueAxis2       // Secondary Y-axis
Feed.Size             // Bubble size (bubble charts)
```

---

## SortOrder Enumeration

```javascript
SortOrder.Ascending   // A-Z, 0-9
SortOrder.Descending  // Z-A, 9-0
SortOrder.Default     // Default order
```

---

## Complete Example: Interactive Dashboard

```javascript
// Dropdown filter changes chart and table
Dropdown_Year.onSelect = function() {
    var year = Dropdown_Year.getSelectedKey();

    Application.showBusyIndicator();

    // Pause refreshes
    Chart_1.getDataSource().setRefreshPaused(true);
    Table_1.getDataSource().setRefreshPaused(true);

    // Apply filter to both
    Chart_1.getDataSource().setDimensionFilter("Year", year);
    Table_1.getDataSource().setDimensionFilter("Year", year);

    // Update title
    Text_Title.setText("Sales Report - " + year);

    // Resume refreshes
    Chart_1.getDataSource().setRefreshPaused(false);
    Table_1.getDataSource().setRefreshPaused(false);

    Application.hideBusyIndicator();
};

// Chart selection filters table
Chart_1.onSelect = function() {
    var selections = Chart_1.getSelections();
    if (selections.length > 0) {
        var region = selections[0]["Region"];
        Table_1.getDataSource().setDimensionFilter("Region", region);
    }
};

// Reset button
Button_Reset.onClick = function() {
    Chart_1.getDataSource().removeDimensionFilter("Year");
    Chart_1.getDataSource().removeDimensionFilter("Region");
    Table_1.getDataSource().removeDimensionFilter("Year");
    Table_1.getDataSource().removeDimensionFilter("Region");
    Dropdown_Year.setSelectedKey("");
    Text_Title.setText("Sales Report - All Years");
};
```

---

## Related Documentation

- [DataSource API](api-datasource.md)
- [Planning API](api-planning.md)
- [Application API](api-application.md)

**Official Reference**: [https://help.sap.com/doc/958d4c11261f42e992e8d01a4c0dde25/release/en-US/index.html](https://help.sap.com/doc/958d4c11261f42e992e8d01a4c0dde25/release/en-US/index.html)
