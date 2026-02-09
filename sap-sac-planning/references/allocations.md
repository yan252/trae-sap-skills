# Allocations & Spreading (SAC 2025.23)

Purpose: split source values across target dimension members using drivers or direct assignment within data actions.

## When to use
- Allocate overheads or top-down plan values to cost centers/products/regions.
- Control booking to leaf members while preserving totals.

## Setup (data action allocation step)
- **Source context**: filters + write mode (append/overwrite).
- **Driver context**: reference dimensions supplying driver values.
- **Target context**: booking account + write mode.
- **Allocation rules**: pick Source, Driver, Target dimensions and hierarchies; add rules row-by-row.

## Methods
- Proportional (driver-based), Equal, Fixed Percentage, or Direct assignment via rules.
- Supports booking only to leaf targets; ensure hierarchies selected.

## Good practices
- Keep drivers at same grain as target; avoid non-leaf booking errors.
- Use parameters for source period/version and target slice to reuse step.
- Test with small scope before full run; monitor job messages for unmapped members.

Sources: 015-allocation-overview.md, 019-allocation-steps.md (SAC Help 2025.23).
