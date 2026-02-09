# What's New in SAP Datasphere 2025

## Overview

This document covers the major features and enhancements released in SAP Datasphere during 2025. SAP Datasphere follows a continuous delivery model with releases approximately every two weeks.

**Official What's New**: https://help.sap.com/whats-new/48017b2cc4834fc6b6cae87097bd9e4d

## Q4 2025 Highlights

### Generic HTTP Connection (2025.22+)

Connect to external REST APIs directly from Datasphere.

**Key Features:**
- REST-based API connectivity
- OAuth 2.0, API Key, Basic Auth support
- Request/response transformation
- Error handling and retry logic

**Use Cases:**
- Third-party data services (weather, market data)
- Internal microservices
- Partner APIs
- Custom data sources

```yaml
Generic HTTP Connection:
  Base URL: https://api.example.com/v1
  Authentication: OAuth 2.0
  Headers:
    Content-Type: application/json
  Timeout: 30 seconds
  Retry: 3 attempts
```

### REST API Task in Task Chains (2025.20+)

Call REST APIs as steps within task chains.

**Capabilities:**
- Synchronous and asynchronous execution
- Request body templating
- Response handling
- Variable passing between steps

```yaml
Task Chain with REST API:
  Steps:
    1. Refresh Data Flow
    2. Call REST API:
        URL: /notifications/send
        Method: POST
        Body: '{"message": "ETL complete", "status": "${status}"}'
    3. Update Status Table
```

### SAP Business Data Cloud Integration (2025.18+)

Deep integration with SAP Business Data Cloud for enterprise data fabric.

**Features:**
- Unified metadata management
- Cross-product lineage
- Shared business glossary
- Federated data discovery

### Analytic Model Enhancements

**Secondary Structures (2025.19+):**
- Define alternative hierarchies
- Custom rollup paths
- Multiple aggregation scenarios

**Improved Currency Conversion (2025.21+):**
- Enhanced rate type handling
- Point-in-time conversion
- Multiple target currencies

## Q3 2025 Highlights

### Enhanced Replication Flows

**Content Type for ABAP Sources (2025.04+):**
- Template Type for standard extractions
- Better delta handling
- Improved performance

**MS SQL Server Support:**
- Source connector for Microsoft SQL Server
- Full and delta replication
- CDC support

### View Analyzer Improvements

**Query Performance Insights:**
- Execution plan visualization
- Bottleneck identification
- Optimization recommendations

**Resource Consumption Analysis:**
- Memory usage tracking
- CPU utilization
- I/O statistics

### Elastic Compute Enhancements

**Auto-Scaling (2025.15+):**
- Workload-based scaling
- Cost optimization rules
- Scheduling policies

**Workload Assignment:**
- Assign specific flows to elastic nodes
- Priority-based routing
- Resource isolation

## Q2 2025 Highlights

### Data Access Controls

**Improved Hierarchy Support (2025.10+):**
- External hierarchy integration
- Multi-level authorization
- Performance optimization

**Row and Column Level Security:**
- Combined row/column restrictions
- Dynamic masking
- Context-aware access

### Data Flows

**Python Operator Enhancements (2025.08+):**
- Extended library support
- Improved debugging
- Performance optimization

**Parallel Execution:**
- Branch parallelization
- Resource optimization
- Dependency management

### Content Transport

**CLI Support for Transport (2025.12+):**
```bash
# Export content
datasphere objects export \
  --space DEV \
  --objects view1,view2,model1 \
  --output-file package.zip

# Import to target
datasphere objects import \
  --space PROD \
  --input-file package.zip \
  --overwrite
```

**Improved Dependency Handling:**
- Automatic dependency detection
- Conflict resolution
- Rollback support

## Q1 2025 Highlights

### Data Integration

**Transformation Flow GA (2025.02+):**
- Production-ready transformation flows
- Delta processing support
- Complex transformation logic

**Real-Time Replication Enhancements:**
- Improved latency
- Better error recovery
- Extended source support

### Modeling

**Analytic Model Variables (2025.04+):**
- Dynamic default values
- Derived variables
- Reference date handling

**Association Improvements:**
- Multi-hop associations
- Composite key support
- Performance optimization

### Administration

**SCIM API for User Management (2025.03+):**
- Automated user provisioning
- Group synchronization
- IdP integration

**Workload Management (2025.06+):**
- Statement limits by space
- Priority configuration
- Resource quotas

## New Connection Types 2025

| Connection | Release | Type |
|------------|---------|------|
| Generic HTTP | 2025.22 | API |
| Microsoft Fabric | 2025.18 | Analytics |
| Databricks Unity Catalog | 2025.16 | Data Platform |
| Snowflake Native | 2025.14 | Data Warehouse |
| MongoDB Atlas | 2025.12 | NoSQL |

## Performance Improvements

### Query Optimization

- **Pushdown Improvements**: Better filter and aggregation pushdown
- **Join Optimization**: Improved multi-table join strategies
- **Caching**: Enhanced result caching for repeated queries

### Data Loading

- **Parallel Loading**: Increased parallelism for large loads
- **Compression**: Better compression algorithms
- **Network Optimization**: Reduced data transfer overhead

## Deprecated Features

| Feature | Deprecated | End of Support | Replacement |
|---------|------------|----------------|-------------|
| SAP Data Warehouse Cloud (DWC) branding | 2024 | - | SAP Datasphere |
| Classic Analytical Dataset | 2024 | 2025 Q4 | Analytic Model |
| Legacy Data Flow operators | 2025 Q1 | 2025 Q4 | New operator set |

## Migration Guides

### From Data Warehouse Cloud

No action required - DWC is now Datasphere. All features continue to work.

### From Legacy Features

**Analytical Dataset to Analytic Model:**
1. Create new Analytic Model
2. Map dimensions and measures
3. Configure variables
4. Test consumption in SAC
5. Update SAC stories
6. Deprecate old dataset

**Legacy Data Flows to Transformation Flows:**
1. Document existing flow logic
2. Create equivalent transformation flow
3. Test with sample data
4. Run parallel validation
5. Switch over

## Upcoming Features (Roadmap)

Based on public roadmap information:

**Expected 2026:**
- Enhanced AI/ML integration
- Advanced data quality automation
- Expanded real-time capabilities
- Deeper SAP S/4HANA integration

**Note**: Roadmap items are subject to change. Check official SAP roadmap for current information.

## Resources

- **What's New**: https://help.sap.com/whats-new/48017b2cc4834fc6b6cae87097bd9e4d
- **Release Notes**: Available in tenant administration
- **SAP Community**: https://community.sap.com/topics/datasphere
- **SAP Road Map Explorer**: https://roadmaps.sap.com

## Version Information

This document covers releases through version **2025.24** (November 2025).

Check your tenant version:
1. Go to **System** > **About**
2. Note the version number
3. Compare with feature release versions above
