# Integration Gap Matrix: ECC ↔ BBOS Factory

This document maps what ECC already covers, what BBOS/Dissler factory patterns have that ECC lacks, what ECC has that factory patterns lack, and recommends a merge plan positioning ECC as the harness layer under a BBOS factory Dialer.

---

## Coverage Matrix

### Legend

- **✅ Full**: Complete implementation
- **⚡ Partial**: Implemented but could be extended
- **❌ Missing**: Not currently implemented
- **N/A**: Not applicable to this framework

---

## Section 1: What ECC Already Covers

| Capability | ECC Implementation | Maturity |
|------------|-------------------|----------|
| **Skill Format (SKILL.md)** | 286 skills in `skills/`, agentskills.io compliant | ✅ Production |
| **Multi-Harness Support** | Claude, Cursor, Codex, OpenCode, Kiro, Gemini, Qwen | ✅ Production |
| **Agent Orchestration** | 68 specialized agents with frontmatter metadata | ✅ Production |
| **Hook System** | PreToolUse, PostToolUse, PreCompact with Node.js scripts | ✅ Production |
| **MCP Integration** | 14 preconfigured servers in `mcp-configs/` | ✅ Production |
| **Cross-Platform Install** | macOS, Linux, Windows, WSL via install.sh/install.ps1 | ✅ Production |
| **PIV Loop** | plan → implement → validate via commands | ✅ Production |
| **Code Review Automation** | `code-reviewer` agent (13K+ lines of logic) | ✅ Production |
| **TDD Workflow** | `tdd-guide` agent, `/tdd` command | ✅ Production |
| **E2E Testing** | `e2e-runner` agent, Playwright MCP | ✅ Production |
| **Security Review** | `security-reviewer` agent, governance hooks | ✅ Production |
| **Context Management** | Compaction hooks, context budget skills | ✅ Production |
| **Documentation Lookup** | Context7 MCP, `docs-lookup` agent | ✅ Production |
| **Session Persistence** | Memory MCPs, session commands | ✅ Production |
| **Worktree Management** | `worktree-lifecycle.js`, orchestration scripts | ✅ Production |
| **Language-Specific Rules** | 22 rulesets (TypeScript, Python, Rust, Go, etc.) | ✅ Production |
| **Build Error Resolution** | 10+ build resolver agents (cpp, go, java, rust, etc.) | ✅ Production |
| **Continuous Learning** | v2 skill with observation hooks | ⚡ Beta |
| **Agent Evaluation** | `agent-evaluator` agent, eval harness skill | ⚡ Beta |
| **Cost Tracking** | `/cost-report` command | ⚡ Beta |

---

## Section 2: What BBOS Factory Has That ECC Lacks

| Factory Capability | Gap in ECC | Severity | Recommended Action |
|-------------------|------------|----------|-------------------|
| **Dialer Conductor Pattern** | No centralized orchestration daemon | Medium | Add thin bridge stub (see Section 4) |
| **System of Record (Postgres + pgvector)** | Memory via MCP, no structured DB | Medium | Document bridge pattern, not core ECC |
| **Semantic Recall Pipeline** | No embedding generation workflow | Low | Reference existing MCP (omega-memory) |
| **Audit Trail as Discipline** | Governance capture exists but not transactional | Low | Extend governance hooks |
| **Digital FTE Identity** | Agents are tools, not "employees" | Philosophy | No action needed |
| **Factory-as-Code (factory.yaml)** | Distributed configs, no single manifest | Low | AGENTS.md serves this role |
| **Curriculum-Driven Onboarding** | No structured learning path | Low | Out of scope for ECC |
| **Rungs/Graduated Autonomy (L0-L4)** | Implicit in agent selection | Low | Document mapping |
| **Dollarized Portfolio Scoring** | No ROI-based agent selection | Low | Business concern, not harness |
| **MCP Server Custom Build** | Uses existing servers, no generator | Low | Out of scope |
| **Neon Postgres MCP** | Not preconfigured | Low | Add to mcp-configs if needed |
| **Worker Schema (conversations, documents, embeddings)** | Memory is unstructured | Low | Bridge concern |
| **Benchmark Self-Improvement Loop** | Manual benchmark methodology skill | Medium | Extend eval harness |
| **Cloudflare/E2B/Modal Sandbox Swap** | Local sandbox only | Low | Infrastructure concern |

### Priority Gaps to Address

1. **Dialer Bridge Stub**: Factory patterns need a single entry point that dispatches to ECC skills
2. **Benchmark Automation**: Extend eval harness to support automated config optimization
3. **Audit Trail Enhancement**: Make governance capture transactional with rollback support

---

## Section 3: What ECC Has That Factory Lacks

| ECC Capability | Factory Gap | Value Add |
|----------------|-------------|-----------|
| **Multi-Harness Portability** | Factory focuses on Claude Code + Codex only | ECC works across 7+ harnesses |
| **68 Specialized Agents** | Factory has generalist approach | Domain-specific reviewers for 15+ languages |
| **Hook System (PreToolUse/PostToolUse)** | Factory relies on SDK events | Intercept and modify tool calls |
| **14 Preconfigured MCPs** | Build-your-own approach | Jira, GitHub, Firecrawl, Supabase, etc. |
| **Production Hooks Library** | No equivalent | Config protection, MCP health, fact-forcing |
| **Cross-Platform Install** | Assumes Linux/Mac | Windows/WSL first-class support |
| **Legacy Command Shims** | N/A | Migration path from v1 |
| **Sponsorship/Monetization Model** | Curriculum monetization focus | Open source sustainability |
| **Spanish/Chinese/German Docs** | English only | `docs/es/`, `docs/zh-CN/`, `docs/de-DE/` |
| **Plugin Ecosystem** | N/A | `.claude-plugin/`, `.codex-plugin/` |
| **Session Management Commands** | SDK sessions only | Save/resume/inspect sessions |
| **Marketing Agent** | N/A | Content generation workflow |
| **Network Architecture Agents** | N/A | `network-architect`, `network-troubleshooter` |
| **Healthcare Review** | N/A | `healthcare-reviewer` agent |
| **GAN Evaluation** | N/A | `gan-evaluator`, `gan-generator`, `gan-planner` |

---

## Section 4: Recommended Merge Plan

### Architecture: ECC as Harness Layer Under BBOS Factory Dialer

```
┌─────────────────────────────────────────────────────────┐
│                    BBOS Factory Dialer                   │
│  (Conductor: orchestrates Digital FTEs, manages state)   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────────┐│
│  │              ECC Harness Layer                      ││
│  │  (Skills, Hooks, Agents, Multi-Harness Execution)   ││
│  ├─────────────────────────────────────────────────────┤│
│  │                                                     ││
│  │  skills/     agents/     hooks/     mcp-configs/   ││
│  │  (286)       (68)        (15+)      (14)           ││
│  │                                                     ││
│  └─────────────────────────────────────────────────────┘│
│                                                         │
├─────────────────────────────────────────────────────────┤
│  Claude Code │ Cursor │ Codex │ OpenCode │ Kiro │ etc. │
└─────────────────────────────────────────────────────────┘
```

### Integration Points

| Integration Point | Implementation |
|------------------|----------------|
| **Dialer → ECC Skills** | Dialer calls ECC skills by description match |
| **Dialer → ECC Agents** | Dialer spawns ECC agents as subprocesses |
| **Factory State → ECC Memory** | Bridge to `ecc-memory-vault` MCP |
| **Factory Audit → ECC Governance** | Forward to governance capture hooks |
| **Factory Evals → ECC Harness** | Use `skills/eval-harness/` for benchmarking |

### Phase 1: Bridge Stub (This PR)

Create `docs/bbos-bridge/README.md` documenting:

1. How Dialer can invoke ECC skills via CLI or MCP
2. Skill discovery pattern (search by description)
3. Agent invocation pattern (spawn with context)
4. Memory handoff protocol

### Phase 2: Adapter Skill (Future)

Create `skills/bbos-factory-adapter/SKILL.md`:

1. Accept Dialer commands in factory format
2. Translate to ECC skill/agent invocations
3. Return results in factory-expected schema

### Phase 3: System of Record Bridge (Future)

Create `skills/system-of-record-bridge/SKILL.md`:

1. Connect ECC memory MCPs to factory Postgres schema
2. Sync conversation state
3. Forward audit events

---

## Section 5: OS Variant Coverage

| Variant | ECC Status | Factory Status | Gap |
|---------|------------|---------------|-----|
| **macOS Intel** | ✅ Full | ✅ Full | None |
| **macOS Apple Silicon** | ✅ Full | ✅ Full | None |
| **Linux x64** | ✅ Full | ✅ Full | None |
| **Linux ARM64** | ✅ Full | ⚡ Partial | None for ECC |
| **Windows 10/11** | ✅ Full (`install.ps1`) | ❌ Limited | ECC advantage |
| **WSL 1** | ✅ Full (bash) | ⚡ Partial | None for ECC |
| **WSL 2** | ✅ Full (bash) | ✅ Full | None |
| **Docker** | ⚡ Partial (`docker/`) | ✅ Full | Extend ECC docker |

### Install Script Coverage

| Script | Platforms | Features |
|--------|-----------|----------|
| `install.sh` | macOS, Linux, WSL | Auto-dependency, symlink resolution, MSYS2/Git Bash support |
| `install.ps1` | Windows | Symlink resolution, npm install, error handling |

---

## Section 6: Non-Goals

The following are explicitly NOT part of ECC's scope:

| Item | Reason |
|------|--------|
| **Private Paid Curriculum** | Operator rule: must not be published |
| **Second Conductor** | Operator rule: no second conductor |
| **Catalog = Live Deployment** | Catalog is reference, not production |
| **Deletion of Existing Content** | Operator rule: never delete |
| **Factory Authentication** | Infrastructure concern |
| **Worker Deployment to Cloud** | Out of scope |

---

## Section 7: Gap Priority Matrix

| Gap | Impact | Effort | Priority |
|-----|--------|--------|----------|
| Dialer bridge stub | High | Low | **P1 - This PR** |
| Benchmark automation | Medium | Medium | P2 |
| Audit trail enhancement | Medium | Low | P2 |
| Neon Postgres MCP | Low | Low | P3 |
| Graduated autonomy docs | Low | Low | P3 |
| Docker improvements | Low | Medium | P3 |

---

## Conclusion

ECC provides a mature, production-ready harness layer that implements the majority of BBOS factory patterns at the execution level. The primary gap is the absence of a centralized Dialer/Conductor pattern, which is intentionally out of scope for ECC as a harness.

The recommended integration model positions:
- **BBOS Factory** as the strategic orchestration layer (what to build, which FTE, what outcome)
- **ECC** as the tactical execution layer (how to build, which skills, which hooks)

This separation maintains ECC's harness-agnostic philosophy while enabling factory-style orchestration when needed.
