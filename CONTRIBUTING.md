# Contributing

## Setup

```bash
git clone https://github.com/photon-hq/uri.git
cd uri
bun install
```

## Run tests

```bash
bun test
```

## Build

```bash
bun run build
```

Artifacts are written to `dist/` (ESM `.js`, CJS `.cjs`, and declaration files).

## Adding a platform

Follow the pattern in an existing module such as [`src/sms.ts`](src/sms.ts) or [`src/whatsapp.ts`](src/whatsapp.ts): named exports only, shared helpers under `src/utils/`, types in `src/types.ts` as needed, tests under `src/__tests__/`, and wire exports through `src/index.ts` and `package.json` `exports` if you add a subpath.

## Style

Strict TypeScript, no runtime dependencies, named exports, and small focused utilities (one concern per file under `src/utils/` where practical).

## All checks

```bash
bun run check
```

Runs typecheck, lint, tests, and build in sequence.
