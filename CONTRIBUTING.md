# Contributing

## Setup

```bash
git clone https://github.com/photon-hq/uri.git
cd uri
bun install
```

## Checks

```bash
bun run check    # typecheck, lint, test, build
bun run fix      # auto-fix lint/format issues
bun test         # tests only
bun run build    # dist/ (ESM, CJS, .d.ts)
```

See [AGENTS.md](AGENTS.md) for code style.

## Adding a platform

Follow an existing module ([`src/sms.ts`](src/sms.ts), [`src/whatsapp.ts`](src/whatsapp.ts)): named exports, shared helpers in `src/utils/`, tests in `src/__tests__/`, re-export from `src/index.ts`.

Subpath exports in `package.json` (`@photon-ai/uri/sms`, etc.) are aliases to the main entry — they do not tree-shake to a single platform.
