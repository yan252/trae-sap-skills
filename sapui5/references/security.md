# SAPUI5 Security Guide

**Source**: Official SAP SAPUI5 Documentation
**Documentation**: [https://github.com/SAP-docs/sapui5/tree/main/docs/05_Developing_Apps](https://github.com/SAP-docs/sapui5/tree/main/docs/05_Developing_Apps)
**Last Updated**: 2025-11-21

---

## Overview

Security is critical for enterprise applications. SAPUI5 provides built-in security features, but developers must use them correctly.

**Security Principles**:
1. **Never trust user input**
2. **Use framework security features**
3. **Keep framework updated**
4. **Follow secure coding practices**
5. **Test for vulnerabilities**

**Documentation**: [https://github.com/SAP-docs/sapui5/tree/main/docs/05_Developing_Apps](https://github.com/SAP-docs/sapui5/tree/main/docs/05_Developing_Apps) (search: security, secure-programming)

---

## Cross-Site Scripting (XSS) Prevention

### Overview

XSS occurs when attackers inject malicious scripts into web pages viewed by other users.

**SAPUI5 Protection**: Automatic output encoding in data binding and controls.

### Automatic Protection

**Data Binding** (Safe):
```xml
<!-- Automatically HTML-encoded -->
<Text text="{/userName}"/>
<Input value="{/userInput}"/>
```

**Control Properties** (Safe):
```javascript
// Automatically encoded
oText.setText(sUserInput);
oButton.setText(sUserInput);
```

### Dangerous Patterns

**innerHTML** (NEVER USE):
```javascript
// DANGEROUS - DO NOT USE
this.byId("myDiv").getDomRef().innerHTML = sUserInput;

// SAFE - Use data binding or setText
this.byId("myText").setText(sUserInput);
```

**jQuery HTML manipulation** (Avoid):
```javascript
// DANGEROUS
this.$("#myDiv").html(sUserInput);

// SAFE
this.byId("myText").setText(sUserInput);
```

### HTML Content

If HTML content is necessary, use `sap.ui.core.HTML` with sanitization:

```javascript
sap.ui.require([
    "sap/ui/core/HTML",
    "sap/base/security/sanitizeHTML"
], function(HTML, sanitizeHTML) {
    // Sanitize HTML
    var sSafeHTML = sanitizeHTML(sUnsafeHTML, {
        uriRewriter: function(sUrl) {
            // Whitelist URLs
            if (sUrl.startsWith("[https://trusted.com/](https://trusted.com/)")) {
                return sUrl;
            }
            return "";
        }
    });

    // Create HTML control
    var oHTML = new HTML({
        content: sSafeHTML,
        sanitizeContent: true
    });
});
```

### URL Validation

**Validate URLs** before using:

```javascript
sap.ui.require([
    "sap/base/security/URLWhitelist"
], function(URLWhitelist) {
    // Add trusted domains
    URLWhitelist.add("https", "trusted.com");
    URLWhitelist.add("https", "*.mycompany.com");

    // Validate URL
    if (URLWhitelist.validate(sUrl)) {
        // URL is safe
        window.open(sUrl);
    } else {
        // URL not trusted
        MessageBox.error("Invalid URL");
    }
});
```

**Never use** `javascript:` URLs:
```javascript
// DANGEROUS
<Link href="javascript:alert('XSS')"/>

// SAFE
<Link press=".onLinkPress"/>
```

---

## Content Security Policy (CSP)

### Overview

CSP prevents XSS by controlling which resources can be loaded and executed.

**SAPUI5 Support**: Framework is CSP-compliant.

### Configuration

**Server-Side** (Recommended):
```
Content-Security-Policy: default-src 'self';
    script-src 'self' [https://sapui5.hana.ondemand.com;](https://sapui5.hana.ondemand.com;)
    style-src 'self' 'unsafe-inline';
    img-src 'self' data:;
    font-src 'self' data:;
    connect-src 'self' [https://api.mybackend.com;](https://api.mybackend.com;)
```

**Meta Tag** (Alternative):
```html
<meta http-equiv="Content-Security-Policy"
    content="default-src 'self';
        script-src 'self' [https://sapui5.hana.ondemand.com;](https://sapui5.hana.ondemand.com;)
        style-src 'self' 'unsafe-inline';">
```

### SAPUI5 CSP Requirements

**Required Directives**:
- `script-src`: Allow SAPUI5 CDN or local resources
- `style-src 'unsafe-inline'`: Required for dynamic styles
- `font-src`: Allow icon fonts
- `img-src data:`: Allow data URIs for images

**Nonce Support** (Better than 'unsafe-inline'):
```html
<meta http-equiv="Content-Security-Policy"
    content="style-src 'self' 'nonce-{{random}}'; script-src 'self' 'nonce-{{random}}'">

<script nonce="{{random}}" src="resources/sap-ui-core.js"></script>
```

### Testing CSP

1. Enable CSP in development
2. Check browser console for violations
3. Adjust policy as needed
4. Test all application features

**Common Violations**:
- Inline scripts (use external files)
- `eval()` calls (refactor code)
- Inline event handlers (use addEventListener)

---

## Clickjacking Prevention

### Overview

Clickjacking tricks users into clicking on hidden elements by overlaying malicious content on legitimate pages.

### Frame Options

**X-Frame-Options Header** (Server-Side):
```
X-Frame-Options: DENY
```

Or allow same origin:
```
X-Frame-Options: SAMEORIGIN
```

**CSP Frame Ancestors**:
```
Content-Security-Policy: frame-ancestors 'none';
```

Or specify allowed origins:
```
Content-Security-Policy: frame-ancestors 'self' [https://trusted.com;](https://trusted.com;)
```

### Framebuster Script

For legacy browsers:
```html
<script>
if (top !== self) {
    top.location = self.location;
}
</script>
```

---

## Authentication & Authorization

### Authentication

**Never store credentials** in client-side code:

```javascript
// DANGEROUS - DO NOT DO THIS
var sPassword = "hardcoded123";

// SAFE - Use server-side authentication
fetch("/api/login", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ username, password })
});
```

**Use Secure Tokens**:
```javascript
// Store token securely (httpOnly cookie preferred)
// If using localStorage, encrypt sensitive data
```

### Authorization

**Check permissions** server-side:

```javascript
// Client-side (UI only, not security)
if (this.hasPermission("delete")) {
    this.byId("deleteButton").setVisible(true);
}

// Server-side (actual security check)
DELETE /api/products/123
Authorization: Bearer <token>
```

**Never rely** on client-side checks for security:
```javascript
// This is UI convenience, NOT security
if (oUser.role === "admin") {
    this.showAdminPanel();
}

// Real security happens on server
```

---

## Secure Data Transmission

### HTTPS

**Always use HTTPS** in production:

```javascript
// manifest.json
{
    "sap.app": {
        "dataSources": {
            "mainService": {
                "uri": "[https://api.mycompany.com/odata/",](https://api.mycompany.com/odata/",)  // HTTPS
                "type": "OData"
            }
        }
    }
}
```

**Redirect HTTP to HTTPS** (Server-Side):
```
HTTP/1.1 301 Moved Permanently
Location: [https://myapp.com/](https://myapp.com/)
```

### CORS

**Configure CORS** properly on backend:

```
Access-Control-Allow-Origin: [https://myapp.com](https://myapp.com)
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

**Never use** `*` with credentials:
```
# DANGEROUS
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
```

---

## CSRF Protection

### Overview

Cross-Site Request Forgery tricks authenticated users into performing unwanted actions.

### CSRF Tokens

**OData V2**:
SAPUI5 automatically handles CSRF tokens for OData V2 models:

```javascript
// Automatic CSRF token handling
oModel.create("/Products", oData, {
    success: function() {
        // Token automatically included
    }
});
```

**Custom AJAX**:
```javascript
fetch("/api/action", {
    method: "POST",
    headers: {
        "X-CSRF-Token": await this.fetchCSRFToken()
    },
    credentials: "include",
    body: JSON.stringify(data)
});

fetchCSRFToken: async function() {
    const response = await fetch("/api/csrf-token", {
        method: "HEAD",
        credentials: "include"
    });
    return response.headers.get("X-CSRF-Token");
}
```

---

## Input Validation

### Client-Side Validation

**Validate format**, not security:

```javascript
onEmailChange: function(oEvent) {
    var sEmail = oEvent.getParameter("value");
    var oInput = oEvent.getSource();

    // Basic format validation (UI convenience)
    var bValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sEmail);

    oInput.setValueState(bValid ? "None" : "Error");
    oInput.setValueStateText(bValid ? "" : "Invalid email format");

    // Real validation happens on server
}
```

**Use Data Types**:
```xml
<Input
    value="{
        path: '/email',
        type: 'sap.ui.model.type.String',
        constraints: {
            maxLength: 100,
            search: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        }
    }"/>
```

### Server-Side Validation

**Always validate** on server:

```javascript
// Client sends data
oModel.create("/Products", {
    name: sName,
    price: fPrice
}, {
    success: function() {
        // Server has validated input
    },
    error: function(oError) {
        // Server rejected invalid input
        MessageBox.error("Validation failed");
    }
});
```

---

## Secure Storage

### Sensitive Data

**Never store** sensitive data in localStorage or sessionStorage:

```javascript
// DANGEROUS
localStorage.setItem("password", sPassword);
localStorage.setItem("apiKey", sApiKey);

// SAFE - Use secure httpOnly cookies (server-side)
// Or short-lived memory-only storage
```

### Session Management

**Use server-side sessions**:

```javascript
// Login
fetch("/api/login", {
    method: "POST",
    credentials: "include",  // Send cookies
    body: JSON.stringify({ username, password })
});

// Requests automatically include session cookie
fetch("/api/data", {
    credentials: "include"
});

// Logout
fetch("/api/logout", {
    method: "POST",
    credentials: "include"
});
```

---

## SQL Injection Prevention

### OData Services

**Use parameterized queries** in backend:

```javascript
// Client-side (safe - OData handles escaping)
oModel.read("/Products", {
    filters: [
        new Filter("Name", FilterOperator.EQ, sUserInput)
    ]
});

// Backend must use parameterized queries
// DO NOT concatenate SQL strings
```

---

## Secure Configuration

### Manifest.json

**Don't expose** sensitive information:

```json
// DANGEROUS
{
    "sap.app": {
        "dataSources": {
            "mainService": {
                "uri": "[https://api.mycompany.com/odata/?apikey=secret123"](https://api.mycompany.com/odata/?apikey=secret123")
            }
        }
    }
}

// SAFE
{
    "sap.app": {
        "dataSources": {
            "mainService": {
                "uri": "[https://api.mycompany.com/odata/"](https://api.mycompany.com/odata/")
                // API key sent via server-side proxy
            }
        }
    }
}
```

### Environment Variables

**Use environment-specific** configuration:

```javascript
// Build-time replacement
var API_URL = "#{API_URL}#";  // Replaced during build

// Or runtime configuration
fetch("/config.json").then(config => {
    // Use config.apiUrl
});
```

---

## Security Testing

### Manual Testing

1. **XSS Testing**:
   - Input `<script>alert('XSS')</script>`
   - Input `<img src=x onerror=alert('XSS')>`
   - Verify automatic encoding

2. **CSRF Testing**:
   - Attempt cross-origin requests
   - Verify token validation

3. **Authentication**:
   - Test without credentials
   - Test with expired tokens
   - Test privilege escalation

### Automated Testing

**OWASP ZAP**:
```bash
# Scan application
zap-cli quick-scan -s xss,sqli [http://localhost:8080](http://localhost:8080)
```

**Retire.js** (Check for vulnerable libraries):
```bash
npm install -g retire
retire --js --path webapp/
```

---

## Security Checklist

### XSS Prevention
- [ ] Use data binding for user input
- [ ] Never use innerHTML
- [ ] Sanitize HTML content if needed
- [ ] Validate URLs before use
- [ ] No javascript: URLs

### CSP
- [ ] CSP header configured
- [ ] Application works with CSP enabled
- [ ] No CSP violations in console
- [ ] script-src and style-src configured

### Clickjacking
- [ ] X-Frame-Options header set
- [ ] frame-ancestors CSP directive set
- [ ] Framebuster script if needed

### Authentication
- [ ] No credentials in code
- [ ] Secure token storage
- [ ] HTTPS only in production
- [ ] Session timeout implemented

### Authorization
- [ ] Server-side permission checks
- [ ] Client-side checks for UI only
- [ ] Role-based access control
- [ ] Least privilege principle

### Data Transmission
- [ ] HTTPS everywhere
- [ ] CORS properly configured
- [ ] No sensitive data in URLs
- [ ] Secure cookie flags (HttpOnly, Secure)

### Input Validation
- [ ] Client-side format validation
- [ ] Server-side security validation
- [ ] Data types with constraints
- [ ] Whitelist, not blacklist

### Secure Storage
- [ ] No sensitive data in localStorage
- [ ] Session management server-side
- [ ] httpOnly cookies for tokens

---

## Common Vulnerabilities

### 1. Reflected XSS

**Vulnerable**:
```javascript
var sSearch = new URLSearchParams(window.location.search).get("q");
this.byId("searchField").getDomRef().innerHTML = sSearch;
```

**Fixed**:
```javascript
var sSearch = new URLSearchParams(window.location.search).get("q");
this.byId("searchField").setValue(sSearch);
```

### 2. DOM-based XSS

**Vulnerable**:
```javascript
var sUrl = location.hash.substring(1);
window.location = sUrl;
```

**Fixed**:
```javascript
sap.ui.require(["sap/base/security/URLWhitelist"], function(URLWhitelist) {
    var sUrl = location.hash.substring(1);
    if (URLWhitelist.validate(sUrl)) {
        window.location = sUrl;
    }
});
```

### 3. Insecure Direct Object Reference

**Vulnerable**:
```javascript
// User can modify ID in URL
var sId = oRouter.getParameter("id");
oModel.read("/Orders(" + sId + ")");  // Access to any order
```

**Fixed**:
```javascript
// Server checks if user has access to this order
var sId = oRouter.getParameter("id");
oModel.read("/Orders(" + sId + ")", {
    // Server validates: user can only access their own orders
});
```

---

## Official Documentation

- **Security**: [https://github.com/SAP-docs/sapui5/tree/main/docs/05_Developing_Apps](https://github.com/SAP-docs/sapui5/tree/main/docs/05_Developing_Apps) (search: security, secure-programming)
- **XSS Prevention**: [https://github.com/SAP-docs/sapui5/tree/main/docs/05_Developing_Apps](https://github.com/SAP-docs/sapui5/tree/main/docs/05_Developing_Apps) (search: cross-site-scripting)
- **CSP**: [https://github.com/SAP-docs/sapui5/tree/main/docs/05_Developing_Apps](https://github.com/SAP-docs/sapui5/tree/main/docs/05_Developing_Apps) (search: content-security-policy)
- **URL Whitelist**: [https://sapui5.hana.ondemand.com/#/api/sap.base.security.URLWhitelist](https://sapui5.hana.ondemand.com/#/api/sap.base.security.URLWhitelist)
- **OWASP Top 10**: [https://owasp.org/www-project-top-ten/](https://owasp.org/www-project-top-ten/)

---

**Note**: This document covers security best practices for SAPUI5. Security is not optional - it must be built into every application from the start. Always follow the principle of defense in depth.
