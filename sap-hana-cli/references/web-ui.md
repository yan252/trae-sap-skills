# SAP HANA CLI - Web UI Reference

**Source**: [https://github.com/SAP-samples/hana-developer-cli-tool-example](https://github.com/SAP-samples/hana-developer-cli-tool-example)

The hana-cli includes a browser-based Fiori LaunchPad interface for visual operations.

---

## Launching the Web UI

### Main UI Command

```bash
hana-cli UI
```

Opens a browser-based LaunchPad with all available applications.

### Command-Specific UIs

Many commands have UI alternatives:

| Command | UI Command | Purpose |
|---------|------------|---------|
| `tables` | `tablesUI` | Browse tables visually |
| `containers` | `containersUI` | Manage HDI containers |
| `massConvert` | `massConvertUI` | Visual mass conversion |
| `querySimple` | `querySimpleUI` | Query builder interface |
| `systemInfo` | `systemInfoUI` | System dashboard |
| `schemas` | `schemasUI` | Schema browser |
| `functions` | `functionsUI` | Function browser |
| `indexes` | `indexesUI` | Index browser |
| `dataTypes` | `dataTypesUI` | Type reference |
| `features` | `featuresUI` | Feature dashboard |
| `featureUsage` | `featureUsageUI` | Usage metrics |
| `inspectTable` | `inspectTableUI` | Table inspector |
| `changeLog` | `changeLogUI` | Version history |
| `readMe` | `readMeUI` | Documentation |
| `hanaCloudInstances` | `hanaCloudHDIInstancesUI` | Cloud instances |

---

## Architecture

### Technology Stack

- **Framework**: SAPUI5 1.142.0
- **Shell**: SAP Universal Shell (ushell)
- **Libraries**:
  - `sap.m` - Mobile controls
  - `sap.ushell` - Shell container
  - `sap.ui.layout` - Layout components
  - `sap.ui.rta` - Runtime adaptation
  - `sap.uxap` - Object page components

### Theme Support

Automatic theme detection:
- Light mode: `sap_horizon`
- Dark mode: `sap_horizon_dark`

```javascript
// Theme detection
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  sap.ui.getCore().applyTheme('sap_horizon_dark');
}
```

---

## API Endpoints

### GET /

Retrieves current prompts configuration.

```javascript
// Returns JSON with current settings
{ schema: "MYSCHEMA", limit: 200, ... }
```

### PUT /

Updates prompts configuration.

```javascript
// Request body
{ schema: "NEWSCHEMA", table: "MYTABLE" }
```

---

## Web Server Configuration

### Default Port

Commands launch on port 3010 by default.

```bash
hana-cli cds -p 3010
hana-cli UI -p 4000  # Custom port
```

### Port Configuration

```bash
# Specify custom port
hana-cli <command>UI -p <port>
```

Port range: 1-65535

---

## Route Structure

| Route | Handler | Purpose |
|-------|---------|---------|
| `/` | `index.js` | Main prompts API |
| `/dfa` | `dfa.js` | Digital Assistant routes |
| `/docs` | `docs.js` | Documentation routes |
| `/excel` | `excel.js` | Excel export |
| `/inspect` | `hanaInspect.js` | Object inspection |
| `/list` | `hanaList.js` | Object listings |
| `/static` | `static.js` | Static file serving |
| `/ws` | `webSocket.js` | WebSocket connections |

---

## Application Structure

```
app/
├── README.md
├── ui5.yaml
├── ui5-local.yaml
├── appconfig/
│   └── fioriSandboxConfig.json
├── dfa/
│   ├── library.js
│   ├── library-preload.js
│   └── help/
├── resources/
│   ├── index.html
│   ├── init.js
│   ├── favicon.ico
│   ├── WebAssistant.js
│   ├── common/
│   ├── inspect/
│   ├── massConvert/
│   ├── systemInfo/
│   └── tables/
```

---

## Features

### Interactive Prompts

The UI provides visual input for all command parameters:
- Schema selection dropdowns
- Table/view pickers
- Output format selectors
- Limit/offset controls

### Real-Time Results

Results display in formatted tables with:
- Sorting
- Filtering
- Pagination
- Export options

### Swagger/OpenAPI Documentation

OData and REST endpoints include Swagger UI:

```bash
# Access API documentation
[http://localhost:3010/api-docs](http://localhost:3010/api-docs)
```

### GraphQL Endpoint

GraphQL support available at:

```bash
[http://localhost:3010/graphql](http://localhost:3010/graphql)
```

---

## Integration with External Tools

### Open Database Explorer

```bash
hana-cli openDBExplorer
```

Opens HANA Database Explorer with current credentials.

**Cloud Region Routing**:
- us10, us20: US cloud cockpit URLs
- eu10, eu20: EU cloud cockpit URLs
- ap10, ap11, ap21: APAC cloud cockpit URLs

**On-Premise**: Queries `M_INIFILE_CONTENTS` for api_url.

### Open Business Application Studio

```bash
hana-cli openBAS
```

Opens BAS with current BTP target.

---

## Customization

### Namespace Configuration

Custom UI5 namespace:

```javascript
"sap.hanacli.common": "./common"
```

### Flexibility Services

Runtime UI adaptation via `SessionStorageConnector`.

---

## Security

- Credentials passed via memory (not URL)
- Same-origin requests only
- Session-based authentication

---

*Reference: [https://github.com/SAP-samples/hana-developer-cli-tool-example/tree/main/app*](https://github.com/SAP-samples/hana-developer-cli-tool-example/tree/main/app*)
