# Planning API Snippets (Analytics Designer)

Use inside analytic applications for planning automation. Ensure widgets/models match IDs below.

## getPlanning() — table planning ops
```javascript
// Is planning enabled?
const enabled = Table_1.getPlanning().isEnabled();

// Versions
const publics = Table_1.getPlanning().getPublicVersions();
const priv = Table_1.getPlanning().getPrivateVersion();

// Write and submit
Table_1.getPlanning().setUserInput(selection, value); // selection: SelectionType object
Table_1.getPlanning().submitData();
```

## PlanningModel API — master data
```javascript
// Read members with properties
const members = PlanningModel_1.getMembers("CostCenter");

// Create / update / delete
PlanningModel_1.createMembers("CostCenter", [{ id: "CC100", description: "Marketing" }]);
PlanningModel_1.updateMembers("CostCenter", [{ id: "CC100", description: "Marketing Dept" }]);
PlanningModel_1.deleteMembers("CostCenter", ["CC100"]);
```

## DataSource API — filtering
```javascript
// Filter a dimension
Table_1.getDataSource().setDimensionFilter(
  "Version",
  "[Version].[parentId].&[public.Actual]"
);

// Members with booked values only
const booked = Table_1.getDataSource().getMembers(
  "Account",
  { accessMode: MemberAccessMode.BookedValues }
);

// Remove filter
Table_1.getDataSource().removeDimensionFilter("Version");
```

Notes: keep IDs consistent with widgets; submitData respects data locks/edit mode; filters impact prompts/parameters when using story filters as defaults.
