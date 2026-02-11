# SAP HANA CLI - Database Inspection Functions

**Source**: [https://github.com/SAP-samples/hana-developer-cli-tool-example/blob/main/utils/dbInspect.js](https://github.com/SAP-samples/hana-developer-cli-tool-example/blob/main/utils/dbInspect.js)

Detailed documentation of the database inspection functions used by hana-cli.

---

## Version & Metadata Functions

### getHANAVersion(db)

Returns HANA version information.

```javascript
// Returns: { version: "2.00.045", versionMajor: 2 }
```

**System Table**: `M_DATABASE`

### isCalculationView(db, schema, viewId)

Checks if a view is a Calculation View.

**System Table**: `_SYS_BI.BIMC_REPORTABLE_VIEWS`

**Note**: HANA 2.0+ only

---

## Table Inspection Functions

### getTable(db, schema, tableId)

Returns table metadata.

**Returns**:
| Field | Description |
|-------|-------------|
| TABLE_NAME | Table name |
| TABLE_OID | Object ID |
| TABLE_TYPE | Table type |
| HAS_PRIMARY_KEY | Primary key exists |
| UNLOAD_PRIORITY | Memory priority |
| IS_PRELOAD | Preload enabled |

**System Table**: `TABLES`

### getTableFields(db, tableOid)

Returns column metadata for a table.

**Returns**:
| Field | Description |
|-------|-------------|
| COLUMN_NAME | Column name |
| DATA_TYPE_NAME | Data type |
| LENGTH | Field length |
| SCALE | Decimal scale |
| IS_NULLABLE | Nullable flag |
| DEFAULT_VALUE | Default value |
| POSITION | Column position |

**System Table**: `TABLE_COLUMNS`

### getConstraints(db, object)

Returns PRIMARY KEY constraints.

---

## View Inspection Functions

### getView(db, schema, viewId)

Returns view metadata.

**Returns**:
| Field | Description |
|-------|-------------|
| VIEW_NAME | View name |
| VIEW_OID | Object ID |
| COMMENTS | Documentation |
| VIEW_TYPE | View type |

**Note**: Version-aware queries (HANA 1.0 vs 2.0+)

### getViewFields(db, viewOid)

Returns view column metadata.

**System Table**: `VIEW_COLUMNS`

### getViewParameters(db, viewOid)

Returns view input parameters.

**System Table**: `VIEW_PARAMETERS`

### getCalcViewFields(db, schema, viewId, viewOid)

Returns Calculation View field metadata.

**System Table**: `_SYS_BI.BIMC_DIMENSION_VIEW`

**Returns**:
| Field | Description |
|-------|-------------|
| POSITION | Field position |
| DATA_TYPE_NAME | Data type |
| SCALE | Decimal scale |
| KEY_COLUMN_NAME | Key indicator |

### getCalcViewParameters(db, schema, viewId, viewOid)

Returns Calculation View parameters.

**System Table**: `_SYS_BI.BIMC_VARIABLE_VIEW`

**Returns**:
| Field | Description |
|-------|-------------|
| PARAMETER_NAME | Parameter name |
| DATA_TYPE_NAME | Data type |
| MANDATORY | Required flag |
| DEFAULT_VALUE | Default value |

---

## Procedure & Function Functions

### getProcedure(db, schema, procedure)

Returns procedure metadata.

**Returns**:
| Field | Description |
|-------|-------------|
| PROCEDURE_OID | Object ID |
| SQL_SECURITY | Security mode |
| INPUT_PARAMETER_COUNT | Input params |
| OUTPUT_PARAMETER_COUNT | Output params |
| READ_ONLY | Read-only flag |
| IS_VALID | Validity status |

**System Table**: `PROCEDURES`

### getProcedurePrams(db, procOid)

Returns procedure parameters.

**System Table**: `PROCEDURE_PARAMETERS`

### getProcedurePramCols(db, procOid)

Returns procedure parameter columns (for table-type params).

**System Table**: `PROCEDURE_PARAMETER_COLUMNS`

### getFunction(db, schema, functionName)

Returns function metadata.

**Returns**:
| Field | Description |
|-------|-------------|
| FUNCTION_OID | Object ID |
| SQL_SECURITY | Security mode |
| INPUT_PARAMETER_COUNT | Input params |
| RETURN_VALUE_COUNT | Return values |

**System Table**: `FUNCTIONS`

### getFunctionPrams(db, funcOid)

Returns function parameters.

**Returns**:
| Field | Description |
|-------|-------------|
| PARAMETER_NAME | Parameter name |
| DATA_TYPE_NAME | Data type |
| PARAMETER_TYPE | IN/OUT/INOUT |

**System Table**: `FUNCTION_PARAMETERS`

### getFunctionPramCols(db, funcOid)

Returns function parameter columns.

---

## Utility Functions

### getDef(db, schema, Id)

Returns object creation statement.

**System Procedure**: `GET_OBJECT_DEFINITION`

### getGeoColumns(db, object, field, type)

Returns SRS_ID for spatial geometry columns.

### formatCDS(db, object, fields, constraints, type, schema, parent, parameters)

Formats database object as CDS entity.

**Features**:
- Type mapping (HANA to CDS)
- Name normalization
- Constraint handling
- Parameter support

### parseSQLOptions(output, cdsSource)

Extracts extended SQL syntax via regex:
- PARTITION clauses
- UNLOAD PRIORITY
- AUTO MERGE settings

---

## System Tables Summary

| Table | Purpose |
|-------|---------|
| `M_DATABASE` | Version info |
| `TABLES` | Table metadata |
| `TABLE_COLUMNS` | Column definitions |
| `VIEWS` | View metadata |
| `VIEW_COLUMNS` | View columns |
| `VIEW_PARAMETERS` | View input params |
| `PROCEDURES` | Procedure metadata |
| `PROCEDURE_PARAMETERS` | Procedure params |
| `PROCEDURE_PARAMETER_COLUMNS` | Table-type columns |
| `FUNCTIONS` | Function metadata |
| `FUNCTION_PARAMETERS` | Function params |
| `_SYS_BI.BIMC_REPORTABLE_VIEWS` | Calc view detection |
| `_SYS_BI.BIMC_DIMENSION_VIEW` | Calc view fields |
| `_SYS_BI.BIMC_VARIABLE_VIEW` | Calc view variables |

---

*Reference: [https://github.com/SAP-samples/hana-developer-cli-tool-example/blob/main/utils/dbInspect.js*](https://github.com/SAP-samples/hana-developer-cli-tool-example/blob/main/utils/dbInspect.js*)
