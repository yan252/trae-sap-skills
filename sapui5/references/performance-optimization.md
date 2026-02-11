# SAPUI5 Performance Optimization

**Source**: Official SAP SAPUI5 Documentation
**Documentation**: [https://github.com/SAP-docs/sapui5/tree/main/docs/05_Developing_Apps](https://github.com/SAP-docs/sapui5/tree/main/docs/05_Developing_Apps)
**Last Updated**: 2025-11-21

---

## Core Loading Strategies

### 1. Asynchronous Loading (Critical)

Always enable asynchronous loading for optimal performance.

**Bootstrap Configuration**:
```html
<script
    id="sap-ui-bootstrap"
    src="resources/sap-ui-core.js"
    data-sap-ui-async="true"
    data-sap-ui-on-init="module:sap/ui/core/ComponentSupport"
    data-sap-ui-resource-roots='{
        "my.app": "./"
    }'>
</script>
```

**Component Interface**:
```javascript
sap.ui.define([
    "sap/ui/core/UIComponent"
], function(UIComponent) {
    "use strict";

    return UIComponent.extend("my.app.Component", {
        interfaces: ["sap.ui.core.IAsyncContentCreation"],

        metadata: {
            manifest: "json"
        }
    });
});
```

**Benefits**:
- Non-blocking module loading
- Parallel resource fetching
- Faster initial load time
- Better user experience

---

### 2. Manifest-First Approach

Configure dependencies in manifest.json instead of bootstrap.

**manifest.json**:
```json
{
    "sap.ui5": {
        "dependencies": {
            "minUI5Version": "1.120.0",
            "libs": {
                "sap.m": {},
                "sap.ui.core": {},
                "sap.f": {}
            }
        }
    }
}
```

**Benefits**:
- Dependency reuse across contexts
- Earlier rendering
- Parallel loading optimization
- Design-time tool support

---

### 3. Lazy Loading Libraries

Load heavy libraries only when needed:

**manifest.json**:
```json
{
    "sap.ui5": {
        "dependencies": {
            "libs": {
                "sap.m": {},
                "sap.ui.table": {
                    "lazy": true
                }
            }
        }
    }
}
```

**Load Before Use**:
```javascript
sap.ui.require(["sap/ui/core/Lib"], function(Library) {
    Library.load({ name: "sap.ui.table" }).then(function() {
        // Library loaded, now create table
    });
});
```

---

## Resource Optimization

### 1. CDN Distribution

Load SAPUI5 from CDN for better performance:

```html
<script
    src="[https://sapui5.hana.ondemand.com/resources/sap-ui-core.js"](https://sapui5.hana.ondemand.com/resources/sap-ui-core.js")
    data-sap-ui-async="true">
</script>
```

**Benefits**:
- Global CDN distribution (AKAMAI)
- Reduced latency
- Caching across applications
- No server load

---

### 2. Component Preload

Enable component preload to bundle resources:

**Automatic** (UI5 Tooling):
```bash
ui5 build
```

Creates `Component-preload.js` containing:
- All views
- All controllers
- All fragments
- manifest.json
- i18n files

**Load Component Preload**:
```javascript
{
    "sap.ui5": {
        "dependencies": {
            "components": {
                "my.other.component": {
                    "lazy": false  // Preload enabled by default
                }
            }
        }
    }
}
```

---

### 3. Library Preloads

Ensure library preloads are enabled (default):

**Check Configuration**:
```javascript
// Preloads enabled by default
// Don't set data-sap-ui-preload="sync" (synchronous loading)
```

**Verify Preload Loading**:
- Open Network tab in browser
- Look for `library-preload.js` files
- Should see ONE request per library, not many

---

### 4. i18n Configuration

Prevent 404 errors for missing language files:

**manifest.json**:
```json
{
    "sap.ui5": {
        "models": {
            "i18n": {
                "type": "sap.ui.model.resource.ResourceModel",
                "settings": {
                    "bundleName": "my.app.i18n.i18n",
                    "supportedLocales": ["en", "de", "fr"],
                    "fallbackLocale": "en"
                }
            }
        }
    }
}
```

**File Structure**:
```
i18n/
├── i18n.properties          (fallback)
├── i18n_en.properties       (English)
├── i18n_de.properties       (German)
└── i18n_fr.properties       (French)
```

---

## Code Optimization

### 1. Replace Deprecated jQuery

Migrate from deprecated `jquery.sap.*` modules:

**Before** (deprecated):
```javascript
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.delayedCall(100, this, function() {});
```

**After** (modern):
```javascript
sap.ui.require(["sap/m/MessageBox"], function(MessageBox) {});

setTimeout(function() {}, 100);
```

**Migration Guide**:
- `jQuery.sap.delayedCall` → `setTimeout`
- `jQuery.sap.log` → `sap/base/Log`
- `jQuery.sap.uid` → `sap/base/util/uid`
- `jQuery.sap.getUriParameters` → `sap/base/util/UriParameters`

---

### 2. Asynchronous Factories

Use async variants for better performance:

**Components**:
```javascript
// Old (sync)
var oComponent = sap.ui.component({
    name: "my.app"
});

// New (async)
sap.ui.require(["sap/ui/core/Component"], function(Component) {
    Component.create({
        name: "my.app",
        manifest: true
    }).then(function(oComponent) {
        // Component ready
    });
});
```

**Views**:
```javascript
// Old (sync)
var oView = sap.ui.view({
    viewName: "my.app.view.Main",
    type: "XML"
});

// New (async)
sap.ui.require(["sap/ui/core/mvc/XMLView"], function(XMLView) {
    XMLView.create({
        viewName: "my.app.view.Main"
    }).then(function(oView) {
        // View ready
    });
});
```

**Controllers**:
```javascript
// Controllers loaded automatically with views (async)
```

**Resource Bundles**:
```javascript
// Old (sync)
var oBundle = jQuery.sap.resources({
    url: "i18n/i18n.properties"
});

// New (async)
sap.ui.require(["sap/base/i18n/ResourceBundle"], function(ResourceBundle) {
    ResourceBundle.create({
        url: "i18n/i18n.properties",
        async: true
    }).then(function(oBundle) {
        // Bundle ready
    });
});
```

---

## Data Handling

### 1. OData Model Preload

Enable metadata preloading:

**manifest.json**:
```json
{
    "sap.ui5": {
        "models": {
            "": {
                "dataSource": "mainService",
                "preload": true,
                "settings": {
                    "defaultBindingMode": "TwoWay"
                }
            }
        }
    }
}
```

**Benefits**:
- Metadata loads during component init
- Faster first data request
- No metadata loading delay

---

### 2. Use $select for OData

Fetch only needed properties:

**Without $select** (bad):
```javascript
// Fetches ALL properties
this.getView().bindElement("/Products('123')");
```

**With $select** (good):
```javascript
// Fetches only specified properties
this.getView().bindElement({
    path: "/Products('123')",
    parameters: {
        select: "ProductID,Name,Price,Category"
    }
});
```

**In List/Table**:
```xml
<Table
    items="{
        path: '/Products',
        parameters: {
            select: 'ProductID,Name,Price',
            expand: 'Category'
        }
    }">
```

**Benefits**:
- Smaller payload
- Faster backend queries
- Reduced network transfer
- Better performance

---

### 3. OData V4 Migration

Prefer OData V4 over V2:

**manifest.json**:
```json
{
    "sap.app": {
        "dataSources": {
            "mainService": {
                "uri": "/odata/v4/catalog/",
                "type": "OData",
                "settings": {
                    "odataVersion": "4.0"
                }
            }
        }
    },
    "sap.ui5": {
        "models": {
            "": {
                "dataSource": "mainService",
                "settings": {
                    "synchronizationMode": "None",
                    "operationMode": "Server",
                    "autoExpandSelect": true
                }
            }
        }
    }
}
```

**Benefits**:
- Better performance
- Server-side operations
- Automatic $expand and $select
- Modern features

---

### 4. Batch Requests

Combine multiple requests:

**OData V2**:
```javascript
var oModel = this.getView().getModel();

oModel.setUseBatch(true);
oModel.setDeferredGroups(["changes"]);

// Add to batch
oModel.create("/Products", oData1, { groupId: "changes" });
oModel.create("/Products", oData2, { groupId: "changes" });
oModel.update("/Products('1')", oData3, { groupId: "changes" });

// Submit batch
oModel.submitChanges({
    groupId: "changes",
    success: function() {
        MessageToast.show("All changes saved");
    }
});
```

**Benefits**:
- Single HTTP request
- Reduced network overhead
- Better performance
- Atomic operations

---

### 5. Metadata Caching

Enable metadata caching for ABAP backends:

**Automatic**: SAPUI5 uses cache tokens automatically

**Check Network**:
- Look for `sap-context-token` parameter
- Metadata should load from cache on subsequent visits

---

## UI Control Performance

### 1. Table Selection

Choose appropriate table control:

**sap.m.Table** (Mobile/Responsive):
- Good for: < 100 rows
- Keeps all rows in DOM
- Better for responsive layouts
- Growing/scrolling support

**sap.ui.table.Table** (Grid/Analytical):
- Good for: 100+ rows
- Virtual scrolling (only visible rows in DOM)
- High performance for large datasets
- Fixed column layout

**Example**:
```xml
<!-- For < 100 rows -->
<m:Table
    items="{/Products}"
    growing="true"
    growingThreshold="20">
</m:Table>

<!-- For 100+ rows -->
<table:Table
    rows="{/Products}"
    visibleRowCount="20"
    threshold="50">
</table:Table>
```

---

### 2. Reduce Control Complexity

Minimize controls in repeated aggregations:

**Bad** (heavy):
```xml
<items>
    <ColumnListItem>
        <cells>
            <VBox>
                <Text text="{Name}"/>
                <Text text="{Description}"/>
                <HBox>
                    <Button text="Edit"/>
                    <Button text="Delete"/>
                </HBox>
            </VBox>
        </cells>
    </ColumnListItem>
</items>
```

**Good** (light):
```xml
<items>
    <ColumnListItem>
        <cells>
            <ObjectIdentifier
                title="{Name}"
                text="{Description}"/>
        </cells>
    </ColumnListItem>
</items>
```

---

### 3. Remove Hidden Columns

Don't hide columns with `visible="false"` in tables - remove them entirely:

**Bad**:
```xml
<columns>
    <Column visible="false">
        <Text text="Hidden Column"/>
    </Column>
</columns>
```

**Good**:
```javascript
// Add/remove columns dynamically based on device
if (sap.ui.Device.system.desktop) {
    oTable.addColumn(oColumn);
}
```

---

## Network & Debugging

### 1. Network Inspection

Monitor browser Network tab:

**Check for**:
- Synchronous blocking requests (waterfall shows blocks)
- Excessive request count (> 50 for initial load)
- Large response sizes
- Slow backend responses
- 404 errors (missing files)
- Duplicate requests

**Tools**:
- Chrome DevTools Network tab
- Firefox Network Monitor
- UI5 Inspector extension

---

### 2. Avoid Debug Mode

Never use debug mode in production:

**Development**:
```
[http://localhost:8080/index.html?sap-ui-debug=true](http://localhost:8080/index.html?sap-ui-debug=true)
```

**Production** (don't do this):
```
[http://myapp.com/index.html?sap-ui-debug=true](http://myapp.com/index.html?sap-ui-debug=true)
```

**Why**: Debug mode loads individual source files instead of preloads.

---

### 3. Performance Measurement

Use built-in performance tools:

**Enable Performance Trace**:
```javascript
sap.ui.require(["sap/ui/performance/Measurement"], function(Measurement) {
    Measurement.setActive(true);

    // Custom measurements
    Measurement.start("myOperation");
    // ... operation ...
    Measurement.end("myOperation");

    // Get results
    var aMeasurements = Measurement.getAllMeasurements();
    console.table(aMeasurements);
});
```

**UI5 Inspector**:
- Open UI5 Inspector extension
- Go to Performance tab
- See loading times, rendering times, etc.

---

## Anti-Patterns to Avoid

### 1. setTimeout with Delays

**Bad**:
```javascript
setTimeout(function() {
    this.doSomething();
}.bind(this), 100);  // 100ms delay
```

**Good**:
```javascript
// Do immediately when possible
this.doSomething();

// Or use events
this.attachEventOnce("dataReceived", this.doSomething, this);
```

---

### 2. Visibility-Based Lazy Loading

**Bad**:
```javascript
onAfterRendering: function() {
    if (this.byId("panel").getVisible()) {
        this.loadData();
    }
}
```

**Good**:
```javascript
// Use routing or explicit user actions
onButtonPress: function() {
    this.loadData();
}
```

---

### 3. Blocking Rendering

**Bad**:
```javascript
onInit: function() {
    // Blocks rendering until data loaded
    var oData = this.loadDataSync();  // Synchronous
    this.getView().setModel(new JSONModel(oData));
}
```

**Good**:
```javascript
onInit: function() {
    // Show loading, load async
    this.getView().setBusy(true);

    this.loadDataAsync().then(function(oData) {
        this.getView().setModel(new JSONModel(oData));
        this.getView().setBusy(false);
    }.bind(this));
}
```

---

### 4. Excessive Dependencies

**Bad**:
```javascript
sap.ui.define([
    "sap/m/Button",
    "sap/m/Input",
    "sap/m/Text",
    // ... 50 more controls
], function(Button, Input, Text, ...) {
    // Only using 5 of them
});
```

**Good**:
```javascript
sap.ui.define([
    "sap/m/Button",
    "sap/m/Input"
], function(Button, Input) {
    // Only what's needed
});
```

---

## Performance Checklist

### Loading

- [ ] Async loading enabled (`data-sap-ui-async="true"`)
- [ ] Component implements `IAsyncContentCreation`
- [ ] Dependencies in manifest.json
- [ ] Heavy libraries lazy loaded
- [ ] Component preload generated
- [ ] CDN used for SAPUI5

### Data

- [ ] OData metadata preload enabled
- [ ] $select used for queries
- [ ] Batch requests for multiple operations
- [ ] OData V4 used when possible
- [ ] Metadata caching working

### UI

- [ ] Appropriate table control chosen
- [ ] Virtual scrolling for large lists
- [ ] Control complexity minimized
- [ ] No hidden columns in tables
- [ ] Growing lists for mobile

### Code

- [ ] No deprecated jQuery.sap modules
- [ ] Async factories used
- [ ] No setTimeout delays
- [ ] No visibility-based lazy loading
- [ ] No blocking rendering

### Network

- [ ] < 50 requests for initial load
- [ ] No 404 errors
- [ ] No duplicate requests
- [ ] Debug mode disabled
- [ ] Preloads loading correctly

---

## Performance Metrics

**Target Initial Load Time**:
- **3G Network**: < 5 seconds
- **LTE Network**: < 2 seconds
- **Desktop/WiFi**: < 1 second

**Measure Performance**:
```bash
# Lighthouse audit
lighthouse [https://myapp.com](https://myapp.com) --view

# WebPageTest
# Visit [https://www.webpagetest.org/](https://www.webpagetest.org/)
```

---

## Official Documentation

- **Performance**: [https://github.com/SAP-docs/sapui5/tree/main/docs/05_Developing_Apps](https://github.com/SAP-docs/sapui5/tree/main/docs/05_Developing_Apps) (search: performance)
- **Best Practices**: [https://sapui5.hana.ondemand.com/#/topic/408b40efed3c416681e1bd8cdd8910d4](https://sapui5.hana.ondemand.com/#/topic/408b40efed3c416681e1bd8cdd8910d4)
- **Performance Measurement**: [https://sapui5.hana.ondemand.com/#/api/sap.ui.performance.Measurement](https://sapui5.hana.ondemand.com/#/api/sap.ui.performance.Measurement)

---

**Note**: This document covers performance optimization for SAPUI5 applications. Implement these practices for production-ready, high-performance applications.
