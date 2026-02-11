# Additional Features Guide

Additional SAP Data Intelligence features including monitoring, cloud storage services, scenario templates, data types, and Git integration.

## Table of Contents

1. [Monitoring Application](#monitoring-application)
2. [Cloud Storage Services](#cloud-storage-services)
3. [Scenario Templates](#scenario-templates)
4. [Custom Data Types](#custom-data-types)
5. [Git Terminal Integration](#git-terminal-integration)
6. [Graph Snippets](#graph-snippets)

---

## Monitoring Application

SAP Data Intelligence includes a stand-alone monitoring application for operational oversight.

### Accessing the Monitor

**Options:**
- SAP Data Intelligence Launchpad tile
- Direct stable URL access

### Capabilities

| Feature | Description |
|---------|-------------|
| Graph Status | View execution status, timing, type, source |
| Scheduling | Schedule graph executions |
| Termination | Terminate running processes |
| Navigation | Open graphs directly in Modeler |
| Configuration | Review graph configurations |
| Replication Flows | Monitor flows and associated tasks |

### Access Permissions

**With `sap.dh.monitoring` policy:**
- View analytics and instances for all tenant users
- Does not include schedule access

**Without policy:**
- Monitor only your own graphs

### What's Displayed

For each graph instance:
- Execution status (Running, Completed, Failed, Dead)
- Run timing (start, end, duration)
- Graph classification
- Source origin

---

## Cloud Storage Services

SAP Data Intelligence supports multiple cloud storage platforms.

### Supported Services

| Service | Description | Protocol |
|---------|-------------|----------|
| **Amazon S3** | AWS object storage | S3 API |
| **Azure Blob Storage (WASB)** | Microsoft cloud storage | WASB protocol |
| **Azure Data Lake (ADL/ADLS Gen2)** | Microsoft data lake | ADLS API |
| **Google Cloud Storage (GCS)** | Google object storage | GCS API |
| **Alibaba Cloud OSS** | Alibaba object storage | OSS API |
| **HDFS** | Hadoop distributed file system | HDFS protocol |
| **WebHDFS** | HDFS via REST API | HTTP/REST |
| **Local File System** | Local storage | File system |

### Connection Configuration

Each service requires specific connection parameters in Connection Management.

**Common Parameters:**
- Connection ID
- Root path/bucket
- Authentication credentials

**Service-Specific Examples:**

**Amazon S3:**
```
Connection Type: S3
Region: us-east-1
Access Key: <access-key>
Secret Key: <secret-key>
Bucket: my-bucket
```

**Azure Blob Storage:**
```
Connection Type: WASB
Account Name: <storage-account>
Account Key: <account-key>
Container: my-container
```

**Google Cloud Storage:**
```
Connection Type: GCS
Project ID: <project-id>
Service Account Key: <json-key>
Bucket: my-bucket
```

### Usage in Operators

File operators use connection IDs to access storage:
- Structured File Consumer/Producer
- Binary File Consumer/Producer
- Cloud-specific operators (S3 Consumer, etc.)

---

## Scenario Templates

Pre-built graph scenarios for common use cases.

### Finding Templates

1. Open Modeler application
2. Navigate to Graphs tab
3. Enable "Scenario Templates" in visible categories
4. Or search for package `com.sap.scenarioTemplates`

### Template Categories

#### 1. ABAP with Data Lakes

Ingest ABAP data into cloud storage.

**Use Cases:**
- Extract ABAP tables to S3/Azure/GCS
- Replicate CDS views to data lake
- S/4HANA data extraction

**Key Operators:**
- ABAP CDS Reader
- Read Data From SAP System
- Structured File Producer

#### 2. Data Processing with Scripting Languages

Manipulate data using scripts.

**Use Cases:**
- Custom transformations with Python
- JavaScript data processing
- R statistical analysis

**Key Operators:**
- Python3 Operator
- JavaScript Operator
- R Operator

#### 3. ETL from Database

Extract, transform, and load database data.

**Use Cases:**
- Database to file storage
- Database to database transfer
- SQL-based transformations

**Key Operators:**
- SQL Consumer
- Structured SQL Consumer
- Table Producer

#### 4. Loading Data from Data Lake to SAP HANA

Batch and stream data to HANA.

**Use Cases:**
- Load files to HANA tables
- Stream data to HANA
- Data lake integration

**Key Operators:**
- Structured File Consumer
- HANA Client
- Write HANA Table

### Using Templates

1. Find template in Graphs tab
2. Copy template to your workspace
3. Customize connections and parameters
4. Test with sample data
5. Deploy for production use

---

## Custom Data Types

Extend the type system with custom data types.

### Data Type Categories

| Category | Description | Customizable |
|----------|-------------|--------------|
| **Scalar** | Basic types (string, int, etc.) | No |
| **Structure** | Composite with named properties | Yes |
| **Table** | Column-based with keys | Yes |

### Creating Global Data Types

1. **Access Editor:**
   - Open Modeler
   - Navigate to Data Types tab
   - Click plus icon

2. **Configure Type:**
   - Enter name (two+ identifiers separated by periods)
   - Select type: Structure or Table
   - Click OK

3. **Define Properties:**
   - Add properties with plus icon
   - For structures: property name + scalar type
   - For tables: property name + scalar type + optional Key flag

4. **Save:**
   - Click save icon
   - Use "Save As" for variants

### Naming Convention

```
namespace.typename

Examples:
com.mycompany.CustomerRecord
com.mycompany.SalesData
```

### Structure Type Example

```
Type: com.company.Address
Properties:
  - street: string
  - city: string
  - country: string
  - postalCode: string
```

### Table Type Example

```
Type: com.company.OrderItems
Properties:
  - orderId: string (Key)
  - lineNumber: int64 (Key)
  - productId: string
  - quantity: int32
  - unitPrice: float64
```

### Managing Data Types

| Action | How |
|--------|-----|
| Edit | Double-click in tree view |
| Delete | Right-click > Delete |
| Copy | Save As with new name |

---

## Git Terminal Integration

Version control integration for SAP Data Intelligence artifacts.

### Purpose

Integrate file-based content with Git servers:
- Graphs
- Operators
- Dockerfiles
- Script code

### Accessing Git Terminal

1. Open Modeler
2. Navigate to Git Terminal option
3. Terminal opens with Git capabilities

### Available Commands

| Command | Function |
|---------|----------|
| `git init` | Initialize local repository |
| `git clone <url>` | Clone remote repository |
| `git add` | Stage changes |
| `git commit` | Commit changes |
| `git push` | Push to remote |
| `git pull` | Pull from remote |
| `git branch` | Create/list branches |
| `git merge` | Merge branches |
| `git rebase` | Rebase commits |
| `git status` | View status |
| `git log` | View history |

### Credential Handling

Configure Git credentials using standard Git Credential Helper:

```bash
git config --global credential.helper store
git config --global user.name "Your Name"
git config --global user.email "your.email@company.com"
```

### Creating Local Repository

```bash
cd /workspace/my-project
git init
git add .
git commit -m "Initial commit"
```

### Cloning Remote Repository

```bash
git clone [https://github.com/your-org/your-repo.git](https://github.com/your-org/your-repo.git)
cd your-repo
```

### .gitignore Configuration

Control what gets tracked:

```gitignore
# Ignore all except specific files
*
!graph.json
!operator.json
!*.py
```

### Best Practices

1. **Commit Often**: Small, focused commits
2. **Use Branches**: Feature branches for development
3. **Pull Before Push**: Avoid conflicts
4. **Meaningful Messages**: Descriptive commit messages
5. **Review Changes**: Check status before commit

---

## Graph Snippets

Reusable graph fragments for common patterns.

### Creating Snippets

1. Build working graph pattern
2. Select operators to include
3. Right-click > Save as Snippet
4. Name and describe snippet

### Using Snippets

1. Open Graphs tab
2. Find snippet in repository
3. Drag snippet to canvas
4. Configure connections
5. Customize parameters

### Snippet Best Practices

1. **Document Well**: Clear descriptions
2. **Parameterize**: Use substitution variables
3. **Test Thoroughly**: Verify before sharing
4. **Version**: Track snippet versions

---

## Documentation Links

- **Monitoring**: [https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/modelingguide/dataintelligence-monitoring](https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/modelingguide/dataintelligence-monitoring)
- **Service-Specific**: [https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/modelingguide/service-specific-information](https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/modelingguide/service-specific-information)
- **Scenario Templates**: [https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/modelingguide/using-scenario-templates](https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/modelingguide/using-scenario-templates)
- **Data Types**: [https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/modelingguide/creating-data-types](https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/modelingguide/creating-data-types)
- **Git Terminal**: [https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/modelingguide/using-git-terminal](https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/modelingguide/using-git-terminal)
- **Graph Snippets**: [https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/modelingguide/using-graph-snippets](https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/modelingguide/using-graph-snippets)

---

**Last Updated**: 2025-11-22
