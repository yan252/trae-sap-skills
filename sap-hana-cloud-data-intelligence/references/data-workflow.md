# Data Workflow Operators Guide

Complete guide for data workflow orchestration in SAP Data Intelligence.

## Table of Contents

1. [Overview](#overview)
2. [Workflow Structure](#workflow-structure)
3. [Available Operators](#available-operators)
4. [Data Transfer](#data-transfer)
5. [Remote Execution](#remote-execution)
6. [Control Flow](#control-flow)
7. [Notifications](#notifications)
8. [Best Practices](#best-practices)

---

## Overview

Data Workflow operators orchestrate data processing tasks that run for a limited time and finish with either "completed" or "dead" status.

**Key Characteristics:**
- Sequential execution via signal passing
- Operators start after receiving input signal
- Each operator has input, output, and error ports
- Unconnected output ports cause graph failure

**Important:** Do not mix Data Workflow operators with non-Data Workflow operators in the same graph.

---

## Workflow Structure

### Required Components

Every data workflow requires:
- **Workflow Trigger**: First operator (starts the workflow)
- **Workflow Terminator**: Last operator (ends the workflow)

### Basic Structure

```
[Workflow Trigger] -> [Task Operator(s)] -> [Workflow Terminator]
```

### Signal Flow

1. Workflow Trigger sends initial signal
2. Each operator waits for input signal
3. Operator executes task
4. Operator sends output signal (or error)
5. Next operator receives signal and executes
6. Workflow Terminator completes the graph

---

## Available Operators

### Core Workflow Operators

| Operator | Purpose |
|----------|---------|
| Workflow Trigger | Initiates workflow execution |
| Workflow Terminator | Concludes workflow with status |
| Workflow Split | Duplicates signal for parallel paths |
| Workflow Merge (AND) | Combines outputs using logical AND |
| Workflow Merge (OR) | Combines outputs using logical OR |

### Task Operators

| Operator | Purpose |
|----------|---------|
| Data Transfer | Move data between systems |
| Data Transform | Apply data transformations |
| Pipeline | Execute DI graphs locally or remotely |
| SAP Data Services Job | Run remote Data Services jobs |
| SAP HANA Flowgraph | Execute HANA flowgraphs |
| BW Process Chain | Run BW process chains |
| Notification | Send email notifications |

---

## Data Transfer

### Purpose

Transfer data from SAP systems to cloud storage.

### Supported Sources

- SAP Business Warehouse (BW)
- SAP HANA

### Supported Targets

- Amazon S3
- Google Cloud Storage
- Hadoop Distributed File System (HDFS)
- SAP Vora

### Transfer Modes

| Mode | Description | Best For |
|------|-------------|----------|
| BW OLAP | Default BW access | Small datasets |
| Generated HANA Views | Partition-based transfer | Large datasets |
| BW ODP | Datastore extraction | Cloud/distributed storage |

#### BW OLAP Mode

- Default mode for BW sources
- Uses standard OLAP interface (like RSRT2)
- Single result set processing
- Cell export limitations
- **Not suitable for large-scale transfers**

#### Generated HANA Views Mode

**Requirements:**
- Connection via DI Connection Management
- SAP BW 4.2.0 or later
- Working HANA database connection
- SSL certificates (if required)
- Query with generated calculation view (no restricted attributes)

**Advantage:** Transfers partitions separately, enabling large result sets and parallel processing.

#### BW ODP Mode

**Works with:** Datastores only

**Supported Targets:**
- Azure Data Lake
- Google Cloud Storage
- HDFS
- Alibaba OSS
- Amazon S3
- Semantic Data Lake
- Azure Storage Blob

**Note:** Partition processing is sequential, not parallel.

### Configuration

```
Source Connection: BW_SYSTEM
Target Connection: S3_BUCKET
Transfer Mode: Generated HANA Views
Source Query: /NAMESPACE/QUERY
Target Path: /data/export/
```

---

## Remote Execution

### Pipeline Operator

Execute SAP Data Intelligence graphs.

**Options:**
- Local execution (same DI instance)
- Remote execution (different DI instance)
- Parameter passing
- Synchronous/asynchronous

**Configuration:**
```
Graph: /namespace/my_pipeline
Connection: (for remote)
Parameters: key=value pairs
Wait for Completion: Yes/No
```

### SAP Data Services Job

Execute jobs in remote SAP Data Services systems.

**Prerequisites:**
- Data Services connection configured
- Job accessible from DI

**Configuration:**
```
Connection: DS_CONNECTION
Repository: REPO_NAME
Job: JOB_NAME
Global Variables: VAR1=VALUE1
```

### SAP HANA Flowgraph

Execute flowgraphs in remote HANA systems.

**Prerequisites:**
- HANA connection configured
- Flowgraph deployed

**Configuration:**
```
Connection: HANA_CONNECTION
Flowgraph: SCHEMA.FLOWGRAPH_NAME
Parameters: (if applicable)
```

### BW Process Chain

Execute SAP BW process chains.

**Prerequisites:**
- BW connection configured
- Process chain accessible

**Configuration:**
```
Connection: BW_CONNECTION
Process Chain: CHAIN_ID
Variant: (if applicable)
Wait for Completion: Yes/No
```

---

## Control Flow

### Workflow Split

Duplicates incoming signal to multiple output ports.

```
                    ┌──→ [Task A]
[Trigger] → [Split] ┼──→ [Task B]
                    └──→ [Task C]
```

**Use Case:** Parallel execution paths

### Workflow Merge (AND)

Combines multiple inputs using logical AND. Sends output only when **all** inputs received.

```
[Task A] ──┐
[Task B] ──┼──→ [Merge AND] → [Next Task]
[Task C] ──┘
```

**Use Case:** Wait for all parallel tasks to complete

### Workflow Merge (OR)

Combines multiple inputs using logical OR. Sends output when **any** input received.

```
[Task A] ──┐
[Task B] ──┼──→ [Merge OR] → [Next Task]
[Task C] ──┘
```

**Use Case:** Continue when first task completes

### Error Handling

**Error Port:**
- All task operators have error ports
- Connect error port to handle failures
- Unhandled errors terminate workflow

```
                    ┌── success ──→ [Continue]
[Task] ────────────┤
                    └── error ──→ [Error Handler]
```

---

## Notifications

### Notification Operator

Send email notifications during workflow execution.

**Configuration:**
```
SMTP Connection: EMAIL_CONNECTION
To: recipients@company.com
CC: (optional)
Subject: Workflow ${workflow.name} - ${status}
Body: The workflow completed at ${timestamp}
Attachment: (optional file path)
```

### Use Cases

- Success notifications
- Error alerts
- Progress updates
- Audit trail

### Template Variables

| Variable | Description |
|----------|-------------|
| `${workflow.name}` | Workflow name |
| `${status}` | Execution status |
| `${timestamp}` | Current timestamp |
| `${error.message}` | Error details (if failed) |

---

## Best Practices

### Design Principles

1. **Clear Flow**: Design linear or clearly branching workflows
2. **Error Handling**: Always connect error ports
3. **Notifications**: Add alerts for critical failures
4. **Idempotency**: Design tasks to be re-runnable

### Performance

1. **Parallelize**: Use Split/Merge for independent tasks
2. **Optimize Transfers**: Choose appropriate transfer mode
3. **Monitor Progress**: Track workflow status
4. **Resource Planning**: Consider target system load

### Reliability

1. **Test Components**: Validate each task individually
2. **Handle Failures**: Implement retry logic where needed
3. **Clean Up**: Manage temporary data
4. **Document**: Maintain workflow documentation

### Example Workflow

```
[Trigger]
    ↓
[Split]
    ├──→ [Transfer from BW] ──→ [Merge AND]
    └──→ [Transfer from HANA] ─┘
                                    ↓
                              [Transform Data]
                                    ↓
                              [Load to Target]
                                    ↓
                              [Send Notification]
                                    ↓
                              [Terminator]
```

---

## Documentation Links

- **Data Workflow Operators**: [https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/modelingguide/working-with-dataworkflow-operators](https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/modelingguide/working-with-dataworkflow-operators)
- **Transfer Data**: [https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/blob/main/docs/modelingguide/working-with-dataworkflow-operators/transfer-data-b250a0b.md](https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/blob/main/docs/modelingguide/working-with-dataworkflow-operators/transfer-data-b250a0b.md)
- **Transfer Modes**: [https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/blob/main/docs/modelingguide/working-with-dataworkflow-operators/transfer-modes-a615280.md](https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/blob/main/docs/modelingguide/working-with-dataworkflow-operators/transfer-modes-a615280.md)

---

**Last Updated**: 2025-11-22
