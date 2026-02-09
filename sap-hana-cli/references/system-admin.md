# SAP HANA CLI - System Administration Reference

**Source**: [https://github.com/SAP-samples/hana-developer-cli-tool-example](https://github.com/SAP-samples/hana-developer-cli-tool-example)

Commands for system monitoring, configuration, and administration.

---

## System Information Commands

### systemInfo

Display comprehensive system details.

**Aliases**: `si`, `sysinfo`

```bash
hana-cli systemInfo
```

**UI Alternative**: `systemInfoUI`

**Queries**:
- `SELECT * FROM M_SYSTEM_OVERVIEW`
- `SELECT * FROM M_SERVICES`

**Output Modes**:
| Mode | Description |
|------|-------------|
| Basic | DB user, HANA version, overview, services |
| Environment | Connection options, HDI credentials |
| DBX | DB type, credentials for Database Explorer |

### hostInformation

Display host details.

```bash
hana-cli hostInformation
```

### version

Display hana-cli version.

```bash
hana-cli version
```

---

## Database Features

### features

List SAP HANA database features.

**Aliases**: `fe`, `Features`

```bash
hana-cli features
```

**Query**: `SELECT * FROM M_FEATURES`

**UI Alternative**: `featuresUI`

### featureUsage

Display feature usage metrics.

```bash
hana-cli featureUsage
```

**UI Alternative**: `featureUsageUI`

---

## Storage & Resources

### dataVolumes

Display data volume information.

```bash
hana-cli dataVolumes
```

### disks

Display disk information.

```bash
hana-cli disks
```

### ports

List database port assignments.

```bash
hana-cli ports
```

### reclaim

Reclaim database resources.

**Aliases**: `re`

```bash
hana-cli reclaim
```

**Operations Executed**:
1. `ALTER SYSTEM RECLAIM LOB SPACE` - Recover LOB storage
2. `ALTER SYSTEM RECLAIM LOG` - Free transaction log space
3. `ALTER SYSTEM RECLAIM DATAVOLUME 105 DEFRAGMENT` - Defragment storage

---

## Configuration Files

### iniFiles

List INI configuration files.

**Aliases**: `if`, `ini`

```bash
hana-cli iniFiles
```

**Query**: `SELECT * FROM M_INIFILES`

### iniContents

Display INI file contents.

```bash
hana-cli iniContents [file]
```

**Query**: `SELECT * FROM M_INIFILE_CONTENTS`

---

## Tracing & Debugging

### traces

List trace files.

**Aliases**: `tf`, `Traces`

```bash
hana-cli traces
```

**Query**: `SELECT * FROM M_TRACEFILES`

### traceContents

Display trace file contents.

```bash
hana-cli traceContents [trace]
```

---

## Data Types

### dataTypes

Display HANA data type specifications.

```bash
hana-cli dataTypes
```

**Query**: `SELECT TYPE_NAME, COLUMN_SIZE, CREATE_PARAMS FROM DATA_TYPES`

**UI Alternative**: `dataTypesUI`

---

## System Tables Reference

| Table | Purpose | Command |
|-------|---------|---------|
| `M_SYSTEM_OVERVIEW` | System overview | systemInfo |
| `M_SERVICES` | Running services | systemInfo |
| `M_FEATURES` | Available features | features |
| `M_TRACEFILES` | Trace file list | traces |
| `M_INIFILES` | INI file list | iniFiles |
| `M_INIFILE_CONTENTS` | INI content | iniContents |
| `DATA_TYPES` | Type definitions | dataTypes |

---

## Common Workflows

### Health Check

```bash
# System overview
hana-cli systemInfo

# Check features
hana-cli features

# Review configuration
hana-cli iniFiles
```

### Performance Investigation

```bash
# View trace files
hana-cli traces

# Check specific trace
hana-cli traceContents [tracefile]

# Review feature usage
hana-cli featureUsage
```

### Storage Management

```bash
# Check volumes
hana-cli dataVolumes

# Check disks
hana-cli disks

# Reclaim space
hana-cli reclaim
```

---

## Output Examples

### systemInfo Output

```
Database User: DBADMIN
HANA Version: 2.00.059.00

System Overview:
┌────────────────────┬─────────────────────────┐
│ NAME               │ VALUE                   │
├────────────────────┼─────────────────────────┤
│ Database Name      │ HXE                     │
│ Database Version   │ 2.00.059.00             │
│ Start Time         │ 2025-11-22 08:00:00     │
└────────────────────┴─────────────────────────┘
```

### features Output

```
┌───────────────────────────┬─────────┐
│ FEATURE_NAME              │ ENABLED │
├───────────────────────────┼─────────┤
│ Calculation Views         │ TRUE    │
│ Graph Engine              │ TRUE    │
│ Document Store            │ TRUE    │
│ Script Server             │ TRUE    │
└───────────────────────────┴─────────┘
```

---

*Reference: [https://github.com/SAP-samples/hana-developer-cli-tool-example*](https://github.com/SAP-samples/hana-developer-cli-tool-example*)
