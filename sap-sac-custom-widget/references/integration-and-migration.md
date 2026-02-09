# SAP SAC Custom Widget Integration and Migration

Coverage of script integration, content transport, story compatibility, and planning features.

**Sources**:
- [SAP Community - Content Transport](https://community.sap.com/t5/technology-blog-posts-by-members/sac-content-transport-migration-using-ctms/ba-p/13742318)
- [Optimized Story Experience](https://community.sap.com/t5/technology-blog-posts-by-sap/the-new-optimized-story-experience-the-unification-of-story-and-analytic/ba-p/13558887)
- [Analytics Designer API Reference](https://help.sap.com/doc/958d4c11261f42e992e8d01a4c0dde25/release/en-US/index.html)

---

## Table of Contents

1. [Script Integration](#script-integration)
2. [Content Transport and Migration](#content-transport-and-migration)
3. [Story Compatibility](#story-compatibility)
4. [Planning Integration](#planning-integration)
5. [API Methods Reference](#api-methods-reference)

---

## Script Integration

### Global Script Objects

Custom widgets can interact with SAC's global script objects.

**Script Object Structure**:
- Script objects act as containers for reusable functions
- Functions not tied to events, invoked directly
- Accessible from all scripts in the story

**Invoking Script Functions**:
```javascript
// In SAC script
ScriptObjectName.ScriptFunctionName();

// Example
Utils.formatCurrency(1000, "USD"); // Returns "$1,000.00"
```

### Script Variables

**Global Variables**:
- Defined at story level
- Accessible from all script blocks
- Can receive values from URL parameters

**Using with Custom Widgets**:
```javascript
// In SAC script
var myValue = GlobalVariable_1;
CustomWidget_1.setValue(myValue);

// Widget method receives value
class MyWidget extends HTMLElement {
  setValue(val) {
    this._props.value = val;
    this._render();
  }
}
```

### Script Object Integration Pattern

```javascript
// Custom widget firing events for script handling
class MyWidget extends HTMLElement {
  _handleUserAction(data) {
    // Fire event that SAC script can handle
    this.dispatchEvent(new CustomEvent("onUserAction", {
      detail: { actionData: data }
    }));
  }
}

// In SAC script (event handler)
CustomWidget_1.onUserAction = function() {
  var eventData = CustomWidget_1.getEventInfo();
  // Process event, call other script objects
  DataProcessor.handleAction(eventData.actionData);
};
```

---

## Content Transport and Migration

### Transport Methods

**1. Content Network (Same Region)**
- Source and destination on same region
- Same or +1 quarterly version
- Access: Main Menu > Transport > Export/Import > Content Network Storage

**2. Import/Export (Any Region)**
- No region restriction
- Version constraints apply
- More flexible but manual

### Custom Widget Transport

**Supported Scenarios**:
- Cloud Foundry to Cloud Foundry tenants
- Same hosting configuration required

**Not Supported**:
- Cloud Foundry to Neo platform
- Different hosting configurations may cause issues

### Common Transport Issue

**Error**: "The system couldn't load the custom widget"

**Causes**:
- Widget JSON transported but resource files not accessible
- Different hosting URLs between source/target
- Integrity hash mismatch after transport

**Solution**:
```json
// Ensure resource URLs are accessible from target tenant
{
  "webcomponents": [
    {
      "kind": "main",
      "tag": "my-widget",
      "url": "[https://globally-accessible-host.com/widget.js",](https://globally-accessible-host.com/widget.js",)
      "integrity": "sha256-...",
      "ignoreIntegrity": false
    }
  ]
}
```

### Transport Best Practices

1. **Use globally accessible hosting** (GitHub Pages, CDN, SAC-hosted)
2. **Verify URLs before transport** - Ensure target can reach resource files
3. **Re-upload JSON** if hosting changes - Update URLs post-transport
4. **Test in target** before production use

### CTMS Integration

Cloud Transport Management Service (CTMS) provides automated transport:

1. Integrate CTMS with SAC
2. Define transport routes
3. Upload packages via SAC interface
4. CTMS handles deployment to destination

**Limitation**: CTMS is basic - no destination location selection like native Content Network.

---

## Story Compatibility

### Story Types

| Type | Custom Widgets | Scripting | CSS/Themes |
|------|----------------|-----------|------------|
| Classic Story | Limited | No | Limited |
| Optimized Story (Classic Responsive) | Yes | Limited | Limited |
| Optimized Story (Advanced Responsive) | Full | Full | Full |

### Optimized Story Experience (QRC Q2 2023+)

**Advanced Responsive Layout** features:
- Full custom widget support
- Complete scripting capabilities
- CSS and theme customization
- Device preview
- Data binding

### Classic Story Conversion

**Conversion Status Types**:

1. **Ready to convert** - No issues, direct conversion
2. **Feature limitation** - Some features not supported in optimized
3. **Blocked** - Issues must be resolved first

**Conversion Notes**:
- Conversion is permanent
- Save as copy recommended
- Converted stories use Classic Responsive Layout initially

### Custom Widget Compatibility

**In Optimized Stories**:
```json
{
  "id": "com.company.widget",
  "dataBindings": {
    "myData": {
      "feeds": [...]
    }
  }
}
```
- Full data binding support
- Script integration
- Builder/Styling panels

**In Classic Stories**:
- Limited support
- No data binding
- Basic property configuration only

---

## Planning Integration

### ⚠️ Important Limitations

Before implementing planning widgets, review these constraints:

1. **Builder Panel + Data Binding Conflict**: Cannot combine custom Builder Panel with data binding in the same widget
2. **Hierarchies Not Supported**: Data binding works with flat data only; select "flat" representation in SAC

See details in [Data Binding Limitations](#data-binding-limitations) below.

### Custom Widgets for Planning

Custom widgets can support SAP Analytics Cloud Planning scenarios:

**Use Cases**:
- Custom input controls
- Specialized data entry forms
- Planning workflow visualization
- Custom approval interfaces

### Data Binding Limitations

**Known Limitations**:

1. **Builder Panel + Data Binding Conflict**:
   - Cannot combine custom Builder Panel with data binding
   - Builder Panel overrides data binding functionality
   - Choose one approach per widget

2. **Hierarchies Not Supported**:
   - Data binding works with flat data only
   - Select "flat" representation in SAC properties
   - Hierarchical dimensions require alternative approach

### Planning API Integration

**Available through Script**:
```javascript
// In SAC script
var ds = Table_1.getDataSource();

// Planning operations (via DataSource)
ds.setUserInput(selection, value);  // Write data
ds.submitData();                     // Commit changes
ds.revertData();                     // Rollback
```

**Custom Widget Access**:
```javascript
// Widget receives DataSource via method
class PlanningWidget extends HTMLElement {
  async setDataSource(dataSource) {
    this._ds = dataSource;
    // Can now call dataSource methods
  }
}
```

### Input Control Pattern

```javascript
class CustomInputWidget extends HTMLElement {
  constructor() {
    super();
    this._setupInputHandlers();
  }

  _setupInputHandlers() {
    this._shadowRoot.getElementById("input").addEventListener("change", (e) => {
      // Fire event with new value
      this.dispatchEvent(new CustomEvent("onValueChange", {
        detail: { newValue: e.target.value }
      }));
    });
  }
}

// SAC script handles the planning write-back
CustomInputWidget_1.onValueChange = function() {
  var info = CustomInputWidget_1.getEventInfo();
  var selection = { "Account": "Forecast", "Time": "2024.Q1" };
  Table_1.getDataSource().setUserInput(selection, info.newValue);
};
```

---

## API Methods Reference

### DataSource Methods (via Script)

| Method | Description | Parameters |
|--------|-------------|------------|
| `getData(selection)` | Get data cell value | Selection object |
| `getResultSet()` | Get current result set | None |
| `getMembers(dimension)` | Get dimension members | Dimension name |
| `getResultMember(dim, selection)` | Get member info | Dimension, Selection |
| `getDimensionFilters(dimension)` | Get filter values | Dimension name |
| `setDimensionFilter(dim, member)` | Set filter | Dimension, MemberInfo |
| `removeDimensionFilter(dimension)` | Clear filter | Dimension name |

### Variable Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| `setVariableValue(name, value)` | Set variable | Variable name, value |
| `getVariableValues()` | Get all variables | None |

**Performance Tip**: Group `setVariableValue()` calls together for automatic request merging.

### Custom Widget Data Binding Methods

```javascript
// Access data binding
const binding = this.dataBindings.getDataBinding("myBinding");

// Get result set (async)
const resultSet = await binding.getResultSet();

// Direct property access
const data = this.myBinding.data;
const metadata = this.myBinding.metadata;
```

### Event Info Pattern

```javascript
// In custom widget
this.dispatchEvent(new CustomEvent("onSelect", {
  detail: {
    selectedId: "item-123",
    selectedValue: 100
  }
}));

// In SAC script
Widget_1.onSelect = function() {
  var info = Widget_1.getEventInfo();
  // info.selectedId = "item-123"
  // info.selectedValue = 100
};
```

---

## Migration Checklist

### Before Transport

- [ ] Verify resource file hosting is globally accessible
- [ ] Update URLs if changing hosting strategy
- [ ] Regenerate integrity hashes if files changed
- [ ] Test widget in source tenant
- [ ] Document any script dependencies

### After Transport

- [ ] Verify widget loads in target tenant
- [ ] Test all functionality
- [ ] Check script object references still work
- [ ] Verify data binding if applicable
- [ ] Test in view mode (not just edit mode)

### Troubleshooting

| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| Widget won't load | URL not accessible | Verify hosting, CORS |
| Integrity warning | Hash mismatch | Regenerate hash |
| Script errors | Missing script objects | Recreate in target |
| No data | Data binding lost | Reconfigure binding |
| Styling broken | CSS not loaded | Check styling panel config |

---

## Resources

- [Analytics Designer API Reference](https://help.sap.com/doc/958d4c11261f42e992e8d01a4c0dde25/release/en-US/index.html)
- [Custom Widget Developer Guide](https://help.sap.com/doc/c813a28922b54e50bd2a307b099787dc/release/en-US/CustomWidgetDevGuide_en.pdf)
- [SAC Content Transport](https://community.sap.com/t5/technology-blog-posts-by-members/sac-content-transport-migration-using-ctms/ba-p/13742318)
- [Optimized Story Experience](https://community.sap.com/t5/technology-blog-posts-by-sap/the-new-optimized-story-experience-the-unification-of-story-and-analytic/ba-p/13558887)

---

**Last Updated**: 2025-11-22
