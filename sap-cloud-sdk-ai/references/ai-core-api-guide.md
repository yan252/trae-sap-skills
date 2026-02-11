# AI Core API Guide

Guide for managing SAP AI Core resources using SAP Cloud SDK for AI.

## Table of Contents
1. [Overview](#overview)
2. [Installation](#installation)
3. [AI API Package](#ai-api-package)
4. [Document Grounding](#document-grounding)
5. [Prompt Registry](#prompt-registry)
6. [Deployment Management](#deployment-management)
7. [Custom Destinations](#custom-destinations)

---

## Overview

The AI Core APIs provide programmatic access to manage:
- **Deployments**: Create, start, stop, delete model deployments
- **Artifacts**: Register datasets and models
- **Configurations**: Define execution parameters
- **Document Grounding**: Manage vector stores and pipelines
- **Prompt Registry**: Create and manage prompt templates

---

## Installation

### JavaScript/TypeScript

```bash
npm install @sap-ai-sdk/ai-api
npm install @sap-ai-sdk/document-grounding
npm install @sap-ai-sdk/prompt-registry
```

**Important**: Use tilde (`~`) version ranges instead of caret (`^`) as these packages contain generated code that may have breaking changes:

```json
{
  "dependencies": {
    "@sap-ai-sdk/ai-api": "~2.2.0",
    "@sap-ai-sdk/document-grounding": "~2.2.0",
    "@sap-ai-sdk/prompt-registry": "~2.2.0"
  }
}
```

### Java (Maven)

```xml
<dependency>
  <groupId>com.sap.ai.sdk</groupId>
  <artifactId>core</artifactId>
  <version>${ai-sdk.version}</version>
</dependency>
<dependency>
  <groupId>com.sap.ai.sdk</groupId>
  <artifactId>document-grounding</artifactId>
  <version>${ai-sdk.version}</version>
</dependency>
<dependency>
  <groupId>com.sap.ai.sdk</groupId>
  <artifactId>prompt-registry</artifactId>
  <version>${ai-sdk.version}</version>
</dependency>
```

---

## AI API Package

### Create Artifact

```typescript
import { ArtifactApi } from '@sap-ai-sdk/ai-api';

const artifact = await ArtifactApi.artifactCreate(
  {
    name: 'my-dataset',
    kind: 'dataset',
    url: 's3://bucket/path/to/data',
    scenarioId: 'my-scenario'
  },
  { 'AI-Resource-Group': 'default' }
).execute();

console.log('Artifact ID:', artifact.id);
```

### Create Configuration

```typescript
import { ConfigurationApi } from '@sap-ai-sdk/ai-api';

const config = await ConfigurationApi.configurationCreate(
  {
    name: 'my-config',
    executableId: 'my-executable',
    scenarioId: 'my-scenario',
    parameterBindings: [
      { key: 'learning_rate', value: '0.001' }
    ],
    inputArtifactBindings: [
      { key: 'training_data', artifactId: 'artifact-id' }
    ]
  },
  { 'AI-Resource-Group': 'default' }
).execute();
```

### Create Deployment

```typescript
import { DeploymentApi } from '@sap-ai-sdk/ai-api';

const deployment = await DeploymentApi.deploymentCreate(
  { configurationId: config.id },
  { 'AI-Resource-Group': 'default' }
).execute();

console.log('Deployment ID:', deployment.id);
console.log('Status:', deployment.status);
```

### Modify and Delete Deployment

```typescript
// Stop deployment (only RUNNING can be stopped)
await DeploymentApi.deploymentModify(
  deployment.id,
  { targetStatus: 'STOPPED' },
  { 'AI-Resource-Group': 'default' }
).execute();

// Delete deployment (only STOPPED or UNKNOWN can be deleted)
await DeploymentApi.deploymentDelete(
  deployment.id,
  { 'AI-Resource-Group': 'default' }
).execute();
```

### Query Deployments

```typescript
// Query deployments with filters
const deployments = await DeploymentApi.deploymentQuery(
  {
    status: 'RUNNING',
    scenarioId: 'orchestration'
  },
  { 'AI-Resource-Group': 'default' }
).execute();

for (const deployment of deployments.resources) {
  console.log(`ID: ${deployment.id}, Status: ${deployment.status}`);
}
```

### Resolve Deployment URL

```typescript
import { resolveDeploymentUrl } from '@sap-ai-sdk/ai-api';

const url = await resolveDeploymentUrl({
  scenarioId: 'orchestration',
  modelName: 'gpt-4o'
});

console.log('Deployment URL:', url);
```

---

## Document Grounding

### Prerequisites

Custom resource groups require the label `document-grounding: true`:

```typescript
// Via AI Launchpad UI or AI API
await ResourceGroupApi.resourceGroupModify(
  'my-resource-group',
  { labels: [{ key: 'document-grounding', value: 'true' }] }
).execute();
```

### Pipeline API

```typescript
import { PipelinesApi } from '@sap-ai-sdk/document-grounding';

// List pipelines
const pipelines = await PipelinesApi.listPipelines({
  'AI-Resource-Group': 'default'
}).execute();

// Create SharePoint pipeline
const pipeline = await PipelinesApi.createPipeline(
  {
    type: 'MSSharePoint',
    configuration: {
      siteUrl: '[https://company.sharepoint.com/sites/docs',](https://company.sharepoint.com/sites/docs',)
      clientId: 'client-id',
      clientSecret: 'client-secret',
      tenantId: 'tenant-id'
    }
  },
  { 'AI-Resource-Group': 'default' }
).execute();

// Get pipeline status
const status = await PipelinesApi.getPipelineStatus(
  pipeline.id,
  { 'AI-Resource-Group': 'default' }
).execute();
```

### Vector API

```typescript
import { VectorApi } from '@sap-ai-sdk/document-grounding';

// Create collection
const collection = await VectorApi.createCollection(
  {
    name: 'my-collection',
    embeddingModel: 'text-embedding-3-large'
  },
  { 'AI-Resource-Group': 'default' }
).execute();

// Add documents
await VectorApi.createDocuments(
  collection.id,
  {
    documents: [
      {
        chunks: [
          { content: 'SAP CAP is a framework...', metadata: { topic: 'cap' } },
          { content: 'Cloud Foundry provides...', metadata: { topic: 'cf' } }
        ]
      }
    ]
  },
  { 'AI-Resource-Group': 'default' }
).execute();

// Delete collection
await VectorApi.deleteCollectionById(
  collection.id,
  { 'AI-Resource-Group': 'default' }
).execute();
```

### Retrieval API

```typescript
import { RetrievalApi } from '@sap-ai-sdk/document-grounding';

// Search documents
const results = await RetrievalApi.search(
  {
    query: 'What is SAP CAP?',
    dataRepositories: [{ type: 'vector', id: collection.id }],
    maxChunks: 5
  },
  { 'AI-Resource-Group': 'default' }
).execute();

for (const chunk of results.chunks) {
  console.log('Content:', chunk.content);
  console.log('Score:', chunk.score);
}
```

### Java Document Grounding

```java
import com.sap.ai.sdk.documentgrounding.*;

// Create client
var pipelineClient = new PipelinesApi();
var vectorClient = new VectorApi();
var retrievalClient = new RetrievalApi();

// List pipelines
var pipelines = pipelineClient.listPipelines()
    .withHeader("AI-Resource-Group", "default")
    .execute();

// Search documents
var results = retrievalClient.search(
    SearchRequest.builder()
        .query("What is SAP CAP?")
        .dataRepositories(List.of(
            VectorRepository.create("collection-id")
        ))
        .maxChunks(5)
        .build()
).execute();
```

---

## Prompt Registry

### JavaScript

```typescript
import { PromptTemplatesApi } from '@sap-ai-sdk/prompt-registry';

// List templates
const templates = await PromptTemplatesApi.listPromptTemplates(
  { scenarioId: 'customer-support' },
  { 'AI-Resource-Group': 'default' }
).execute();

// Get template by ID
const template = await PromptTemplatesApi.getPromptTemplate(
  'template-id',
  { 'AI-Resource-Group': 'default' }
).execute();
```

### Java Prompt Registry

```java
import com.sap.ai.sdk.promptregistry.PromptClient;
import com.sap.ai.sdk.promptregistry.PromptTemplateSpec;

var promptClient = new PromptClient();

// Create template
var templateSpec = PromptTemplateSpec.builder()
    .name("greeting-template")
    .scenario("customer-support")
    .version("1.0.0")
    .template("Hello {{name}}, welcome to {{company}}!")
    .build();

promptClient.createOrUpdateTemplate(templateSpec);

// Retrieve template
var template = promptClient.getTemplate("template-id");

// Or by name/scenario/version
var template = promptClient.getTemplate("greeting-template", "customer-support", "1.0.0");

// List templates
var templates = promptClient.listTemplates("customer-support");

// Delete template (only imperatively managed)
promptClient.deleteTemplate("template-id", "1.0.0");

// List template edit history
var history = promptClient.listPromptTemplateHistory(
    "customer-support", // scenario
    "1.0.0",            // version
    "greeting-template" // name
);
```

### Import YAML Templates

```java
// Import declarative templates from YAML
promptClient.importTemplates(new File("templates.yaml"));
```

```yaml
# templates.yaml
templates:
  - name: support-greeting
    scenario: customer-support
    version: "1.0.0"
    template: |
      You are a helpful support agent for {{company}}.
      Greet the customer: {{customer_name}}
```

### Use with Orchestration

```typescript
// JavaScript - reference template in orchestration
const client = new OrchestrationClient({
  promptTemplating: {
    model: { name: 'gpt-4o' },
    prompt: {
      ref: {
        name: 'support-greeting',
        scenario: 'customer-support',
        version: '1.0.0'
      }
    }
  }
});

const response = await client.chatCompletion({
  placeholderValues: {
    company: 'SAP',
    customer_name: 'John'
  }
});
```

```java
// Java - reference template in orchestration
var prompt = new OrchestrationPrompt()
    .withTemplateRef("support-greeting", "customer-support", "1.0.0");

var result = client.chatCompletion(prompt, config);
```

### Spring AI Integration with Prompt Registry

```java
import com.sap.ai.sdk.orchestration.spring.SpringAiConverter;

// Get template and convert to Spring AI messages
var templateResponse = promptClient.parsePromptTemplateByNameVersion(
    "customer-support", "1.0.0", "support-greeting",
    "default",
    false, // includeHistory
    new PromptTemplateSubstitutionRequest()
        .inputParams(Map.of("company", "SAP", "customer_name", "John"))
);

// Convert to Spring AI message list
var messages = SpringAiConverter.promptTemplateToMessages(templateResponse);

// Use with Spring AI ChatClient
var chatClient = ChatClient.builder(chatModel).build();
var response = chatClient.prompt()
    .messages(messages)
    .call()
    .content();
```

---

## Deployment Management

### Java Deployment API

```java
import com.sap.ai.sdk.core.DeploymentApi;
import com.sap.ai.sdk.core.model.*;

var deploymentApi = new DeploymentApi();

// Create deployment
var deploymentRequest = new AiDeploymentCreationRequest()
    .configurationId("config-id");

var deployment = deploymentApi.create(
    "default", // resource group
    deploymentRequest
).execute();

System.out.println("Deployment ID: " + deployment.getId());
System.out.println("Status: " + deployment.getStatus());

// Check deployment status
var status = deploymentApi.get(
    "default",
    deployment.getId()
).execute();

// Stop deployment (only RUNNING deployments)
if (status.getStatus() == AiDeploymentStatus.RUNNING) {
    deploymentApi.modify(
        "default",
        deployment.getId(),
        new AiDeploymentModificationRequest()
            .targetStatus(AiDeploymentTargetStatus.STOPPED)
    ).execute();
}

// Delete deployment (only STOPPED or UNKNOWN)
if (status.getStatus() == AiDeploymentStatus.STOPPED ||
    status.getStatus() == AiDeploymentStatus.UNKNOWN) {
    deploymentApi.delete("default", deployment.getId()).execute();
}
```

---

## Custom Destinations

### JavaScript

```typescript
// Use custom destination
const artifact = await ArtifactApi.artifactCreate(
  { name: 'my-artifact', kind: 'dataset', url: 's3://bucket/data' },
  { 'AI-Resource-Group': 'default' }
).execute({
  destinationName: 'my-aicore-destination',
  useCache: false // disable destination caching
});
```

### Java

```java
import com.sap.cloud.sdk.cloudplatform.connectivity.DestinationAccessor;
import com.sap.ai.sdk.core.AiCoreService;

// Get destination
var destination = DestinationAccessor.getDestination("my-aicore-destination").asHttp();

// Use with AI Core service
var aiCoreService = new AiCoreService().withBaseDestination(destination);

// APIs will now use this destination
var deploymentApi = new DeploymentApi(aiCoreService);
```

---

## Documentation Links

- AI API JS: [https://github.com/SAP/ai-sdk/blob/main/docs-js/ai-core/ai-api.mdx](https://github.com/SAP/ai-sdk/blob/main/docs-js/ai-core/ai-api.mdx)
- Document Grounding JS: [https://github.com/SAP/ai-sdk/blob/main/docs-js/ai-core/document-grounding.mdx](https://github.com/SAP/ai-sdk/blob/main/docs-js/ai-core/document-grounding.mdx)
- Prompt Registry JS: [https://github.com/SAP/ai-sdk/blob/main/docs-js/ai-core/prompt-registry.mdx](https://github.com/SAP/ai-sdk/blob/main/docs-js/ai-core/prompt-registry.mdx)
- AI Core Deployment Java: [https://github.com/SAP/ai-sdk/blob/main/docs-java/ai-core/ai-core-deployment.mdx](https://github.com/SAP/ai-sdk/blob/main/docs-java/ai-core/ai-core-deployment.mdx)
- Document Grounding Java: [https://github.com/SAP/ai-sdk/blob/main/docs-java/ai-core/document-grounding.mdx](https://github.com/SAP/ai-sdk/blob/main/docs-java/ai-core/document-grounding.mdx)
- Prompt Registry Java: [https://github.com/SAP/ai-sdk/blob/main/docs-java/ai-core/prompt-registry.mdx](https://github.com/SAP/ai-sdk/blob/main/docs-java/ai-core/prompt-registry.mdx)
