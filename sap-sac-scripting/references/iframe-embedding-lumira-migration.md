# iFrame Embedding and Lumira Designer Migration

Reference documentation for iFrame PostMessage communication and migration guidance from Lumira Designer to SAP Analytics Cloud.

---

## Table of Contents

1. [iFrame Embedding with PostMessage](#iframe-embedding-with-postmessage)
2. [Differences Between SAP Analytics Cloud and Lumira Designer](#differences-between-sap-analytics-cloud-and-lumira-designer)

---

## iFrame Embedding with PostMessage

When your analytic application is embedded in an iFrame, it can communicate bidirectionally with the host web application using JavaScript PostMessage.

### Application Events for Embedded Scenarios

SAC analytic applications have two primary application events:

1. **onInitialization**: Runs once when the application is instantiated by a user
2. **onPostMessageReceived**: Triggered when the host application sends a PostMessage

### onPostMessageReceived Event

This event fires whenever the host application makes a PostMessage call into the embedded analytic application.

**Reference**: [https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)

### Event Parameters

The `onPostMessageReceived` event provides two input parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| `origin` | string | The domain of the host application |
| `message` | any | The message content passed via PostMessage |

### origin Parameter

The `origin` parameter contains the domain of the host application.

**Important Security Notes**:
- iFrame contents don't need to be in the same origin as the host app
- Same-origin policies may still be in effect
- Be careful about **clickjacking attacks** and **malicious iFrame hosts**
- **Always validate** the `origin` parameter to ensure the iFrame host is expected

**Security Best Practice**:
```javascript
// onPostMessageReceived event
if (origin !== "[https://trusted-domain.com](https://trusted-domain.com)") {
    console.log("Unauthorized origin: " + origin);
    return;  // Reject messages from unknown origins
}

// Process message from trusted origin
processMessage(message);
```

### message Parameter

The `message` parameter contains the standard JavaScript PostMessage content passed into SAP Analytics Cloud.

**Characteristics**:
- Does **not** follow any specific format
- Could contain almost any data type
- Encoded using the **structured clone algorithm**
- Some documented restrictions on what can and can't be encoded

### Structured Clone Algorithm

The structured clone algorithm has some limitations on what can be cloned:

**Supported**:
- Primitive types (string, number, boolean)
- Arrays
- Plain objects
- Date objects
- Map, Set, ArrayBuffer, TypedArray

**Not Supported**:
- Functions
- DOM nodes
- Symbols
- Error objects
- Property descriptors, setters, getters

### Example: Receiving PostMessage

```javascript
// onPostMessageReceived event handler
// Parameters: origin, message

// Security check
if (origin !== "[https://my-portal.company.com](https://my-portal.company.com)") {
    console.log("Rejected message from: " + origin);
    return;
}

// Log the received message
console.log("Received message from: " + origin);
console.log("Message content: " + JSON.stringify(message));

// Process message based on type
if (message.type === "filter") {
    // Apply filter from host application
    var dimension = message.dimension;
    var value = message.value;

    Chart_1.getDataSource().setDimensionFilter(dimension, value);

} else if (message.type === "refresh") {
    // Refresh data
    Chart_1.getDataSource().refreshData();

} else if (message.type === "navigate") {
    // Handle navigation request
    var pageId = message.pageId;
    // Navigate to page...
}
```

### Host Application Example

In the host web application (outside SAP Analytics Cloud):

```javascript
// Get reference to the SAC iFrame
var sacFrame = document.getElementById("sac-iframe");

// Send filter command to embedded SAC application
sacFrame.contentWindow.postMessage({
    type: "filter",
    dimension: "Region",
    value: "EMEA"
}, "[https://your-tenant.sapanalytics.cloud](https://your-tenant.sapanalytics.cloud)");

// Send refresh command
sacFrame.contentWindow.postMessage({
    type: "refresh"
}, "[https://your-tenant.sapanalytics.cloud](https://your-tenant.sapanalytics.cloud)");
```

### Security Recommendations

1. **Always validate origin**: Check that messages come from expected domains
2. **Use specific target origins**: Don't use `"*"` as target origin
3. **Validate message structure**: Ensure message format matches expectations
4. **Log suspicious activity**: Track rejected messages for security monitoring
5. **Implement allowlist**: Maintain list of trusted origins

```javascript
// Recommended: Origin allowlist pattern
var trustedOrigins = [
    "[https://portal.company.com",](https://portal.company.com",)
    "[https://intranet.company.com"](https://intranet.company.com")
];

// In onPostMessageReceived
var isTrusted = false;
for (var i = 0; i < trustedOrigins.length; i++) {
    if (origin === trustedOrigins[i]) {
        isTrusted = true;
        break;
    }
}

if (!isTrusted) {
    console.log("Blocked message from untrusted origin: " + origin);
    return;
}
```

---

## Differences Between SAP Analytics Cloud and Lumira Designer

Design Studio / Lumira Designer and SAP Analytics Cloud, analytics designer have broadly similar scripting environments. Both are JavaScript-based and perform similar missions. Analytics designer's scripting framework was informed by experience with Design Studio.

However, there are important differences to understand when migrating.

### Execution Environment

| Aspect | Lumira Designer | Analytics Designer (SAC) |
|--------|----------------|--------------------------|
| **Script Execution** | Server-side | Browser-side (client) |
| **Proximity** | Close to the data | Close to the user |
| **JavaScript Engine** | Server JavaScript engine | Browser native JavaScript |

**Key Implication**: This "close-to-data vs close-to-user" philosophical difference affects how you design scripts.

### Copy-and-Paste Compatibility

**Analytics Designer is NOT copy-and-paste compatible with Lumira Designer.**

Scripts written for Lumira Designer will likely need modification to work in Analytics Designer. This is partially a consequence of the architectural differences.

### Data Source Access

| Feature | Lumira Designer | Analytics Designer |
|---------|----------------|-------------------|
| Standalone Data Sources | Available as global variables | Hidden within data-bound widgets |
| Access Method | Direct access by name | Must use `getDataSource()` method |

**Lumira Designer**:
```javascript
// Direct access to data source
DS_1.setFilter("Location", "USA");
```

**Analytics Designer**:
```javascript
// Access through widget
var ds = Chart_1.getDataSource();
ds.setDimensionFilter("Location", "USA");
```

**Note**: When standalone data sources become available in SAC, you'll be able to access them as global variables, similar to Lumira.

### Type System Differences

| Feature | Lumira Designer | Analytics Designer |
|---------|----------------|-------------------|
| Type Conversion | More lenient | Strict (no automatic conversion) |
| Equality Operator | `==` works across types | `==` only valid with same types |
| Recommended Operator | `==` or `===` | `===` (strict equality) |

**Lumira Designer** (allowed):
```javascript
var aNumber = 1;
if (aNumber == "1") {  // Works - auto type coercion
    // Executes
}
```

**Analytics Designer** (must use explicit conversion or strict equality):
```javascript
var aNumber = 1;

// Option 1: Strict equality with correct type
if (aNumber === 1) {  // Recommended
    // Executes
}

// Option 2: Explicit conversion
if (aNumber.toString() === "1") {
    // Executes
}

// WRONG: Different types with ==
// if (aNumber == "1") { }  // Error in SAC!
```

### API Method Names

Some API methods have different names between platforms:

| Operation | Lumira Designer | Analytics Designer |
|-----------|----------------|-------------------|
| Set filter | `setFilter()` | `setDimensionFilter()` |
| Remove filter | `removeFilter()` | `removeDimensionFilter()` |
| Get filter | `getFilter()` | `getDimensionFilters()` |

### Summary of Key Migration Steps

When migrating from Lumira Designer to SAP Analytics Cloud:

1. **Update data source access**: Change direct data source references to `widget.getDataSource()`

2. **Fix type conversions**: Add explicit `.toString()` or other conversion methods

3. **Update equality operators**: Change `==` to `===` for comparisons, especially with different types

4. **Update API method names**: Replace Lumira-specific methods with SAC equivalents

5. **Review script location**: Consider that scripts now run in browser, not on server

6. **Test thoroughly**: Behavior may differ due to execution environment changes

### Example Migration

**Original Lumira Designer Script**:
```javascript
// Lumira Designer
DS_1.setFilter("Year", selectedYear);
var members = DS_1.getMembers("Location");
var count = members.length;
console.log("Count: " + count);  // Auto-converts count to string
```

**Migrated Analytics Designer Script**:
```javascript
// Analytics Designer (SAC)
var ds = Chart_1.getDataSource();
ds.setDimensionFilter("Year", selectedYear);
var members = ds.getMembers("Location");
var count = members.length;
console.log("Count: " + count.toString());  // Explicit conversion required
```

---

## Additional Resources

- **SAP Analytics Designer Documentation**: [https://help.sap.com/docs/SAP_ANALYTICS_CLOUD](https://help.sap.com/docs/SAP_ANALYTICS_CLOUD)
- **Lumira Designer Migration Guide**: Check SAP Help Portal for official migration documentation
- **PostMessage API**: [https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)

---

**Source**: SAP Analytics Designer Development Guide - Chapter 4: Scripting in Analytics Designer (Sections 4.2.3.1 and 4.10)
**Last Updated**: 2025-11-23
