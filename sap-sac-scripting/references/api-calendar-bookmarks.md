# Calendar, Bookmarks & Advanced Integration API Reference

Complete reference for Calendar integration, Bookmarks, Linked Analysis, and Timer APIs in SAP Analytics Cloud.

**Source**: [Analytics Designer API Reference 2025.14](https://help.sap.com/doc/958d4c11261f42e992e8d01a4c0dde25/release/en-US/index.html)

---

## Table of Contents

1. [Calendar Integration API](#calendar-integration-api)
2. [Bookmarks API](#bookmarks-api)
3. [Linked Analysis API](#linked-analysis-api)
4. [Timer API](#timer-api)
5. [Notification Badges](#notification-badges)

---

## Calendar Integration API

SAC Calendar allows integration with planning workflows, tasks, and processes.

### Getting Calendar Events

#### getCalendarEventById(eventId)

Retrieves an existing calendar event by ID.

```javascript
var event = Calendar.getCalendarEventById("EVENT_ID_STRING");
```

**Note**: The ID is a unique string (like a story/model ID), not the display name.

#### getCurrentEvent()

Returns the event from which the application was started.

```javascript
var currentEvent = Calendar.getCurrentEvent();
if (currentEvent) {
    console.log("Started from event:", currentEvent.getName());
}
```

### Calendar Event Methods

Once you have an event reference, these methods are available:

| Method | Description |
|--------|-------------|
| `getId()` | Returns event unique ID |
| `getName()` | Returns event display name |
| `getDescription()` | Returns event description |
| `getStartDate()` | Returns start date |
| `getDueDate()` | Returns due date |
| `getStatus()` | Returns current status |
| `getType()` | Returns event type |
| `getProgress()` | Returns completion percentage |
| `hasUserRole(role)` | Checks if user has specific role |
| `activate()` | Activates the event |

### Calendar Composite Task

For composite tasks (multi-step workflows):

#### CalendarCompositeTask Methods

```javascript
// Approval workflow
task.approve();      // Approve task (requires Reviewer role)
task.reject();       // Reject task
task.submit();       // Submit for review
task.decline();      // Decline task

// Check permissions
task.canUserApprove();
task.canUserReject();
task.canUserSubmit();
task.canUserDecline();

// Reviewer management
task.addReviewer(userId);
task.removeReviewer(userId);
```

### Creating Calendar Events

#### Create Process

```javascript
var processProperties = {
    name: "Q4 Planning",
    startDate: new Date(2024, 9, 1),    // October 1, 2024
    endDate: new Date(2024, 11, 31),    // December 31, 2024
    description: "Q4 Budget Planning Process",
    owners: ["user1@company.com"],
    assignees: ["user2@company.com", "user3@company.com"]
};

var newProcess = Calendar.createProcess(processProperties);
```

#### Create Task

```javascript
var taskProperties = {
    name: "Review Budget",
    startDate: new Date(2024, 10, 1),
    dueDate: new Date(2024, 10, 15),
    description: "Review Q4 budget allocations",
    assignees: ["reviewer@company.com"],
    parentId: parentProcessId,
    reminders: [
        { daysBeforeDue: 3 },
        { daysBeforeDue: 1 }
    ]
};

var newTask = Calendar.createTask(taskProperties);
```

### CalendarCompositeTaskCreateProperties

Full list of properties when creating tasks:

| Property | Type | Description |
|----------|------|-------------|
| name | string | Task name (required) |
| startDate | Date | Start date (required) |
| endDate | Date | End date (required) |
| dueDate | Date | Due date |
| description | string | Task description |
| owners | string[] | Owner user IDs |
| assignees | string[] | Assignee user IDs |
| reviewers | string[] | Reviewer user IDs |
| parentId | string | Parent process ID |
| dependencies | string[] | Dependent task IDs |
| contextFilters | object | Context filter settings |
| reminders | object[] | Reminder configurations |
| workFiles | string[] | Attached work file IDs |

### Calendar Event Status

```javascript
CalendarTaskStatus.Open        // Not started
CalendarTaskStatus.InProgress  // In progress
CalendarTaskStatus.Successful  // Completed successfully
CalendarTaskStatus.Failed      // Failed
CalendarTaskStatus.Canceled    // Canceled
```

### Reminder Configuration

```javascript
// Add reminder to event
event.addReminder({
    daysBeforeDue: 5,
    notificationType: "Email"
});
```

### Bulk Operations Example

```javascript
// Bulk modify context filters on calendar events
function updateEventFilters(eventIds, newFilter) {
    eventIds.forEach(function(eventId) {
        var event = Calendar.getCalendarEventById(eventId);
        if (event) {
            event.setContextFilter("Year", newFilter);
        }
    });
}
```

---

## Bookmarks API

Bookmarks save application state for later restoration.

### What Bookmarks Save

- Dimension and measure selections in Tables/Charts
- Filter states
- Hierarchical levels
- Dropdown/Radio button/Checkbox selections
- Script Variables (primitive types: string, boolean, integer, number)
- Widget visibility states
- Sorting configurations

**Not Saved**: Non-primitive type script variables (complex objects)

### BookmarkSet Technical Object

Add a BookmarkSet technical object to enable bookmark functionality.

#### saveBookmark(options)

Saves current application state as a bookmark.

```javascript
BookmarkSet_1.saveBookmark({
    name: "Q4 Analysis View",
    isGlobal: true    // false for personal bookmark
});
```

#### getAll()

Returns all available bookmarks.

```javascript
var bookmarks = BookmarkSet_1.getAll();
bookmarks.forEach(function(bookmark) {
    console.log(bookmark.id + ": " + bookmark.name);
});
```

#### apply(bookmarkId)

Applies a saved bookmark.

```javascript
// Apply by ID
Bookmarks.apply("22305278-9717-4296-8809-298841349359");

// Or from bookmark info
var selectedBookmark = Dropdown_Bookmarks.getSelectedKey();
BookmarkSet_1.apply(selectedBookmark);
```

#### getAppliedBookmark()

Returns currently applied bookmark info.

```javascript
var currentBookmark = BookmarkSet_1.getAppliedBookmark();
if (currentBookmark) {
    console.log("Current bookmark:", currentBookmark.name);
}
```

#### deleteBookmark(bookmarkInfo)

Deletes a bookmark.

```javascript
var bookmarkToDelete = BookmarkSet_1.getAppliedBookmark();
BookmarkSet_1.deleteBookmark(bookmarkToDelete);
```

### URL Parameters for Bookmarks

Bookmarks can be loaded via URL:

```
# Load specific bookmark
?bookmarkId=XXXXXXXXXXX

# Load default bookmark
?bookmarkId=DEFAULT
```

### Bookmark Dropdown Pattern

```javascript
// Populate dropdown with bookmarks
function populateBookmarkDropdown() {
    var bookmarks = BookmarkSet_1.getAll();
    var items = bookmarks.map(function(b) {
        return { key: b.id, text: b.name };
    });
    Dropdown_Bookmarks.setItems(items);
}

// Apply selected bookmark
Dropdown_Bookmarks.onSelect = function() {
    var bookmarkId = Dropdown_Bookmarks.getSelectedKey();
    if (bookmarkId) {
        BookmarkSet_1.apply(bookmarkId);
    }
};
```

### Global vs Personal Bookmarks

| Type | Visibility | Use Case |
|------|-----------|----------|
| Personal | Only creator | Individual analysis views |
| Global | All viewers | Shared scenarios, published views |

---

## Linked Analysis API

Linked Analysis enables cross-widget filtering based on selections.

### In Analytics Applications

Linked Analysis must be implemented via scripting in Analytic Applications (unlike Stories where it's automatic).

### setFilters(selections)

Applies selection filters to linked widgets.

```javascript
// In Chart_1 onSelect event
var selections = Chart_1.getSelections();
if (selections.length > 0) {
    // Set filters on linked widgets
    LinkedAnalysis.setFilters(selections);
}
```

### removeFilters()

Removes linked analysis filters.

```javascript
LinkedAnalysis.removeFilters();
```

### Custom Linked Analysis Pattern

```javascript
// Create reusable linked analysis function
function applyLinkedAnalysis(sourceWidget, targetWidgets) {
    var selections = sourceWidget.getSelections();

    if (selections.length === 0) {
        // Clear filters on all targets
        targetWidgets.forEach(function(widget) {
            widget.getDataSource().clearAllFilters();
        });
        return;
    }

    // Apply selection to all targets
    var selection = selections[0];
    targetWidgets.forEach(function(widget) {
        var ds = widget.getDataSource();
        Object.keys(selection).forEach(function(dimId) {
            ds.setDimensionFilter(dimId, selection[dimId]);
        });
    });
}

// Usage in Chart_1.onSelect
applyLinkedAnalysis(Chart_1, [Table_1, Chart_2, Chart_3]);
```

### With Custom Widgets

Starting from QRC Q3 2023, Custom Widgets support Linked Analysis:

```javascript
// In custom widget code
this.dataBindings
    .getDataBinding()
    .getLinkedAnalysis()
    .setFilters(selection);

// Remove filters
this.dataBindings
    .getDataBinding()
    .getLinkedAnalysis()
    .removeFilters();
```

---

## Timer API

Timer enables scheduled script execution and animations.

### Timer Technical Object

Add a Timer from the Outline panel under Technical Objects.

### Timer Methods

```javascript
// Start timer (interval in milliseconds)
Timer_1.start(1000);  // Every 1 second

// Stop timer
Timer_1.stop();

// Check if running
var isRunning = Timer_1.isRunning();

// Get interval
var interval = Timer_1.getInterval();

// Set interval
Timer_1.setInterval(2000);  // Change to 2 seconds
```

### Timer Events

```javascript
// onTimeout - fires at each interval
Timer_1.onTimeout = function() {
    // Update data or animations
    refreshDashboard();
};
```

### Auto-Refresh Pattern

```javascript
// Auto-refresh dashboard every 30 seconds
Timer_Refresh.start(30000);

Timer_Refresh.onTimeout = function() {
    Application.showBusyIndicator();

    Chart_1.getDataSource().refreshData();
    Table_1.getDataSource().refreshData();

    Application.hideBusyIndicator();

    // Update timestamp
    Text_LastRefresh.setText(
        "Last updated: " + new Date().toLocaleTimeString()
    );
};

// Stop on user interaction
Button_Pause.onClick = function() {
    if (Timer_Refresh.isRunning()) {
        Timer_Refresh.stop();
        Button_Pause.setText("Resume Auto-Refresh");
    } else {
        Timer_Refresh.start(30000);
        Button_Pause.setText("Pause Auto-Refresh");
    }
};
```

### Countdown Timer Pattern

```javascript
var countdown = 60;  // 60 seconds

Timer_Countdown.start(1000);  // 1 second intervals

Timer_Countdown.onTimeout = function() {
    countdown--;
    Text_Countdown.setText("Time remaining: " + countdown + "s");

    if (countdown <= 0) {
        Timer_Countdown.stop();
        performAction();
    }
};
```

### Animation Pattern

```javascript
var currentIndex = 0;
var dataPoints = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

Timer_Animation.start(2000);  // 2 second intervals

Timer_Animation.onTimeout = function() {
    // Highlight next data point
    Chart_1.getDataSource().setDimensionFilter("Month", dataPoints[currentIndex]);

    currentIndex++;
    if (currentIndex >= dataPoints.length) {
        currentIndex = 0;  // Loop back
    }
};
```

---

## Notification Badges

### Application Messages

```javascript
// Display notifications
Application.showMessage(ApplicationMessageType.Info, "Information message");
Application.showMessage(ApplicationMessageType.Success, "Success message");
Application.showMessage(ApplicationMessageType.Warning, "Warning message");
Application.showMessage(ApplicationMessageType.Error, "Error message");
```

### Custom Notification Pattern

```javascript
// Check for alerts and show notification
function checkAlerts() {
    var data = Chart_1.getDataSource().getData({
        "@MeasureDimension": "[Account].[parentId].&[Revenue]"
    });

    if (data.rawValue < 10000) {
        Application.showMessage(
            ApplicationMessageType.Warning,
            "Revenue below threshold: " + data.formattedValue
        );

        // Open alert popup
        Popup_Alert.open();
    }
}

// Call on data change
Chart_1.onResultChanged = function() {
    checkAlerts();
};
```

### Tooltip Patterns

Tooltips appear automatically on chart data points. For custom tooltips:

```javascript
// Use popup as custom tooltip
Chart_1.onSelect = function() {
    var selections = Chart_1.getSelections();
    if (selections.length > 0) {
        // Get detailed data
        var details = getDetailedInfo(selections[0]);

        // Update tooltip content
        Text_TooltipContent.setText(details);

        // Position and show popup
        Popup_Tooltip.open();
    }
};
```

---

## Complete Example: Planning Workflow with Calendar

```javascript
// Initialize from calendar event
Application.onInitialization = function() {
    var event = Calendar.getCurrentEvent();

    if (event) {
        // Set context from calendar event
        var year = event.getContextFilter("Year");
        var version = event.getContextFilter("Version");

        if (year) {
            Table_1.getDataSource().setDimensionFilter("Year", year);
        }
        if (version) {
            Table_1.getDataSource().setDimensionFilter("Version", version);
        }

        // Update title
        Text_Title.setText("Planning: " + event.getName());

        // Show task info
        Text_DueDate.setText("Due: " + event.getDueDate().toLocaleDateString());
    }
};

// Submit task
Button_Submit.onClick = function() {
    var event = Calendar.getCurrentEvent();

    if (event && event.canUserSubmit()) {
        // Save data first
        Table_1.getPlanning().submitData();

        // Submit for review
        event.submit();

        Application.showMessage(
            ApplicationMessageType.Success,
            "Task submitted for review"
        );
    } else {
        Application.showMessage(
            ApplicationMessageType.Warning,
            "Cannot submit task"
        );
    }
};
```

---

## Related Documentation

- [DataSource API](api-datasource.md)
- [Widgets API](api-widgets.md)
- [Planning API](api-planning.md)
- [Application API](api-application.md)

**Official Reference**: [https://help.sap.com/doc/958d4c11261f42e992e8d01a4c0dde25/release/en-US/index.html](https://help.sap.com/doc/958d4c11261f42e992e8d01a4c0dde25/release/en-US/index.html)
