# Scheduling & Calendar Tasks (SAC 2025.23)

Purpose: schedule structured planning operations (data actions, multi actions, data locks) and coordinate human tasks via the SAC calendar.

## When to schedule
- Need unattended runs in off-hours or after data loads.
- Need predictable cadence with approvals or dependencies.
- Want to chain automated steps with review/input tasks.

## Task types to use
- **Automatic Data Action Task**: schedule a data action with parameter prompts; runs in background; respects planning area if public version in edit mode (031-schedule-data-actions-calendar.md).
- **Automatic Multi Action Task**: schedule multi action; good for cross-model orchestration; can reuse parameters.
- **Data Locking Task**: set lock states on a schedule (e.g., close months).
- **Input/Review/Composite Tasks**: human workflow; assign owners/reviewers; attach files and due dates.

## Setup checklist
- Confirm starter access + Execute permission on underlying action(s); write access to member scope per data access control.
- For public versions, ensure edit mode / recommended planning area defined before scheduling.
- Define recurrence and end date; align time zone with planners.
- Attach predecessors/successors to enforce order; use notifications for assignees.

## Background run behavior
- Users can continue working, but the same version is locked for changes until run completes; refresh to see results.
- Status + messages appear in Notifications and Job Monitor.

## Approvals & handoffs
- Use review tasks for sign-off; composite tasks to bundle multiple steps; dependencies ensure gating before publish.

Related: `references/job-monitoring.md` for tracking; `references/multi-actions.md` for step design.
