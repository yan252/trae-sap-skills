# Search to Insight Technical Object (2025.23)

Source: `help-portal-8a5c547a501640c38ad549109d4314b1.md` (Work with Search to Insight in Analytic Applications).

## Data support
- Indexed live HANA models and acquired models (with access).
- Dimensions without/with data access control (respects user access).

## Modes
- **Simple mode**: natural-language questions for users with limited model knowledge.
- **Advanced mode**: switch models and select dimensions during queries.

## Create technical object
1. In **Scripting** section of Outline, select the icon next to Search to Insight.
2. Side panel opens with default name `SearchToInsight_1`.
3. Under **Models to Search**, add one or more models.
4. Click **Done** to save.

## Key APIs / workflows
- Open/close the Search to Insight dialog.
- `applySearchToChart()` to apply a question result to a chart.
- Variable management APIs: save variable values; reuse when calling `applySearchToChart()`.

## Use cases
- Start different modes (simple/advanced).
- Receive questions from host HTML page and apply to charts.
- Persist and reapply variables together with search results.

## Implementation notes
- Create the technical object before users can query.
- Multiple models can be added to the search scope.

