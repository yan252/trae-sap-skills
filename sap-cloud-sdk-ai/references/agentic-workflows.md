# Agentic Workflows Guide

Guide for building AI agents and workflows using SAP Cloud SDK for AI.

## Table of Contents
1. [Overview](#overview)
2. [JavaScript with LangGraph](#javascript-with-langgraph)
3. [Java with Spring AI](#java-with-spring-ai)
4. [Tool Definition Patterns](#tool-definition-patterns)
5. [State Management](#state-management)
6. [Human-in-the-Loop](#human-in-the-loop)
7. [MCP Integration](#mcp-integration)

---

## Overview

Agentic workflows enable AI models to:
- Execute multi-step tasks autonomously
- Call external tools and APIs
- Maintain conversation state across turns
- Request human confirmation when needed

**Frameworks:**
- **JavaScript**: LangGraph with `@sap-ai-sdk/langchain`
- **Java**: Spring AI with `com.sap.ai.sdk:orchestration`

---

## JavaScript with LangGraph

### Complete Travel Assistant Example

```typescript
import { OrchestrationClient } from '@sap-ai-sdk/langchain';
import { StateGraph, START, END, MemorySaver, Annotation } from '@langchain/langgraph';
import { HumanMessage, AIMessage, BaseMessage } from '@langchain/core/messages';
import { tool } from '@langchain/core/tools';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { z } from 'zod';

// 1. Define Tools
const getWeather = tool(
  async ({ city }) => {
    // Call weather API
    const response = await fetch(
      `[https://api.open-meteo.com/v1/forecast?latitude=48.85&longitude=2.35&current_weather=true`](https://api.open-meteo.com/v1/forecast?latitude=48.85&longitude=2.35&current_weather=true`)
    );
    const data = await response.json();
    return JSON.stringify({
      city,
      temperature: data.current_weather.temperature,
      conditions: data.current_weather.weathercode < 3 ? 'sunny' : 'cloudy'
    });
  },
  {
    name: 'get_weather',
    description: 'Get current weather for a city',
    schema: z.object({
      city: z.string().describe('City name')
    })
  }
);

const getRestaurants = tool(
  async ({ city, cuisine }) => {
    // Mock restaurant data
    const restaurants = {
      Paris: [
        { name: 'Le Comptoir', cuisine: 'French', rating: 4.5 },
        { name: 'Chez Georges', cuisine: 'French', rating: 4.3 }
      ],
      Berlin: [
        { name: 'Nobelhart & Schmutzig', cuisine: 'German', rating: 4.7 },
        { name: 'Einsunternull', cuisine: 'Modern', rating: 4.4 }
      ]
    };
    return JSON.stringify(restaurants[city] || []);
  },
  {
    name: 'get_restaurants',
    description: 'Get restaurant recommendations for a city',
    schema: z.object({
      city: z.string().describe('City name'),
      cuisine: z.string().optional().describe('Preferred cuisine type')
    })
  }
);

// 2. Configure Client with Tools
const tools = [getWeather, getRestaurants];
const toolNode = new ToolNode(tools);

const client = new OrchestrationClient({
  promptTemplating: {
    model: { name: 'gpt-4o' },
    prompt: [
      {
        role: 'system',
        content: 'You are a helpful travel assistant. Create detailed one-day itineraries.'
      }
    ]
  }
});
const boundClient = client.bindTools(tools);

// 3. Define State Schema
const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => []
  })
});

// 4. Define Agent Node
async function agentNode(state: typeof StateAnnotation.State) {
  const response = await boundClient.invoke(state.messages);
  return { messages: [response] };
}

// 5. Define Routing Logic
function shouldContinue(state: typeof StateAnnotation.State) {
  const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
  if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
    return 'tools';
  }
  return END;
}

// 6. Build Graph
const graph = new StateGraph(StateAnnotation)
  .addNode('agent', agentNode)
  .addNode('tools', toolNode)
  .addEdge(START, 'agent')
  .addConditionalEdges('agent', shouldContinue, {
    tools: 'tools',
    [END]: END
  })
  .addEdge('tools', 'agent');

// 7. Compile with Memory
const app = graph.compile({
  checkpointer: new MemorySaver()
});

// 8. Run Agent
async function runAgent() {
  const threadId = 'user-session-123';

  const result = await app.invoke(
    {
      messages: [
        new HumanMessage('Plan a day trip to Paris with lunch recommendations')
      ]
    },
    { configurable: { thread_id: threadId } }
  );

  const lastMessage = result.messages[result.messages.length - 1];
  console.log('Agent Response:', lastMessage.content);
}

runAgent();
```

### Streaming Agent Responses

```typescript
const stream = await app.streamEvents(
  { messages: [new HumanMessage('Plan trip to Berlin')] },
  { configurable: { thread_id: 'user-123' }, version: 'v2' }
);

for await (const event of stream) {
  if (event.event === 'on_chat_model_stream') {
    const chunk = event.data.chunk;
    if (chunk.content) {
      process.stdout.write(chunk.content);
    }
  }
}
```

---

## Java with Spring AI

### Complete Travel Assistant Example

```java
import com.sap.ai.sdk.orchestration.*;
import com.sap.ai.sdk.orchestration.spring.*;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.*;
import org.springframework.ai.tool.annotation.*;
import org.springframework.ai.tool.ToolCallbacks;

// 1. Define Tool Methods
public class TravelTools {

    @Tool(description = "Get current weather for a city")
    public String getWeather(
        @ToolParam(description = "City name") String city
    ) {
        // Mock weather data based on city hash
        int temp = Math.abs(city.hashCode() % 20) + 10;
        return String.format(
            "{\"city\":\"%s\",\"temperature\":%d,\"conditions\":\"sunny\"}",
            city, temp
        );
    }

    @Tool(description = "Get restaurant recommendations")
    public String getRestaurants(
        @ToolParam(description = "City name") String city
    ) {
        if (city.equalsIgnoreCase("Paris")) {
            return "[{\"name\":\"Le Comptoir\",\"cuisine\":\"French\"}," +
                   "{\"name\":\"Chez Georges\",\"cuisine\":\"Bistro\"}]";
        }
        return "[{\"name\":\"Local Restaurant\",\"cuisine\":\"International\"}]";
    }
}

// 2. Configure Chat Client
@Service
public class TravelAgentService {

    private final ChatClient chatClient;
    private final MessageWindowChatMemory chatMemory;

    public TravelAgentService() {
        // Create orchestration client
        var orchestrationClient = new OrchestrationClient();
        var config = new OrchestrationModuleConfig()
            .withLlmConfig(OrchestrationAiModel.GPT_4O);

        var chatModel = new OrchestrationChatModel(orchestrationClient, config);

        // Create memory
        var memoryRepository = new InMemoryChatMemoryRepository();
        this.chatMemory = MessageWindowChatMemory.builder()
            .chatMemoryRepository(memoryRepository)
            .maxMessages(20)
            .build();

        // Create tool callbacks
        var tools = new TravelTools();
        var toolCallbacks = ToolCallbacks.from(tools);

        // Build chat client
        this.chatClient = ChatClient.builder(chatModel)
            .defaultAdvisors(
                new MessageChatMemoryAdvisor(chatMemory),
                new ToolCallAdvisor(toolCallbacks)
            )
            .defaultSystem("You are a helpful travel assistant. " +
                          "Create detailed one-day itineraries with weather and dining.")
            .build();
    }

    public String planTrip(String destination, String conversationId) {
        return chatClient.prompt()
            .user("Plan a one-day trip to " + destination +
                  " with weather info and restaurant recommendations")
            .advisors(spec -> spec
                .param("chat_memory_conversation_id", conversationId))
            .call()
            .content();
    }
}

// 3. Run Agent Workflow
public class TravelAgentRunner {
    public static void main(String[] args) {
        var agent = new TravelAgentService();

        // Multi-turn conversation
        String conversationId = "user-session-123";

        String response1 = agent.planTrip("Paris", conversationId);
        System.out.println("Agent: " + response1);

        // Follow-up uses same conversation memory
        String response2 = agent.planTrip("Berlin", conversationId);
        System.out.println("Agent: " + response2);
    }
}
```

### Streaming in Java

```java
import reactor.core.publisher.Flux;

public Flux<String> planTripStreaming(String destination) {
    return chatClient.prompt()
        .user("Plan a trip to " + destination)
        .stream()
        .content();
}

// Usage
planTripStreaming("Tokyo")
    .doOnNext(System.out::print)
    .doOnComplete(() -> System.out.println("\n--- Complete ---"))
    .blockLast();
```

---

## Tool Definition Patterns

### JavaScript - Zod Schema

```typescript
import { z } from 'zod';
import { tool } from '@langchain/core/tools';

const searchFlights = tool(
  async ({ origin, destination, date }) => {
    // Implementation
    return JSON.stringify([
      { flight: 'LH123', price: 299, departure: '08:00' },
      { flight: 'BA456', price: 349, departure: '10:30' }
    ]);
  },
  {
    name: 'search_flights',
    description: 'Search for available flights',
    schema: z.object({
      origin: z.string().describe('Departure airport code (e.g., FRA)'),
      destination: z.string().describe('Arrival airport code (e.g., LHR)'),
      date: z.string().describe('Travel date in YYYY-MM-DD format')
    })
  }
);
```

### Java - Annotation-Based

```java
public class BookingTools {

    @Tool(description = "Search for available flights between cities")
    public String searchFlights(
        @ToolParam(description = "Departure airport code") String origin,
        @ToolParam(description = "Arrival airport code") String destination,
        @ToolParam(description = "Travel date (YYYY-MM-DD)") String date
    ) {
        // Implementation
        return "[{\"flight\":\"LH123\",\"price\":299}]";
    }

    @Tool(description = "Book a hotel room")
    public String bookHotel(
        @ToolParam(description = "City name") String city,
        @ToolParam(description = "Check-in date") String checkIn,
        @ToolParam(description = "Check-out date") String checkOut,
        @ToolParam(description = "Number of guests") int guests
    ) {
        return "{\"confirmation\":\"HTL-" + System.currentTimeMillis() + "\"}";
    }
}
```

---

## State Management

### JavaScript - Custom State

```typescript
const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => []
  }),
  tripPlan: Annotation<object>({
    reducer: (_, y) => y,
    default: () => ({})
  }),
  userPreferences: Annotation<object>({
    reducer: (x, y) => ({ ...x, ...y }),
    default: () => ({})
  })
});

// Access state in nodes
async function plannerNode(state: typeof StateAnnotation.State) {
  const preferences = state.userPreferences;
  // Use preferences in planning...
  return {
    tripPlan: { destination: 'Paris', days: 3 },
    messages: [new AIMessage('Trip planned!')]
  };
}
```

### Java - Conversation Memory

```java
// Per-user conversation memory
var memoryRepository = new InMemoryChatMemoryRepository();

// Get or create user memory
String userId = "user-123";
var userMemory = MessageWindowChatMemory.builder()
    .chatMemoryRepository(memoryRepository)
    .conversationId(userId)
    .maxMessages(50)
    .build();
```

---

## Human-in-the-Loop

### JavaScript - Graph Interrupts

```typescript
import { interrupt, Command } from '@langchain/langgraph';

// Define node that requires confirmation
async function confirmationNode(state: typeof StateAnnotation.State) {
  const plan = state.tripPlan;

  // Request human confirmation
  const approved = interrupt({
    question: 'Do you approve this trip plan?',
    plan: plan
  });

  if (!approved) {
    return { messages: [new AIMessage('Trip cancelled.')] };
  }

  return { messages: [new AIMessage('Trip confirmed! Proceeding with booking.')] };
}

// Build graph with interrupt
const graph = new StateGraph(StateAnnotation)
  .addNode('planner', plannerNode)
  .addNode('confirm', confirmationNode)
  .addNode('booker', bookingNode)
  .addEdge(START, 'planner')
  .addEdge('planner', 'confirm')
  .addEdge('confirm', 'booker')
  .addEdge('booker', END);

const app = graph.compile({
  checkpointer: new MemorySaver(),
  interruptBefore: ['confirm'] // Pause before confirmation
});

// Run until interrupt
let result = await app.invoke(
  { messages: [new HumanMessage('Plan trip to Paris')] },
  { configurable: { thread_id: 'trip-123' } }
);

// Check if interrupted
const state = await app.getState({ configurable: { thread_id: 'trip-123' } });
if (state.next.includes('confirm')) {
  // Get user input, then resume
  const userApproved = true; // From user input

  result = await app.invoke(
    new Command({ resume: userApproved }),
    { configurable: { thread_id: 'trip-123' } }
  );
}
```

---

## MCP Integration

### JavaScript - MCP Adapter

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { loadMcpTools } from '@langchain/mcp-adapters';

// Connect to MCP server
const transport = new StdioClientTransport({
  command: 'npx',
  args: ['-y', '@anthropic/mcp-server-weather']
});

const mcpClient = new Client({ name: 'travel-agent', version: '1.0.0' });
await mcpClient.connect(transport);

// Load tools from MCP server
const mcpTools = await loadMcpTools({ client: mcpClient });

// Combine with local tools
const allTools = [...localTools, ...mcpTools];

const boundClient = client.bindTools(allTools);
```

### Java - Spring MCP

```java
@Configuration
@Import(McpAutoConfiguration.class)
public class McpConfig {

    @Bean
    public ChatClient agentChatClient(
        ChatModel chatModel,
        ToolCallbackProvider mcpToolProvider
    ) {
        // Get tools from MCP servers
        var mcpTools = mcpToolProvider.getToolCallbacks();

        // Combine with local tools
        var localTools = ToolCallbacks.from(new TravelTools());
        var allTools = new ArrayList<>(mcpTools);
        allTools.addAll(Arrays.asList(localTools));

        return ChatClient.builder(chatModel)
            .defaultTools(allTools.toArray(new ToolCallback[0]))
            .build();
    }
}
```

```yaml
# application.yml
spring:
  ai:
    mcp:
      client:
        enabled: true
        servers:
          - name: weather
            command: npx
            args: ["-y", "@anthropic/mcp-server-weather"]
```

---

## Documentation Links

- LangGraph Tutorial (JS): [https://github.com/SAP/ai-sdk/blob/main/docs-js/tutorials/getting-started-with-agents.mdx](https://github.com/SAP/ai-sdk/blob/main/docs-js/tutorials/getting-started-with-agents.mdx)
- Agentic Workflows (Java): [https://github.com/SAP/ai-sdk/blob/main/docs-java/tutorials/agentic-workflows.mdx](https://github.com/SAP/ai-sdk/blob/main/docs-java/tutorials/agentic-workflows.mdx)
- LangGraph Documentation: [https://langchain-ai.github.io/langgraphjs/](https://langchain-ai.github.io/langgraphjs/)
- Spring AI Agents: [https://docs.spring.io/spring-ai/reference/](https://docs.spring.io/spring-ai/reference/)
