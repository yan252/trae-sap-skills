# SAP Cloud Logging - Configuration Parameters Reference

**Source:** [https://github.com/SAP-docs/btp-cloud-logging/blob/main/docs/configuration-parameters-1830bca.md](https://github.com/SAP-docs/btp-cloud-logging/blob/main/docs/configuration-parameters-1830bca.md)
**Last Updated:** 2025-11-22

---

## Overview

SAP Cloud Logging supports configuration parameters for create and update service operations. Some settings impact pricing - check the Discovery Center and SAP Cloud Logging Capacity Unit Estimator for details.

---

## Parameter Reference

### backend

Configures the OpenSearch backend infrastructure.

| Property | Type | Range | Default | Description |
|----------|------|-------|---------|-------------|
| `max_data_nodes` | int | 2-10 | 10 | Maximum number of data nodes (sets max disk size indirectly) |
| `api_enabled` | bool | - | false | Enable OpenSearch API access |

**Note:** The `max_data_nodes` setting has **no effect on the dev plan**.

**Example:**
```json
{
  "backend": {
    "max_data_nodes": 10,
    "api_enabled": false
  }
}
```

---

### dashboards

Controls the OpenSearch Dashboards UI.

| Property | Type | Max Length | Default | Description |
|----------|------|------------|---------|-------------|
| `custom_label` | string | 20 chars (12 ideal) | - | Label displayed in OpenSearch Dashboards top bar |

**Allowed Characters:** `A-Z`, `a-z`, `0-9`, `#`, `+`, `-`, `_`, `/`, `*`, `(`, `)`, and space

**Example:**
```json
{
  "dashboards": {
    "custom_label": "PROD-CLS"
  }
}
```

---

### ingest

Manages the ingest endpoint autoscaling behavior. Auto-scales when CPU utilization exceeds 80%.

| Property | Type | Range | Default | Description |
|----------|------|-------|---------|-------------|
| `max_instances` | int | 2-10 | 10 | Maximum ingest instances |
| `min_instances` | int | 2-10 | 2 | Minimum ingest instances (must be ≤ max_instances) |

**Example:**
```json
{
  "ingest": {
    "max_instances": 10,
    "min_instances": 2
  }
}
```

---

### ingest_otlp

Enables data ingestion via OpenTelemetry Protocol (OTLP).

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enabled` | bool | false | Enable OTLP gRPC endpoint |

**Example:**
```json
{
  "ingest_otlp": {
    "enabled": true
  }
}
```

**Important:** When enabled, new service bindings include OTLP-specific credentials:
- `ingest-otlp-endpoint`
- `ingest-otlp-cert`
- `ingest-otlp-key`
- `server-ca`

---

### feature_flags

Array for enabling experimental features.

| Feature Flag | Description | Reversible |
|--------------|-------------|------------|
| `upgradeToOpenSearchV2` | Upgrade to OpenSearch 2.19 | **No** |

**Example:**
```json
{
  "feature_flags": ["upgradeToOpenSearchV2"]
}
```

**Warning:** The `upgradeToOpenSearchV2` flag triggers a non-reversible upgrade. Test thoroughly in non-production first.

---

### retention_period

Specifies how long ingested data is retained.

| Property | Type | Range | Default | Unit |
|----------|------|-------|---------|------|
| `retention_period` | int | 1-90 | 7 | days |

**Example:**
```json
{
  "retention_period": 14
}
```

**Note:** Automatic size-based removal takes priority when storage capacity is limited, regardless of retention setting.

---

### rotate_root_ca

Controls ingestion root CA certificate rotation.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `rotate_root_ca` | bool | false | Trigger CA rotation |

**Warning:** Updates may invalidate existing bindings. Follow the 3-step rotation process:
1. Set `true` to create new CA
2. Rebind all applications
3. Set `false` to delete old CA

**Example:**
```json
{
  "rotate_root_ca": true
}
```

---

### saml

Configures SAML 2.0 authentication for OpenSearch Dashboards.

**Security Notice:** Review SAP BTP Security Recommendation **BTP-CLS-0001** before configuring SAML.

#### Required Properties (when `enabled: true`)

| Property | Type | Conditional | Description |
|----------|------|-------------|-------------|
| `enabled` | bool | Yes | Enable SAML authentication |
| `admin_group` | string | Required if enabled | Group mapped to `all_access` role |
| `initiated` | bool | Required if enabled | Enable IdP-initiated SSO |
| `roles_key` | string | Required if enabled | Attribute name for backend_roles during login |
| `idp.metadata_url` | string | Required if enabled | SAML IdP metadata URL |
| `idp.entity_id` | string | Required if enabled | Entity ID from metadata's `entityID` field |
| `sp.entity_id` | string | Required if enabled | Service provider application name in IdP |

#### Optional Properties (for request signing)

| Property | Type | Description |
|----------|------|-------------|
| `sp.signature_private_key` | string | Base64-encoded PKCS#8 private key |
| `sp.signature_private_key_password` | string | Password for encrypted private key |

**Example (Official SAP Structure):**
```json
{
  "saml": {
    "enabled": true,
    "initiated": true,
    "admin_group": "CLS-Admins",
    "roles_key": "groups",
    "idp": {
      "metadata_url": "[https://mytenant.accounts.ondemand.com/saml2/metadata",](https://mytenant.accounts.ondemand.com/saml2/metadata",)
      "entity_id": "[https://mytenant.accounts.ondemand.com"](https://mytenant.accounts.ondemand.com")
    },
    "sp": {
      "entity_id": "cloud-logging-abc123",
      "signature_private_key": "<base64-encoded-pkcs8-key>",
      "signature_private_key_password": ""
    }
  }
}
```

---

## Complete Configuration Template

### Standard/Large Plan Production Setup

```json
{
  "retention_period": 14,
  "feature_flags": ["upgradeToOpenSearchV2"],
  "dashboards": {
    "custom_label": "PROD-CLS"
  },
  "backend": {
    "max_data_nodes": 10,
    "api_enabled": false
  },
  "ingest": {
    "max_instances": 10,
    "min_instances": 2
  },
  "ingest_otlp": {
    "enabled": true
  },
  "saml": {
    "enabled": true,
    "initiated": true,
    "admin_group": "CLS-Administrators",
    "roles_key": "groups",
    "idp": {
      "metadata_url": "[https://<tenant>.accounts.ondemand.com/saml2/metadata",](https://<tenant>.accounts.ondemand.com/saml2/metadata",)
      "entity_id": "[https://<tenant>.accounts.ondemand.com"](https://<tenant>.accounts.ondemand.com")
    },
    "sp": {
      "entity_id": "cloud-logging-<unique-id>",
      "signature_private_key": "<base64-encoded-pkcs8-key>",
      "signature_private_key_password": ""
    }
  }
}
```

### Development/Evaluation Setup

```json
{
  "retention_period": 7
}
```

**Note:** The dev plan ignores `backend.max_data_nodes` and does not support auto-scaling.

---

## Documentation Links

- **Source:** [https://raw.githubusercontent.com/SAP-docs/btp-cloud-logging/main/docs/configuration-parameters-1830bca.md](https://raw.githubusercontent.com/SAP-docs/btp-cloud-logging/main/docs/configuration-parameters-1830bca.md)
- **SAP Help Portal:** [https://help.sap.com/docs/cloud-logging](https://help.sap.com/docs/cloud-logging)
- **Discovery Center (Pricing):** [https://discovery-center.cloud.sap/serviceCatalog/cloud-logging](https://discovery-center.cloud.sap/serviceCatalog/cloud-logging)
