# ML Scenario Manager Guide

Complete guide for machine learning in SAP Data Intelligence.

## Table of Contents

1. [Overview](#overview)
2. [ML Scenario Manager](#ml-scenario-manager)
3. [JupyterLab Environment](#jupyterlab-environment)
4. [Python SDK](#python-sdk)
5. [Training Pipelines](#training-pipelines)
6. [Metrics Explorer](#metrics-explorer)
7. [Model Deployment](#model-deployment)
8. [Versioning](#versioning)
9. [Best Practices](#best-practices)

---

## Overview

SAP Data Intelligence provides comprehensive machine learning capabilities:

**Key Components:**
- **ML Scenario Manager**: Organize and manage ML artifacts
- **JupyterLab**: Interactive data science environment
- **Python SDK**: Programmatic ML operations
- **Metrics Explorer**: Visualize and compare results
- **Pipelines**: Productionize ML workflows

---

## ML Scenario Manager

Central application for organizing data science artifacts.

### Accessing ML Scenario Manager

1. Open SAP Data Intelligence Launchpad
2. Navigate to ML Scenario Manager tile
3. View existing scenarios or create new

### Core Concepts

**ML Scenario:**
- Container for datasets, notebooks, pipelines
- Supports versioning and branching
- Export/import for migration

**Artifacts:**
- Datasets (registered data sources)
- Jupyter notebooks
- Pipelines (training, inference)
- Model files

### Creating a Scenario

1. Click "Create" in ML Scenario Manager
2. Enter scenario name and description
3. Choose initial version name
4. Add artifacts (datasets, notebooks, pipelines)

### Scenario Structure

```
ML Scenario: Customer Churn Prediction
├── Datasets
│   ├── customer_data (registered)
│   └── transaction_history (registered)
├── Notebooks
│   ├── 01_data_exploration.ipynb
│   ├── 02_feature_engineering.ipynb
│   └── 03_model_training.ipynb
├── Pipelines
│   ├── training_pipeline
│   └── inference_pipeline
└── Versions
    ├── v1.0 (initial)
    ├── v1.1 (improved features)
    └── v2.0 (new model architecture)
```

---

## JupyterLab Environment

Interactive environment for data science experimentation.

### Accessing JupyterLab

1. From ML Scenario Manager, click "Open Notebook"
2. Or access directly from SAP Data Intelligence Launchpad

### Available Kernels

- Python 3 (with ML libraries)
- Custom kernels (via Docker configuration)

### Pre-installed Libraries

```python
# Data Processing
import pandas as pd
import numpy as np

# Machine Learning
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Deep Learning (available)
import tensorflow as tf
import torch

# SAP Data Intelligence SDK
from sapdi import tracking
```

### Data Lake Access

Access SAP Data Intelligence Data Lake from notebooks:

```python
from sapdi.datalake import DataLakeClient

client = DataLakeClient()

# Read file
df = client.read_csv('/shared/data/customers.csv')

# Write file
client.write_parquet(df, '/shared/output/processed.parquet')
```

### Virtual Environments

Create isolated environments for dependencies:

```bash
# Create virtual environment
python -m venv /home/user/myenv

# Activate
source /home/user/myenv/bin/activate

# Install packages
pip install xgboost lightgbm catboost
```

### Data Browser Extension

Use the Data Browser to:
- Browse available data sources
- Preview data
- Import data to notebooks

---

## Python SDK

Programmatic interface for ML operations.

### SDK Installation

Pre-installed in JupyterLab and Python operators.

```python
import sapdi
from sapdi import tracking
from sapdi import context
```

### MLTrackingSDK Functions

| Function | Description | Limits |
|----------|-------------|--------|
| `start_run()` | Begin experiment tracking | Specify run_collection_name, run_name |
| `end_run()` | Complete tracking | Auto-adds start/end timestamps |
| `log_param()` | Log configuration values | name: 256 chars, value: 5000 chars |
| `log_metric()` | Log numeric metric | name: 256 chars (case-sensitive) |
| `log_metrics()` | Batch log metrics | Dictionary list format |
| `persist_run()` | Force save to storage | Auto at 1.5MB cache or end_run |
| `set_tags()` | Key-value pairs for filtering | runName is reserved |
| `set_labels()` | UI/semantic labels | Non-filterable |
| `delete_runs()` | Remove persisted metrics | By scenario/pipeline/execution |
| `get_runs()` | Retrieve run objects | Returns metrics, params, tags |
| `get_metrics_history()` | Get metric values | Max 1000 per metric |
| `update_run_info()` | Modify run metadata | Change name, collection, tags |

### Metrics Tracking

```python
from sapdi import tracking

# Initialize tracking
with tracking.start_run(run_name="experiment_001") as run:
    # Train model
    model = train_model(X_train, y_train)

    # Log parameters
    run.log_param("algorithm", "RandomForest")
    run.log_param("n_estimators", 100)
    run.log_param("max_depth", 10)

    # Log metrics
    accuracy = evaluate(model, X_test, y_test)
    run.log_metric("accuracy", accuracy)
    run.log_metric("f1_score", f1)

    # Log model artifact
    run.log_artifact("model.pkl", model)
```

### Tracking Parameters and Metrics

**Parameters** (static values):
```python
run.log_param("learning_rate", 0.01)
run.log_param("batch_size", 32)
run.log_param("epochs", 100)
```

**Metrics** (can be logged multiple times):
```python
for epoch in range(epochs):
    loss = train_epoch(model, data)
    run.log_metric("loss", loss, step=epoch)
    run.log_metric("val_loss", val_loss, step=epoch)
```

### Artifact Management

```python
# Log files
run.log_artifact("model.pkl", model_bytes)
run.log_artifact("feature_importance.png", image_bytes)

# Log directories
run.log_artifacts("./model_output/")

# Retrieve artifacts
artifacts = tracking.get_run_artifacts(run_id)
model_data = artifacts.get("model.pkl")
```

### Artifact Class Methods

| Method | Description |
|--------|-------------|
| `add_file()` | Add file to artifact, returns handler |
| `create()` | Create artifact with initial content, returns ID |
| `delete()` | Remove artifact metadata (not content) |
| `delete_content()` | Remove stored data |
| `download()` | Retrieve artifact contents to local storage |
| `get()` | Get artifact metadata |
| `list()` | List all artifacts in scenario |
| `open_file()` | Get handler for remote file access |
| `upload()` | Add files/directories to artifact |
| `walk()` | Depth-first traversal of artifact structure |

### FileHandler Methods

| Method | Description |
|--------|-------------|
| `get_reader()` | Returns file-like object for reading (use with `with`) |
| `get_writer()` | Returns object for incremental writing |
| `read()` | Load entire remote file at once |
| `write()` | Write strings, bytes, or files to data lake |

**Important:** Files between 5 MB and 5 GB (inclusive) may be appended using the append functionality. For files smaller than 5 MB, use `get_writer()` for incremental writing instead.

```python
from sapdi.artifact import Artifact

# Create artifact
artifact_id = Artifact.create(
    name="my_model",
    description="Trained model",
    content=model_bytes
)

# List artifacts
artifacts = Artifact.list()

# Download artifact
Artifact.download(artifact_id, local_path="/tmp/model/")

# Read remote file
with Artifact.open_file(artifact_id, "model.pkl").get_reader() as f:
    model = pickle.load(f)
```

### Context Information

```python
from sapdi import context

# Get scenario information
scenario_id = context.get_scenario_id()
version_id = context.get_version_id()

# Get environment info
tenant = context.get_tenant()
user = context.get_user()
```

---

## Training Pipelines

Productionize ML training workflows.

### Pipeline Components

```
[Data Consumer] -> [Feature Engineering] -> [Model Training] -> [Metrics Logger]
        |                    |                     |                    |
   Read data          Transform data         Train model          Log results
```

### Creating Training Pipeline

1. Create new graph in Modeler
2. Add data consumer operator
3. Add Python operator for training
4. Add Submit Metrics operator
5. Connect and configure

### Python Training Operator

```python
def on_input(msg):
    import pandas as pd
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.model_selection import train_test_split
    from sapdi import tracking

    # Get data
    df = pd.DataFrame(msg.body)

    # Prepare features
    X = df.drop('target', axis=1)
    y = df['target']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    # Train model
    model = RandomForestClassifier(n_estimators=100)
    model.fit(X_train, y_train)

    # Evaluate
    accuracy = model.score(X_test, y_test)

    # Track metrics
    with tracking.start_run(
        run_collection_name="classification_experiments",
        run_name="rf_training_001"
    ) as run:
        run.log_param("model_type", "RandomForest")
        run.log_metric("accuracy", accuracy)
        run.log_artifact("model.pkl", pickle.dumps(model))

    api.send("output", api.Message({"accuracy": accuracy}))

api.set_port_callback("input", on_input)
```

### ML Pipeline Templates

Pre-built templates available:

- **Auto ML Training**: Automated model selection
- **HANA ML Training**: In-database training
- **TensorFlow Training**: Deep learning
- **Basic Training**: Generic template

---

## Metrics Explorer

Visualize and compare ML experiments.

### Accessing Metrics Explorer

1. Open ML Scenario Manager
2. Click "Metrics Explorer"
3. Select scenario and version

### Viewing Runs

**Run List:**
- Run ID and name
- Status (completed, failed, running)
- Start/end time
- Logged metrics summary

### Comparing Runs

1. Select multiple runs
2. Click "Compare"
3. View side-by-side metrics
4. Visualize metric trends

### Metric Visualizations

**Available Charts:**
- Line charts (metrics over steps)
- Bar charts (metric comparison)
- Scatter plots (parameter vs metric)

### Filtering and Search

```
Filter by:
- Date range
- Status
- Parameter values
- Metric thresholds
```

---

## Model Deployment

Deploy trained models for inference.

### Deployment Options

**Batch Inference:**
- Scheduled pipeline execution
- Process large datasets
- Results to storage/database

**Real-time Inference:**
- API endpoint deployment
- Low-latency predictions
- Auto-scaling

### Creating Inference Pipeline

```
[API Input] -> [Load Model] -> [Predict] -> [API Output]
```

### Python Inference Operator

```python
import pickle
from sapdi.artifact import Artifact

# Load model once (thread-safe if model object is immutable/read-only during inference)
# Note: model.predict() must be thread-safe for concurrent requests
model = None

def load_model():
    global model
    # Get artifact metadata first
    artifacts = Artifact.list()
    model_artifact = next((a for a in artifacts if a.name == "model"), None)

    if model_artifact:
        # Download artifact and load model
        with Artifact.open_file(model_artifact.id, "model.pkl").get_reader() as f:
            model = pickle.load(f)

def on_input(msg):
    if model is None:
        load_model()

    # Get input features
    features = msg.body

    # Predict
    prediction = model.predict([features])[0]
    probability = model.predict_proba([features])[0]

    result = {
        "prediction": int(prediction),
        "probability": probability.tolist()
    }

    api.send("output", api.Message(result))

api.set_port_callback("input", on_input)
```

### Deployment Monitoring

Track deployed model performance:

```python
# Log inference metrics
run.log_metric("inference_latency", latency_ms)
run.log_metric("prediction_count", count)
run.log_metric("error_rate", errors / total)
```

---

## Versioning

Manage ML scenario versions.

### Creating Versions

1. Open ML Scenario Manager
2. Navigate to scenario
3. Click "Create Version"
4. Enter version name
5. Select base version (optional)

### Version Workflow

```
v1.0 (initial baseline)
  └── v1.1 (feature improvements)
        └── v1.2 (hyperparameter tuning)
              └── v2.0 (new architecture)
                    └── v2.1 (production release)
```

### Branching

Create versions from any point:

```
v1.0 ─── v1.1 ─── v1.2
           └── v1.1-experiment (branch for testing)
```

### Export and Import

**Export:**
1. Select scenario version
2. Click "Export"
3. Download ZIP file

**Import:**
1. Click "Import" in ML Scenario Manager
2. Upload ZIP file
3. Configure target location

---

## Best Practices

### Experiment Management

1. **Name Runs Descriptively**: Include key parameters
2. **Log Comprehensively**: All parameters and metrics
3. **Version Data**: Track data versions with runs
4. **Document Experiments**: Notes in notebooks

### Pipeline Development

1. **Start in Notebooks**: Prototype in JupyterLab
2. **Modularize Code**: Reusable functions
3. **Test Incrementally**: Validate each component
4. **Productionize Gradually**: Notebook to pipeline

### Model Management

1. **Version Models**: Link to training runs
2. **Validate Before Deploy**: Test on holdout data
3. **Monitor Production**: Track drift and performance
4. **Maintain Lineage**: Data to model to prediction

### Resource Management

1. **Right-size Resources**: Appropriate memory/CPU
2. **Clean Up Artifacts**: Remove unused experiments
3. **Archive Old Versions**: Export for long-term storage

---

## Documentation Links

- **Machine Learning**: [https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/machinelearning](https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/machinelearning)
- **ML Scenario Manager**: [https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/machinelearning/ml-scenario-manager](https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/machinelearning/ml-scenario-manager)
- **JupyterLab**: [https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/machinelearning/jupyterlab-environment](https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/machinelearning/jupyterlab-environment)
- **Python SDK**: [https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/machinelearning](https://github.com/SAP-docs/sap-hana-cloud-data-intelligence/tree/main/docs/machinelearning) (see python-sdk documentation)

---

**Last Updated**: 2025-11-22
