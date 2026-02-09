# ABAP Integration Guide

Complete guide for integrating ABAP-based SAP systems with SAP Data Intelligence.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Cloud Connector Setup](#cloud-connector-setup)
4. [Connection Configuration](#connection-configuration)
5. [Data Sources](#data-sources)
6. [ABAP Operators](#abap-operators)
7. [Custom ABAP Operators](#custom-abap-operators)
8. [Data Type Mapping](#data-type-mapping)
9. [Security](#security)
10. [Troubleshooting](#troubleshooting)

---

## Overview

SAP Data Intelligence Cloud integrates with ABAP-based SAP systems including:

- SAP S/4HANA (Cloud and On-Premise)
- SAP Business Warehouse (BW/4HANA, BW)
- SAP ECC
- Other NetWeaver-based systems

**Key Characteristics:**
- ABAP operators run on the ABAP Pipeline Engine in the source system
- Metadata and data flow through SAP Data Intelligence Cloud
- Supports real-time and batch data extraction

**Central Reference**: SAP Note 2890171 contains essential setup information.

---

## Prerequisites

### SAP System Requirements

**Minimum Versions:**
- SAP NetWeaver 7.50 SP00 or higher
- SAP S/4HANA 1909 or higher (recommended)
- SAP BW/4HANA 2.0 or higher

**Required Components:**
- ABAP Pipeline Engine (installed via SAP Notes)
- Cloud Connector (for on-premise systems)

### SAP Data Intelligence Requirements

- SAP Data Intelligence Cloud tenant
- Connection Management access
- Appropriate authorizations

---

## Cloud Connector Setup

For on-premise ABAP systems, configure SAP Cloud Connector.

### Installation Steps

1. **Download Cloud Connector** from SAP Support Portal
2. **Install** on a server with network access to ABAP system
3. **Configure** connection to SAP BTP subaccount
4. **Map** internal ABAP system to virtual host

### Configuration Example

```
Location ID: <your-location-id>
Internal Host: <abap-server>:44300
Virtual Host: virtualabap:44300
Protocol: HTTPS
Principal Propagation: Enabled (optional)
```

### Trust Configuration

1. Import SAP Data Intelligence CA certificate
2. Configure system certificate for backend
3. Enable principal propagation if needed

### Resource Configuration

Configure required resources in Cloud Connector Resources pane:

**For CDS View Extraction:**
```
Prefix: DHAMB_    (required)
Prefix: DHAPE_    (required)
Function: RFC_FUNCTION_SEARCH
```

**For SLT Replication Server:**
```
Prefix: LTAMB_    (required)
Prefix: LTAPE_    (required)
Function: RFC_FUNCTION_SEARCH
```

### SNC Configuration

If using Secure Network Communication (SNC):
- Configure SNC in Cloud Connector (not in DI Connection Management)
- Upload SNC certificates to Cloud Connector
- Map SNC names appropriately

---

## Connection Configuration

### Creating ABAP Connection

1. **Open Connection Management** in SAP Data Intelligence
2. **Create new connection** with type "ABAP"
3. **Configure parameters**:

**Basic Settings:**
```
Connection Type: ABAP
Host: <virtual-host-from-cloud-connector>
Port: 44300
Client: 100
System ID: <SID>
```

**Authentication:**
- Basic Authentication: Username/Password
- Principal Propagation: SSO via Cloud Connector
- X.509 Certificate: Certificate-based

**Cloud Connector:**
```
Location ID: <your-location-id>
```

### Testing Connection

Use "Test Connection" to verify:
- Network connectivity
- Authentication
- Authorization

---

## Data Sources

### CDS Views

ABAP Core Data Services views are the recommended data source.

**SAP S/4HANA Cloud Options:**
- Standard CDS views with C1 release contract annotations
- Custom CDS views developed for Data Intelligence integration

**SAP S/4HANA On-Premise Options:**
- Standard CDS views with C1 release contract
- Custom ABAP CDS views created using ABAP Development Tool (ADT)

**Discovery Methods:**
- Use `I_DataExtractionEnabledView` (available in S/4HANA 2020+) to find extraction-enabled views
- Check Metadata Explorer properties: "Extraction Enabled", "Delta enabled", "CDS Type"

**Required Annotations for Custom Views:**
```abap
@Analytics.dataExtraction.enabled: true
@Analytics.dataExtraction.delta.changeDataCapture.automatic: true
```

**Configuration:**
```
CDS View: I_Product
Selection Fields: Product, ProductType
Package Size: 10000
```

**Best Practices:**
- Use extraction-enabled views for delta capability
- Apply filters to reduce data volume
- Consider view performance characteristics
- Verify C1 contract compliance for standard views

### ODP (Operational Data Provisioning)

Framework for extracting data from various ABAP sources.

**Prerequisites:**
- Gen1 operators: Require DMIS add-on + ODP Application API v2
- Gen2 operators/Replication flows with S/4HANA: Only ODP Application API required
- Legacy systems: Both DMIS add-on + ODP Application API required

**Key SAP Notes:**
- SAP Note 2890171: ODP integration requirements
- SAP Note 2775549: Integration prerequisites
- SAP Note 3100673: Technical user privileges

**Connection Types:**

| Type | Description | Use Case |
|------|-------------|----------|
| ABAP | Recommended connection | Latest features, resilience, replication flows |
| ABAP_LEGACY | Fallback option | When DMIS installation not feasible |

**ODP Contexts:**
- SAPI: DataSources (classic BW extractors)
- ABAP CDS: CDS views with extraction annotations
- BW: BW InfoProviders
- SLT: SLT-replicated tables

**Delta Support:**
- Full extraction (initial load)
- Delta extraction (CDC - Change Data Capture)
- Delta initialization (reset delta pointer)

### Tables

Direct table access for simple scenarios.

**Configuration:**
```
Table: MARA
Fields: MATNR, MTART, MATKL
Where Clause: MTART = 'FERT'
```

**Limitations:**
- No built-in delta capability
- May require additional authorization
- Consider performance for large tables

### SLT (SAP Landscape Transformation)

Real-time data replication via SLT Server.

**Components:**
- SLT Server (on-premise)
- Mass Transfer ID configuration
- Target connection in Data Intelligence

**Capabilities:**
- Real-time CDC
- Initial load + continuous delta
- Table-level replication

---

## ABAP Operators

### ABAP CDS Reader

Reads from CDS views with extraction.

**Key Parameters:**
- CDS View Name
- Selection Conditions
- Package Size (rows per batch)
- Max Rows (limit)

### ABAP Table Reader

Reads from ABAP tables directly.

**Key Parameters:**
- Table Name
- Field List
- Where Clause
- Order By

### SLT Connector

Connects to SLT for real-time replication.

**Key Parameters:**
- Mass Transfer ID
- Table Name
- Initial Load (yes/no)
- Subscription Type

### Generation 1 vs Generation 2

**Gen1 ABAP Operators:**
- Traditional process model
- Manual recovery

**Gen2 ABAP Operators:**
- Enhanced recovery
- State management
- Better error handling

---

## Custom ABAP Operators

### Architecture

Custom operators run in the ABAP Pipeline Engine:

```
SAP Data Intelligence <-> ABAP Pipeline Engine <-> Custom Operator Code
```

### Creating Custom Operators

1. **Create ABAP class** implementing interface
2. **Register** in ABAP Pipeline Engine repository
3. **Deploy** to SAP Data Intelligence
4. **Use** in graphs

### Implementation Pattern

```abap
CLASS zcl_custom_operator DEFINITION
  PUBLIC
  FINAL
  CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES if_sdi_operator.

  PRIVATE SECTION.
    DATA: mv_parameter TYPE string.

ENDCLASS.

CLASS zcl_custom_operator IMPLEMENTATION.

  METHOD if_sdi_operator~init.
    " Initialize operator
    mv_parameter = io_context->get_parameter( 'PARAM1' ).
  ENDMETHOD.

  METHOD if_sdi_operator~start.
    " Start processing
    DATA: lt_data TYPE TABLE OF string.
    " ... process data ...
    io_context->send_output( 'OUTPUT' , lt_data ).
  ENDMETHOD.

ENDCLASS.
```

---

## Data Type Mapping

### ABAP to Data Intelligence Type Mapping

| ABAP Type | Data Intelligence Type |
|-----------|----------------------|
| CHAR | String |
| NUMC | String |
| DATS | Date |
| TIMS | Time |
| DEC | Decimal |
| INT1/INT2/INT4 | Integer |
| FLTP | Double |
| RAW | Binary |
| STRING | String |
| RAWSTRING | Binary |

### Wire Format Conversion Options (Gen1)

| Conversion Type | Description |
|-----------------|-------------|
| Enhanced format conversion | Validates data, converts invalid to "NaN" or "undefined" per ISO standards |
| Required conversions | Minimal technical changes, preserves invalid values |
| Required conversions + currency | Adds currency shift conversion |
| Required conversions + time format + currency | ISO date/time format + currency handling |

**Gen2 and Replication Flows:**
Default: "Required Conversions Plus Time Format and Currency" (cannot be changed)

**Detailed Mappings:** See SAP Note 3035658 for complete type conversion tables.

### Conversion Considerations

**Date/Time:**
- ABAP dates: YYYYMMDD format
- Initial dates (00000000) may need handling
- ISO format conversion available for Gen2

**Numbers:**
- NUMC fields are strings (preserve leading zeros)
- Packed decimals maintain precision
- Currency fields may be shifted based on currency table

**Binary:**
- RAW fields convert to binary
- Consider encoding for text storage

---

## Security

### Authorization Requirements

**SAP Data Intelligence:**
- Connection Management access
- Graph execution rights

**ABAP System:**
- RFC authorization
- Data access authorization (S_TABU_DIS, etc.)
- CDS view authorization (@AccessControl)

### Network Security

- Cloud Connector encryption (TLS)
- Principal propagation for SSO
- IP restrictions

### Data Protection

- Apply CDS access controls
- Mask sensitive fields in extraction
- Audit logging in both systems

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution | SAP Note |
|-------|-------|----------|----------|
| Session limit exceeded | ABAP Pipeline Engine constraints | Adjust session limits | 2999448 |
| Connection validation fails | Connection configuration | Check connection setup | 2849542 |
| CDS view extraction error (Gen1) | View not extraction-enabled | Enable extraction annotations | - |
| SLT subscription conflict (Gen1) | Subscription already in use | Release subscription | 3057246 |
| Invalid character in string | Encoding issues | Check data encoding | 3016338 |
| Object does not exist (Gen2) | Object not found | Verify object name | 3143151 |
| Connection timeout | Network/firewall | Check Cloud Connector mapping | - |
| Authentication failed | Wrong credentials | Verify user/password | - |
| Authorization error | Missing permissions | Check ABAP authorizations | - |

### CDS View Specific Issues

**"CDS view does not support data extraction":**
1. Verify extraction annotations exist
2. Check C1 contract compliance for standard views
3. Use `I_DataExtractionEnabledView` to verify

### Diagnostic Steps

1. **Test connection** in Connection Management
2. **Check Cloud Connector** logs
3. **Review ABAP** system logs (ST22, SM21)
4. **Monitor** Pipeline Engine (transaction /IWREP/MONITOR)
5. **Check** SAP Data Intelligence execution logs

### SAP Notes Reference

| Note | Description |
|------|-------------|
| 2890171 | Central ABAP integration note |
| 2775549 | Integration prerequisites |
| 2849542 | Connection troubleshooting |
| 2973594 | Known issues and corrections |
| 2999448 | Session limit issues |
| 3016338 | Invalid character errors |
| 3035658 | Data type conversion tables |
| 3057246 | SLT subscription conflicts |
| 3100673 | Technical user privileges |
| 3143151 | Object not found errors |

### Resources

- **SAP Community**: [https://community.sap.com/topics/data-intelligence](https://community.sap.com/topics/data-intelligence)
- **SAP Support Portal**: [https://support.sap.com](https://support.sap.com)

---

## Documentation Links

- **ABAP Integration Guide**: [https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/abapintegration](https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/abapintegration)
- **User Guide**: [https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/abapintegration/user-guide-for-abap-integration](https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/abapintegration/user-guide-for-abap-integration)

---

**Last Updated**: 2025-11-22
