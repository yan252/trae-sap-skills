# SAPUI5 Accessibility Guide

**Source**: Official SAP SAPUI5 Documentation
**Documentation**: [https://github.com/SAP-docs/sapui5/tree/main/docs/05_Developing_Apps](https://github.com/SAP-docs/sapui5/tree/main/docs/05_Developing_Apps)
**Last Updated**: 2025-11-21

---

## Overview

Accessibility in SAPUI5 ensures applications are usable by everyone, including people with disabilities. SAPUI5 controls include built-in accessibility features, but developers must implement them correctly.

**Standards**: SAPUI5 follows WCAG 2.1 (Web Content Accessibility Guidelines) Level AA.

**Key Principles**:
1. **Perceivable**: Information must be presentable to users in ways they can perceive
2. **Operable**: User interface components must be operable
3. **Understandable**: Information and operation must be understandable
4. **Robust**: Content must be robust enough to work with assistive technologies

**Documentation**: [https://github.com/SAP-docs/sapui5/tree/main/docs/05_Developing_Apps](https://github.com/SAP-docs/sapui5/tree/main/docs/05_Developing_Apps) (search: accessibility)

---

## Screen Reader Support

### Overview

Screen readers announce UI content to visually impaired users. SAPUI5 controls provide built-in screen reader support through ARIA attributes.

**Supported Screen Readers**:
- JAWS (Windows)
- NVDA (Windows)
- VoiceOver (macOS, iOS)
- TalkBack (Android)

### Implementation

**Automatic Support**:
Most SAP UI5 controls include screen reader support automatically:

```xml
<Button
    text="Save"
    icon="sap-icon://save"
    press=".onSave"/>
<!-- Automatically announces: "Save button" -->
```

**Custom Labels**:
```xml
<Input
    value="{/email}"
    ariaLabelledBy="emailLabel"/>

<Label
    id="emailLabel"
    text="Email Address"
    labelFor="emailInput"/>
```

**ARIA Descriptions**:
```xml
<Button
    text="Delete"
    ariaDescribedBy="deleteHint"/>

<InvisibleText
    id="deleteHint"
    text="This action cannot be undone"/>
```

### Invisible Text

Provide information only for screen readers:

```xml
<InvisibleText
    id="statusHint"
    text="Status: {status}. Last updated: {lastUpdate}"/>

<ObjectStatus
    text="{status}"
    state="{statusState}"
    ariaDescribedBy="statusHint"/>
```

**Use Cases**:
- Additional context not visible on screen
- Status changes announcements
- Navigation instructions
- Form validation messages

### Invisible Messaging

Announce dynamic content changes to screen readers:

```javascript
sap.ui.require([
    "sap/ui/core/InvisibleMessage",
    "sap/ui/core/library"
], function(InvisibleMessage, coreLibrary) {
    var InvisibleMessageMode = coreLibrary.InvisibleMessageMode;

    // Get instance
    var oInvisibleMessage = InvisibleMessage.getInstance();

    // Announce politely (after current announcement)
    oInvisibleMessage.announce("Data loaded successfully", InvisibleMessageMode.Polite);

    // Announce assertively (interrupts current announcement)
    oInvisibleMessage.announce("Error: Form submission failed", InvisibleMessageMode.Assertive);
});
```

**Modes**:
- `Polite`: Wait for current announcement to finish
- `Assertive`: Interrupt current announcement immediately

**Use Cases**:
- Loading states
- Error messages
- Success confirmations
- Dynamic content updates

---

## Keyboard Navigation

### Overview

All functionality must be accessible via keyboard without requiring a mouse.

**Standard Keys**:
- **Tab**: Move focus forward
- **Shift+Tab**: Move focus backward
- **Enter/Space**: Activate buttons, links
- **Arrow Keys**: Navigate within components
- **Esc**: Close dialogs, cancel actions
- **Home/End**: Jump to first/last item

### Focus Management

**Visible Focus Indicator**:
All focusable elements must have a visible focus indicator (automatically provided by SAPUI5 controls).

**Focus Order**:
```xml
<!-- Logical focus order -->
<VBox>
    <Input id="firstName" value="{/firstName}"/>
    <Input id="lastName" value="{/lastName}"/>
    <Input id="email" value="{/email}"/>
    <Button text="Submit" press=".onSubmit"/>
</VBox>
```

**Programmatic Focus**:
```javascript
// Set focus to control
this.byId("emailInput").focus();

// Set focus after dialog opens
oDialog.attachAfterOpen(function() {
    oDialog.getInitialFocus().focus();
});
```

### Keyboard Handling

**Handling Keyboard Events**:
```javascript
onKeyDown: function(oEvent) {
    // Check for specific key
    if (oEvent.keyCode === jQuery.sap.KeyCodes.ENTER) {
        this.onSave();
        oEvent.preventDefault();
    }

    // Check for Escape
    if (oEvent.keyCode === jQuery.sap.KeyCodes.ESCAPE) {
        this.onCancel();
    }
}
```

**Item Navigation**:
For custom list-like controls:

```javascript
sap.ui.require([
    "sap/ui/core/delegate/ItemNavigation"
], function(ItemNavigation) {
    onAfterRendering: function() {
        // Create item navigation
        this._oItemNavigation = new ItemNavigation();

        // Set root element and items
        this._oItemNavigation.setRootDomRef(this.getDomRef());
        this._oItemNavigation.setItemDomRefs(this.$().find(".item").toArray());

        // Configure navigation
        this._oItemNavigation.setCycling(false);
        this._oItemNavigation.setPageSize(10);

        // Attach to element
        this.addDelegate(this._oItemNavigation);
    },

    onExit: function() {
        if (this._oItemNavigation) {
            this._oItemNavigation.destroy();
        }
    }
});
```

### Fast Navigation

F6 key for quick navigation between major screen regions:

```javascript
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/CustomData"
], function(Controller, CustomData) {
    "use strict";

    return Controller.extend("my.app.controller.Main", {
        onInit: function() {
            // Mark sections for F6 navigation
            this.byId("headerSection").addCustomData(
                new CustomData({
                    key: "sap-ui-fastnavgroup",
                    value: "true"
                })
            );

            this.byId("contentSection").addCustomData(
                new CustomData({
                    key: "sap-ui-fastnavgroup",
                    value: "true"
                })
            );
        }
    });
});
```

**Use Cases**:
- Skip from header to content
- Jump to footer
- Navigate between major sections

---

## ARIA Implementation

### ARIA Attributes

**role**: Defines element type:
```xml
<div role="navigation">...</div>
<div role="main">...</div>
<div role="complementary">...</div>
```

**aria-label**: Provides accessible name:
```xml
<Button
    icon="sap-icon://delete"
    aria-label="Delete item"/>
```

**aria-labelledby**: References label element:
```xml
<Label id="nameLabel" text="Full Name"/>
<Input ariaLabelledBy="nameLabel"/>
```

**aria-describedby**: References description:
```xml
<Input
    value="{/password}"
    ariaDescribedBy="passwordHint"/>
<Text id="passwordHint" text="Must be at least 8 characters"/>
```

**aria-live**: Announces dynamic updates:
```xml
<Text
    text="{statusMessage}"
    aria-live="polite"/>
```

**aria-expanded**: Indicates expanded/collapsed state:
```xml
<Button
    text="Show Details"
    aria-expanded="{detailsVisible}"
    press=".onToggleDetails"/>
```

### Landmark Regions

Define major page sections using landmarks:

```javascript
sap.ui.require([
    "sap/ui/core/AccessibleLandmarkRole"
], function(AccessibleLandmarkRole) {
    // In XML view
    <Page
        landmarkInfo="{
            rootRole: 'Region',
            rootLabel: 'Product Details',
            contentRole: 'Main',
            contentLabel: 'Product Information',
            headerRole: 'Banner',
            headerLabel: 'Page Header',
            footerRole: 'Region',
            footerLabel: 'Page Actions'
        }">
    </Page>
});
```

**Standard Roles**:
- `banner`: Site header
- `navigation`: Navigation section
- `main`: Main content
- `complementary`: Supporting content
- `contentinfo`: Site footer
- `region`: Generic landmark
- `search`: Search functionality

---

## Labeling & Tooltips

### Labels

**Always Provide Labels**:
```xml
<!-- Good -->
<Label text="First Name" labelFor="firstName"/>
<Input id="firstName" value="{/firstName}"/>

<!-- Bad (no visible label) -->
<Input placeholder="First Name"/>  <!-- Placeholders are not labels -->
```

**Required Fields**:
```xml
<Label
    text="Email"
    required="true"
    labelFor="email"/>
<Input
    id="email"
    value="{/email}"
    required="true"/>
```

### Tooltips

Provide additional information:

```xml
<Button
    icon="sap-icon://hint"
    tooltip="Click for more information"
    press=".onShowHelp"/>
```

**Rich Tooltips**:
```xml
<Button icon="sap-icon://action-settings">
    <customData>
        <core:CustomData
            key="tooltip"
            value="Settings (Ctrl+,)"/>
    </customData>
</Button>
```

---

## Form Accessibility

### Field Labels

```xml
<form:SimpleForm>
    <Label text="First Name" required="true"/>
    <Input value="{/firstName}" required="true"/>

    <Label text="Last Name" required="true"/>
    <Input value="{/lastName}" required="true"/>

    <Label text="Email"/>
    <Input value="{/email}" type="Email"/>

    <Label text="Phone"/>
    <Input value="{/phone}" type="Tel"/>
</form:SimpleForm>
```

### Error Messages

```xml
<Input
    value="{/email}"
    valueState="{= ${/emailValid} ? 'None' : 'Error'}"
    valueStateText="Please enter a valid email address"/>
```

### Field Groups

```xml
<VBox>
    <Title text="Personal Information"/>
    <Input value="{/firstName}" ariaLabelledBy="personalInfoTitle"/>
    <Input value="{/lastName}" ariaLabelledBy="personalInfoTitle"/>
</VBox>
```

---

## Table Accessibility

### Column Headers

```xml
<Table items="{/products}">
    <columns>
        <Column>
            <Text text="Product Name"/>
        </Column>
        <Column>
            <Text text="Price"/>
        </Column>
        <Column>
            <Text text="Status"/>
        </Column>
    </columns>
    <items>
        <ColumnListItem>
            <cells>
                <Text text="{name}"/>
                <Text text="{price}"/>
                <ObjectStatus text="{status}" state="{statusState}"/>
            </cells>
        </ColumnListItem>
    </items>
</Table>
```

### Row Actions

```xml
<ColumnListItem type="Active" press=".onRowPress">
    <cells>
        <Text text="{name}"/>
    </cells>
    <customData>
        <core:CustomData
            key="aria-label"
            value="View details for {name}"/>
    </customData>
</ColumnListItem>
```

---

## High Contrast Themes

### Overview

High contrast themes help users with visual impairments.

**Available Themes**:
- `sap_fiori_3_hcb`: High Contrast Black
- `sap_fiori_3_hcw`: High Contrast White
- `sap_horizon_hcb`: Horizon High Contrast Black
- `sap_horizon_hcw`: Horizon High Contrast White

### Testing

Test your app with high contrast themes:

```javascript
// Switch theme programmatically
sap.ui.getCore().applyTheme("sap_horizon_hcb");
```

**In URL**:
```
[http://myapp.com/index.html?sap-ui-theme=sap_horizon_hcb](http://myapp.com/index.html?sap-ui-theme=sap_horizon_hcb)
```

### CSS Considerations

Use theme parameters, not hard-coded colors:

```css
/* Good */
.myClass {
    color: var(--sapUiContentForegroundColor);
    background-color: var(--sapUiBaseBG);
}

/* Bad */
.myClass {
    color: #333333;
    background-color: #ffffff;
}
```

---

## Right-to-Left (RTL) Support

### Overview

Support languages written right-to-left (Arabic, Hebrew, etc.).

### Configuration

**Enable RTL**:
```html
<script
    src="resources/sap-ui-core.js"
    data-sap-ui-rtl="true">
</script>
```

**Or programmatically**:
```javascript
sap.ui.getCore().getConfiguration().setRTL(true);
```

### CSS for RTL

Use logical properties:

```css
/* Good (automatically flipped in RTL) */
.myClass {
    padding-inline-start: 1rem;
    margin-inline-end: 0.5rem;
    border-inline-start: 1px solid;
}

/* Bad (not flipped) */
.myClass {
    padding-left: 1rem;
    margin-right: 0.5rem;
    border-left: 1px solid;
}
```

### Text Direction

```xml
<Text text="{description}" textDirection="Inherit"/>

<!-- Force LTR for codes/IDs -->
<Text text="{productId}" textDirection="LTR"/>
```

---

## Testing Accessibility

### Manual Testing

1. **Keyboard Navigation**:
   - Tab through all interactive elements
   - Verify focus visibility
   - Test Enter/Space activation
   - Test Esc key behavior

2. **Screen Reader**:
   - Test with JAWS, NVDA, or VoiceOver
   - Verify all content is announced
   - Check announcements are meaningful
   - Test dynamic content updates

3. **High Contrast**:
   - Switch to high contrast theme
   - Verify all content is visible
   - Check color contrast ratios

4. **Zoom**:
   - Zoom to 200%
   - Verify layout doesn't break
   - Check text remains readable

### Automated Testing

**Use UI5 Support Assistant**:
```javascript
// Enable support assistant
sap.ui.require(["sap/ui/support/RuleAnalyzer"], function(RuleAnalyzer) {
    RuleAnalyzer.analyze();
});
```

Or via keyboard: `Ctrl+Alt+Shift+S`

**Checks**:
- Missing labels
- Invalid ARIA attributes
- Keyboard navigation issues
- Color contrast problems

---

## Accessibility Checklist

### General
- [ ] All functionality keyboard accessible
- [ ] Focus indicators visible
- [ ] Logical focus order
- [ ] No keyboard traps
- [ ] Esc key closes dialogs

### Labeling
- [ ] All form fields have labels
- [ ] Required fields marked
- [ ] Error messages clear and accessible
- [ ] Buttons have meaningful labels
- [ ] Images have alt text

### ARIA
- [ ] Proper ARIA roles used
- [ ] aria-label or aria-labelledby on inputs
- [ ] aria-describedby for additional info
- [ ] aria-live for dynamic updates
- [ ] Landmark regions defined

### Screen Readers
- [ ] Test with screen reader
- [ ] All content announced
- [ ] Announcements meaningful
- [ ] InvisibleText used where needed
- [ ] Dynamic updates announced

### Visual
- [ ] Color contrast sufficient (4.5:1 for text)
- [ ] Works with high contrast themes
- [ ] Text remains readable at 200% zoom
- [ ] No information by color alone

### Tables
- [ ] Column headers defined
- [ ] Row headers where appropriate
- [ ] Summary/caption provided
- [ ] Complex tables avoided

---

## Common Issues

### Issue: Input without label

**Bad**:
```xml
<Input placeholder="Search..."/>
```

**Good**:
```xml
<Label text="Search" labelFor="searchInput"/>
<Input id="searchInput" placeholder="Enter search term..."/>
```

### Issue: Button with only icon

**Bad**:
```xml
<Button icon="sap-icon://delete" press=".onDelete"/>
```

**Good**:
```xml
<Button
    icon="sap-icon://delete"
    tooltip="Delete item"
    ariaLabel="Delete item"
    press=".onDelete"/>
```

### Issue: Dynamic content not announced

**Bad**:
```javascript
this.byId("statusText").setText("Loading complete");
```

**Good**:
```javascript
this.byId("statusText").setText("Loading complete");

// Announce to screen reader
var oInvisibleMessage = sap.ui.core.InvisibleMessage.getInstance();
oInvisibleMessage.announce("Loading complete", "Polite");
```

---

## Official Documentation

- **Accessibility**: [https://github.com/SAP-docs/sapui5/tree/main/docs/05_Developing_Apps](https://github.com/SAP-docs/sapui5/tree/main/docs/05_Developing_Apps) (search: accessibility)
- **Screen Reader Support**: [https://github.com/SAP-docs/sapui5/tree/main/docs/05_Developing_Apps](https://github.com/SAP-docs/sapui5/tree/main/docs/05_Developing_Apps) (search: screen-reader)
- **Keyboard Handling**: [https://github.com/SAP-docs/sapui5/tree/main/docs/05_Developing_Apps](https://github.com/SAP-docs/sapui5/tree/main/docs/05_Developing_Apps) (search: keyboard)
- **ARIA**: [https://www.w3.org/WAI/ARIA/](https://www.w3.org/WAI/ARIA/)
- **WCAG 2.1**: [https://www.w3.org/WAI/WCAG21/quickref/](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Note**: This document covers accessibility implementation in SAPUI5. Accessibility is not optional - it's a requirement for enterprise applications. Always test with keyboard and screen readers.
