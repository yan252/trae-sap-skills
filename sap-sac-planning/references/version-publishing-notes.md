# Version Publishing Notes (SAC 2025.23)

- Publish/Publish As can be initiated from Version Management, data action publish settings, or multi action version steps (choose fail vs ignore warnings).
- Invalid or locked records are dropped during publish; valid records merge.
- Planning area: when a public version is in edit mode with a planning area (or recommended planning area), data/multi actions only affect that scope. Expand planning area or publish first for full coverage; background runs respect scope.
- Use Publish As to branch scenarios without overwriting baseline; rename clearly.
- Always refresh story/app after background publishes to view merged data.

Sources: 012-version-management-overview.md and related SAC Help pages (2025.23).
