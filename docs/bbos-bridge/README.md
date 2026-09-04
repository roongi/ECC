# BBOS Factory → ECC Bridge

This document describes how a BBOS Factory Dialer can invoke ECC skills, agents, and hooks without embedding paid curriculum content or acting as a second conductor.

---

## Design Principles

1. **ECC is the Harness Layer**: ECC provides execution primitives (skills, agents, hooks)
2. **Dialer is the Orchestration Layer**: Factory Dialer decides what to execute, when
3. **No Secrets**: This bridge contains no paid Skool content, API keys, or credentials
4. **Additive Only**: This integration does not modify existing ECC behavior
5. **Catalog ≠ Live**: Skill references are descriptive, not active deployments

---

## Skill Invocation Pattern

### Discovery: Find Skills by Description

ECC skills use the agentskills.io format with description-based discovery:

```bash
# List all available skills
ls ~/.claude/skills/ | head -20

# Search skills by keyword
grep -l "code review" ~/.claude/skills/*/SKILL.md
```

### Invocation: Via Claude Code CLI

Skills activate automatically when the agent context matches the skill description. To explicitly invoke:

```markdown
# In your prompt or CLAUDE.md
Use the skill: coding-standards

# Or reference directly
Read and follow: ~/.claude/skills/coding-standards/SKILL.md
```

### Programmatic Invocation

For Dialer-style orchestration, invoke skills via the Claude Code CLI:

```bash
# Start a session with specific skill context
claude --skill coding-standards "Review this code"

# Or via the ECC CLI
ecc skill activate coding-standards
```

---

## Agent Invocation Pattern

### Available Agents

ECC provides 68 specialized agents in `agents/`. Each has:
- YAML frontmatter (name, description, tools, model)
- Markdown instructions

### Invocation via Subagent Spawn

```markdown
# In your prompt
Spawn the code-reviewer agent to review the changes in this PR.

# The agent definition lives at:
# agents/code-reviewer.md
```

### Direct Agent Reference

```bash
# Read agent definition
cat ~/.claude/agents/planner.md

# Invoke via Claude Code
claude --context agents/planner.md "Plan this feature"
```

---

## Memory Handoff Protocol

### ECC Memory Options

| MCP Server | Use Case |
|------------|----------|
| `ecc-memory-vault` | Shared project/team memory |
| `omega-memory` | Semantic search + knowledge graphs |
| `longhand` | Verbatim session recall |

### Bridge Pattern

Factory system of record can sync to ECC memory via:

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

### Memory Write Protocol

```markdown
# Factory writes to ECC memory
Use MCP tool: ecc_memory_create
{
  "scope": "project",
  "key": "factory-state",
  "value": "{ ... factory state JSON ... }"
}
```

---

## Hook Forwarding Protocol

### ECC Hooks Available

| Hook Type | Purpose |
|-----------|---------|
| PreToolUse | Intercept before tool execution |
| PostToolUse | Process after tool execution |
| PreCompact | Capture before context compaction |

### Governance Event Capture

Factory audit trail can subscribe to ECC governance events:

```bash
# Enable governance capture
export ECC_GOVERNANCE_CAPTURE=1

# Events written to:
# ~/.ecc/governance/events.jsonl
```

### Event Schema

```json
{
  "timestamp": "2026-09-04T05:33:00Z",
  "event": "tool_use",
  "tool": "Write",
  "path": "/path/to/file",
  "outcome": "allowed",
  "hook_id": "pre:write:doc-file-warning"
}
```

---

## Skill-to-Factory Mapping

### Agent Factory Curriculum → ECC Skills

| Factory Course | ECC Skill(s) |
|---------------|--------------|
| Course 7: Skills & Connectors | `skills/configure-ecc/` |
| Course 14: Claude Code | `skills/coding-standards/` |
| Course 19: Spec-Driven Development | `skills/spec-driven-development/` |
| Course 21: Loop Engineering | `skills/autonomous-loops/`, `skills/continuous-agent-loop/` |
| Course 22: Harness Engineering | `skills/autonomous-agent-harness/`, `skills/agent-harness-construction/` |
| Course 24: Trusting the Checker | `skills/eval-harness/`, `skills/verification-loop/` |
| Course 39: Build AI Agents | `skills/agentic-engineering/`, `skills/agentic-os/` |

### Cole Medin PIV → ECC Commands

| PIV Phase | ECC Command(s) |
|-----------|---------------|
| Prime | `/docs` (Context7), `/plan --prime` |
| Plan | `/plan`, `/multi-plan`, `/plan-prd` |
| Implement | `/prp-implement`, `/multi-execute` |
| Validate | `/tdd`, `/code-review`, `/e2e` |

---

## Integration Examples

### Example 1: Factory Dialer Calls ECC Code Review

```python
# Factory Dialer (pseudocode)
def run_code_review(pr_url: str):
    # Invoke ECC code-reviewer agent
    result = subprocess.run([
        "claude",
        "--context", "agents/code-reviewer.md",
        f"Review PR: {pr_url}"
    ], capture_output=True)
    return parse_review(result.stdout)
```

### Example 2: Factory State → ECC Memory

```python
# Factory Dialer writes to ECC memory
def sync_factory_state(state: dict):
    # Use MCP protocol
    mcp_call("ecc-memory-vault", "create", {
        "scope": "project",
        "key": "factory-state",
        "value": json.dumps(state)
    })
```

### Example 3: ECC Hooks → Factory Audit

```python
# Factory Dialer reads ECC governance events
def collect_audit_trail():
    events = []
    with open(os.path.expanduser("~/.ecc/governance/events.jsonl")) as f:
        for line in f:
            events.append(json.loads(line))
    return events
```

---

## Limitations

1. **No Second Conductor**: This bridge is passive; Dialer orchestrates
2. **No Paid Content**: Curriculum references are public-only
3. **No Direct Database Access**: Use MCP for memory, not raw SQL
4. **Catalog Only**: Skill listings are reference, not deployment

---

## See Also

- [BBOS_ECC_COMPARE.md](../BBOS_ECC_COMPARE.md) - Full capability mapping
- [INTEGRATION_GAP_MATRIX.md](../INTEGRATION_GAP_MATRIX.md) - Gap analysis
- [Agent Factory Curriculum](https://agentfactory.panaversity.org) - Public course docs
- [agentskills.io](https://agentskills.io) - Skill format standard
