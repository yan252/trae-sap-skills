# Analytics Designer Restrictions (2025.23)

Source: `help-portal-5128c44bafd04e19a4e1ee352ee1f14e.md` (Known Restrictions in Analytics Designer).

## Popup limitations
- Popups larger than main canvas render poorly; add ≥2 widgets for proper display.
- Height/width settings fail with a single widget.
- Filter line widgets in popups lose source reference after reload; click each popup to reactivate.
- `setTheme()` does not affect popups directly; place widgets in a panel and set theme there.
- New theme settings require previewing each popup during design.
- `enter`/`backspace` keys fail on multiple tables with Optimized Presentation; avoid that option.
- Planning mass entry, distribute values, value locks, version history unsupported in popups—place table on canvas/panel and toggle visibility.

## Model API limits
- `PlanningModel.createMembers()` works only for generic dimensions (not Date).
- Version management APIs unsupported for BPC writeback-enabled versions; use UI publish/version tools instead.

## DataSource function limits
- `setVariableValue`: no runtime/design-time validation; unsupported combos can error.
- `setDimensionFilter`: ranges on fiscal hierarchies unsupported; users may still change filters in tables even if selection mode locked; runtime filter selection follows design-time selection mode.

## Smart Discovery
- Cannot run after SmartDiscoveryAPIs without specifying Entity (pre-2021.1 versions).

## Styling limits
- Explorer quick menus not controlled via styling panel (Filter/Exclude, Drill, Smart Insight remain).
- Tables: “Restore to Theme Preference” fails after styling changes; default theme not reapplied.

## Export limits
- Cannot save a theme as new after deletion.
- Navigation panel: changing sort order unsupported for SAC models on SAP HANA.
- PDF export: garbled text possible for CJK/Russian/Arabic; CSS partially applied; custom widgets may be incomplete; only visible widgets in containers export (no scrolled content).
- Number format APIs do not affect tooltip measures (only axis measures).

## Chart API limits
- `addMeasure`/`removeMeasure` feeds supported only: `Feed.ValueAxis`, `Feed.ValueAxis2`, `Feed.Color`, `Feed.bubbleWidth`.
- `onSelect` event unsupported for cluster bubble charts.

## Browser limits
- Safari: R visualizations with HTML blocked when 3rd-party cookies blocked; Request Desktop Website not supported for analytic apps on mobile Safari.

## Embedding
- Embedding analytic apps into stories/digital boardroom via web page widget not officially supported.

## Input control limits
- Only dimension member input controls; calculation input controls limited to restricted measures.
- Dynamic forecast: calculation input controls for version/cut-over date in forecast tables unsupported.
- Display: after `setSelectedMembers()` control may show member ID when collapsed/all members selected/hierarchy flat.

## Implementation notes
- Use provided workarounds where possible; verify restricted features in target browser/device.

