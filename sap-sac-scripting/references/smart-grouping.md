# Smart Grouping for Charts (2025.23)

Source: `help-portal-fa8a42c6f906486897653e2f5e3708e3.md` (Apply Smart Grouping to Charts).

## Scope
- Bubble and scatterplot charts for correlation analysis.

## Prerequisite
- Enable smart grouping in the chart’s Builder panel before scripting.

## APIs
- Set number of groups (example):
```javascript
Chart_1.setSmartGroupingNumberOfGroups(5);
```
- Additional controls: enable/disable smart grouping, allow user-defined group labels, include/exclude tooltip measures.

## Implementation notes
- Designed for automated grouping of similar data points.
- Use Analytics Designer API Reference for full parameter list.

