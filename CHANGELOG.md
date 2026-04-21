# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `createFaceTimeLink` now accepts a `prompt?: boolean` option. When `true`, the builder emits the `-prompt` scheme variants (`facetime-prompt:` / `facetime-audio-prompt:`) that ask the user to confirm before dialing. Recommended for links embedded on public web pages.
- `parseLink` recognizes `facetime-prompt:` and `facetime-audio-prompt:` URIs.
- `createIMessageLink` and `createSmsLink` now accept `to` as either a single `string` or a `string[]` of recipients. Multiple recipients are joined with commas per RFC 5724 (`sms:+111,+222?body=...` / `imessage://+111,user@example.com?body=...`). Each recipient is validated independently against the platform's rules. Duplicates (after normalization) are stripped while preserving first-occurrence order. A single-element array produces output identical to the string form.
- `parseLink` recognizes comma-separated recipient lists for `imessage://` and `sms:` URIs. A URI with one recipient continues to parse with `to: string`; a URI with two or more parses with `to: string[]`.

### Changed

- `ParsedLink` for `platform: "facetime"` now includes a `prompt: boolean` field. Non-prompt URIs parse with `prompt: false`, prompt variants with `prompt: true`. Round-trips remain stable.
- `IMessageLinkOptions["to"]` and `SmsLinkOptions["to"]` widened from `string` to `string | string[]`. `ParsedLink["imessage"]` and `ParsedLink["sms"]` likewise widened to `to: string | string[]`. Single-recipient calls and URIs are unchanged on both input and output sides.

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
