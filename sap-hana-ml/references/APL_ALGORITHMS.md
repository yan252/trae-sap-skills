# APL (Automated Predictive Library) Algorithms Reference

**Module**: `hana_ml.algorithms.apl`
**Documentation**: [https://help.sap.com/doc/1d0ebfe5e8dd44d09606814d83308d4b/2.0.07/en-US/hana_ml.algorithms.apl.html](https://help.sap.com/doc/1d0ebfe5e8dd44d09606814d83308d4b/2.0.07/en-US/hana_ml.algorithms.apl.html)

---

## Overview

APL (Automated Predictive Library) provides AutoML capabilities with:
- Automatic feature engineering
- Automatic algorithm selection
- Built-in model optimization
- Explainability features

---

## Classification

### AutoClassifier

Automated classification with automatic feature selection and algorithm optimization.

```python
from hana_ml.algorithms.apl.classification import AutoClassifier

auto_clf = AutoClassifier(
    variable_auto_selection=True,
    variable_selection_best_iteration=True,
    cutting_strategy='maximize_predictive_power',  # or 'maximize_f1_score'
)

# Train
auto_clf.fit(
    train_df,
    label='TARGET',
    key='ID'  # Optional: row identifier
)

# Check training status
print(auto_clf.is_fitted())

# Predict
predictions = auto_clf.predict(test_df)

# Score
score = auto_clf.score(test_df, label='TARGET')
```

### GradientBoostingClassifier

Multi-class gradient boosting implementation.

```python
from hana_ml.algorithms.apl.gradient_boosting_classification import GradientBoostingClassifier

gbc = GradientBoostingClassifier(
    early_stopping_patience=10,
    eval_metric='MultiClassLogLoss',
    learning_rate=0.1,
    max_depth=6,
    max_iterations=100
)

gbc.fit(train_df, label='TARGET')
predictions = gbc.predict(test_df)
```

### GradientBoostingBinaryClassifier

Specialized binary classification with gradient boosting.

```python
from hana_ml.algorithms.apl.gradient_boosting_classification import GradientBoostingBinaryClassifier

gbc_binary = GradientBoostingBinaryClassifier(
    early_stopping_patience=10,
    learning_rate=0.1,
    max_depth=6
)

gbc_binary.fit(train_df, label='IS_POSITIVE')
predictions = gbc_binary.predict(test_df)
probabilities = gbc_binary.predict_proba(test_df)
```

---

## Regression

### AutoRegressor

Automated regression with built-in feature engineering.

```python
from hana_ml.algorithms.apl.regression import AutoRegressor

auto_reg = AutoRegressor(
    variable_auto_selection=True,
    polynomial_degree=1
)

auto_reg.fit(train_df, label='PRICE')
predictions = auto_reg.predict(test_df)

# Get performance metrics
metrics = auto_reg.get_performance_metrics()
print(metrics.collect())
```

### GradientBoostingRegressor

Gradient boosting for continuous target variables.

```python
from hana_ml.algorithms.apl.gradient_boosting_regression import GradientBoostingRegressor

gbr = GradientBoostingRegressor(
    early_stopping_patience=10,
    eval_metric='RMSE',
    learning_rate=0.1,
    max_depth=6,
    max_iterations=100
)

gbr.fit(train_df, label='PRICE')
predictions = gbr.predict(test_df)
```

---

## Time Series

### AutoTimeSeries

Comprehensive time series forecasting with automatic model selection and parameter tuning.

```python
from hana_ml.algorithms.apl.time_series import AutoTimeSeries

ts_model = AutoTimeSeries(
    horizon=12,  # Forecast horizon
    last_training_time_point='2023-12-31',  # Last training date
    forecast_method='Default',  # 'Default', 'ExponentialSmoothing', 'LinearRegression'
    with_exogenous=True  # Include exogenous variables
)

# Train with exogenous variables
ts_model.fit(
    ts_df,
    endog='SALES',
    exog=['PROMOTION', 'HOLIDAY', 'PRICE']
)

# Forecast
forecast = ts_model.predict(horizon=12)

# Forecast with future exogenous values
forecast = ts_model.predict(
    horizon=12,
    exog_pred=future_exog_df
)

# Get accuracy metrics
accuracy = ts_model.get_accuracy_metrics()
```

---

## Clustering

### AutoUnsupervisedClustering

Automatic clustering without target labels.

```python
from hana_ml.algorithms.apl.clustering import AutoUnsupervisedClustering

auto_cluster = AutoUnsupervisedClustering(
    max_clusters=10
)

auto_cluster.fit(data_df)
labels = auto_cluster.predict(data_df)

# Get cluster statistics
stats = auto_cluster.get_cluster_statistics()
```

### AutoSupervisedClustering

Clustering with labeled data guidance.

```python
from hana_ml.algorithms.apl.clustering import AutoSupervisedClustering

sup_cluster = AutoSupervisedClustering()
sup_cluster.fit(data_df, label='SEGMENT')
predictions = sup_cluster.predict(new_data_df)
```

---

## Common Methods

All APL classes share these methods:

### Training & Prediction

```python
# Train model
model.fit(train_df, label='TARGET')

# Make predictions
predictions = model.predict(test_df)

# Calculate score
score = model.score(test_df, label='TARGET')

# Combined fit and predict
predictions = model.fit_predict(train_df, label='TARGET')
```

### Model State

```python
# Check if model is trained
model.is_fitted()

# Get model summary
summary = model.get_summary()
print(summary.collect())

# Get detailed debrief report
debrief = model.get_debrief_report()
print(debrief.collect())
```

### Performance Analysis

```python
# Performance metrics
metrics = model.get_performance_metrics()
print(metrics.collect())

# Feature importances
importance = model.get_feature_importances()
print(importance.collect())

# Feature contributions (for individual predictions)
contributions = model.get_feature_contributions(test_df)
```

### Model Persistence

```python
# Save model to HANA table
model.name = 'MY_APL_MODEL'
model.save_model(model_table='APL_MODELS', if_exists='replace')

# Load model from HANA table
model.load_model(model_table='APL_MODELS')

# Save artifacts
model.save_artifact(artifact_table='APL_ARTIFACTS')
```

### Code Export

```python
# Export model as apply code (for deployment)
apply_code = model.export_apply_code()
print(apply_code)

# Export for different runtimes
js_code = model.export_apply_code(target='JavaScript')
sql_code = model.export_apply_code(target='SQL')
```

### Reporting

```python
# Build HTML report
model.build_report()

# Generate downloadable HTML report
html_content = model.generate_html_report()

# Display in notebook
model.generate_notebook_iframe_report()
```

### Distributed Processing

```python
# Enable scale-out for large datasets
model.set_scale_out(enabled=True)

# Schedule asynchronous training
job_id = model.schedule_fit(train_df, label='TARGET')

# Schedule asynchronous prediction
job_id = model.schedule_predict(test_df)
```

### Explainability

```python
# Add SHAP explainer to prediction phase
model.set_shapley_explainer_of_predict_phase(enabled=True)

# Get SHAP values for predictions
predictions_with_shap = model.predict(test_df)

# Access explainer
from hana_ml.visualizers.shap import ShapleyExplainer
explainer = ShapleyExplainer(model)
explainer.summary_plot(test_df)
explainer.force_plot(test_df.head(1))
```

---

## Parameters Reference

### AutoClassifier Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `variable_auto_selection` | bool | True | Automatic feature selection |
| `variable_selection_best_iteration` | bool | True | Use best iteration for selection |
| `cutting_strategy` | str | 'maximize_predictive_power' | Target optimization strategy |
| `polynomial_degree` | int | 1 | Polynomial feature degree |
| `interactions_max_kept` | int | None | Max interaction features |

### AutoRegressor Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `variable_auto_selection` | bool | True | Automatic feature selection |
| `polynomial_degree` | int | 1 | Polynomial feature degree |
| `variable_selection_min_nb_of_final_variables` | int | None | Min features to keep |

### GradientBoosting Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `max_iterations` | int | 100 | Maximum boosting iterations |
| `max_depth` | int | 6 | Maximum tree depth |
| `learning_rate` | float | 0.1 | Learning rate |
| `early_stopping_patience` | int | 10 | Iterations without improvement |
| `eval_metric` | str | varies | Evaluation metric |
| `subsample_ratio` | float | 1.0 | Row sampling ratio |
| `colsample_ratio` | float | 1.0 | Column sampling ratio |

### AutoTimeSeries Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `horizon` | int | None | Forecast horizon |
| `last_training_time_point` | str | None | Last training timestamp |
| `forecast_method` | str | 'Default' | Forecasting method |
| `with_exogenous` | bool | False | Include exogenous variables |
| `season` | int | None | Seasonal period |
| `with_decomposition` | bool | True | Enable decomposition |

---

## Model Storage with ModelStorage

```python
from hana_ml.model_storage import ModelStorage

# Initialize storage
ms = ModelStorage(conn)

# Save APL model
auto_clf.name = 'CUSTOMER_CHURN_MODEL'
ms.save_model(
    model=auto_clf,
    if_exists='replace',
    version=1
)

# List saved models
models = ms.list_models()
print(models)

# Load model
loaded_model = ms.load_model('CUSTOMER_CHURN_MODEL')

# Load specific version
loaded_model = ms.load_model('CUSTOMER_CHURN_MODEL', version=1)

# Delete model
ms.delete_model('CUSTOMER_CHURN_MODEL')

# Delete specific version
ms.delete_model('CUSTOMER_CHURN_MODEL', version=1)
```

---

## Visualization Integration

### Model Debriefing

```python
from hana_ml.visualizers.model_debriefing import TreeModelDebriefing

# For tree-based APL models
debriefing = TreeModelDebriefing(model)

# Tree visualization
debriefing.tree_debrief()

# Export tree
debriefing.tree_export(filename='model_tree.png')

# With DOT format
debriefing.tree_debrief_with_dot()
```

### SHAP Explainer

```python
from hana_ml.visualizers.shap import ShapleyExplainer

explainer = ShapleyExplainer(auto_clf)

# Summary plot
explainer.summary_plot(test_df)

# Force plot for single prediction
explainer.force_plot(test_df.head(1))

# Beeswarm plot
explainer.get_beeswarm_plot_item(test_df)

# Dependence plot
explainer.get_dependence_plot_items(test_df, feature='AGE')

# Bar plot (feature importance)
explainer.get_bar_plot_item(test_df)
```

### Performance Metrics

```python
from hana_ml.visualizers.metrics import MetricsVisualizer

mv = MetricsVisualizer()

# Confusion matrix
predictions = auto_clf.predict(test_df)
mv.plot_confusion_matrix(
    y_true=test_df.select('TARGET').collect(),
    y_pred=predictions.select('PREDICTED').collect()
)
```

---

## Best Practices

### 1. Feature Engineering
APL handles feature engineering automatically, but you can guide it:

```python
auto_clf = AutoClassifier(
    polynomial_degree=2,  # Create polynomial features
    interactions_max_kept=50  # Limit interaction terms
)
```

### 2. Model Selection
Let APL optimize, but monitor performance:

```python
# After training
metrics = auto_clf.get_performance_metrics()
importance = auto_clf.get_feature_importances()

# Review and adjust if needed
if importance.collect()['IMPORTANCE'].max() < 0.1:
    # Features may not be predictive enough
    pass
```

### 3. Production Deployment

```python
# Export apply code for deployment
apply_code = auto_clf.export_apply_code()

# Or use ModelStorage for HANA-native deployment
ms = ModelStorage(conn)
auto_clf.name = 'PRODUCTION_MODEL'
ms.save_model(model=auto_clf, version=1)

# Load in production
prod_model = ms.load_model('PRODUCTION_MODEL', version=1)
```

### 4. Monitoring
Track model performance over time:

```python
# Create model card
from hana_ml.algorithms.pal.model_selection import create_model_card

card = create_model_card(
    model=auto_clf,
    model_name='Customer Churn Predictor',
    description='Predicts customer churn probability',
    training_data_description='12 months of customer data',
    intended_use='Marketing targeting'
)
```

---

## APL vs PAL Decision Guide

| Use Case | Recommendation |
|----------|----------------|
| Quick prototyping | APL (automatic) |
| Production with custom requirements | PAL (granular control) |
| Feature engineering needed | APL (automatic) |
| Specific algorithm required | PAL (explicit selection) |
| Time series with complex seasonality | APL AutoTimeSeries |
| Ensemble methods | PAL (more options) |
| Explainability required | APL (built-in SHAP) |
| Deep learning | PAL (LSTM, MLP) |
