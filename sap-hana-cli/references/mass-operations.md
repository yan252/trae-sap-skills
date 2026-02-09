# SAP HANA CLI - Mass Operations Reference

**Source**: [https://github.com/SAP-samples/hana-developer-cli-tool-example/blob/main/utils/massConvert.js](https://github.com/SAP-samples/hana-developer-cli-tool-example/blob/main/utils/massConvert.js)

Commands and functions for batch operations on database objects.

---

## Mass Convert Command

### massConvert

Batch convert database objects to various formats.

**Aliases**: `mc`, `massconvert`, `massConv`, `massconv`

```bash
hana-cli massConvert [schema] [table] [view]
```

**UI Alternative**: `massConvertUI`

---

## Conversion Types

### HDBTABLE Format

Generates `.hdbtable` files packaged in ZIP format.

```bash
hana-cli massConvert -s MYSCHEMA -o hdbtable
```

**Functions**:
- `hdbtableTablesSQL()` - SQL-based table conversion
- `hdbtableTables()` - CDS-compiled table conversion
- `hdbtableViewsSQL()` - SQL-based view conversion
- `hdbtableViews()` - CDS-compiled view conversion

### HDBMIGRATIONTABLE Format

Generates `.hdbmigrationtable` files with version headers.

```bash
hana-cli massConvert -s MYSCHEMA -o hdbmigrationtable
```

**Functions**:
- `hdbmigrationtableTablesSQL()` - SQL-based migration format
- `hdbmigrationtableTables()` - CDS-compiled migration format

### CDS Format

Generates unified `.cds` source file.

```bash
hana-cli massConvert -s MYSCHEMA -o cds
```

**Functions**:
- `cdsTables()` - Extracts table definitions
- `cdsViews()` - Extracts view definitions with parameters

---

## Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `useHanaTypes` | boolean | Apply HANA-specific data types |
| `keepPath` | boolean | Preserve namespace paths |
| `noColons` | boolean | Remove colon syntax |
| `useExists` | boolean | Use EXISTS conditions |
| `useQuoted` | boolean | Quote identifiers |
| `useCatalogPure` | boolean | SQL-based catalog extraction |
| `namespace` | string | CDS namespace prefix |
| `limit` | number | Restrict result set size |
| `log` | boolean | Generate JSON audit logs |
| `table` | string | Pattern filter for tables |
| `view` | string | Pattern filter for views |

---

## Output Functions

### writeZip()

Compresses files using DEFLATE compression.

### writeCDS()

Writes unified CDS file containing all entities.

### writeSynonyms()

Stores synonym mappings for reference.

### writeLog()

Creates JSON execution logs for auditing.

---

## Mass Rename Command

### massRename

Batch rename database objects.

```bash
hana-cli massRename [schema]
```

**Use Cases**:
- Standardize naming conventions
- Apply prefixes/suffixes
- Case conversion

---

## Mass Users Command

### massUsers

Bulk user operations.

```bash
hana-cli massUsers
```

**Use Cases**:
- Create multiple users
- Assign roles in bulk
- User cleanup operations

---

## Workflow Example

### Convert Entire Schema to CDS

```bash
# Interactive mode
hana-cli massConvert

# Direct specification
hana-cli massConvert -s MYSCHEMA

# With options
hana-cli massConvert -s MYSCHEMA --useHanaTypes --namespace "my.app"

# Generate log file
hana-cli massConvert -s MYSCHEMA --log
```

### Using the UI

```bash
# Launch browser-based interface
hana-cli massConvertUI
```

The UI provides:
- Schema browser
- Object selection
- Preview before conversion
- Download options

---

## Output Structure

### ZIP Archive Contents

```
output.zip
├── src/
│   ├── CUSTOMERS.hdbtable
│   ├── ORDERS.hdbtable
│   ├── PRODUCTS.hdbtable
│   └── ...
└── synonyms.json (if applicable)
```

### CDS File Structure

```cds
namespace my.schema;

entity CUSTOMERS {
  key ID : Integer;
  NAME : String(100);
  EMAIL : String(255);
}

entity ORDERS {
  key ID : Integer;
  CUSTOMER_ID : Integer;
  ORDER_DATE : Date;
}
```

---

## Best Practices

1. **Test with limit first**: Use `--limit 10` to verify output format
2. **Review generated files**: Check for naming conflicts
3. **Backup before conversion**: Preserve original definitions
4. **Use namespaces**: Apply consistent CDS namespaces
5. **Enable logging**: Track what was converted

---

*Reference: [https://github.com/SAP-samples/hana-developer-cli-tool-example/blob/main/utils/massConvert.js*](https://github.com/SAP-samples/hana-developer-cli-tool-example/blob/main/utils/massConvert.js*)
