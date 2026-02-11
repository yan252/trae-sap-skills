# Multi Action Design Checklist

- [ ] Confirm use-case needs sequencing across models/versions; partial success acceptable.
- [ ] Steps chosen: data action / version publish / predictive / data import / API / PaPM / data locking.
- [ ] Parameters defined (including cross-model) and mapped to each step; defaults provided.
- [ ] Publishing behavior set (fail vs ignore warnings) per step; planning area option reviewed.
- [ ] Background execution allowed; users notified of version lock window and refresh need.
- [ ] Slicing strategy for long runs (filters, smaller steps) to avoid timeouts.
- [ ] Scheduled? Add calendar task with recurrence/time zone + dependencies.
- [ ] Job monitor path documented for operators; fallback manual steps noted.
