# Time Series Forecast APIs (2025.23)

Source: `help-portal-366bdc2291e347bfbedff1bbf9377fca.md` (Work with Time Series Forecast in Charts).

## Purpose
Enable predictive time series forecasts on time-series or line charts within analytic applications.

## Core API
```javascript
// Enable automatic forecast on a chart
Chart_1.getDataSource().setForecastEnabled(true);
```

## Options
- Configure number of forecast periods via API.

## Implementation notes
- Algorithm runs on historical data for selected measure.
- Works with time series and line charts.
- Use Analytics Designer API Reference for additional parameters.

