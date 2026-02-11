# UI5 Migration Patterns and Upgrade Guide

## Table of Contents

1. [Overview](#overview)
2. [Version Upgrade Paths](#version-upgrade-paths)
3. [Breaking Changes by Version](#breaking-changes-by-version)
4. [TypeScript Conversion](#typescript-conversion)
5. [OData v2 → v4 Migration](#odata-v2--v4-migration)
6. [jQuery.sap Removal](#jquerysap-removal)
7. [Fiori Elements v2 → v4](#fiori-elements-v2--v4)
8. [Deprecated API Replacements](#deprecated-api-replacements)
9. [Testing Migration](#testing-migration)
10. [Migration Checklist](#migration-checklist)

---

## Overview

This guide provides comprehensive migration patterns for UI5 applications, covering version upgrades, framework modernization, and API migrations.

### Migration Strategy

1. **Assessment**: Analyze current application state
2. **Planning**: Create phased migration plan
3. **Execution**: Implement changes incrementally
4. **Validation**: Test after each phase
5. **Rollback Plan**: Prepare fallback options

### Tools for Migration

- **UI5 Linter**: Detect deprecated APIs
- **MCP `get_version_info`**: Breaking changes information
- **MCP `get_typescript_conversion_guidelines`**: TypeScript migration help
- **Version Control**: Git branches for each phase

---

## Version Upgrade Paths

### Recommended Upgrade Path

```
1.84.x  →  1.108.x  →  1.120.x  →  Latest
  │          │           │
  └─────────┼───────────┘
         (Skip if < 1.108)
```

### Version Support Status (as of 2025-12-28)

| Version | Release Date | Status | End of Maintenance |
|---------|--------------|--------|-------------------|
| 1.120.x | 2023-Q4 | Active Support | 2026-Q4 |
| 1.108.x | 2023-Q1 | Maintenance | 2025-Q1 |
| 1.96.x  | 2022-Q2 | Out of Support | 2024-Q2 |
| 1.84.x  | 2021-Q3 | Out of Support | 2023-Q3 |

### Version Selection Guide

**Choose 1.120.x if**:
- New projects
- Long-term support required
- Latest features needed (TypeScript, modern APIs)

**Stay on 1.108.x if**:
- Stable production apps
- Limited testing resources
- Next upgrade planned for 2025-Q2+

**Upgrade from <1.108 if**:
- Security vulnerabilities
- No vendor support
- Missing critical features

---

## Breaking Changes by Version

### 1.84.x → 1.108.x

#### 1. Async Loading Mandatory

**Change**: jQuery.sap.* global APIs removed

**Before (1.84)**:
```javascript
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.declare("com.myapp.util.Formatter");
```

**After (1.108)**:
```javascript
sap.ui.define([
  "sap/m/MessageBox"
], function(MessageBox) {
  // Use MessageBox
});
```

**Migration Steps**:
1. Replace `jQuery.sap.require` with `sap.ui.define`
2. Replace `jQuery.sap.declare` with proper module structure
3. Test all lazy-loaded modules

---

#### 2. OData V2 Model Synchronization

**Change**: Synchronous mode deprecated

**Before**:
```javascript
var oModel = new sap.ui.model.odata.v2.ODataModel("/service", {
  json: true,
  useBatch: false
});
```

**After**:
```javascript
var oModel = new sap.ui.model.odata.v2.ODataModel("/service", {
  json: true,
  useBatch: true,
  defaultUpdateMethod: "PUT",
  refreshAfterChange: false
});
```

---

#### 3. Component Preload Required

**Change**: Component-preload.js mandatory for production

**ui5.yaml**:
```yaml
builder:
  resources:
    excludes:
      - "/test/**"
  componentPreload:
    paths:
      - "webapp/Component.js"
    namespaces:
      - "com.myapp"
```

---

### 1.108.x → 1.120.x

#### 1. TypeScript Support Official

**Change**: First-class TypeScript support

**Before**: Community types (@types/openui5)
**After**: Official UI5 types (@ui5/ts-types)

**Migration**:
```json
// package.json
{
  "devDependencies": {
    "@ui5/ts-types": "^1.120.0"  // Use official types
  }
}
```

---

#### 2. Fiori Elements v4 Recommended

**Change**: FE v2 deprecated, v4 recommended

**Before (FE v2)**:
```json
{
  "sap.ui.generic.app": {
    "pages": [{
      "entitySet": "Products",
      "component": {
        "name": "sap.suite.ui.generic.template.ListReport"
      }
    }]
  }
}
```

**After (FE v4)**:
```json
{
  "sap.ui5": {
    "routing": {
      "targets": {
        "ProductsList": {
          "type": "Component",
          "id": "ProductsList",
          "name": "sap.fe.templates.ListReport",
          "options": {
            "settings": {
              "entitySet": "Products"
            }
          }
        }
      }
    }
  }
}
```

---

#### 3. sap.ui.table Enhancements

**Change**: New table features, some APIs deprecated

**Deprecated**: `sap.ui.table.Table#setEditable`
**Replacement**: Use row actions or cell templates

---

### 1.120.x → Latest (1.128.x+)

**No breaking changes expected**. Semantic versioning followed.

**New Features**:
- Enhanced TypeScript support
- Better Fiori Elements v4 flexibility
- Performance improvements

---

## TypeScript Conversion

### Prerequisites

- Node.js 20+
- TypeScript 5.0+
- @ui5/ts-types package

### Step-by-Step Conversion

#### 1. Setup TypeScript

**Install Dependencies**:
```bash
npm install --save-dev typescript @ui5/ts-types
npm install --save-dev @types/qunit  # For testing
```

**Create tsconfig.json**:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "types": ["@ui5/ts-types", "@types/qunit"],
    "lib": ["ES2022", "DOM"]
  },
  "include": ["webapp/**/*"],
  "exclude": ["node_modules"]
}
```

---

#### 2. Convert Controller

**Before (JavaScript)**:
```javascript
// Main.controller.js
sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast"
], function(Controller, MessageToast) {
  "use strict";

  return Controller.extend("com.myapp.controller.Main", {
    onPress: function(oEvent) {
      var sText = oEvent.getSource().getText();
      MessageToast.show("Button pressed: " + sText);
    }
  });
});
```

**After (TypeScript)**:
```typescript
// Main.controller.ts
import Controller from "sap/ui/core/mvc/Controller";
import MessageToast from "sap/m/MessageToast";
import Button from "sap/m/Button";
import Event from "sap/ui/base/Event";

export default class Main extends Controller {
  public onPress(oEvent: Event): void {
    const oButton = oEvent.getSource() as Button;
    const sText = oButton.getText();
    MessageToast.show(`Button pressed: ${sText}`);
  }
}
```

---

#### 3. Convert Component

**Before (JavaScript)**:
```javascript
// Component.js
sap.ui.define([
  "sap/ui/core/UIComponent",
  "com/myapp/model/models"
], function(UIComponent, models) {
  "use strict";

  return UIComponent.extend("com.myapp.Component", {
    metadata: {
      manifest: "json"
    },

    init: function() {
      UIComponent.prototype.init.apply(this, arguments);
      this.setModel(models.createDeviceModel(), "device");
      this.getRouter().initialize();
    }
  });
});
```

**After (TypeScript)**:
```typescript
// Component.ts
import UIComponent from "sap/ui/core/UIComponent";
import { createDeviceModel } from "./model/models";

export default class Component extends UIComponent {
  public static metadata = {
    manifest: "json"
  };

  public init(): void {
    super.init();
    this.setModel(createDeviceModel(), "device");
    this.getRouter().initialize();
  }
}
```

---

#### 4. Convert Formatter

**Before (JavaScript)**:
```javascript
// formatter.js
sap.ui.define([], function() {
  "use strict";

  return {
    formatCurrency: function(value, currency) {
      if (!value) return "";
      return value.toFixed(2) + " " + currency;
    }
  };
});
```

**After (TypeScript)**:
```typescript
// formatter.ts
export function formatCurrency(value: number | null, currency: string): string {
  if (!value) return "";
  return `${value.toFixed(2)} ${currency}`;
}
```

---

### Common TypeScript Pitfalls

1. **Event Parameter Typing**:
```typescript
// ❌ Wrong
onPress(oEvent) { ... }

// ✅ Correct
onPress(oEvent: Event): void { ... }
```

2. **Model Access Typing**:
```typescript
// ❌ Wrong
const sValue = this.getView().getModel().getProperty("/path");

// ✅ Correct
import JSONModel from "sap/ui/model/json/JSONModel";
const oModel = this.getView().getModel() as JSONModel;
const sValue = oModel.getProperty("/path") as string;
```

3. **Control Casting**:
```typescript
// ❌ Wrong
const oButton = oEvent.getSource();

// ✅ Correct
import Button from "sap/m/Button";
const oButton = oEvent.getSource() as Button;
```

---

## OData v2 → v4 Migration

### Key Differences

| Feature | OData V2 | OData V4 |
|---------|----------|----------|
| Batch Requests | $batch | $batch (different format) |
| Filtering | $filter=Name eq 'John' | $filter=Name eq 'John' (same) |
| Expand | $expand=Orders | $expand=Orders($select=ID,Total) |
| Function Imports | Yes | Actions/Functions |
| Deep Inserts | Limited | Full support |

### Model Configuration

**Before (V2)**:
```javascript
var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/SERVICE/", {
  json: true,
  useBatch: true,
  defaultBindingMode: "TwoWay",
  defaultCountMode: "Inline",
  defaultOperationMode: "Server"
});
```

**After (V4)**:
```javascript
var oModel = new sap.ui.model.odata.v4.ODataModel({
  serviceUrl: "/odata/v4/catalog/",
  synchronizationMode: "None",
  operationMode: "Server",
  autoExpandSelect: true,
  earlyRequests: true
});
```

---

### Binding Syntax Changes

**Before (V2) - List Binding**:
```xml
<Table items="{/Products}">
  <ColumnListItem>
    <Text text="{Name}"/>
    <Text text="{Price}"/>
  </ColumnListItem>
</Table>
```

**After (V4) - List Binding with Auto-Expand**:
```xml
<Table items="{
  path: '/Products',
  parameters: {
    $select: 'ID,Name,Price',
    $expand: 'Category',
    $orderby: 'Name'
  }
}">
  <ColumnListItem>
    <Text text="{Name}"/>
    <Text text="{Price}"/>
    <Text text="{Category/Name}"/>
  </ColumnListItem>
</Table>
```

---

### CRUD Operations

**Before (V2) - Create**:
```javascript
var oModel = this.getView().getModel();
oModel.create("/Products", {
  Name: "New Product",
  Price: 99.99
}, {
  success: function() {
    MessageToast.show("Created");
  },
  error: function(oError) {
    MessageBox.error("Error");
  }
});
```

**After (V4) - Create**:
```javascript
var oModel = this.getView().getModel();
var oListBinding = oModel.bindList("/Products");
var oContext = oListBinding.create({
  Name: "New Product",
  Price: 99.99
});

oContext.created().then(function() {
  MessageToast.show("Created");
}).catch(function(oError) {
  MessageBox.error("Error");
});
```

---

### Batch Operations

**Before (V2)**:
```javascript
oModel.setUseBatch(true);
oModel.setDeferredGroups(["myGroup"]);

oModel.create("/Products", oData, { groupId: "myGroup" });
oModel.update("/Products(1)", oData, { groupId: "myGroup" });

oModel.submitChanges({
  groupId: "myGroup",
  success: function() {},
  error: function() {}
});
```

**After (V4)**:
```javascript
var oBatchGroup = oModel.bindList("/Products", undefined, undefined, undefined, {
  $$updateGroupId: "myGroup"
});

// Create and update automatically batched
oModel.submitBatch("myGroup").then(function() {
  MessageToast.show("Batch submitted");
});
```

---

## jQuery.sap Removal

### Deprecated APIs and Replacements

| Deprecated (jQuery.sap) | Replacement (Modern) |
|-------------------------|----------------------|
| `jQuery.sap.require` | `sap.ui.define` / `sap.ui.require` |
| `jQuery.sap.declare` | ES6 modules with `export` |
| `jQuery.sap.getModulePath` | `sap.ui.require.toUrl` |
| `jQuery.sap.log` | `sap/base/Log` |
| `jQuery.sap.storage` | `sap/ui/util/Storage` |
| `jQuery.sap.uid` | `sap/base/util/uid` |
| `jQuery.sap.syncStyleClass` | `sap/ui/core/syncStyleClass` |

### Migration Examples

**Before - Module Loading**:
```javascript
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("com.myapp.util.Formatter");

sap.m.MessageBox.show("Hello");
com.myapp.util.Formatter.formatDate(new Date());
```

**After - Async Loading**:
```javascript
sap.ui.define([
  "sap/m/MessageBox",
  "com/myapp/util/Formatter"
], function(MessageBox, Formatter) {
  "use strict";

  MessageBox.show("Hello");
  Formatter.formatDate(new Date());
});
```

---

**Before - Logging**:
```javascript
jQuery.sap.log.info("Application started");
jQuery.sap.log.error("Error occurred", oError);
```

**After - Modern Logging**:
```javascript
sap.ui.require(["sap/base/Log"], function(Log) {
  Log.info("Application started");
  Log.error("Error occurred", oError);
});
```

---

**Before - UID Generation**:
```javascript
var sId = jQuery.sap.uid();
```

**After**:
```javascript
sap.ui.require(["sap/base/util/uid"], function(uid) {
  var sId = uid();
});
```

---

## Fiori Elements v2 → v4

### Manifest Migration

**Before (FE v2)**:
```json
{
  "sap.ui.generic.app": {
    "_version": "1.3.0",
    "settings": {
      "flexibleColumnLayout": {
        "defaultTwoColumnLayoutType": "TwoColumnsMidExpanded"
      }
    },
    "pages": [
      {
        "entitySet": "Products",
        "component": {
          "name": "sap.suite.ui.generic.template.ListReport",
          "settings": {
            "smartVariantManagement": true,
            "enableTableFilterInPageVariant": true
          }
        },
        "pages": [
          {
            "entitySet": "Products",
            "component": {
              "name": "sap.suite.ui.generic.template.ObjectPage"
            }
          }
        ]
      }
    ]
  }
}
```

**After (FE v4)**:
```json
{
  "sap.ui5": {
    "routing": {
      "config": {
        "flexibleColumnLayout": {
          "defaultTwoColumnLayoutType": "TwoColumnsMidExpanded"
        }
      },
      "routes": [
        {
          "pattern": ":?query:",
          "name": "ProductsList",
          "target": "ProductsList"
        },
        {
          "pattern": "Products({key}):?query:",
          "name": "ProductsObjectPage",
          "target": "ProductsObjectPage"
        }
      ],
      "targets": {
        "ProductsList": {
          "type": "Component",
          "id": "ProductsList",
          "name": "sap.fe.templates.ListReport",
          "options": {
            "settings": {
              "contextPath": "/Products",
              "variantManagement": "Page",
              "navigation": {
                "Products": {
                  "detail": {
                    "route": "ProductsObjectPage"
                  }
                }
              }
            }
          }
        },
        "ProductsObjectPage": {
          "type": "Component",
          "id": "ProductsObjectPage",
          "name": "sap.fe.templates.ObjectPage",
          "options": {
            "settings": {
              "contextPath": "/Products"
            }
          }
        }
      }
    }
  }
}
```

---

### Annotation Migration

**No changes required** for annotations, but new annotations available in FE v4:

- `@UI.Hidden`: Hide fields dynamically
- `@UI.MultiLineText`: Multi-line text support
- `@Common.ValueListRelevantQualifiers`: Advanced value helps

---

## Deprecated API Replacements

### Common Deprecated APIs

| Deprecated API | Replacement | Version |
|----------------|-------------|---------|
| `sap.ui.getCore()` | Dependency injection | 1.120+ |
| `sap.ui.table.Table#setEditable` | Row actions | 1.108+ |
| `sap.m.MessageBox.show` (sync) | Promise-based | 1.120+ |
| `sap.m.Input#setValueState("None")` | `clearValueState()` | 1.108+ |
| `jQuery.sap.*` | Modern APIs | 1.108+ |

### Migration Example

**Before**:
```javascript
var oCore = sap.ui.getCore();
var oControl = oCore.byId("myControl");
```

**After**:
```javascript
sap.ui.define([
  "sap/ui/core/Element"
], function(Element) {
  var oControl = Element.getElementById("myControl");
});
```

---

## Testing Migration

### QUnit 1.x → 2.x

**Before (QUnit 1)**:
```javascript
QUnit.test("My test", function(assert) {
  assert.ok(true, "This test passes");
  assert.strictEqual(1, 1, "Values are equal");
});
```

**After (QUnit 2)**:
```javascript
QUnit.module("MyModule");

QUnit.test("My test", function(assert) {
  assert.ok(true, "This test passes");
  assert.strictEqual(1, 1, "Values are equal");
});
```

---

### OPA5 Updates

**New Best Practice**: Use `waitFor` with promises

**Before**:
```javascript
this.waitFor({
  id: "myButton",
  success: function(oButton) {
    oButton.firePress();
  }
});
```

**After**:
```javascript
return this.waitFor({
  id: "myButton",
  success: function(oButton) {
    oButton.firePress();
  }
});
```

---

## Migration Checklist

### Pre-Migration

- [ ] Document current UI5 version
- [ ] Run linter: `ui5 lint`
- [ ] Create git branch: `git checkout -b migration/ui5-1.120`
- [ ] Backup database (if applicable)
- [ ] Review release notes for target version

### Phase 1: Code Analysis

- [ ] Identify deprecated APIs (use linter)
- [ ] List jQuery.sap usage
- [ ] Check OData model version
- [ ] Review Fiori Elements version (if applicable)

### Phase 2: Dependencies

- [ ] Update `package.json` UI5 version
- [ ] Update `manifest.json` minUI5Version
- [ ] Install new dependencies: `npm install`
- [ ] Check for breaking changes in third-party libraries

### Phase 3: Code Migration

- [ ] Replace jQuery.sap.* calls
- [ ] Update async loading patterns
- [ ] Migrate OData v2 → v4 (if planned)
- [ ] Convert to TypeScript (if planned)
- [ ] Update Fiori Elements manifest (if applicable)

### Phase 4: Testing

- [ ] Run unit tests: `npm run test:unit`
- [ ] Run integration tests: `npm run test:integration`
- [ ] Manual smoke testing
- [ ] Performance testing
- [ ] Accessibility testing

### Phase 5: Deployment

- [ ] Build production bundle: `ui5 build`
- [ ] Verify component-preload.js generated
- [ ] Deploy to test environment
- [ ] User acceptance testing
- [ ] Deploy to production

### Post-Migration

- [ ] Monitor error logs
- [ ] Document breaking changes encountered
- [ ] Update development guidelines
- [ ] Train team on new APIs
- [ ] Plan next migration (if needed)

---

## Additional Resources

- **UI5 Migration Guide**: https://ui5.sap.com/#/topic/9638e4fce4e249b09c97e6df0b5dceb3
- **UI5 Linter**: https://github.com/UI5/linter
- **TypeScript Guide**: https://sap.github.io/ui5-typescript/
- **OData V4 Guide**: https://ui5.sap.com/#/topic/5de13cf4dd1f4a3480f7e2eaaee3f5b8

---

**Last Updated**: 2025-12-28
**Plugin Version**: 3.0.0
