# SAP HANA CLI - Troubleshooting Guide

**Source**: [https://github.com/SAP-samples/hana-developer-cli-tool-example](https://github.com/SAP-samples/hana-developer-cli-tool-example)

Common issues, diagnostic commands, and solutions.

---

## Diagnostic Commands

### Connection Status

```bash
hana-cli status
```

Verify current connection is active.

### Privilege Error Analysis

```bash
hana-cli privilegeError [guid]
```

**Aliases**: `pe`, `getInsufficientPrivilegeErrorDetails`

Diagnoses specific privilege errors using the error GUID.

**System Procedure**: `SYS.GET_INSUFFICIENT_PRIVILEGE_ERROR_DETAILS`

### User Inspection

```bash
hana-cli inspectUser [user]
```

View user metadata and privileges.

---

## Common Issues

### Connection Problems

| Error | Cause | Solution |
|-------|-------|----------|
| Connection refused | Wrong host/port | Verify hostname and port |
| SSL handshake failed | Certificate issue | Add `--trustStore` |
| Authentication failed | Wrong credentials | Check user/password |
| Connection timeout | Network issue | Check firewall rules |
| Host not found | DNS issue | Use IP address |

**Diagnostic Steps**:

```bash
# 1. Check current status
hana-cli status

# 2. Test with explicit credentials
hana-cli connect -n "host:443" -u USER -p PASS --encrypt

# 3. Add trust store if needed
hana-cli connect --trustStore /path/to/cert.pem
```

### Permission Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Insufficient privilege | Missing role | Grant required roles |
| Object not found | Wrong schema | Check schema name |
| Access denied | Object ownership | Check privileges |

**Diagnostic Steps**:

```bash
# 1. Get error GUID from error message
# 2. Analyze with privilegeError
hana-cli privilegeError <guid>

# 3. Check user details
hana-cli inspectUser

# 4. Review available roles
hana-cli roles
```

### HDI Container Issues

| Error | Cause | Solution |
|-------|-------|----------|
| HDI not activated | Service disabled | Run `activateHDI` |
| Cannot create container | No admin rights | Get HDI admin role |
| Container exists | Name conflict | Use unique name |
| Cannot drop group | Not empty | Drop containers first |

**Diagnostic Steps**:

```bash
# 1. Check HDI status
hana-cli containers

# 2. Verify admin rights
hana-cli adminHDI

# 3. List container users
hana-cli createContainerUsers -c CONTAINER --list
```

### Cloud Connection Issues

| Error | Cause | Solution |
|-------|-------|----------|
| Instance not found | Wrong name | Verify instance name |
| Instance stopped | Not running | Run `hanaCloudStart` |
| Service key invalid | Expired/revoked | Regenerate key |
| BTP target wrong | Wrong subaccount | Reconfigure with `btp` |

**Diagnostic Steps**:

```bash
# 1. Check BTP target
hana-cli btpInfo

# 2. List instances
hana-cli hanaCloudInstances

# 3. Start if stopped
hana-cli hanaCloudStart <instance>

# 4. Reconfigure BTP
hana-cli btp
```

---

## Error Messages Reference

### Connection Errors

**"ECONNREFUSED"**
```
Error: connect ECONNREFUSED 127.0.0.1:30015
```
Solution: Check host and port, ensure database is running.

**"SSL_ERROR_SYSCALL"**
```
Error: SSL_ERROR_SYSCALL
```
Solution: Enable encryption with `--encrypt` or add trust store.

**"EHOSTUNREACH"**
```
Error: connect EHOSTUNREACH
```
Solution: Check network connectivity, VPN if required.

### Authentication Errors

**"Invalid username or password"**
```
Error: authentication failed
```
Solution: Verify credentials, check user is not locked.

**"User is locked"**
```
Error: user account is locked
```
Solution: Unlock user via HANA Studio or SQL.

### Privilege Errors

**"Insufficient privilege"**
```
Error: insufficient privilege: Not authorized
```
Solution: Use `privilegeError` with GUID to diagnose, grant required roles.

---

## Credential File Issues

### Missing Credentials

```bash
# Check file discovery order
ls -la default-env*.json
ls -la .cdsrc-private.json
ls -la .env
```

### Invalid JSON

```bash
# Validate JSON syntax
cat default-env.json | python -m json.tool
```

### Wrong Credentials Priority

Remember the priority order:
1. `default-env-admin.json` (with --admin)
2. `.cdsrc-private.json` (cds bind)
3. `.env` file
4. `--conn` parameter
5. `default-env.json`
6. `~/.hana-cli/default.json`

---

## System Resource Issues

### Reclaim Resources

```bash
# Reclaim storage space
hana-cli reclaim
```

Executes:
- `ALTER SYSTEM RECLAIM LOB SPACE`
- `ALTER SYSTEM RECLAIM LOG`
- `ALTER SYSTEM RECLAIM DATAVOLUME 105 DEFRAGMENT`

### Check Storage

```bash
# View data volumes
hana-cli dataVolumes

# View disk info
hana-cli disks
```

---

## Debug Mode

Enable debug output:

```bash
# Set DEBUG environment variable
DEBUG=* hana-cli <command>

# Or use --debug flag if available
hana-cli <command> --debug
```

---

## Reporting Issues

```bash
# Open issue on GitHub
hana-cli issue
```

Opens browser to create GitHub issue with:
- Version information
- Environment details
- Steps to reproduce

---

## Getting Help

### In-CLI Help

```bash
hana-cli --help
hana-cli <command> --help
```

### Documentation

```bash
hana-cli readMe
hana-cli openReadMe  # Opens in browser
```

### Changelog

```bash
hana-cli changeLog
hana-cli openChangeLog  # Opens in browser
```

---

*Reference: [https://github.com/SAP-samples/hana-developer-cli-tool-example*](https://github.com/SAP-samples/hana-developer-cli-tool-example*)
