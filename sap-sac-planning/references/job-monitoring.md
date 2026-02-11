# Job Monitoring & Troubleshooting (SAC 2025.23)

Use the Job Monitor to track data actions and multi actions started from stories, analytic apps, or calendar tasks.

## What to check
- **Status**: success / failed / success with warnings; background runs show completion here.
- **Step lineage**: which data action or multi action ran, with timestamps.
- **Error messages**: parameter validation, data locks, booking on non-leaf members, mapping gaps in cross-model copy.

## Quick triage
- Parameter errors → fix prompt values or mapping; rerun.
- Data locked / publish failed → unlock or adjust planning area, rerun publish step.
- Non-leaf bookings → adjust source hierarchy or mapping to leaf members.
- Timeouts on steps → break into smaller slices (time/account filters) or run in background.

## Good practices
- Keep runs small: filter versions/time, append vs overwrite intentionally.
- Name runs clearly; include version/model in starter labels.
- After background completion, refresh story/app before further edits.

Related: `references/data-actions.md` for design patterns, `references/multi-actions.md` for step-level behaviors.
