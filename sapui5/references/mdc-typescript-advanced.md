# Metadata-Driven Controls (MDC) and TypeScript Control Library Development

**Sources**: 
- MDC Tutorial: [https://github.com/SAP-samples/ui5-mdc-json-tutorial](https://github.com/SAP-samples/ui5-mdc-json-tutorial)
- TypeScript Control Library: [https://github.com/SAP-samples/ui5-typescript-control-library](https://github.com/SAP-samples/ui5-typescript-control-library)
**Last Updated**: 2025-11-22

---

## Overview

This reference covers two advanced SAPUI5 TypeScript topics:
1. **Metadata-Driven Controls (MDC)**: Building dynamic UIs driven by metadata at runtime
2. **TypeScript Control Libraries**: Developing reusable UI5 control libraries in TypeScript

Both topics use TypeScript as the implementation language and represent modern best practices for SAPUI5 development.

---

## Part A: Metadata-Driven Controls (MDC)

### What is MDC?

Metadata-Driven Controls (sap.ui.mdc) are powerful UI5 controls that allow dynamic UI creation at runtime based on metadata. Instead of explicitly defining every control, you configure and modify them based on provided metadata.

**Official Documentation**:
- API Reference: [https://sdk.openui5.org/api/sap.ui.mdc](https://sdk.openui5.org/api/sap.ui.mdc)
- Documentation: [https://sdk.openui5.org/topic/1dd2aa91115d43409452a271d11be95b](https://sdk.openui5.org/topic/1dd2aa91115d43409452a271d11be95b)

**Key Benefits**:
- Dynamic UI generation at runtime
- Flexible customization through delegates
- Built-in personalization and variant management
- Consistent filter and table patterns

---

### Core MDC Concepts

#### 1. Control Delegates

Delegates implement service or application-specific behavior for MDC controls. They customize default behavior depending on specific needs.

**Delegate Responsibilities**:
- Custom control creation
- Metadata provision
- Data binding configuration
- Service-specific adaptations

**Example Delegate Structure**:
```typescript
import TableDelegate from "sap/ui/mdc/TableDelegate";

const CustomTableDelegate = Object.assign({}, TableDelegate);

CustomTableDelegate.fetchProperties = async function(table) {
    return [
        {
            name: "name",
            label: "Name",
            dataType: "sap.ui.model.type.String"
        },
        {
            name: "price",
            label: "Price",
            dataType: "sap.ui.model.type.Float"
        }
    ];
};

export default CustomTableDelegate;
```

#### 2. PropertyInfo

PropertyInfo defines metadata that controls how MDC components behave. It describes the data characteristics and control settings.

**PropertyInfo Structure**:
```typescript
interface PropertyInfo {
    name: string;           // Unique identifier
    label: string;          // Display label
    dataType: string;       // Data type (sap.ui.model.type.*)
    path?: string;          // Binding path
    sortable?: boolean;     // Can be sorted
    filterable?: boolean;   // Can be filtered
    groupable?: boolean;    // Can be grouped
    maxConditions?: number; // Max filter conditions
}
```

**Example**:
```typescript
const propertyInfo: PropertyInfo[] = [
    {
        name: "productId",
        label: "Product ID",
        dataType: "sap.ui.model.type.String",
        sortable: true,
        filterable: true
    },
    {
        name: "price",
        label: "Price",
        dataType: "sap.ui.model.type.Float",
        sortable: true,
        filterable: true,
        maxConditions: -1  // Unlimited conditions
    }
];
```

#### 3. TypeMap

TypeMap enables custom types in MDC controls. When standard types are insufficient, you can add custom types.

**Registering Custom Types**:
```typescript
import DefaultTypeMap from "sap/ui/mdc/DefaultTypeMap";
import BaseType from "sap/ui/mdc/enums/BaseType";

// Register custom type
DefaultTypeMap.set(
    "my.custom.Type",
    BaseType.String,
    {
        // Type configuration
    }
);
```

#### 4. VariantManagement

VariantManagement saves user personalization settings (table layout, filter conditions, etc.) for later retrieval.

**Enabling Variant Management**:
```xml
<mdc:Table
    id="mdcTable"
    p13nMode="Sort,Filter,Column"
    variantManagement="Page">
    <!-- Table content -->
</mdc:Table>
```

---

### MDC Controls

#### MDC Table

Display data in tabular format with dynamic columns:

```xml
<mvc:View
    xmlns:mvc="sap.ui.core.mvc"
    xmlns:mdc="sap.ui.mdc"
    xmlns:mdcTable="sap.ui.mdc.table">

    <mdc:Table
        id="mdcTable"
        delegate='{name: "my/app/delegate/TableDelegate", payload: {}}'
        p13nMode="Sort,Filter,Column"
        type="ResponsiveTable">
        <mdc:columns>
            <mdcTable:Column
                propertyKey="name"
                header="Name">
                <Text text="{name}"/>
            </mdcTable:Column>
            <mdcTable:Column
                propertyKey="price"
                header="Price">
                <Text text="{price}"/>
            </mdcTable:Column>
        </mdc:columns>
    </mdc:Table>
</mvc:View>
```

#### MDC FilterBar

Complex filtering with PropertyInfo:

```xml
<mdc:FilterBar
    id="filterBar"
    delegate='{name: "my/app/delegate/FilterBarDelegate", payload: {}}'
    p13nMode="Item,Value">
    <mdc:filterItems>
        <mdc:FilterField
            propertyKey="name"
            label="Name"
            dataType="sap.ui.model.type.String"
            conditions="{$filters>/conditions/name}"/>
        <mdc:FilterField
            propertyKey="price"
            label="Price"
            dataType="sap.ui.model.type.Float"
            conditions="{$filters>/conditions/price}"/>
    </mdc:filterItems>
</mdc:FilterBar>
```

#### MDC Value Help

Assisted data input with suggestions:

```xml
<mdc:FilterField
    propertyKey="category"
    label="Category"
    valueHelp="categoryValueHelp">
</mdc:FilterField>

<mdc:ValueHelp
    id="categoryValueHelp"
    delegate='{name: "my/app/delegate/ValueHelpDelegate", payload: {}}'>
    <mdc:typeahead>
        <mdcvh:Popover title="Categories">
            <mdcvh:content>
                <mdcvh:MTable
                    keyPath="categoryId"
                    descriptionPath="categoryName">
                </mdcvh:MTable>
            </mdcvh:content>
        </mdcvh:Popover>
    </mdc:typeahead>
</mdc:ValueHelp>
```

---

### MDC Tutorial Exercises

The official SAP MDC tutorial ([https://github.com/SAP-samples/ui5-mdc-json-tutorial](https://github.com/SAP-samples/ui5-mdc-json-tutorial)) covers:

| Exercise | Topic | Key Learnings |
|----------|-------|---------------|
| ex0 | Project Setup | TypeScript configuration, dependencies |
| ex1 | MDC Table | Table delegate, columns, PropertyInfo |
| ex2 | MDC FilterBar | Filter delegate, filter fields, conditions |
| ex3 | Value Helps | Value help delegate, typeahead, popover |
| ex4 | Custom Types | TypeMap, custom type registration |
| ex5 | VariantManagement | Personalization, saving variants |

**Running the Tutorial**:
```bash
git clone [https://github.com/SAP-samples/ui5-mdc-json-tutorial.git](https://github.com/SAP-samples/ui5-mdc-json-tutorial.git)
cd ui5-mdc-json-tutorial/ex5  # Or any exercise
npm install
npm start
```

---

## Part B: TypeScript Control Library Development

### Overview

Developing UI5 control libraries in TypeScript provides type safety, better tooling support, and improved maintainability for reusable components.

**Source Repository**: [https://github.com/SAP-samples/ui5-typescript-control-library](https://github.com/SAP-samples/ui5-typescript-control-library)

---

### Project Setup

#### Package.json

```json
{
    "name": "my-ui5-control-library",
    "version": "1.0.0",
    "scripts": {
        "build": "ui5 build --config ui5-dist.yaml",
        "start": "ui5 serve --open /test-resources/index.html",
        "watch": "npm-run-all --parallel watch:ts start:server",
        "watch:ts": "npx @ui5/ts-interface-generator --watch",
        "start:server": "ui5 serve --open /test-resources/index.html",
        "test": "karma start karma-ci.conf.js",
        "build:jsdoc": "ui5 build jsdoc --config ui5-jsdoc.yaml"
    },
    "devDependencies": {
        "@sapui5/types": "^1.120.0",
        "@ui5/cli": "^3.0.0",
        "@ui5/ts-interface-generator": "^0.8.0",
        "typescript": "^5.0.0",
        "ui5-tooling-transpile": "^3.0.0"
    }
}
```

#### tsconfig.json

```json
{
    "compilerOptions": {
        "target": "es2022",
        "module": "es2022",
        "moduleResolution": "node",
        "lib": ["es2022", "dom"],
        "types": ["@sapui5/types"],
        "outDir": "./dist",
        "rootDir": "./src",
        "strict": true,
        "skipLibCheck": true,
        "paths": {
            "com/myorg/myui5lib/*": ["./src/*"]
        }
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "dist"]
}
```

**Important**: The `paths` mapping enables references using the library name to work correctly.

#### ui5.yaml

```yaml
specVersion: "3.0"
metadata:
  name: com.myorg.myui5lib
type: library
framework:
  name: SAPUI5
  version: "1.120.0"
  libraries:
    - name: sap.m
    - name: sap.ui.core
builder:
  customTasks:
    - name: ui5-tooling-transpile-task
      afterTask: replaceVersion
server:
  customMiddleware:
    - name: ui5-tooling-transpile-middleware
      afterMiddleware: compression
    - name: ui5-middleware-livereload
      afterMiddleware: compression
```

---

### Control Implementation

#### Control File (src/Example.ts)

```typescript
import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import type { MetadataOptions } from "sap/ui/core/Element";

/**
 * Custom Example Control
 * @namespace com.myorg.myui5lib
 * @name com.myorg.myui5lib.Example
 */
export default class Example extends Control {
    // Metadata definition
    static readonly metadata: MetadataOptions = {
        library: "com.myorg.myui5lib",
        properties: {
            /**
             * The text to display
             */
            text: {
                type: "string",
                defaultValue: ""
            },
            /**
             * The color variant
             */
            color: {
                type: "com.myorg.myui5lib.ExampleColor",
                defaultValue: "Default"
            }
        },
        events: {
            /**
             * Fired when the control is pressed
             */
            press: {}
        },
        aggregations: {
            /**
             * Hidden aggregation for internal content
             */
            _content: {
                type: "sap.ui.core.Control",
                multiple: false,
                visibility: "hidden"
            }
        }
    };

    // Constructor signatures for TypeScript
    constructor(id?: string | $ExampleSettings);
    constructor(id?: string, settings?: $ExampleSettings);
    constructor(id?: string, settings?: $ExampleSettings) {
        super(id, settings);
    }

    // Renderer
    static renderer = {
        apiVersion: 2,
        render: function(rm: RenderManager, control: Example): void {
            rm.openStart("div", control);
            rm.class("myExampleControl");
            rm.openEnd();
            rm.text(control.getText());
            rm.close("div");
        }
    };

    // Event handler
    onclick(): void {
        this.fireEvent("press");
    }
}
```

**Key Points**:
- Use `@name` JSDoc tag with full control name for proper transformation
- Import `MetadataOptions` from `sap/ui/core/Element` for type safety
- Include constructor signatures for TypeScript awareness
- Export as default export immediately with class definition

#### Interface Generation

The `@ui5/ts-interface-generator` creates TypeScript interfaces for generated accessor methods (getText, setText, etc.):

```bash
# Run once
npx @ui5/ts-interface-generator

# Watch mode during development
npx @ui5/ts-interface-generator --watch
```

This generates `Example.gen.d.ts` next to each control file with declarations like:
```typescript
interface $ExampleSettings extends $ControlSettings {
    text?: string;
    color?: ExampleColor;
    press?: (event: Event) => void;
}

interface Example {
    getText(): string;
    setText(text: string): this;
    getColor(): ExampleColor;
    setColor(color: ExampleColor): this;
    attachPress(handler: Function): this;
    detachPress(handler: Function): this;
    firePress(): this;
}
```

---

### Library File (src/library.ts)

```typescript
import ObjectPath from "sap/base/util/ObjectPath";
import { registerLibrary } from "sap/ui/core/Lib";

/**
 * My UI5 Control Library
 * @namespace com.myorg.myui5lib
 */

// Library version (replaced during build)
const version = "${version}";

// Register library
registerLibrary("com.myorg.myui5lib", {
    name: "com.myorg.myui5lib",
    version: version,
    dependencies: ["sap.ui.core", "sap.m"],
    types: ["com.myorg.myui5lib.ExampleColor"],
    interfaces: [],
    controls: ["com.myorg.myui5lib.Example"],
    elements: [],
    noLibraryCSS: false
});

// Define enum
export enum ExampleColor {
    Default = "Default",
    Highlight = "Highlight",
    Warning = "Warning"
}

// CRITICAL: Attach enum to global namespace for UI5 runtime
const thisLib = ObjectPath.get("com.myorg.myui5lib") as Record<string, unknown>;
thisLib.ExampleColor = ExampleColor;
```

**Critical Note**: Enums must be attached to the global namespace using `ObjectPath.get()`. UI5 needs this to find enum types for control properties. Forgetting this can cause XSS vulnerabilities!

---

### Renderer File (src/ExampleRenderer.ts)

For complex renderers, create a separate file:

```typescript
import RenderManager from "sap/ui/core/RenderManager";
import Example from "./Example";

/**
 * Example renderer
 * @namespace com.myorg.myui5lib
 */
export default {
    apiVersion: 2,

    render: function(rm: RenderManager, control: Example): void {
        rm.openStart("div", control);
        rm.class("myorgMyui5libExample");

        // Add color class
        const color = control.getColor();
        if (color) {
            rm.class("myorgMyui5libExample" + color);
        }

        rm.openEnd();

        // Render text
        rm.openStart("span");
        rm.class("myorgMyui5libExampleText");
        rm.openEnd();
        rm.text(control.getText());
        rm.close("span");

        rm.close("div");
    }
};
```

---

### Testing

#### Karma Configuration (karma-ci.conf.js)

```javascript
module.exports = function(config) {
    config.set({
        frameworks: ["ui5", "qunit"],
        browsers: ["ChromeHeadless"],
        ui5: {
            configPath: "ui5.yaml"
        },
        singleRun: true
    });
};
```

#### QUnit Test (test/Example.qunit.ts)

```typescript
import Example from "com/myorg/myui5lib/Example";
import { ExampleColor } from "com/myorg/myui5lib/library";

QUnit.module("Example Control Tests");

QUnit.test("Should create control with default values", (assert) => {
    const control = new Example();
    assert.strictEqual(control.getText(), "", "Default text is empty");
    assert.strictEqual(control.getColor(), ExampleColor.Default, "Default color");
    control.destroy();
});

QUnit.test("Should set and get text", (assert) => {
    const control = new Example({ text: "Hello" });
    assert.strictEqual(control.getText(), "Hello", "Text set correctly");
    control.destroy();
});

QUnit.test("Should fire press event", (assert) => {
    const done = assert.async();
    const control = new Example();

    control.attachPress(() => {
        assert.ok(true, "Press event fired");
        control.destroy();
        done();
    });

    control.firePress();
});
```

---

### Build and Distribution

```bash
# Development
npm start                 # Start dev server with live reload
npm run watch            # Watch mode with interface generation

# Testing
npm test                 # Run Karma tests
npm run test:coverage    # With coverage

# Production build
npm run build            # Build for distribution

# Documentation
npm run build:jsdoc      # Generate JSDoc documentation
```

---

### Usage in Applications

#### Non-TypeScript Applications

TypeScript libraries work in JavaScript apps:

```javascript
sap.ui.define([
    "com/myorg/myui5lib/Example"
], function(Example) {
    var oExample = new Example({
        text: "Hello",
        color: "Highlight"
    });
});
```

#### TypeScript Applications

```typescript
import Example from "com/myorg/myui5lib/Example";
import { ExampleColor } from "com/myorg/myui5lib/library";

const example = new Example({
    text: "Hello",
    color: ExampleColor.Highlight
});
```

---

## Best Practices

### MDC Best Practices

1. **Use TypeScript for MDC**: SAP recommends TypeScript for MDC development
2. **Design delegates carefully**: Delegates define behavior; keep them focused
3. **Define PropertyInfo completely**: Include all necessary metadata upfront
4. **Enable personalization**: Use p13nMode for user customization
5. **Test with multiple models**: MDC works with JSON, OData v2, and OData v4

### TypeScript Control Library Best Practices

1. **Use @ui5/ts-interface-generator**: Essential for accessor method types
2. **Register enums globally**: Critical for UI5 runtime to find types
3. **Export defaults immediately**: Combine export with class definition
4. **Type metadata as MetadataOptions**: Enables type checking and inheritance
5. **Use forward slashes in paths**: Cross-platform compatibility
6. **Version types with UI5 version**: Match @sapui5/types version to framework

---

## Common Issues

### Issue: TypeScript doesn't know control accessor methods

**Solution**: Run the interface generator:
```bash
npx @ui5/ts-interface-generator
```

### Issue: Enum not found at runtime

**Solution**: Ensure enum is attached to global namespace in library.ts:
```typescript
const thisLib = ObjectPath.get("com.myorg.myui5lib") as Record<string, unknown>;
thisLib.ExampleColor = ExampleColor;
```

### Issue: Delegate methods not called

**Solution**: Verify delegate path in XML view matches actual module path:
```xml
delegate='{name: "my/app/delegate/TableDelegate", payload: {}}'
```

### Issue: HMR crashes with interface generator

**Solution**: Use separate terminal for interface generator or use npm-run-all:
```bash
npm-run-all --parallel watch:ts start:server
```

---

## Resources

### MDC Resources
- **MDC Tutorial**: [https://github.com/SAP-samples/ui5-mdc-json-tutorial](https://github.com/SAP-samples/ui5-mdc-json-tutorial)
- **MDC API Reference**: [https://sdk.openui5.org/api/sap.ui.mdc](https://sdk.openui5.org/api/sap.ui.mdc)
- **MDC Documentation**: [https://sdk.openui5.org/topic/1dd2aa91115d43409452a271d11be95b](https://sdk.openui5.org/topic/1dd2aa91115d43409452a271d11be95b)
- **MDC Demokit Sample**: [https://sdk.openui5.org/entity/sap.ui.mdc/sample/sap.ui.mdc.demokit.sample.TableFilterBarJson](https://sdk.openui5.org/entity/sap.ui.mdc/sample/sap.ui.mdc.demokit.sample.TableFilterBarJson)

### TypeScript Control Library Resources
- **Sample Repository**: [https://github.com/SAP-samples/ui5-typescript-control-library](https://github.com/SAP-samples/ui5-typescript-control-library)
- **TypeScript Interface Generator**: [https://github.com/SAP/ui5-typescript/tree/main/packages/ts-interface-generator](https://github.com/SAP/ui5-typescript/tree/main/packages/ts-interface-generator)
- **UI5 Tooling Transpile**: [https://www.npmjs.com/package/ui5-tooling-transpile](https://www.npmjs.com/package/ui5-tooling-transpile)
- **TypeScript Hello World**: [https://github.com/SAP-samples/ui5-typescript-helloworld](https://github.com/SAP-samples/ui5-typescript-helloworld)

---

**Note**: Both tutorials are actively maintained by SAP. The TypeScript control library sample was last updated November 14, 2025, and the MDC tutorial April 29, 2025.
