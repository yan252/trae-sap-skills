# SAPUI5 Routing & Navigation

**Source**: Official SAP SAPUI5 Documentation
**Documentation**: [https://github.com/SAP-docs/sapui5/tree/main/docs/04_Essentials](https://github.com/SAP-docs/sapui5/tree/main/docs/04_Essentials)
**Last Updated**: 2025-11-21

---

## Overview

SAPUI5 implements hash-based routing for single-page applications, enabling deep linking, browser history support, and seamless navigation without page reloads.

**Key Benefits**:
- Browser back/forward button support
- Bookmarkable URLs (deep linking)
- State preservation through URL parameters
- SEO-friendly with hash-based navigation
- Mobile back button handling

---

## Core Concepts

### Hash-Based Navigation

SAPUI5 uses URL hash to manage application state:

```
[https://myapp.com/index.html#/products/123?tab=details](https://myapp.com/index.html#/products/123?tab=details)
                                ^^^^^^^^^^^^^^^^^^^^^^^^^
                                        Hash
```

**Components**:
- **Pattern**: `/products/{productId}`
- **Parameters**: `{productId}` = `123`
- **Query**: `?tab=details`

### Routes

Routes match hash patterns and trigger handlers:

```javascript
{
    "pattern": "products/{productId}",
    "name": "productDetail",
    "target": "productDetail"
}
```

**When matched**: Loads target view and passes parameters.

### Targets

Targets define what to display and where:

```javascript
{
    "productDetail": {
        "viewName": "ProductDetail",
        "viewLevel": 2,
        "viewId": "productDetail",
        "controlId": "app",
        "controlAggregation": "pages"
    }
}
```

---

## Configuration

### manifest.json Routing Configuration

**Complete Example**:
```json
{
    "sap.ui5": {
        "routing": {
            "config": {
                "routerClass": "sap.m.routing.Router",
                "type": "View",
                "viewType": "XML",
                "path": "my.app.view",
                "controlId": "app",
                "controlAggregation": "pages",
                "transition": "slide",
                "bypassed": {
                    "target": "notFound"
                },
                "async": true
            },
            "routes": [
                {
                    "pattern": "",
                    "name": "home",
                    "target": "home"
                },
                {
                    "pattern": "products",
                    "name": "productList",
                    "target": "productList"
                },
                {
                    "pattern": "products/{productId}",
                    "name": "productDetail",
                    "target": ["productList", "productDetail"]
                },
                {
                    "pattern": "products/{productId}/items/{itemId}",
                    "name": "itemDetail",
                    "target": ["productList", "productDetail", "itemDetail"]
                }
            ],
            "targets": {
                "home": {
                    "viewName": "Home",
                    "viewId": "home",
                    "viewLevel": 1
                },
                "productList": {
                    "viewName": "ProductList",
                    "viewId": "productList",
                    "viewLevel": 1
                },
                "productDetail": {
                    "viewName": "ProductDetail",
                    "viewId": "productDetail",
                    "viewLevel": 2
                },
                "itemDetail": {
                    "viewName": "ItemDetail",
                    "viewId": "itemDetail",
                    "viewLevel": 3
                },
                "notFound": {
                    "viewName": "NotFound",
                    "viewId": "notFound"
                }
            }
        }
    }
}
```

### Configuration Options

**Router Config**:
- `routerClass`: Router implementation (sap.m.routing.Router, sap.f.routing.Router)
- `type`: View type (View, Component)
- `viewType`: View format (XML, JSON, JS, HTML)
- `path`: View namespace prefix
- `controlId`: Container control ID
- `controlAggregation`: Aggregation to add views to
- `transition`: Animation (slide, show, flip, fade)
- `async`: Asynchronous view loading (always use true)
- `bypassed`: Target for unmatched routes

**Route Properties**:
- `pattern`: URL pattern to match
- `name`: Route name (for navigation)
- `target`: Single target or array of targets
- `subroutes`: Nested routes (deprecated, use multiple targets)
- `greedy`: Match even if longer patterns exist

**Target Properties**:
- `viewName`: View name (without path)
- `viewId`: View instance ID
- `viewLevel`: Hierarchy level (for transitions)
- `controlId`: Parent control ID
- `controlAggregation`: Parent aggregation
- `clearControlAggregation`: Clear before adding

---

## Initializing Router

### In Component.js

```javascript
sap.ui.define([
    "sap/ui/core/UIComponent"
], function(UIComponent) {
    "use strict";

    return UIComponent.extend("my.app.Component", {
        metadata: {
            manifest: "json"
        },

        init: function() {
            // Call parent init
            UIComponent.prototype.init.apply(this, arguments);

            // Initialize router
            this.getRouter().initialize();
        }
    });
});
```

**Important**: Always call `getRouter().initialize()` in component's init method.

---

## Navigation

### Programmatic Navigation

**Navigate to Route**:
```javascript
// Simple navigation
this.getOwnerComponent().getRouter().navTo("productList");

// With parameters
this.getOwnerComponent().getRouter().navTo("productDetail", {
    productId: "123"
});

// With query parameters
this.getOwnerComponent().getRouter().navTo("productDetail", {
    productId: "123"
}, {
    query: {
        tab: "details",
        mode: "edit"
    }
});

// Replace history (no back button)
this.getOwnerComponent().getRouter().navTo("home", {}, {}, true);
```

**Navigate Back**:
```javascript
// Browser back
window.history.go(-1);

// Or use NavContainer
var oNavContainer = this.byId("app");
oNavContainer.back();
```

### Link in XML View

**sap.m.Link**:
```xml
<Link
    text="View Product"
    href="{
        parts: ['productId'],
        formatter: '.formatProductLink'
    }"/>
```

**Controller**:
```javascript
formatProductLink: function(sProductId) {
    var oRouter = this.getOwnerComponent().getRouter();
    return oRouter.getURL("productDetail", {
        productId: sProductId
    });
}
```

---

## Route Matching

### Pattern Matched Event

**Attach in Controller**:
```javascript
sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
    "use strict";

    return Controller.extend("my.app.controller.ProductDetail", {
        onInit: function() {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("productDetail").attachPatternMatched(this._onPatternMatched, this);
        },

        _onPatternMatched: function(oEvent) {
            var mArguments = oEvent.getParameter("arguments");
            var sProductId = mArguments.productId;

            // Load product data
            this._loadProduct(sProductId);

            // Handle query parameters
            var mQuery = oEvent.getParameter("arguments")["?query"];
            if (mQuery && mQuery.tab) {
                this._selectTab(mQuery.tab);
            }
        },

        _loadProduct: function(sProductId) {
            var sPath = "/Products('" + sProductId + "')";
            this.getView().bindElement({
                path: sPath,
                events: {
                    dataRequested: function() {
                        this.getView().setBusy(true);
                    }.bind(this),
                    dataReceived: function() {
                        this.getView().setBusy(false);
                    }.bind(this)
                }
            });
        },

        _selectTab: function(sTabKey) {
            this.byId("iconTabBar").setSelectedKey(sTabKey);
        }
    });
});
```

### Route Matched Event

Match any route:
```javascript
oRouter.attachRouteMatched(function(oEvent) {
    var sRouteName = oEvent.getParameter("name");
    console.log("Route matched: " + sRouteName);
});
```

### Bypassed Event

No route matched:
```javascript
oRouter.attachBypassed(function(oEvent) {
    var sHash = oEvent.getParameter("hash");
    console.log("No route matched: " + sHash);
});
```

---

## Route Parameters

### Mandatory Parameters

```javascript
// Route pattern
"products/{productId}"

// Navigation
this.getRouter().navTo("productDetail", {
    productId: "123"  // Required
});

// Access in controller
var sProductId = mArguments.productId;
```

### Optional Parameters

```javascript
// Route pattern with :optional: prefix
"products/:productId:"

// Navigation (parameter optional)
this.getRouter().navTo("productList", {
    // productId can be omitted
});

// Or with parameter
this.getRouter().navTo("productList", {
    productId: "123"
});
```

### Query Parameters

```javascript
// Not in pattern, passed via options
this.getRouter().navTo("productDetail", {
    productId: "123"
}, {
    query: {
        tab: "specifications",
        mode: "edit",
        highlight: "true"
    }
});

// Access in controller
var mQuery = oEvent.getParameter("arguments")["?query"];
var sTab = mQuery.tab;           // "specifications"
var sMode = mQuery.mode;         // "edit"
var bHighlight = mQuery.highlight === "true";
```

### Rest Parameters

Capture remaining path:
```javascript
// Pattern with rest parameter
"files/{path*}"

// Matches
"/files/documents/reports/2025.pdf"

// Access
var sPath = mArguments.path;  // "documents/reports/2025.pdf"
```

---

## Master-Detail Pattern

### Flexible Column Layout

**manifest.json**:
```json
{
    "sap.ui5": {
        "routing": {
            "config": {
                "routerClass": "sap.f.routing.Router",
                "flexibleColumnLayout": {
                    "defaultTwoColumnLayoutType": "TwoColumnsMidExpanded",
                    "defaultThreeColumnLayoutType": "ThreeColumnsMidExpanded"
                }
            },
            "routes": [
                {
                    "pattern": "",
                    "name": "master",
                    "target": ["master"]
                },
                {
                    "pattern": "products/{productId}",
                    "name": "detail",
                    "target": ["master", "detail"]
                },
                {
                    "pattern": "products/{productId}/items/{itemId}",
                    "name": "detailDetail",
                    "target": ["master", "detail", "detailDetail"]
                }
            ],
            "targets": {
                "master": {
                    "viewName": "Master",
                    "viewLevel": 1,
                    "controlAggregation": "beginColumnPages"
                },
                "detail": {
                    "viewName": "Detail",
                    "viewLevel": 2,
                    "controlAggregation": "midColumnPages"
                },
                "detailDetail": {
                    "viewName": "DetailDetail",
                    "viewLevel": 3,
                    "controlAggregation": "endColumnPages"
                }
            }
        }
    }
}
```

**Layout Management**:
```javascript
// Get FCL
var oFCL = this.byId("flexibleColumnLayout");

// Change layout
oFCL.setLayout("TwoColumnsMidExpanded");

// Available layouts
// - OneColumn
// - TwoColumnsBeginExpanded
// - TwoColumnsMidExpanded
// - ThreeColumnsMidExpanded
// - ThreeColumnsEndExpanded
// - ThreeColumnsMidExpandedEndHidden
// - ThreeColumnsBeginExpandedEndHidden
```

---

## Advanced Patterns

### Nested Routing

Use multiple targets instead of subroutes:
```javascript
// Bad (deprecated subroutes)
{
    "pattern": "products",
    "name": "products",
    "subroutes": [...]
}

// Good (multiple targets)
{
    "pattern": "products/{productId}",
    "name": "productDetail",
    "target": ["productList", "productDetail"]
}
```

### Greedy Routes

Match even when longer patterns exist:
```javascript
{
    "pattern": "products/{productId}",
    "name": "productDetail",
    "greedy": true
}
```

### Title Propagation

Set page title based on route:
```javascript
// In controller
_onPatternMatched: function(oEvent) {
    var sProductId = oEvent.getParameter("arguments").productId;

    this.getView().bindElement({
        path: "/Products('" + sProductId + "')",
        events: {
            dataReceived: function(oData) {
                var sTitle = oData.getParameter("data").Name;

                // Set page title
                this.getOwnerComponent().getRouter().getTitleTarget("productDetail").setTitle(sTitle);
            }.bind(this)
        }
    });
}
```

---

## Error Handling

### Not Found Page

**Configure in manifest.json**:
```json
{
    "routing": {
        "config": {
            "bypassed": {
                "target": "notFound"
            }
        },
        "targets": {
            "notFound": {
                "viewName": "NotFound",
                "viewId": "notFound"
            }
        }
    }
}
```

**NotFound.view.xml**:
```xml
<mvc:View
    xmlns="sap.m"
    xmlns:mvc="sap.ui.core.mvc">
    <MessagePage
        title="{i18n>notFoundTitle}"
        text="{i18n>notFoundText}"
        description="{i18n>notFoundDescription}"
        icon="sap-icon://documents"
        showNavButton="true"
        navButtonPress=".onNavBack"/>
</mvc:View>
```

### Object Not Found

Handle when object doesn't exist:
```javascript
_loadProduct: function(sProductId) {
    this.getView().bindElement({
        path: "/Products('" + sProductId + "')",
        events: {
            dataRequested: function() {
                this.getView().setBusy(true);
            }.bind(this),
            dataReceived: function(oData) {
                this.getView().setBusy(false);

                // Check if data exists
                if (!oData.getParameter("data")) {
                    this._showObjectNotFound();
                }
            }.bind(this)
        }
    });
},

_showObjectNotFound: function() {
    this.getOwnerComponent().getRouter().getTargets().display("objectNotFound");
}
```

---

## Best Practices

### 1. Always Use Async

```json
{
    "routing": {
        "config": {
            "async": true
        }
    }
}
```

### 2. Initialize in Component

```javascript
init: function() {
    UIComponent.prototype.init.apply(this, arguments);
    this.getRouter().initialize();
}
```

### 3. Use Pattern Matched

Don't use onBeforeRendering/onAfterRendering for navigation logic:
```javascript
// Good
onInit: function() {
    this.getRouter().getRoute("detail").attachPatternMatched(this._onPatternMatched, this);
}

// Bad
onBeforeRendering: function() {
    // Don't load data here
}
```

### 4. Clean Up Event Handlers

```javascript
onExit: function() {
    this.getRouter().getRoute("detail").detachPatternMatched(this._onPatternMatched, this);
}
```

### 5. Use getURL for Links

```javascript
// Generate URL
var sURL = this.getRouter().getURL("productDetail", {
    productId: "123"
});

// Use in href
oLink.setHref(sURL);
```

---

## Troubleshooting

### Issue: Router not initializing

**Check**:
1. Called `getRouter().initialize()` in Component?
2. manifest.json routing config correct?
3. Console errors?

### Issue: Route not matching

**Check**:
1. Pattern syntax correct?
2. Parameters match?
3. Route name used in navTo?

**Debug**:
```javascript
// Log all routes
var aRoutes = this.getRouter().getRoutes();
aRoutes.forEach(function(oRoute) {
    console.log(oRoute.getPattern());
});
```

### Issue: View not displaying

**Check**:
1. Target viewName correct?
2. controlId exists?
3. controlAggregation correct?

**Debug**:
```javascript
// Attach route matched
this.getRouter().attachRouteMatched(function(oEvent) {
    console.log("Route matched:", oEvent.getParameter("name"));
    console.log("Arguments:", oEvent.getParameter("arguments"));
});
```

---

## Official Documentation

- **Routing and Navigation**: [https://github.com/SAP-docs/sapui5/tree/main/docs/04_Essentials](https://github.com/SAP-docs/sapui5/tree/main/docs/04_Essentials) (search: routing)
- **API Reference - Router**: [https://sapui5.hana.ondemand.com/#/api/sap.ui.core.routing.Router](https://sapui5.hana.ondemand.com/#/api/sap.ui.core.routing.Router)
- **API Reference - Route**: [https://sapui5.hana.ondemand.com/#/api/sap.ui.core.routing.Route](https://sapui5.hana.ondemand.com/#/api/sap.ui.core.routing.Route)
- **Flexible Column Layout**: [https://sapui5.hana.ondemand.com/#/api/sap.f.FlexibleColumnLayout](https://sapui5.hana.ondemand.com/#/api/sap.f.FlexibleColumnLayout)

---

**Note**: This document covers routing and navigation in SAPUI5. For Fiori Elements routing, see the fiori-elements.md reference file.
