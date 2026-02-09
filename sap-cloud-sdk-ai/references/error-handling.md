# Error Handling Guide

Guide for handling errors when using SAP Cloud SDK for AI.

## Table of Contents
1. [Overview](#overview)
2. [JavaScript Error Handling](#javascript-error-handling)
3. [Java Error Handling](#java-error-handling)
4. [Common Errors](#common-errors)
5. [Content Filter Errors](#content-filter-errors)
6. [Retry Strategies](#retry-strategies)

---

## Overview

SAP Cloud SDK for AI provides structured error handling with:
- **ErrorWithCause** (JS) - Nested error chains with root cause access
- **Exceptions** (Java) - Standard Java exception hierarchy
- **Detailed error messages** - HTTP status, response body, context

---

## JavaScript Error Handling

### ErrorWithCause Pattern

The SDK uses `ErrorWithCause` to provide detailed error context:

```typescript
import { OrchestrationClient } from '@sap-ai-sdk/orchestration';

const client = new OrchestrationClient({
  promptTemplating: { model: { name: 'gpt-4o' } }
});

try {
  const response = await client.chatCompletion({
    placeholderValues: { question: 'Hello' }
  });
  console.log(response.getContent());
} catch (error) {
  if (error instanceof Error) {
    // Top-level error message
    console.error('Error:', error.message);

    // Access cause chain
    if ('cause' in error && error.cause instanceof Error) {
      console.error('Caused by:', error.cause.message);

      // HTTP response details
      if ('response' in error.cause) {
        const response = (error.cause as any).response;
        console.error('Status:', response?.status);
        console.error('Data:', response?.data);
      }
    }

    // Root cause
    if ('rootCause' in error) {
      console.error('Root cause:', (error as any).rootCause.message);
    }
  }
}
```

### Error Stack Representation

```
Error: Chat completion request failed
    at OrchestrationClient.chatCompletion (...)
Caused by: Request to orchestration service failed
    at sendRequest (...)
Caused by: AxiosError: Request failed with status code 401
    at Axios.request (...)
```

### Handling Specific Error Types

```typescript
import axios from 'axios';

try {
  await client.chatCompletion({ placeholderValues });
} catch (error) {
  // Check for HTTP errors
  if (axios.isAxiosError(error) || error.cause?.code === 'ECONNREFUSED') {
    console.error('Network error - check connectivity');
    return;
  }

  // Check for timeout
  if (error.message?.includes('timeout')) {
    console.error('Request timed out');
    return;
  }

  // Check for auth errors
  if (error.cause?.response?.status === 401) {
    console.error('Authentication failed - check credentials');
    return;
  }

  // Check for rate limiting
  if (error.cause?.response?.status === 429) {
    console.error('Rate limited - retry after delay');
    return;
  }

  throw error;
}
```

---

## Java Error Handling

### Standard Exception Handling

```java
import com.sap.ai.sdk.orchestration.*;

var client = new OrchestrationClient();
var config = new OrchestrationModuleConfig()
    .withLlmConfig(OrchestrationAiModel.GPT_4O);

try {
    var prompt = new OrchestrationPrompt("Hello");
    var result = client.chatCompletion(prompt, config);
    System.out.println(result.getContent());
} catch (OrchestrationException e) {
    System.err.println("Orchestration error: " + e.getMessage());

    // Access HTTP details
    if (e.getCause() != null) {
        System.err.println("Caused by: " + e.getCause().getMessage());
    }
} catch (Exception e) {
    System.err.println("Unexpected error: " + e.getMessage());
    e.printStackTrace();
}
```

### Checking Response Status

```java
try {
    var result = client.chatCompletion(prompt, config);

    // Check for filter violations (output)
    try {
        String content = result.getContent();
    } catch (ContentFilterException e) {
        System.err.println("Output blocked by content filter");
    }
} catch (ContentFilterException e) {
    // Input was blocked
    System.err.println("Input blocked by content filter: " + e.getMessage());
}
```

---

## Common Errors

### Connection Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Could not find any matching service bindings for service identifier 'aicore'` | No AI Core binding | Bind service or set AICORE_SERVICE_KEY |
| `ECONNREFUSED` | AI Core unreachable | Check network, VPN, proxy settings |
| `ETIMEDOUT` | Request timeout | Increase timeout, check network |
| `ENOTFOUND` | DNS resolution failed | Verify URL in service key |

### Authentication Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `401 Unauthorized` | Invalid credentials | Verify clientid/clientsecret |
| `401 - Token expired` | OAuth token expired | SDK should auto-refresh; check token URL |
| `403 Forbidden` | Insufficient permissions | Check service plan, roles |

### Deployment Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Orchestration deployment not found` | No deployment | Use 'default' group or deploy orchestration |
| `404 Not Found` | Invalid deployment ID | Verify deployment exists |
| `Model not available` | Model not deployed | Check available models in AI Launchpad |

### Request Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `400 Bad Request` | Invalid request body | Check prompt format, parameters |
| `413 Payload Too Large` | Input too long | Reduce input size |
| `422 Unprocessable Entity` | Schema validation failed | Fix request structure |
| `429 Too Many Requests` | Rate limited | Implement backoff, reduce frequency |
| `500 Internal Server Error` | Server-side issue | Retry, contact SAP support |

### Token Limit Errors

```typescript
// Handle token limit errors
try {
  await client.chatCompletion({ placeholderValues });
} catch (error) {
  if (error.message?.includes('context_length_exceeded')) {
    console.error('Input too long - reduce context or use summarization');
  }
  if (error.message?.includes('max_tokens')) {
    console.error('Increase max_tokens parameter or expect truncated response');
  }
}
```

---

## Content Filter Errors

### Input Filter Violation (JavaScript)

```typescript
import { buildAzureContentSafetyFilter } from '@sap-ai-sdk/orchestration';

const client = new OrchestrationClient({
  promptTemplating: { model: { name: 'gpt-4o' } },
  filtering: {
    input: buildAzureContentSafetyFilter({ Hate: 'ALLOW_SAFE' })
  }
});

try {
  await client.chatCompletion({
    placeholderValues: { question: 'potentially harmful content' }
  });
} catch (error) {
  if (error.message?.includes('content filter') ||
      error.message?.includes('ContentFilterViolation')) {
    console.error('Input blocked by content filter');
    // Handle gracefully - request user to rephrase
  }
}
```

### Output Filter Violation (JavaScript)

```typescript
const response = await client.chatCompletion({ placeholderValues });

try {
  const content = response.getContent();
} catch (error) {
  if (error.message?.includes('content filter')) {
    console.error('Model output was blocked');
    // May need to adjust filter thresholds or prompt
  }
}
```

### Java Content Filter Handling

```java
try {
    var result = client.chatCompletion(prompt, config);
    var content = result.getContent(); // May throw if output filtered
} catch (ContentFilterException e) {
    System.err.println("Content filter violation");
    System.err.println("Category: " + e.getCategory());
    System.err.println("Severity: " + e.getSeverity());
}
```

### Filter Categories

| Category | Description |
|----------|-------------|
| Hate | Hateful or discriminatory content |
| SelfHarm | Self-harm related content |
| Sexual | Sexual content |
| Violence | Violent content |

### Filter Severity Levels

| Level | Threshold Constant |
|-------|-------------------|
| Safe only | `ALLOW_SAFE` |
| Safe + Low | `ALLOW_SAFE_LOW` |
| Safe + Low + Medium | `ALLOW_SAFE_LOW_MEDIUM` |
| All (no filtering) | `ALLOW_ALL` |

---

## Retry Strategies

### JavaScript - LangChain Retry

LangChain clients have built-in retry:

```typescript
import { OrchestrationClient } from '@sap-ai-sdk/langchain';

const client = new OrchestrationClient(config, {
  maxRetries: 3 // Default is 6
});
```

**Note**: Content filter errors do NOT trigger retry.

### JavaScript - Manual Retry

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry client errors (4xx except 429)
      const status = (error as any).cause?.response?.status;
      if (status >= 400 && status < 500 && status !== 429) {
        throw error;
      }

      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Retry ${attempt + 1}/${maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// Usage
const response = await withRetry(() =>
  client.chatCompletion({ placeholderValues })
);
```

### Java - Resilience4j

```java
import io.github.resilience4j.retry.Retry;
import io.github.resilience4j.retry.RetryConfig;

var retryConfig = RetryConfig.custom()
    .maxAttempts(3)
    .waitDuration(Duration.ofSeconds(1))
    .exponentialBackoff(2, Duration.ofSeconds(10))
    .retryOnException(e ->
        !(e instanceof ContentFilterException) &&
        !(e instanceof IllegalArgumentException)
    )
    .build();

var retry = Retry.of("aicore", retryConfig);

var result = Retry.decorateSupplier(retry, () ->
    client.chatCompletion(prompt, config)
).get();
```

### Rate Limit Handling

```typescript
async function handleRateLimit<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const status = (error as any).cause?.response?.status;
    const retryAfter = (error as any).cause?.response?.headers?.['retry-after'];

    if (status === 429) {
      const delay = retryAfter ? parseInt(retryAfter) * 1000 : 60000;
      console.log(`Rate limited. Waiting ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fn(); // Retry once after waiting
    }

    throw error;
  }
}
```

---

## Best Practices

1. **Always wrap SDK calls in try-catch** - Errors can occur at any layer
2. **Log error chains** - Use `error.cause` to get full context
3. **Handle content filters gracefully** - Don't expose raw filter errors to users
4. **Implement retry with backoff** - For transient errors (5xx, 429)
5. **Don't retry client errors** - 4xx errors (except 429) indicate request problems
6. **Set appropriate timeouts** - Prevent hanging requests
7. **Monitor error rates** - Track patterns to identify systemic issues

---

## Documentation Links

- JS Error Handling: [https://github.com/SAP/ai-sdk/blob/main/docs-js/error-handling.mdx](https://github.com/SAP/ai-sdk/blob/main/docs-js/error-handling.mdx)
- JS FAQ: [https://github.com/SAP/ai-sdk/blob/main/docs-js/faq.mdx](https://github.com/SAP/ai-sdk/blob/main/docs-js/faq.mdx)
- Java FAQ: [https://github.com/SAP/ai-sdk/blob/main/docs-java/faq.mdx](https://github.com/SAP/ai-sdk/blob/main/docs-java/faq.mdx)
