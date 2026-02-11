# BPC Live Connection for Planning

## Overview

SAP Analytics Cloud supports live data connections to SAP Business Planning and Consolidation (BPC) systems, enabling organizations to leverage the powerful planning engine in BPC Embedded while using SAC's modern visualization and user experience capabilities.

**Key Benefit**: Perform BPC planning activities directly in SAC stories without replicating data, maintaining a single source of truth in BPC.

---

## Supported BPC Versions

| BPC Version | Connection Type | Planning Support |
|-------------|-----------------|------------------|
| **BPC for NetWeaver** | Live Data Connection | Limited (read-only) |
| **BPC Embedded (S/4HANA)** | Live Data Connection | Full planning features |
| **BPC Standard** | Import Connection | Export to BPC required |

**Note**: This reference focuses on BPC Embedded, which offers the most comprehensive planning integration.

---

## Architecture

### Live Connection Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SAP Analytics Cloud                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ Stories/Apps    │  │ Input Forms     │  │ Planning        │ │
│  │ Visualization   │  │ Data Entry      │  │ Sequences       │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                              │                                   │
│                    Live Data Connection                         │
│                              │                                   │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│              SAP BPC Embedded (on S/4HANA or BW/4HANA)          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ Planning        │  │ BPC Models      │  │ Planning        │ │
│  │ Engine          │  │ (InfoProviders) │  │ Sequences       │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                  │
│  Data persisted in HANA / BW                                    │
└─────────────────────────────────────────────────────────────────┘
```

### Connection Components

| Component | Purpose |
|-----------|---------|
| **SAP HANA Cloud Connector** | Secure tunnel for on-premise BPC |
| **OData Service** | Standard interface for data access |
| **CORS Configuration** | Cross-origin resource sharing settings |
| **SSO/SAML** | Single sign-on authentication |

---

## Planning Features via BPC Live Connection

### Supported Planning Operations

| Feature | SAC with BPC Live | Native SAC Planning |
|---------|-------------------|---------------------|
| **Data Entry** | Yes | Yes |
| **Spreading** | Yes (BPC engine) | Yes |
| **Planning Sequences** | Yes | No (Data Actions) |
| **Version Management** | BPC-controlled | SAC-controlled |
| **Data Locking** | BPC locks | SAC locks |
| **Master Data Planning** | Yes | Yes |
| **Comments** | BPC comments | SAC comments |

### Planning Sequences from BPC

Run BPC planning sequences (FOX scripts, planning functions) directly from SAC:

1. Create a **BPC planning sequence** in BPC Administration
2. Expose via **OData service**
3. Add **Planning Sequence Starter** widget in SAC story
4. Configure parameters and filters
5. Execute from SAC interface

```javascript
// Example: Triggering BPC planning sequence from Analytics Designer
var params = {
    FISCAL_YEAR: "2025",
    VERSION: "PLAN",
    CATEGORY: "FORECAST"
};

// Planning sequence execution is handled by the BPC backend
PlanningSequence_1.execute(params);
```

### Dimension Properties and Texts

Update BPC dimension properties and texts from SAC:

1. Configure **Master Data Provider** model type in BPC (SAP Note 2824099)
2. Create query based on InfoObject flagged as InfoProvider
3. Enable master data planning in SAC
4. Update dimension properties via table input

**Supported Operations**:
- Update member descriptions
- Modify member attributes
- Change hierarchy assignments

---

## Prerequisites

### BPC System Configuration

| Requirement | Details |
|-------------|---------|
| **BPC Version** | SAP BPC 11.0+ or BPC Embedded |
| **Backend** | S/4HANA, BW/4HANA, or BW on HANA |
| **OData Services** | Activated and configured |
| **SSO Configuration** | SAML 2.0 identity provider setup |

### SAC Configuration

| Requirement | Details |
|-------------|---------|
| **Connection Type** | Live Data Connection |
| **System Mapping** | BPC system mapped to SAC tenant |
| **User Mapping** | SSO or technical user configured |
| **Permissions** | Planning read/write on BPC models |

### Network Requirements

| Component | Requirement |
|-----------|-------------|
| **Cloud Connector** | Required for on-premise BPC |
| **CORS** | Properly configured for cross-origin requests |
| **Firewall** | BPC OData endpoints accessible |
| **SSL** | HTTPS required for all connections |

---

## Configuration Workflow

### Step 1: Configure BPC for Live Connection

**In BPC Administration**:

1. Create or configure BPC models
2. Define planning functions and sequences
3. Set up authorization profiles
4. Expose OData services

**Activate Required OData Services**:
```
/IWBEP/SB_MODELMETADATA_V2
/IWFND/ANALYTICS_SRV
```

### Step 2: Set Up Cloud Connector (On-Premise)

For on-premise BPC systems:

1. Install **SAP Cloud Connector**
2. Configure **virtual host mapping**
3. Add **access control** for BPC backend
4. Test connectivity from SAC

### Step 3: Create Live Connection in SAC

1. Navigate to **Connections → Add Connection**
2. Select **Live Data Connection**
3. Choose **SAP BW** or **SAP BPC** connection type
4. Enter connection details:

| Field | Value |
|-------|-------|
| **Host** | Virtual host or direct URL |
| **HTTPS Port** | 443 (recommended) |
| **Client** | SAP system client |
| **Authentication** | SAML SSO or Basic |

### Step 4: Create Story with BPC Model

1. Create new story
2. Add table widget
3. Select BPC live connection as data source
4. Choose BPC model/query
5. Enable planning mode (if supported)

---

## Input Mode for Tables

Configure input mode for BPC live connection tables:

### Enable Input Mode

1. Select table widget
2. Open **Builder Panel → Planning**
3. Toggle **Enable Planning** on
4. Configure input settings

### Input Mode Options

| Option | Description |
|--------|-------------|
| **Manual Input** | User types values directly |
| **Comments** | Enable BPC comments |
| **Planning Functions** | Trigger from context menu |

**Important**: Tables built on BW live connection models (without BPC) do **not** support input mode.

---

## Differences from Native SAC Planning

| Aspect | BPC Live Connection | Native SAC Planning |
|--------|---------------------|---------------------|
| **Data Storage** | BPC/HANA | SAC HANA |
| **Planning Engine** | BPC (FOX, functions) | SAC (Data Actions) |
| **Version Management** | BPC categories | SAC versions |
| **Calculations** | FOX scripts | Advanced formulas |
| **Workflows** | BPC work status | SAC calendar |
| **Master Data** | BPC dimensions | SAC dimensions |
| **Real-time** | Yes (live) | Yes (native) |
| **Offline** | No | No |

### When to Use BPC Live vs Native SAC

**Use BPC Live Connection when**:
- Existing BPC investment to leverage
- Complex planning logic in FOX scripts
- Integrated with SAP BW reporting
- Compliance requires BPC audit trails
- Multi-dimensional planning with complex hierarchies

**Use Native SAC Planning when**:
- New planning implementation
- Simpler planning requirements
- Want modern SAC features (calendar, data locking)
- Seamless Planning with Datasphere desired
- Mobile-first planning applications

---

## JavaScript API for BPC Planning

### Planning Sequence Execution

```javascript
// Execute planning sequence with parameters
PlanningSequence_1.setParameterValue("FISCAL_YEAR", "2025");
PlanningSequence_1.setParameterValue("VERSION", "PLAN");
PlanningSequence_1.execute();

// Execute with callback
PlanningSequence_1.execute().then(function() {
    Application.showMessage("Planning sequence completed");
    Table_1.getDataSource().refreshData();
});
```

### Data Entry in BPC Tables

```javascript
// Set user input on BPC model table
var selection = {
    "@MeasureDimension": "AMOUNT",
    "0FISCPER": "2025001",
    "0VERSION": "PLAN"
};

Table_1.getPlanning().setUserInput(selection, 1000000);
```

### Refresh After BPC Changes

```javascript
// Refresh data source after BPC planning operations
Table_1.getDataSource().refreshData();

// Or refresh entire application
Application.refreshData();
```

---

## Performance Considerations

### Live Connection Performance

| Factor | Impact | Recommendation |
|--------|--------|----------------|
| **Network Latency** | High | Use Cloud Connector caching |
| **Query Complexity** | Medium | Optimize BEx queries |
| **Data Volume** | High | Apply filters, use aggregations |
| **Concurrent Users** | Medium | Scale BPC backend |

### Optimization Tips

1. **Filter early** - Apply filters at connection level
2. **Limit dimensions** - Show only required dimensions
3. **Use hierarchies** - Leverage BPC hierarchies for drill-down
4. **Cache queries** - Enable query caching in BW
5. **Batch updates** - Group planning changes before submit

---

## Troubleshooting

### Connection Issues

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| Connection timeout | Cloud Connector down | Restart Cloud Connector |
| Authentication failed | SSO misconfigured | Check SAML settings |
| No data returned | Missing authorizations | Verify BPC roles |
| CORS error | Cross-origin blocked | Configure CORS headers |

### Planning Issues

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| Input mode disabled | Not BPC model | Verify model type |
| Planning sequence fails | Parameters missing | Check required parameters |
| Data not saved | Work status locked | Check BPC work status |
| Wrong values | Currency conversion | Verify conversion settings |

---

## Official Documentation Links

- **BPC Live Connection Setup**: https://help.sap.com/docs/SAP_ANALYTICS_CLOUD/00f68c2e08b941f081002fd3691d86a7/3c284ec47d8542b79f5ed82662574f32.html
- **Planning Sequences**: https://help.sap.com/docs/SAP_ANALYTICS_CLOUD/00f68c2e08b941f081002fd3691d86a7/15c4df4979304b69b52aa28fdc9b2e93.html
- **Master Data Planning**: https://help.sap.com/docs/SAP_ANALYTICS_CLOUD/00f68c2e08b941f081002fd3691d86a7/8db2f38569924670adcd1790f5ffb8ed.html
- **Input Mode Configuration**: https://help.sap.com/docs/SAP_ANALYTICS_CLOUD/00f68c2e08b941f081002fd3691d86a7/98f51fdf7f3f432cb44b821f59b7905c.html
- **SAP Note 2824099**: Master Data Provider configuration
- **BW Live Connection Best Practices**: https://help.sap.com/docs/SUPPORT_CONTENT/boc/3354605720.html

---

**Version**: 1.0.0
**Last Updated**: 2025-12-27
**SAC Version**: 2025.25
