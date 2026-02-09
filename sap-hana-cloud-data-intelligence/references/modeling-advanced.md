# SAP Data Intelligence - Advanced Modeling Reference

This reference covers advanced modeling topics including graph snippets, SAP cloud application integration, configuration types, local data types, and example graph templates.

**Documentation Source**: [https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/modelingguide](https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/modelingguide)

## Table of Contents

1. [Graph Snippets](#graph-snippets)
   - [What Are Graph Snippets?](#what-are-graph-snippets)
   - [Creating Graph Snippets](#creating-graph-snippets)
   - [Importing Graph Snippets](#importing-graph-snippets)
   - [Editing Graph Snippets](#editing-graph-snippets)
2. [SAP Cloud Applications Integration](#sap-cloud-applications-integration)
   - [Supported SAP Cloud Applications](#supported-sap-cloud-applications)
   - [Cloud Data Integration API](#cloud-data-integration-api)
   - [Connection Setup](#connection-setup)
   - [Metadata Explorer Features](#metadata-explorer-features)
   - [Cloud Data Integration Operator](#cloud-data-integration-operator)
3. [Configuration Types](#configuration-types)
   - [Purpose](#purpose)
   - [Creating Configuration Types](#creating-configuration-types)
   - [Supported Data Types](#supported-data-types)
   - [Value Helpers](#value-helpers)
   - [Property Options](#property-options)
   - [Naming Convention](#naming-convention)
4. [Local Data Types](#local-data-types)
   - [Characteristics](#characteristics)
   - [Type Categories](#type-categories)
   - [Creating Local Data Types](#creating-local-data-types)
   - [Scalar Type Templates](#scalar-type-templates)
5. [Operator Metrics](#operator-metrics)
   - [Consumer Operator Metrics](#consumer-operator-metrics)
   - [Producer Operator Metrics](#producer-operator-metrics)
   - [Debug Mode Metrics](#debug-mode-metrics)
6. [Example Graph Templates (141 Available)](#example-graph-templates-141-available)
   - [Data Integration & ETL](#data-integration--etl)
   - [Machine Learning Templates](#machine-learning-templates)
   - [Streaming & Real-Time](#streaming--real-time)
   - [Cloud & API Integration](#cloud--api-integration)
   - [Data Quality & Transformation](#data-quality--transformation)
   - [Script & Development](#script--development)

---

## Graph Snippets

Graph snippets are reusable entities that group operators and connections together, performing a single logical function.

### What Are Graph Snippets?

- Pre-built entities containing a group of operators and connections
- Perform a single logical function as a unit
- Allow adding multiple related operators at once
- Reduce setup time and ensure consistency

### Creating Graph Snippets

**Steps:**

1. Launch SAP Data Intelligence Modeler → Graphs tab
2. Search or create a new graph
3. Select portion of graph (Shift+drag or Ctrl+A for entire graph)
4. Right-click → "Create Snippet"
5. Configure operator properties:
   - Mark properties as configurable during import, OR
   - Preconfigure with specific values
6. Add descriptions (optional) to parameters
7. Define reusable parameters with "Add Parameter" option
8. Review settings with "Show Parameters"
9. Click "Create"
10. Save with metadata in Save Snippet dialog

**Requirements:**
- ABAP operators require connection and version selection before snippet creation
- Use fully qualified paths when saving

### Importing Graph Snippets

**Steps:**

1. Open SAP Data Intelligence Modeler → Graphs tab
2. Find or create target graph
3. Right-click in editor workspace OR use toolbar icon
4. Select snippet from Import Snippet dialog
5. Configure settings in dialog
6. Complete import
7. Adjust individual operators as needed in configuration panel

### Editing Graph Snippets

After import, snippets become editable components:
- Configure each operator individually
- Modify connections between operators
- Adjust port configurations
- Update parameter values

**Reference**: Repository Objects Reference for individual snippet documentation

---

## SAP Cloud Applications Integration

SAP Data Intelligence integrates with SAP cloud applications through the Cloud Data Integration API.

### Supported SAP Cloud Applications

| Application | Integration Type |
|-------------|------------------|
| SAP Fieldglass | Cloud Data Integration API |
| SAP Sales Cloud | Cloud Data Integration API |
| SAP Service Cloud | Cloud Data Integration API |

### Cloud Data Integration API

The API adheres to OData V4 specifications and provides two service types:

**1. Administrative Service (One per system)**
- Provides catalog of providers organized by namespaces
- Each provider corresponds to a business object
- Contains related entity sets

**2. Provider Service (One per data provider)**
- Provides access to metadata
- Enables access to entity set data
- Based on provider structure

### Connection Setup

**Connection Type**: `CLOUD_DATA_INTEGRATION`

**Configuration Steps:**
1. Open Connection Management in SAP Data Intelligence
2. Create new connection with type `CLOUD_DATA_INTEGRATION`
3. Configure service endpoint
4. Test connection

### Metadata Explorer Features

- Entity sets function as datasets
- Namespaces and providers map to folder structures
- View and preview entity set metadata
- Browse available data objects

### Cloud Data Integration Operator

**Purpose**: Data ingestion in SAP Data Intelligence Modeler

**Capabilities:**
- Streaming replication scenarios
- Uses Flowagent technology for execution
- Supports incremental data loads
- OData V4 compliant operations

---

## Configuration Types

Configuration types are JSON files that define properties and bind them with data types for operator configurations.

### Purpose

- Define operator configurations
- Specify parameters within operator configuration definitions
- Create reusable type definitions
- Establish UI behavior and validation rules

### Creating Configuration Types

**Steps:**

1. Access Configuration Types tab in navigation pane
2. Click plus icon to add new type
3. Add optional description
4. Add properties with:
   - Name
   - Display name
   - Data type

### Supported Data Types

| Type | Configuration |
|------|---------------|
| String | Format specifications, value helpers |
| Number | Numeric constraints |
| Boolean | True/false values |
| Integer | Whole number constraints |
| Object | Drill down into schema definitions |
| Array | Specify item types |
| Custom Type | Reference other configuration types |

### Value Helpers

Two types of value helpers available:

1. **Pre-defined Lists**: Static list of options
2. **REST API Sources**: Dynamic values from API calls

### Property Options

| Option | Description |
|--------|-------------|
| Required | Mandates user input |
| ReadOnly | Prevents edits |
| Visible | Always shown |
| Hidden | Never shown |
| Conditional | Shown based on conditions |

### Naming Convention

Save with fully qualified paths:
```
com.sap.others.<typename>
```

---

## Local Data Types

Local data types are bound to a specific graph and visible only within that graph.

### Characteristics

- Supplement global data types
- Visible only in the containing graph
- Support Scalar types (exclusive to local data types)
- Enable pipeline-specific requirements

### Type Categories

| Category | Description |
|----------|-------------|
| Structure | Complex type with properties |
| Table | Collection type with row structure |
| Scalar | Simple type from template (LOCAL ONLY) |

### Creating Local Data Types

**Steps:**

1. Open pipeline in Modeler
2. Select Show Configuration (no operators selected)
3. Expand Data Types section
4. Click plus icon → Create Data Type dialog
5. Enter name (start with letter, use letters/numbers/underscores)
6. Select type category
7. For Structure/Table: Add properties and description
8. For Scalar: Select template from options
9. Save

### Scalar Type Templates

Scalar types are exclusive to local data types. Select from provided templates based on your data requirements.

---

## Operator Metrics

Operator metrics provide runtime performance data for Structured Data Operators and Connectivity operators.

### Consumer Operator Metrics

| Metric | Unit | Description |
|--------|------|-------------|
| Optimized | Boolean | Shows if operator is combined with others from same engine |
| Row Count | rows | Quantity of rows retrieved from source |
| Column Count | columns | Quantity of columns retrieved from source |
| Partition Count | partitions | Number of partitions when partitioning enabled |

**Note**: When Optimized is activated, runtime metrics aren't shown.

### Producer Operator Metrics

| Metric | Unit | Description |
|--------|------|-------------|
| Row Count | rows | Quantity of rows sent to target |
| Current row rate | rows/s | Throughput velocity when writing |
| Batch count | batches | Number of batches when batch writing configured |
| Elapsed execution time | seconds | Duration of graph processing |

### Debug Mode Metrics

| Metric | Unit | Description |
|--------|------|-------------|
| Job CPU usage | % | Execution engine processor consumption |
| Job memory usage | KB | Execution engine memory consumption |
| Operator CPU usage | % | Operator subengine processor consumption |
| Memory usage | KB | Operator subengine memory consumption |

**Access**: Metrics are automatically published upon graph execution.

---

## Example Graph Templates (141 Available)

Pre-built graph templates organized by category.

### Data Integration & ETL

| Template | Purpose |
|----------|---------|
| ABAP | ABAP system data extraction |
| BW HANA View to File | Full load from BW to files |
| Data Extraction from SAP ABAP Tables | SLT to File Store/Kafka |
| Data Extraction from SAP S/4HANA CDS Views | CDS to File Store/Kafka |
| HANA-to-File | HANA export to files |
| HANA-to-HANA | HANA replication |
| HANA-to-Kafka | HANA streaming to Kafka |
| Kafka-to-HANA | Kafka ingestion to HANA |
| Load/Ingest Files into SAP HANA | Full and incremental load |

### Machine Learning Templates

| Template | Purpose |
|----------|---------|
| Auto-ML Training and Inference | Automated ML workflows |
| TensorFlow Training | TensorFlow model training |
| TensorFlow MNIST | MNIST digit classification |
| TensorFlow Serving | Model serving |
| HANA-ML Forecast | Time series forecasting |
| HANA-ML Training/Inference | HANA PAL models |
| PyTorch Text Classification | NLP classification |
| ML Batch Inference | Batch scoring |
| ML Multi-Model Inference | Multiple model serving |
| R Classification | R-based classification |
| R Regression | R-based regression |

### Streaming & Real-Time

| Template | Purpose |
|----------|---------|
| Kafka Integration | Kafka producer/consumer |
| Google Pub/Sub | GCP messaging |
| Streaming Analytics | Real-time analytics |
| IoT Validation | IoT data validation |
| Message Generator | Test message generation |

### Cloud & API Integration

| Template | Purpose |
|----------|---------|
| Google BigQuery SQL | BigQuery queries |
| Google BigQuery Table Producer | BigQuery writes |
| Google Dataproc | Spark on GCP |
| AWS S3 | S3 storage operations |
| OData Query | OData service queries |
| REST API Client | REST service calls |
| Open Connectors | Multi-cloud connectivity |

### Data Quality & Transformation

| Template | Purpose |
|----------|---------|
| DQMM Address Cleanse | Address data cleansing |
| DQMM Person/Firm Cleanse | Entity cleansing |
| Data Masking | PII masking |
| Data Validation | Data quality rules |
| Multiplexer | Dynamic input/output routing |
| Binary-to-Table | Binary conversion |
| Table-to-Binary | Table serialization |
| Anonymization | Data anonymization |

### Script & Development

| Template | Purpose |
|----------|---------|
| Python Examples | Python operator demos |
| JavaScript Examples | JS operator demos |
| Node.js Examples | Node.js integration |
| R Examples | R script integration |
| Jupyter Examples | Notebook integration |

**Access**: Templates available in Modeler → Graphs → Search or browse categories

---

## Documentation Links

- **Graph Snippets**: [https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/modelingguide/using-graph-snippets](https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/modelingguide/using-graph-snippets)
- **Cloud Integration**: [https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/blob/main/docs/modelingguide/integrating-sap-cloud-applications-with-sap-data-intelligence-d6a8144.md](https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/blob/main/docs/modelingguide/integrating-sap-cloud-applications-with-sap-data-intelligence-d6a8144.md)
- **Configuration Types**: [https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/blob/main/docs/modelingguide/creating-configuration-types-2e63e4c.md](https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/blob/main/docs/modelingguide/creating-configuration-types-2e63e4c.md)
- **Local Data Types**: [https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/blob/main/docs/modelingguide/creating-local-data-types-c996f5e.md](https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/blob/main/docs/modelingguide/creating-local-data-types-c996f5e.md)
- **Repository Graphs**: [https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/repositoryobjects/data-intelligence-graphs](https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/repositoryobjects/data-intelligence-graphs)

---

**Last Updated**: 2025-11-22
