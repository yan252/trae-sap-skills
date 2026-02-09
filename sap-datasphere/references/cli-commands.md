# SAP Datasphere CLI Reference

## Overview

The SAP Datasphere command line interface (`datasphere`) provides programmatic access to many features available in the UI. This reference covers installation, configuration, and all available commands.

**Documentation**: https://help.sap.com/docs/SAP_DATASPHERE/d0ecd6f297ac40249072a44df0549c1a

## Installation

### Prerequisites

- Node.js 16.x or later
- npm 8.x or later
- OAuth 2.0 client credentials (from SAP BTP)

### Install CLI

```bash
# Install globally
npm install -g @sap/datasphere-cli

# Verify installation
datasphere --version

# Get help
datasphere --help
```

## Authentication

### OAuth 2.0 Setup

1. **Create Service Instance** in SAP BTP Cockpit:
   - Service: SAP Datasphere
   - Plan: api
   - Create service key

2. **Extract Credentials** from service key:
   - `clientid`
   - `clientsecret`
   - `url` (token URL)

### Configure CLI

```bash
# Interactive configuration
datasphere configure

# Manual configuration
datasphere configure set tenant-url https://<tenant>.eu10.hcs.cloud.sap
datasphere configure set oauth-client-id <client-id>
datasphere configure set oauth-client-secret <client-secret>
datasphere configure set oauth-token-url https://<tenant>.authentication.eu10.hana.ondemand.com/oauth/token

# Verify configuration
datasphere configure list
```

### Environment Variables

```bash
export DATASPHERE_TENANT_URL=https://your-tenant.eu10.hcs.cloud.sap
export DATASPHERE_OAUTH_CLIENT_ID=your-client-id
export DATASPHERE_OAUTH_CLIENT_SECRET=your-client-secret
export DATASPHERE_OAUTH_TOKEN_URL=https://your-tenant.authentication.eu10.hana.ondemand.com/oauth/token
```

### Profiles

```bash
# Create profile
datasphere configure --profile production

# Use profile
datasphere spaces list --profile production

# Set default profile
export DATASPHERE_PROFILE=production
```

## Command Reference

### datasphere configuration

Manage TLS certificates (DW Administrator role required).

```bash
# List certificates
datasphere configuration certificates list

# Upload certificate
datasphere configuration certificates upload --file ./cert.pem

# Delete certificate
datasphere configuration certificates delete --id <cert-id>
```

### datasphere dbusers

Manage database users (DW Space Administrator role required).

```bash
# List database users
datasphere dbusers list --space <space-id>

# Create database user
datasphere dbusers create \
  --space <space-id> \
  --name <db-user-name> \
  --enable-read

# Reset password
datasphere dbusers reset-password \
  --space <space-id> \
  --name <db-user-name>

# Delete database user
datasphere dbusers delete \
  --space <space-id> \
  --name <db-user-name>
```

### datasphere global-roles

Manage global roles (DW Administrator role required).

```bash
# List global roles
datasphere global-roles list

# Read role details
datasphere global-roles read --role <role-name>

# Add user to role
datasphere global-roles users add \
  --role <role-name> \
  --user <user-email>

# Remove user from role
datasphere global-roles users remove \
  --role <role-name> \
  --user <user-email>
```

### datasphere marketplace

Manage Data Marketplace (DW Modeler role required).

#### Data Providers

```bash
# List providers
datasphere marketplace providers list

# Read provider
datasphere marketplace providers read --id <provider-id>

# Update provider
datasphere marketplace providers update \
  --id <provider-id> \
  --contact-email new-email@company.com

# Batch update
datasphere marketplace providers batch-update \
  --file providers-update.json
```

#### Data Products

```bash
# List products
datasphere marketplace products list

# Read product
datasphere marketplace products read --id <product-id>

# Create product
datasphere marketplace products create \
  --name "Analytics Package" \
  --provider <provider-id> \
  --visibility internal

# Update product status
datasphere marketplace products update \
  --id <product-id> \
  --status published

# Delete product
datasphere marketplace products delete --id <product-id>
```

### datasphere objects

Manage modeling objects (DW Modeler role required).

```bash
# List objects in space
datasphere objects list --space <space-id>

# List by type
datasphere objects list --space <space-id> --type view
datasphere objects list --space <space-id> --type local-table
datasphere objects list --space <space-id> --type remote-table
datasphere objects list --space <space-id> --type data-flow
datasphere objects list --space <space-id> --type replication-flow
datasphere objects list --space <space-id> --type transformation-flow
datasphere objects list --space <space-id> --type analytic-model
datasphere objects list --space <space-id> --type task-chain

# Read object definition (CSN/JSON)
datasphere objects read \
  --space <space-id> \
  --technical-name <object-name> \
  --output json

# Create object
datasphere objects create \
  --space <space-id> \
  --definition-file ./definition.json

# Update object
datasphere objects update \
  --space <space-id> \
  --technical-name <object-name> \
  --definition-file ./definition.json

# Deploy object
datasphere objects deploy \
  --space <space-id> \
  --technical-name <object-name>

# Delete object
datasphere objects delete \
  --space <space-id> \
  --technical-name <object-name>
```

### datasphere scoped-roles

Manage scoped roles (DW Administrator role required).

```bash
# List scoped roles
datasphere scoped-roles list

# Read scoped role
datasphere scoped-roles read --role <role-name>

# Create scoped role
datasphere scoped-roles create \
  --name <role-name> \
  --description "Role description"

# Update scoped role
datasphere scoped-roles update \
  --role <role-name> \
  --permissions read,write

# Delete scoped role
datasphere scoped-roles delete --role <role-name>
```

### datasphere spaces

Manage spaces (DW Administrator or DW Space Administrator role).

```bash
# List spaces
datasphere spaces list

# Read space
datasphere spaces read --space <space-id>

# Create space (DW Administrator only)
datasphere spaces create \
  --space-id <space-id> \
  --space-name "Space Name" \
  --disk-storage 100 \
  --memory 32

# Update space
datasphere spaces update \
  --space <space-id> \
  --disk-storage 200 \
  --priority 2

# Delete space
datasphere spaces delete --space <space-id>

# Manage space users
datasphere spaces users list --space <space-id>
datasphere spaces users add --space <space-id> --user <email> --role "DW Modeler"
datasphere spaces users remove --space <space-id> --user <email>

# Manage HDI containers
datasphere spaces hdi-containers list --space <space-id>
datasphere spaces hdi-containers add --space <space-id> --container <hdi-name>
```

### datasphere workload

Manage workload priorities (DW Administrator role required).

```bash
# Get space priorities
datasphere workload priorities list

# Set space priority
datasphere workload priorities set \
  --space <space-id> \
  --priority 2

# Set statement limits
datasphere workload statement-limits set \
  --space <space-id> \
  --max-memory 8GB \
  --max-time 3600
```

### datasphere tasks

Manage tasks and task chains (DW Integrator role required).

```bash
# List tasks
datasphere tasks list --space <space-id>

# List task chains
datasphere tasks list --space <space-id> --type task-chain

# Run task
datasphere tasks run \
  --space <space-id> \
  --task-name <task-name>

# Run task chain
datasphere tasks run \
  --space <space-id> \
  --task-chain <chain-name>

# Run with parameters
datasphere tasks run \
  --space <space-id> \
  --task-chain <chain-name> \
  --parameters '{"param1": "value1"}'

# Get task status
datasphere tasks status \
  --space <space-id> \
  --run-id <run-id>

# Cancel task
datasphere tasks cancel \
  --space <space-id> \
  --run-id <run-id>

# Manage schedules
datasphere tasks schedules list --space <space-id>
datasphere tasks schedules create \
  --space <space-id> \
  --task-chain <chain-name> \
  --cron "0 6 * * *" \
  --timezone "Europe/Berlin"
```

### datasphere users

Manage users (DW Administrator role required).

```bash
# List users
datasphere users list

# Read user
datasphere users read --user <user-email>

# Create user
datasphere users create \
  --user <user-email> \
  --first-name "John" \
  --last-name "Doe"

# Update user
datasphere users update \
  --user <user-email> \
  --first-name "Jonathan"

# Delete user
datasphere users delete --user <user-email>
```

## Output Formats

```bash
# Table format (default)
datasphere spaces list

# JSON format
datasphere spaces list --output json

# YAML format
datasphere spaces list --output yaml

# Quiet mode (minimal output)
datasphere spaces create ... --quiet

# Verbose mode (debug)
datasphere spaces list --verbose
```

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Invalid/expired token | Re-run `datasphere configure` |
| 403 Forbidden | Missing role | Verify user has required role |
| 404 Not Found | Invalid space/object | Check space-id and technical-name |
| 429 Too Many Requests | Rate limited | Wait and retry |
| 500 Server Error | Backend issue | Check service status |

### Retry Logic

```bash
# Built-in retry
datasphere spaces list --retry 3 --retry-delay 5
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Deploy to Datasphere
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g @sap/datasphere-cli
      - run: |
          datasphere configure set tenant-url ${{ secrets.DS_TENANT_URL }}
          datasphere configure set oauth-client-id ${{ secrets.DS_CLIENT_ID }}
          datasphere configure set oauth-client-secret ${{ secrets.DS_CLIENT_SECRET }}
          datasphere configure set oauth-token-url ${{ secrets.DS_TOKEN_URL }}
      - run: datasphere objects import --space PROD --input-file ./export/package.zip
```

### GitLab CI

```yaml
deploy:
  image: node:18
  script:
    - npm install -g @sap/datasphere-cli
    - datasphere configure set tenant-url $DS_TENANT_URL
    - datasphere configure set oauth-client-id $DS_CLIENT_ID
    - datasphere configure set oauth-client-secret $DS_CLIENT_SECRET
    - datasphere objects import --space PROD --input-file ./export/package.zip
```

## Best Practices

1. **Use Profiles**: Create separate profiles for dev/test/prod environments
2. **Secure Credentials**: Use environment variables or secret managers, never commit credentials
3. **Idempotent Scripts**: Design scripts to be safely re-runnable
4. **Error Handling**: Check exit codes and handle failures gracefully
5. **Logging**: Use `--verbose` for troubleshooting, `--quiet` for automation
6. **Rate Limiting**: Add delays between batch operations to avoid throttling
