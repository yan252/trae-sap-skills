# Data Actions Technical Object (2025.23)

**Source**: [Analytics Designer API Reference - Data Action](https://help.sap.com/docs/SAP_ANALYTICS_CLOUD/00f68c2e08b941f081002fd3691d86a5/7c52c448e17c4746b6e767b8370f744e.html)

---

## Table of Contents

1. [Getting Data Action Reference](#getting-data-action-reference)
2. [Execution Methods](#execution-methods)
3. [Parameter Management](#parameter-management)
4. [Event Handlers](#event-handlers)
5. [Execution Status Monitoring](#execution-status-monitoring)
6. [Error Handling](#error-handling)
7. [Best Practices](#best-practices)

---

## Getting Data Action Reference

Data Actions are widgets that can be accessed directly by their assigned ID in scripts.

```javascript
// Direct access to Data Action widget
DataAction_1.execute();
```

**Note**: Data Actions must be added to the story canvas before they can be scripted.

---

## Execution Methods

### execute()

Executes the data action synchronously.

```javascript
// Simple execution
DataAction_1.execute();

// With parameters (set parameters before execution)
DataAction_1.setParameterValue("YEAR", "2024");
DataAction_1.setParameterValue("VERSION", "Budget");
DataAction_1.execute();
```

### executeInBackground()

Executes the data action asynchronously without blocking the UI.

```javascript
// Execute in background for long-running actions
DataAction_1.executeInBackground();

// Monitor completion with event handler
DataAction_1.onExecutionStatusUpdate = function(status) {
    if (status === ExecutionStatus.Completed) {
        Table_1.getDataSource().refreshData();
        Application.showMessage(ApplicationMessageType.Info, "Data action completed");
    }
};
```

---

## Parameter Management

### setParameterValue(parameterName, value)

Sets a parameter value for the data action.

**Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| parameterName | string | Yes | Name of the parameter defined in the data action |
| value | string/number | Yes | Value to pass to the parameter |

```javascript
// Set single parameter
DataAction_1.setParameterValue("COST_CENTER", "1000");

// Set multiple parameters
var parameters = {
    "YEAR": "2024",
    "MONTH": "12",
    "SCENARIO": "Actual",
    "AMOUNT": 100000
};

Object.keys(parameters).forEach(function(param) {
    DataAction_1.setParameterValue(param, parameters[param]);
});

// Execute with all parameters set
DataAction_1.execute();
```

### getParameterValue(parameterName)

Gets the current value of a parameter.

```javascript
var yearValue = DataAction_1.getParameterValue("YEAR");
if (yearValue) {
    console.log("Current year parameter:", yearValue);
}
```

---

## Event Handlers

### onBeforeExecute

Triggered before the data action executes.

```javascript
DataAction_1.onBeforeExecute = function() {
    // Show loading indicator
    Application.showBusyIndicator("Processing data action...");
    
    // Validate parameters
    var year = DataAction_1.getParameterValue("YEAR");
    if (!year) {
        Application.showMessage(
            ApplicationMessageType.Error,
            "Year parameter is required"
        );
        return false; // Prevent execution
    }
    
    // Log execution start
    console.log("Executing data action at:", new Date());
};
```

### onAfterExecute

Triggered after the data action completes execution.

```javascript
DataAction_1.onAfterExecute = function(result) {
    // Hide loading indicator
    Application.hideBusyIndicator();
    
    // Check execution result
    if (result.success) {
        Application.showMessage(
            ApplicationMessageType.Info,
            "Data action completed successfully"
        );
        
        // Refresh affected data
        Table_1.getDataSource().refreshData();
        
        // Log success
        console.log("Data action executed successfully:", result);
    } else {
        // Handle errors
        Application.showMessage(
            ApplicationMessageType.Error,
            "Data action failed: " + (result.message || "Unknown error")
        );
        
        console.error("Data action failed:", result);
    }
};
```

### onExecutionStatusUpdate

Triggered during background execution when status changes.

```javascript
DataAction_1.onExecutionStatusUpdate = function(status) {
    switch(status) {
        case ExecutionStatus.Running:
            console.log("Data action is running...");
            break;
            
        case ExecutionStatus.Completed:
            console.log("Data action completed successfully");
            Table_1.getDataSource().refreshData();
            Application.showMessage(
                ApplicationMessageType.Info,
                "Data action completed"
            );
            break;
            
        case ExecutionStatus.Failed:
            console.error("Data action failed");
            Application.showMessage(
                ApplicationMessageType.Error,
                "Data action execution failed"
            );
            break;
            
        case ExecutionStatus.Cancelled:
            console.log("Data action was cancelled");
            Application.showMessage(
                ApplicationMessageType.Warning,
                "Data action cancelled by user"
            );
            break;
    }
};
```

---

## Execution Status Monitoring

Monitor the execution state for better user experience.

```javascript
// Function to check data action status
function checkDataActionStatus() {
    var isRunning = DataAction_1.isExecuting();
    
    if (isRunning) {
        console.log("Data action is currently executing");
        return true;
    } else {
        console.log("Data action is not executing");
        return false;
    }
}

// Execute with status monitoring
function executeWithMonitoring() {
    if (checkDataActionStatus()) {
        Application.showMessage(
            ApplicationMessageType.Warning,
            "Data action is already running"
        );
        return;
    }
    
    DataAction_1.execute();
}
```

---

## Error Handling

### Try-Catch Pattern

```javascript
function safeExecute() {
    try {
        // Validate inputs
        if (!validateInputs()) {
            return;
        }
        
        // Execute data action
        DataAction_1.execute();
        
    } catch (error) {
        console.error("Error executing data action:", error);
        Application.showMessage(
            ApplicationMessageType.Error,
            "An error occurred: " + error.message
        );
    }
}

function validateInputs() {
    // Check required parameters
    var requiredParams = ["YEAR", "VERSION"];
    var missingParams = [];
    
    requiredParams.forEach(function(param) {
        var value = DataAction_1.getParameterValue(param);
        if (!value) {
            missingParams.push(param);
        }
    });
    
    if (missingParams.length > 0) {
        Application.showMessage(
            ApplicationMessageType.Error,
            "Missing required parameters: " + missingParams.join(", ")
        );
        return false;
    }
    
    return true;
}
```

### Data Locking Integration

```javascript
// Check data locks before execution
function executeWithLockCheck() {
    var selection = Table_1.getSelections()[0];
    
    if (selection) {
        var dataLocking = Table_1.getPlanning().getDataLocking();
        var lockState = dataLocking.getState(selection);
        
        if (lockState === DataLockingState.Locked) {
            Application.showMessage(
                ApplicationMessageType.Warning,
                "Data is locked by another user. Cannot execute data action."
            );
            return;
        }
    }
    
    // Proceed with execution
    DataAction_1.execute();
}
```

---

## Best Practices

### 1. Parameter Validation

Always validate parameters before execution:

```javascript
function validateAllParameters() {
    var params = DataAction_1.getParameters();
    var isValid = true;
    
    params.forEach(function(param) {
        var value = DataAction_1.getParameterValue(param.name);
        
        if (param.isRequired && !value) {
            Application.showMessage(
                ApplicationMessageType.Error,
                "Required parameter '" + param.name + "' is missing"
            );
            isValid = false;
        }
    });
    
    return isValid;
}
```

### 2. User Feedback

Provide clear feedback to users:

```javascript
function executeWithFeedback() {
    // Show start message
    Application.showMessage(
        ApplicationMessageType.Info,
        "Starting data action execution..."
    );
    
    // Set up event handlers
    DataAction_1.onBeforeExecute = function() {
        Application.showBusyIndicator("Executing data action...");
    };
    
    DataAction_1.onAfterExecute = function(result) {
        Application.hideBusyIndicator();
        
        if (result.success) {
            Application.showMessage(
                ApplicationMessageType.Success,
                "Data action completed successfully!"
            );
            
            // Refresh data
            Table_1.getDataSource().refreshData();
        } else {
            Application.showMessage(
                ApplicationMessageType.Error,
                "Data action failed: " + result.message
            );
        }
    };
    
    // Execute
    DataAction_1.execute();
}
```

### 3. Batch Execution

Execute multiple data actions efficiently:

```javascript
function executeBatch() {
    var dataActions = [DataAction_1, DataAction_2, DataAction_3];
    var completed = 0;
    var total = dataActions.length;
    
    Application.showBusyIndicator("Executing batch actions...");
    
    dataActions.forEach(function(action, index) {
        action.onAfterExecute = function(result) {
            completed++;
            
            if (result.success) {
                console.log("Action", index + 1, "completed");
            } else {
                console.error("Action", index + 1, "failed:", result);
            }
            
            // Check if all actions are complete
            if (completed === total) {
                Application.hideBusyIndicator();
                Table_1.getDataSource().refreshData();
                Application.showMessage(
                    ApplicationMessageType.Info,
                    "All data actions completed"
                );
            }
        };
        
        // Execute with slight delay to avoid overwhelming system
        setTimeout(function() {
            action.execute();
        }, index * 100);
    });
}
```

### 4. Performance Considerations

- Use `executeInBackground()` for long-running actions
- Avoid executing multiple actions simultaneously on the same data
- Refresh data sources only after all related actions complete
- Implement proper error handling to prevent UI freezing

---

## Complete Example

```javascript
// Complete example of data action management
var DataManager = {
    // Initialize data action
    init: function() {
        // Set up event handlers
        this.setupEventHandlers();
        
        // Set default parameters
        this.setDefaultParameters();
    },
    
    // Set up event handlers
    setupEventHandlers: function() {
        var self = this;
        
        DataAction_1.onBeforeExecute = function() {
            return self.validateBeforeExecute();
        };
        
        DataAction_1.onAfterExecute = function(result) {
            self.handleAfterExecute(result);
        };
        
        DataAction_1.onExecutionStatusUpdate = function(status) {
            self.handleStatusUpdate(status);
        };
    },
    
    // Set default parameters
    setDefaultParameters: function() {
        var currentDate = new Date();
        DataAction_1.setParameterValue("YEAR", currentDate.getFullYear().toString());
        DataAction_1.setParameterValue("MONTH", (currentDate.getMonth() + 1).toString());
    },
    
    // Validate before execution
    validateBeforeExecute: function() {
        // Check data locks
        if (this.checkDataLocks()) {
            return false;
        }
        
        // Validate parameters
        if (!this.validateParameters()) {
            return false;
        }
        
        // Show loading
        Application.showBusyIndicator("Executing data action...");
        return true;
    },
    
    // Check data locks
    checkDataLocks: function() {
        var selection = Table_1.getSelections()[0];
        
        if (selection) {
            var lockState = Table_1.getPlanning().getDataLocking().getState(selection);
            
            if (lockState === DataLockingState.Locked) {
                Application.showMessage(
                    ApplicationMessageType.Warning,
                    "Data is locked by another user"
                );
                return true;
            }
        }
        
        return false;
    },
    
    // Validate parameters
    validateParameters: function() {
        var required = ["YEAR", "SCENARIO"];
        var missing = [];
        
        required.forEach(function(param) {
            var value = DataAction_1.getParameterValue(param);
            if (!value) {
                missing.push(param);
            }
        });
        
        if (missing.length > 0) {
            Application.showMessage(
                ApplicationMessageType.Error,
                "Missing parameters: " + missing.join(", ")
            );
            return false;
        }
        
        return true;
    },
    
    // Handle after execution
    handleAfterExecute: function(result) {
        Application.hideBusyIndicator();
        
        if (result.success) {
            this.onSuccess(result);
        } else {
            this.onError(result);
        }
    },
    
    // Handle success
    onSuccess: function(result) {
        Application.showMessage(
            ApplicationMessageType.Success,
            "Data action completed successfully"
        );
        
        // Refresh data
        Table_1.getDataSource().refreshData();
        
        // Log success
        console.log("Data action success:", result);
    },
    
    // Handle error
    onError: function(result) {
        Application.showMessage(
            ApplicationMessageType.Error,
            "Data action failed: " + (result.message || "Unknown error")
        );
        
        console.error("Data action error:", result);
    },
    
    // Handle status updates
    handleStatusUpdate: function(status) {
        console.log("Data action status:", status);
        
        switch(status) {
            case ExecutionStatus.Running:
                console.log("Execution in progress...");
                break;
            case ExecutionStatus.Completed:
                console.log("Execution completed");
                break;
            case ExecutionStatus.Failed:
                console.error("Execution failed");
                break;
            case ExecutionStatus.Cancelled:
                console.log("Execution cancelled");
                break;
        }
    },
    
    // Execute data action
    execute: function(parameters) {
        // Set parameters if provided
        if (parameters) {
            Object.keys(parameters).forEach(function(key) {
                DataAction_1.setParameterValue(key, parameters[key]);
            });
        }
        
        // Execute
        DataAction_1.execute();
    },
    
    // Execute in background
    executeInBackground: function(parameters) {
        // Set parameters if provided
        if (parameters) {
            Object.keys(parameters).forEach(function(key) {
                DataAction_1.setParameterValue(key, parameters[key]);
            });
        }
        
        // Execute in background
        DataAction_1.executeInBackground();
    }
};

// Usage example:
// Initialize on story load
DataManager.init();

// Execute with custom parameters
DataManager.execute({
    "YEAR": "2024",
    "SCENARIO": "Budget",
    "AMOUNT": 100000
});
```

---

## Notes

- Always handle data locks before executing data actions that modify data
- Use `executeInBackground()` for long-running actions to avoid UI freezing
- Provide clear user feedback through loading indicators and messages
- Validate all required parameters before execution
- Consider implementing retry logic for failed executions
- Refresh affected data sources after successful data action execution

