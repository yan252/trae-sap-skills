# Data Action Design Checklist

- [ ] Target model + version selected (public vs private) and edit mode/planning area confirmed.
- [ ] Step order defined (copy/cross-copy → allocations → conversions → advanced formulas → embedded actions).
- [ ] Parameters set (member/number/measure) with defaults; prompts labeled clearly.
- [ ] Copy/aggregation rules map to leaf members; non-leaf booking avoided.
- [ ] Write mode chosen per step (append vs overwrite) and currency/unit conversions configured.
- [ ] Validation run on small slice (time/account filters) before full run.
- [ ] Background run settings decided; notifications/monitor path shared with planners.
- [ ] Error handling notes captured (locks, mapping gaps) in job monitor playbook.
