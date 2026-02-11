# SAP HANA CLI - Development Environment Reference

**Source**: [https://github.com/SAP-samples/hana-developer-cli-tool-example](https://github.com/SAP-samples/hana-developer-cli-tool-example)

Configuration for development environments, testing, and multi-database support.

---

## DevContainer Setup

The repository includes VS Code DevContainer configuration for consistent development environments.

### Container Base

```dockerfile
# Base image: Node.js 22 on Debian Buster
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-22-buster
```

### System Packages Installed

```dockerfile
# Cloud Foundry CLI
apt-get install cf8-cli

# Utilities
apt-get install git jq
```

### Global npm Packages

```bash
npm install -g @ui5/cli
npm install -g @sap/cds-dk
npm install -g yo
npm install -g @sap/generator-hdb-project
npm install -g @sap/generator-fiori
npm install -g typescript
```

### VS Code Extensions (21 total)

| Category | Extensions |
|----------|------------|
| **SAP Tools** | CDS Language Support, Fiori Tools, SAP UX Pack, HANA Driver, XML Toolkit |
| **Development** | ESLint, Beautify, IntelliCode, REST Client |
| **Productivity** | GitLens, Bracket Pair Colorizer, Path IntelliSense |
| **Other** | Yeoman UI, Version Lens, VS Code Icons |

### Port Forwarding

```json
"forwardPorts": [4004, 3010]
```

- **4004**: CAP default server port
- **3010**: hana-cli UI default port

### Post-Creation Setup

```bash
bash -i install-btp.sh
```

Installs BTP CLI from SAP GitHub repository.

---

## Multi-Database Support

The hana-cli supports multiple database backends through abstraction.

### Database Adapters

| File | Database | Purpose |
|------|----------|---------|
| `hanaCDS.js` | SAP HANA | CDS-based connection via CAP |
| `hanaDirect.js` | SAP HANA | Direct connection via hdb |
| `postgres.js` | PostgreSQL | PostgreSQL backend |
| `sqlite.js` | SQLite | SQLite backend |

### Backend Selection

Database backend is selected based on:
1. Connection configuration
2. CDS profile settings
3. Command-specific requirements

### Database-Specific Commands

| Command | Purpose |
|---------|---------|
| `tablesPG` | List tables (PostgreSQL) |
| `tablesSQLite` | List tables (SQLite) |
| `tables` | List tables (HANA default) |

---

## XS API Support (On-Premise)

For on-premise XSA environments, additional utilities are available.

### XS Configuration Functions

| Function | Purpose |
|----------|---------|
| `getCFConfig()` | Read ~/.xsconfig |
| `getCFOrg()` | Get target organization |
| `getCFSpace()` | Get target space |
| `getCFTarget()` | Get API endpoint |

### XS Service Discovery

| Function | Purpose |
|----------|---------|
| `getServices()` | List all services |
| `getServiceGUID(service)` | Get service GUID |
| `getServicePlans(guid)` | Get service plans |
| `getHANAInstances()` | List HANA instances |
| `getHDIInstances()` | List HDI instances |

---

## SQL Injection Prevention

The tool includes built-in SQL injection protection.

### Validation Functions

| Function | Purpose |
|----------|---------|
| `isAcceptableParameter(value, maxToken)` | Validate SQL parameter |
| `isAcceptableQuotedParameter(value)` | Validate quoted strings |
| `escapeDoubleQuotes(value)` | Escape " characters |
| `escapeSingleQuotes(value)` | Escape ' characters |

### Security Features

- Comment detection (`--` and `/* */`)
- Quote nesting tracking
- Token counting
- Separator boundary enforcement

---

## Testing Configuration

### Test Framework

- **Framework**: Mocha
- **Reporter**: Mochawesome (HTML reports)
- **Timeout**: 10 seconds
- **Parallel**: Enabled

### Configuration (.mocharc.json)

```json
{
  "timeout": "10s",
  "parallel": true,
  "reporter": "mochawesome",
  "require": ["./tests/helper.js", "mochawesome/register"]
}
```

### Test Files

| Test | Purpose |
|------|---------|
| `SystemInfo.Test.js` | System info commands |
| `btpInfo.Test.js` | BTP info commands |
| `btpSubs.Test.js` | BTP subscriptions |
| `callProcedure.Test.js` | Procedure execution |
| `status.Test.js` | Connection status |
| `version.Test.js` | Version info |

---

## Fiori LaunchPad Configuration

### Tile Groups

**List Objects** (9 tiles):
- Containers, Data Types, Functions, Indexes
- Schemas, Tables, Table Inspection
- Views, View Inspection

**Admin** (3 tiles):
- Features, Feature Usage, SQL Query

**CF/XS** (5 tiles):
- HDI, SBSS, Schema, SecureStore, UPS instances

### Applications

| App | Path | Purpose |
|-----|------|---------|
| systemInfo | /systemInfo | System dashboard |
| readMe | /readMe | Documentation |
| changeLog | /changeLog | Version history |
| massConvert | /massConvert | Batch conversion |

---

## Version Checking

### Node.js Version Validation

```javascript
// Reads engines.node from package.json
// Current requirement: ≥20.19.0
```

### Update Notifications

The CLI includes update notification via `update-notifier` package.

---

## UI5 Configuration

### ui5.yaml Settings

```yaml
specVersion: "1.0"
type: application
metadata:
  name: test1

server:
  customMiddleware:
    - name: fiori-tools-proxy
      configuration:
        backend:
          - path: /sap/opu/odata
            url: [http://localhost](http://localhost)
        ui5:
          path:
            - /resources
            - /test-resources
          url: [https://ui5.sap.com](https://ui5.sap.com)
```

### Theme Support

- Light: `sap_horizon`
- Dark: `sap_horizon_dark`
- Legacy: `sap_fiori_3_dark`

---

## Building from Source

### Prerequisites

```bash
# Node.js 20.19.0 or higher
node --version

# Remove SAP registry if set
npm config delete @sap:registry
```

### Installation

```bash
# Clone repository
git clone [https://github.com/SAP-samples/hana-developer-cli-tool-example](https://github.com/SAP-samples/hana-developer-cli-tool-example)

# Install dependencies
cd hana-developer-cli-tool-example
npm install

# Link globally
npm link
```

### Using DevContainer

1. Open in VS Code with Remote-Containers extension
2. Select "Reopen in Container"
3. Wait for container build
4. Run `npm install && npm link`

---

*Reference: [https://github.com/SAP-samples/hana-developer-cli-tool-example*](https://github.com/SAP-samples/hana-developer-cli-tool-example*)
