# Ultracite Code Standards

This project uses **Ultracite** (Biome 2) for formatting and linting.

## Quick Reference

- **Format**: `bun run fix` or `bun x ultracite fix`
- **Lint**: `bun run lint` or `bun x ultracite check`
- **Full gate**: `bun run check` (typecheck, lint, test, build)

## TypeScript

- Explicit types when they add clarity; prefer `unknown` over `any`
- Use const assertions and type narrowing over assertions
- `const` by default, `let` when reassigned, never `var`
- Top-level regex literals, not inline in hot paths
- Named exports only; one concern per file under `src/utils/`

## Errors

- Extend `MessageUriError`; expose structured fields (`input`, `reason`, `feature`, `platform`)
- Throw `Error` subclasses with descriptive messages
- Prefer early returns over nested conditionals

## Tests

- Bun's built-in `bun:test` runner
- Assertions inside `it()` blocks; no `.only` / `.skip` in commits

## Lint overrides

- `src/index.ts`: barrel file allowed (public API entry)
- `src/parse.ts`: cognitive complexity limit relaxed (URI scheme dispatcher)

Run `bun run fix` before committing.
