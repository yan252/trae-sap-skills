# SAP Cloud Logging - JSON API Ingestion Reference

**Source:** [https://github.com/SAP-docs/btp-cloud-logging/blob/main/docs/ingest-via-json-api-endpoint-3416f8f.md](https://github.com/SAP-docs/btp-cloud-logging/blob/main/docs/ingest-via-json-api-endpoint-3416f8f.md)
**Last Updated:** 2025-11-22

---

## Table of Contents

- [Overview](#overview)
- [Index Pattern](#index-pattern)
- [Endpoint Details](#endpoint-details)
  - [Credentials from Service Key](#credentials-from-service-key)
  - [Certificate Validity](#certificate-validity)
- [API Specification](#api-specification)
  - [Single Document Ingestion](#single-document-ingestion)
  - [Batch Document Ingestion](#batch-document-ingestion)
  - [Compressed Payload](#compressed-payload)
- [Field Specifications](#field-specifications)
  - [Required Fields](#required-fields)
  - [Date Format Options](#date-format-options)
  - [Additional Fields](#additional-fields)
- [Response Codes](#response-codes)
- [Fluent Bit Configuration](#fluent-bit-configuration)
  - [Basic Configuration](#basic-configuration)
  - [Kubernetes DaemonSet](#kubernetes-daemonset)
  - [ConfigMap for Fluent Bit](#configmap-for-fluent-bit)
- [Logstash Configuration](#logstash-configuration)
- [Application Integration Examples](#application-integration-examples)
  - [Python](#python)
  - [Node.js](#nodejs)
- [Troubleshooting](#troubleshooting)
  - [HTTP 400 Bad Request](#http-400-bad-request)
  - [HTTP 401 Unauthorized](#http-401-unauthorized)
  - [Data Not Appearing in Dashboards](#data-not-appearing-in-dashboards)
  - [Performance Issues](#performance-issues)
- [Documentation Links](#documentation-links)

---

## Overview

SAP Cloud Logging supports document ingestion via JSON API endpoint as an alternative to OpenTelemetry format. The service uses mTLS authentication for secure data transmission.

**Security Notice:** Review SAP BTP Security Recommendation **BTP-CLS-0003** before implementation.

---

## Index Pattern

| Data Type | Index Pattern | Regex Pattern |
|-----------|---------------|---------------|
| JSON API Logs | `logs-json-*` | `logs-json-.*` |

**Note:** Use the regex pattern `logs-json-.*` when creating custom index patterns in OpenSearch Dashboards.

---

## Endpoint Details

### Credentials from Service Key

| Credential | Description |
|------------|-------------|
| `ingest-endpoint` | JSON API endpoint URL |
| `ingest-mtls-cert` | Client certificate (PEM) |
| `ingest-mtls-key` | Client private key (PKCS#8) |
| `server-ca` | Server CA certificate (PEM) |

### Certificate Validity

- **Default:** 90 days
- **Configurable:** 1-180 days via `certValidityDays`
- **Rotation:** Create new binding before expiration

---

## API Specification

### Single Document Ingestion

```bash
curl -X PUT "[https://<ingest-endpoint>/v1/ingest"](https://<ingest-endpoint>/v1/ingest") \
  --cert client.crt \
  --key client.key \
  --cacert server-ca.crt \
  -H "Content-Type: application/json" \
  -d '{
    "msg": "Application started successfully",
    "date": "2025-01-15T10:30:00Z",
    "level": "INFO",
    "app": "my-application"
  }'
```

### Batch Document Ingestion

```bash
curl -X PUT "[https://<ingest-endpoint>/v1/ingest"](https://<ingest-endpoint>/v1/ingest") \
  --cert client.crt \
  --key client.key \
  --cacert server-ca.crt \
  -H "Content-Type: application/json" \
  -d '[
    {"msg": "Request received", "date": "2025-01-15T10:30:00Z", "level": "INFO"},
    {"msg": "Processing started", "date": "2025-01-15T10:30:01Z", "level": "DEBUG"},
    {"msg": "Processing completed", "date": "2025-01-15T10:30:05Z", "level": "INFO"}
  ]'
```

### Compressed Payload

```bash
# gzip compression
curl -X PUT "[https://<ingest-endpoint>/v1/ingest"](https://<ingest-endpoint>/v1/ingest") \
  --cert client.crt \
  --key client.key \
  --cacert server-ca.crt \
  -H "Content-Type: application/json" \
  -H "Content-Encoding: gzip" \
  --data-binary @logs.json.gz

# deflate compression
curl -X PUT "[https://<ingest-endpoint>/v1/ingest"](https://<ingest-endpoint>/v1/ingest") \
  --cert client.crt \
  --key client.key \
  --cacert server-ca.crt \
  -H "Content-Type: application/json" \
  -H "Content-Encoding: deflate" \
  --data-binary @logs.json.deflate
```

---

## Field Specifications

### Required Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `date` | string/number | Current time | Timestamp |
| `msg` | string | `-` | Log message content |

### Date Format Options

| Format | Example | Type |
|--------|---------|------|
| Epoch Unix Timestamp | `1705315800` | number |
| ISO 8601 | `"2025-01-15T10:30:00Z"` | string |
| ISO 8601 with timezone | `"2025-01-15T10:30:00+01:00"` | string |

### Additional Fields

- Supports up to **1000 custom fields** per document
- **Type consistency required:** Field types must be consistent across documents
- Field names should follow lowercase naming convention

**Example with custom fields:**
```json
{
  "msg": "User login successful",
  "date": "2025-01-15T10:30:00Z",
  "level": "INFO",
  "user_id": "user123",
  "ip_address": "192.168.1.100",
  "session_id": "sess_abc123",
  "response_time_ms": 45,
  "success": true
}
```

---

## Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Invalid JSON payload (error description in body) |
| 401 | Authentication failed |
| 413 | Payload too large |
| 500 | Server error |

---

## Fluent Bit Configuration

Fluent Bit is recommended for production log shipping.

### Basic Configuration

```ini
[SERVICE]
    Flush         5
    Daemon        Off
    Log_Level     info

[INPUT]
    Name          tail
    Path          /var/log/app/*.log
    Tag           app.logs

[OUTPUT]
    Name          http
    Match         *
    Host          <ingest-endpoint-host>
    Port          443
    URI           /v1/ingest
    Format        json
    Json_date_key date
    Json_date_format iso8601
    tls           On
    tls.verify    On
    tls.ca_file   /certs/server-ca.crt
    tls.crt_file  /certs/client.crt
    tls.key_file  /certs/client.key
    Compress      gzip
    Retry_Limit   3
```

### Kubernetes DaemonSet

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluent-bit
  namespace: logging
spec:
  selector:
    matchLabels:
      app: fluent-bit
  template:
    metadata:
      labels:
        app: fluent-bit
    spec:
      containers:
      - name: fluent-bit
        image: fluent/fluent-bit:latest
        volumeMounts:
        - name: config
          mountPath: /fluent-bit/etc/
        - name: certs
          mountPath: /certs
          readOnly: true
        - name: varlog
          mountPath: /var/log
          readOnly: true
      volumes:
      - name: config
        configMap:
          name: fluent-bit-config
      - name: certs
        secret:
          secretName: cls-json-credentials
      - name: varlog
        hostPath:
          path: /var/log
```

### ConfigMap for Fluent Bit

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluent-bit-config
  namespace: logging
data:
  fluent-bit.conf: |
    [SERVICE]
        Flush         5
        Daemon        Off
        Log_Level     info
        Parsers_File  parsers.conf

    [INPUT]
        Name              tail
        Path              /var/log/containers/*.log
        Parser            docker
        Tag               kube.*
        Refresh_Interval  5
        Mem_Buf_Limit     50MB
        Skip_Long_Lines   On

    [FILTER]
        Name                kubernetes
        Match               kube.*
        Kube_URL            [https://kubernetes.default.svc:443](https://kubernetes.default.svc:443)
        Kube_CA_File        /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
        Kube_Token_File     /var/run/secrets/kubernetes.io/serviceaccount/token
        Merge_Log           On
        K8S-Logging.Parser  On
        K8S-Logging.Exclude On

    [OUTPUT]
        Name          http
        Match         *
        Host          <ingest-endpoint-host>
        Port          443
        URI           /v1/ingest
        Format        json
        Json_date_key date
        Json_date_format iso8601
        tls           On
        tls.verify    On
        tls.ca_file   /certs/server-ca.crt
        tls.crt_file  /certs/client.crt
        tls.key_file  /certs/client.key
        Compress      gzip
        Retry_Limit   3

  parsers.conf: |
    [PARSER]
        Name        docker
        Format      json
        Time_Key    time
        Time_Format %Y-%m-%dT%H:%M:%S.%L
        Time_Keep   On
```

---

## Logstash Configuration

Alternative to Fluent Bit for existing Logstash deployments.

```ruby
output {
  http {
    url => "[https://<ingest-endpoint>/v1/ingest"](https://<ingest-endpoint>/v1/ingest")
    http_method => "put"
    format => "json"
    content_type => "application/json"
    client_cert => "/certs/client.crt"
    client_key => "/certs/client.key"
    cacert => "/certs/server-ca.crt"

    # Map fields
    mapping => {
      "msg" => "%{message}"
      "date" => "%{@timestamp}"
    }
  }
}
```

---

## Application Integration Examples

### Python

```python
import requests
import json
from datetime import datetime

def send_logs_to_cls(logs, endpoint, cert_path, key_path, ca_path):
    """Send logs to SAP Cloud Logging JSON API."""

    # Add timestamp if not present
    for log in logs:
        if 'date' not in log:
            log['date'] = datetime.utcnow().isoformat() + 'Z'
        if 'msg' not in log:
            log['msg'] = '-'

    response = requests.put(
        f"[https://{endpoint}/v1/ingest",](https://{endpoint}/v1/ingest",)
        json=logs,
        cert=(cert_path, key_path),
        verify=ca_path,
        headers={'Content-Type': 'application/json'}
    )

    return response.status_code == 200

# Usage
logs = [
    {"msg": "Application started", "level": "INFO"},
    {"msg": "Connected to database", "level": "INFO"}
]
send_logs_to_cls(logs, "ingest.cls.example.com", "client.crt", "client.key", "server-ca.crt")
```

### Node.js

```javascript
const https = require('https');
const fs = require('fs');

function sendLogsToCLS(logs, endpoint, certPath, keyPath, caPath) {
  // Add timestamp if not present
  const enrichedLogs = logs.map(log => ({
    ...log,
    date: log.date || new Date().toISOString(),
    msg: log.msg || '-'
  }));

  const options = {
    hostname: endpoint,
    port: 443,
    path: '/v1/ingest',
    method: 'PUT',
    cert: fs.readFileSync(certPath),
    key: fs.readFileSync(keyPath),
    ca: fs.readFileSync(caPath),
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', reject);
    req.write(JSON.stringify(enrichedLogs));
    req.end();
  });
}

// Usage
const logs = [
  { msg: 'Application started', level: 'INFO' },
  { msg: 'Connected to database', level: 'INFO' }
];
sendLogsToCLS(logs, 'ingest.cls.example.com', 'client.crt', 'client.key', 'server-ca.crt');
```

---

## Troubleshooting

### HTTP 400 Bad Request

1. Validate JSON syntax
2. Check field type consistency
3. Verify date format is valid

### HTTP 401 Unauthorized

1. Verify certificate hasn't expired
2. Check certificate matches service key
3. Ensure CA certificate is included

### Data Not Appearing in Dashboards

1. Check index pattern: `logs-json-*`
2. Verify timestamp field is named `date`
3. Allow time for indexing (1-2 minutes)

### Performance Issues

1. Use batch uploads instead of single documents
2. Enable gzip compression
3. Increase Fluent Bit buffer size
4. Reduce flush interval if losing logs

---

## Documentation Links

- **Source:** [https://raw.githubusercontent.com/SAP-docs/btp-cloud-logging/main/docs/ingest-via-json-api-endpoint-3416f8f.md](https://raw.githubusercontent.com/SAP-docs/btp-cloud-logging/main/docs/ingest-via-json-api-endpoint-3416f8f.md)
- **Fluent Bit:** [https://docs.fluentbit.io/manual/](https://docs.fluentbit.io/manual/)
- **Logstash HTTP Output:** [https://www.elastic.co/guide/en/logstash/current/plugins-outputs-http.html](https://www.elastic.co/guide/en/logstash/current/plugins-outputs-http.html)
