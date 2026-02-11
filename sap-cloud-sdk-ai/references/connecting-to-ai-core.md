# Connecting to AI Core Guide

Complete guide for configuring connectivity to SAP AI Core.

## Table of Contents
1. [Overview](#overview)
2. [Service Binding (Default)](#service-binding-default)
3. [Environment Variable](#environment-variable)
4. [CAP Hybrid Mode](#cap-hybrid-mode)
5. [BTP Destination Service](#btp-destination-service)
6. [Custom Destination](#custom-destination)
7. [Resource Groups](#resource-groups)
8. [Troubleshooting](#troubleshooting)

---

## Overview

SAP Cloud SDK for AI uses the SAP Cloud SDK Destination concept for AI Core connectivity. The SDK automatically detects credentials in this order:

1. **Service Binding** - Bound AI Core service instance
2. **Environment Variable** - `AICORE_SERVICE_KEY`
3. **BTP Destination** - Named destination in BTP
4. **Custom Destination** - Programmatically provided

---

## Service Binding (Default)

### Cloud Foundry

Create and bind AI Core service instance:

```bash
# Create service instance
cf create-service aicore extended my-aicore-instance

# Bind to application
cf bind-service my-app my-aicore-instance

# Restage application
cf restage my-app
```

The SDK automatically reads credentials from `VCAP_SERVICES`:

```json
{
  "aicore": [{
    "credentials": {
      "clientid": "...",
      "clientsecret": "...",
      "url": "[https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com",](https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com",)
      "serviceurls": {
        "AI_API_URL": "[https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com/v2"](https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com/v2")
      }
    }
  }]
}
```

### Kubernetes/Kyma

Mount service binding as secret:

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  template:
    spec:
      containers:
        - name: my-app
          volumeMounts:
            - name: aicore-binding
              mountPath: /etc/secrets/sapcp/aicore/my-aicore-instance
              readOnly: true
      volumes:
        - name: aicore-binding
          secret:
            secretName: my-aicore-binding
```

---

## Environment Variable

Set `AICORE_SERVICE_KEY` with service credentials JSON.

### Get Credentials

1. Open SAP BTP Cockpit
2. Navigate to your subaccount > Service Instances
3. Click on your AI Core instance
4. Click "View Credentials" or create a service key
5. Copy the JSON credentials

### JavaScript - Using .env File

Create `.env` file:

```bash
AICORE_SERVICE_KEY='{"clientid":"sb-abc123","clientsecret":"secret123","url":"[https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com","serviceurls":{"AI_API_URL":"https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com/v2"}}'](https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com","serviceurls":{"AI_API_URL":"https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com/v2"}}')
```

Load in application:

```typescript
// Option 1: dotenv package
import 'dotenv/config';

// Option 2: Node.js built-in (v20.6+)
// Run with: node --env-file=.env app.js

// SDK will automatically use AICORE_SERVICE_KEY
import { OrchestrationClient } from '@sap-ai-sdk/orchestration';
const client = new OrchestrationClient({ /* config */ });
```

### Java - Environment Variable

Set environment variable:

```bash
# macOS/Linux
export AICORE_SERVICE_KEY='{"clientid":"...","clientsecret":"...","url":"..."}'

# Windows PowerShell
$env:AICORE_SERVICE_KEY='{"clientid":"...","clientsecret":"...","url":"..."}'
```

Or in `.env` file with Spring Boot:

```properties
# .env
AICORE_SERVICE_KEY={"clientid":"...","clientsecret":"...","url":"..."}
```

Run application:

```bash
# Spring Boot
mvn spring-boot:run

# Or with explicit env file
java -jar app.jar --spring.config.import=optional:file:.env
```

### IntelliJ Run Configuration

1. Edit Run Configuration
2. Under "Environment variables", add:
   - Name: `AICORE_SERVICE_KEY`
   - Value: `{"clientid":"...","clientsecret":"...",...}`

---

## CAP Hybrid Mode

Use CAP CLI to bind credentials for local development.

### JavaScript (CAP Node.js)

```bash
# Bind to AI Core instance
cds bind -2 my-aicore-instance

# Run in hybrid mode
cds-tsx watch --profile hybrid

# Or with npm
npm run watch:hybrid
```

Add to `package.json`:

```json
{
  "scripts": {
    "watch:hybrid": "cds-tsx watch --profile hybrid"
  }
}
```

### Java (CAP Java)

```bash
# Bind and run Maven
cds bind --to aicore --exec mvn spring-boot:run
```

Add to `pom.xml`:

```xml
<profiles>
  <profile>
    <id>hybrid</id>
    <properties>
      <spring.profiles.active>hybrid</spring.profiles.active>
    </properties>
  </profile>
</profiles>
```

---

## BTP Destination Service

Create a destination in SAP BTP for centralized credential management.

### Create Destination

1. Open SAP BTP Cockpit
2. Navigate to Connectivity > Destinations
3. Create new destination:

| Property | Value |
|----------|-------|
| Name | `my-aicore-destination` |
| Type | HTTP |
| URL | `<url from service key>` |
| Proxy Type | Internet |
| Authentication | OAuth2ClientCredentials |
| Client ID | `<clientid from service key>` |
| Client Secret | `<clientsecret from service key>` |
| Token Service URL | `<url>/oauth/token` |

### Use in JavaScript

```typescript
import { OrchestrationClient } from '@sap-ai-sdk/orchestration';

const client = new OrchestrationClient(
  { promptTemplating: { model: { name: 'gpt-4o' } } },
  { destinationName: 'my-aicore-destination' }
);
```

Disable caching if needed:

```typescript
const client = new OrchestrationClient(
  { /* config */ },
  {
    destinationName: 'my-aicore-destination',
    useCache: false // Refresh destination on each request
  }
);
```

### Use in Java

```java
import com.sap.cloud.sdk.cloudplatform.connectivity.DestinationAccessor;
import com.sap.ai.sdk.core.AiCoreService;

// Get destination
Destination destination = DestinationAccessor
    .getDestination("my-aicore-destination")
    .asHttp();

// Use with AI Core service
AiCoreService aiCoreService = new AiCoreService()
    .withBaseDestination(destination);

// Create client
var client = new OrchestrationClient(aiCoreService);
```

---

## Custom Destination

Build destinations programmatically for custom authentication flows.

### JavaScript

```typescript
import { registerDestination } from '@sap-cloud-sdk/connectivity';

// Register custom destination
registerDestination({
  name: 'custom-aicore',
  url: '[https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com',](https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com',)
  authentication: 'OAuth2ClientCredentials',
  clientId: 'my-client-id',
  clientSecret: 'my-client-secret',
  tokenServiceUrl: '[https://auth.ai.prod.eu-central-1.aws.ml.hana.ondemand.com/oauth/token'](https://auth.ai.prod.eu-central-1.aws.ml.hana.ondemand.com/oauth/token')
});

// Use registered destination
const client = new OrchestrationClient(
  { promptTemplating: { model: { name: 'gpt-4o' } } },
  { destinationName: 'custom-aicore' }
);
```

### Java - OAuth2DestinationBuilder

```java
import com.sap.cloud.sdk.cloudplatform.connectivity.OAuth2DestinationBuilder;
import com.sap.cloud.sdk.cloudplatform.connectivity.HttpDestination;

// Build custom destination
HttpDestination destination = OAuth2DestinationBuilder.forTargetUrl(
    "[https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com"](https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com")
)
    .withClient("my-client-id", "my-client-secret")
    .withTokenEndpoint("[https://auth.ai.../oauth/token](https://auth.ai.../oauth/token)")
    .build();

// Use with AI Core service
AiCoreService aiCoreService = new AiCoreService()
    .withBaseDestination(destination);
```

### Java - With Client Certificate

```java
HttpDestination destination = OAuth2DestinationBuilder.forTargetUrl(aiCoreUrl)
    .withCertificate(certificate, privateKey)
    .withTokenEndpoint(tokenUrl)
    .build();
```

---

## Resource Groups

### Default Resource Group

By default, the SDK uses the `default` resource group which has orchestration deployed.

### Custom Resource Group

```typescript
// JavaScript
const client = new OrchestrationClient(
  { promptTemplating: { model: { name: 'gpt-4o' } } },
  { resourceGroup: 'my-custom-group' }
);
```

```java
// Java
AiCoreService aiCoreService = new AiCoreService()
    .getInferenceDestination("my-custom-group");

var client = new OrchestrationClient(aiCoreService);
```

### Verify Deployment Exists

Ensure orchestration is deployed in your resource group:

```typescript
import { DeploymentApi } from '@sap-ai-sdk/ai-api';

const deployments = await DeploymentApi.deploymentQuery(
  { scenarioId: 'orchestration' },
  { 'AI-Resource-Group': 'my-custom-group' }
).execute();

if (deployments.count === 0) {
  console.error('No orchestration deployment found in resource group');
}
```

---

## Troubleshooting

### Error: "Could not find any matching service bindings for service identifier 'aicore'"

**Cause**: No AI Core service binding detected.

**Solutions**:
1. Bind AI Core service to your application (Cloud Foundry/Kyma)
2. Set `AICORE_SERVICE_KEY` environment variable
3. Configure BTP destination

### Error: "Orchestration deployment not found"

**Cause**: No orchestration deployment in the resource group.

**Solutions**:
1. Use `default` resource group (has orchestration by default)
2. Deploy orchestration in your custom resource group
3. Check deployment status in AI Launchpad

### Error: "401 Unauthorized"

**Cause**: Invalid or expired credentials.

**Solutions**:
1. Verify service key credentials are correct
2. Check token service URL includes `/oauth/token`
3. Ensure client ID and secret are from correct service instance
4. Regenerate service key if expired

### Error: "403 Forbidden"

**Cause**: Insufficient permissions or wrong service plan.

**Solutions**:
1. Verify service plan is `extended` or `sap-internal`
2. Check user has required roles
3. Ensure resource group access is granted

### Destination Caching

Destinations are cached by default. To refresh:

```typescript
// JavaScript
{ useCache: false }
```

```java
// Java - destinations refresh tokens automatically
// but you can force new destination lookup
DestinationAccessor.setLoader(new DefaultDestinationLoader());
```

### Debug Logging

Enable debug logging to troubleshoot connectivity:

```typescript
// JavaScript - set DEBUG environment variable
// DEBUG=sap-cloud-sdk:* node app.js
```

```java
// Java - application.properties
logging.level.com.sap.cloud.sdk=DEBUG
logging.level.com.sap.ai.sdk=DEBUG
```

---

## Documentation Links

- JS Connectivity: [https://github.com/SAP/ai-sdk/blob/main/docs-js/connecting-to-ai-core.mdx](https://github.com/SAP/ai-sdk/blob/main/docs-js/connecting-to-ai-core.mdx)
- Java Connectivity: [https://github.com/SAP/ai-sdk/blob/main/docs-java/connecting-to-ai-core.mdx](https://github.com/SAP/ai-sdk/blob/main/docs-java/connecting-to-ai-core.mdx)
- SAP Cloud SDK Destinations: [https://sap.github.io/cloud-sdk/docs/js/features/connectivity/destinations](https://sap.github.io/cloud-sdk/docs/js/features/connectivity/destinations)
