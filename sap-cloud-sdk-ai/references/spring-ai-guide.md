# Spring AI Integration Guide

Guide for using SAP Cloud SDK for AI with Spring AI framework (Java).

## Table of Contents
1. [Overview](#overview)
2. [Dependencies](#dependencies)
3. [OpenAI Integration](#openai-integration)
4. [Orchestration Integration](#orchestration-integration)
5. [Embedding](#embedding)
6. [Streaming](#streaming)
7. [Tool Calling](#tool-calling)
8. [Chat Memory](#chat-memory)
9. [Response Format](#response-format)
10. [Prompt Registry](#prompt-registry)
11. [Data Protection](#data-protection)
12. [Content Filtering](#content-filtering)
13. [MCP Integration](#mcp-integration)

---

## Overview

SAP Cloud SDK for AI provides Spring AI integration through wrapper classes that bridge SAP's AI Core with Spring AI's ChatModel and EmbeddingModel interfaces.

**Requirements:**
- Spring AI 1.0.0+
- Spring Boot 3.0+
- SAP Cloud SDK for AI 1.10.0+

---

## Dependencies

### Maven Configuration

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.springframework.ai</groupId>
      <artifactId>spring-ai-bom</artifactId>
      <version>1.0.0</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>

<dependencies>
  <!-- Spring AI Core -->
  <dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-commons</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-model</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-client-chat</artifactId>
  </dependency>

  <!-- SAP SDK - Choose one or both -->
  <dependency>
    <groupId>com.sap.ai.sdk.foundationmodels</groupId>
    <artifactId>openai</artifactId>
    <version>${ai-sdk.version}</version>
  </dependency>
  <dependency>
    <groupId>com.sap.ai.sdk</groupId>
    <artifactId>orchestration</artifactId>
    <version>${ai-sdk.version}</version>
  </dependency>
</dependencies>
```

---

## OpenAI Integration

### Chat Completion

```java
import com.sap.ai.sdk.foundationmodels.openai.OpenAiClient;
import com.sap.ai.sdk.foundationmodels.openai.OpenAiModel;
import com.sap.ai.sdk.foundationmodels.openai.spring.OpenAiChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.model.ChatResponse;

// Initialize client
var openAiClient = OpenAiClient.forModel(OpenAiModel.GPT_4O);
var chatModel = new OpenAiChatModel(openAiClient);

// Chat completion
var prompt = new Prompt("What is SAP CAP?");
ChatResponse response = chatModel.call(prompt);

System.out.println(response.getResult().getOutput().getContent());
```

### With Spring Bean

```java
@Configuration
public class AiConfig {
    @Bean
    public ChatModel chatModel() {
        var client = OpenAiClient.forModel(OpenAiModel.GPT_4O);
        return new OpenAiChatModel(client);
    }
}

@Service
public class AiService {
    private final ChatModel chatModel;

    public AiService(ChatModel chatModel) {
        this.chatModel = chatModel;
    }

    public String askQuestion(String question) {
        return chatModel.call(new Prompt(question))
            .getResult()
            .getOutput()
            .getContent();
    }
}
```

---

## Orchestration Integration

### Basic Chat Completion

```java
import com.sap.ai.sdk.orchestration.OrchestrationClient;
import com.sap.ai.sdk.orchestration.OrchestrationModuleConfig;
import com.sap.ai.sdk.orchestration.OrchestrationAiModel;
import com.sap.ai.sdk.orchestration.spring.OrchestrationChatModel;

var orchestrationClient = new OrchestrationClient();
var config = new OrchestrationModuleConfig()
    .withLlmConfig(OrchestrationAiModel.GPT_4O);

var chatModel = new OrchestrationChatModel(orchestrationClient, config);

var prompt = new Prompt("What is SAP CAP?");
ChatResponse response = chatModel.call(prompt);

System.out.println(response.getResult().getOutput().getContent());
```

### With Configuration

```java
var config = new OrchestrationModuleConfig()
    .withLlmConfig(OrchestrationAiModel.GPT_4O
        .withParam("max_tokens", 1000)
        .withParam("temperature", 0.7));

var chatModel = new OrchestrationChatModel(orchestrationClient, config);
```

---

## Embedding

### OpenAI Embedding

```java
import com.sap.ai.sdk.foundationmodels.openai.OpenAiClient;
import com.sap.ai.sdk.foundationmodels.openai.OpenAiModel;
import com.sap.ai.sdk.foundationmodels.openai.spring.OpenAiSpringEmbeddingModel;

var client = OpenAiClient.forModel(OpenAiModel.TEXT_EMBEDDING_3_SMALL);
var embeddingModel = new OpenAiSpringEmbeddingModel(client);

// Generate embeddings
float[] embedding = embeddingModel.embed("SAP is an enterprise software company");
```

### Orchestration Embedding

```java
import com.sap.ai.sdk.orchestration.spring.OrchestrationSpringEmbeddingModel;
import com.sap.ai.sdk.orchestration.OrchestrationAiModel;

var embeddingModel = new OrchestrationSpringEmbeddingModel(
    orchestrationClient,
    OrchestrationAiModel.TEXT_EMBEDDING_3_LARGE
);

float[] embedding = embeddingModel.embed("SAP CAP framework");
```

### For RAG with Vector Stores

```java
// Use with HANA Vector Store (CAP integration)
import com.sap.cds.services.persistence.HanaVectorStore;

var documents = List.of(
    new Document("SAP CAP is a framework for building business applications"),
    new Document("Cloud Foundry is a platform for deploying applications")
);

// Store documents with embeddings
vectorStore.add(documents, embeddingModel);
```

---

## Streaming

### OpenAI Streaming

```java
import reactor.core.publisher.Flux;

var chatModel = new OpenAiChatModel(openAiClient);

Flux<ChatResponse> stream = chatModel.stream(
    new Prompt("Explain SAP CAP in detail")
);

stream.subscribe(response -> {
    String content = response.getResult().getOutput().getContent();
    System.out.print(content);
});
```

### Orchestration Streaming

```java
var chatModel = new OrchestrationChatModel(orchestrationClient, config);

Flux<ChatResponse> stream = chatModel.stream(
    new Prompt("Explain SAP CAP in detail")
);

stream.doOnComplete(() -> System.out.println("\nDone"))
    .subscribe(response -> {
        String delta = response.getResult().getOutput().getContent();
        if (delta != null) {
            System.out.print(delta);
        }
    });
```

### Blocking Stream Collection

```java
String fullResponse = stream
    .map(r -> r.getResult().getOutput().getContent())
    .filter(Objects::nonNull)
    .collect(Collectors.joining())
    .block();
```

---

## Tool Calling

### Define Tools with Annotations

```java
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;

public class WeatherTools {
    @Tool(description = "Get current weather for a city")
    public String getWeather(
        @ToolParam(description = "City name") String city,
        @ToolParam(description = "Unit: celsius or fahrenheit") String unit
    ) {
        // Implement weather lookup
        return String.format("Weather in %s: 20°C, sunny", city);
    }

    @Tool(description = "Get restaurant recommendations")
    public String getRestaurants(
        @ToolParam(description = "City name") String city
    ) {
        return "Restaurant A, Restaurant B";
    }
}
```

### Register Tools with ChatModel

```java
import org.springframework.ai.tool.ToolCallbacks;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.ToolCallAdvisor;

var tools = new WeatherTools();
var toolCallbacks = ToolCallbacks.from(tools);

var chatClient = ChatClient.builder(chatModel)
    .defaultAdvisors(new ToolCallAdvisor(toolCallbacks))
    .build();

String response = chatClient.prompt()
    .user("What's the weather in Berlin and recommend some restaurants?")
    .call()
    .content();
```

### With DefaultToolCallingChatOptions

```java
import org.springframework.ai.chat.prompt.DefaultToolCallingChatOptions;

var options = DefaultToolCallingChatOptions.builder()
    .tools(ToolCallbacks.from(new WeatherTools()))
    .build();

var prompt = new Prompt("What's the weather in Berlin?", options);
ChatResponse response = chatModel.call(prompt);
```

---

## Chat Memory

### InMemory Chat Memory

```java
import org.springframework.ai.chat.memory.InMemoryChatMemoryRepository;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;

// Create memory
var memoryRepository = new InMemoryChatMemoryRepository();
var chatMemory = MessageWindowChatMemory.builder()
    .chatMemoryRepository(memoryRepository)
    .maxMessages(10)
    .build();

// Create chat client with memory
var chatClient = ChatClient.builder(chatModel)
    .defaultAdvisors(new MessageChatMemoryAdvisor(chatMemory))
    .build();

// Conversation
String response1 = chatClient.prompt()
    .user("My name is John")
    .call()
    .content();

String response2 = chatClient.prompt()
    .user("What is my name?") // Will remember John
    .call()
    .content();
```

### With Conversation ID

```java
String conversationId = "user-123";

String response = chatClient.prompt()
    .user("Hello")
    .advisors(spec -> spec.param("chat_memory_conversation_id", conversationId))
    .call()
    .content();
```

---

## Response Format

### JSON Schema Response

```java
import com.fasterxml.jackson.annotation.JsonProperty;

public record WeatherResponse(
    @JsonProperty(required = true) String city,
    @JsonProperty(required = true) double temperature,
    @JsonProperty(required = true) String conditions
) {}

var config = new OrchestrationModuleConfig()
    .withLlmConfig(OrchestrationAiModel.GPT_4O)
    .withResponseFormat(ResponseFormat.jsonSchema(WeatherResponse.class));

var chatModel = new OrchestrationChatModel(orchestrationClient, config);

var response = chatModel.call(new Prompt("Weather in Berlin?"));
// Response will be valid JSON matching WeatherResponse schema
```

### Parse Response to Object

```java
import com.fasterxml.jackson.databind.ObjectMapper;

var objectMapper = new ObjectMapper();
var content = response.getResult().getOutput().getContent();
WeatherResponse weather = objectMapper.readValue(content, WeatherResponse.class);

System.out.println(weather.city() + ": " + weather.temperature() + "°C");
```

---

## Prompt Registry

### Use Template from Registry

```java
import com.sap.ai.sdk.orchestration.spring.SpringAiConverter;

// Reference template by scenario/name/version
var prompt = new OrchestrationPrompt()
    .withTemplateRef("my-template", "customer-support", "1.0.0");

// Use with Spring AI ChatClient
var chatClient = ChatClient.builder(chatModel).build();

String response = chatClient.prompt()
    .user(SpringAiConverter.toSpringAiMessage(prompt))
    .call()
    .content();
```

### Create Template

```java
import com.sap.ai.sdk.promptregistry.PromptClient;
import com.sap.ai.sdk.promptregistry.PromptTemplateSpec;

var promptClient = new PromptClient();

var templateSpec = PromptTemplateSpec.builder()
    .name("greeting-template")
    .scenario("customer-support")
    .version("1.0.0")
    .template("Hello {{name}}, how can I help you today?")
    .build();

promptClient.createOrUpdateTemplate(templateSpec);
```

---

## Data Protection

### DPI Masking

```java
import com.sap.ai.sdk.orchestration.DpiMasking;
import com.sap.ai.sdk.orchestration.DpiEntity;

var config = new OrchestrationModuleConfig()
    .withLlmConfig(OrchestrationAiModel.GPT_4O)
    .withMasking(DpiMasking.anonymization()
        .withEntities(
            DpiEntity.EMAIL,
            DpiEntity.PERSON,
            DpiEntity.PHONE,
            DpiEntity.ADDRESS,
            DpiEntity.LOCATION
        ));

var chatModel = new OrchestrationChatModel(orchestrationClient, config);

// Personal data in input will be anonymized before sending to LLM
var response = chatModel.call(
    new Prompt("Process this: John Doe, john@example.com, +1-555-1234")
);
```

### Pseudonymization

```java
var config = new OrchestrationModuleConfig()
    .withLlmConfig(OrchestrationAiModel.GPT_4O)
    .withMasking(DpiMasking.pseudonymization()
        .withEntities(DpiEntity.EMAIL, DpiEntity.PERSON));
```

---

## Content Filtering

### Azure Content Filter

```java
import com.sap.ai.sdk.orchestration.AzureContentFilter;
import com.sap.ai.sdk.orchestration.AzureThreshold;

var config = new OrchestrationModuleConfig()
    .withLlmConfig(OrchestrationAiModel.GPT_4O)
    .withInputFiltering(AzureContentFilter.builder()
        .hate(AzureThreshold.ALLOW_SAFE)
        .selfHarm(AzureThreshold.ALLOW_SAFE)
        .sexual(AzureThreshold.ALLOW_SAFE)
        .violence(AzureThreshold.ALLOW_SAFE)
        .build())
    .withOutputFiltering(AzureContentFilter.builder()
        .hate(AzureThreshold.ALLOW_SAFE_LOW_MEDIUM)
        .violence(AzureThreshold.ALLOW_SAFE)
        .build());

var chatModel = new OrchestrationChatModel(orchestrationClient, config);
```

### Llama Guard Filter

```java
import com.sap.ai.sdk.orchestration.LlamaGuardFilter;

var config = new OrchestrationModuleConfig()
    .withLlmConfig(OrchestrationAiModel.GPT_4O)
    .withInputFiltering(LlamaGuardFilter.builder()
        .enabledCategories("violent_crimes", "hate", "sexual_content")
        .build());
```

---

## MCP Integration

### Model Context Protocol with Spring

```java
import org.springframework.ai.mcp.client.autoconfigure.McpAutoConfiguration;
import org.springframework.ai.tool.ToolCallbackProvider;

@Configuration
@Import(McpAutoConfiguration.class)
public class McpConfig {
    @Bean
    public ChatClient chatClient(
        ChatModel chatModel,
        ToolCallbackProvider toolCallbackProvider
    ) {
        return ChatClient.builder(chatModel)
            .defaultTools(toolCallbackProvider.getToolCallbacks())
            .build();
    }
}
```

### MCP Server Connection

```yaml
# application.yml
spring:
  ai:
    mcp:
      client:
        enabled: true
        servers:
          - name: "my-tools"
            url: "[http://localhost:3000/mcp"](http://localhost:3000/mcp")
```

---

## Documentation Links

- Spring AI OpenAI: [https://github.com/SAP/ai-sdk/blob/main/docs-java/spring-ai/openai.mdx](https://github.com/SAP/ai-sdk/blob/main/docs-java/spring-ai/openai.mdx)
- Spring AI Orchestration: [https://github.com/SAP/ai-sdk/blob/main/docs-java/spring-ai/orchestration.mdx](https://github.com/SAP/ai-sdk/blob/main/docs-java/spring-ai/orchestration.mdx)
