# Content Transport Reference

**Source**: [https://github.com/SAP-docs/sap-datasphere/tree/main/docs/Integrating-data-and-managing-spaces/Transporting-Content-Between-Tenants](https://github.com/SAP-docs/sap-datasphere/tree/main/docs/Integrating-data-and-managing-spaces/Transporting-Content-Between-Tenants)
**Source**: [https://github.com/SAP-docs/sap-datasphere/tree/main/docs/Acquiring-Preparing-Modeling-Data/Creating-Finding-Sharing-Objects](https://github.com/SAP-docs/sap-datasphere/tree/main/docs/Acquiring-Preparing-Modeling-Data/Creating-Finding-Sharing-Objects)

---

## Table of Contents

1. [Transport Overview](#transport-overview)
2. [Export Packages](#export-packages)
3. [Import Content](#import-content)
4. [Sharing Destinations](#sharing-destinations)
5. [CSN/JSON Export](#csnjson-export)
6. [Command Line Transport](#command-line-transport)
7. [SAP Cloud Transport Management](#sap-cloud-transport-management)
8. [Content Network](#content-network)
9. [Object Sharing](#object-sharing)

---

## Transport Overview

SAP Datasphere supports multiple methods for moving content between tenants.

### Transport Methods

| Method | Use Case | Complexity |
|--------|----------|------------|
| Export/Import Packages | Manual transport | Low |
| Cloud Transport Management | Automated pipelines | Medium |
| CSN/JSON Files | Developer workflow | Low |
| Command Line | CI/CD integration | Medium |

### Critical Limitation

**"Only object definitions can be transported. Data cannot be transported between SAP Datasphere tenants"** — the Transport app handles structure only, not actual data records.

### Transportable Objects with Dependency Behavior

| Object Type | Auto-Includes Dependencies | Notes |
|-------------|---------------------------|-------|
| Connections | No | No dependencies on other objects |
| Remote Tables | Yes | Includes connection information |
| Local Tables | No | Structure only; no interdependencies |
| Flows (Data/Replication/Transformation) | Yes | Auto-exports all source and target definitions |
| Views (Graphical/SQL) | Yes | Exports all sources and applied data access controls |
| Intelligent Lookups | Yes | Exports input and lookup entity definitions |
| Analytic Models | Yes | Exports fact and dimension source definitions |
| **E/R Models** | **Manual** | Objects must be manually selected; not auto-included |
| Data Access Controls | Yes | Exports permissions entity definition |
| **Task Chains** | **Manual** | Objects must be manually selected; not auto-included |
| Business Entities/Versions | Yes | Exports all versions, source entities, and authorization scenarios |
| Fact Models | Yes | Exports all versions and dependent source models/entities |
| Consumption Models | Yes | Exports all perspectives and dependent models/entities |
| Authorization Scenarios | Yes | Exports associated data access control |

> **Note on Manual Selection**: E/R Models and Task Chains require manual selection because they represent complex container objects with multiple potential dependencies. Unlike Analytic Models or Flows that have clear source→target relationships, these objects may reference many unrelated items. Explicit user selection prevents unintended transports of large object graphs.

### Non-Transportable Items

- Data (table contents)
- Connection credentials
- User assignments
- Schedules
- Notification recipients (for task chains)

---

## Export Packages

### Creating Packages

1. Transport > Create Package
2. Enter package name
3. Select objects
4. Configure options
5. Create package

### Package Configuration

**Package Properties**:
```yaml
name: sales_analytics_v1
description: Sales analytics data model
include_dependencies: true
```

### Object Selection

**Select Objects**:
- Individual selection
- Select with dependencies
- Select by space
- Select by type

**Dependency Handling**:
- Auto-include dependencies
- Skip existing objects
- Override conflicts

### Package Contents

**Package Structure**:
```
package/
├── manifest.json
├── objects/
│   ├── tables/
│   ├── views/
│   ├── flows/
│   └── models/
└── metadata/
```

### Export Package

**Export Options**:
- Download as file
- Share to destination
- SAP Cloud Transport

---

## Import Content

### Import Process

1. Transport > Import
2. Select source (file or destination)
3. Review contents
4. Configure options
5. Execute import

### Import Options

| Option | Description |
|--------|-------------|
| Create New | Create all objects |
| Update Existing | Update if exists |
| Skip Existing | Don't overwrite |
| Overwrite | Replace all |

### Conflict Resolution

**Conflict Types**:
- Object exists
- Name collision
- Dependency missing
- Version mismatch

**Resolution Actions**:
- Rename object
- Override existing
- Skip object
- Abort import

### Import Validation

**Pre-Import Checks**:
- Object compatibility
- Dependency availability
- Permission verification
- Space capacity

### Post-Import Steps

1. Review imported objects
2. Configure connections
3. Set up schedules
4. Assign permissions
5. Deploy objects

---

## Sharing Destinations

### Overview

Sharing destinations enable direct content transfer between tenants.

### Adding Sharing Destinations

1. Transport > Sharing Destinations
2. Add destination
3. Configure connection
4. Test connectivity
5. Save

### Destination Configuration

```yaml
destination:
  name: production_tenant
  url: [https://prod.datasphere.cloud.sap](https://prod.datasphere.cloud.sap)
  authentication: OAuth 2.0
  client_id: xxx
  client_secret: xxx
```

### Share to Destination

1. Select package
2. Choose destination
3. Configure options
4. Share

### Receive from Destination

1. Transport > Incoming
2. Select package
3. Review contents
4. Import

---

## CSN/JSON Export

### Overview

Export objects in CSN (Core Schema Notation) JSON format for version control and CI/CD.

### Exporting to CSN/JSON

1. Select objects
2. Export > CSN/JSON
3. Download file

### CSN File Structure

```json
{
  "definitions": {
    "space.view_name": {
      "kind": "entity",
      "@EndUserText.label": "View Label",
      "elements": {
        "column1": {
          "type": "cds.String",
          "length": 100
        }
      }
    }
  }
}
```

### Importing from CSN/JSON

1. Transport > Import
2. Select CSN/JSON file
3. Map to space
4. Import

### Use Cases

- Version control (Git)
- CI/CD pipelines
- Backup/restore
- Cross-environment deployment

---

## Command Line Transport

### Overview

Use the datasphere CLI for automated transport operations.

### Installation

```bash
npm install -g @sap/datasphere-cli
```

### Authentication

```bash
# Login
datasphere login --url [https://tenant.datasphere.cloud.sap](https://tenant.datasphere.cloud.sap)

# Using service key
datasphere login --service-key key.json
```

### Export Commands

```bash
# Export space definitions
datasphere spaces read --space SALES_ANALYTICS --output export.json

# Export specific objects
datasphere spaces read --space SALES_ANALYTICS --definitions VIEW:sales_view,TABLE:customers --output export.json

# Export with verbose output
datasphere spaces read --space SALES_ANALYTICS --output export.json --verbose
```

### Import Commands

```bash
# Import/create space from file (target determined by file content)
datasphere spaces create --file-path export.json

# Import with verbose output
datasphere spaces create --file-path export.json --verbose
```

> **Note**: The target space is determined by the content of the JSON file. Use the Transport app UI for more granular control over target space mapping.

### CI/CD Integration

**GitHub Actions Example**:
```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install CLI
        run: npm install -g @sap/datasphere-cli
      - name: Login
        run: datasphere login --service-key ${{ secrets.DS_SERVICE_KEY }}
      - name: Import
        run: datasphere spaces create --file-path models/export.json
```

---

## SAP Cloud Transport Management

### Overview

Integrate with SAP Cloud Transport Management for enterprise transport pipelines.

### Prerequisites

- SAP Cloud Transport Management subscription
- Transport routes configured
- Datasphere integration enabled

### Configuration

1. System > Transport Management
2. Enable integration
3. Configure transport nodes
4. Set up routes

### Transport Landscape

```
Development → Quality → Production
     ↓           ↓           ↓
  DEV Node   QA Node    PROD Node
```

### Creating Transport Requests

1. Transport > Create Request
2. Select objects
3. Assign to route
4. Submit

### Transport Actions

| Action | Description |
|--------|-------------|
| Export | Create transport file |
| Import | Apply to target |
| Forward | Move to next node |
| Release | Approve transport |

### Monitoring Transports

1. Transport Management cockpit
2. View transport queue
3. Check status
4. Review logs

---

## Content Network

### Overview

Access SAP and partner business content from the Content Network.

### Accessing Content Network

1. Content Network app
2. Browse available content
3. Select packages
4. Install

### Available Content

**SAP Content**:
- Best practice data models
- Industry solutions
- Analytics content
- Integration packages

**Partner Content**:
- Third-party connectors
- Industry extensions
- Custom solutions

### Installing Content

1. Select content package
2. Review dependencies
3. Configure target space
4. Install

### Managing Installed Content

**Update Content**:
- Check for updates
- Review changes
- Apply updates

**Remove Content**:
- Identify dependencies
- Remove objects
- Clean up

---

## Object Sharing

### Sharing Within Tenant

**Share to Other Spaces**:
1. Select object
2. Share > Select spaces
3. Configure permissions
4. Confirm

**Share Permissions**:
| Permission | Capabilities |
|------------|--------------|
| Read | View, use as source |
| Read/Write | Modify, extend |
| Full | All operations |

### Sharing Entities and Task Chains

**Share Entity**:
1. Open entity
2. Sharing settings
3. Add spaces
4. Set permissions

**Share Task Chain**:
1. Open task chain
2. Share to spaces
3. Configure execution permissions

### Working in Spaces

**Space Isolation**:
- Objects belong to one space
- Share for cross-space access
- Permissions cascade

### Repository Explorer

**Find Objects**:
1. Repository Explorer
2. Search/browse
3. View details
4. Access object

**Object Actions**:
- Open
- Copy
- Share
- Delete

### Folders

**Organize with Folders**:
1. Create folder structure
2. Move objects
3. Set folder permissions

**Folder Structure**:
```
Space/
├── Sales/
│   ├── Views/
│   └── Models/
├── Finance/
│   ├── Reports/
│   └── Flows/
└── Shared/
```

---

## Managing Exported Content

### View Exported Packages

1. Transport > Exported Packages
2. View package list
3. Check status
4. Download/delete

### Package Lifecycle

| Status | Description |
|--------|-------------|
| Draft | Being created |
| Ready | Available for export |
| Exported | Downloaded/shared |
| Archived | Retained for history |

### Cleanup

**Delete Old Packages**:
- Review retention policy
- Delete unused packages
- Archive important versions

---

## Best Practices

### Transport Strategy

1. Define transport landscape
2. Establish naming conventions
3. Document dependencies
4. Test before production

### Version Control

- Use meaningful package names
- Include version numbers
- Maintain changelog
- Tag releases

### Testing

- Validate in QA first
- Check data access controls
- Verify connections
- Test schedules

### Documentation

- Document transport contents
- Record configuration changes
- Note manual steps
- Update runbooks

---

## Documentation Links

- **Transport Overview**: [https://help.sap.com/docs/SAP_DATASPHERE/c8a54ee704e94e15926551293243fd1d/df12666](https://help.sap.com/docs/SAP_DATASPHERE/c8a54ee704e94e15926551293243fd1d/df12666)
- **Export Packages**: [https://help.sap.com/docs/SAP_DATASPHERE/c8a54ee704e94e15926551293243fd1d/24aba84](https://help.sap.com/docs/SAP_DATASPHERE/c8a54ee704e94e15926551293243fd1d/24aba84)
- **Import Content**: [https://help.sap.com/docs/SAP_DATASPHERE/c8a54ee704e94e15926551293243fd1d/b607a12](https://help.sap.com/docs/SAP_DATASPHERE/c8a54ee704e94e15926551293243fd1d/b607a12)
- **CSN/JSON**: [https://help.sap.com/docs/SAP_DATASPHERE/c8a54ee704e94e15926551293243fd1d/f8ff062](https://help.sap.com/docs/SAP_DATASPHERE/c8a54ee704e94e15926551293243fd1d/f8ff062)
- **CLI**: [https://help.sap.com/docs/SAP_DATASPHERE/c8a54ee704e94e15926551293243fd1d/6494657](https://help.sap.com/docs/SAP_DATASPHERE/c8a54ee704e94e15926551293243fd1d/6494657)

---

**Last Updated**: 2025-11-22
