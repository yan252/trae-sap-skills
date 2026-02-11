# Replication Flows Guide

Complete guide for data replication in SAP Data Intelligence.

## Table of Contents

1. [Overview](#overview)
2. [Creating Replication Flows](#creating-replication-flows)
3. [Supported Sources](#supported-sources)
4. [Supported Targets](#supported-targets)
5. [Task Configuration](#task-configuration)
6. [Filters and Mappings](#filters-and-mappings)
7. [Delivery Guarantees](#delivery-guarantees)
8. [Cloud Storage Target Structure](#cloud-storage-target-structure)
9. [Kafka as Target](#kafka-as-target)
10. [Monitoring and Management](#monitoring-and-management)

---

## Overview

Replication flows enable data movement from sources to targets with support for:

- Small or large datasets
- Batch or real-time processing
- Full or delta (CDC) loading
- Multiple target types

**Key Workflow:**
1. Configure source and target connections
2. Create replication flow
3. Add tasks with datasets
4. Configure filters and mappings
5. Validate flow
6. Deploy to tenant repository
7. Run and monitor

---

## Creating Replication Flows

### Prerequisites

- Source connection created and enabled in Connection Management
- Target connection configured
- Appropriate authorizations

### Creation Steps

1. **Open Modeler** in SAP Data Intelligence
2. **Navigate** to Replication Flows
3. **Create new** replication flow
4. **Configure source**:
   - Select source connection
   - Choose connection type (ABAP, database, etc.)

5. **Configure target**:
   - Select target type (database, cloud storage, Kafka)
   - Set target-specific options

6. **Add tasks** (see Task Configuration)
7. **Validate** the flow
8. **Deploy** to tenant repository
9. **Run** the flow

---

## Supported Sources

### ABAP Systems

- SAP S/4HANA (Cloud and On-Premise)
- SAP ECC via SLT
- SAP BW/4HANA
- CDS views with extraction

**Source Configuration:**
```
Connection Type: ABAP
Extraction Type: CDS / ODP / Table
Package Size: 50000
```

### Databases

- SAP HANA
- Azure SQL Database (delta requires schema = username)
- Other SQL databases via connectors

---

## Supported Targets

### Database Targets

**SAP HANA Cloud:**
- Write modes: INSERT, UPSERT, DELETE
- Exactly-once delivery with UPSERT
- Batch size configuration

### Cloud Storage Targets

| Target | Description |
|--------|-------------|
| Amazon S3 | AWS object storage |
| Azure Data Lake Storage Gen2 | Microsoft cloud storage |
| Google Cloud Storage | GCP object storage |
| SAP HANA Data Lake | SAP cloud data lake |

**Cloud Storage Options:**
- Group Delta By: None, Date, Hour
- File Type: CSV, Parquet, JSON, JSONLines
- Suppress Duplicates: Minimize duplicate records

**Container Name Limit:** 64 characters maximum

### Kafka Target

- Each dataset maps to a Kafka topic
- Topic names editable (need not match source)
- No container name limit

---

## Task Configuration

Tasks define what data to replicate and how.

### Task Components

```
Task:
  - Source dataset (table, view, etc.)
  - Target specification
  - Filter conditions
  - Column mappings
  - Load type (Initial/Delta)
```

### Load Types

| Type | Description |
|------|-------------|
| Initial Load | Full data extraction |
| Delta Load | Changed data only (CDC) |
| Initial + Delta | Full load followed by continuous delta |

### Creating Tasks

1. Click "Add Task"
2. Select source object
3. Configure target (table name, topic, etc.)
4. Set filters (optional)
5. Define mappings (optional)
6. Choose load type

---

## Filters and Mappings

### Source Filters

Reduce data volume with filter conditions:

```
Filter Examples:
- CreationDate ge datetime'2024-01-01T00:00:00'
- Region eq 'EMEA'
- Status in ('ACTIVE', 'PENDING')
```

### Column Mappings

**Auto-mapping:** System matches source to target columns automatically

**Custom Mapping:** Define specific source-to-target column relationships

```
Custom Mapping Example:
  Source Column    -> Target Column
  SalesOrder       -> SALES_ORDER_ID
  SoldToParty      -> CUSTOMER_ID
  NetAmount        -> AMOUNT
```

### Data Type Compatibility

Ensure source and target data types are compatible. See `references/abap-integration.md` for ABAP type mappings.

---

## Delivery Guarantees

### Default: At-Least-Once

May result in duplicate records during:
- Recovery from failures
- Network issues
- System restarts

### Exactly-Once with Database Targets

When using UPSERT to database targets (e.g., HANA Cloud):
- System eliminates duplicates automatically
- Achieved through key-based merge operations

### Suppress Duplicates (Cloud Storage)

For non-database targets:
- Enable "Suppress Duplicates" during initial load
- Minimizes but may not eliminate all duplicates

---

## Cloud Storage Target Structure

### Directory Hierarchy

```
/<container-base-path>/
    .sap.rms.container                    # Container metadata
    <tableName>/
        .sap.partfile.metadata            # Dataset metadata
        initial/
            .sap.partfile.metadata
            part-<timestamp>-<workOrderID>-<no>.<ext>
            _SUCCESS                       # Load completion marker
        delta/
            <date(time)-optional>/
                .sap.partfile.metadata
                part-<timestamp>-<workOrderID>-<no>.<ext>
```

### File Formats

| Format | Options |
|--------|---------|
| CSV | Delimiter, header row, encoding |
| Parquet | Compression (SNAPPY, GZIP), compatibility mode |
| JSON | Standard JSON format |
| JSONLines | One JSON object per line |

### Appended Columns

System automatically adds metadata columns:

| Column | Description |
|--------|-------------|
| `__operation_type` | L=Load, I=Insert, U=Update, B=Before, X=Delete, M=Archive |
| `__sequence_number` | Delta row ordering |
| `__timestamp` | UTC write timestamp |

### Success Marker

The `_SUCCESS` file indicates:
- Initial load completion
- Safe for downstream processing

---

## Kafka as Target

### Topic Configuration

- One topic per source dataset
- Topic name defaults to dataset name (editable)
- Configure partitions and replication factor

### Serialization

| Format | Description |
|--------|-------------|
| AVRO | Schema in message; column names: alphanumeric + underscore only |
| JSON | No schema; flexible structure |

**Note:** Schema registries are not supported.

### Message Structure

- Each source record = one Kafka message (not batched)
- Message key = concatenated primary key values (underscore separated)

### Message Headers

| Header | Values |
|--------|--------|
| `kafkaSerializationType` | AVRO or JSON |
| `opType` | L=Load, I=Insert, U=Update, B=Before, X=Delete, M=Archive |
| `Seq` | Sequential integer (delta order); empty for initial load |

### Compression Options

- None
- GZIP
- Snappy
- LZ4
- Zstandard

### Network Configuration

For Kafka behind Cloud Connector:
- Broker addresses must match virtual hosts in SCC
- Use identical virtual and internal host values when possible

---

## Monitoring and Management

### Monitoring Tools

**SAP Data Intelligence Monitoring:**
- View replication flow status
- Track task execution
- Monitor data volumes
- View error logs

### Flow Status

| Status | Description |
|--------|-------------|
| Deployed | Ready to run |
| Running | Active execution |
| Completed | Successfully finished |
| Failed | Error occurred |
| Stopped | Manually stopped |

### Management Operations

| Operation | Description |
|-----------|-------------|
| Edit | Modify existing flow |
| Undeploy | Remove from runtime |
| Delete | Remove flow definition |
| Clean Up | Remove source artifacts |

### Clean Up Source Artifacts

After completing replication:
1. Navigate to deployed flow
2. Select "Clean Up"
3. Removes delta pointers and temporary data

---

## Best Practices

### Planning

1. **Assess Data Volume**: Plan for initial load duration
2. **Choose Delivery Mode**: Understand exactly-once requirements
3. **Design Target Schema**: Match source structure appropriately
4. **Plan Delta Strategy**: Determine grouping (none/date/hour)

### Performance

1. **Use Filters**: Reduce data volume at source
2. **Optimize Package Size**: Balance memory vs. round-trips
3. **Monitor Progress**: Track initial and delta loads
4. **Schedule Appropriately**: Avoid peak system times

### Reliability

1. **Enable Monitoring**: Track all flows actively
2. **Handle Duplicates**: Design for at-least-once semantics
3. **Validate Before Deploy**: Check all configurations
4. **Test with Sample Data**: Verify mappings and transformations

---

## Documentation Links

- **Replicating Data**: [https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/modelingguide/replicating-data](https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/modelingguide/replicating-data)
- **Create Replication Flow**: [https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/blob/main/docs/modelingguide/replicating-data/create-a-replication-flow-a425e34.md](https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/blob/main/docs/modelingguide/replicating-data/create-a-replication-flow-a425e34.md)
- **Cloud Storage Structure**: [https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/blob/main/docs/modelingguide/replicating-data/cloud-storage-target-structure-12e0f97.md](https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/blob/main/docs/modelingguide/replicating-data/cloud-storage-target-structure-12e0f97.md)
- **Kafka as Target**: [https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/blob/main/docs/modelingguide/replicating-data/kafka-as-target-b9b819c.md](https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/blob/main/docs/modelingguide/replicating-data/kafka-as-target-b9b819c.md)

---

**Last Updated**: 2025-11-22
