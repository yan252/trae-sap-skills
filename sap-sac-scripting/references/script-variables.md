# Script Variables (2025.23)

Source: `help-portal-82bbae6b7005482c87bfd59a91735b45.md`.

## Types & scope
- Global variables defined in Outline → Global Variables (String, Integer, Number, Boolean; arrays allowed).
- Runtime scope across application; accessible from any script.
- URL parameter support: prefix variable with `p_` to read from query string.

## Usage
- Read/write directly: `MyGlobalVar = "value";`
- Use as dynamic text sources (see `text-widget.md`).
- Use in filters, bindings, and calculations.

## URL parameter pattern
- `...?p_MyVar=North` sets global variable `MyVar` at startup.

## Notes
- Keep naming consistent; document variable intent in Outline description.

