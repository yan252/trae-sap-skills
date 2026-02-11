# SAP BTP Cloud Logging Skill

**Version:** 1.1.0
**Last Verified:** 2025-11-27
**License:** GPL-3.0

---

## Overview

Comprehensive Claude Code skill for SAP Cloud Logging service on SAP Business Technology Platform (BTP). This skill provides guidance for setting up, configuring, and operating Cloud Logging instances for observability across Cloud Foundry, Kyma, and Kubernetes environments.

---

## Keywords for Auto-Trigger

### Service Names
- SAP Cloud Logging
- cloud-logging
- CLS
- BTP Cloud Logging
- SAP BTP Cloud Logging

### Technologies
- OpenSearch
- OpenSearch Dashboards
- Kibana (legacy reference)
- OpenTelemetry
- OTLP
- Observability
- Logging service
- Metrics service
- Tracing service
- APM (Application Performance Monitoring)

### Runtime Environments
- Cloud Foundry
- CF
- Kyma
- Kubernetes
- K8s
- SAP BTP
- BTP runtime

### Operations
- Log ingestion
- Metrics ingestion
- Trace ingestion
- Log shipping
- Log analysis
- Log visualization
- Dashboard creation
- Alerting
- Data retention

### Configuration
- Service instance
- Service binding
- Service key
- SAML authentication
- Identity Authentication Service
- IAS
- mTLS
- Mutual TLS
- Certificate rotation
- Root CA rotation

### CLI Tools
- cf create-service cloud-logging
- btp create services/instance
- kubectl apply ServiceInstance
- SAP BTP Service Operator

### Index Patterns
- logs-cfsyslog
- logs-otel-v1
- logs-json
- metrics-otel-v1
- otel-v1-apm-span
- logs-json-kyma
- logs-json-istio-envoy-kyma

### Service Plans
- cloud-logging dev
- cloud-logging standard
- cloud-logging large

### Troubleshooting Keywords
- Cloud Logging not working
- Logs not appearing
- Ingestion failed
- Certificate expired
- SAML login failed
- Dashboard access denied
- OpenSearch connection error

---

## Skill Contents

### Main Skill File
- `SKILL.md` - Core skill documentation with quick start, configuration, and troubleshooting

### Reference Files
| File | Description |
|------|-------------|
| `references/service-plans.md` | Service plans comparison and capacity planning |
| `references/configuration-parameters.md` | Complete parameter reference with examples |
| `references/cf-ingestion.md` | Cloud Foundry ingestion methods |
| `references/kyma-ingestion.md` | Kyma runtime integration |
| `references/opentelemetry-ingestion.md` | OTLP setup with Java/Node.js automation |
| `references/json-api-ingestion.md` | JSON API with Fluent Bit configuration |
| `references/saml-authentication.md` | SAML setup with Identity Authentication |

### Tracking Files

---

## Use Cases

This skill should be used when:

1. **Setting up Cloud Logging** - Creating instances via BTP Cockpit, CF CLI, BTP CLI, or Service Operator
2. **Configuring log ingestion** - From Cloud Foundry, Kyma, or custom applications
3. **Implementing OpenTelemetry** - Setting up OTLP for logs, metrics, and traces
4. **Using JSON API** - Configuring Fluent Bit or custom log shippers
5. **Setting up SAML** - Integrating with SAP Identity Authentication
6. **Managing certificates** - Rotating root CA or client certificates
7. **Analyzing logs** - Using OpenSearch Dashboards and index patterns
8. **Troubleshooting** - Diagnosing ingestion or access issues

---

## Documentation Sources

### Primary Source
- **GitHub Repository:** [https://github.com/SAP-docs/btp-cloud-logging](https://github.com/SAP-docs/btp-cloud-logging)

### Official Documentation
- **SAP Help Portal:** [https://help.sap.com/docs/cloud-logging](https://help.sap.com/docs/cloud-logging)
- **Discovery Center:** [https://discovery-center.cloud.sap/serviceCatalog/cloud-logging](https://discovery-center.cloud.sap/serviceCatalog/cloud-logging)

### Related Documentation
- **OpenSearch:** [https://opensearch.org/docs/latest/](https://opensearch.org/docs/latest/)
- **OpenTelemetry:** [https://opentelemetry.io/docs/](https://opentelemetry.io/docs/)
- **SAP Cloud Identity Services:** [https://help.sap.com/docs/cloud-identity](https://help.sap.com/docs/cloud-identity)
- **SAP BTP Security Recommendations:** [https://help.sap.com/docs/btp/sap-btp-security-recommendations-c8a9bb59fe624f0981efa0eff2497d7d/sap-btp-security-recommendations](https://help.sap.com/docs/btp/sap-btp-security-recommendations-c8a9bb59fe624f0981efa0eff2497d7d/sap-btp-security-recommendations)

---

## Skill Maintenance

### Update Schedule
- **Quarterly:** Check for SAP documentation updates
- **On Release:** Update when new Cloud Logging features are released

### Update Process
2. Fetch latest documentation from GitHub
3. Update affected sections in SKILL.md and references
4. Update version and `last_updated` in SKILL.md frontmatter
5. Run skill-review for validation

---

## Token Efficiency

| Scenario | Without Skill | With Skill | Savings |
|----------|---------------|------------|---------|
| Initial setup | ~12k tokens | ~4k tokens | ~67% |
| OTLP configuration | ~8k tokens | ~3k tokens | ~62% |
| Troubleshooting | ~6k tokens | ~2k tokens | ~67% |
| **Average** | **~9k tokens** | **~3k tokens** | **~65%** |

---

## Related Skills

- `sap-btp-setup` - BTP account and subaccount configuration
- `sap-cloud-foundry` - CF deployment and services
- `sap-kyma` - Kyma runtime on BTP
- `sap-identity-authentication` - IAS configuration

---

## Contributing

1. Check documentation sources for updates
2. Follow skill standards in `CLAUDE.md`
3. Verify with `skill-review` skill

---

## License

GPL-3.0 License - See repository LICENSE file

---

## Support

- **Issues:** [https://github.com/secondsky/sap-skills/issues](https://github.com/secondsky/sap-skills/issues)
- **SAP Support:** Component `BC-CP-CLS`
