# UI5 Code Quality Checklist

## Table of Contents

1. [Architecture Review](#architecture-review)
2. [Performance Checklist](#performance-checklist)
3. [Security Checklist](#security-checklist)
4. [Accessibility Checklist](#accessibility-checklist)
5. [Testing Checklist](#testing-checklist)
6. [Build Configuration](#build-configuration)
7. [Code Style Checklist](#code-style-checklist)
8. [Documentation Checklist](#documentation-checklist)
9. [Pre-Deployment Checklist](#pre-deployment-checklist)

---

## Architecture Review

### MVC Pattern Compliance

- [ ] **Controllers**: No business logic, only view logic
  - Controllers orchestrate view and model
  - No direct DOM manipulation
  - No SQL queries or complex calculations

- [ ] **Models**: All data access through models
  - JSON Model for local data
  - OData Model for backend data
  - No hardcoded data in views or controllers

- [ ] **Views**: Declarative XML views (preferred)
  - No JavaScript in views
  - Data binding for all dynamic content
  - Proper use of fragments for reusable UI

### Component Structure

- [ ] **Component-based architecture**: Application uses Component.js
- [ ] **Manifest-first**: All configuration in manifest.json
  - Models defined in manifest
  - Routing configured in manifest
  - Dependencies listed in manifest

- [ ] **Proper namespace**: Reverse domain notation
  ```
  ✅ com.mycompany.myapp
  ❌ myapp
  ```

- [ ] **No global variables**: All code in proper modules
- [ ] **Dependency injection**: Use sap.ui.define for all modules

### File Organization

- [ ] **Logical grouping**: Controllers and views grouped by feature
  ```
  webapp/
  ├── controller/
  │   ├── products/
  │   │   ├── List.controller.js
  │   │   └── Detail.controller.js
  │   └── orders/
  │       └── List.controller.js
  ├── view/
  │   ├── products/
  │   │   ├── List.view.xml
  │   │   └── Detail.view.xml
  │   └── orders/
  │       └── List.view.xml
  ```

- [ ] **Shared code in model/**: Formatters, utilities, constants
- [ ] **i18n folder**: All translatable texts
- [ ] **No duplicate code**: Reusable code extracted to utilities

---

## Performance Checklist

### Component Preload

- [ ] **Component-preload.js**: Generated during build
- [ ] **ui5.yaml configured**: componentPreload enabled
  ```yaml
  builder:
    componentPreload:
      paths:
        - "webapp/Component.js"
  ```

- [ ] **Production build**: Always use `ui5 build --all`

### Lazy Loading

- [ ] **On-demand module loading**: Use `sap.ui.require` for non-critical modules
  ```javascript
  sap.ui.require(["sap/m/MessageBox"], function(MessageBox) {
    MessageBox.show("Loaded on demand");
  });
  ```

- [ ] **Fragment lazy loading**: Load fragments only when needed
- [ ] **Image optimization**: Use appropriate image formats (WebP, SVG)

### Data Binding Optimization

- [ ] **Batch requests**: OData batch mode enabled
  ```javascript
  useBatch: true
  ```

- [ ] **Server-side operations**: Filtering, sorting, paging on server
  ```xml
  <Table items="{
    path: '/Products',
    parameters: {
      $select: 'ID,Name,Price',
      $top: 20
    }
  }">
  ```

- [ ] **Auto-expand-select**: OData V4 auto-expansion
  ```javascript
  autoExpandSelect: true
  ```

### List Virtualization

- [ ] **Large lists**: Use `sap.ui.table.Table` (virtualized) for 100+ items
  ```xml
  <!-- ❌ Wrong for large data -->
  <m:List items="{/Products}">

  <!-- ✅ Correct for large data -->
  <table:Table rows="{/Products}" visibleRowCount="20">
  ```

- [ ] **Growing lists**: Use growing feature for mobile
  ```xml
  <m:List growing="true" growingThreshold="20">
  ```

### Resource Optimization

- [ ] **Minimize bundle size**: Remove unused libraries from manifest
- [ ] **Compression**: Enable gzip/brotli on server
- [ ] **CDN usage**: Load UI5 from SAP CDN (production)
  ```html
  <script src="https://ui5.sap.com/1.120.0/resources/sap-ui-core.js"></script>
  ```

- [ ] **Cache headers**: Set proper cache headers for static resources

---

## Security Checklist

### XSS Prevention

- [ ] **Data binding**: Always use data binding, never innerHTML
  ```xml
  <!-- ✅ Correct -->
  <Text text="{/userName}"/>

  <!-- ❌ Wrong -->
  <HTML content="{/userInput}"/>
  ```

- [ ] **Input validation**: Validate all user input
  ```javascript
  var sInput = oEvent.getParameter("value");
  if (!/^[a-zA-Z0-9]+$/.test(sInput)) {
    oInput.setValueState("Error");
    return;
  }
  ```

- [ ] **Sanitize HTML**: Use `jQuery.sap.encodeHTML` (if needed)

### Content Security Policy (CSP)

- [ ] **No inline scripts**: All JS in external files
- [ ] **No eval()**: Never use eval, new Function(), or setTimeout with strings
- [ ] **CSP headers**: Configure CSP headers on server
  ```
  Content-Security-Policy: default-src 'self'; script-src 'self' ui5.sap.com
  ```

### Authentication & Authorization

- [ ] **Session management**: Proper session timeout
- [ ] **Token-based auth**: Use JWT or OAuth tokens
- [ ] **CSRF protection**: Enable CSRF tokens for OData
  ```javascript
  // OData V2
  oModel.setHeaders({
    "X-CSRF-Token": "Fetch"
  });
  ```

- [ ] **Role-based access**: Check user permissions before actions

### Secure Communication

- [ ] **HTTPS only**: Never use HTTP in production
- [ ] **Secure cookies**: HttpOnly and Secure flags
- [ ] **CORS configuration**: Whitelist specific domains
  ```javascript
  Access-Control-Allow-Origin: https://myapp.com
  ```

---

## Accessibility Checklist

### WCAG 2.1 AA Compliance

- [ ] **Semantic HTML**: Use proper HTML5 elements
- [ ] **ARIA attributes**: Add ARIA labels where needed
  ```xml
  <Button text="Delete" ariaLabelledBy="deleteLabel"/>
  <Text id="deleteLabel" text="Delete selected item"/>
  ```

- [ ] **Keyboard navigation**: All functionality accessible via keyboard
  - Tab through all interactive elements
  - Enter/Space activates buttons
  - Arrow keys navigate lists

- [ ] **Focus indicators**: Visible focus outlines
  ```css
  /* Don't remove focus outlines */
  *:focus {
    outline: 2px solid #0854A0; /* SAP Blue */
  }
  ```

### Screen Reader Support

- [ ] **Alt text**: All images have alt text
  ```xml
  <Image src="logo.png" alt="Company Logo"/>
  ```

- [ ] **Form labels**: All inputs have labels
  ```xml
  <Label text="Name" labelFor="nameInput"/>
  <Input id="nameInput" value="{/name}"/>
  ```

- [ ] **Status messages**: Announce dynamic content changes
  ```javascript
  sap.ui.require(["sap/ui/core/InvisibleMessage"], function(InvisibleMessage) {
    InvisibleMessage.getInstance().announce("Item added to cart", "polite");
  });
  ```

### Visual Accessibility

- [ ] **Color contrast**: Minimum 4.5:1 for text
- [ ] **Text size**: Minimum 12px, better 14px+
- [ ] **Content density**: Support cozy and compact modes
  ```javascript
  // Component.js
  this.getModel("device").setProperty("/contentDensity",
    sap.ui.Device.support.touch ? "cozy" : "compact");
  ```

- [ ] **Responsive design**: Works on all screen sizes

---

## Testing Checklist

### Unit Testing (QUnit)

- [ ] **Coverage target**: ≥80% code coverage
- [ ] **Test all functions**: Every public function has tests
- [ ] **Test edge cases**: Null, undefined, empty strings, boundary values
- [ ] **Mocking**: Mock external dependencies
  ```javascript
  QUnit.module("Formatter", {
    beforeEach: function() {
      this.formatter = Formatter;
    }
  });

  QUnit.test("formatCurrency", function(assert) {
    assert.strictEqual(this.formatter.formatCurrency(1000, "USD"), "$1,000.00");
    assert.strictEqual(this.formatter.formatCurrency(null, "USD"), "");
  });
  ```

- [ ] **Run tests**: `npm run test:unit`

### Integration Testing (OPA5)

- [ ] **User journeys**: Test complete user workflows
- [ ] **Page objects**: Use page object pattern
  ```javascript
  // pages/ProductList.js
  Opa5.createPageObjects({
    onTheProductListPage: {
      actions: {
        iPressOnFirstProduct: function() {
          return this.waitFor({
            controlType: "sap.m.ColumnListItem",
            success: function(aItems) {
              aItems[0].$().trigger("tap");
            }
          });
        }
      },
      assertions: {
        iShouldSeeProducts: function() {
          return this.waitFor({
            controlType: "sap.m.Table",
            success: function(aTables) {
              Opa5.assert.ok(aTables[0].getItems().length > 0, "Products visible");
            }
          });
        }
      }
    }
  });
  ```

- [ ] **Run tests**: `npm run test:integration`

### Manual Testing

- [ ] **Cross-browser**: Chrome, Firefox, Safari, Edge
- [ ] **Mobile devices**: iOS Safari, Android Chrome
- [ ] **Accessibility**: Screen reader testing
- [ ] **Performance**: Lighthouse score >90

---

## Build Configuration

### ui5.yaml

- [ ] **Framework version**: Specified in ui5.yaml
  ```yaml
  specVersion: '3.0'
  framework:
    name: OpenUI5
    version: "1.120.0"
  ```

- [ ] **Build tasks**: Component preload, minification, cache buster
  ```yaml
  builder:
    resources:
      excludes:
        - "/test/**"
        - "/localService/**"
    componentPreload:
      paths:
        - "webapp/Component.js"
    minify:
      enabled: true
    cachebuster:
      enabled: true
  ```

### package.json

- [ ] **Scripts defined**: Build, test, serve
  ```json
  {
    "scripts": {
      "start": "ui5 serve",
      "build": "ui5 build --all",
      "test:unit": "karma start",
      "test:integration": "wdio wdio.conf.js"
    }
  }
  ```

- [ ] **Dependencies locked**: package-lock.json committed
- [ ] **Vulnerability scan**: `npm audit`

### Production Build

- [ ] **Source maps**: Disabled for production
  ```yaml
  builder:
    sourceMap:
      enabled: false  # Production only
  ```

- [ ] **Minification**: Enabled
- [ ] **Component preload**: Verified in dist/
- [ ] **Cache buster**: Hashed filenames

---

## Code Style Checklist

### Naming Conventions

- [ ] **camelCase**: Variables and functions
  ```javascript
  var productName = "Widget";
  function getProductById(id) { }
  ```

- [ ] **PascalCase**: Classes and constructors
  ```javascript
  var MyController = Controller.extend("com.myapp.controller.MyController", { });
  ```

- [ ] **UPPER_SNAKE_CASE**: Constants
  ```javascript
  var MAX_RESULTS = 100;
  var API_BASE_URL = "/api/v1";
  ```

### Async Patterns

- [ ] **Promises**: Use promises for async operations
  ```javascript
  // ❌ Callbacks
  oModel.read("/Products", {
    success: function(data) { },
    error: function(err) { }
  });

  // ✅ Promises
  oModel.read("/Products").then(function(data) {
    // Handle data
  }).catch(function(err) {
    // Handle error
  });
  ```

- [ ] **Async/Await**: Use async/await in TypeScript
  ```typescript
  async onPress(): Promise<void> {
    try {
      const data = await this.loadData();
      this.processData(data);
    } catch (error) {
      MessageBox.error("Failed to load data");
    }
  }
  ```

### Error Handling

- [ ] **Try-catch**: Wrap risky operations
- [ ] **User-friendly messages**: Display meaningful errors
  ```javascript
  try {
    var result = JSON.parse(response);
  } catch (error) {
    MessageBox.error("Failed to parse server response. Please try again.");
    Log.error("JSON parse error", error);
  }
  ```

- [ ] **Log errors**: Always log to console
  ```javascript
  sap.ui.require(["sap/base/Log"], function(Log) {
    Log.error("Error message", error);
  });
  ```

### Code Comments

- [ ] **JSDoc**: Document public functions
  ```javascript
  /**
   * Formats a currency value
   * @param {number} value - The numeric value
   * @param {string} currency - Currency code (USD, EUR, etc.)
   * @returns {string} Formatted currency string
   */
  formatCurrency: function(value, currency) {
    return value.toFixed(2) + " " + currency;
  }
  ```

- [ ] **Inline comments**: Explain complex logic only
- [ ] **TODO comments**: Track pending work
  ```javascript
  // TODO: Optimize this query for large datasets
  ```

---

## Documentation Checklist

### README.md

- [ ] **Project description**: What the app does
- [ ] **Installation**: How to set up locally
  ```markdown
  ## Installation
  1. Clone repository
  2. Run `npm install`
  3. Run `ui5 serve`
  ```

- [ ] **Usage**: How to use the app
- [ ] **Testing**: How to run tests
- [ ] **Deployment**: How to deploy

### API Documentation

- [ ] **JSDoc**: All public APIs documented
- [ ] **Code examples**: Include usage examples
- [ ] **Generated docs**: Use jsdoc or typedoc

### Changelog

- [ ] **CHANGELOG.md**: Track all changes
  ```markdown
  ## [1.2.0] - 2025-12-28
  ### Added
  - User authentication
  - Dark mode support

  ### Fixed
  - Performance issue with large lists
  ```

---

## Pre-Deployment Checklist

### Code Quality

- [ ] **Linter**: No linter errors
  ```bash
  ui5 lint
  ```

- [ ] **Unit tests**: All passing
- [ ] **Integration tests**: All passing
- [ ] **Code review**: Peer reviewed

### Performance

- [ ] **Lighthouse**: Score >90
- [ ] **Bundle size**: <2MB
- [ ] **Load time**: <3 seconds (3G)

### Security

- [ ] **Vulnerability scan**: `npm audit` clean
- [ ] **Dependency updates**: No outdated critical packages
- [ ] **Security headers**: CSP, HSTS configured

### Accessibility

- [ ] **aXe scan**: No critical issues
- [ ] **Screen reader test**: Works with NVDA/JAWS
- [ ] **Keyboard navigation**: All functionality accessible

### Documentation

- [ ] **README updated**: Reflects current state
- [ ] **Deployment guide**: Up to date
- [ ] **User manual**: Available (if needed)

### Deployment

- [ ] **Environment variables**: Configured correctly
- [ ] **Database migrations**: Applied (if applicable)
- [ ] **Backup**: Production backup created
- [ ] **Rollback plan**: Documented

---

## Tools for Quality Assurance

### Automated Tools

- **UI5 Linter**: https://github.com/UI5/linter
- **ESLint**: JavaScript linting
- **Lighthouse**: Performance and accessibility
- **aXe**: Accessibility testing
- **npm audit**: Vulnerability scanning
- **SonarQube**: Code quality metrics

### Manual Tools

- **Chrome DevTools**: Performance profiling
- **NVDA/JAWS**: Screen reader testing
- **BrowserStack**: Cross-browser testing
- **Postman**: API testing

---

**Last Updated**: 2025-12-28
**Plugin Version**: 3.0.0
