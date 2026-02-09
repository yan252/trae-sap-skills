# SAP Datasphere Catalog and Governance

## Overview

The SAP Datasphere Catalog provides a centralized hub for discovering, understanding, and governing data assets. It enables organizations to implement data governance practices while making trusted data accessible to business users.

**Documentation**: https://help.sap.com/docs/SAP_DATASPHERE/aca3ccb4b2f84eb8b6154e8fd2812c0e

## Catalog Features

### Asset Discovery

The catalog allows users to discover and explore:

- **Data Products**: Curated packages of views and models for specific use cases
- **Views and Tables**: Individual data objects with metadata
- **Analytic Models**: Consumer-ready analytics with measures and dimensions
- **Glossary Terms**: Business definitions and context
- **KPIs**: Key performance indicators with calculations

### Catalog Capabilities

| Capability | Description |
|------------|-------------|
| **Search** | Full-text search across all metadata |
| **Browse** | Navigate by category, domain, or owner |
| **Preview** | Sample data without modeling access |
| **Lineage** | Trace data from source to consumption |
| **Impact Analysis** | Understand downstream dependencies |
| **Rating & Reviews** | Community feedback on data quality |

## Glossary Management

### Creating a Glossary

A business glossary provides standardized definitions for key business terms.

```yaml
Glossary Structure:
  Categories:
    - Finance
    - Sales
    - HR
    - Supply Chain

  Term Components:
    - Name: Business-friendly term
    - Definition: Clear, unambiguous description
    - Examples: Usage examples
    - Synonyms: Alternative names
    - Related Terms: Links to related definitions
    - Owner: Responsible party
    - Status: Draft, Approved, Deprecated
```

### Example Glossary Terms

**Revenue**
```yaml
Term: Revenue
Category: Finance
Definition: The total income generated from sales of goods or services before any expenses are deducted
Calculation: SUM(Net Sales) for a given period
Synonyms: Sales, Turnover, Income
Related Terms: Gross Revenue, Net Revenue, Deferred Revenue
Owner: Finance Data Steward
Status: Approved
```

**Customer Lifetime Value (CLV)**
```yaml
Term: Customer Lifetime Value
Abbreviation: CLV
Category: Sales
Definition: The predicted net profit attributed to the entire future relationship with a customer
Calculation: (Average Order Value × Purchase Frequency × Customer Lifespan) - Acquisition Cost
Related Terms: Customer Acquisition Cost, Churn Rate
Owner: Marketing Analytics
Status: Approved
```

### Linking Terms to Data Assets

Associate glossary terms with views and columns:

1. Navigate to view in Data Builder
2. Open **Business Purpose** section
3. Link relevant glossary terms to:
   - The view itself (overall purpose)
   - Individual columns (column meaning)

## Data Quality

### Quality Rules

Define rules to validate data quality:

```yaml
Quality Rule Types:
  Completeness:
    - Not Null checks
    - Required field validation

  Uniqueness:
    - Primary key uniqueness
    - Duplicate detection

  Validity:
    - Range checks (min/max)
    - Pattern matching (regex)
    - Domain values (allowed list)

  Timeliness:
    - Freshness checks
    - SLA monitoring

  Consistency:
    - Cross-field validation
    - Referential integrity
```

### Quality Score Calculation

```
Quality Score = (Passed Records / Total Records) × 100

Aggregate Score = Weighted Average of:
  - Completeness Score (weight: 0.25)
  - Uniqueness Score (weight: 0.25)
  - Validity Score (weight: 0.30)
  - Timeliness Score (weight: 0.20)
```

### Quality Monitoring

Set up continuous quality monitoring:

1. **Create Quality Rules**: Define expectations
2. **Schedule Validation**: Run rules on schedule
3. **Set Thresholds**: Define acceptable quality levels
4. **Configure Alerts**: Notify when quality drops
5. **Track Trends**: Monitor quality over time

## Data Classification

### Sensitivity Levels

Classify data by sensitivity:

| Level | Description | Handling |
|-------|-------------|----------|
| **Public** | No restrictions | Open access |
| **Internal** | Business use only | Employee access |
| **Confidential** | Limited distribution | Need-to-know basis |
| **Restricted** | Highly sensitive | Strict controls, encryption |

### Data Categories

| Category | Examples | Regulations |
|----------|----------|-------------|
| **PII** | Name, Email, Phone | GDPR, CCPA |
| **PHI** | Medical records | HIPAA |
| **PCI** | Credit card numbers | PCI-DSS |
| **Financial** | Revenue, Costs | SOX |

### Auto-Classification

Configure automatic classification based on:

1. **Column Names**: Match patterns like `*_SSN`, `*_EMAIL`
2. **Data Patterns**: Detect formats like phone numbers, credit cards
3. **Source Systems**: Apply rules based on origin
4. **Glossary Terms**: Inherit classification from linked terms

## Data Lineage

### Lineage Visualization

View data flow from source to consumption:

```
Source System → Remote Table → Staging View → Fact View → Analytic Model → SAC Story
```

### Lineage Information

| Component | Captured Information |
|-----------|---------------------|
| **Source** | Connection, table, extraction time |
| **Transformations** | Joins, filters, calculations |
| **Consumption** | Views, models, reports using the data |
| **Refresh** | Last refresh time, frequency |

### Impact Analysis

Before making changes, understand impact:

1. Select object in Data Builder
2. Click **Impact Analysis**
3. Review:
   - Downstream dependencies
   - Affected reports/stories
   - User impact

## Publishing to Catalog

### Publication Workflow

```
1. Create Object → 2. Add Metadata → 3. Link Terms → 4. Request Approval → 5. Publish
```

### Required Metadata for Publication

```yaml
Publication Requirements:
  Required:
    - Business Name (readable name)
    - Description (purpose and content)
    - Owner (responsible person)
    - Classification (sensitivity level)

  Recommended:
    - Glossary Term Links
    - Quality Score
    - Data Freshness
    - Sample Data
    - Usage Guidelines
```

### Approval Process

1. **Submit for Review**: Owner submits asset
2. **Steward Review**: Data steward validates
3. **Quality Check**: Automated quality validation
4. **Approve/Reject**: Decision with feedback
5. **Publish**: Make available in catalog

## Governance Roles

### Standard Roles

| Role | Responsibilities |
|------|------------------|
| **Data Owner** | Business accountability for data |
| **Data Steward** | Quality and metadata management |
| **Data Custodian** | Technical implementation |
| **Data Consumer** | Uses data for analysis |

### Role Assignments

Configure governance roles in Administration:

```yaml
Governance Role Assignment:
  Data Steward - Finance:
    User: finance.steward@company.com
    Scope: Finance domain objects
    Permissions:
      - Approve publications
      - Edit glossary terms
      - Define quality rules
```

## Policies and Compliance

### Data Retention Policies

```yaml
Retention Policy - Transaction Data:
  Category: Financial Transactions
  Retention Period: 7 years
  Archive After: 2 years
  Delete After: 7 years
  Legal Basis: Tax regulations

Retention Policy - Log Data:
  Category: System Logs
  Retention Period: 90 days
  Archive After: 30 days
  Delete After: 90 days
```

### Access Policies

Combine with Data Access Controls:

```yaml
Access Policy - Regional Data:
  Rule: Users can only access data from their assigned region
  Implementation:
    - Data Access Control: region_access
    - Permission Table: user_region_assignments
    - Criteria Column: REGION_ID
```

### Audit Logging

Track all governance activities:

| Event | Logged Information |
|-------|-------------------|
| Publication | Who, When, What asset |
| Access | User, Object, Query |
| Changes | Before/After, Reason |
| Approvals | Approver, Decision, Comments |

## Best Practices

### Governance Implementation

1. **Start Small**: Begin with critical data domains
2. **Executive Sponsorship**: Secure leadership support
3. **Clear Ownership**: Assign accountable owners
4. **Automated Monitoring**: Don't rely on manual checks
5. **Regular Reviews**: Audit governance effectiveness quarterly

### Catalog Population

1. **Prioritize by Usage**: Catalog most-used assets first
2. **Quality over Quantity**: Well-documented few > poorly-documented many
3. **Template Descriptions**: Create standard description templates
4. **Glossary First**: Build glossary before linking to assets

### User Adoption

1. **Training**: Educate users on catalog search
2. **Quick Wins**: Show value with popular datasets
3. **Feedback Loop**: Collect and act on user feedback
4. **Gamification**: Recognize top contributors

## Integration with SAP Analytics Cloud

### Catalog-Enabled Stories

Users can:
1. Search catalog from SAC
2. Preview data before adding
3. See lineage and quality info
4. Add trusted data to stories

### Trusted Data Badge

Assets meeting criteria receive "Trusted" badge:
- Published to catalog
- Quality score > 90%
- Complete documentation
- Active owner assigned
