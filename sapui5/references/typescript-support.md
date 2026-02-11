# TypeScript Support in SAPUI5

**Source**: Official SAP SAPUI5 Documentation
**Documentation**: [https://github.com/SAP-docs/sapui5/tree/main/docs/02_Read-Me-First](https://github.com/SAP-docs/sapui5/tree/main/docs/02_Read-Me-First)
**Last Updated**: 2025-11-21

---

## Overview

TypeScript enhances JavaScript development by adding type information, enabling early error detection and improved code assistance. SAPUI5 provides dedicated type definitions for fully-typed application development.

**Benefits**:
- Early error detection during development
- Better code completion and IntelliSense
- Improved refactoring support
- Enhanced documentation through types
- Safer code through compile-time checks

**Production Status**: TypeScript support is production-ready and actively maintained by the SAPUI5 team.

---

## Type Definition Packages

### @sapui5/types (Recommended)

Officially maintained by the SAPUI5 development team:

```bash
npm install --save-dev @sapui5/types
```

**Features**:
- Official type definitions
- Regular updates with SAPUI5 releases
- Full framework coverage
- Maintained by SAP

**Configuration** (tsconfig.json):
```json
{
    "compilerOptions": {
        "module": "es2022",
        "moduleResolution": "node",
        "target": "es2022",
        "lib": ["es2022", "dom"],
        "types": ["@sapui5/types"],
        "skipLibCheck": true,
        "strict": true
    }
}
```

### @types/openui5 (Community)

Community-maintained via DefinitelyTyped:

```bash
npm install --save-dev @types/openui5
```

**Use Case**: Alternative for OpenUI5 projects or when specific versions needed.

---

## Project Setup

### Basic TypeScript SAPUI5 Project

**package.json**:
```json
{
    "name": "my-sapui5-ts-app",
    "version": "1.0.0",
    "scripts": {
        "build": "tsc && ui5 build",
        "start": "ui5 serve",
        "watch": "tsc --watch"
    },
    "devDependencies": {
        "@sapui5/types": "^1.120.0",
        "@ui5/cli": "^3.0.0",
        "typescript": "^5.0.0"
    }
}
```

**tsconfig.json**:
```json
{
    "compilerOptions": {
        "target": "es2022",
        "module": "es2022",
        "moduleResolution": "node",
        "lib": ["es2022", "dom"],
        "types": ["@sapui5/types"],
        "outDir": "./webapp",
        "rootDir": "./src",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "resolveJsonModule": true,
        "declaration": true,
        "sourceMap": true
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules"]
}
```

**ui5.yaml**:
```yaml
specVersion: "3.0"
metadata:
  name: my.sapui5.ts.app
type: application
framework:
  name: SAPUI5
  version: "1.120.0"
  libraries:
    - name: sap.m
    - name: sap.ui.core
    - name: sap.f
```

---

## TypeScript Component

**src/Component.ts**:
```typescript
import UIComponent from "sap/ui/core/UIComponent";
import models from "./model/models";
import Device from "sap/ui/Device";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace my.sapui5.ts.app
 */
export default class Component extends UIComponent {
    public static metadata = {
        manifest: "json"
    };

    private contentDensityClass: string;

    public init(): void {
        // Call parent init
        super.init();

        // Set device model
        this.setModel(models.createDeviceModel(), "device");

        // Create router
        this.getRouter().initialize();
    }

    /**
     * Get content density CSS class
     */
    public getContentDensityClass(): string {
        if (this.contentDensityClass === undefined) {
            // Check if touch device
            if (!Device.support.touch) {
                this.contentDensityClass = "sapUiSizeCompact";
            } else {
                this.contentDensityClass = "sapUiSizeCozy";
            }
        }
        return this.contentDensityClass;
    }
}
```

---

## TypeScript Controller

**src/controller/Main.controller.ts**:
```typescript
import Controller from "sap/ui/core/mvc/Controller";
import MessageToast from "sap/m/MessageToast";
import MessageBox from "sap/m/MessageBox";
import JSONModel from "sap/ui/model/json/JSONModel";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import Event from "sap/ui/base/Event";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import Table from "sap/m/Table";
import SearchField from "sap/m/SearchField";

/**
 * @namespace my.sapui5.ts.app.controller
 */
export default class Main extends Controller {
    private viewModel: JSONModel;

    /*eslint-disable @typescript-eslint/no-empty-function*/
    public onInit(): void {
        // Create view model
        this.viewModel = new JSONModel({
            busy: false,
            selectedItemsCount: 0
        });
        this.getView()?.setModel(this.viewModel, "view");
    }

    /**
     * Search handler
     */
    public onSearch(event: Event): void {
        const searchField = event.getSource() as SearchField;
        const query = searchField.getValue();

        const filters: Filter[] = [];
        if (query && query.length > 0) {
            filters.push(new Filter("Name", FilterOperator.Contains, query));
        }

        const table = this.byId("productsTable") as Table;
        const binding = table.getBinding("items");
        binding?.filter(filters);
    }

    /**
     * Button press handler
     */
    public onPress(): void {
        const resourceBundle = this.getResourceBundle();
        MessageToast.show(resourceBundle.getText("buttonPressed") as string);
    }

    /**
     * Delete confirmation
     */
    public onDelete(): void {
        const resourceBundle = this.getResourceBundle();
        MessageBox.confirm(
            resourceBundle.getText("deleteConfirm") as string,
            {
                onClose: (action: string) => {
                    if (action === MessageBox.Action.OK) {
                        this.performDelete();
                    }
                }
            }
        );
    }

    /**
     * Get resource bundle
     */
    private getResourceBundle(): ResourceBundle {
        const model = this.getView()?.getModel("i18n") as ResourceModel;
        return model.getResourceBundle() as ResourceBundle;
    }

    /**
     * Perform delete operation
     */
    private performDelete(): void {
        // Delete logic here
        MessageToast.show("Item deleted");
    }
}
```

---

## TypeScript Model/Formatter

**src/model/formatter.ts**:
```typescript
import DateFormat from "sap/ui/core/format/DateFormat";
import NumberFormat from "sap/ui/core/format/NumberFormat";

export default {
    /**
     * Format date to localized string
     */
    formatDate(date: Date | string | null): string {
        if (!date) {
            return "";
        }

        const dateFormat = DateFormat.getDateInstance({
            pattern: "dd.MM.yyyy"
        });

        return dateFormat.format(new Date(date));
    },

    /**
     * Format currency
     */
    formatCurrency(amount: number | null, currency: string): string {
        if (amount === null || amount === undefined) {
            return "";
        }

        const currencyFormat = NumberFormat.getCurrencyInstance();
        return currencyFormat.format(amount, currency);
    },

    /**
     * Format status
     */
    formatStatus(status: string): string {
        const statusMap: Record<string, string> = {
            "A": "Approved",
            "R": "Rejected",
            "P": "Pending"
        };

        return statusMap[status] || status;
    },

    /**
     * Format status state
     */
    formatStatusState(status: string): string {
        const stateMap: Record<string, string> = {
            "A": "Success",
            "R": "Error",
            "P": "Warning"
        };

        return stateMap[status] || "None";
    }
};
```

---

## Custom Control in TypeScript

**src/control/CustomButton.ts**:
```typescript
import Button from "sap/m/Button";
import RenderManager from "sap/ui/core/RenderManager";

/**
 * @namespace my.sapui5.ts.app.control
 */
export default class CustomButton extends Button {
    public static metadata = {
        properties: {
            customProperty: {
                type: "string",
                defaultValue: ""
            }
        },
        events: {
            customPress: {
                parameters: {
                    value: { type: "string" }
                }
            }
        }
    };

    // Property getter/setter
    public getCustomProperty(): string {
        return this.getProperty("customProperty") as string;
    }

    public setCustomProperty(value: string): this {
        this.setProperty("customProperty", value);
        return this;
    }

    // Custom renderer
    public static renderer = {
        ...Button.renderer,

        render: function(rm: RenderManager, control: CustomButton): void {
            // Custom rendering logic
            Button.renderer.render(rm, control);
        }
    };

    /**
     * Custom method
     */
    public customMethod(): void {
        this.fireEvent("customPress", {
            value: this.getCustomProperty()
        });
    }
}
```

---

## Type Definitions for Custom Types

**src/types/index.d.ts**:
```typescript
declare namespace my.sapui5.ts.app {
    // Custom types
    interface Product {
        id: string;
        name: string;
        price: number;
        currency: string;
        category: string;
        status: "A" | "R" | "P";
    }

    interface AppConfiguration {
        apiUrl: string;
        timeout: number;
        debug: boolean;
    }

    type StatusType = "A" | "R" | "P";
    type ViewMode = "display" | "edit" | "create";
}
```

---

## Best Practices

### 1. Use Strict Mode

Enable strict TypeScript checking:
```json
{
    "compilerOptions": {
        "strict": true,
        "noImplicitAny": true,
        "strictNullChecks": true,
        "strictFunctionTypes": true
    }
}
```

### 2. Type Assertions

Use type assertions when type cannot be inferred:
```typescript
const table = this.byId("productsTable") as Table;
const model = this.getView()?.getModel() as JSONModel;
```

### 3. Optional Chaining

Use optional chaining for nullable values:
```typescript
const view = this.getView();
view?.setModel(model);
```

### 4. Generics with Models

Type your model data:
```typescript
interface Product {
    id: string;
    name: string;
    price: number;
}

const model = new JSONModel<Product[]>([]);
const data = model.getData(); // Type: Product[]
```

### 5. Event Typing

Type event handlers properly:
```typescript
import Event from "sap/ui/base/Event";
import Input from "sap/m/Input";

public onChange(event: Event): void {
    const input = event.getSource() as Input;
    const value = input.getValue();
}
```

---

## Common Issues

### Issue: Cannot find module 'sap/...'

**Solution**: Install type definitions:
```bash
npm install --save-dev @sapui5/types
```

Add to tsconfig.json:
```json
{
    "compilerOptions": {
        "types": ["@sapui5/types"]
    }
}
```

### Issue: Type errors with metadata

**Solution**: Use static metadata property:
```typescript
export default class MyController extends Controller {
    public static metadata = {
        // metadata here
    };
}
```

### Issue: 'this' implicitly has type 'any'

**Solution**: Use arrow functions or bind 'this':
```typescript
// Arrow function
.then((data) => {
    this.processData(data);
});

// Bind
.then(function(data) {
    this.processData(data);
}.bind(this));
```

---

## Compatibility

**TypeScript Version**: 4.0+ (5.0+ recommended)
**SAPUI5 Version**: 1.60+ (1.120+ recommended)
**Node.js Version**: 16+ (18+ recommended)

---

## Migration from JavaScript

### Step 1: Rename Files

Rename `.js` files to `.ts`:
```bash
mv Component.js Component.ts
mv controller/Main.controller.js controller/Main.controller.ts
```

### Step 2: Add Type Annotations

Add types gradually:
```typescript
// Before (JS)
onPress: function(oEvent) {
    var sValue = oEvent.getSource().getValue();
}

// After (TS)
public onPress(event: Event): void {
    const source = event.getSource() as Input;
    const value: string = source.getValue();
}
```

### Step 3: Fix Type Errors

Address compilation errors one by one:
- Add missing imports
- Type function parameters
- Use type assertions where needed
- Enable strict mode gradually

---

## Testing with TypeScript

**QUnit Test** (test/unit/model/formatter.ts):
```typescript
import formatter from "my/sapui5/ts/app/model/formatter";

QUnit.module("Formatter Tests");

QUnit.test("Should format date correctly", (assert) => {
    const date = new Date(2025, 0, 21);
    const result = formatter.formatDate(date);
    assert.ok(result.includes("21"), "Date formatted correctly");
});

QUnit.test("Should format currency", (assert) => {
    const result = formatter.formatCurrency(100, "EUR");
    assert.ok(result.includes("100"), "Currency formatted");
});
```

---

## Official Resources

- **TypeScript Documentation**: [https://github.com/SAP-docs/sapui5/tree/main/docs/02_Read-Me-First](https://github.com/SAP-docs/sapui5/tree/main/docs/02_Read-Me-First) (search: typescript)
- **UI5 TypeScript Tutorial**: [https://github.com/SAP-samples/ui5-typescript-tutorial](https://github.com/SAP-samples/ui5-typescript-tutorial)
- **TypeScript Guidelines**: Official SAPUI5 TypeScript guidelines
- **Sample Applications**: TypeScript To-Do List demo

---

---

## Advanced TypeScript Topics

For advanced TypeScript patterns including:
- **Metadata-Driven Controls (MDC)** with TypeScript
- **Control library development** in TypeScript
- Using `@ui5/ts-interface-generator` for control APIs
- Enum registration and library.ts patterns

See `references/mdc-typescript-advanced.md` for detailed implementation guides.

---

**Note**: This document covers TypeScript support in SAPUI5. The framework actively maintains type definitions, making TypeScript a viable choice for new projects and migrations.
