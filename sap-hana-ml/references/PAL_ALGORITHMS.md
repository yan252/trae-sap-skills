# PAL (Predictive Analysis Library) Algorithms Reference

**Module**: `hana_ml.algorithms.pal`
**Documentation**: [https://help.sap.com/doc/1d0ebfe5e8dd44d09606814d83308d4b/2.0.07/en-US/hana_ml.algorithms.pal.html](https://help.sap.com/doc/1d0ebfe5e8dd44d09606814d83308d4b/2.0.07/en-US/hana_ml.algorithms.pal.html)

---

## Unified Interfaces

Standardized APIs for common ML tasks.

### UnifiedClassification

```python
from hana_ml.algorithms.pal.unified_classification import UnifiedClassification

# Available functions
clf = UnifiedClassification(func='RandomDecisionTree')  # or:
# 'DecisionTree', 'LogisticRegression', 'NaiveBayes',
# 'SVM', 'MLP', 'KNN', 'HybridGradientBoostingTree'

clf.fit(train_df, features=['F1', 'F2'], label='TARGET')
predictions = clf.predict(test_df, features=['F1', 'F2'])
score = clf.score(test_df, features=['F1', 'F2'], label='TARGET')
```

### UnifiedRegression

```python
from hana_ml.algorithms.pal.unified_regression import UnifiedRegression

reg = UnifiedRegression(func='HybridGradientBoostingTree')  # or:
# 'LinearRegression', 'DecisionTree', 'RandomDecisionTree',
# 'MLP', 'SVM', 'GLM', 'PolynomialRegression'

reg.fit(train_df, features=['F1', 'F2'], label='PRICE')
predictions = reg.predict(test_df, features=['F1', 'F2'])
```

### UnifiedClustering

```python
from hana_ml.algorithms.pal.unified_clustering import UnifiedClustering

cluster = UnifiedClustering(func='KMeans', n_clusters=5)
cluster.fit(data_df, features=['F1', 'F2', 'F3'])
labels = cluster.predict(data_df, features=['F1', 'F2', 'F3'])
```

---

## AutoML

### AutomaticClassification

```python
from hana_ml.algorithms.pal.auto_ml import AutomaticClassification

auto_clf = AutomaticClassification(
    generations=10,
    population_size=20,
    progress_indicator_id='PROGRESS_ID'
)
auto_clf.fit(train_df, features=features, label='TARGET')
best_model = auto_clf.best_pipeline_
```

### AutomaticRegression

```python
from hana_ml.algorithms.pal.auto_ml import AutomaticRegression

auto_reg = AutomaticRegression(generations=10, population_size=20)
auto_reg.fit(train_df, features=features, label='PRICE')
```

### AutomaticTimeSeries

```python
from hana_ml.algorithms.pal.auto_ml import AutomaticTimeSeries

auto_ts = AutomaticTimeSeries(generations=5)
auto_ts.fit(ts_df, endog='VALUE')
forecast = auto_ts.predict(forecast_length=30)
```

### Massive AutoML (Parallel Processing)

```python
from hana_ml.algorithms.pal.auto_ml import (
    MassiveAutomaticClassification,
    MassiveAutomaticRegression,
    MassiveAutomaticTimeSeries
)

# Process multiple models in parallel
massive_clf = MassiveAutomaticClassification()
massive_clf.fit(data_df, group_key='SEGMENT', features=features, label='TARGET')
```

---

## Classification Algorithms

### Logistic Regression

```python
from hana_ml.algorithms.pal.linear_model import LogisticRegression

lr = LogisticRegression(
    max_iter=1000,
    solver='newton',  # 'newton', 'lbfgs', 'cyclical', 'stochastic'
    multi_class='multinomial',  # 'ovr', 'multinomial'
    class_map0=None,
    class_map1=None,
    enet_alpha=1.0,  # Elastic net mixing (0=L2, 1=L1)
    lamb=0.0  # Regularization
)
lr.fit(train_df, features=['F1', 'F2'], label='TARGET')
```

### Decision Tree Classifier

```python
from hana_ml.algorithms.pal.trees import DecisionTreeClassifier

dt = DecisionTreeClassifier(
    algorithm='c45',  # 'c45', 'chaid', 'cart'
    max_depth=10,
    min_samples_leaf=1,
    min_records_of_parent=2,
    min_records_of_leaf=1,
    split_threshold=1e-5,
    use_surrogate=False
)
dt.fit(train_df, features=features, label='TARGET')
```

### Random Decision Tree (Random Forest)

```python
from hana_ml.algorithms.pal.trees import RDTClassifier

rdt = RDTClassifier(
    n_estimators=100,
    max_depth=None,
    min_samples_leaf=1,
    max_features='sqrt',  # 'sqrt', 'log2', int, float
    sample_fraction=1.0,
    random_state=42
)
rdt.fit(train_df, features=features, label='TARGET')
```

### Hybrid Gradient Boosting Classifier

```python
from hana_ml.algorithms.pal.trees import HybridGradientBoostingClassifier

hgb = HybridGradientBoostingClassifier(
    n_estimators=100,
    max_depth=6,
    learning_rate=0.1,
    split_threshold=0.01,
    lamb=1.0,  # L2 regularization
    alpha=0.0  # L1 regularization
)
hgb.fit(train_df, features=features, label='TARGET')
```

### Support Vector Classification

```python
from hana_ml.algorithms.pal.svm import SVC

svc = SVC(
    kernel='rbf',  # 'linear', 'poly', 'rbf', 'sigmoid'
    c=1.0,
    gamma='scale',
    degree=3,  # For poly kernel
    shrinking=True
)
svc.fit(train_df, features=features, label='TARGET')
```

### Naive Bayes

```python
from hana_ml.algorithms.pal.naive_bayes import NaiveBayes

nb = NaiveBayes(model_type='multinomial')  # 'gaussian', 'multinomial'
nb.fit(train_df, features=features, label='TARGET')
```

### K-Nearest Neighbors

```python
from hana_ml.algorithms.pal.neighbors import KNNClassifier

knn = KNNClassifier(
    n_neighbors=5,
    algorithm='brute-force',  # 'brute-force', 'kd-tree'
    metric='euclidean'  # 'euclidean', 'manhattan', 'minkowski', 'chebyshev'
)
knn.fit(train_df, features=features, label='TARGET')
```

### MLP Classifier

```python
from hana_ml.algorithms.pal.neural_network import MLPClassifier

mlp = MLPClassifier(
    hidden_layer_sizes=(100, 50),
    activation='relu',  # 'relu', 'tanh', 'sigmoid'
    output_activation='softmax',
    learning_rate=0.001,
    batch_size=32,
    max_iter=200
)
mlp.fit(train_df, features=features, label='TARGET')
```

### One-Class SVM (Anomaly Detection)

```python
from hana_ml.algorithms.pal.svm import OneClassSVM

ocsvm = OneClassSVM(kernel='rbf', nu=0.1, gamma='scale')
ocsvm.fit(train_df, features=features)
anomalies = ocsvm.predict(test_df, features=features)
```

---

## Regression Algorithms

### Linear Regression

```python
from hana_ml.algorithms.pal.linear_model import LinearRegression

lr = LinearRegression(
    solver='qr',  # 'qr', 'svd', 'cyclical', 'stochastic'
    enet_alpha=1.0,
    lamb=0.0,
    intercept=True
)
lr.fit(train_df, features=features, label='PRICE')
```

### Polynomial Regression

```python
from hana_ml.algorithms.pal.regression import PolynomialRegression

poly = PolynomialRegression(degree=2)
poly.fit(train_df, features=['X'], label='Y')
```

### Generalized Linear Model

```python
from hana_ml.algorithms.pal.linear_model import GLM

glm = GLM(
    family='gaussian',  # 'gaussian', 'poisson', 'binomial', 'gamma', 'inverse_gaussian', 'negative_binomial'
    link='identity',    # 'identity', 'log', 'logit', 'probit', 'inverse', 'sqrt'
    max_iter=100
)
glm.fit(train_df, features=features, label='Y')
```

### Support Vector Regression

```python
from hana_ml.algorithms.pal.svm import SVR

svr = SVR(kernel='rbf', c=1.0, gamma='scale', epsilon=0.1)
svr.fit(train_df, features=features, label='PRICE')
```

### Decision Tree Regressor

```python
from hana_ml.algorithms.pal.trees import DecisionTreeRegressor

dtr = DecisionTreeRegressor(
    algorithm='cart',
    max_depth=10,
    min_samples_leaf=1
)
dtr.fit(train_df, features=features, label='PRICE')
```

### Random Forest Regressor

```python
from hana_ml.algorithms.pal.trees import RDTRegressor

rdt = RDTRegressor(n_estimators=100, max_depth=10)
rdt.fit(train_df, features=features, label='PRICE')
```

### Hybrid Gradient Boosting Regressor

```python
from hana_ml.algorithms.pal.trees import HybridGradientBoostingRegressor

hgb = HybridGradientBoostingRegressor(
    n_estimators=100,
    max_depth=6,
    learning_rate=0.1
)
hgb.fit(train_df, features=features, label='PRICE')
```

### MLP Regressor

```python
from hana_ml.algorithms.pal.neural_network import MLPRegressor

mlp = MLPRegressor(
    hidden_layer_sizes=(100, 50),
    activation='relu',
    learning_rate=0.001,
    max_iter=200
)
mlp.fit(train_df, features=features, label='PRICE')
```

### Cox Proportional Hazard Model

```python
from hana_ml.algorithms.pal.regression import CoxProportionalHazardModel

cox = CoxProportionalHazardModel()
cox.fit(survival_df, features=features, label='TIME', event='EVENT')
```

---

## Clustering Algorithms

### KMeans

```python
from hana_ml.algorithms.pal.clustering import KMeans

kmeans = KMeans(
    n_clusters=5,
    init='first_k',  # 'first_k', 'replace', 'no_replace', 'patent'
    max_iter=100,
    tol=1e-4,
    distance_level='manhattan'  # 'manhattan', 'euclidean', 'minkowski', 'chebyshev'
)
kmeans.fit(data_df, features=['F1', 'F2', 'F3'])
labels = kmeans.labels_
centers = kmeans.cluster_centers_
```

### KMedoids

```python
from hana_ml.algorithms.pal.clustering import KMedoids

kmedoids = KMedoids(n_clusters=5, init='first_k', max_iter=100)
kmedoids.fit(data_df, features=features)
```

### DBSCAN

```python
from hana_ml.algorithms.pal.clustering import DBSCAN

dbscan = DBSCAN(
    eps=0.5,
    minpts=5,
    metric='euclidean'  # 'euclidean', 'manhattan', 'minkowski'
)
dbscan.fit(data_df, features=features)
labels = dbscan.labels_
```

### Agglomerative Hierarchical Clustering

```python
from hana_ml.algorithms.pal.clustering import AgglomerateHierarchicalClustering

ahc = AgglomerateHierarchicalClustering(
    n_clusters=5,
    affinity='euclidean',
    linkage='average'  # 'single', 'complete', 'average', 'ward', 'centroid', 'median'
)
ahc.fit(data_df, features=features)
```

### Spectral Clustering

```python
from hana_ml.algorithms.pal.clustering import SpectralClustering

spectral = SpectralClustering(
    n_clusters=5,
    gamma=1.0,
    n_components=None
)
spectral.fit(data_df, features=features)
```

### Gaussian Mixture

```python
from hana_ml.algorithms.pal.mixture import GaussianMixture

gmm = GaussianMixture(
    n_components=5,
    covariance_type='full',  # 'full', 'diag'
    max_iter=100
)
gmm.fit(data_df, features=features)
```

### Self-Organizing Maps (SOM)

```python
from hana_ml.algorithms.pal.clustering import SOM

som = SOM(
    x_dim=10,
    y_dim=10,
    learning_rate=0.5,
    max_iter=100
)
som.fit(data_df, features=features)
```

### GeometryDBSCAN (Spatial)

```python
from hana_ml.algorithms.pal.clustering import GeometryDBSCAN

geo_dbscan = GeometryDBSCAN(eps=0.5, minpts=5)
geo_dbscan.fit(spatial_df, key='ID', features=['LOCATION'])
```

---

## Time Series Algorithms

### ARIMA

```python
from hana_ml.algorithms.pal.tsa.arima import ARIMA

arima = ARIMA(
    order=(1, 1, 1),  # (p, d, q)
    seasonal_order=(1, 1, 1, 12),  # (P, D, Q, s)
    method='mle'
)
arima.fit(ts_df, endog='VALUE')
forecast = arima.predict(forecast_length=30)
```

### AutoARIMA

```python
from hana_ml.algorithms.pal.tsa.auto_arima import AutoARIMA

auto_arima = AutoARIMA(
    seasonal_period=12,
    max_p=5, max_d=2, max_q=5,
    max_P=2, max_D=1, max_Q=2
)
auto_arima.fit(ts_df, endog='VALUE')
forecast = auto_arima.predict(forecast_length=30)
```

### Exponential Smoothing

```python
from hana_ml.algorithms.pal.tsa.exponential_smoothing import (
    SingleExponentialSmoothing,
    DoubleExponentialSmoothing,
    TripleExponentialSmoothing,
    AutoExponentialSmoothing
)

# Simple smoothing
ses = SingleExponentialSmoothing(alpha=0.3)

# Double (Holt's)
des = DoubleExponentialSmoothing(alpha=0.3, beta=0.1)

# Triple (Holt-Winters)
tes = TripleExponentialSmoothing(
    alpha=0.3, beta=0.1, gamma=0.1,
    seasonal='multiplicative',
    seasonal_periods=12
)

# Automatic selection
auto_es = AutoExponentialSmoothing()
auto_es.fit(ts_df, endog='VALUE')
```

### LSTM

```python
from hana_ml.algorithms.pal.tsa.lstm import LSTM

lstm = LSTM(
    hidden_size=50,
    num_layers=2,
    learning_rate=0.001,
    max_iter=100,
    batch_size=32
)
lstm.fit(ts_df, endog='VALUE', exog=['FEATURE1', 'FEATURE2'])
forecast = lstm.predict(forecast_length=30, exog_pred=exog_future)
```

### BSTS (Bayesian Structural Time Series)

```python
from hana_ml.algorithms.pal.tsa.bsts import BSTS

bsts = BSTS(
    include_trend=True,
    include_seasonal=True,
    seasonal_period=12
)
bsts.fit(ts_df, endog='VALUE')
```

### Change Point Detection

```python
from hana_ml.algorithms.pal.tsa.changepoint import CPD, BCPD

# Standard CPD
cpd = CPD(max_change_points=5)
cpd.fit(ts_df, endog='VALUE')
change_points = cpd.change_points_

# Bayesian CPD
bcpd = BCPD(max_change_points=5)
bcpd.fit(ts_df, endog='VALUE')
```

---

## Preprocessing

### Feature Normalization

```python
from hana_ml.algorithms.pal.preprocessing import FeatureNormalizer

normalizer = FeatureNormalizer(
    method='min-max'  # 'min-max', 'z-score', 'decimal'
)
normalizer.fit(train_df, features=features)
normalized = normalizer.transform(train_df, features=features)
```

### Imputation

```python
from hana_ml.algorithms.pal.preprocessing import Imputer

imputer = Imputer(
    strategy='mean'  # 'mean', 'median', 'mode', 'delete'
)
imputer.fit(train_df, features=features)
imputed = imputer.transform(test_df, features=features)
```

### PCA

```python
from hana_ml.algorithms.pal.decomposition import PCA

pca = PCA(n_components=10)
pca.fit(train_df, features=features)
transformed = pca.transform(test_df, features=features)

# Variance explained
print(pca.explained_variance_ratio_)
```

### Feature Selection

```python
from hana_ml.algorithms.pal.preprocessing import FeatureSelection

fs = FeatureSelection(method='correlation')
fs.fit(train_df, features=features, label='TARGET')
selected_features = fs.selected_features_
importance = fs.importance_
```

### SMOTE (Oversampling)

```python
from hana_ml.algorithms.pal.preprocessing import SMOTE

smote = SMOTE(k_neighbors=5, sampling_strategy='auto')
balanced_df = smote.fit_resample(imbalanced_df, features=features, label='TARGET')
```

### Train-Test Split

```python
from hana_ml.algorithms.pal.partition import train_test_val_split

train, test, val = train_test_val_split(
    data=df,
    id_column='ID',
    training_percentage=0.7,
    testing_percentage=0.2,
    validation_percentage=0.1,
    random_seed=42
)
```

---

## Model Selection

### Grid Search

```python
from hana_ml.algorithms.pal.model_selection import GridSearchCV

param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [3, 5, 7],
    'learning_rate': [0.01, 0.1]
}

grid_search = GridSearchCV(
    estimator=HybridGradientBoostingClassifier(),
    param_grid=param_grid,
    cv=5,
    scoring='accuracy'
)
grid_search.fit(train_df, features=features, label='TARGET')

print(grid_search.best_params_)
print(grid_search.best_score_)
best_model = grid_search.best_estimator_
```

### Random Search

```python
from hana_ml.algorithms.pal.model_selection import RandomSearchCV

param_distributions = {
    'n_estimators': [50, 100, 150, 200],
    'max_depth': [3, 4, 5, 6, 7, 8],
    'learning_rate': [0.01, 0.05, 0.1, 0.15, 0.2]
}

random_search = RandomSearchCV(
    estimator=HybridGradientBoostingClassifier(),
    param_distributions=param_distributions,
    n_iter=20,
    cv=5
)
random_search.fit(train_df, features=features, label='TARGET')
```

### Pipeline

```python
from hana_ml.algorithms.pal.pipeline import Pipeline

pipeline = Pipeline([
    ('imputer', Imputer(strategy='mean')),
    ('normalizer', FeatureNormalizer(method='z-score')),
    ('pca', PCA(n_components=10)),
    ('classifier', HybridGradientBoostingClassifier())
])

pipeline.fit(train_df, features=features, label='TARGET')
predictions = pipeline.predict(test_df, features=features)
```

---

## Model Evaluation

### Classification Metrics

```python
from hana_ml.algorithms.pal.metrics import (
    accuracy_score,
    auc,
    confusion_matrix,
    multiclass_auc
)

accuracy = accuracy_score(y_true, y_pred)
auc_score = auc(y_true, y_proba)
cm = confusion_matrix(y_true, y_pred)
```

### Regression Metrics

```python
from hana_ml.algorithms.pal.metrics import r2_score

r2 = r2_score(y_true, y_pred)
```

---

## Association Rules

### Apriori

```python
from hana_ml.algorithms.pal.association import Apriori

apriori = Apriori(
    min_support=0.01,
    min_confidence=0.5,
    min_lift=1.0,
    max_consequent=1,
    max_item_length=5
)
apriori.fit(transaction_df, transaction='TRANS_ID', item='ITEM')
rules = apriori.result_
```

### FP-Growth

```python
from hana_ml.algorithms.pal.association import FPGrowth

fpgrowth = FPGrowth(min_support=0.01, min_confidence=0.5)
fpgrowth.fit(transaction_df, transaction='TRANS_ID', item='ITEM')
```

---

## Recommender Systems

### ALS (Alternating Least Squares)

```python
from hana_ml.algorithms.pal.recommender import ALS

als = ALS(
    n_factors=50,
    max_iter=20,
    regularization=0.1
)
als.fit(ratings_df, user='USER_ID', item='ITEM_ID', rating='RATING')
recommendations = als.recommend(user_id=1, n_items=10)
```

### Factorization Machines

```python
from hana_ml.algorithms.pal.recommender import FFMClassifier, FFMRegressor

ffm = FFMClassifier(
    n_factors=10,
    max_iter=100,
    learning_rate=0.1
)
ffm.fit(train_df, features=features, label='CLICK')
```

---

## Text Mining

### Latent Dirichlet Allocation

```python
from hana_ml.algorithms.pal.decomposition import LatentDirichletAllocation

lda = LatentDirichletAllocation(
    n_components=10,
    max_iter=100,
    doc_topic_prior=None,  # Alpha
    topic_word_prior=None  # Beta
)
lda.fit(text_df, features=['DOCUMENT'])
topics = lda.transform(text_df)
```

### CRF (Sequence Labeling)

```python
from hana_ml.algorithms.pal.text import CRF

crf = CRF()
crf.fit(sequence_df, features=['TOKEN'], label='TAG')
```

---

## Statistics

### Hypothesis Tests

```python
from hana_ml.algorithms.pal.stats import (
    ttest_1samp,
    ttest_ind,
    ttest_rel,
    f_oneway,
    chi2_contingency,
    pearsonr_matrix
)

# One-sample t-test
t_stat, p_value = ttest_1samp(data_df, column='VALUE', popmean=0)

# Two-sample t-test
t_stat, p_value = ttest_ind(group1_df, group2_df, column='VALUE')

# ANOVA
f_stat, p_value = f_oneway(data_df, groups='GROUP', values='VALUE')

# Correlation matrix
corr = pearsonr_matrix(data_df, columns=['F1', 'F2', 'F3'])
```

### Distribution Functions

```python
from hana_ml.algorithms.pal.stats import (
    bernoulli, beta, binomial, chi_squared,
    exponential, gamma, normal, poisson, uniform
)

# Generate random samples
samples = normal(conn, loc=0, scale=1, size=1000)
```

---

## Social Network Analysis

### PageRank

```python
from hana_ml.algorithms.pal.social_network import PageRank

pagerank = PageRank(damping=0.85, max_iter=100)
pagerank.fit(graph_df, source='FROM_NODE', target='TO_NODE')
ranks = pagerank.result_
```

### Link Prediction

```python
from hana_ml.algorithms.pal.social_network import LinkPrediction

lp = LinkPrediction(method='common_neighbors')
lp.fit(graph_df, source='FROM_NODE', target='TO_NODE')
predictions = lp.predict(test_pairs_df)
```
