# Graph Prompting Index — CodeAlpha_EcommerceStore

## What this is

Standard specs describe a system in prose. An AI coding agent (Antigravity, Claude Code, Cursor) reading prose has to *infer* the dependency structure — which component calls which, what must exist before what, which change radius a single prompt should touch. That inference is where most agentic-coding failures come from: cross-file wiring bugs, missing middleware, auth bypassed because the agent didn't know a guard existed three files away.

**Graph prompting** removes the inference step. Each file below encodes one subsystem as an explicit graph:

```
NODES: [ComponentA, ComponentB, ComponentC]
EDGES: [
  ComponentA --calls--> ComponentB,
  ComponentB --writes--> ComponentC
]
```

The agent is instructed to treat the adjacency list as ground truth, not a suggestion — if it wants to add an edge (a new dependency) it must say so explicitly rather than silently wiring it in.

## How to use these files with an agent

1. Paste the relevant graph file into the agent's context **before** the phase's build prompt (e.g., paste `02_auth_rbac_graph.md` before "now implement Phase 1 — Auth").
2. Instruct the agent: *"Treat the node list as the only components you may create in this phase. Treat the edge list as the only calls/writes you may implement. If you need an edge not listed here, stop and ask."*
3. This keeps each prompt scoped to one micro-feature (per the iterative-scaffolding principle) and gives the agent a checkable contract — you can literally diff its output against the edge list to catch scope creep.

## Graph files in this set

| File | Subsystem | Use before phase |
|---|---|---|
| `01_system_architecture_graph.md` | Services, DBs, external providers, CI | Phase 0 |
| `02_auth_rbac_graph.md` | Auth abstraction, roles, guarded routes | Phase 1, Phase 5 |
| `03_data_model_graph.md` | Entity relationships (User/Product/Cart/Order/AuditLog) | Phase 2–4 |
| `04_request_lifecycle_graph.md` | Middleware chain per request type | Phase 2–5 |
| `05_audit_logging_graph.md` | Which actions write to the audit trail | Phase 5 |

## Notation used throughout

- `-->` a directed call or data-write edge
- `-.->` a conditional/guarded edge (only fires if a condition holds — noted on the edge)
- `[[Node]]` an external system boundary (not owned by this codebase)
- Edge labels are verbs: `calls`, `writes`, `reads`, `validates`, `guards`, `emits`
