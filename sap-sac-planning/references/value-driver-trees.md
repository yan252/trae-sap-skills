# Value Driver Trees for Planning

## Overview

Value Driver Trees (VDT) in SAP Analytics Cloud visualize how values flow through a planning model, showing hierarchical links between different metrics and enabling driver-based planning and scenario simulation.

**Key Concept**: Instead of looking at isolated KPIs, VDTs connect key business drivers to show how changes in one area affect the bottom line.

---

## When to Use Value Driver Trees

### Use Cases

| Scenario | Example |
|----------|---------|
| **Driver-Based Planning** | Model how product prices, headcount, or expenses impact revenue |
| **What-If Analysis** | Simulate different scenarios and see cascading effects |
| **Strategic Planning** | Visualize long-term value chain impacts |
| **Executive Presentations** | Touchscreen-friendly boardroom displays |
| **Forecast Comparison** | Compare values across time periods |

### Example Value Chain

```
Marketing Spend ────┐
                    ├──► Sales Volume ────┐
Market Conditions ──┘                     │
                                          ├──► Revenue ────┐
Product Price ────────────────────────────┘                │
                                                           │
                                                           ├──► Gross Profit
Raw Material Cost ──┐                                      │
                    ├──► COGS ─────────────────────────────┘
Labor Cost ─────────┘
```

---

## How Value Driver Trees Work

### Node Structure

Each node shows:
- One or more **accounts/measures**
- Values for each **time period**
- **Links** to parent and child nodes

### Node Configuration Options

| Setup | Description | Use Case |
|-------|-------------|----------|
| **1 Account + 1 Structure** | Single row of values | Simple, clean visualization |
| **1 Account + Multiple Structures** | Row per structure | Compare scenarios/currencies |
| **Multiple Accounts + 1 Structure** | Row per account | Related measures (sales + quantity) |

### Flow Direction

Value driver trees flow from **right to left**:
- Child nodes on the right (drivers)
- Parent nodes on the left (outcomes)
- Each node can have multiple parents and children

---

## Creating a Value Driver Tree

### Prerequisites

| Requirement | Details |
|-------------|---------|
| **Model Type** | Import data model (planning or analytic) |
| **Date Dimension** | Required for time-based comparison |
| **Planning License** | Required to publish changes (BI users can view/enter) |

### Step-by-Step Setup

#### 1. Add VDT Widget

**In Story**:
- Select **Value Driver Tree** from launch page, or
- **Add → Value Driver Tree** from toolbar

**In Analytic Application**:
- **Add → More Widgets → Value Driver Tree**

#### 2. Select Model

Choose a **planning model** or analytic model with date dimension.

#### 3. Add Nodes

Three methods to add nodes:

**Auto-Create**:
```
Right-click → Auto-create Value Driver Tree from Model
```
Automatically creates nodes based on model structure.

**Manual**:
```
Right-click → Add Node
```
Add individual nodes and configure manually.

**Duplicate**:
```
Right-click node → Duplicate Node
```
Copy existing node configuration.

#### 4. Configure Nodes

For each node, configure:

| Setting | Options |
|---------|---------|
| **Measure** | Select measure to display |
| **Account** | Select account (if applicable) |
| **Structure** | Add existing or create new structure |
| **Filter** | Filter by dimensions (region, product, etc.) |

#### 5. Set Date Range

Configure **Presentation Date Range**:
- Select date dimension
- Choose range and granularity
- Applies to all nodes

#### 6. Link Nodes

Create relationships between nodes:
- Hover over node
- Drag **left icon** to link to parent
- Drag **right icon** to link to child

Or use **Builder Panel → Relationships** to add/remove links.

#### 7. Style and Collapse

- Use **Styling Panel** for colors and borders
- Right-click → **Collapse Node** to hide descendants
- Set **Minimum Node Width** for longer titles

---

## Planning with VDTs

### Data Entry

Value driver trees support data entry:

1. Click on a value cell
2. Enter new value using keypad or keyboard
3. Press Enter to confirm
4. Values automatically update linked nodes (if calculated)

**Touchscreen Support**: VDTs work well with digital boardroom presentations.

### Spreading in VDTs

When entering at aggregate level:
- Values spread to child time periods
- Spreading follows model's spreading configuration

### Publishing Changes

| User Type | Can Enter Data | Can Publish |
|-----------|----------------|-------------|
| BI User | Yes | No |
| Planning User | Yes | Yes |

---

## Simulation and What-If Analysis

### Scenario Simulation

1. **Create structure** with actual and forecast values
2. **Enter forecast values** in nodes
3. **See cascading impacts** on parent nodes
4. **Compare scenarios** side-by-side

### Drill-Down Analysis

Drill into nodes by dimension:

1. Right-click node → **Drill into**
2. Select dimension (e.g., Region)
3. Choose members (e.g., North, South, East, West)
4. New child nodes created for each member

All descendant nodes are duplicated and filtered accordingly.

---

## JavaScript API for VDTs

### Get VDT Reference

```javascript
// Get value driver tree widget
var vdt = ValueDriverTree_1;
```

### Node Operations

```javascript
// Get selected node
var selectedNode = vdt.getSelectedNode();

// Get node value
var value = selectedNode.getValue("Revenue", "2025Q1");

// Set node value (if planning enabled)
selectedNode.setValue("Revenue", "2025Q1", 1500000);
```

### Refresh Data

```javascript
// Refresh VDT data
ValueDriverTree_1.getDataSource().refreshData();
```

### Collapse/Expand

```javascript
// Collapse node (hide descendants)
ValueDriverTree_1.collapseNode("Node_Revenue");

// Expand node (show descendants)
ValueDriverTree_1.expandNode("Node_Revenue");
```

---

## Advanced Configuration

### Calculated Accounts

Create calculated accounts for VDT nodes:

1. Select node
2. **Add Account** → Create calculation
3. Define formula

Example calculations:
```
Gross Margin = Revenue - COGS
Net Profit = Gross Margin - Operating Expenses
Growth Rate = (Current - Previous) / Previous * 100
```

### Structures for Comparison

Create structures to compare:
- **Versions** (Actual, Budget, Forecast)
- **Scenarios** (Base, Optimistic, Pessimistic)
- **Currencies** (USD, EUR, local)
- **Variances** (Actual vs Budget)

### Restricted Measures

Use restricted measures for specific filters:
```
North America Revenue = Revenue WHERE Region = "NA"
Q1 Sales = Sales WHERE Quarter = "Q1"
```

---

## Styling Options

### Node Styling

| Option | Description |
|--------|-------------|
| **Colors** | Background, text, border colors |
| **Borders** | Style, width, corner radius |
| **Font** | Size, weight, family |
| **Minimum Width** | Ensure titles visible |

### CSS Customization

Apply custom CSS classes:
```css
.vdt-node-positive {
    background-color: #e8f5e9;
    border-color: #4caf50;
}

.vdt-node-negative {
    background-color: #ffebee;
    border-color: #f44336;
}
```

### Conditional Formatting

Apply colors based on values:
- Green for positive variance
- Red for negative variance
- Yellow for attention items

---

## Best Practices

### Design Guidelines

1. **Limit depth** - 3-4 levels maximum for readability
2. **Clear naming** - Use descriptive node titles
3. **Logical flow** - Drivers right, outcomes left
4. **Consistent structures** - Use same structures across nodes
5. **Filter strategically** - Don't over-filter individual nodes

### Performance Tips

1. **Limit nodes** - Large VDTs can be slow
2. **Use collapse** - Hide detail nodes when not needed
3. **Filter at VDT level** - Instead of per-node filters
4. **Simplify calculations** - Complex formulas impact performance

### User Experience

1. **Provide context** - Add titles and descriptions
2. **Use color coding** - Visual indicators for status
3. **Enable tooltips** - Help users understand values
4. **Test on target devices** - Especially for touchscreens

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| No data in nodes | Filters too restrictive | Check and adjust filters |
| Links not working | Circular reference | Remove cycle in relationships |
| Values not updating | Cache issue | Refresh data source |
| Performance slow | Too many nodes | Collapse or reduce nodes |
| Entry disabled | BI user or locked | Check permissions/locks |

### Debugging Tips

1. **Check filters** - Verify dimension filters match data
2. **Review structures** - Ensure measures are correct
3. **Test calculations** - Validate formulas independently
4. **Check model** - Confirm model has required data

---

## Official Documentation Links

- **Set Up VDTs**: https://help.sap.com/docs/SAP_ANALYTICS_CLOUD/00f68c2e08b941f081002fd3691d86a7/f6189755175940f3a4e007c3d6b83ee5.html
- **Plan with VDTs**: https://help.sap.com/docs/SAP_ANALYTICS_CLOUD/00f68c2e08b941f081002fd3691d86a7/32c739d6f05b4990a08ef3948b18a1aa.html
- **Video Tutorial**: https://www.youtube.com/embed/0-LW3-Fc-eE
- **Custom Calculations**: https://help.sap.com/docs/SAP_ANALYTICS_CLOUD/00f68c2e08b941f081002fd3691d86a7/5089d7effccf45878ad0ed5a038d5ecc.html

---

**Version**: 1.0.0
**Last Updated**: 2025-12-27
**SAC Version**: 2025.25
