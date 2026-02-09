# LangChain Integration Guide

Guide for using SAP Cloud SDK for AI with LangChain framework.

## Table of Contents
1. [Overview](#overview)
2. [Installation](#installation)
3. [Available Clients](#available-clients)
4. [OrchestrationClient](#orchestrationclient)
5. [AzureOpenAiChatClient](#azureopenaichatclient)
6. [AzureOpenAiEmbeddingClient](#azureopenaiembeddingclient)
7. [Streaming](#streaming)
8. [Tool Binding](#tool-binding)
9. [Structured Output](#structured-output)
10. [LangGraph Agents](#langgraph-agents)
11. [Resilience Configuration](#resilience-configuration)

---

## Overview

The `@sap-ai-sdk/langchain` package provides LangChain-compatible clients built on SAP Cloud SDK for AI foundation models and orchestration clients.

**Important**: Use the same `@langchain/core` version as the `@sap-ai-sdk/langchain` package. Check the package.json for the correct version.

---

## Installation

```bash
npm install @sap-ai-sdk/langchain @langchain/core langchain
```

For agents with LangGraph:
```bash
npm install @sap-ai-sdk/langchain @langchain/core @langchain/langgraph langchain zod
```

---

## Available Clients

| Client | Purpose | Package |
|--------|---------|---------|
| `OrchestrationClient` | Orchestration service with LangChain | @sap-ai-sdk/langchain |
| `AzureOpenAiChatClient` | OpenAI chat via LangChain | @sap-ai-sdk/langchain |
| `AzureOpenAiEmbeddingClient` | OpenAI embeddings via LangChain | @sap-ai-sdk/langchain |

---

## OrchestrationClient

### Basic Usage

```typescript
import { OrchestrationClient } from '@sap-ai-sdk/langchain';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

const config = {
  promptTemplating: {
    model: { name: 'gpt-4o' }
  }
};

const client = new OrchestrationClient(config);

// Simple invocation
const response = await client.invoke([
  new HumanMessage('What is SAP CAP?')
]);

console.log(response.content);
```

### With Placeholder Values

```typescript
const config = {
  promptTemplating: {
    model: { name: 'gpt-4o' },
    prompt: [
      { role: 'system', content: 'You are an expert in {{?domain}}' },
      { role: 'user', content: '{{?question}}' }
    ]
  }
};

const client = new OrchestrationClient(config);

const response = await client.invoke([], {
  placeholderValues: {
    domain: 'SAP development',
    question: 'What is CDS?'
  }
});
```

### With Content Filtering

```typescript
import { buildAzureContentSafetyFilter } from '@sap-ai-sdk/orchestration';

const config = {
  promptTemplating: { model: { name: 'gpt-4o' } },
  filtering: {
    input: buildAzureContentSafetyFilter({ Hate: 'ALLOW_SAFE' }),
    output: buildAzureContentSafetyFilter({ Violence: 'ALLOW_SAFE' })
  }
};

const client = new OrchestrationClient(config);
```

### With Data Masking

```typescript
const config = {
  promptTemplating: { model: { name: 'gpt-4o' } },
  masking: {
    masking_providers: [{
      type: 'sap_data_privacy_integration',
      method: 'anonymization',
      entities: [
        { type: 'profile-email' },
        { type: 'profile-person' }
      ]
    }]
  }
};

const client = new OrchestrationClient(config);
```

---

## AzureOpenAiChatClient

### Basic Usage

```typescript
import { AzureOpenAiChatClient } from '@sap-ai-sdk/langchain';
import { HumanMessage } from '@langchain/core/messages';

const client = new AzureOpenAiChatClient({ modelName: 'gpt-4o' });

const response = await client.invoke([
  new HumanMessage('What is SAP CAP?')
]);

console.log(response.content);
```

### With Model Parameters

```typescript
const client = new AzureOpenAiChatClient({
  modelName: 'gpt-4o',
  modelVersion: 'latest',
  temperature: 0.7,
  maxTokens: 1000
});
```

### With Chains

```typescript
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const client = new AzureOpenAiChatClient({ modelName: 'gpt-4o' });

const prompt = ChatPromptTemplate.fromMessages([
  ['system', 'You are a helpful SAP expert'],
  ['human', '{question}']
]);

const chain = prompt.pipe(client).pipe(new StringOutputParser());

const result = await chain.invoke({
  question: 'What is SAP CAP?'
});
```

---

## AzureOpenAiEmbeddingClient

### Basic Usage

```typescript
import { AzureOpenAiEmbeddingClient } from '@sap-ai-sdk/langchain';

const client = new AzureOpenAiEmbeddingClient({
  modelName: 'text-embedding-3-small'
});

// Single embedding
const embedding = await client.embedQuery('What is SAP?');
console.log(embedding.length); // Vector dimension

// Multiple embeddings
const embeddings = await client.embedDocuments([
  'SAP is an enterprise software company',
  'CAP is a framework for building business applications'
]);
```

### For RAG with Vector Stores

```typescript
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200
});

const docs = await splitter.createDocuments([documentText]);

const embeddings = new AzureOpenAiEmbeddingClient({
  modelName: 'text-embedding-3-large'
});

// Use with your vector store
// const vectorStore = await HanaVectorStore.fromDocuments(docs, embeddings);
```

---

## Streaming

### OrchestrationClient Streaming

```typescript
const client = new OrchestrationClient({
  promptTemplating: { model: { name: 'gpt-4o' } }
});

const stream = await client.stream([
  new HumanMessage('Explain SAP CAP in detail')
]);

for await (const chunk of stream) {
  process.stdout.write(chunk.content);
}

// Note: Orchestration currently doesn't support multiple choices during streaming
```

### AzureOpenAiChatClient Streaming

```typescript
const client = new AzureOpenAiChatClient({ modelName: 'gpt-4o' });

const stream = await client.stream([
  new HumanMessage('Explain SAP CAP')
]);

for await (const chunk of stream) {
  process.stdout.write(chunk.content);
}

// Get finish reason and usage after streaming
console.log('\nFinish reason:', stream.getFinishReason());
console.log('Token usage:', stream.getTokenUsage());
```

### Abort Streaming

```typescript
const controller = new AbortController();

const stream = await client.stream(
  [new HumanMessage('Long explanation...')],
  { signal: controller.signal }
);

// Cancel after 5 seconds
setTimeout(() => controller.abort(), 5000);

try {
  for await (const chunk of stream) {
    process.stdout.write(chunk.content);
  }
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Stream cancelled');
  }
}
```

---

## Tool Binding

### Define and Bind Tools

```typescript
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

const weatherTool = tool(
  async ({ city }) => {
    // Implement weather lookup
    return `Weather in ${city}: 20°C, sunny`;
  },
  {
    name: 'get_weather',
    description: 'Get current weather for a city',
    schema: z.object({
      city: z.string().describe('City name')
    })
  }
);

const client = new AzureOpenAiChatClient({ modelName: 'gpt-4o' });
const clientWithTools = client.bindTools([weatherTool]);

const response = await clientWithTools.invoke([
  new HumanMessage('What is the weather in Berlin?')
]);
```

### Process Tool Calls

```typescript
import { ToolMessage } from '@langchain/core/messages';

const response = await clientWithTools.invoke([
  new HumanMessage('What is the weather in Berlin?')
]);

if (response.tool_calls?.length) {
  const toolResults = [];

  for (const call of response.tool_calls) {
    const result = await weatherTool.invoke(call.args);
    toolResults.push(
      new ToolMessage({
        tool_call_id: call.id,
        content: result
      })
    );
  }

  // Continue conversation with tool results
  const finalResponse = await clientWithTools.invoke([
    new HumanMessage('What is the weather in Berlin?'),
    response,
    ...toolResults
  ]);
}
```

---

## Structured Output

### With Zod Schema

```typescript
import { z } from 'zod';

const WeatherSchema = z.object({
  city: z.string().describe('City name'),
  temperature: z.number().describe('Temperature in Celsius'),
  conditions: z.string().describe('Weather conditions')
});

const client = new AzureOpenAiChatClient({ modelName: 'gpt-4o' });
const structuredClient = client.withStructuredOutput(WeatherSchema);

const result = await structuredClient.invoke([
  new HumanMessage('What is the weather in Berlin?')
]);

// result is typed as { city: string, temperature: number, conditions: string }
console.log(result.city, result.temperature, result.conditions);
```

### With Strict Mode

```typescript
const structuredClient = client.withStructuredOutput(WeatherSchema, {
  strict: true // Enforce exact schema compliance
});
```

---

## LangGraph Agents

### Travel Assistant Agent Example

```typescript
import { OrchestrationClient } from '@sap-ai-sdk/langchain';
import { StateGraph, START, END, MemorySaver } from '@langchain/langgraph';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { ToolNode } from '@langchain/langgraph/prebuilt';

// Define tools
const getWeather = tool(
  async ({ city }) => {
    const response = await fetch(
      `[https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true`](https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true`)
    );
    const data = await response.json();
    return JSON.stringify(data.current_weather);
  },
  {
    name: 'get_weather',
    description: 'Get current weather for a city',
    schema: z.object({ city: z.string() })
  }
);

const getRestaurants = tool(
  async ({ city }) => {
    return JSON.stringify([
      { name: 'Restaurant A', cuisine: 'French' },
      { name: 'Restaurant B', cuisine: 'Italian' }
    ]);
  },
  {
    name: 'get_restaurants',
    description: 'Get restaurant recommendations',
    schema: z.object({ city: z.string() })
  }
);

// Build tools and client
const tools = [getWeather, getRestaurants];
const toolNode = new ToolNode(tools);

const client = new OrchestrationClient({
  promptTemplating: { model: { name: 'gpt-4o' } }
});
const boundClient = client.bindTools(tools);

// Define state and graph
const graph = new StateGraph({
  channels: {
    messages: { value: (x, y) => x.concat(y), default: () => [] }
  }
})
  .addNode('agent', async (state) => {
    const response = await boundClient.invoke(state.messages);
    return { messages: [response] };
  })
  .addNode('tools', toolNode)
  .addEdge(START, 'agent')
  .addConditionalEdges('agent', (state) => {
    const lastMessage = state.messages[state.messages.length - 1];
    return lastMessage.tool_calls?.length ? 'tools' : END;
  })
  .addEdge('tools', 'agent');

const app = graph.compile({ checkpointer: new MemorySaver() });

// Run agent
const result = await app.invoke({
  messages: [new HumanMessage('Plan a day trip to Paris with restaurants')]
});
```

---

## Resilience Configuration

### Retries

```typescript
const client = new AzureOpenAiChatClient({
  modelName: 'gpt-4o',
  maxRetries: 3 // Default is 6
});
```

### Timeout

```typescript
const response = await client.invoke(
  [new HumanMessage('Query')],
  { timeout: 30000 } // 30 seconds
);
```

### Combined

```typescript
const client = new OrchestrationClient(config, {
  maxRetries: 3
});

const response = await client.invoke(messages, {
  timeout: 60000,
  signal: controller.signal
});
```

**Note**: Content filtering errors throw immediately without retry.

---

## Documentation Links

- LangChain SDK: [https://github.com/SAP/ai-sdk/tree/main/docs-js/langchain](https://github.com/SAP/ai-sdk/tree/main/docs-js/langchain)
- LangGraph Tutorial: [https://github.com/SAP/ai-sdk/blob/main/docs-js/tutorials/getting-started-with-agents.mdx](https://github.com/SAP/ai-sdk/blob/main/docs-js/tutorials/getting-started-with-agents.mdx)
