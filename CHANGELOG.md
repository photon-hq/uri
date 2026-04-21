# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-04-21

### Added

- `createIMessageLink` — generates `imessage://` URIs with phone or email recipients
- `createSmsLink` — generates RFC 5724 `sms:` URIs
- `createFaceTimeLink` — generates `facetime:` and `facetime-audio:` URIs
- `createWhatsAppLink` — generates `https://wa.me/` and `whatsapp://send` URIs
- `createTelegramLink` — generates `https://t.me/` and `tg://resolve` URIs
- `createLink` — unified dispatcher with discriminated union
- `parseLink` — reverse operation, parses any supported URI back to options
- Typed errors: `MessageUriError`, `InvalidPhoneNumberError`, `InvalidRecipientError`, `UnsupportedFeatureError`, `UnrecognizedLinkError`
- Utility exports: `assertE164`, `normalizePhone`, `isE164`, `isEmail`, `assertEmail`, `encodeBody`, `decodeBody`
- Dual ESM + CJS build with TypeScript declarations
- Zero runtime dependencies

### Tooling

- Tests run on Bun's built-in `bun:test` runner — no Vitest, Jest, or other test-framework dev dependency
- Added `prepublishOnly` hook that runs `bun run check` (typecheck + lint + tests + build) before any publish
