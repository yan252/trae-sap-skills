/**
 * SAP Analytics Cloud - Planning Operations Patterns
 *
 * Ready-to-use code patterns for SAC Planning applications.
 * Copy and adapt these patterns to your application.
 *
 * Source: SAP Analytics Cloud Scripting Skill
 * Version: 2025.14+
 */

// =============================================================================
// VERSION MANAGEMENT PATTERNS
// =============================================================================

/**
 * Pattern 1: Get and display version info
 * Use in: Application initialization or info button
 */
function displayVersionInfo() {
    var planning = Table_1.getPlanning();

    var publicVersions = planning.getPublicVersions();
    var privateVersions = planning.getPrivateVersions();

    console.log("Public Versions:", publicVersions.length);
    console.log("Private Versions:", privateVersions.length);

    publicVersions.forEach(function(v) {
        console.log("Public: " + v.id);
    });
}

/**
 * Pattern 2: Publish version with validation
 * Use in: Publish button onClick
 */
function publishVersion(versionId) {
    Application.showBusyIndicator();

    try {
        var version = Table_1.getPlanning().getPublicVersion(versionId);

        if (!version) {
            Application.showMessage(
                ApplicationMessageType.Error,
                "Version '" + versionId + "' not found"
            );
            return false;
        }

        if (!version.isDirty()) {
            Application.showMessage(
                ApplicationMessageType.Info,
                "No changes to publish"
            );
            return false;
        }

        version.publish();

        Application.showMessage(
            ApplicationMessageType.Success,
            "Version published successfully"
        );

        // Refresh data
        Table_1.getDataSource().refreshData();

        return true;

    } catch (error) {
        console.log("Publish error:", error);
        Application.showMessage(
            ApplicationMessageType.Error,
            "Failed to publish: " + error
        );
        return false;

    } finally {
        Application.hideBusyIndicator();
    }
}

/**
 * Pattern 3: Copy public version to new private version
 * Use in: Create working copy button
 */
function createWorkingCopy(sourceVersionId) {
    Application.showBusyIndicator();

    try {
        var sourceVersion = Table_1.getPlanning().getPublicVersion(sourceVersionId);

        if (!sourceVersion) {
            Application.showMessage(
                ApplicationMessageType.Error,
                "Source version not found"
            );
            return null;
        }

        var timestamp = Date.now().toString();
        var newVersionId = "WorkingCopy_" + timestamp;

        sourceVersion.copy(newVersionId, PlanningCopyOption.AllData);

        Application.showMessage(
            ApplicationMessageType.Success,
            "Working copy created: " + newVersionId
        );

        return newVersionId;

    } catch (error) {
        console.log("Copy error:", error);
        Application.showMessage(
            ApplicationMessageType.Error,
            "Failed to create copy"
        );
        return null;

    } finally {
        Application.hideBusyIndicator();
    }
}

/**
 * Pattern 4: Copy with specific category (Budget/Forecast)
 * Use in: Category-specific copy operations
 */
function copyAsCategory(sourceVersionId, targetVersionId, category) {
    Application.showBusyIndicator();

    try {
        var sourceVersion = Table_1.getPlanning().getPrivateVersion(sourceVersionId);

        if (!sourceVersion) {
            sourceVersion = Table_1.getPlanning().getPublicVersion(sourceVersionId);
        }

        if (!sourceVersion) {
            Application.showMessage(
                ApplicationMessageType.Error,
                "Source version not found"
            );
            return false;
        }

        // Copy with category
        sourceVersion.copy(
            targetVersionId,
            PlanningCopyOption.AllData,
            category  // PlanningCategory.Budget or PlanningCategory.Forecast
        );

        Application.showMessage(
            ApplicationMessageType.Success,
            "Version copied successfully"
        );

        return true;

    } catch (error) {
        console.log("Copy error:", error);
        Application.showMessage(
            ApplicationMessageType.Error,
            "Failed to copy version"
        );
        return false;

    } finally {
        Application.hideBusyIndicator();
    }
}

/**
 * Pattern 5: Revert unsaved changes
 * Use in: Discard changes button
 */
function revertChanges(versionId) {
    var version = Table_1.getPlanning().getPublicVersion(versionId);

    if (!version) {
        Application.showMessage(
            ApplicationMessageType.Error,
            "Version not found"
        );
        return;
    }

    if (!version.isDirty()) {
        Application.showMessage(
            ApplicationMessageType.Info,
            "No changes to revert"
        );
        return;
    }

    version.revert();
    Table_1.getDataSource().refreshData();

    Application.showMessage(
        ApplicationMessageType.Info,
        "Changes reverted"
    );
}

/**
 * Pattern 6: Delete private version
 * Use in: Delete version button (with confirmation)
 */
function deletePrivateVersion(versionId) {
    var version = Table_1.getPlanning().getPrivateVersion(versionId);

    if (!version) {
        Application.showMessage(
            ApplicationMessageType.Error,
            "Private version not found"
        );
        return false;
    }

    try {
        version.delete();
        Application.showMessage(
            ApplicationMessageType.Success,
            "Version deleted"
        );
        return true;
    } catch (error) {
        Application.showMessage(
            ApplicationMessageType.Error,
            "Failed to delete version"
        );
        return false;
    }
}


// =============================================================================
// DATA LOCKING PATTERNS
// =============================================================================

/**
 * Pattern 7: Check lock state before edit
 * Use before: Any data modification
 */
function checkLockState() {
    var selections = Table_1.getSelections();

    if (selections.length === 0) {
        Application.showMessage(
            ApplicationMessageType.Warning,
            "Please select a cell first"
        );
        return null;
    }

    var lockState = Table_1.getPlanning()
        .getDataLocking()
        .getState(selections[0]);

    return lockState;
}

/**
 * Pattern 8: Lock state validation with message
 * Use in: Edit button onClick
 */
function validateAndEdit() {
    var lockState = checkLockState();

    if (lockState === null) {
        return;
    }

    switch (lockState) {
        case DataLockingState.Locked:
            Application.showMessage(
                ApplicationMessageType.Warning,
                "Data is locked by another user. Cannot edit."
            );
            break;

        case DataLockingState.LockedByMe:
            Application.showMessage(
                ApplicationMessageType.Info,
                "Data is locked by you. Proceeding with edit."
            );
            performEdit();
            break;

        case DataLockingState.Unlocked:
            performEdit();
            break;
    }
}

function performEdit() {
    // Implement edit logic
    console.log("Performing edit...");
}


// =============================================================================
// DATA ACTION PATTERNS
// =============================================================================

/**
 * Pattern 9: Execute data action with parameters
 * Use in: Run data action button
 */
function runDataAction(year, version) {
    Application.showBusyIndicator();

    // Set parameters
    DataAction_Allocation.setParameterValue("YEAR", year);
    DataAction_Allocation.setParameterValue("VERSION", version);

    // Execute
    DataAction_Allocation.execute();
}

// Data action event handlers
DataAction_Allocation.onBeforeExecute = function() {
    console.log("Data action starting...");
};

DataAction_Allocation.onAfterExecute = function(result) {
    Application.hideBusyIndicator();

    if (result.success) {
        Table_1.getDataSource().refreshData();
        Application.showMessage(
            ApplicationMessageType.Success,
            "Data action completed successfully"
        );
    } else {
        Application.showMessage(
            ApplicationMessageType.Error,
            "Data action failed: " + (result.message || "Unknown error")
        );
    }
};

/**
 * Pattern 10: Data action with dropdown parameters
 * Use in: Dynamic data action execution
 */
function runDataActionFromDropdowns() {
    var sourceVersion = Dropdown_SourceVersion.getSelectedKey();
    var targetVersion = Dropdown_TargetVersion.getSelectedKey();
    var year = Dropdown_Year.getSelectedKey();

    if (!sourceVersion || !targetVersion || !year) {
        Application.showMessage(
            ApplicationMessageType.Warning,
            "Please select all parameters"
        );
        return;
    }

    Application.showBusyIndicator();

    DataAction_Copy.setParameterValue("SOURCE_VERSION", sourceVersion);
    DataAction_Copy.setParameterValue("TARGET_VERSION", targetVersion);
    DataAction_Copy.setParameterValue("YEAR", year);

    DataAction_Copy.execute();
}

/**
 * Pattern 11: Background data action execution
 * Use for: Long-running data actions
 */
function runDataActionInBackground() {
    Application.showMessage(
        ApplicationMessageType.Info,
        "Data action started in background"
    );

    DataAction_LongRunning.executeInBackground();
}

DataAction_LongRunning.onExecutionStatusUpdate = function(status) {
    console.log("Background status:", status);

    switch (status) {
        case ExecutionStatus.Running:
            console.log("Still running...");
            break;

        case ExecutionStatus.Completed:
            Table_1.getDataSource().refreshData();
            Application.showMessage(
                ApplicationMessageType.Success,
                "Background task completed"
            );
            break;

        case ExecutionStatus.Failed:
            Application.showMessage(
                ApplicationMessageType.Error,
                "Background task failed"
            );
            break;

        case ExecutionStatus.Cancelled:
            Application.showMessage(
                ApplicationMessageType.Info,
                "Background task cancelled"
            );
            break;
    }
};


// =============================================================================
// PLANNING WORKFLOW PATTERNS
// =============================================================================

/**
 * Pattern 12: Complete planning workflow
 * Create copy → Edit → Publish
 */
var WorkflowState = {
    workingVersion: null
};

// Step 1: Create working copy
function startPlanningWorkflow(sourceVersionId) {
    var newVersionId = createWorkingCopy(sourceVersionId);
    if (newVersionId) {
        WorkflowState.workingVersion = newVersionId;
        Table_1.getDataSource().setDimensionFilter("Version", newVersionId);
        Application.showMessage(
            ApplicationMessageType.Info,
            "Editing version: " + newVersionId
        );
    }
}

// Step 2: Save progress
function savePlanningProgress() {
    if (!WorkflowState.workingVersion) {
        Application.showMessage(
            ApplicationMessageType.Warning,
            "No active working version"
        );
        return;
    }

    Table_1.getPlanning().submitData();
    Application.showMessage(
        ApplicationMessageType.Success,
        "Changes saved"
    );
}

// Step 3: Complete workflow
function completePlanningWorkflow() {
    if (!WorkflowState.workingVersion) {
        Application.showMessage(
            ApplicationMessageType.Warning,
            "No active working version"
        );
        return;
    }

    var version = Table_1.getPlanning().getPrivateVersion(WorkflowState.workingVersion);
    if (version && version.isDirty()) {
        version.publish();
    }

    WorkflowState.workingVersion = null;
    Application.showMessage(
        ApplicationMessageType.Success,
        "Planning workflow completed"
    );
}

/**
 * Pattern 13: Find active planning cycle from attribute
 * Use in: Auto-filter to current planning cycle
 */
function findActivePlanningCycle() {
    var allCycles = PlanningModel_1.getMembers("PlanningCycle");

    for (var i = 0; i < allCycles.length; i++) {
        // Check for active flag attribute
        if (allCycles[i].properties.IsActive === "X" ||
            allCycles[i].properties.Flag === "PC+0") {
            return allCycles[i].id;
        }
    }

    return null;
}

/**
 * Pattern 14: Set year filter based on planning cycle
 * Use in: Dynamic year filtering
 */
function setYearFromPlanningCycle() {
    var activeCycle = findActivePlanningCycle();

    if (activeCycle) {
        // Format the filter value
        var yearFilter = "[Date].[YQM].&[" + activeCycle + "]";

        Table_1.getDataSource().setDimensionFilter("Date", yearFilter);

        console.log("Active planning cycle set:", activeCycle);
    }
}


// =============================================================================
// INPUT FORM PATTERNS
// =============================================================================

/**
 * Pattern 15: Submit data after input
 * Use in: Save button for input forms
 */
function submitInputData() {
    Application.showBusyIndicator();

    try {
        // Submit pending changes
        Table_1.getPlanning().submitData();

        // Get current version and publish
        var version = Table_1.getPlanning().getPublicVersion("Budget2024");
        if (version && version.isDirty()) {
            version.publish();
        }

        Application.showMessage(
            ApplicationMessageType.Success,
            "Data submitted successfully"
        );

    } catch (error) {
        console.log("Submit error:", error);
        Application.showMessage(
            ApplicationMessageType.Error,
            "Failed to submit data"
        );
    } finally {
        Application.hideBusyIndicator();
    }
}

/**
 * Pattern 16: Validate before submit
 * Use in: Pre-submission validation
 */
function validateAndSubmit() {
    // Check for required selections
    if (!Dropdown_CostCenter.getSelectedKey()) {
        Application.showMessage(
            ApplicationMessageType.Warning,
            "Please select a cost center"
        );
        return;
    }

    // Check lock state
    var selections = Table_1.getSelections();
    if (selections.length > 0) {
        var lockState = Table_1.getPlanning()
            .getDataLocking()
            .getState(selections[0]);

        if (lockState === DataLockingState.Locked) {
            Application.showMessage(
                ApplicationMessageType.Error,
                "Data is locked. Cannot submit."
            );
            return;
        }
    }

    // Proceed with submit
    submitInputData();
}
