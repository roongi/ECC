# BBOS Hook Unblock Guide

Common ECC hook blocks and how to resolve them safely without disabling security-critical hooks.

---

## Quick Reference

| Symptom | Hook ID | Safe Fix |
|---------|---------|----------|
| "Investigate before editing" prompt | `pre:edit-write:gateguard-fact-force` | Read file first, then edit |
| Config file edit blocked | `pre:config-protection` | Fix code, not config |
| MCP call failing | `pre:mcp-health-check` | Check MCP server status |
| Compaction suggested frequently | `pre:edit-write:suggest-compact` | Run `/compact` or disable |
| Bash command blocked | `pre:bash:dispatcher` | Review command safety |

---

## Understanding Hook Profiles

Hooks run based on profile settings. Before disabling hooks, understand what you're losing:

| Profile | Security Hooks | Quality Hooks | Convenience Hooks |
|---------|---------------|---------------|-------------------|
| `minimal` | ✗ | ✗ | ✓ (session only) |
| `standard` | ✓ | ✓ | ✓ |
| `strict` | ✓ | ✓ | ✓ |

**Warning**: Dropping to `minimal` disables security-relevant hooks like `pre:governance-capture` and `pre:config-protection`. Only do this for exploratory work in isolated environments.

---

## Common Blocks and Safe Resolutions

### 1. GateGuard Fact-Force Block

**Hook**: `pre:edit-write:gateguard-fact-force`

**Symptom**: First Edit/Write/MultiEdit to a file is blocked with a message demanding investigation.

**Purpose**: Prevents blind edits by forcing the agent to read the file, understand its structure, and identify importers/callers before modifying.

**Safe Resolution**:

```markdown
# DO: Read the file first
1. Read the target file
2. Identify importers and dependencies
3. Understand the data schema or API contract
4. Then proceed with the edit
```

**When to Disable**: Only for mass refactoring where you've already reviewed the codebase structure.

```bash
# Temporary disable for this session
export ECC_DISABLED_HOOKS=pre:edit-write:gateguard-fact-force
```

---

### 2. Config Protection Block

**Hook**: `pre:config-protection`

**Symptom**: Edits to linter/formatter config files (`.eslintrc`, `tsconfig.json`, `.prettierrc`, etc.) are blocked.

**Purpose**: Steers the agent to fix code that violates lint rules rather than weakening the rules to silence errors.

**Safe Resolution**:

```markdown
# DO: Fix the code, not the config
- If ESLint complains about unused variables → remove or use them
- If TypeScript reports type errors → fix the types
- If Prettier formatting fails → let it auto-format

# DON'T: Disable lint rules to silence warnings
```

**When to Disable**: Legitimate config changes (adding a new rule, upgrading config format).

```bash
# Disable for intentional config update
export ECC_DISABLED_HOOKS=pre:config-protection

# After config change, re-enable
unset ECC_DISABLED_HOOKS
```

---

### 3. MCP Health Check Block

**Hook**: `pre:mcp-health-check`

**Symptom**: MCP tool calls fail with "server unhealthy" message.

**Purpose**: Prevents wasted tokens calling an MCP server that's down or misconfigured.

**Safe Resolution**:

```bash
# 1. Check MCP server status
ecc status --json | jq '.mcp'

# 2. Restart the MCP server if needed
# (depends on your MCP configuration)

# 3. Verify connectivity
claude mcp status
```

**When to Disable**: Never recommended. If MCP is unhealthy, fix the server.

---

### 4. Suggest Compact Block

**Hook**: `pre:edit-write:suggest-compact`

**Symptom**: Repeated suggestions to run `/compact` during long sessions.

**Purpose**: Prevents context window exhaustion during large edits.

**Safe Resolution**:

```markdown
# Option A: Run compaction
/compact

# Option B: Ignore (it's a warning, not a block)
Continue working; the hook exits 0 and only suggests.
```

**When to Disable**: Low-context sessions where compaction isn't needed.

```bash
export ECC_DISABLED_HOOKS=pre:edit-write:suggest-compact
```

---

### 5. Bash Dispatcher Block

**Hook**: `pre:bash:dispatcher`

**Symptom**: Bash commands are blocked or flagged as potentially unsafe.

**Purpose**: Consolidated preflight check for:
- Quality gates (tmux, shell safety)
- Push validation (pre-push checks)
- GateGuard verification

**Safe Resolution**:

```markdown
# Review the specific sub-check that blocked:
1. If tmux-related: ensure tmux session exists for long-running commands
2. If push-related: run tests before pushing
3. If safety-related: reconsider the command
```

**When to Disable**: Not recommended for security reasons.

---

### 6. Governance Capture Block

**Hook**: `pre:governance-capture`

**Symptom**: Tool calls are logged; no block but adds latency.

**Purpose**: Captures secrets, policy violations, and approval requests for audit trail.

**Safe Resolution**:

```markdown
# This hook doesn't block; it logs.
# If concerned about latency, check ECC_GOVERNANCE_CAPTURE

# View governance log
cat ~/.ecc/governance/events.jsonl
```

**When to Disable**: Only in isolated test environments with no sensitive data.

```bash
# Disable governance capture (not recommended for production)
export ECC_GOVERNANCE_CAPTURE=0
```

---

### 7. Doc File Warning

**Hook**: `pre:write:doc-file-warning`

**Symptom**: Warning when creating non-standard documentation files.

**Purpose**: Prevents doc sprawl; encourages using established doc locations.

**Safe Resolution**:

```markdown
# Check if an existing doc location is appropriate:
- README.md for project overview
- docs/ for detailed documentation
- ADRs for architecture decisions

# If the new file is intentional, the warning can be ignored (exit 0)
```

**When to Disable**: When you have explicit approval to create new doc files.

```bash
export ECC_DISABLED_HOOKS=pre:write:doc-file-warning
```

---

## Safe Disable Patterns

### Single Hook Disable

```bash
# Disable one hook
export ECC_DISABLED_HOOKS=pre:edit-write:gateguard-fact-force
```

### Multiple Hook Disable

```bash
# Disable multiple hooks (comma-separated, no spaces)
export ECC_DISABLED_HOOKS=pre:edit-write:gateguard-fact-force,pre:config-protection
```

### Profile Downgrade

```bash
# Drop to minimal profile (preserves session hooks only)
export ECC_HOOK_PROFILE=minimal
```

### Complete Disable (Emergency Only)

```bash
# Disable all hooks (USE SPARINGLY)
export ECC_HOOKS_ENABLED=false
```

---

## Security Hooks (Never Disable Casually)

These hooks have security implications. Disable only with explicit approval:

| Hook | Risk if Disabled |
|------|------------------|
| `pre:governance-capture` | No audit trail of sensitive operations |
| `pre:config-protection` | Agent may weaken security configs |
| `pre:bash:dispatcher` | Unsafe shell commands may execute |
| `pre:mcp-health-check` | Tokens wasted on broken integrations |

---

## Managed Config Override

For persistent hook configuration, use `ecc/setup.json`:

```json
{
  "hooks": {
    "enabled": true,
    "profile": "standard",
    "disabled": [
      "pre:write:doc-file-warning"
    ]
  }
}
```

This file is checked by hooks when environment variables are not set.

---

## Debugging Hook Issues

### Check Current Hook State

```bash
# Current profile
echo $ECC_HOOK_PROFILE

# Disabled hooks
echo $ECC_DISABLED_HOOKS

# All hooks enabled?
echo $ECC_HOOKS_ENABLED

# Inspect managed config
cat ecc/setup.json 2>/dev/null || echo "No managed config"
```

### Verbose Hook Output

```bash
# Enable hook debug output
export ECC_HOOK_DEBUG=1

# Run a command to see which hooks fire
claude "list files"
```

### Hook Execution Log

Hooks write to stderr. Check terminal output for hook messages prefixed with `[ECC]`.

---

## Recovery Checklist

If you disabled hooks and need to restore safety:

1. **Unset environment overrides**:
   ```bash
   unset ECC_HOOKS_ENABLED
   unset ECC_HOOK_PROFILE
   unset ECC_DISABLED_HOOKS
   ```

2. **Verify hooks are active**:
   ```bash
   ecc status
   ```

3. **Review governance log** for any issues during disabled period:
   ```bash
   cat ~/.ecc/governance/events.jsonl | tail -20
   ```

4. **Run doctor** to check for drift:
   ```bash
   ecc doctor
   ```

---

## See Also

- [BBOS_FULL_ECC_SETUP.md](./BBOS_FULL_ECC_SETUP.md) — Full installation guide
- [hooks/hooks.json](../hooks/hooks.json) — Hook definitions
- [scripts/lib/hook-flags.js](../scripts/lib/hook-flags.js) — Hook flag implementation
