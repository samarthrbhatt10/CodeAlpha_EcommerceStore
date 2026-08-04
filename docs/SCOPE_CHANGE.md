# Scope Change Note

The `/docs` folder in this project contains the **original PRD and architecture graphs** (`PRD_CodeAlpha_Ecommerce_Store.md`, Graph 01–05) written at the start of the build. They describe a standard storefront: Product listings, Cart, Order, User registration/login — the baseline CodeAlpha Task 1 rubric.

During development, the scope intentionally expanded beyond that baseline into a more distinctive concept, layered on top of the same core architecture (auth, RBAC, audit logging, secrets management — all still as originally specified):

- **Vault** — central storage/inventory view for all products a user owns.
- **Drop** — scheduled release events for new products, rather than a static always-available catalog.
- **Unboxing** — a rewards mechanic tied to acquiring products (mystery-pack style reveal).
- **Trade** — peer-to-peer trading of owned products between users. **Not fully implemented in this version** — scaffolded but planned for a future iteration, not part of the current working feature set.

## Why this document exists

The original PRD and graph docs are kept as-is (not rewritten) because they accurately represent the starting point and the architectural decisions that still hold — auth, RBAC, secrets, and audit logging were built exactly as originally scoped and did not change. Only the product surface (what the store actually sells and how) evolved past the original Product/Cart/Order-only baseline. This note exists so the docs and the code don't silently contradict each other.

## What did NOT change from the original architecture

- Provider-agnostic auth (local + dormant OIDC strategy)
- Secrets management (`.env`, never committed)
- RBAC and audit logging patterns (Graph 02, Graph 05)
- Quality gates (lint, `npm audit`, CI pipeline)

See the main `README.md` for what the app actually does today.
