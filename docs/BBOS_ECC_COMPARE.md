# BBOS Factory ↔ ECC Comparison

A mapping between Everything Claude Code (ECC) capabilities and the BBOS/Dissler Agent Factory curriculum, Cole Medin's 5 Pillars, Pete/PIV/PITER patterns, and Clay factory frameworks.

## Overview

| Framework | Focus | Primary Users |
|-----------|-------|---------------|
| **ECC** | Production-ready agent harness with skills, hooks, agents, and multi-harness support | Engineers using Claude Code, Cursor, Codex, OpenCode |
| **Agent Factory (Dissler/Panaversity)** | Curriculum-driven agent construction with Skills, MCP, and system of record | Knowledge workers and engineers building Digital FTEs |
| **Cole Medin PIV Loop** | Three-phase methodology: Plan-Implement-Validate per ticket | Teams doing parallel agent coding |
| **Clay/YOKE** | Daemon-based vendor adapter for Claude Code/Codex with web workspace | Multi-user, multi-vendor orchestration |

---

## Part 1: ECC ↔ Agent Factory Curriculum (Lessons 1–14)

### Foundation Concepts (Lessons 1–3)

| Agent Factory Concept | ECC Equivalent | Notes |
|----------------------|----------------|-------|
| **2025 Inflection Point** (L1) | `AGENTS.md` Core Principles, `the-longform-guide.md` | ECC documents production-readiness and agent-first philosophy |
| **LLM Constraints** (stateless, probabilistic, context limits) (L2) | `skills/context-budget/`, hooks for context management | ECC implements compaction hooks (`suggest-compact.js`) and context budget skills |
| **OODA Loop** (human as orchestrator) (L3) | Agent orchestration in `AGENTS.md`, planner/architect agents | ECC's planner, architect, and loop-operator agents embody orchestration |

### Technical Architecture (Lessons 4–5)

| Agent Factory Concept | ECC Equivalent | Notes |
|----------------------|----------------|-------|
| **Five Powers** (See, Hear, Reason, Act, Remember) | MCP configs, memory hooks, 68 specialized agents | ECC implements Remember via `ecc-memory-vault`, `omega-memory`, `longhand` MCPs |
| **Three-Layer AI Stack** | `skills/` (capability), `agents/` (domain), `hooks/` (automation) | Direct structural alignment |
| **AIFF Standards** (MCP, AGENTS.md, Agent Skills) | `AGENTS.md`, `CLAUDE.md`, `mcp-configs/`, 286 skills | ECC predates and implements these standards |

### Claude Code Essentials (Lessons 6–8)

| Agent Factory Concept | ECC Equivalent | Notes |
|----------------------|----------------|-------|
| **CLI Interface mastery** | `scripts/ecc.js`, install scripts, CLI commands | Full CLI support via `ecc` command |
| **CLAUDE.md persistent context** | Root `CLAUDE.md`, per-harness configs | Plus `.codex/`, `.kiro/`, `.opencode/` for multi-harness |
| **Custom instructions** | `rules/` directory (22 language-specific rulesets) | TypeScript, Python, Rust, Go, Kotlin, Swift, etc. |
| **Agent Skills** | `skills/` (286 skills with `SKILL.md` format) | Fully compliant with agentskills.io standard |
| **Subagent orchestration** | 68 agents in `agents/`, Task delegation patterns | planner, code-reviewer, tdd-guide, security-reviewer, etc. |

### MCP & Integration (Lessons 9–14)

| Agent Factory Concept | ECC Equivalent | Notes |
|----------------------|----------------|-------|
| **MCP server integration** | `mcp-configs/mcp-servers.json` (14 preconfigured servers) | GitHub, Jira, Firecrawl, Supabase, Context7, ClickHouse, etc. |
| **Compile MCP to Skills** | Skills that wrap MCP functionality | `skills/documentation-lookup/`, `skills/codehealth-mcp/` |
| **Settings hierarchy** | `.claude/`, `.cursor/`, harness-specific configs | Multi-harness precedence implemented |
| **Hooks for automation** | `hooks/hooks.json` (PreToolUse, PostToolUse, PreCompact) | Pre-bash dispatcher, governance capture, config protection, etc. |
| **Plugin discovery** | `plugins/`, `.claude-plugin/`, `.codex-plugin/` | Plugin ecosystem support |

---

## Part 2: Cole Medin's 5 Pillars

| Pillar | ECC Implementation | Coverage |
|--------|-------------------|----------|
| **1. Issue as Spec** | `commands/plan.md`, `commands/plan-prd.md`, `skills/spec-driven-development/` | Full PRD → ticket workflows |
| **2. Git Worktrees for Isolation** | `scripts/worktree-lifecycle.js`, `scripts/orchestrate-worktrees.js` | Native worktree management |
| **3. PIV Loop per Worktree** | `commands/prp-plan.md`, `commands/prp-implement.md`, `/tdd` command | Plan-Review-Implement cycle |
| **4. Fresh Context for Review** | `code-reviewer` agent, separate context via subagents | Reviewer never sees writer's context |
| **5. Self-Healing AI Layer** | `skills/continuous-learning/`, `skills/continuous-learning-v2/`, hooks for learning | Bugs → rule improvements via observation hooks |

### PIV Loop Mapping

| PIV Phase | ECC Commands/Skills |
|-----------|-------------------|
| **Prime** (load context) | `/plan` with `--prime`, Context7 MCP for docs lookup |
| **Plan** (structured approach) | `commands/plan.md`, `commands/multi-plan.md`, `planner` agent |
| **Implement** (fresh context) | `commands/prp-implement.md`, `commands/multi-execute.md` |
| **Validate** (5-layer pyramid) | `tdd-guide` agent, `e2e-runner` agent, `code-reviewer` agent |

### Validation Pyramid (Cole Medin)

| Layer | ECC Coverage |
|-------|-------------|
| Layer 1: Type checking + linting | Rules in `rules/typescript/`, `rules/python/`, etc. + hooks |
| Layer 2: Unit tests | `tdd-guide` agent, `commands/tdd.md`, `/test-coverage` |
| Layer 3: Integration/E2E | `e2e-runner` agent, `commands/e2e.md`, Playwright MCP |
| Layer 4: Code review | `code-reviewer` agent (13,877 bytes of review logic) |
| Layer 5: Manual testing | `computerUse` subagent type, browser QA skills |

---

## Part 3: Pete/PIV vs PITER Patterns

| Pattern | Definition | ECC Coverage |
|---------|-----------|--------------|
| **PIV** (Plan, Implement, Validate) | Per-ticket execution cycle | Full via commands and agents |
| **PITER** (Plan, Implement, Test, Evaluate, Refactor) | Extended cycle with explicit refactor | `refactor-cleaner` agent, `/refactor-clean` command |
| **Pete** (Principled Engineering Through Enforcement) | Rules-based constraint system | `hooks/hooks.json` with PreToolUse/PostToolUse enforcement |

### PITER Extended Cycle in ECC

| Phase | ECC Component |
|-------|---------------|
| Plan | `planner` agent, `/plan` command |
| Implement | Harness-specific implementation (Claude/Cursor/Codex) |
| Test | `tdd-guide` agent, test coverage commands |
| Evaluate | `agent-evaluator` agent, `skills/agent-eval/` |
| Refactor | `refactor-cleaner` agent, dead code cleanup |

---

## Part 4: Clay v2/v3 Factory Teams (17) and 22 Functions

### YOKE Adapter Layer Equivalents

| Clay/YOKE Concept | ECC Equivalent |
|-------------------|----------------|
| **Vendor-agnostic adapter** | Multi-harness configs: `.claude/`, `.codex/`, `.opencode/`, `.cursor/`, `.kiro/` |
| **Cross-vendor instruction merging** | `AGENTS.md` + `CLAUDE.md` + harness-specific configs |
| **Claude Agent SDK** | Native Claude Code support |
| **Codex app-server JSON-RPC** | `.codex/config.toml`, Codex agent definitions |

### Factory Functions Mapping

| Clay Function Category | ECC Mapping |
|----------------------|-------------|
| **Auth + RBAC** | Governance hooks, `skills/security-review/` |
| **Project Context** | `CLAUDE.md`, `AGENTS.md`, per-project configs |
| **Session Management** | `commands/sessions.md`, `scripts/sessions-cli.js` |
| **Push Notifications** | Hooks with async notification support |
| **MCP Bridge** | `mcp-configs/mcp-servers.json`, MCP health check hooks |

### 17 Factory Teams → ECC Agent Mapping

ECC provides 68 specialized agents covering equivalent domains:

| Domain | ECC Agents |
|--------|-----------|
| **Architecture** | `architect`, `code-architect` |
| **Code Review** | `code-reviewer`, `typescript-reviewer`, `python-reviewer`, etc. |
| **Build Resolution** | `build-error-resolver`, `cpp-build-resolver`, `go-build-resolver`, etc. |
| **Testing** | `tdd-guide`, `e2e-runner` |
| **Security** | `security-reviewer` |
| **Documentation** | `doc-updater`, `docs-lookup` |
| **Planning** | `planner`, `chief-of-staff` |
| **ML/AI** | `mle-reviewer`, `pytorch-build-resolver`, `rag-pipeline-reviewer` |
| **Performance** | `performance-optimizer`, `harness-optimizer` |
| **Operations** | `loop-operator` |

---

## Part 5: Federation ADWs (Agent Developer Workflows)

### ADW Pattern Recognition

| ADW Pattern | ECC Implementation |
|-------------|-------------------|
| **Deterministic Python orchestration** | Node.js-based `scripts/` (cross-platform) |
| **Factory-as-code (factory.yaml)** | `AGENTS.md` + `hooks/hooks.json` + skills manifests |
| **Self-improvement loops** | `skills/continuous-learning-v2/`, observation hooks |
| **Benchmark-driven config optimization** | `skills/benchmark-methodology/`, `skills/eval-harness/` |
| **Skill federation across agents** | Portable skills format, multi-harness support |

### Federation Architecture

| Federation Concept | ECC Coverage |
|-------------------|--------------|
| **Skill portability** | agentskills.io compliant `SKILL.md` format |
| **Cross-harness execution** | Claude Code, Cursor, Codex, OpenCode, Kiro, Gemini, Qwen |
| **Shared memory layer** | `ecc-memory-vault`, `omega-memory`, `longhand` MCPs |
| **Governance federation** | Centralized hooks, per-harness overrides |

---

## Part 6: OS/Platform Install Variants

### ECC Cross-Platform Coverage

| Platform | Install Method | Config Location |
|----------|---------------|-----------------|
| **macOS** | `install.sh`, npm global | `~/.claude/` |
| **Linux** | `install.sh`, npm global | `~/.claude/` |
| **Windows** | `install.ps1`, npm global | `%USERPROFILE%\.claude\` |
| **WSL** | `install.sh` (Linux variant) | `~/.claude/` |

### Harness-Specific Configs

| Harness | Config Directory | Notes |
|---------|-----------------|-------|
| Claude Code | `.claude/` | Primary, full support |
| Cursor | `.cursor/` | Rules, hooks, skills |
| Codex | `.codex/` | `config.toml`, agents |
| OpenCode | `.opencode/` | `opencode.json`, commands |
| Kiro | `.kiro/` | Skills, steering, hooks |
| Gemini | `.gemini/` | `GEMINI.md` |
| Qwen | `.qwen/` | `QWEN.md` |
| Zed | `.zed/` | Planned |
| Trae | `.trae/` | Planned |

---

## Part 7: Monetization & Business Model

### ECC Sponsorship Model

| Tier | Monthly | Perks |
|------|---------|-------|
| Supporter | $10 | Badge, release notes |
| Builder | $25 | SPONSORS.md listing |
| Pro | $50 | SPONSORS.md listing |
| Team | $200 | SPONSORS.md listing |
| Business | $800 | README placement |
| Strategic | $3,700 | Premium placement, coordination call |

### Revenue Streams

- **Open Source Core**: MIT licensed, free for all
- **GitHub Sponsors**: Recurring sponsorship tiers
- **AgentShield**: Security scanning service (planned)
- **ECC Pro**: Fleet dashboard, enterprise features (planned)
- **Integration Partnerships**: CodeRabbit, Greptile, Atlas Cloud, Moonshot AI, Itô

---

## Summary: Framework Convergence

| Capability | Agent Factory | Cole Medin | Clay/YOKE | ECC |
|------------|--------------|------------|-----------|-----|
| Skills format | SKILL.md | Custom | N/A | SKILL.md (286) |
| Agent orchestration | Via SDK | Parallel worktrees | YOKE adapters | 68 agents + hooks |
| Memory persistence | System of record | Git log | Session storage | MCP servers |
| Multi-harness | N/A | N/A | Claude + Codex | 7+ harnesses |
| Self-improvement | Evals | Rule updates | N/A | Continuous learning v2 |
| Governance | Course 10 | Layer 4-5 | RBAC | Hooks + rules |

ECC serves as a production-ready implementation layer that aligns with all major agent frameworks while providing harness-agnostic portability and enterprise-ready hooks.
