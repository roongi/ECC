# BBOS Doctor Checklist

Manual diagnostic checklist for verifying ECC installation health in BBOS Factory environments. Runs `ecc doctor`-style steps to validate configuration.

---

## Prerequisites

Ensure ECC is installed and the `ecc` CLI is available:

```bash
# Check ECC CLI is accessible
which ecc || echo "ECC CLI not found in PATH"

# Verify Node.js version (18+ required)
node --version
```

---

## Step 1: Install State Verification

Check that ECC install-state files exist and are valid:

```bash
# Run ECC doctor for all targets
ecc doctor

# Or check specific targets
ecc doctor --target claude
ecc doctor --target cursor
ecc doctor --target hermes

# JSON output for parsing
ecc doctor --json
```

### Expected Output

```
Doctor report:

- claude
  Status: OK
  Install-state: /home/ringo/.claude/.ecc/install-state.json
  Issues: none

Summary: checked=1, ok=1, warnings=0, errors=0
```

### Troubleshooting

| Status | Action |
|--------|--------|
| OK | No action needed |
| WARNING | Review warnings; usually safe to continue |
| ERROR | Run `ecc repair` to restore missing files |

```bash
# Repair drifted files
ecc repair --dry-run  # Preview changes
ecc repair            # Apply fixes
```

---

## Step 2: Hook Configuration

Verify hook profile and disabled hooks:

```bash
# Check current hook settings via Node.js
node -e "
  const hf = require('./scripts/lib/hook-flags');
  console.log('Hooks enabled:', hf.areHooksEnabled());
  console.log('Profile:', hf.getHookProfile());
  console.log('Disabled hooks:', Array.from(hf.getDisabledHookIds()).join(', ') || 'none');
"
```

### Expected Output

```
Hooks enabled: true
Profile: standard
Disabled hooks: none
```

### Environment Check

```bash
# Inspect hook-related environment variables
echo "ECC_HOOKS_ENABLED=${ECC_HOOKS_ENABLED:-unset}"
echo "ECC_HOOK_PROFILE=${ECC_HOOK_PROFILE:-unset}"
echo "ECC_DISABLED_HOOKS=${ECC_DISABLED_HOOKS:-unset}"
```

---

## Step 3: Memory Vault Health

Verify Memory Vault is initialized and accessible:

```bash
# Check Memory Vault status
ecc memory doctor

# List memory scopes
ls -la .ecc/memory/ 2>/dev/null || echo "Project memory vault not initialized"
ls -la ~/.ecc/memory/ 2>/dev/null || echo "User memory vault not initialized"
```

### Initialize if Missing

```bash
# Initialize project-scope vault
ecc memory init --scope project

# Initialize user-scope vault
ecc memory init --scope user
```

---

## Step 4: MCP Server Connectivity

Check MCP server health for configured integrations:

```bash
# ECC status includes MCP health
ecc status --json | jq '.mcp // "No MCP status available"'

# Or via Claude CLI if available
claude mcp status 2>/dev/null || echo "Claude CLI not available"
```

---

## Step 5: Harness Config Validation

Verify harness-specific configurations:

### Claude Code

```bash
# Check Claude config exists
ls -la ~/.claude/settings.json 2>/dev/null || echo "No Claude settings.json"
ls -la ~/.claude/CLAUDE.md 2>/dev/null || echo "No CLAUDE.md"
```

### Cursor

```bash
# Check Cursor config
ls -la ~/.cursor/mcp.json 2>/dev/null || echo "No Cursor MCP config"
ls -la .cursor/rules/*.mdc 2>/dev/null || echo "No project-level Cursor rules"
```

### Hermes

```bash
# Check Hermes config
ls -la ~/.hermes/ 2>/dev/null || echo "No Hermes config directory"
```

---

## Step 6: Federation Registration (BBOS-specific)

Validate BBOS skill federation registration:

```bash
# Check federation template exists
ls -la bbos/skill-register-template.json 2>/dev/null || echo "No federation template"

# Validate JSON schema
node -e "
  const fs = require('fs');
  try {
    const template = JSON.parse(fs.readFileSync('bbos/skill-register-template.json', 'utf8'));
    console.log('Federation template valid');
    console.log('Schema version:', template.schema_version);
  } catch (e) {
    console.error('Invalid federation template:', e.message);
  }
"
```

---

## Step 7: Governance Event Log

Check governance capture is working (if enabled):

```bash
# Check if governance capture is enabled
echo "ECC_GOVERNANCE_CAPTURE=${ECC_GOVERNANCE_CAPTURE:-unset (disabled by default)}"

# Check governance log exists
ls -la ~/.ecc/governance/events.jsonl 2>/dev/null || echo "No governance log (capture may be disabled)"

# View recent events
tail -5 ~/.ecc/governance/events.jsonl 2>/dev/null || echo "No events recorded"
```

---

## Step 8: Session State

Verify session persistence is working:

```bash
# List recent sessions
ecc sessions 2>/dev/null || echo "Session tracking not available"

# Check active session
ecc sessions session-active --json 2>/dev/null || echo "No active session"
```

---

## Full Diagnostic Script

Run all checks in sequence:

```bash
#!/usr/bin/env bash
# bbos-doctor-full.sh - Complete BBOS+ECC diagnostic

set -e
echo "=== BBOS Doctor Full Diagnostic ==="
echo ""

echo "1. ECC Install State"
ecc doctor || echo "WARN: ecc doctor reported issues"
echo ""

echo "2. Hook Configuration"
node -e "
  const hf = require('./scripts/lib/hook-flags');
  console.log('  Hooks enabled:', hf.areHooksEnabled());
  console.log('  Profile:', hf.getHookProfile());
  console.log('  Disabled:', Array.from(hf.getDisabledHookIds()).join(', ') || 'none');
" 2>/dev/null || echo "  WARN: Could not check hook flags"
echo ""

echo "3. Memory Vault"
ecc memory doctor 2>/dev/null || echo "  WARN: Memory vault check failed"
echo ""

echo "4. ECC Status"
ecc status 2>/dev/null || echo "  WARN: ecc status failed"
echo ""

echo "5. Federation Template"
if [ -f "bbos/skill-register-template.json" ]; then
  echo "  Federation template: present"
else
  echo "  Federation template: missing"
fi
echo ""

echo "=== Diagnostic Complete ==="
```

---

## Common Issues and Fixes

| Issue | Diagnosis | Fix |
|-------|-----------|-----|
| "No ECC install-state files found" | ECC not installed for this harness | `ecc install --target <harness>` |
| "Hooks not enabled" | `ECC_HOOKS_ENABLED=false` set | `unset ECC_HOOKS_ENABLED` |
| "Memory vault not initialized" | Missing `.ecc/memory/` | `ecc memory init --scope project` |
| "MCP server unhealthy" | Server down or misconfigured | Check MCP config and restart server |
| "Federation template invalid" | JSON syntax error | Validate with JSON linter |

---

## See Also

- [docs/BBOS_FULL_ECC_SETUP.md](../docs/BBOS_FULL_ECC_SETUP.md) — Installation guide
- [docs/BBOS_HOOK_UNBLOCK.md](../docs/BBOS_HOOK_UNBLOCK.md) — Hook troubleshooting
- [scripts/doctor.js](./doctor.js) — ECC doctor implementation
