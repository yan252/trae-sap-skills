# What's New in SAC Scripting (2025.23)

Complete overview of new scripting features and updates in SAP Analytics Cloud 2025.23.

**Release Date**: November 3, 2025
**SAC Version**: 2025.23

---

## Major New Features

### Time Series Forecast API
- **File**: `references/time-series-forecast.md`
- **Purpose**: Enable time-series forecasting on line and time-series charts
- **Key Methods**:
  - `Chart.getTimeSeriesForecastEnabled()`
  - `Chart.setTimeSeriesForecastEnabled(boolean)`
  - `Chart.getTimeSeriesForecastOptions()`
  - `Chart.setTimeSeriesForecastOptions(options)`

### Search to Insight Technical Object
- **File**: `references/search-to-insight.md`
- **Purpose**: Integrate natural language search with visual analytics
- **Key Features**:
  - Dialog-based search interface
  - Apply search results to charts
  - Technical object for programmatic control

### Comments APIs
- **File**: `references/comments.md`
- **Purpose**: Add, view, and manage comments on widgets and table cells
- **Key Features**:
  - Widget-level comments
  - Table cell comments
  - Threaded comment support
  - Comment synchronization

### Smart Grouping
- **File**: `references/smart-grouping.md`
- **Purpose**: Automatic grouping of data points in bubble and scatter charts
- **Key Features**:
  - ML-driven grouping algorithms
  - Configurable grouping parameters
  - Visual group indicators

### Explorer & Smart Insights
- **File**: `references/explorer-smart-insights.md`
- **Purpose**: Advanced data exploration and AI-powered insights
- **Key Features**:
  - Launch Explorer programmatically
  - Apply Smart Insights to visualizations
  - Context-aware analysis

### Geo Map Enhancements
- **File**: `references/geomap.md`
- **Purpose**: Enhanced geographical visualization capabilities
- **Key Features**:
  - Quick menu implementation
  - Scripted layer control
  - Improved interaction patterns

### Composite Scripting
- **Files**: 
  - `references/composites-scripting.md`
  - `references/composites-restrictions.md`
- **Purpose**: Scripting within composite widgets
- **Key Features**:
  - Event handling in composites
  - Cross-widget communication
  - Known limitations and workarounds

### Data Blending Updates
- **File**: `references/blending-limitations.md`
- **Purpose**: Updated support for blended data models
- **Key Updates**:
  - Expanded API coverage
  - New blending scenarios supported
  - Performance improvements

### Analytics Designer Enhancements
- **File**: `references/analytics-designer-restrictions.md`
- **Purpose**: Updated list of known restrictions
- **Key Updates**:
  - Reduced restrictions in 2025.23
  - New capabilities added
  - Migration guidance

---

## Documentation Updates

### Help Portal Updates
- **File**: `references/auth-required.md`
- **Note**: Some Help Portal articles now require SAP login
- **Impact**: Direct links may prompt for authentication

### API Reference
- Documentation version updated to reflect new methods
- Enhanced examples for all new features
- Performance optimization guidance

---

## Migration Considerations

### For Developers
1. Review existing code for deprecated patterns
2. Test new features in development environment
3. Update error handling for new APIs
4. Consider performance implications of new features

### For Administrators
1. Plan upgrade to SAC 2025.23
2. Update user training materials
3. Review security implications of new features
4. Test compatibility with existing models

---

## Related Resources

- [SAP Analytics Cloud Release Notes](https://help.sap.com/docs/SAP_ANALYTICS_CLOUD)
- [Analytics Designer API Reference](https://help.sap.com/doc/958d4c11261f42e992e8d01a4c0dde25/latest/en-US/index.html)
- [Optimized Story Experience API Reference](https://help.sap.com/doc/1639cb9ccaa54b2592224df577abe822/latest/en-US/index.html)

---

**Last Updated**: 2025-11-27
**SAC Version**: 2025.23
**Documentation Version**: 1.0.0
