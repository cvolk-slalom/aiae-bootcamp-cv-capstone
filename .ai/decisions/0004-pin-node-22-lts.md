# ADR 0004: Pin Node 22 LTS (not Node 24)

- **Status:** Accepted
- **Date:** 2026-06-03
- **Silo(s):** meta, backend

## Context
The dev container ships Node 24 as the default. During T001 (repo setup), `better-sqlite3@11.10.0` had no prebuilt binary for Node 24's `NODE_MODULE_VERSION 137`, and the from-source build via node-gyp failed (`fatal error: opening dependency file ... No such file or directory` during sqlite3 compile). The package's published prebuilds target Node ≤ 22 (`node-v127-linux-x64`).

## Decision
Pin the repo to **Node 22 LTS** via `.nvmrc` and set it as the nvm default in the container. This is within the original "Node 20+" constraint from [ADR 0003](0003-product-concept-and-stack.md).

## Alternatives considered
- **Stay on Node 24 + fix the source build.** Rejected: lost build time chasing a toolchain bug for zero product value; native module ecosystem lags behind cutting-edge Node releases.
- **Swap to `node:sqlite` (built-in, Node 22.5+).** Considered. Rejected for now: API surface differs from better-sqlite3, would require rewriting `apps/api/src/db` and is a bigger commitment than warranted mid-T001. Revisit if better-sqlite3 becomes a maintenance burden.
- **Switch to a pure-JS SQLite (sql.js).** Rejected: in-memory only without extra plumbing; loses the simple file-DB story.

## Consequences
- **Positive:** `pnpm install` uses prebuilds — no compiler toolchain required on a fresh clone; faster, more reliable setup.
- **Positive:** `.nvmrc` + `engines.node >= 20` in root `package.json` makes the version expectation explicit and machine-checkable.
- **Negative:** Contributors on bare metal need nvm (or to install Node 22 manually); `nvm use` is a one-time step.
- **Follow-up:** When better-sqlite3 ships Node 24 prebuilds (or we move to `node:sqlite`), revisit the pin.
