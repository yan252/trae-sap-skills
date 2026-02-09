# SAP Cloud Logging - SAML Authentication Reference

**Source:** [https://github.com/SAP-docs/btp-cloud-logging/blob/main/docs/prerequisites-41d8559.md](https://github.com/SAP-docs/btp-cloud-logging/blob/main/docs/prerequisites-41d8559.md)
**Last Updated:** 2025-11-22

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [SAML 2.0 Configuration Steps](#saml-20-configuration-steps)
  - [Step 1: Gather Identity Provider Information](#step-1-gather-identity-provider-information)
  - [Step 2: Create SAML 2.0 Application](#step-2-create-saml-20-application)
  - [Step 3: Configure Application Attributes](#step-3-configure-application-attributes)
    - [3.1 Self-Defined Attribute](#31-self-defined-attribute)
    - [3.2 Name ID Format](#32-name-id-format)
    - [3.3 Manual SAML 2.0 Configuration](#33-manual-saml-20-configuration)
  - [Step 4: Configure SAML 2.0 (Choose One Option)](#step-4-configure-saml-20-choose-one-option)
    - [OPTION 1: Request Signing (Recommended)](#option-1-request-signing-recommended)
    - [OPTION 2: Manual Endpoint Configuration](#option-2-manual-endpoint-configuration)
  - [Step 5: Create Access Group](#step-5-create-access-group)
  - [Step 6: Configure Cloud Logging Instance](#step-6-configure-cloud-logging-instance)
- [SAML Parameter Reference (Official Nested Structure)](#saml-parameter-reference-official-nested-structure)
  - [Required Parameters (when `enabled: true`)](#required-parameters-when-enabled-true)
  - [Optional Parameters (Request Signing)](#optional-parameters-request-signing)
- [Role Mapping](#role-mapping)
  - [Default Role Mapping](#default-role-mapping)
  - [Custom Role Mapping](#custom-role-mapping)
- [Troubleshooting](#troubleshooting)
  - [Login Fails with "Invalid SAML Response"](#login-fails-with-invalid-saml-response)
  - [User Not Authorized](#user-not-authorized)
  - [IdP Metadata URL Not Accessible](#idp-metadata-url-not-accessible)
  - [Request Signing Errors](#request-signing-errors)
  - [IdP-Initiated SSO Not Working](#idp-initiated-sso-not-working)
- [Security Best Practices](#security-best-practices)
- [Complete Configuration Example](#complete-configuration-example)
  - [Identity Authentication Application Settings](#identity-authentication-application-settings)
  - [Cloud Logging Instance Configuration](#cloud-logging-instance-configuration)
- [Documentation Links](#documentation-links)

---

## Overview

SAP Cloud Logging strongly recommends integrating with SAP Cloud Identity Services using SAML 2.0 protocol for secure dashboard access. This enables centralized user management and group-based access control.

**Security Notice:** Review SAP BTP Security Recommendation **BTP-CLS-0001** before configuring SAML.

**Important:** SAP officially recommends Identity Authentication. Other SAML providers may work but lack official support or documentation. SAML configurations can be reused across multiple SAP Cloud Logging instances.

---

## Prerequisites

1. **SAP Cloud Identity Services tenant** (Identity Authentication)
2. **Administrator access** to Identity Authentication admin console: `[https://<tenantID>.accounts.ondemand.com/admin`](https://<tenantID>.accounts.ondemand.com/admin`)
3. **Cloud Logging instance** ready for SAML configuration

---

## SAML 2.0 Configuration Steps

### Step 1: Gather Identity Provider Information

From your Identity Authentication tenant:

**Metadata URL:**
```
[https://<tenant-id>.accounts.ondemand.com/saml2/metadata](https://<tenant-id>.accounts.ondemand.com/saml2/metadata)
```

**Entity ID:**
Extract from metadata file - look for `entityID` attribute in the root element.

Example:
```xml
<EntityDescriptor entityID="[https://mytenant.accounts.ondemand.com">](https://mytenant.accounts.ondemand.com">)
```

---

### Step 2: Create SAML 2.0 Application

1. Log into Identity Authentication admin console
2. Navigate to **Applications & Resources** → **Applications**
3. Click **Create** → **SAML 2.0**
4. Enter application name (e.g., "SAP Cloud Logging - Production")

---

### Step 3: Configure Application Attributes

#### 3.1 Self-Defined Attribute

1. Go to application → **Attributes**
2. Add attribute:
   - **Name:** `groups`
   - **Source:** Identity Directory
   - **Value:** User Groups

#### 3.2 Name ID Format

1. Go to **SAML 2.0 Configuration**
2. Set **Name ID Format:** `E-mail`

#### 3.3 Manual SAML 2.0 Configuration

Configure the service provider settings:

| Setting | Value |
|---------|-------|
| Assertion Consumer Service | `[https://<dashboards-url>/_opendistro/_security/saml/acs`](https://<dashboards-url>/_opendistro/_security/saml/acs`) |
| Single Logout Service | `[https://<dashboards-url>/_opendistro/_security/saml/logout`](https://<dashboards-url>/_opendistro/_security/saml/logout`) |
| SP Entity ID | `cloud-logging-<instance-id>` |

---

### Step 4: Configure SAML 2.0 (Choose One Option)

#### OPTION 1: Request Signing (Recommended)

Request signing removes the need to manually configure assertion/logout URLs for each instance.

**Generate Certificate and Private Key (Official SAP Commands):**

```bash
# Generate certificate and private key
openssl req -x509 -newkey rsa:2048 -keyout private.key -out cert.pem -nodes -days <validity>

# Convert to PKCS#8 format (REQUIRED)
openssl pkcs8 -topk8 -v1 PBE-SHA1-3DES -in private.key -out private_pkcs8.key

# Base64 encode the private key for configuration
printf "%s" "$(< private_pkcs8.key)" | base64
```

**Configure in Identity Authentication:**

1. Go to application → **SAML 2.0 Configuration**
2. Set **Require signed authentication requests** to **ON**
3. Upload certificate in the **Signing Certificate** section
4. Provide the signing key to `sp.signature_private_key` field
5. Set `sp.signature_private_key_password` if the key is encrypted

**Warning:** Expired signing certificates cause login failures with message: *"The digital signature of the received SAML2 message is invalid."*

#### OPTION 2: Manual Endpoint Configuration

Only available after creating a Cloud Logging instance. Must be repeated for each new instance.

1. Go to application → **SAML 2.0 Configuration** → **Configure Manually**
2. Set **Assertion Consumer Service Endpoint:** `<dashboards-url>/_opendistro/_security/saml/acs`
3. Set **Single Logout Endpoint:**
   - Binding: `HTTP_REDIRECT`
   - URL: `<dashboards-url>` (no path)
4. Click **Save**

---

### Step 5: Create Access Group

1. In Identity Authentication, go to **Users & Authorizations** → **User Groups**
2. Create a group (e.g., `CLS-Administrators`)
3. Add users who need dashboard access

**Important:** The group configured as `admin_group` in Cloud Logging automatically maps to the `all_access` role in OpenSearch.

---

### Step 6: Configure Cloud Logging Instance

Update your Cloud Logging instance with SAML parameters using the official nested structure:

```json
{
  "saml": {
    "enabled": true,
    "initiated": true,
    "admin_group": "CLS-Administrators",
    "roles_key": "groups",
    "idp": {
      "metadata_url": "[https://<tenant-id>.accounts.ondemand.com/saml2/metadata",](https://<tenant-id>.accounts.ondemand.com/saml2/metadata",)
      "entity_id": "[https://<tenant-id>.accounts.ondemand.com"](https://<tenant-id>.accounts.ondemand.com")
    },
    "sp": {
      "entity_id": "cloud-logging-<unique-identifier>"
    }
  }
}
```

**With request signing (Option 1):**

```json
{
  "saml": {
    "enabled": true,
    "initiated": true,
    "admin_group": "CLS-Administrators",
    "roles_key": "groups",
    "idp": {
      "metadata_url": "[https://<tenant-id>.accounts.ondemand.com/saml2/metadata",](https://<tenant-id>.accounts.ondemand.com/saml2/metadata",)
      "entity_id": "[https://<tenant-id>.accounts.ondemand.com"](https://<tenant-id>.accounts.ondemand.com")
    },
    "sp": {
      "entity_id": "cloud-logging-<unique-identifier>",
      "signature_private_key": "<base64-encoded-pkcs8-private-key>",
      "signature_private_key_password": ""
    }
  }
}
```

---

## SAML Parameter Reference (Official Nested Structure)

### Required Parameters (when `enabled: true`)

| Parameter | Type | Conditional | Description |
|-----------|------|-------------|-------------|
| `enabled` | boolean | Yes | Enable SAML authentication |
| `initiated` | boolean | Required if enabled | Enable IdP-initiated SSO |
| `admin_group` | string | Required if enabled | Group mapped to `all_access` role |
| `roles_key` | string | Required if enabled | Attribute for backend_roles during login |
| `idp.metadata_url` | string | Required if enabled | Identity Provider metadata URL |
| `idp.entity_id` | string | Required if enabled | Entity ID from metadata's `entityID` field |
| `sp.entity_id` | string | Required if enabled | Service Provider application name in IdP |

### Optional Parameters (Request Signing)

| Parameter | Type | Description |
|-----------|------|-------------|
| `sp.signature_private_key` | string | Base64-encoded PKCS#8 private key |
| `sp.signature_private_key_password` | string | Password for encrypted private key |

**Note:** Identity Authentication group names are forwarded to OpenSearch as backend roles, which map to OpenSearch roles granting permissions.

---

## Role Mapping

### Default Role Mapping

| Group | OpenSearch Role |
|-------|-----------------|
| `admin_group` value | `all_access` |
| Other groups | Configurable via OpenSearch Security |

### Custom Role Mapping

After SAML setup, configure additional role mappings in OpenSearch Dashboards:

1. Go to **Security** → **Roles**
2. Create custom roles with specific index permissions
3. Go to **Security** → **Role Mappings**
4. Map SAML groups to OpenSearch roles

**Example custom role for read-only access:**
```yaml
role_name: cls_readonly
cluster_permissions:
  - cluster_composite_ops_ro
index_permissions:
  - index_patterns:
      - "logs-*"
      - "metrics-*"
    allowed_actions:
      - read
```

---

## Troubleshooting

### Login Fails with "Invalid SAML Response"

1. Verify `idp_entity_id` matches metadata exactly
2. Check `sp_entity_id` is unique
3. Ensure clock sync between IdP and Cloud Logging
4. Validate certificate hasn't expired

### User Not Authorized

1. Verify user is in the configured `admin_group`
2. Check group attribute is being sent in SAML assertion
3. Confirm `roles_key` matches the attribute name (`groups`)

### IdP Metadata URL Not Accessible

1. Check URL is publicly accessible
2. Verify network connectivity from Cloud Logging
3. Try downloading metadata manually and hosting it

### Request Signing Errors

1. Ensure private key is PKCS#8 format
2. Verify base64 encoding is correct (no headers)
3. Check certificate matches private key
4. Confirm certificate is uploaded to IdP

### IdP-Initiated SSO Not Working

1. Set `idp_initiated_sso: true`
2. Configure correct Relay State in IdP
3. Verify SP Entity ID matches

---

## Security Best Practices

1. **Enable request signing** for production environments
2. **Rotate signing certificates** annually
3. **Use dedicated group** for Cloud Logging admins
4. **Implement least privilege** with custom role mappings
5. **Review access** periodically
6. **Enable audit logging** in Identity Authentication

---

## Complete Configuration Example

### Identity Authentication Application Settings

| Setting | Value |
|---------|-------|
| Application Type | SAML 2.0 |
| Name ID Format | E-mail |
| Assertion Consumer Service | `[https://dashboards.cls.example.com/_opendistro/_security/saml/acs`](https://dashboards.cls.example.com/_opendistro/_security/saml/acs`) |
| SP Entity ID | `cloud-logging-prod-001` |
| Sign SAML Requests | Enabled |
| Groups Attribute | `groups` |

### Cloud Logging Instance Configuration

```json
{
  "retention_period": 14,
  "saml": {
    "enabled": true,
    "initiated": true,
    "admin_group": "CLS-Administrators",
    "roles_key": "groups",
    "idp": {
      "metadata_url": "[https://mytenant.accounts.ondemand.com/saml2/metadata",](https://mytenant.accounts.ondemand.com/saml2/metadata",)
      "entity_id": "[https://mytenant.accounts.ondemand.com"](https://mytenant.accounts.ondemand.com")
    },
    "sp": {
      "entity_id": "cloud-logging-prod-001",
      "signature_private_key": "MIIEvgIBADANBg...",
      "signature_private_key_password": ""
    }
  }
}
```

---

## Documentation Links

- **Source:** [https://raw.githubusercontent.com/SAP-docs/btp-cloud-logging/main/docs/prerequisites-41d8559.md](https://raw.githubusercontent.com/SAP-docs/btp-cloud-logging/main/docs/prerequisites-41d8559.md)
- **SAP Cloud Identity Services:** [https://help.sap.com/docs/cloud-identity](https://help.sap.com/docs/cloud-identity)
- **Identity Authentication Admin Guide:** [https://help.sap.com/docs/identity-authentication](https://help.sap.com/docs/identity-authentication)
- **OpenSearch Security:** [https://opensearch.org/docs/latest/security/](https://opensearch.org/docs/latest/security/)
