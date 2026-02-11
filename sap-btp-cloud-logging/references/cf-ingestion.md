# SAP Cloud Logging - Cloud Foundry Ingestion Reference

**Source:** [https://github.com/SAP-docs/btp-cloud-logging/blob/main/docs/ingest-from-cloud-foundry-runtime-f5a7c99.md](https://github.com/SAP-docs/btp-cloud-logging/blob/main/docs/ingest-from-cloud-foundry-runtime-f5a7c99.md)
**Last Updated:** 2025-11-22

---

## Overview

Configure log shipping and resource metrics from SAP BTP Cloud Foundry applications. Even without specific application logs, automatically generated Cloud Foundry router request logs can be analyzed. Default dashboards, index patterns, and retention settings are provided.

**Alternative:** You can also use OpenTelemetry API Endpoint for more advanced telemetry. See `opentelemetry-ingestion.md`.

**Security Notice:** Review SAP BTP Security Recommendation **BTP-CLS-0002** before implementation.

---

## Index Patterns

| Data Type | Index Pattern |
|-----------|---------------|
| Application Logs | `logs-cfsyslog-*` |
| Resource Metrics | `metrics-otel-v1-*` |

---

## Ingestion Methods

### Method 1: Direct Service Binding

The simplest approach - bind your application directly to the Cloud Logging instance.

```bash
# Bind application to Cloud Logging
cf bind-service <app-name> <service-instance>

# The binding takes effect WITHOUT restaging
# (despite the CLI prompt suggesting restaging)
```

**Note:** Although the CLI prompts to restage the app, the binding takes effect without restaging.

---

### Method 2: Share Service Instance Across Spaces

Distribute a single service instance across multiple CF spaces.

```bash
# Share instance with another space
cf share-service <service-instance> -s <other-space>

# Then bind applications in that space
cf target -s <other-space>
cf bind-service <app-name> <service-instance>
```

---

### Method 3: User-Provided Service

Use when you need to configure ingestion with specific credentials or when using mTLS.

#### Step 1: Extract Credentials from Service Key

```bash
# Create service key
cf create-service-key <service-instance> <key-name>

# View service key
cf service-key <service-instance> <key-name>
```

Required credentials:
- `ingest-endpoint`
- `ingest-username` (for Basic Auth)
- `ingest-password` (for Basic Auth)
- `ingest-mtls-endpoint` (for mTLS)
- `ingest-mtls-cert` (for mTLS)
- `ingest-mtls-key` (for mTLS)

#### Step 2: Create User-Provided Service

**Option A: Basic Authentication**

```bash
# Drain URL format with all parameters
cf cups <ups-name> -l "https-batch://<ingest-username>:<ingest-password>@<ingest-endpoint>/cfsyslog?drain-type=all"
```

**Note:** The `drain-type=all` parameter ensures both logs and metrics are shipped.

**Option B: Mutual TLS (mTLS) - Recommended**

First, save certificate and key to files:
```bash
# Extract certificate (replace with actual value from service key)
echo "<ingest-mtls-cert>" > client.crt

# Extract private key (replace with actual value from service key)
echo "<ingest-mtls-key>" > client.key
```

Create user-provided service:
```bash
cf cups <ups-name> -l "[https://<ingest-mtls-endpoint>"](https://<ingest-mtls-endpoint>") \
  -p '{"cert": "<contents-of-client.crt>", "key": "<contents-of-client.key>"}'
```

#### Step 3: Bind Application

```bash
cf bind-service <app-name> <ups-name>
```

---

## Logging Libraries

SAP provides open-source logging libraries for structured Cloud Foundry logging.

### Java Applications: cf-java-logging-support

**Maven Dependency:**
```xml
<dependency>
  <groupId>com.sap.hcp.cf.logging</groupId>
  <artifactId>cf-java-logging-support-logback</artifactId>
  <version>LATEST</version>
</dependency>
```

**GitHub:** [https://github.com/SAP/cf-java-logging-support](https://github.com/SAP/cf-java-logging-support)

### Node.js Applications: cf-nodejs-logging-support

```bash
npm install cf-nodejs-logging-support
```

```javascript
const log = require('cf-nodejs-logging-support');
log.setLoggingLevel('info');

// Express middleware
app.use(log.logNetwork);

// Log messages
log.info('Application started');
```

**GitHub:** [https://github.com/SAP/cf-nodejs-logging-support](https://github.com/SAP/cf-nodejs-logging-support)

### Alternative: @sap/logging

```bash
npm install @sap/logging
```

```javascript
const logging = require('@sap/logging');
const appContext = logging.createAppContext();
const logger = appContext.createLogContext().getLogger('/my/path');

logger.info('Application started');
```

---

## Security Considerations

### Security Recommendation BTP-CLS-0002

**Important:** Deleting service keys does not automatically invalidate credentials. There is no automated mechanism to track which credentials are actively in use.

**Best Practices:**
1. Rotate service keys regularly
2. Document which keys are in use
3. Consider root CA rotation if credentials may be compromised
4. Use mTLS instead of Basic Auth when possible

---

## Troubleshooting

### Logs Not Appearing

1. **Check binding:** `cf services` should show bound status
2. **Verify application is generating logs:** Check `cf logs <app-name> --recent`
3. **Wait for propagation:** New bindings may take a few minutes
4. **Check index pattern:** Use `logs-cfsyslog-*` in Dashboards

### Resource Metrics Missing

1. Ensure application is actively running
2. Check `metrics-otel-v1-*` index pattern
3. Verify Cloud Foundry Diego cell is reporting metrics

### Service Key Credential Issues

1. Create new service key
2. Compare credentials with current configuration
3. Update user-provided service if needed

---

## Documentation Links

- **Source:** [https://raw.githubusercontent.com/SAP-docs/btp-cloud-logging/main/docs/ingest-from-cloud-foundry-runtime-f5a7c99.md](https://raw.githubusercontent.com/SAP-docs/btp-cloud-logging/main/docs/ingest-from-cloud-foundry-runtime-f5a7c99.md)
- **CF Logging Libraries:** [https://help.sap.com/docs/btp/sap-business-technology-platform/application-logging](https://help.sap.com/docs/btp/sap-business-technology-platform/application-logging)
- **Security Recommendations:** [https://help.sap.com/docs/btp/sap-btp-security-recommendations-c8a9bb59fe624f0981efa0eff2497d7d/sap-btp-security-recommendations](https://help.sap.com/docs/btp/sap-btp-security-recommendations-c8a9bb59fe624f0981efa0eff2497d7d/sap-btp-security-recommendations)
