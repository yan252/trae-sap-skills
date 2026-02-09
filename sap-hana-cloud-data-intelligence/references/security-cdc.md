# Security, Data Protection, and CDC Guide

Complete guide for security, data protection, and change data capture in SAP Data Intelligence.

## Table of Contents

1. [Security Overview](#security-overview)
2. [Data Protection](#data-protection)
3. [Audit Logging](#audit-logging)
4. [Change Data Capture (CDC)](#change-data-capture-cdc)
5. [Best Practices](#best-practices)

---

## Security Overview

### Responsibility Model

**SAP Data Intelligence Role:** Data processor
**User Role:** Data owner and responsible for:
- PII (Personally Identifiable Information) security
- Regulatory compliance
- Audit trail configuration

### Design-Time Security

**Trace Logs:**
- Modeler produces trace logs with design-time artifacts
- Solution files and pipeline descriptions included
- **Do not embed sensitive information** in these objects

**Connection Management:**
- Use Connection Manager for credentials
- Avoid hardcoding sensitive data in operators
- Leverage secure credential storage

### Network Security

**Cloud Connector:**
- TLS encryption for on-premise communication
- Virtual host mapping
- IP restrictions available

**Principal Propagation:**
- SSO via Cloud Connector
- Certificate-based authentication
- User context preservation

---

## Data Protection

### PII Handling Guidelines

1. **Identify PII**: Document all PII fields in data flows
2. **Minimize Collection**: Extract only necessary data
3. **Mask Sensitive Data**: Apply masking/anonymization
4. **Secure Storage**: Encrypt data at rest
5. **Access Control**: Implement authorization checks

### Data Masking Operators

| Operator | Purpose |
|----------|---------|
| Data Mask | Apply masking patterns |
| Anonymization | Hash, shuffle, generalize data |
| Validation Rule | Verify data quality |

### Anonymization Techniques

```
Original: john.doe@company.com
Masked: j***@c***.com
Hashed: SHA256(email + salt)
Generalized: user@domain.com
```

### Encryption

**In Transit:**
- HTTPS for all communications
- TLS 1.2+ required
- Certificate validation

**At Rest:**
- Storage-level encryption
- Key management integration
- Customer-managed keys (where supported)

---

## Audit Logging

### Responsibility Model

**SAP Data Intelligence Platform Logs (DI-native):**
- Platform-level access events (user login/logout)
- User actions (pipeline creation, modification, execution)
- System configuration changes
- API access attempts

**Customer-Configured Logs (upstream/downstream systems):**
SAP Data Intelligence does not generate audit logs for:
- Sensitive data inputs from source systems
- Data transformations applied to PII/sensitive data
- Data outputs written to target systems

**You must configure** source and target systems to generate audit logs for data-level operations. This is required because DI processes data in transit but does not independently track individual data record access.

### Recommended Logging Events

| Event Category | Examples |
|----------------|----------|
| Security Incidents | Unauthorized access attempts |
| Configuration Changes | Pipeline modifications |
| Personal Data Access | PII field reads |
| Data Modifications | Updates to relevant datasets |

### Compliance Considerations

**GDPR Requirements:**
- Right to access
- Right to erasure
- Data portability
- Breach notification

**Implementation:**
1. Document data flows
2. Configure audit logging in source/target systems
3. Maintain data lineage
4. Implement retention policies

### Administration Guide Reference

See SAP Data Intelligence Administration Guide for:
- DPP (Data Protection and Privacy) configuration
- Audit log setup
- Compliance reporting

---

## Change Data Capture (CDC)

### Overview

CDC enables tracking changes in source systems for incremental data loading.

### Terminology

**Cloud Data Integration (CDI)**: An internal component of SAP Data Intelligence that provides connectivity and data movement capabilities. CDI performs polling-based change detection by periodically querying source systems for modified records.

### CDC Approaches

| Approach | Technology | Description |
|----------|------------|-------------|
| Trigger-based | Database triggers | Insert/Update/Delete tracking |
| Polling-based | Cloud Data Integration (CDI) | Periodic change detection via scheduled queries |
| Log-based | Transaction logs | Real-time change capture |

### Supported Databases (Trigger-based)

- DB2
- SAP HANA
- Microsoft SQL Server (MSSQL)
- MySQL
- Oracle

### CDC Operators (Deprecated)

**Table Replicator V3 (Deprecated):**
- Simplifies graph creation for trigger-based CDC
- Manages trigger creation and change tracking

**CDC Graph Generator (Deprecated):**
- Automates SQL generation for database-specific triggers
- Reduces manual effort per table

### Cloud Data Integration CDC

Cloud Data Integration (CDI) uses **polling-based** CDC technology:
- Periodic checks for changes
- No trigger installation required
- Suitable for cloud sources

### Replication Flow CDC

For modern CDC implementations, use **Replication Flows**:
- Built-in delta support
- Multiple source types
- Cloud-native approach

**Delta Indicators in Replication:**
*(Used in Replication Flows to mark data changes)*

| Code | Meaning |
|------|---------|
| L | Initial load row |
| I | New row inserted |
| U | Update (after image) |
| B | Update (before image) |
| X | Deleted row |
| M | Archiving operation |

**Note**: Delta indicators are system-generated by Replication Flows when CDC is enabled. They apply across all supported source types (see Supported Databases section). Downstream operators or target systems can filter on these codes to handle different change types distinctly.

### Performance Considerations

CDC performance depends on:
1. Initial table size
2. Rate of changes in source
3. Network latency
4. Target system capacity

---

## Best Practices

### Security

1. **Least Privilege**: Grant minimum required permissions
2. **Credential Rotation**: Regularly update passwords/keys (e.g., quarterly or per organizational policy)
3. **Network Segmentation**: Isolate DI from other workloads
4. **Monitoring**: Enable security monitoring and alerts

### Data Protection

1. **Data Classification**: Categorize data by sensitivity
2. **Anonymization**: Apply for non-production environments
3. **Access Logging**: Configure source/target systems to track who accesses sensitive data (see [Audit Logging - Responsibility Model](#responsibility-model) for details on DI-native vs. customer-configured logs)
4. **Retention**: Implement data retention policies

### CDC Implementation

1. **Choose Approach**: Select CDC method based on requirements
2. **Monitor Performance**: Track CDC overhead on source
3. **Handle Duplicates**: Design for at-least-once semantics (messages/rows may be delivered multiple times; implement idempotent logic in target systems to handle duplicates gracefully)
4. **Test Recovery**: Validate delta restart scenarios

### Compliance

1. **Document Everything**: Maintain data flow documentation
2. **Regular Audits**: Conduct periodic compliance reviews
3. **Training**: Ensure team understands DPP requirements
4. **Incident Response**: Have breach response plan ready

---

## Operator Metrics for Monitoring

### Consumer Metrics

| Metric | Description |
|--------|-------------|
| Optimized | Whether operator is optimized with others |
| Row Count | Rows read from source |
| Column Count | Columns read from source |
| Partition Count | Partitions being read |

### Producer Metrics

| Metric | Description |
|--------|-------------|
| Row Count | Rows written to target |
| Current Row Rate | Rows per second |
| Batch Count | Batches written |
| Elapsed Execution Time | Total runtime |

### Debug Mode Metrics

| Metric | Description |
|--------|-------------|
| Job CPU Usage | CPU % by execution engine |
| Job Memory Usage | KB used by execution engine |
| Operator CPU Usage | CPU % by subengine |
| Operator Memory Usage | KB used by subengine |

---

## Documentation Links

- **Security and Data Protection**: [https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/blob/main/docs/modelingguide/security-and-data-protection-39d8ba5.md](https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/blob/main/docs/modelingguide/security-and-data-protection-39d8ba5.md)
- **Change Data Capture**: [https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/blob/main/docs/modelingguide/changing-data-capture-cdc-023c75a.md](https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/blob/main/docs/modelingguide/changing-data-capture-cdc-023c75a.md)
- **Operator Metrics**: [https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/blob/main/docs/modelingguide/operator-metrics-994bc11.md](https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/blob/main/docs/modelingguide/operator-metrics-994bc11.md)

---

**Last Updated**: 2025-11-22
