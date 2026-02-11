# SAP BTP Intelligent Situation Automation Skill

## ⚠️ SERVICE DEPRECATED

**Status**: DEPRECATED as of September 24, 2025
**End of Service**: March 2026 (approximately)

This skill is now archived and maintained only for:
- Data export guidance
- Unsubscription instructions
- Historical reference

## Overview (For Reference)

This skill previously provided guidance for implementing situation-based automation between SAP S/4HANA systems and SAP Business Technology Platform.

## Auto-Trigger Keywords

This skill activates when discussing:

### Service Names
- Intelligent Situation Automation
- ISA
- Situation Automation
- Business Situation Handling

### SAP Systems
- SAP S/4HANA Cloud situations
- SAP S/4HANA situations
- S/4HANA business situations
- Situation types
- Situation handling APIs

### Communication Scenarios
- SAP_COM_0345
- SAP_COM_0376
- SAP_COM_0092
- SAP_COM_0102
- SAP_COM_0107
- Business Situation Integration
- Business Situation Master Data Integration

### BTP Services
- Event Mesh for situations
- Situation event communication
- Business Event Handling
- Event channel for S/4HANA

### Applications
- Manage Situation Actions
- Manage Situation Automation
- Situation Dashboard
- Analyze Situations
- Onboard System app
- Delete Data Context
- Explore Related Situations

### Roles
- SituationAutomationKeyUser
- SituationAutomationAdminUser
- RuleRepositorySuperUser
- Situation automation roles

### Configuration
- Situation destinations
- Situation onboarding
- Situation automation rules
- Automatic situation resolution

### Troubleshooting
- CA-SIT-ATM
- Situation automation errors
- No Action Applied
- No Automation Configuration Found

### Region/Infrastructure
- cf-eu10 situation automation
- Frankfurt region ISA

## Quick Start

### ⚠️ For Unsubscribing from Deprecated Service

1. Export any required data using the data export endpoint
2. Follow unsubscription instructions in SKILL.md
3. Contact CA-SIT-ATM for support

### Legacy Setup Flow (For Reference Only)

```
1. Enable Event Mesh in subaccount
2. Subscribe to Intelligent Situation Automation (standard plan) - NO LONGER AVAILABLE
3. Configure destinations to S/4HANA system
4. Expose Situation Handling APIs in S/4HANA
5. Set up Event Mesh communication
6. Onboard S/4HANA system
7. Assign user roles
8. Configure automation rules
```

## Coverage

### Setup & Subscription
- Prerequisites and region requirements
- Service subscription (standard plan)
- Event Mesh configuration
- Browser and network requirements

### System Onboarding
- API exposure for SAP S/4HANA Cloud (SAP_COM_0345, SAP_COM_0376)
- API exposure for SAP S/4HANA on-premise
- Destination configuration
- Event Mesh service instance and keys
- Event channel setup
- Topic bindings
- Onboard System application

### User Management
- Role templates (Key User, Admin User)
- Role collections
- User assignment via IdP
- Required role collections for each user type

### Operations
- Automatic situation resolution
- Standard vs. custom actions
- Data export
- Audit logging

### Troubleshooting
- Common error scenarios
- Resolution steps
- Support component (CA-SIT-ATM)

## File Structure

```
sap-btp-intelligent-situation-automation/
├── SKILL.md                    # Main skill file
├── README.md                   # This file
└── references/
    ├── setup-guide.md          # Prerequisites, subscription, Event Mesh
    ├── onboarding.md           # APIs, destinations, system onboarding
    ├── security-roles.md       # Roles, collections, assignment
    ├── operations.md           # Resolution, export, logging
    ├── troubleshooting.md      # Errors, solutions, support
    └── external-links.md       # All SAP documentation links & IDs
```

## Documentation Sources

- **GitHub**: [https://github.com/SAP-docs/btp-intelligent-situation-automation](https://github.com/SAP-docs/btp-intelligent-situation-automation)
- **Deprecation Announcement**: [https://community.sap.com/t5/technology-blog-posts-by-sap/deprecation-of-intelligent-situation-automation-service/ba-p/14214342](https://community.sap.com/t5/technology-blog-posts-by-sap/deprecation-of-intelligent-situation-automation-service/ba-p/14214342)
- **SAP Help**: [https://help.sap.com/docs/intelligent-situation-automation](https://help.sap.com/docs/intelligent-situation-automation) (archived)
- **Event Mesh**: [https://help.sap.com/docs/SAP_EM](https://help.sap.com/docs/SAP_EM)

## Version

- **Skill Version**: 1.1.0
- **Status**: DEPRECATED
- **Last Updated**: 2025-11-27
- **Deprecation Date**: 2025-09-24
- **End of Service**: March 2026 (estimated)

## License

GPL-3.0 License - See repository LICENSE file.

## Contributing

See the main repository CONTRIBUTING guidelines at [https://github.com/secondsky/sap-skills.](https://github.com/secondsky/sap-skills.)
