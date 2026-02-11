# SAP Cloud Logging - Kyma Runtime Ingestion Reference

**Source:** [https://github.com/SAP-docs/btp-cloud-logging/blob/main/docs/ingest-via-kyma-runtime-612c7b9.md](https://github.com/SAP-docs/btp-cloud-logging/blob/main/docs/ingest-via-kyma-runtime-612c7b9.md)
**Last Updated:** 2025-11-22

---

## Overview

Kyma's Telemetry module enables shipping observability signals (logs, metrics, traces) to SAP Cloud Logging instances. Each signal type can be configured independently.

---

## Prerequisites

1. **SAP BTP Kyma Runtime** with the following modules enabled:
   - `telemetry` module
   - `btp-operator` module

2. **Kubernetes CLI (kubectl)** version 1.23 or higher

3. **SAP Cloud Logging Instance** with OpenTelemetry API enabled (for distributed traces):
   ```json
   {
     "ingest_otlp": {
       "enabled": true
     }
   }
   ```

---

## Security Notice

**Review SAP BTP Security Recommendation BTP-CLS-0003** for Kyma runtime security configuration.

---

## Recommended Setup

Create the Cloud Logging instance using SAP BTP Service Operator for automatic Secret creation and rotation.

### Step 1: Create Namespace

```bash
kubectl create namespace sap-cloud-logging-integration
```

### Step 2: Deploy ServiceInstance

```yaml
# cls-instance.yaml
apiVersion: services.cloud.sap.com/v1
kind: ServiceInstance
metadata:
  name: cloud-logging-instance
  namespace: sap-cloud-logging-integration
spec:
  serviceOfferingName: cloud-logging
  servicePlanName: standard
  externalName: my-cls-instance
  parameters:
    retentionPeriod: 14
    ingest_otlp:
      enabled: true
```

```bash
kubectl apply -n sap-cloud-logging-integration -f cls-instance.yaml
```

### Step 3: Deploy ServiceBinding

```yaml
# cls-binding.yaml
apiVersion: services.cloud.sap.com/v1
kind: ServiceBinding
metadata:
  name: cls-binding
  namespace: sap-cloud-logging-integration
spec:
  serviceInstanceName: cloud-logging-instance
  secretName: sap-cloud-logging
```

```bash
kubectl apply -n sap-cloud-logging-integration -f cls-binding.yaml
```

### Step 4: Verify Deployment

```bash
# Check ServiceInstance status
kubectl get serviceinstance -n sap-cloud-logging-integration

# Check ServiceBinding status
kubectl get servicebinding -n sap-cloud-logging-integration

# Verify secret creation
kubectl get secret sap-cloud-logging -n sap-cloud-logging-integration
```

---

## Configure Telemetry Module

Follow Kyma documentation for shipping from Kyma to SAP Cloud Logging:

### LogPipeline Configuration

```yaml
apiVersion: telemetry.kyma-project.io/v1alpha1
kind: LogPipeline
metadata:
  name: cls-logs
spec:
  output:
    http:
      host:
        valueFrom:
          secretKeyRef:
            name: sap-cloud-logging
            namespace: sap-cloud-logging-integration
            key: ingest-endpoint
      tls:
        cert:
          valueFrom:
            secretKeyRef:
              name: sap-cloud-logging
              namespace: sap-cloud-logging-integration
              key: ingest-mtls-cert
        key:
          valueFrom:
            secretKeyRef:
              name: sap-cloud-logging
              namespace: sap-cloud-logging-integration
              key: ingest-mtls-key
```

### TracePipeline Configuration

```yaml
apiVersion: telemetry.kyma-project.io/v1alpha1
kind: TracePipeline
metadata:
  name: cls-traces
spec:
  output:
    otlp:
      endpoint:
        valueFrom:
          secretKeyRef:
            name: sap-cloud-logging
            namespace: sap-cloud-logging-integration
            key: ingest-otlp-endpoint
      tls:
        cert:
          valueFrom:
            secretKeyRef:
              name: sap-cloud-logging
              namespace: sap-cloud-logging-integration
              key: ingest-otlp-cert
        key:
          valueFrom:
            secretKeyRef:
              name: sap-cloud-logging
              namespace: sap-cloud-logging-integration
              key: ingest-otlp-key
```

---

## Index Patterns

| Data Type | Index Pattern |
|-----------|---------------|
| Istio Access Logs | `logs-json-istio-envoy-kyma*` |
| Application Logs | `logs-json-kyma*` |
| OTLP Logs | `logs-otel-v1-*` |
| OTLP Metrics | `metrics-otel-v1-*` |
| OTLP Traces | `otel-v1-apm-span-*` |

---

## Credential Sharing Across Clusters

If you need to share Cloud Logging credentials across multiple Kyma/Kubernetes clusters:

### Step 1: Extract Credentials

```bash
# Get all credentials from service binding secret
kubectl get secret sap-cloud-logging -n sap-cloud-logging-integration -o yaml
```

### Step 2: Create Secret in Target Cluster

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: sap-cloud-logging
  namespace: sap-cloud-logging-integration
type: Opaque
data:
  # Copy all keys from source secret
  ingest-endpoint: <base64-encoded>
  ingest-mtls-cert: <base64-encoded>
  ingest-mtls-key: <base64-encoded>
  ingest-otlp-endpoint: <base64-encoded>
  ingest-otlp-cert: <base64-encoded>
  ingest-otlp-key: <base64-encoded>
  server-ca: <base64-encoded>
```

**Important:** When sharing credentials:
- Credential rotation is your responsibility
- Rotate credentials more frequently than every 24 hours is not recommended
- Monitor certificate expiration dates

---

## Credential Rotation

When using BTP Service Operator, credential rotation can be automated:

```yaml
apiVersion: services.cloud.sap.com/v1
kind: ServiceBinding
metadata:
  name: cls-binding
  namespace: sap-cloud-logging-integration
spec:
  serviceInstanceName: cloud-logging-instance
  secretName: sap-cloud-logging
  credentialsRotationPolicy:
    enabled: true
    rotationFrequency: "720h"  # 30 days
```

---

## Troubleshooting

### Logs Not Appearing

1. Check LogPipeline status:
   ```bash
   kubectl get logpipeline cls-logs -o yaml
   ```

2. Verify Telemetry module is running:
   ```bash
   kubectl get pods -n kyma-system | grep telemetry
   ```

3. Check secret references are correct

### Traces Not Appearing

1. Ensure `ingest_otlp.enabled: true` in Cloud Logging instance
2. Check TracePipeline status
3. Verify application is instrumented for tracing

### Certificate Errors

1. Check certificate validity in secret
2. Verify `server-ca` is included if required
3. Consider rotating credentials

---

## Maintenance

### Parameter Updates

Modify YAML and reapply:
```bash
kubectl apply -n sap-cloud-logging-integration -f cls-instance.yaml
```

### Instance Limitation

**Important:** Instances created with SAP BTP Operator can only be managed from SAP BTP Operator. You cannot manage these instances via BTP Cockpit or CLI.

---

## Documentation Links

- **Source:** [https://raw.githubusercontent.com/SAP-docs/btp-cloud-logging/main/docs/ingest-via-kyma-runtime-612c7b9.md](https://raw.githubusercontent.com/SAP-docs/btp-cloud-logging/main/docs/ingest-via-kyma-runtime-612c7b9.md)
- **Kyma Telemetry Module:** [https://kyma-project.io/#/telemetry-manager/user/README](https://kyma-project.io/#/telemetry-manager/user/README)
- **BTP Service Operator:** [https://github.com/SAP/sap-btp-service-operator](https://github.com/SAP/sap-btp-service-operator)
- **Security Recommendations:** [https://help.sap.com/docs/btp/sap-btp-security-recommendations-c8a9bb59fe624f0981efa0eff2497d7d/sap-btp-security-recommendations](https://help.sap.com/docs/btp/sap-btp-security-recommendations-c8a9bb59fe624f0981efa0eff2497d7d/sap-btp-security-recommendations)
