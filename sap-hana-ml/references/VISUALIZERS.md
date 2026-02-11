# HANA ML Visualizers Reference

**Module**: `hana_ml.visualizers`
**Documentation**: [https://help.sap.com/doc/1d0ebfe5e8dd44d09606814d83308d4b/2.0.07/en-US/hana_ml.visualizers.html](https://help.sap.com/doc/1d0ebfe5e8dd44d09606814d83308d4b/2.0.07/en-US/hana_ml.visualizers.html)

---

## EDA (Exploratory Data Analysis)

### EDAVisualizer

```python
from hana_ml.visualizers.eda import EDAVisualizer
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(10, 6))
viz = EDAVisualizer(ax=ax)

# Distribution plot
viz.distribution_plot(
    data=df,
    column='AGE',
    bins=20,
    title='Age Distribution'
)

# Pie plot
viz.pie_plot(
    data=df,
    column='CATEGORY',
    title='Category Distribution'
)

# Correlation plot
viz.correlation_plot(
    data=df,
    columns=['F1', 'F2', 'F3', 'F4'],
    title='Feature Correlations'
)

# Scatter plot
viz.scatter_plot(
    data=df,
    x='AGE',
    y='SALARY',
    color='DEPARTMENT',
    title='Age vs Salary'
)

# Bar plot
viz.bar_plot(
    data=df,
    column='CATEGORY',
    aggregation='count',
    title='Category Counts'
)

# Box plot
viz.box_plot(
    data=df,
    column='SALARY',
    groupby='DEPARTMENT',
    title='Salary by Department'
)

plt.show()
```

### Profiler

```python
from hana_ml.visualizers.eda import Profiler

profiler = Profiler(conn)
profile = profiler.profile(df)

# Get statistics
print(profile.statistics)
print(profile.missing_values)
print(profile.unique_values)
```

### Time Series Plots

```python
from hana_ml.visualizers.eda import (
    plot_acf,
    plot_pacf,
    seasonal_plot,
    quarter_plot,
    timeseries_box_plot,
    plot_change_points,
    plot_moving_average,
    plot_rolling_stddev,
    plot_seasonal_decompose,
    plot_time_series_outlier,
    plot_psd
)

# Autocorrelation
plot_acf(ts_df, column='VALUE', lags=40)

# Partial autocorrelation
plot_pacf(ts_df, column='VALUE', lags=40)

# Seasonal plot
seasonal_plot(ts_df, column='VALUE', period=12)

# Quarter plot
quarter_plot(ts_df, column='VALUE')

# Box plot by time period
timeseries_box_plot(ts_df, column='VALUE', groupby='MONTH')

# Change point visualization
plot_change_points(ts_df, column='VALUE', change_points=[10, 50, 100])

# Moving average
plot_moving_average(ts_df, column='VALUE', window=7)

# Rolling standard deviation
plot_rolling_stddev(ts_df, column='VALUE', window=7)

# Seasonal decomposition
plot_seasonal_decompose(ts_df, column='VALUE', period=12)

# Outlier detection
plot_time_series_outlier(ts_df, column='VALUE', method='iqr')

# Power spectral density
plot_psd(ts_df, column='VALUE')
```

### Statistical Plots

```python
from hana_ml.visualizers.eda import (
    bubble_plot,
    parallel_coordinates,
    kdeplot,
    hist
)

# Bubble plot
bubble_plot(
    data=df,
    x='AGE',
    y='SALARY',
    size='EXPERIENCE',
    color='DEPARTMENT'
)

# Parallel coordinates
parallel_coordinates(
    data=df,
    columns=['F1', 'F2', 'F3', 'F4'],
    color='CATEGORY'
)

# Kernel density estimation
kdeplot(data=df, column='VALUE')

# Histogram
hist(data=df, column='VALUE', bins=30)
```

---

## Metrics Visualization

### MetricsVisualizer

```python
from hana_ml.visualizers.metrics import MetricsVisualizer
import matplotlib.pyplot as plt

mv = MetricsVisualizer()

# Confusion matrix
mv.plot_confusion_matrix(
    y_true=['A', 'B', 'A', 'C', 'B', 'A'],
    y_pred=['A', 'B', 'B', 'C', 'B', 'A'],
    labels=['A', 'B', 'C'],
    title='Classification Results'
)

plt.show()
```

---

## Model Debriefing

### TreeModelDebriefing

```python
from hana_ml.visualizers.model_debriefing import TreeModelDebriefing

# Initialize with trained tree-based model
debriefing = TreeModelDebriefing(model)

# Interactive tree visualization
debriefing.tree_debrief()

# Export tree to file
debriefing.tree_export(filename='decision_tree.png', format='png')

# Parse tree structure
tree_structure = debriefing.tree_parse()

# Using DOT format
debriefing.tree_debrief_with_dot()
debriefing.tree_export_with_dot(filename='tree.dot')
```

### SHAP Explainer Integration

```python
from hana_ml.visualizers.model_debriefing import TreeModelDebriefing

# Get SHAP values via debriefing
shap_values = debriefing.shapley_explainer(test_df)
```

---

## SHAP Visualization

### ShapleyExplainer

```python
from hana_ml.visualizers.shap import ShapleyExplainer

# Initialize with trained model
explainer = ShapleyExplainer(model)

# Summary plot (feature importance)
explainer.summary_plot(
    data=test_df,
    max_display=20,  # Top N features
    plot_type='bar'  # or 'dot'
)

# Force plot (single prediction explanation)
explainer.force_plot(
    data=test_df.head(1),
    link='identity'
)

# Beeswarm plot
beeswarm = explainer.get_beeswarm_plot_item(test_df)

# Dependence plot
explainer.get_dependence_plot_items(
    data=test_df,
    feature='AGE',
    interaction_feature='INCOME'
)

# Bar plot
bar_item = explainer.get_bar_plot_item(test_df)
```

### TimeSeriesExplainer

```python
from hana_ml.visualizers.shap import TimeSeriesExplainer

ts_explainer = TimeSeriesExplainer(ts_model)

# Explain time series predictions
ts_explainer.summary_plot(ts_test_df)
```

---

## Dataset Reports

### DatasetReportBuilder

```python
from hana_ml.visualizers.dataset_report import DatasetReportBuilder

# Build comprehensive dataset report
report_builder = DatasetReportBuilder(conn)

# Build report
report = report_builder.build(
    data=df,
    columns=['AGE', 'SALARY', 'DEPARTMENT', 'TENURE'],
    key='ID'
)

# Generate HTML report
html = report_builder.generate_html_report()

# Save to file
with open('dataset_report.html', 'w') as f:
    f.write(html)

# Display in Jupyter notebook
report_builder.generate_notebook_iframe_report()
```

---

## Unified Reports

### UnifiedReport

```python
from hana_ml.visualizers.unified_report import UnifiedReport

# Build comprehensive model report
report = UnifiedReport(model)

# Build report content
report.build()

# Tree visualization (for tree-based models)
report.tree_debrief()

# Display in notebook
report.display()

# Get iframe for embedding
iframe = report.get_iframe_report()
```

---

## Time Series Reports

### TimeSeriesReport

```python
from hana_ml.visualizers.time_series_report import TimeSeriesReport, DatasetAnalysis

# Initialize report
ts_report = TimeSeriesReport()

# Add pages
ts_report.addPage(
    title='Sales Analysis',
    data=ts_df,
    time_column='DATE',
    value_column='SALES'
)

# Build report
ts_report.build()

# Generate HTML
html = ts_report.generate_html()
```

### DatasetAnalysis

```python
from hana_ml.visualizers.time_series_report import DatasetAnalysis

analysis = DatasetAnalysis(
    data=ts_df,
    time_column='DATE',
    value_column='VALUE'
)

# Various analysis methods
analysis.trend_analysis()
analysis.seasonality_analysis(period=12)
analysis.stationarity_test()
```

---

## Pipeline Visualization

### Digraph

```python
from hana_ml.visualizers.digraph import (
    Digraph,
    MultiDigraph,
    Node,
    Edge,
    DigraphConfig
)

# Create pipeline visualization
config = DigraphConfig(
    direction='TB',  # Top to Bottom
    node_style='rounded',
    edge_style='solid'
)

graph = Digraph(config=config)

# Add nodes
graph.add_model_node(
    node_id='preprocessing',
    label='Data Preprocessing',
    model_type='preprocessing'
)

graph.add_model_node(
    node_id='classifier',
    label='Random Forest',
    model_type='classification'
)

# Add edges
graph.add_edge(
    source='preprocessing',
    target='classifier',
    label='features'
)

# Build graph
graph.build()

# Generate HTML
html = graph.generate_html()

# Save to file
with open('pipeline.html', 'w') as f:
    f.write(html)
```

### MultiDigraph

```python
from hana_ml.visualizers.digraph import MultiDigraph

# Hierarchical graph
multi_graph = MultiDigraph()

# Add subgraphs
preprocessing_graph = multi_graph.add_subgraph('Preprocessing')
preprocessing_graph.add_model_node('imputer', 'Imputer')
preprocessing_graph.add_model_node('normalizer', 'Normalizer')

modeling_graph = multi_graph.add_subgraph('Modeling')
modeling_graph.add_model_node('model', 'Classifier')

# Connect subgraphs
multi_graph.add_edge('normalizer', 'model')

multi_graph.build()
```

---

## Word Cloud

### WordCloud

```python
from hana_ml.visualizers.word_cloud import WordCloud

# Initialize word cloud
wc = WordCloud(
    width=800,
    height=400,
    background_color='white',
    max_words=200
)

# Generate from text column
wc.generate_from_text(
    data=text_df,
    column='TEXT_CONTENT'
)

# Generate from word frequencies
word_freq = {'python': 100, 'machine': 80, 'learning': 75, 'data': 60}
wc.fit_words(word_freq)

# Process text
processed = wc.process_text('Raw text content here...')

# Save to file
wc.to_file('wordcloud.png')

# Save as SVG
wc.to_svg('wordcloud.svg')
```

---

## AutoML Progress Monitoring

### PipelineProgressStatusMonitor

```python
from hana_ml.visualizers.automl_progress import PipelineProgressStatusMonitor

# Monitor AutoML progress
monitor = PipelineProgressStatusMonitor(
    connection_context=conn,
    progress_id='MY_AUTOML_JOB'
)

# Start monitoring
monitor.start()

# Get current status
status = monitor.get_status()
print(status)

# Stop monitoring
monitor.stop()
```

### SimplePipelineProgressStatusMonitor

```python
from hana_ml.visualizers.automl_progress import SimplePipelineProgressStatusMonitor

# Simple progress monitoring
simple_monitor = SimplePipelineProgressStatusMonitor(conn)
simple_monitor.monitor(auto_clf)
```

---

## AutoML Reports

### BestPipelineReport

```python
from hana_ml.visualizers.automl_report import BestPipelineReport

# Generate report for AutoML best pipeline
report = BestPipelineReport(auto_clf)

# Build report
report.build()

# Display
report.display()

# Get HTML
html = report.generate_html()
```

---

## M4 Sampling (Time Series Visualization)

### m4_sampling

```python
from hana_ml.visualizers.m4_sampling import (
    m4_sampling,
    get_min_index,
    get_max_index
)

# M4 algorithm for efficient time series visualization
# Reduces data points while preserving visual patterns
sampled_df = m4_sampling(
    data=large_ts_df,
    column='VALUE',
    num_pixels=1000  # Target number of points
)

# Get indices of extrema
min_idx = get_min_index(ts_df, column='VALUE')
max_idx = get_max_index(ts_df, column='VALUE')
```

---

## Forecast Visualization

### forecast_line_plot

```python
from hana_ml.visualizers.visualizer_base import forecast_line_plot

# Plot actual vs forecast
forecast_line_plot(
    actual_data=actual_df,
    forecast_data=forecast_df,
    time_column='DATE',
    actual_column='ACTUAL',
    forecast_column='FORECAST',
    confidence_lower='CI_LOWER',
    confidence_upper='CI_UPPER',
    title='Sales Forecast'
)
```

---

## Common Patterns

### Saving Visualizations

```python
import matplotlib.pyplot as plt

# Create figure - returns (Figure, Axes) tuple
fig, ax = plt.subplots(figsize=(12, 8))

# EDAVisualizer methods modify ax in-place and return ax for chaining
viz = EDAVisualizer(ax=ax)
ax = viz.distribution_plot(data=df, column='VALUE')  # Returns matplotlib Axes

# Save to file - returns None, writes file to disk
plt.savefig('distribution.png', dpi=300, bbox_inches='tight')

# Close figure to free memory - important in loops/scripts
plt.close()  # Returns None, releases figure resources
```

### Multiple Plots

```python
import matplotlib.pyplot as plt
from hana_ml.visualizers.eda import EDAVisualizer

# Create 2x2 subplot grid
fig, axes = plt.subplots(2, 2, figsize=(14, 10))  # Returns (Figure, ndarray of Axes)

# Distribution - each plot method returns its Axes object
viz1 = EDAVisualizer(ax=axes[0, 0])
viz1.distribution_plot(data=df, column='AGE')

# Box plot
viz2 = EDAVisualizer(ax=axes[0, 1])
viz2.box_plot(data=df, column='SALARY', groupby='DEPARTMENT')

# Scatter
viz3 = EDAVisualizer(ax=axes[1, 0])
viz3.scatter_plot(data=df, x='AGE', y='SALARY')

# Correlation
viz4 = EDAVisualizer(ax=axes[1, 1])
viz4.correlation_plot(data=df, columns=['F1', 'F2', 'F3'])

# Adjust spacing between subplots - returns None, modifies figure state
plt.tight_layout()

# Save dashboard - returns None, writes file to disk
plt.savefig('eda_dashboard.png', dpi=300)

# Good practice: close figure to free memory (optional but recommended)
plt.close()
```

### Notebook Integration

```python
# In Jupyter notebook
from IPython.display import HTML

# For HTML reports
html_content = report.generate_html()
HTML(html_content)

# For iframe reports
iframe = report.get_iframe_report()
display(iframe)
```

---

## Dependencies

The visualizers module requires direct and transitive dependencies:

**Direct dependencies:**
- matplotlib (static plots)
- plotly (interactive plots)
- graphviz (tree visualization)
- wordcloud (word cloud generation)

**Transitive dependencies** (required by above):
- numpy (required by matplotlib, plotting functions)
- pillow (required by wordcloud for image handling)
- pandas (DataFrame integration with visualizers)

```bash
# Install all visualization dependencies (explicit)
pip install matplotlib plotly graphviz wordcloud pillow numpy pandas

# Or install hana-ml which handles dependencies automatically
pip install hana-ml

# Note: hana-ml includes visualization dependencies by default
# Transitive dependencies are resolved automatically by pip
```

**Note**: The `graphviz` Python package requires the Graphviz system binary to be installed separately:
```bash
# Ubuntu/Debian
apt-get install graphviz

# macOS
brew install graphviz

# Windows: Download from [https://graphviz.org/download/](https://graphviz.org/download/)
```
