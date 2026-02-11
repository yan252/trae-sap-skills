# Advanced Widgets & Layout API Reference

Complete reference for Container Widgets, Layout APIs, R Visualizations, Custom Widgets, and Navigation in SAP Analytics Cloud.

**Source**: [Analytics Designer API Reference 2025.14](https://help.sap.com/doc/958d4c11261f42e992e8d01a4c0dde25/release/en-US/index.html)

---

## Table of Contents

1. [Container Widgets](#container-widgets)
2. [Layout API](#layout-api)
3. [Navigation API](#navigation-api)
4. [R Visualization](#r-visualization)
5. [Custom Widgets](#custom-widgets)
6. [Script Objects](#script-objects)
7. [Technical Objects](#technical-objects)

---

## Container Widgets

SAC provides five container widget types for organizing content.

### Panel

Basic container for grouping widgets.

```javascript
// Show/hide panel
Panel_1.setVisible(true);
Panel_1.setVisible(false);

// Check visibility
var isVisible = Panel_1.isVisible();
```

**Characteristics**:
- Groups widgets together
- Move, copy, delete affects all contained widgets
- No navigation functionality
- Cannot execute scripts on panel click directly

### TabStrip

Container with tabbed navigation.

```javascript
// Get active tab
var activeTab = TabStrip_1.getSelectedTab();

// Set active tab
TabStrip_1.setSelectedTab("Tab_Sales");

// Get all tabs
var tabs = TabStrip_1.getTabs();
```

**Events**:
```javascript
TabStrip_1.onSelect = function() {
    var selectedTab = TabStrip_1.getSelectedTab();
    console.log("Switched to tab:", selectedTab);

    // Refresh data for newly visible tab
    if (selectedTab === "Tab_Details") {
        Table_Details.getDataSource().refreshData();
    }
};
```

### PageBook

Container for page-based navigation.

```javascript
// Navigate to page
PageBook_1.setSelectedPage("Page_Dashboard");

// Get current page
var currentPage = PageBook_1.getSelectedPage();

// Navigate by index
PageBook_1.setSelectedPageIndex(0);  // First page
```

**Page Navigation Pattern**:
```javascript
// Navigation buttons
Button_Next.onClick = function() {
    var pages = PageBook_1.getPages();
    var currentIndex = pages.indexOf(PageBook_1.getSelectedPage());

    if (currentIndex < pages.length - 1) {
        PageBook_1.setSelectedPageIndex(currentIndex + 1);
    }
};

Button_Previous.onClick = function() {
    var pages = PageBook_1.getPages();
    var currentIndex = pages.indexOf(PageBook_1.getSelectedPage());

    if (currentIndex > 0) {
        PageBook_1.setSelectedPageIndex(currentIndex - 1);
    }
};
```

### Flow Layout Panel

Responsive container with automatic reflow.

```javascript
// Same visibility controls as Panel
FlowLayoutPanel_1.setVisible(true);
```

**Characteristics**:
- Widgets placed sequentially (not freely positioned)
- Automatic reflow on resize
- Responsive behavior (widgets wrap to next row)
- Similar to responsive lanes

**Use Case**: Create responsive layouts that adapt to screen size.

### Popup

Overlay container that appears above content.

```javascript
// Open popup
Popup_1.open();

// Close popup
Popup_1.close();
```

**Events**:
```javascript
Popup_1.onOpen = function() {
    // Initialize popup content
    refreshPopupData();
};

Popup_1.onClose = function() {
    // Cleanup
    clearPopupSelections();
};
```

**Dialog Mode**: Enable "Header & Footer" in Builder for dialog style with title bar and buttons.

---

## Layout API

Dynamically control widget size and position.

### Position Methods

```javascript
// Get position (pixels from edge)
var left = Widget_1.getLeft();
var top = Widget_1.getTop();
var right = Widget_1.getRight();
var bottom = Widget_1.getBottom();

// Set position
Widget_1.setLeft(100);
Widget_1.setTop(50);
Widget_1.setRight(200);
Widget_1.setBottom(100);
```

### Size Methods

```javascript
// Get dimensions
var width = Widget_1.getWidth();
var height = Widget_1.getHeight();

// Set dimensions (pixels or percentage)
Widget_1.setWidth(500);      // 500 pixels
Widget_1.setHeight(300);     // 300 pixels

// Percentage-based
Widget_1.setWidth("50%");
Widget_1.setHeight("auto");
```

### Responsive Layout Pattern

```javascript
Application.onResize = function(windowWidth, windowHeight) {
    // Mobile layout
    if (windowWidth < 768) {
        Chart_1.setWidth("100%");
        Chart_1.setHeight(200);
        Table_1.setWidth("100%");
        Panel_Sidebar.setVisible(false);
    }
    // Tablet layout
    else if (windowWidth < 1024) {
        Chart_1.setWidth("50%");
        Chart_1.setHeight(300);
        Table_1.setWidth("50%");
        Panel_Sidebar.setVisible(true);
    }
    // Desktop layout
    else {
        Chart_1.setWidth("70%");
        Chart_1.setHeight(400);
        Table_1.setWidth("30%");
        Panel_Sidebar.setVisible(true);
    }
};
```

### Collapsible Panel Pattern

```javascript
var isPanelExpanded = true;

Button_TogglePanel.onClick = function() {
    isPanelExpanded = !isPanelExpanded;

    if (isPanelExpanded) {
        Panel_Navigation.setWidth(250);
        Panel_Content.setLeft(260);
        Button_TogglePanel.setText("◀");
    } else {
        Panel_Navigation.setWidth(50);
        Panel_Content.setLeft(60);
        Button_TogglePanel.setText("▶");
    }
};
```

---

## Navigation API

Navigate between applications and stories.

### NavigationUtils

```javascript
// Open another application
NavigationUtils.openApplication("APP_ID", {
    mode: ApplicationMode.View,
    newWindow: true
});

// Open a story
NavigationUtils.openStory("STORY_ID", {
    newWindow: false
});

// Open URL
NavigationUtils.openUrl("[https://example.com",](https://example.com",) true);  // true = new window
```

### Create Application URL with Parameters

```javascript
var url = NavigationUtils.createApplicationUrl("APP_ID", {
    p_year: "2024",
    p_region: "EMEA",
    bookmarkId: "DEFAULT"
});

console.log("Share URL:", url);
```

### Page Navigation (Within Application)

For applications with multiple pages:

```javascript
// Switch to page
Application.setActivePage("Page_Details");

// Get current page
var currentPage = Application.getActivePage();
```

### Custom Navigation Menu Pattern

```javascript
// Navigation sidebar buttons
Button_Dashboard.onClick = function() {
    highlightNavButton(Button_Dashboard);
    PageBook_1.setSelectedPage("Page_Dashboard");
};

Button_Analysis.onClick = function() {
    highlightNavButton(Button_Analysis);
    PageBook_1.setSelectedPage("Page_Analysis");
};

Button_Settings.onClick = function() {
    highlightNavButton(Button_Settings);
    PageBook_1.setSelectedPage("Page_Settings");
};

// Helper function
function highlightNavButton(activeButton) {
    var navButtons = [Button_Dashboard, Button_Analysis, Button_Settings];
    navButtons.forEach(function(btn) {
        if (btn === activeButton) {
            btn.setCssClass("nav-button-active");
        } else {
            btn.setCssClass("nav-button");
        }
    });
}
```

### Cross-Story Navigation

```javascript
// Navigate to story with filters
Button_DrillToStory.onClick = function() {
    var selections = Table_1.getSelections();

    if (selections.length > 0) {
        var productId = selections[0]["Product"];

        NavigationUtils.openStory("DETAIL_STORY_ID", {
            newWindow: false,
            urlParameters: {
                p_product: productId,
                p_year: Dropdown_Year.getSelectedKey()
            }
        });
    }
};
```

---

## R Visualization

R widgets allow custom visualizations using R scripts.

### Adding R Visualization

1. Insert → R Visualization in Story
2. Configure Input Data (data source binding)
3. Write R script in Script Editor

### R Widget Configuration

**Input Data**: Binds SAC data to R variables

**R Script**: Executes R code on the input data

### Common R Libraries

```r
# Available libraries include:
library(ggplot2)      # Data visualization
library(plotly)       # Interactive charts
library(dplyr)        # Data manipulation
library(tidyr)        # Data tidying
library(scales)       # Scale functions
```

### Basic R Chart Example

```r
# Data comes from SAC as data frame
# 'data' is the input data variable

library(ggplot2)

# Create bar chart
ggplot(data, aes(x=Category, y=Value, fill=Region)) +
  geom_bar(stat="identity", position="dodge") +
  theme_minimal() +
  labs(title="Sales by Category and Region")
```

### Interactive Plotly Example

```r
library(plotly)

# Create interactive chart
plot_ly(data,
        x = ~Month,
        y = ~Revenue,
        type = 'scatter',
        mode = 'lines+markers',
        color = ~Product) %>%
  layout(title = "Monthly Revenue Trend")
```

### Animated R Visualization

```r
library(gganimate)
library(ggplot2)

# Animated chart
p <- ggplot(data, aes(x=Year, y=Value, color=Category)) +
  geom_point(size=5) +
  transition_time(Year) +
  labs(title = "Year: {frame_time}")

animate(p, nframes=50)
```

### R Visualization Limitations

- No direct script interaction with SAC widgets
- Input data must be pre-filtered via data source binding
- Cannot call R scripts programmatically from SAC script

### Use Cases

- Specialized statistical visualizations
- Animated charts
- Complex data science visualizations
- Charts not available in standard SAC library

---

## Custom Widgets

Extend SAC with custom web components.

### Custom Widget Structure

```
my-widget/
├── widget.json         # Metadata and configuration
├── widget.js           # JavaScript implementation
├── widget.css          # Optional styling
└── assets/             # Optional images/resources
```

### widget.json Structure

```json
{
    "id": "com.company.mywidget",
    "version": "1.0.0",
    "name": "My Custom Widget",
    "description": "A custom widget for SAC",
    "icon": "data:image/png;base64,...",
    "webComponent": {
        "tagName": "my-custom-widget",
        "entryPoint": "widget.js"
    },
    "properties": {
        "title": {
            "type": "string",
            "default": "Widget Title"
        },
        "threshold": {
            "type": "number",
            "default": 100
        }
    },
    "methods": {
        "refresh": {
            "returnType": "void",
            "description": "Refreshes the widget"
        }
    },
    "events": {
        "onClick": {
            "description": "Fires when widget is clicked"
        }
    }
}
```

### widget.js Structure

```javascript
(function() {
    let template = document.createElement("template");
    template.innerHTML = `
        <style>
            .container { padding: 10px; }
            .title { font-weight: bold; }
        </style>
        <div class="container">
            <div class="title"></div>
            <div class="content"></div>
        </div>
    `;

    class MyWidget extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template.content.cloneNode(true));
            this._props = {};
        }

        // Lifecycle: widget added to DOM
        connectedCallback() {
            this.render();
        }

        // Called when properties change
        onCustomWidgetBeforeUpdate(changedProps) {
            this._props = { ...this._props, ...changedProps };
        }

        onCustomWidgetAfterUpdate(changedProps) {
            this.render();
        }

        // Called when widget is resized
        onCustomWidgetResize(width, height) {
            // Handle resize
        }

        // Called when widget is removed
        onCustomWidgetDestroy() {
            // Cleanup
        }

        render() {
            let titleEl = this.shadowRoot.querySelector(".title");
            titleEl.textContent = this._props.title || "";
        }

        // Custom method (callable from SAC script)
        refresh() {
            this.render();
        }
    }

    customElements.define("my-custom-widget", MyWidget);
})();
```

### Using Custom Widgets in SAC

```javascript
// Access custom widget
CustomWidget_1.setTitle("New Title");

// Call custom method
CustomWidget_1.refresh();

// Handle custom event
CustomWidget_1.onClick = function() {
    // Widget was clicked
    Application.showMessage(ApplicationMessageType.Info, "Widget clicked!");
};
```

### Custom Widget with Data Binding

```javascript
// In custom widget (supports Linked Analysis)
this.dataBindings
    .getDataBinding()
    .getLinkedAnalysis()
    .setFilters(selection);
```

### Timer Custom Widget Example

```javascript
// TimeCountdown widget pattern
class TimeCountdownWidget extends HTMLElement {
    constructor() {
        super();
        this._endDate = new Date();
        this._timer = null;
    }

    connectedCallback() {
        this.startCountdown();
    }

    startCountdown() {
        this._timer = setInterval(() => {
            this.updateDisplay();
        }, 1000);
    }

    updateDisplay() {
        const now = new Date();
        const diff = this._endDate - now;

        if (diff <= 0) {
            clearInterval(this._timer);
            this.innerHTML = "Time's up!";
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        this.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
}
```

---

## Script Objects

Reusable function containers.

### Creating Script Objects

1. Outline panel → Script Objects → (+)
2. Name the script object (e.g., `Utils`)
3. Add functions

### Script Object Functions

```javascript
// In ScriptObject: Utils

// Function: formatCurrency
function formatCurrency(value, currency) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'USD'
    }).format(value);
}

// Function: getQuarter
function getQuarter(date) {
    var month = date.getMonth();
    return Math.floor(month / 3) + 1;
}

// Function: applyStandardFilters
function applyStandardFilters(dataSource, year, region) {
    dataSource.setRefreshPaused(true);
    dataSource.setDimensionFilter("Year", year);
    dataSource.setDimensionFilter("Region", region);
    dataSource.setRefreshPaused(false);
}
```

### Calling Script Object Functions

```javascript
// From any event handler
var formatted = Utils.formatCurrency(1234.56, "EUR");
// Returns: "€1,234.56"

var quarter = Utils.getQuarter(new Date());
// Returns: 1-4

Utils.applyStandardFilters(
    Chart_1.getDataSource(),
    "2024",
    "EMEA"
);
```

---

## Technical Objects

Special objects for advanced functionality.

### Available Technical Objects

| Object | Description |
|--------|-------------|
| BookmarkSet | Save/load application state |
| Timer | Scheduled script execution |
| Calendar | Calendar integration |
| DataAction | Execute data actions |
| MultiAction | Execute multiple actions |
| ScriptVariable | Application-wide variables |

### Adding Technical Objects

1. Outline panel → Technical Objects
2. Click (+) next to desired object type
3. Configure in Builder panel

### Global Script Variables

Create via Outline → Script Variables:

```javascript
// Access global variable
var currentYear = GlobalYear;

// Set global variable
GlobalYear = "2024";

// URL parameter (prefix with p_)
// URL: ?p_Year=2024
// Variable name: p_Year
var urlYear = p_Year;
```

---

## Complete Example: Custom Dashboard Layout

```javascript
// Initialize responsive layout
Application.onInitialization = function() {
    // Set initial layout based on window size
    adjustLayout(window.innerWidth);
};

Application.onResize = function(width, height) {
    adjustLayout(width);
};

function adjustLayout(width) {
    // Mobile
    if (width < 768) {
        setMobileLayout();
    }
    // Tablet
    else if (width < 1200) {
        setTabletLayout();
    }
    // Desktop
    else {
        setDesktopLayout();
    }
}

function setMobileLayout() {
    Panel_Sidebar.setVisible(false);
    Panel_Main.setWidth("100%");
    Panel_Main.setLeft(0);

    TabStrip_Charts.setSelectedTab("Tab_Summary");
    Chart_Detail.setVisible(false);
}

function setTabletLayout() {
    Panel_Sidebar.setVisible(true);
    Panel_Sidebar.setWidth(200);
    Panel_Main.setWidth("calc(100% - 210px)");
    Panel_Main.setLeft(210);

    Chart_Detail.setVisible(true);
    Chart_Detail.setWidth("100%");
}

function setDesktopLayout() {
    Panel_Sidebar.setVisible(true);
    Panel_Sidebar.setWidth(250);
    Panel_Main.setWidth("calc(100% - 260px)");
    Panel_Main.setLeft(260);

    Chart_Detail.setVisible(true);
    Chart_Detail.setWidth("50%");
}

// Navigation
Button_Dashboard.onClick = function() {
    PageBook_1.setSelectedPage("Page_Dashboard");
    Utils.highlightNavButton("Dashboard");
};

Button_Analysis.onClick = function() {
    PageBook_1.setSelectedPage("Page_Analysis");
    Utils.highlightNavButton("Analysis");
};

Button_Export.onClick = function() {
    Popup_Export.open();
};
```

---

## Related Documentation

- [DataSource API](api-datasource.md)
- [Widgets API](api-widgets.md)
- [Planning API](api-planning.md)
- [Calendar & Bookmarks API](api-calendar-bookmarks.md)

**Official References**:
- [Analytics Designer API Reference 2025.14](https://help.sap.com/doc/958d4c11261f42e992e8d01a4c0dde25/release/en-US/index.html)
- [Custom Widget Developer Guide](https://help.sap.com/doc/c813a28922b54e50bd2a307b099787dc/release/en-US/CustomWidgetDevGuide_en.pdf)
