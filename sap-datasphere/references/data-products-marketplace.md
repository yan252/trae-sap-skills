# SAP Datasphere Data Marketplace

## Overview

The SAP Datasphere Data Marketplace enables organizations to share, discover, and consume data products across the enterprise and with external partners. Data providers can create curated data packages while consumers can easily find and acquire data for their needs.

**Documentation**: https://help.sap.com/docs/SAP_DATASPHERE/e4059f908d16406492956e5dbcf142dc

## Key Concepts

### Data Products

A data product is a curated, documented, and governed package of data assets designed for a specific use case.

```yaml
Data Product Components:
  Core Assets:
    - Views (facts, dimensions)
    - Analytic Models
    - Business Entities

  Documentation:
    - Description and purpose
    - Sample queries
    - Usage guidelines
    - Data dictionary

  Governance:
    - Owner information
    - Quality score
    - Freshness guarantee
    - Terms of use
```

### Data Providers

Organizations or teams that create and publish data products.

```yaml
Provider Profile:
  Organization: Finance Data Team
  Contact: finance-data@company.com
  Visibility: Internal | Partner | Public
  Products: 12 published
  Rating: 4.5/5 stars
```

### Data Consumers

Users who discover and request access to data products.

## Creating Data Products

### Step 1: Plan the Data Product

```yaml
Planning Checklist:
  Purpose:
    - What business problem does this solve?
    - Who are the target consumers?
    - What questions can it answer?

  Contents:
    - Which views/models to include?
    - What granularity (summary vs detail)?
    - Time range and refresh frequency?

  Quality:
    - Data quality requirements met?
    - Documentation complete?
    - Sample queries prepared?
```

### Step 2: Prepare Data Assets

1. **Create Views/Models** in Data Builder
2. **Set Semantic Usage** (Fact, Dimension, Analytic Model)
3. **Configure Associations** between entities
4. **Enable Exposure** for consumption
5. **Document** each object thoroughly

### Step 3: Create Data Product

1. Navigate to **Data Products** in Datasphere
2. Click **Create Data Product**
3. Configure:

```yaml
Data Product Configuration:
  Basic Information:
    Name: Sales Analytics Package
    Description: >
      Comprehensive sales data package including transactions,
      customer master data, and product information. Supports
      regional and product-level analysis.
    Category: Sales & Marketing

  Content:
    Space: PROD_ANALYTICS
    Objects:
      - fact_sales (Fact)
      - dim_customer (Dimension)
      - dim_product (Dimension)
      - dim_time (Dimension)
      - am_sales_analysis (Analytic Model)

  Terms:
    Use Case: Internal analytics and reporting
    Restrictions: No external sharing without approval
    SLA: Data refreshed daily by 6:00 AM CET
```

### Step 4: Add Documentation

```markdown
## Sales Analytics Package

### Overview
This data product provides comprehensive sales transaction data
combined with customer and product master data for analytics.

### Use Cases
- Regional sales performance analysis
- Customer segmentation
- Product mix optimization
- Revenue forecasting

### Data Model
```
fact_sales (grain: order line item)
├── dim_customer (via CUSTOMER_ID)
├── dim_product (via PRODUCT_ID)
└── dim_time (via ORDER_DATE)
```

### Key Measures
| Measure | Description | Aggregation |
|---------|-------------|-------------|
| Revenue | Net sales amount | SUM |
| Quantity | Units sold | SUM |
| Margin | Revenue - Cost | SUM |
| Avg Order Value | Revenue / Orders | AVG |

### Sample Query
```sql
SELECT
  p.CATEGORY,
  SUM(s.REVENUE) as Total_Revenue
FROM fact_sales s
JOIN dim_product p ON s.PRODUCT_ID = p.PRODUCT_ID
GROUP BY p.CATEGORY
ORDER BY Total_Revenue DESC
```

### Refresh Schedule
- Full Refresh: Daily at 2:00 AM CET
- Data Latency: T-1 (previous day)
```

### Step 5: Set Visibility and Access

```yaml
Visibility Options:
  Internal:
    - Available to all tenant users
    - No approval required

  Specific Users:
    - Available to selected users/teams
    - Requires explicit access grant

  Partner:
    - Available to trusted partners
    - Via Data Sharing Destination

  External:
    - Listed on public marketplace
    - Commercial terms apply
```

### Step 6: Publish

1. Review data product configuration
2. Preview as consumer would see it
3. Click **Publish**
4. Product appears in Marketplace

## Data Provider Management

### Creating a Data Provider

1. Navigate to **Data Marketplace** > **Providers**
2. Click **Create Provider**
3. Configure:

```yaml
Provider Configuration:
  Name: Enterprise Analytics Team
  Description: Central analytics data provider
  Contact Email: analytics@company.com
  Website: https://wiki.company.com/analytics

  Visibility: Internal
  Logo: Upload company/team logo

  Terms:
    Default Terms of Use: Link to wiki
    Support Contact: analytics-support@company.com
```

### Managing Products

```bash
# CLI: List provider's products
datasphere marketplace products list --provider <provider-id>

# CLI: Update product
datasphere marketplace products update \
  --id <product-id> \
  --status published

# CLI: Batch update contact info
datasphere marketplace providers update \
  --id <provider-id> \
  --contact-email new-email@company.com
```

## Consuming Data Products

### Discovering Products

1. Navigate to **Data Marketplace**
2. Use search and filters:
   - By category (Finance, Sales, HR, etc.)
   - By provider
   - By rating
   - By data freshness
3. View product details and previews

### Requesting Access

1. Select data product
2. Click **Request Access**
3. Provide justification:

```yaml
Access Request:
  Requestor: analyst@company.com
  Data Product: Sales Analytics Package
  Justification: >
    Need sales data for Q4 planning analysis.
    Will use in SAC story for leadership review.
  Duration: Permanent | 6 months | 3 months | 1 month
  Space: ANALYTICS_TEAM
```

### Approval Workflow

```
Request → Owner Review → Approve/Reject → Access Granted
```

Approvers can:
- View requestor details
- Check justification
- Set access duration
- Add conditions

### Accessing Approved Products

Once approved:

1. **Direct Query**: Products appear in your space as shared views
2. **Import to SAC**: Available in SAC model creation
3. **Use in Views**: Reference in your own views

## Data Sharing Destinations

Share data products across tenants:

### Configure Sharing Destination

1. Go to **System** > **Administration** > **Data Sharing**
2. Click **Create Destination**
3. Configure:

```yaml
Sharing Destination:
  Name: Partner Analytics
  Target Tenant: partner-tenant.eu10.hcs.cloud.sap
  Authentication: OAuth 2.0
  Objects Shared:
    - Sales Summary (aggregated, no PII)
    - Product Catalog
```

### Share Products

1. Edit data product
2. Add sharing destination
3. Configure permissions:
   - Read-only access
   - Specific objects only
   - Data filters applied

## Pricing and Monetization

For commercial data sharing:

### Pricing Models

| Model | Description | Use Case |
|-------|-------------|----------|
| **Free** | No charge | Internal, promotional |
| **One-time** | Single purchase | Static datasets |
| **Subscription** | Monthly/Annual fee | Live data feeds |
| **Usage-based** | Per query/row | High-volume consumers |

### Configuring Pricing

```yaml
Product Pricing:
  Model: Subscription
  Plans:
    Basic:
      Price: $500/month
      Includes: Summary views only
      Limit: 10,000 queries/month

    Professional:
      Price: $2,000/month
      Includes: All views and models
      Limit: 100,000 queries/month

    Enterprise:
      Price: Custom
      Includes: Full access + API
      Limit: Unlimited
```

## Governance and Compliance

### Data Product Standards

Establish standards for publication:

```yaml
Publication Requirements:
  Documentation:
    - Description ≥ 100 characters
    - Sample queries included
    - Refresh schedule documented

  Quality:
    - Quality score ≥ 85%
    - No critical quality issues

  Governance:
    - Owner assigned
    - Classification set
    - Terms of use defined

  Technical:
    - All objects deployed
    - Associations configured
    - Tested with sample queries
```

### Audit Trail

Track all marketplace activities:

| Event | Information Logged |
|-------|-------------------|
| Product Created | Creator, timestamp, contents |
| Product Published | Publisher, version |
| Access Requested | Requestor, justification |
| Access Granted | Approver, conditions |
| Data Accessed | User, query, timestamp |

## Best Practices

### For Providers

1. **Clear Naming**: Use business-friendly product names
2. **Complete Documentation**: Assume consumers have no context
3. **Quality First**: Don't publish low-quality data
4. **Active Support**: Respond to consumer questions
5. **Version Control**: Document changes between versions

### For Consumers

1. **Check Quality**: Review quality scores before use
2. **Understand Lineage**: Know where data comes from
3. **Respect Terms**: Follow usage restrictions
4. **Provide Feedback**: Rate and review products
5. **Report Issues**: Flag data quality problems

### Marketplace Governance

1. **Review Process**: Require approval before publication
2. **Quality Gates**: Automate quality checks
3. **Regular Audits**: Review access and usage
4. **Sunset Policy**: Deprecate unused products
5. **Feedback Integration**: Act on consumer feedback
