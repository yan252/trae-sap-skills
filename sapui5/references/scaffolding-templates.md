# UI5 Scaffolding Templates Reference

## Table of Contents

1. [Overview](#overview)
2. [Template Types](#template-types)
3. [Freestyle Applications](#freestyle-applications)
4. [Fiori Elements Applications](#fiori-elements-applications)
5. [Integration Cards](#integration-cards)
6. [CAP Integration](#cap-integration)
7. [Custom Control Libraries](#custom-control-libraries)
8. [Template Selection Guide](#template-selection-guide)
9. [Project Structure Best Practices](#project-structure-best-practices)

---

## Overview

The UI5 MCP server provides comprehensive scaffolding templates for rapid application development. All templates follow SAP best practices and include:

- Proper project structure
- manifest.json with correct configuration
- ui5.yaml for build tooling
- Package.json with dependencies
- Sample code following best practices
- i18n support
- Testing setup (QUnit, OPA5)

### Template Categories

1. **Freestyle Applications**: Full control over UI and logic
2. **Fiori Elements**: Metadata-driven, zero/low-code apps
3. **Integration Cards**: Standalone cards for dashboards
4. **CAP Integration**: Backend-integrated applications
5. **Custom Control Libraries**: Reusable control development

---

## Template Types

### Quick Comparison

| Template | Language | Complexity | Use Case | Backend Required |
|----------|----------|------------|----------|------------------|
| Freestyle JS | JavaScript | Medium | Custom UI, full control | Optional |
| Freestyle TS | TypeScript | Medium | Type-safe custom UI | Optional |
| List Report | JS/TS | Low | Display list + details | Yes (OData) |
| Object Page | JS/TS | Low | Display single object | Yes (OData) |
| Analytical List Page | JS/TS | Medium | Analytics + charts | Yes (OData with annotations) |
| Overview Page | JS/TS | Medium | Dashboard with cards | Yes (OData) |
| Worklist | JS/TS | Low | Task list interface | Yes (OData) |
| List Card | JS/TS | Low | Standalone list widget | Optional |
| Table Card | JS/TS | Low | Standalone table widget | Optional |
| Timeline Card | JS/TS | Low | Chronological events | Optional |
| Object Card | JS/TS | Low | Single object display | Optional |
| Analytical Card | JS/TS | Medium | Charts and KPIs | Optional |

---

## Freestyle Applications

### Freestyle JavaScript

**When to Use**:
- Custom UI requirements not met by Fiori Elements
- Complex user interactions
- Non-standard navigation patterns
- Legacy migration projects

**Project Structure**:
```
my-freestyle-app/
├── webapp/
│   ├── Component.js                # Application component
│   ├── manifest.json               # Application descriptor
│   ├── index.html                  # Bootstrap HTML
│   ├── controller/
│   │   ├── App.controller.js       # Root controller
│   │   └── Main.controller.js      # Main view controller
│   ├── view/
│   │   ├── App.view.xml            # Root view
│   │   └── Main.view.xml           # Main view
│   ├── model/
│   │   ├── formatter.js            # Formatter functions
│   │   └── models.js               # Model initialization
│   ├── i18n/
│   │   └── i18n.properties         # Translation texts
│   ├── css/
│   │   └── style.css               # Custom styles
│   └── test/
│       ├── unit/
│       │   └── AllTests.js         # QUnit unit tests
│       └── integration/
│           └── AllJourneys.js      # OPA5 integration tests
├── ui5.yaml                        # UI5 tooling config
└── package.json                    # npm dependencies
```

**manifest.json Highlights**:
```json
{
  "sap.app": {
    "id": "com.mycompany.myapp",
    "type": "application",
    "title": "{{appTitle}}",
    "applicationVersion": {
      "version": "1.0.0"
    },
    "dataSources": {
      "mainService": {
        "uri": "/sap/opu/odata/sap/SERVICE_NAME/",
        "type": "OData",
        "settings": {
          "odataVersion": "2.0"
        }
      }
    }
  },
  "sap.ui5": {
    "dependencies": {
      "minUI5Version": "1.120.0",
      "libs": {
        "sap.m": {},
        "sap.ui.core": {},
        "sap.ui.layout": {}
      }
    },
    "models": {
      "i18n": {
        "type": "sap.ui.model.resource.ResourceModel",
        "settings": {
          "bundleName": "com.mycompany.myapp.i18n.i18n"
        }
      },
      "": {
        "dataSource": "mainService",
        "preload": true,
        "settings": {}
      }
    },
    "routing": {
      "config": {
        "routerClass": "sap.m.routing.Router",
        "type": "View",
        "viewType": "XML",
        "path": "com.mycompany.myapp.view",
        "controlId": "app",
        "controlAggregation": "pages",
        "transition": "slide"
      },
      "routes": [
        {
          "pattern": "",
          "name": "main",
          "target": "main"
        }
      ],
      "targets": {
        "main": {
          "id": "main",
          "name": "Main"
        }
      }
    }
  }
}
```

**MCP Scaffolding**:
```javascript
create_ui5_app({
  projectName: "my-freestyle-app",
  namespace: "com.mycompany.myapp",
  template: "freestyle-javascript",
  language: "javascript"
})
```

---

### Freestyle TypeScript

**When to Use**:
- Type safety requirements
- Large-scale enterprise applications
- Teams familiar with TypeScript
- Future-proof development

**Key Differences from JavaScript**:
- All files use `.ts` extension
- Type definitions required
- tsconfig.json for TypeScript configuration
- @types/openui5 for UI5 types
- @ui5/ts-interface-generator for control types

**Additional Files**:
```
my-typescript-app/
├── webapp/
│   ├── Component.ts                # TypeScript component
│   ├── controller/
│   │   └── Main.controller.ts      # TypeScript controller
│   └── model/
│       └── formatter.ts            # TypeScript formatter
├── tsconfig.json                   # TypeScript configuration
└── ui5-tsconfig.json               # UI5-specific TS config
```

**tsconfig.json**:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "node",
    "skipLibCheck": true,
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "types": ["@openui5/types", "@types/qunit"]
  },
  "include": ["webapp/**/*"]
}
```

**MCP Scaffolding**:
```javascript
create_ui5_app({
  projectName: "my-typescript-app",
  namespace: "com.mycompany.myapp",
  template: "freestyle-typescript",
  language: "typescript"
})
```

---

## Fiori Elements Applications

### List Report

**When to Use**:
- Display a list of entities with filtering
- Navigate to details page
- CRUD operations on entities
- Standard business object lists

**Features**:
- Smart table with filtering, sorting, grouping
- Variant management
- Multi-selection and mass actions
- Object page navigation
- Flexible column layout support

**Required OData Annotations**:
```xml
<!-- UI.LineItem - defines table columns -->
<Annotation Term="UI.LineItem">
  <Collection>
    <Record Type="UI.DataField">
      <PropertyValue Property="Value" Path="ProductID"/>
    </Record>
    <Record Type="UI.DataField">
      <PropertyValue Property="Value" Path="ProductName"/>
    </Record>
    <Record Type="UI.DataField">
      <PropertyValue Property="Value" Path="Price"/>
    </Record>
  </Collection>
</Annotation>

<!-- UI.SelectionFields - filter bar -->
<Annotation Term="UI.SelectionFields">
  <Collection>
    <PropertyPath>Category</PropertyPath>
    <PropertyPath>Supplier</PropertyPath>
  </Collection>
</Annotation>
```

**manifest.json (Fiori Elements)**:
```json
{
  "sap.ui.generic.app": {
    "pages": [
      {
        "entitySet": "Products",
        "component": {
          "name": "sap.suite.ui.generic.template.ListReport"
        }
      }
    ]
  }
}
```

**MCP Scaffolding**:
```javascript
create_ui5_app({
  projectName: "my-list-report",
  namespace: "com.mycompany.products",
  template: "fiori-elements-list-report",
  language: "typescript",
  capBackend: true,
  oDataV4Url: "http://localhost:4004/odata/v4/catalog"
})
```

---

### Object Page

**When to Use**:
- Display detailed information about a single entity
- Edit entity properties
- Display related entities (1:n relationships)
- Rich content with sections and subsections

**Features**:
- Header with key fields
- Sections with form fields
- Tables for related entities
- Actions (Edit, Save, Delete)
- Breadcrumb navigation

**Required OData Annotations**:
```xml
<!-- UI.HeaderInfo - header display -->
<Annotation Term="UI.HeaderInfo">
  <Record Type="UI.HeaderInfoType">
    <PropertyValue Property="TypeName" String="Product"/>
    <PropertyValue Property="TypeNamePlural" String="Products"/>
    <PropertyValue Property="Title">
      <Record Type="UI.DataField">
        <PropertyValue Property="Value" Path="ProductName"/>
      </Record>
    </PropertyValue>
  </Record>
</Annotation>

<!-- UI.Facets - sections -->
<Annotation Term="UI.Facets">
  <Collection>
    <Record Type="UI.ReferenceFacet">
      <PropertyValue Property="Label" String="General Information"/>
      <PropertyValue Property="Target" AnnotationPath="@UI.FieldGroup#GeneralInfo"/>
    </Record>
  </Collection>
</Annotation>
```

**MCP Scaffolding**:
```javascript
create_ui5_app({
  projectName: "my-object-page",
  namespace: "com.mycompany.products",
  template: "fiori-elements-object-page",
  language: "javascript"
})
```

---

### Analytical List Page

**When to Use**:
- Analytical reporting with charts
- KPI monitoring
- Filter-based data exploration
- Drill-down analysis

**Features**:
- Multiple chart types (bar, line, donut, etc.)
- Smart filter bar
- Adaptive filters
- Visual filters
- Export to Excel

**Required OData Annotations**:
```xml
<!-- UI.Chart - chart definition -->
<Annotation Term="UI.Chart">
  <Record Type="UI.ChartDefinitionType">
    <PropertyValue Property="ChartType" EnumMember="UI.ChartType/Bar"/>
    <PropertyValue Property="Dimensions">
      <Collection>
        <PropertyPath>Category</PropertyPath>
      </Collection>
    </PropertyValue>
    <PropertyValue Property="Measures">
      <Collection>
        <PropertyPath>Revenue</PropertyPath>
      </Collection>
    </PropertyValue>
  </Record>
</Annotation>
```

**MCP Scaffolding**:
```javascript
create_ui5_app({
  projectName: "my-alp",
  namespace: "com.mycompany.analytics",
  template: "fiori-elements-analytical-list-page",
  language: "typescript"
})
```

---

### Overview Page

**When to Use**:
- Dashboard with multiple cards
- High-level overview of key metrics
- Quick navigation to different areas
- Role-based personalization

**Features**:
- Multiple card types (List, Table, Chart, Stack)
- Card-level filtering
- Personalization
- Responsive layout

**MCP Scaffolding**:
```javascript
create_ui5_app({
  projectName: "my-overview",
  namespace: "com.mycompany.dashboard",
  template: "fiori-elements-overview-page",
  language: "javascript"
})
```

---

### Worklist

**When to Use**:
- Task lists or work items
- Simple list with search
- Lightweight alternative to List Report
- Mobile-first applications

**Features**:
- Simple list with search
- Pull-to-refresh
- Sorting and grouping
- Object page navigation

**MCP Scaffolding**:
```javascript
create_ui5_app({
  projectName: "my-worklist",
  namespace: "com.mycompany.tasks",
  template: "fiori-elements-worklist",
  language: "javascript"
})
```

---

## Integration Cards

### List Card

**When to Use**:
- Display a list of items
- Quick overview in dashboards
- Mobile cards

**Manifest Structure**:
```json
{
  "sap.app": {
    "id": "com.mycompany.card",
    "type": "card"
  },
  "sap.card": {
    "type": "List",
    "header": {
      "title": "Sales Orders"
    },
    "content": {
      "data": {
        "json": [
          { "Name": "Order 1", "Amount": "$1,000" },
          { "Name": "Order 2", "Amount": "$2,500" }
        ]
      },
      "item": {
        "title": "{Name}",
        "description": "{Amount}"
      }
    }
  }
}
```

**MCP Scaffolding**:
```javascript
create_integration_card({
  cardName: "my-list-card",
  cardType: "list",
  namespace: "com.mycompany.cards"
})
```

---

### Table Card

**When to Use**:
- Tabular data display
- Multiple columns
- Data comparison

**MCP Scaffolding**:
```javascript
create_integration_card({
  cardName: "my-table-card",
  cardType: "table",
  namespace: "com.mycompany.cards"
})
```

---

### Timeline Card

**When to Use**:
- Chronological events
- Activity history
- Process timelines

**MCP Scaffolding**:
```javascript
create_integration_card({
  cardName: "my-timeline-card",
  cardType: "timeline",
  namespace: "com.mycompany.cards"
})
```

---

### Object Card

**When to Use**:
- Single object details
- KPIs and metrics
- Status displays

**MCP Scaffolding**:
```javascript
create_integration_card({
  cardName: "my-object-card",
  cardType: "object",
  namespace: "com.mycompany.cards"
})
```

---

### Analytical Card

**When to Use**:
- Charts and visualizations
- Trend analysis
- Performance indicators

**MCP Scaffolding**:
```javascript
create_integration_card({
  cardName: "my-analytical-card",
  cardType: "analytical",
  namespace: "com.mycompany.cards"
})
```

---

## CAP Integration

### CAP + UI5 Project Structure

```
my-cap-project/
├── app/                            # UI5 applications
│   └── products/
│       ├── webapp/
│       │   ├── Component.js
│       │   ├── manifest.json
│       │   └── ...
│       ├── ui5.yaml
│       └── package.json
├── srv/                            # CAP services
│   ├── catalog-service.cds
│   └── catalog-service.js
├── db/                             # Database models
│   ├── schema.cds
│   └── data/
├── package.json                    # Root package.json
└── mta.yaml                        # Multi-target application
```

### CAP Service Definition

```cds
// srv/catalog-service.cds
using { my.bookshop as db } from '../db/schema';

service CatalogService {
  entity Products as projection on db.Products;
  entity Categories as projection on db.Categories;
}
```

### UI5 manifest.json for CAP

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
        "preload": true,
        "settings": {
          "synchronizationMode": "None",
          "operationMode": "Server",
          "autoExpandSelect": true,
          "earlyRequests": true
        }
      }
    }
  }
}
```

### MCP Scaffolding with CAP

```javascript
create_ui5_app({
  projectName: "products-app",
  namespace: "com.mycompany.products",
  template: "fiori-elements-list-report",
  language: "typescript",
  capBackend: true,
  oDataV4Url: "http://localhost:4004/odata/v4/catalog"
})
```

**Generated Features**:
- OData V4 model configuration
- Correct service URI
- CAP-compatible annotations support
- Testing setup for CAP backend
- package.json scripts for CAP integration

---

## Custom Control Libraries

### When to Create

- Reusable controls across projects
- Complex custom controls
- Company-specific control suite
- Third-party library integration

### Library Structure

```
my-control-library/
├── src/
│   ├── library.js                  # Library metadata
│   ├── MyControl.js                # Control implementation
│   └── themes/
│       └── base/
│           └── MyControl.less      # Control styles
├── test/
│   └── MyControl.qunit.html        # Unit tests
├── package.json
└── ui5.yaml
```

**Note**: MCP server doesn't directly scaffold control libraries. Use manual setup or UI5 CLI:

```bash
yo easy-ui5 library
```

---

## Template Selection Guide

### Decision Tree

```
Need backend integration?
├─ No → Freestyle (JS or TS based on team preference)
└─ Yes → OData available?
    ├─ No → Freestyle with custom backend integration
    └─ Yes → Standard CRUD operations?
        ├─ Yes → Fiori Elements (List Report + Object Page)
        └─ No → What's the primary use case?
            ├─ Analytics → Analytical List Page
            ├─ Dashboard → Overview Page
            ├─ Task List → Worklist
            └─ Custom → Freestyle with OData
```

### Complexity Considerations

| Complexity | Template | Development Time | Flexibility |
|------------|----------|------------------|-------------|
| Low | Fiori Elements | Hours | Low (annotation-driven) |
| Medium | Freestyle JS | Days | Medium |
| High | Freestyle TS | Days-Weeks | High (full control) |

### Team Skill Level

| Team Experience | Recommended Template |
|-----------------|----------------------|
| Beginner | Fiori Elements |
| Intermediate | Freestyle JavaScript |
| Advanced | Freestyle TypeScript |
| Mixed | Fiori Elements + Freestyle (hybrid) |

---

## Project Structure Best Practices

### Directory Organization

```
my-ui5-app/
├── webapp/                         # Application code (never change)
│   ├── Component.js
│   ├── manifest.json
│   ├── controller/                 # Group by feature
│   │   ├── products/
│   │   │   ├── List.controller.js
│   │   │   └── Detail.controller.js
│   │   └── orders/
│   │       └── List.controller.js
│   ├── view/                       # Mirror controller structure
│   │   ├── products/
│   │   │   ├── List.view.xml
│   │   │   └── Detail.view.xml
│   │   └── orders/
│   │       └── List.view.xml
│   ├── model/                      # Shared models
│   │   ├── formatter.js
│   │   ├── types.js
│   │   └── Constants.js
│   ├── i18n/                       # Internationalization
│   │   ├── i18n.properties         # English (default)
│   │   ├── i18n_de.properties      # German
│   │   └── i18n_fr.properties      # French
│   └── test/
│       ├── unit/
│       └── integration/
├── ui5.yaml                        # Build configuration
├── package.json                    # Dependencies
└── .eslintrc                       # Linting rules
```

### Naming Conventions

- **Controllers**: PascalCase + `.controller.js` (e.g., `ProductList.controller.js`)
- **Views**: PascalCase + `.view.xml` (e.g., `ProductList.view.xml`)
- **Formatters**: camelCase functions (e.g., `formatCurrency`)
- **Models**: camelCase files (e.g., `productModel.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RESULTS`)

### Component Structure

Always use Component-based architecture:

1. **Component.js**: Entry point, model initialization
2. **manifest.json**: Descriptor, routing, models
3. **Avoid**: Directly instantiating views or controllers

---

## Additional Resources

- **UI5 Tooling**: https://sap.github.io/ui5-tooling/
- **Fiori Elements**: https://ui5.sap.com/test-resources/sap/fe/core/fpmExplorer/index.html
- **Integration Cards**: https://ui5.sap.com/test-resources/sap/ui/integration/demokit/cardExplorer/index.html
- **CAP**: https://cap.cloud.sap/docs/

---

**Last Updated**: 2025-12-28
**MCP Server Version**: 0.2.0
**Plugin Version**: 3.0.0
