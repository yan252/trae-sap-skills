# Predictive & Conversion Aids (SAC 2025.23)

## Predictive forecasts in tables (007)
- Run time-series forecasts directly on table cells; choose measure/time scope; results written to target version.
- Good for quick, localized forecasts without full predictive step.

## Currency & unit conversion (008)
- Plan with measures that carry currency/unit; conversion step in data actions can copy between measures with conversion settings.
- Key settings: Rate type (average/closing), Date, Category; choose overwrite vs append for target measure.

## When to prefer multi action predictive step
- Need reusable scenario, background run, or integration with version publish; use multi action Predictive Step instead of table quick forecast.

Sources: 007-predictive-forecasts-tables.md, 008-currency-unit-conversion.md (SAC Help 2025.23).
