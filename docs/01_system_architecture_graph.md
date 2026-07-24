# Graph 01 — System Architecture

## Diagram

```mermaid
graph LR
  Client[React/Next.js Client]
  API[Express API Server]
  AuthMW[Auth Middleware]
  RBACMW[RBAC Middleware]
  AuditSvc[Audit Log Service]
  DB[(MongoDB — scoped app user)]
  Vault[[.env / Secrets Vault]]
  OIDC[[External OIDC Provider — Entra ID, dormant]]
  CI[[GitHub Actions CI]]

  Client -->|HTTPS requests| API
  API -->|invokes| AuthMW
  AuthMW -->|passes to| RBACMW
  RBACMW -->|forwards to| Route[Route Handlers]
  Route -->|reads/writes| DB
  Route -.->|on sensitive action| AuditSvc
  AuditSvc -->|writes| DB
  API -.->|reads secrets at boot| Vault
  AuthMW -.->|if OIDC enabled| OIDC
  CI -.->|lint, audit, test gate| API
```

## Adjacency List (agent-parseable)

```
NODES:
  Client, API, AuthMiddleware, RBACMiddleware, RouteHandlers,
  AuditService, MongoDB, SecretsVault, OIDCProvider[external], CIPipeline[external]

EDGES:
  Client        --calls-->        API
  API           --invokes-->      AuthMiddleware
  AuthMiddleware --forwards-->    RBACMiddleware
  RBACMiddleware --forwards-->    RouteHandlers
  RouteHandlers  --reads/writes-> MongoDB
  RouteHandlers  --emits-->       AuditService        [condition: sensitive action]
  AuditService   --writes-->      MongoDB
  API            --reads-->       SecretsVault         [at boot only]
  AuthMiddleware --delegates-->   OIDCProvider         [condition: authProvider=oidc, currently disabled]
  CIPipeline     --gates-->       API                  [pre-merge only]
```

## Agent instructions for this graph

- No component may call `MongoDB` directly except through `RouteHandlers` or `AuditService`.
- `SecretsVault` is read-only at process boot — no component reads it per-request.
- `OIDCProvider` edge is dormant; do not implement it unless explicitly asked to activate OIDC mode.
- Any new node/edge proposed by the agent must be stated explicitly before code is written.
