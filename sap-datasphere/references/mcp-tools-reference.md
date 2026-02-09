# SAP Datasphere MCP Tools - Complete Reference

## Overview

This document provides comprehensive technical reference for all 45 MCP tools provided by the SAP Datasphere MCP Server (@mariodefe/sap-datasphere-mcp).

**MCP Server Details:**
- **Package:** @mariodefe/sap-datasphere-mcp
- **Version:** Latest from npm
- **GitHub:** https://github.com/MarioDeFelipe/sap-datasphere-mcp
- **Authentication:** OAuth 2.0 Client Credentials
- **Protocol:** Model Context Protocol (MCP)
- **Transport:** stdio (local npm package execution)

## Installation

```bash
# Global installation
npm install -g @mariodefe/sap-datasphere-mcp

# Verify installation
npx @mariodefe/sap-datasphere-mcp --version
```

## Configuration

Create `.env` file in project root:

```bash
DATASPHERE_BASE_URL=https://your-tenant.eu10.hcs.cloud.sap
DATASPHERE_CLIENT_ID=your-oauth-client-id
DATASPHERE_CLIENT_SECRET=your-oauth-client-secret
DATASPHERE_TOKEN_URL=https://your-tenant.authentication.eu10.hana.ondemand.com/oauth/token
```

**Optional configurations:**
```bash
LOG_LEVEL=info  # debug, info, warn, error
USE_MOCK_DATA=false  # true for testing without tenant
```

## Authentication Flow

1. **Initial Request:** Tool call triggers authentication
2. **Token Acquisition:** OAuth 2.0 Client Credentials flow
3. **Token Storage:** Encrypted with Fernet cipher
4. **Auto Refresh:** Tokens refreshed 60s before expiration
5. **Permission Check:** Scope validation before operations

**Required Scopes:**
- `READ` - Read access to metadata and data
- `WRITE` - Create, update operations
- `ADMIN` - Administrative operations
- `SENSITIVE` - Access to sensitive data

---

# Foundation Tools (5)

## test_connection

**Purpose:** Verify connectivity to SAP Datasphere tenant

**Parameters:** None

**Returns:**
```json
{
  "status": "connected",
  "tenant_url": "https://tenant.eu10.hcs.cloud.sap",
  "latency_ms": 45,
  "version": "2025.24",
  "authenticated_user": "technical-user@company.com"
}
```

**Errors:**
- `AUTH_FAILED` - Invalid credentials
- `NETWORK_ERROR` - Cannot reach tenant
- `TIMEOUT` - Connection timeout (>5s)

**Example:**
```
Test connection to verify MCP setup
→ Result: Connected, 45ms latency
```

**Use Cases:**
- Initial MCP setup validation
- Troubleshooting connectivity issues
- Monitoring tenant availability
- Testing after configuration changes

**Performance:** < 100ms (cached after first call)

---

## get_current_user

**Purpose:** Get authenticated user details

**Parameters:** None

**Returns:**
```json
{
  "user_id": "TECH_USER",
  "email": "technical-user@company.com",
  "display_name": "Technical User",
  "permissions": ["READ", "WRITE"],
  "spaces": ["DEV", "PROD"],
  "authentication_method": "OAuth2"
}
```

**Errors:**
- `AUTH_EXPIRED` - Token expired
- `PERMISSION_DENIED` - Insufficient permissions

**Example:**
```
Get current user to verify authentication context
→ Result: TECH_USER with READ, WRITE permissions
```

**Use Cases:**
- Verifying authentication status
- Checking user permissions before operations
- Auditing who is performing actions
- Permission troubleshooting

---

## get_tenant_info

**Purpose:** Retrieve tenant configuration and capabilities

**Parameters:** None

**Returns:**
```json
{
  "tenant_url": "https://tenant.eu10.hcs.cloud.sap",
  "tenant_id": "TEN123456",
  "version": "2025.24",
  "region": "eu10",
  "features": ["Generic HTTP", "Business Data Cloud", "REST API Tasks"],
  "storage_total_gb": 1000,
  "storage_used_gb": 450,
  "spaces_count": 12
}
```

**Errors:**
- `PERMISSION_DENIED` - Need ADMIN scope

**Example:**
```
Get tenant info to check version and features
→ Result: Version 2025.24, Generic HTTP supported
```

**Use Cases:**
- Feature availability checks
- Version compatibility validation
- Capacity planning
- Tenant audit

---

## get_available_scopes

**Purpose:** List available permission scopes

**Parameters:** None

**Returns:**
```json
{
  "scopes": [
    {"name": "READ", "description": "Read access to metadata and data"},
    {"name": "WRITE", "description": "Create, update operations"},
    {"name": "ADMIN", "description": "Administrative operations"},
    {"name": "SENSITIVE", "description": "Access to sensitive data"}
  ],
  "current_scopes": ["READ", "WRITE"]
}
```

**Example:**
```
Get available scopes to understand permission model
→ Result: 4 scopes, current user has READ, WRITE
```

**Use Cases:**
- OAuth client configuration
- Permission model documentation
- Access request workflows

---

## list_spaces

**Purpose:** Discover all spaces in tenant

**Parameters:**
- `include_details` (optional): Include storage and member info

**Returns:**
```json
{
  "spaces": [
    {
      "space_id": "DEV",
      "business_name": "Development",
      "owner": "dev-team@company.com",
      "storage_gb": 50,
      "priority": 4,
      "member_count": 8
    },
    {
      "space_id": "PROD",
      "business_name": "Production Analytics",
      "owner": "analytics@company.com",
      "storage_gb": 200,
      "priority": 1,
      "member_count": 25
    }
  ],
  "total_count": 12
}
```

**Errors:**
- `PERMISSION_DENIED` - Need READ scope

**Example:**
```
List all spaces to find analytics space
→ Result: 12 spaces, PROD is production analytics
```

**Use Cases:**
- Space discovery
- Finding target space for deployment
- Space inventory
- Resource allocation analysis

---

# Catalog & Asset Tools (4)

## search_catalog

**Purpose:** Search business catalog for objects

**Parameters:**
- `query` (required): Search term
- `object_types` (optional): Filter by type (view, table, model)
- `limit` (optional): Max results (default 50)

**Returns:**
```json
{
  "results": [
    {
      "object_name": "fact_sales",
      "object_type": "view",
      "space": "PROD",
      "description": "Sales transactions fact table",
      "owner": "sales@company.com",
      "last_modified": "2025-12-20"
    }
  ],
  "total_count": 127,
  "search_time_ms": 245
}
```

**Example:**
```
Search catalog for "sales" objects
→ Result: 127 objects found, top match: fact_sales
```

**Use Cases:**
- Finding existing views/tables
- Discovering reusable objects
- Impact analysis
- Documentation generation

---

## find_assets_by_column

**Purpose:** Find data assets by column name

**Parameters:**
- `column_name` (required): Column to search for
- `space` (optional): Limit to specific space

**Returns:**
```json
{
  "assets": [
    {
      "object_name": "fact_sales",
      "object_type": "view",
      "space": "PROD",
      "column_name": "CUSTOMER_ID",
      "data_type": "NVARCHAR(10)"
    },
    {
      "object_name": "dim_customer",
      "object_type": "table",
      "space": "PROD",
      "column_name": "CUSTOMER_ID",
      "data_type": "NVARCHAR(10)"
    }
  ]
}
```

**Example:**
```
Find all assets containing CUSTOMER_ID column
→ Result: 8 objects (3 tables, 5 views)
```

**Use Cases:**
- Column lineage tracking
- Finding join candidates
- Data dictionary creation
- Impact analysis for column changes

---

## analyze_column_distribution

**Purpose:** Profile data distribution in columns

**Parameters:**
- `object_name` (required): Table or view name
- `column_name` (required): Column to analyze
- `space` (required): Space containing object

**Returns:**
```json
{
  "column_name": "PRODUCT_CATEGORY",
  "data_type": "NVARCHAR(50)",
  "total_rows": 1000000,
  "distinct_values": 12,
  "null_count": 0,
  "null_percentage": 0,
  "top_values": [
    {"value": "Electronics", "count": 450000, "percentage": 45},
    {"value": "Clothing", "count": 300000, "percentage": 30},
    {"value": "Food", "count": 150000, "percentage": 15}
  ],
  "min_value": "Accessories",
  "max_value": "Tools"
}
```

**Example:**
```
Analyze PRODUCT_CATEGORY distribution in dim_product
→ Result: 12 categories, Electronics is 45% of data
```

**Use Cases:**
- Data quality assessment
- Understanding data distributions
- Partition strategy planning
- Cardinality analysis for joins

---

## get_asset_metadata

**Purpose:** Retrieve detailed asset metadata

**Parameters:**
- `object_name` (required): Object name
- `space` (required): Space containing object

**Returns:**
```json
{
  "object_name": "fact_sales",
  "object_type": "view",
  "semantic_usage": "Fact",
  "description": "Sales transactions",
  "owner": "sales@company.com",
  "created_date": "2025-01-15",
  "last_modified": "2025-12-20",
  "row_count": 5000000,
  "size_mb": 1200,
  "columns": [...],
  "dependencies": [...],
  "consumers": [...]
}
```

**Example:**
```
Get complete metadata for fact_sales
→ Result: Fact view, 5M rows, 15 columns
```

**Use Cases:**
- Deep object analysis
- Documentation generation
- Impact analysis
- Dependency mapping

---

# Space Discovery (3)

## get_space_details

**Purpose:** Get space configuration and settings

**Parameters:**
- `space_id` (required): Space identifier

**Returns:**
```json
{
  "space_id": "PROD",
  "business_name": "Production Analytics",
  "description": "Production analytics environment",
  "owner": "analytics@company.com",
  "created_date": "2024-06-01",
  "storage": {
    "allocated_gb": 200,
    "used_gb": 145,
    "percentage_used": 72.5
  },
  "members": [
    {"user": "analyst1@company.com", "role": "Space Administrator"},
    {"user": "analyst2@company.com", "role": "Data Builder"}
  ],
  "priority": 1,
  "elastic_compute_enabled": true
}
```

**Example:**
```
Get PROD space details
→ Result: 200GB storage, 72.5% used, 25 members
```

**Use Cases:**
- Space audit
- Capacity planning
- Member management
- Configuration review

---

## list_space_objects

**Purpose:** List all objects in a space

**Parameters:**
- `space_id` (required): Space identifier
- `object_type` (optional): Filter by type

**Returns:**
```json
{
  "space_id": "PROD",
  "objects": [
    {"name": "fact_sales", "type": "view", "semantic_usage": "Fact"},
    {"name": "dim_product", "type": "table", "semantic_usage": "Dimension"},
    {"name": "am_sales_analysis", "type": "analytic_model"}
  ],
  "summary": {
    "views": 45,
    "tables": 18,
    "analytic_models": 8,
    "flows": 12
  }
}
```

**Example:**
```
List all objects in PROD space
→ Result: 83 objects (45 views, 18 tables, 8 models, 12 flows)
```

**Use Cases:**
- Space inventory
- Object discovery
- Cleanup identification
- Documentation generation

---

## get_space_permissions

**Purpose:** Review space access controls

**Parameters:**
- `space_id` (required): Space identifier

**Returns:**
```json
{
  "space_id": "PROD",
  "permissions": [
    {
      "user": "analyst1@company.com",
      "role": "Space Administrator",
      "permissions": ["READ", "WRITE", "DELETE", "MANAGE"]
    },
    {
      "user": "viewer@company.com",
      "role": "Viewer",
      "permissions": ["READ"]
    }
  ],
  "data_access_controls": [
    {
      "name": "Regional_Access",
      "type": "hierarchy",
      "enabled": true
    }
  ]
}
```

**Example:**
```
Get PROD space permissions
→ Result: 25 users, 3 Data Access Controls
```

**Use Cases:**
- Security audit
- Permission review
- Compliance reporting
- Access troubleshooting

---

# Database User Management (5)

## create_database_user

**Purpose:** Create new database user

**Parameters:**
- `username` (required): Username (max 20 chars)
- `password` (required): Password (encrypted)
- `permissions` (required): Array of permissions

**Returns:**
```json
{
  "username": "ETL_READER",
  "status": "created",
  "connection_string": "DRIVER={HANA};SERVER=tenant.eu10.hcs.cloud.sap:443;UID=ETL_READER;PWD=***",
  "permissions": ["READ"]
}
```

**Errors:**
- `USER_EXISTS` - Username already exists
- `INVALID_PASSWORD` - Password doesn't meet requirements
- `PERMISSION_DENIED` - Need ADMIN scope

**Example:**
```
Create database user ETL_READER with READ permissions
→ Result: User created, connection string provided
```

**Use Cases:**
- ETL tool connections
- Application database accounts
- External tool integration
- Service accounts

**Security:** Password encrypted in transit and at rest

---

## update_database_user

**Purpose:** Modify database user properties

**Parameters:**
- `username` (required): Username to update
- `permissions` (optional): New permissions
- `enabled` (optional): Enable/disable user

**Returns:**
```json
{
  "username": "ETL_READER",
  "status": "updated",
  "permissions": ["READ", "WRITE"]
}
```

**Example:**
```
Update ETL_READER to add WRITE permission
→ Result: Permissions updated successfully
```

**Use Cases:**
- Permission escalation
- Permission revocation
- User activation/deactivation

---

## delete_database_user

**Purpose:** Remove database user

**Parameters:**
- `username` (required): Username to delete

**Returns:**
```json
{
  "username": "ETL_READER",
  "status": "deleted"
}
```

**Errors:**
- `USER_NOT_FOUND` - Username doesn't exist
- `PERMISSION_DENIED` - Need ADMIN scope

**Example:**
```
Delete database user ETL_READER
→ Result: User deleted successfully
```

**Use Cases:**
- User deprovisioning
- Cleanup
- Security incidents

**Warning:** Irreversible operation

---

## reset_database_user_password

**Purpose:** Reset database user password

**Parameters:**
- `username` (required): Username

**Returns:**
```json
{
  "username": "ETL_READER",
  "new_password": "***encrypted***",
  "connection_string": "DRIVER={HANA};SERVER=...;UID=ETL_READER;PWD=***"
}
```

**Example:**
```
Reset password for ETL_READER
→ Result: New password generated, connection string updated
```

**Use Cases:**
- Password recovery
- Security incidents
- Credential rotation

**Security:** New password auto-generated, encrypted

---

## list_database_users

**Purpose:** List all database users

**Parameters:** None

**Returns:**
```json
{
  "users": [
    {
      "username": "ETL_READER",
      "permissions": ["READ"],
      "status": "active",
      "created_date": "2025-01-15",
      "last_login": "2025-12-27"
    },
    {
      "username": "APP_USER",
      "permissions": ["READ", "WRITE"],
      "status": "active",
      "created_date": "2025-06-01",
      "last_login": "2025-12-28"
    }
  ],
  "total_count": 8
}
```

**Example:**
```
List all database users
→ Result: 8 users, 6 active, 2 disabled
```

**Use Cases:**
- User audit
- Permission review
- Cleanup identification
- Security assessment

---

# Metadata Tools (4)

## get_table_metadata

**Purpose:** Get table structure and properties

**Parameters:**
- `table_name` (required): Table name
- `space` (required): Space containing table

**Returns:**
```json
{
  "table_name": "fact_sales",
  "table_type": "local",
  "space": "PROD",
  "row_count": 5000000,
  "size_mb": 1200,
  "columns": [
    {
      "column_name": "SALES_ID",
      "data_type": "NVARCHAR(20)",
      "nullable": false,
      "key_type": "PRIMARY"
    },
    {
      "column_name": "REVENUE",
      "data_type": "DECIMAL(15,2)",
      "nullable": true
    }
  ],
  "partitions": [
    {"partition_spec": "YEAR", "column": "ORDER_DATE"}
  ],
  "indexes": [
    {"name": "IDX_CUSTOMER", "columns": ["CUSTOMER_ID"]}
  ]
}
```

**Example:**
```
Get metadata for fact_sales table
→ Result: 15 columns, partitioned by YEAR(ORDER_DATE), 2 indexes
```

**Use Cases:**
- Schema discovery
- Integration planning
- Documentation generation
- Optimization analysis

---

## get_view_metadata

**Purpose:** Get view definition and dependencies

**Parameters:**
- `view_name` (required): View name
- `space` (required): Space containing view

**Returns:**
```json
{
  "view_name": "fact_sales",
  "view_type": "SQL",
  "semantic_usage": "Fact",
  "space": "PROD",
  "definition": "SELECT s.SALES_ID, s.REVENUE...",
  "columns": [...],
  "source_tables": [
    {"name": "raw_sales", "space": "INT"},
    {"name": "dim_time", "space": "CORE"}
  ],
  "persistence": {
    "enabled": true,
    "type": "snapshot",
    "refresh_schedule": "Daily 02:00"
  }
}
```

**Example:**
```
Get metadata for fact_sales view
→ Result: SQL view, persisted snapshot, refreshed daily
```

**Use Cases:**
- Understanding view logic
- Lineage analysis
- Impact analysis
- Performance optimization

---

## get_model_metadata

**Purpose:** Get analytic model structure

**Parameters:**
- `model_name` (required): Analytic model name
- `space` (required): Space containing model

**Returns:**
```json
{
  "model_name": "am_sales_analysis",
  "space": "PROD",
  "fact_source": "fact_sales",
  "dimensions": [
    {
      "name": "Customer",
      "association": "dim_customer",
      "attributes": ["CUSTOMER_ID", "NAME", "REGION"]
    },
    {
      "name": "Product",
      "association": "dim_product",
      "attributes": ["PRODUCT_ID", "CATEGORY"]
    }
  ],
  "measures": [
    {
      "name": "Revenue",
      "aggregation": "SUM",
      "source_column": "REVENUE"
    },
    {
      "name": "Avg Order Value",
      "aggregation": "AVG",
      "formula": "REVENUE / QUANTITY"
    }
  ],
  "variables": [
    {"name": "P_YEAR", "type": "filter", "default_value": "2025"}
  ]
}
```

**Example:**
```
Get metadata for am_sales_analysis
→ Result: 2 dimensions, 5 measures, 1 variable
```

**Use Cases:**
- SAC story development
- Understanding model capabilities
- Query optimization
- Documentation

---

## describe_entity

**Purpose:** Get comprehensive entity information

**Parameters:**
- `entity_name` (required): Entity name
- `space` (required): Space containing entity

**Returns:**
```json
{
  "entity_name": "fact_sales",
  "entity_type": "view",
  "space": "PROD",
  "metadata": {...},
  "lineage": {
    "upstream": ["raw_sales", "dim_time"],
    "downstream": ["am_sales_analysis", "rpt_sales_summary"]
  },
  "usage_stats": {
    "query_count_30d": 1250,
    "avg_query_time_ms": 450,
    "last_accessed": "2025-12-28"
  }
}
```

**Example:**
```
Describe fact_sales entity
→ Result: View with 2 upstream, 2 downstream dependencies, 1250 queries/month
```

**Use Cases:**
- Complete entity analysis
- Lineage visualization
- Usage analysis
- Documentation generation

---

# Analytical Consumption (4)

## query_analytical_data

**Purpose:** Query analytic models for consumption

**Parameters:**
- `model_name` (required): Analytic model name
- `space` (required): Space containing model
- `dimensions` (required): Dimensions to query
- `measures` (required): Measures to retrieve
- `filters` (optional): Filter conditions

**Returns:**
```json
{
  "model_name": "am_sales_analysis",
  "result_set": [
    {
      "REGION": "EMEA",
      "REVENUE": 1500000,
      "QUANTITY": 12500
    },
    {
      "REGION": "AMER",
      "REVENUE": 2300000,
      "QUANTITY": 18200
    }
  ],
  "row_count": 4,
  "query_time_ms": 680
}
```

**Example:**
```
Query am_sales_analysis for Revenue by Region
→ Result: 4 regions, AMER highest at 2.3M
```

**Use Cases:**
- Testing analytic models
- Validating calculations
- Ad-hoc analysis
- SAC story development

---

## get_analytic_model_structure

**Purpose:** Get analytic model definition

**Parameters:**
- `model_name` (required): Analytic model name
- `space` (required): Space containing model

**Returns:**
```json
{
  "model_name": "am_sales_analysis",
  "available_dimensions": [
    {"name": "Customer", "attributes": ["ID", "NAME", "REGION"]},
    {"name": "Product", "attributes": ["ID", "CATEGORY"]},
    {"name": "Time", "attributes": ["DATE", "YEAR", "QUARTER"]}
  ],
  "available_measures": [
    {"name": "Revenue", "unit": "USD"},
    {"name": "Quantity", "unit": "EA"},
    {"name": "Margin", "unit": "USD"}
  ],
  "variables": [...]
}
```

**Example:**
```
Get structure for am_sales_analysis
→ Result: 3 dimensions, 5 measures, 2 variables available
```

**Use Cases:**
- Building queries
- SAC integration
- Understanding model capabilities

---

## execute_smart_query

**Purpose:** Run SQL queries with aggregation support

**Parameters:**
- `sql` (required): SQL statement
- `space` (required): Space context

**Returns:**
```json
{
  "result_set": [
    {"REGION": "EMEA", "TOTAL_REVENUE": 1500000},
    {"REGION": "AMER", "TOTAL_REVENUE": 2300000}
  ],
  "row_count": 4,
  "query_time_ms": 420,
  "optimizations_applied": ["Aggregation pushdown", "Column pruning"]
}
```

**Example:**
```
Execute: SELECT REGION, SUM(REVENUE) FROM fact_sales GROUP BY REGION
→ Result: 4 regions, aggregated successfully
```

**Use Cases:**
- Ad-hoc analysis
- Testing transformations
- Data validation
- Prototyping queries

**Performance:** Automatic aggregation pushdown

---

## preview_data

**Purpose:** Sample data from tables/views

**Parameters:**
- `object_name` (required): Table or view name
- `space` (required): Space containing object
- `limit` (optional): Row limit (default 100, max 1000)

**Returns:**
```json
{
  "object_name": "dim_product",
  "columns": ["PRODUCT_ID", "CATEGORY", "PRICE"],
  "rows": [
    {"PRODUCT_ID": "P001", "CATEGORY": "Electronics", "PRICE": 599.99},
    {"PRODUCT_ID": "P002", "CATEGORY": "Clothing", "PRICE": 49.99}
  ],
  "row_count": 100,
  "total_rows_in_object": 50000
}
```

**Example:**
```
Preview 10 rows from dim_product
→ Result: 10 sample rows displayed
```

**Use Cases:**
- Quick data inspection
- Validation
- Understanding data content
- Testing

**Performance:** < 200ms for most objects

---

# ETL-Optimized Relational (4)

## query_relational_entity

**Purpose:** Query relational data efficiently

**Parameters:**
- `entity_name` (required): Table or view name
- `space` (required): Space containing entity
- `filters` (optional): WHERE clause conditions
- `limit` (optional): Row limit

**Returns:**
```json
{
  "entity_name": "fact_sales",
  "rows": [...],
  "row_count": 1000,
  "query_time_ms": 850
}
```

**Example:**
```
Query fact_sales with filter REGION='EMEA'
→ Result: 1000 rows, 850ms query time
```

**Use Cases:**
- ETL extraction
- Data migration
- Relational queries without aggregation

**Performance:** Optimized for large result sets

---

## execute_query

**Purpose:** Run SQL queries via OData

**Parameters:**
- `sql` (required): SQL statement
- `space` (required): Space context

**Returns:**
```json
{
  "result_set": [...],
  "row_count": 1500,
  "query_time_ms": 920
}
```

**Example:**
```
Execute: SELECT * FROM fact_sales WHERE ORDER_DATE >= '2025-01-01'
→ Result: 1500 rows retrieved
```

**Use Cases:**
- Standard SQL operations
- Data retrieval
- Testing queries

**Performance:** 500-2,000ms typical

---

## bulk_extract

**Purpose:** Extract large datasets

**Parameters:**
- `source` (required): Source object name
- `space` (required): Space containing source
- `filters` (optional): Filter conditions
- `batch_size` (optional): Rows per batch (default 10000)

**Returns:**
```json
{
  "batches": [
    {"batch_id": 1, "rows": 10000, "status": "complete"},
    {"batch_id": 2, "rows": 10000, "status": "complete"},
    {"batch_id": 3, "rows": 5000, "status": "complete"}
  ],
  "total_rows": 25000,
  "extraction_time_ms": 12450
}
```

**Example:**
```
Bulk extract fact_sales to CSV
→ Result: 25,000 rows extracted in 3 batches
```

**Use Cases:**
- Large data migration
- Archiving
- Offline analysis
- Data lake exports

**Performance:** Up to 50,000 rows supported

---

## stream_data

**Purpose:** Stream data for real-time processing

**Parameters:**
- `source` (required): Source object name
- `space` (required): Space containing source
- `streaming_config` (optional): Streaming parameters

**Returns:**
```json
{
  "stream_id": "stream_12345",
  "status": "active",
  "rows_streamed": 15000,
  "throughput_rows_per_sec": 500
}
```

**Example:**
```
Stream fact_sales for real-time ETL
→ Result: Stream active, 500 rows/sec throughput
```

**Use Cases:**
- Real-time data pipelines
- Streaming ETL
- Event processing
- Live dashboards

**Performance:** 500-2,000 rows/sec typical

---

# Search Tools (2)

## semantic_search

**Purpose:** AI-powered semantic search across catalog

**Parameters:**
- `query` (required): Natural language search query
- `limit` (optional): Max results (default 20)

**Returns:**
```json
{
  "results": [
    {
      "object_name": "fact_sales",
      "relevance_score": 0.95,
      "match_reason": "Semantic match: 'sales transactions' with query"
    },
    {
      "object_name": "am_sales_analysis",
      "relevance_score": 0.88,
      "match_reason": "Contains related dimensions and measures"
    }
  ]
}
```

**Example:**
```
Semantic search: "Find objects related to customer purchases"
→ Result: fact_sales (95% match), am_sales_analysis (88% match)
```

**Use Cases:**
- Fuzzy object discovery
- Natural language search
- Finding related objects
- Exploration

**Performance:** 200-800ms

---

## quick_find

**Purpose:** Fast object lookup by name

**Parameters:**
- `object_name` (required): Exact or partial name
- `fuzzy` (optional): Enable fuzzy matching

**Returns:**
```json
{
  "matches": [
    {"name": "fact_sales", "type": "view", "space": "PROD"},
    {"name": "fact_sales_archive", "type": "table", "space": "ARCHIVE"}
  ]
}
```

**Example:**
```
Quick find: "fact_sal*"
→ Result: 2 matches found
```

**Use Cases:**
- Quick navigation
- Autocomplete
- Object lookup

**Performance:** < 50ms

---

## Error Handling

### Common Error Codes

| Code | Description | Resolution |
|------|-------------|------------|
| `AUTH_FAILED` | Authentication failed | Check OAuth credentials in .env |
| `AUTH_EXPIRED` | Token expired | Automatic refresh, retry operation |
| `PERMISSION_DENIED` | Insufficient permissions | Check required scopes |
| `OBJECT_NOT_FOUND` | Object doesn't exist | Verify object name and space |
| `NETWORK_ERROR` | Network connectivity issue | Check base URL, firewall |
| `TIMEOUT` | Operation timeout | Reduce data volume, check performance |
| `INVALID_PARAMETER` | Invalid parameter value | Check parameter format |
| `RATE_LIMIT` | Too many requests | Implement exponential backoff |

### Error Response Format

```json
{
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "User lacks WRITE permission for space PROD",
    "details": {
      "user": "technical-user@company.com",
      "required_scope": "WRITE",
      "current_scopes": ["READ"]
    }
  }
}
```

## Performance Optimization

### Best Practices

1. **Use Appropriate Tools:**
   - Metadata: Use get_*_metadata (< 100ms)
   - Small queries: Use preview_data or execute_smart_query
   - Large extracts: Use bulk_extract with batching

2. **Implement Caching:**
   - Cache metadata for 1 hour
   - Cache catalog searches for 15 minutes
   - Invalidate on object updates

3. **Batch Operations:**
   - Group similar queries together
   - Use bulk_extract for >1,000 rows
   - Implement parallel processing for independent queries

4. **Filter Early:**
   - Apply filters in query, not post-processing
   - Use indexed columns in WHERE clauses
   - Limit result sets to needed rows

### Performance Benchmarks

| Operation Category | Target Response Time | Optimization Tips |
|--------------------|---------------------|-------------------|
| Authentication | < 200ms | Cached after first call |
| Metadata queries | < 100ms | Cached, indexed |
| Catalog search | 100-500ms | Use filters, limit results |
| Data preview | < 200ms | Limit rows to 100 |
| Analytical queries | 500-2,000ms | Use aggregation pushdown |
| Bulk extract | Varies | Use batching, parallel streams |

## Security Best Practices

1. **Credential Management:**
   - Store credentials in .env, never in code
   - Use environment-specific credentials
   - Rotate credentials regularly (90 days recommended)
   - Use minimal required scopes

2. **Access Control:**
   - Request minimum required permissions
   - Implement user consent for sensitive operations
   - Log all administrative operations
   - Review permissions quarterly

3. **Data Protection:**
   - Redact PII in logs
   - Encrypt credentials at rest
   - Use HTTPS for all communications
   - Implement audit trails

4. **Monitoring:**
   - Log authentication attempts
   - Monitor unusual query patterns
   - Alert on permission escalation
   - Track data access for compliance

## Troubleshooting

### Connection Issues

```bash
# Test connection
npx @mariodefe/sap-datasphere-mcp --test

# Enable debug logging
export LOG_LEVEL=debug

# Verify environment variables
echo $DATASPHERE_BASE_URL
echo $DATASPHERE_CLIENT_ID
```

### Common Issues

**Issue:** Authentication fails
**Solution:**
1. Verify OAuth credentials in .env
2. Check token URL matches tenant region
3. Ensure scopes include required permissions

**Issue:** Slow queries
**Solution:**
1. Add filters to reduce data volume
2. Use preview_data for sampling
3. Check tenant performance metrics

**Issue:** Objects not found
**Solution:**
1. Verify object name spelling
2. Check space context
3. Confirm user has READ permission

## Additional Resources

- **GitHub:** https://github.com/MarioDeFelipe/sap-datasphere-mcp
- **NPM:** https://www.npmjs.com/package/@mariodefe/sap-datasphere-mcp
- **Blog Post:** https://pub.towardsai.net/sap-datasphere-mcp-server-release-blog-0e82ea33db16
- **SAP Help:** https://help.sap.com/docs/SAP_DATASPHERE
- **MCP Specification:** https://modelcontextprotocol.io/
