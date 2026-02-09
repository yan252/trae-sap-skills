---
name: sap-fiori-url-generator
description: Generate SAP Fiori Launchpad URLs from app names using AppList.json. Looks up app information by name and constructs proper FLP URLs with required parameters like sap-client and sap-language.
license: MIT
---

# SAP Fiori URL Generator Skill

This skill enables you to generate SAP Fiori Launchpad (FLP) URLs based on app names from AppList.json file.

## References

When you need to look up SAP Fiori app information:

**App List Database**: Read `@skills/sap-fiori-url-generator/references/AppList.json` - contains all SAP Fiori apps with their Semantic Object-Action mappings, App IDs, descriptions, and technical details.

Use this reference to:
- Search for apps by name (partial match, case-insensitive)
- Extract "Semantic Object - Action" field for URL generation
- Provide app details (ID, description, component) to users
- Suggest similar apps when exact match is not found

### Updating AppList.json

The AppList.json data can be obtained from SAP's Fiori Apps Library:

1. Go to https://pr.alm.me.sap.com/launchpad#FALApp-display
2. Export app list to Excel
3. Convert the Excel file to JSON format

This ensures the app list stays current with the latest SAP Fiori applications.

## Overview

When a user provides:
1. A base SAP Fiori URL (e.g., `https://myserver.com:44300`)
2. An app name (e.g., "Create Maintenance Request")

You will:
1. Search AppList.json file for the app
2. Extract the "Semantic Object - Action" field
3. Construct a complete FLP URL with proper parameters

## URL Structure

The complete SAP Fiori Launchpad URL follows this pattern:

```
{BASE_URL}/sap/bc/ui2/flp?sap-client={CLIENT}&sap-language={LANGUAGE}#{SEMANTIC_OBJECT}-{ACTION}
```

### Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `BASE_URL` | SAP Fiori server URL | `https://myserver.com:44300` |
| `sap-client` | SAP client number | `100` |
| `sap-language` | Language code | `EN` |
| `SEMANTIC_OBJECT` | Semantic object from app | `MaintenanceRequest` |
| `ACTION` | Action from app | `create` |

## Usage Examples

### Example 1: Basic URL Generation

**User Request**: "Generate Fiori URL for 'Create Maintenance Request' on server https://myserver.com:44300 with client 100"

**Process**:
1. Search AppList.json for "Create Maintenance Request"
2. Find: Semantic Object = "MaintenanceRequest", Action = "create"
3. Construct URL: `https://myserver.com:44300/sap/bc/ui2/flp?sap-client=100&sap-language=EN#MaintenanceRequest-create`

**Response**: Provide the complete URL with explanation

### Example 2: Multiple Matches

**User Request**: "Find Fiori app for 'Purchase Order'"

**Process**:
1. Search AppList.json for "Purchase Order"
2. Find multiple matches (e.g., "Create Purchase Order", "Display Purchase Order", "Change Purchase Order")
3. Present all options with their Semantic Object-Action pairs
4. Ask user which specific app they need

### Example 3: Partial Match

**User Request**: "Find app for 'MaintReq'"

**Process**:
1. Search AppList.json for "MaintReq"
2. No exact match found
3. Search for partial matches containing "Maint" or "Request"
4. Suggest: "Create Maintenance Request", "Display Maintenance Request", "Process Maintenance Request"
5. Ask user to confirm

## AppList.json Structure

Each app in AppList.json contains:

```json
{
  "App ID": "F1234",
  "App Name": "Create Maintenance Request",
  "Description": "Create maintenance requests for equipment",
  "Semantic Object - Action": "MaintenanceRequest-create",
  "Component": "CA_FIORI_MAINTENANCE",
  "Technical Catalog": "SAP_FIORI_MAINTENANCE",
  "Business Role": "Maintenance Engineer"
}
```

## Error Handling

### App Not Found

If the app is not found:
1. Search for partial matches
2. Suggest similar apps
3. Ask user for clarification
4. Provide tips for better search terms

### Invalid URL Format

If the base URL is invalid:
1. Validate URL format
2. Check for required components (protocol, host)
3. Provide examples of valid URLs
4. Ask user to correct the input

### Missing Parameters

If required parameters are missing:
1. Identify which parameters are missing
2. Ask user to provide them
3. Use sensible defaults where appropriate (e.g., language = EN)

## Best Practices

1. **Always validate** the base URL format before generating
2. **Use case-insensitive** search for app names
3. **Support partial matching** to help users find apps
4. **Provide multiple options** when matches are ambiguous
5. **Include explanations** of URL components
6. **Suggest related apps** when exact match not found

## Related Skills

- **sap-fiori-tools**: Use for Fiori app development and configuration
- **sapui5**: Use for Fiori frontend development
- **sap-btp-cloud-platform**: Use for Fiori deployment on BTP
- **sap-api-style**: Use for Fiori API documentation standards

## Scripts Included

The skill includes helper scripts for URL generation:

- `scripts/fiori-url-generator.js` - Node.js implementation
- `scripts/fiori-url-generator.py` - Python implementation
- `scripts/test.py` - Test cases for URL generation

These can be used as reference or directly for automation.

## Quick Reference

**Common Fiori Apps and Their URLs**:

| App Name | Semantic Object - Action |
|-----------|------------------------|
| Create Purchase Order | PurchaseOrder-create |
| Display Purchase Order | PurchaseOrder-display |
| My Inbox | Inbox-manage |
| Approve Purchase Requisitions | PurchaseRequisition-approve |
| Manage Sales Orders | SalesOrder-manage |

## Troubleshooting

**Issue**: URL doesn't work
- Check: Base URL is correct
- Check: Client number is valid
- Check: User has proper authorizations
- Check: App is deployed and active

**Issue**: App not found in database
- Try: Partial name search
- Try: Different terminology
- Check: AppList.json is up to date
- Verify: App exists in your SAP system

---

**Skill Version**: 2.1.0
**License**: MIT
**Maintainer**: SAP Skills Team
