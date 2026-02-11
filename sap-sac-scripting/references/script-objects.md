# Script Objects (2025.23)

Source: `help-portal-c3993b39e8564fe3aad3dadae90f2e7e.md`.

## Purpose
Reusable functions decoupled from widget events; callable across the application.

## Create
1. Outline → Script Objects → (+)  
2. Define functions inside the object file.  
3. Call from events: `MyScriptObject.myFunction(args);`

## Best practices
- Group related helpers per domain (filters, formatting, navigation).
- Avoid UI-specific IDs inside script objects; pass them as parameters.
- Keep functions small; document expected inputs/outputs.

