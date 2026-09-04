# BBOS Full ECC Setup Guide

Complete installation guide for running Everything Claude Code (ECC) across BBOS Factory environments, including Windows (PowerShell), WSL, and native Linux/macOS.

---

## Quick Start

### Windows (PowerShell)

```powershell
# Clone and install
git clone https://github.com/roongi/ECC.git
cd ECC
.\install.ps1 --profile core --target hermes --target cursor
```

### WSL / Linux / macOS

```bash
# Clone and install
git clone https://github.com/roongi/ECC.git
cd ECC
./install.sh --profile core --target hermes --target cursor
```

---

## Installation Options

### Profiles

ECC supports selective installation via profiles. Choose based on your workflow:

| Profile | Contents | Use Case |
|---------|----------|----------|
| `minimal` | Core harness configs only | Lightweight evaluation |
| `core` | Skills, agents, commands, rules | Standard development |
| `developer` | Core + advanced tooling | Full development environment |
| `security` | Security-focused rules and agents | Security-sensitive projects |

```bash
# Install core profile
./install.sh --profile core

# Install developer profile with all tooling
./install.sh --profile developer
```

### Targets

Install to specific harness targets:

| Target | Description | Config Location |
|--------|-------------|-----------------|
| `claude` | Claude Code CLI | `~/.claude/` |
| `cursor` | Cursor IDE | `~/.cursor/` or project `.cursor/` |
| `codex` | OpenAI Codex | `~/.codex/` |
| `hermes` | Hermes harness | `~/.hermes/` |
| `opencode` | OpenCode | `~/.opencode/` |
| `kiro` | Kiro harness | `~/.kiro/` |

```bash
# Install to Claude and Cursor
./install.sh --profile core --target claude --target cursor

# Install to Hermes only (for BBOS Factory integration)
./install.sh --profile core --target hermes

# Full multi-harness setup
./install.sh --profile developer --target hermes --target cursor --target claude
```

### Guided Installation

For interactive setup with step-by-step configuration:

```bash
./install.sh --guided
```

The guided wizard prompts for:
- Harness selection (multi-select)
- Profile selection
- Hook profile (minimal/standard/strict)
- Confirmation before applying changes

---

## Memory Vault

ECC Memory Vault provides cross-harness persistent context sharing. Factory Dialers can read from and write to the same vault that Claude Code, Codex, Hermes, and other harnesses use.

### Initialize Memory Vault

```bash
# Initialize project-scope vault
ecc memory init --scope project

# Initialize team-scope vault (for shared team context)
ecc memory init --scope team

# Initialize user-scope vault (follows operator across repos)
ecc memory init --scope user
```

### Vault Locations

| Scope | Location | Purpose |
|-------|----------|---------|
| Project | `<repo>/.ecc/memory/` | Repo-local context |
| Team | `<repo>/.ecc/memory/team/` | Shared team knowledge |
| User | `~/.ecc/memory/` | Personal cross-repo context |

### Memory Operations

```bash
# Save a handoff from Codex to Claude
ecc memory handoff --from codex --target claude --title "Auth migration handoff" --stdin

# Search memories for a harness
ecc memory search "migration blockers" --target-harness hermes

# Read a specific memory
ecc memory read mem_20260904_01kexample --scope project

# Health check
ecc memory doctor
```

### MCP Integration

Enable Memory Vault in MCP config for Factory Dialer integration:

```json
{
  "mcpServers": {
    "ecc-memory-vault": {
      "command": "ecc-memory-mcp",
      "env": {
        "ECC_MEMORY_HARNESS": "factory-dialer"
      }
    }
  }
}
```

### Memory Document Format

Memories use a strict schema (`ecc.memory.v1`) with JSON-valued YAML frontmatter:

```markdown
---
schema: "ecc.memory.v1"
id: "mem_20260904_01kexample"
title: "Authentication migration handoff"
kind: "handoff"
scope: "project"
trust: "unreviewed"
status: "active"
source_harness: "codex"
target_harnesses: ["claude", "hermes"]
tags: ["auth", "migration"]
links: []
created_at: "2026-09-04T08:00:00.000Z"
updated_at: "2026-09-04T08:00:00.000Z"
---

The token rotation tests pass. The remaining task is...
```

### Memory Trust Model

- All tool-created memories are `trust: "unreviewed"` by default
- Reviewed knowledge should be promoted to governed repository artifacts (rules, decision records, runbooks)
- The vault does not auto-promote context to instructions

---

## Hook Profiles

ECC hooks provide automation for code quality, governance, and session management. Choose a profile based on your tolerance for interruptions vs. enforcement:

### Profile Comparison

| Profile | Hooks Enabled | Use Case |
|---------|---------------|----------|
| `minimal` | Session persistence, cost tracking | Low-friction exploration |
| `standard` | Minimal + quality gates, compaction hints | Daily development (default) |
| `strict` | Standard + config protection, fact-forcing | High-assurance workflows |

### Setting Hook Profile

#### Environment Variable

```bash
# Set profile for current session
export ECC_HOOK_PROFILE=standard

# Or for a single command
ECC_HOOK_PROFILE=minimal claude "explore the codebase"
```

#### Managed Config

Create or edit `ecc/setup.json` in your ECC installation:

```json
{
  "hooks": {
    "enabled": true,
    "profile": "standard"
  }
}
```

### Profile Inheritance

Hook precedence (highest to lowest):
1. `ECC_HOOKS_ENABLED` / `ECC_HOOK_PROFILE` environment variables
2. `CLAUDE_PLUGIN_OPTION_HOOKS_ENABLED` / `CLAUDE_PLUGIN_OPTION_HOOK_PROFILE`
3. Managed config (`ecc/setup.json`)
4. Default: `enabled=true`, `profile=standard`

---

## Disabling Individual Hooks

Use `ECC_DISABLED_HOOKS` to disable specific hooks by ID without changing profile:

```bash
# Disable a single hook
export ECC_DISABLED_HOOKS=pre:edit-write:gateguard-fact-force

# Disable multiple hooks (comma-separated)
export ECC_DISABLED_HOOKS=pre:bash:dispatcher,pre:config-protection,stop:check-console-log
```

### Hook IDs Reference

| Hook ID | Profile | Description |
|---------|---------|-------------|
| `pre:bash:dispatcher` | standard,strict | Bash preflight quality checks |
| `pre:write:doc-file-warning` | standard,strict | Warn about non-standard doc files |
| `pre:edit-write:suggest-compact` | standard,strict | Suggest compaction at intervals |
| `pre:observe:continuous-learning` | standard,strict | Capture tool use for learning |
| `pre:governance-capture` | standard,strict | Log governance events |
| `pre:config-protection` | standard,strict | Block linter/formatter config changes |
| `pre:mcp-health-check` | standard,strict | Check MCP server health |
| `pre:edit-write:gateguard-fact-force` | standard,strict | Demand investigation before first edit |
| `pre:compact` | standard,strict | Save state before compaction |
| `session:start` | minimal,standard,strict | Load previous context |
| `session-start:plan-canvas-sessions` | standard,strict | Surface open review sessions |
| `post:dispatcher:sync` | standard,strict | Run sync PostToolUse hooks |
| `post:dispatcher:async` | standard,strict | Run async PostToolUse hooks |
| `post:mcp-health-check` | standard,strict | Track failed MCP calls |
| `post:skill:track` | standard,strict | Record skill failures |
| `stop:plan-canvas-pending` | minimal,standard,strict | Deliver pending feedback |
| `stop:format-typecheck` | standard,strict | Batch format/typecheck |
| `stop:check-console-log` | standard,strict | Check for console.log |
| `stop:session-end` | minimal,standard,strict | Persist session state |
| `stop:evaluate-session` | minimal,standard,strict | Extract patterns |
| `stop:cost-tracker` | minimal,standard,strict | Track token/cost metrics |
| `stop:desktop-notify` | standard,strict | Desktop notifications |
| `session:end:marker` | minimal,standard,strict | Session end lifecycle |

See [BBOS_HOOK_UNBLOCK.md](./BBOS_HOOK_UNBLOCK.md) for common block scenarios and safe unblock guidance.

---

## Dialer → ECC Skill Bridge

This section describes how a BBOS Factory Dialer can invoke ECC skills without embedding curriculum content or acting as a second conductor.

### Design Principles

1. **ECC is the Harness Layer**: ECC provides execution primitives (skills, agents, hooks)
2. **Dialer is the Orchestration Layer**: Factory Dialer decides what to execute, when
3. **No Secrets**: This bridge contains no paid Skool content, API keys, or credentials
4. **Additive Only**: Integration does not modify existing ECC behavior

### Skill Discovery

ECC skills use the agentskills.io format. Discovery methods:

```bash
# List all available skills
ls ~/.claude/skills/ | head -20

# Search skills by keyword
grep -l "code review" ~/.claude/skills/*/SKILL.md

# Use ECC catalog
ecc catalog components --family skill
```

### Skill Invocation

Skills activate automatically when agent context matches the skill description. For explicit invocation:

```markdown
# In prompt or CLAUDE.md
Use the skill: coding-standards

# Or reference directly
Read and follow: ~/.claude/skills/coding-standards/SKILL.md
```

### Programmatic Invocation (Dialer Pattern)

```python
# Factory Dialer (pseudocode)
import subprocess
import json

def invoke_ecc_skill(skill_name: str, prompt: str) -> str:
    """Invoke an ECC skill via Claude Code CLI."""
    result = subprocess.run([
        "claude",
        "--skill", skill_name,
        prompt
    ], capture_output=True, text=True)
    return result.stdout

def run_code_review(pr_url: str) -> dict:
    """Use ECC code-reviewer agent for PR review."""
    result = subprocess.run([
        "claude",
        "--context", "agents/code-reviewer.md",
        f"Review PR: {pr_url}"
    ], capture_output=True, text=True)
    return parse_review(result.stdout)
```

### Agent Factory Curriculum → ECC Skill Mapping

Reference mapping for Factory course content to ECC skills:

| Factory Course | ECC Skill(s) |
|---------------|--------------|
| Course 7: Skills & Connectors | `skills/configure-ecc/` |
| Course 14: Claude Code | `skills/coding-standards/` |
| Course 19: Spec-Driven Dev | `skills/spec-driven-development/` |
| Course 21: Loop Engineering | `skills/autonomous-loops/`, `skills/continuous-agent-loop/` |
| Course 22: Harness Engineering | `skills/autonomous-agent-harness/` |
| Course 24: Trusting the Checker | `skills/eval-harness/`, `skills/verification-loop/` |

### Cole Medin PIV → ECC Commands

| PIV Phase | ECC Command(s) |
|-----------|---------------|
| Prime | `/docs` (Context7), `/plan --prime` |
| Plan | `/plan`, `/multi-plan`, `/plan-prd` |
| Implement | `/prp-implement`, `/multi-execute` |
| Validate | `/tdd`, `/code-review`, `/e2e` |

### Private OS Repos

For BBOS-specific skills and workflows that extend ECC:

1. **Skill Federation**: Register BBOS skills additively using `bbos/skill-register-template.json`
2. **Memory Handoff**: Use Memory Vault MCP for context sharing between Factory and ECC harnesses
3. **Governance Events**: Enable `ECC_GOVERNANCE_CAPTURE=1` to log events to `~/.ecc/governance/events.jsonl`

Refer to your BBOS private OS repo documentation for organization-specific skill registration and federation patterns.

---

## Verification

After installation, verify ECC is working:

```bash
# Check install status
ecc status

# Run doctor diagnostics
ecc doctor --target cursor
ecc doctor --target hermes

# List installed components
ecc list-installed --json

# Verify hook flags
ECC_HOOK_PROFILE=standard node -e "console.log(require('./scripts/lib/hook-flags').getHookProfile())"
```

---

## Troubleshooting

### Windows PowerShell Issues

If `install.ps1` fails with execution policy errors:

```powershell
# Allow script execution for current session
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process

# Then run install
.\install.ps1 --profile core --target cursor
```

### WSL Node.js Path Issues

Ensure Node.js is in PATH:

```bash
# Check Node.js
which node
node --version

# If missing, install via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
```

### Hook Interference

If hooks are blocking work inappropriately:

```bash
# Temporarily disable all hooks
export ECC_HOOKS_ENABLED=false

# Or use minimal profile
export ECC_HOOK_PROFILE=minimal

# Or disable specific hook
export ECC_DISABLED_HOOKS=pre:edit-write:gateguard-fact-force
```

See [BBOS_HOOK_UNBLOCK.md](./BBOS_HOOK_UNBLOCK.md) for detailed unblock guidance.

---

## See Also

- [BBOS_ECC_COMPARE.md](./BBOS_ECC_COMPARE.md) — Full capability mapping between frameworks
- [BBOS_HOOK_UNBLOCK.md](./BBOS_HOOK_UNBLOCK.md) — Hook unblock guidance
- [docs/bbos-bridge/README.md](./bbos-bridge/README.md) — Dialer bridge protocol
- [docs/design/ecc-memory-vault.md](./design/ecc-memory-vault.md) — Memory Vault design spec
