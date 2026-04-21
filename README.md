# @photon-ai/uri

> Generate URI links for iMessage, SMS, FaceTime, WhatsApp, and Telegram. Zero dependencies, fully typed.

[![npm](https://img.shields.io/npm/v/@photon-ai/uri?label=npm&color=3b82f6)](https://www.npmjs.com/package/@photon-ai/uri)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3b82f6)](https://www.typescriptlang.org/)
[![dependencies](https://img.shields.io/badge/dependencies-0-3b82f6)](./package.json)
[![license](https://img.shields.io/badge/license-MIT-3b82f6)](./LICENSE)
[![Discord](https://img.shields.io/badge/Discord-Join-5865f2?logo=discord&logoColor=white)](https://discord.com/invite/bZd4CMd2H5)

A tiny, zero-dependency TypeScript library for generating correct, encoded URI strings that open native messaging apps with pre-filled recipients and message bodies.

## Features

| Feature | Description | Method | Example |
| --- | --- | --- | --- |
| [iMessage link](#imessage) | Build an `imessage://` URI for phone or email | `createIMessageLink()` | [imessage.ts](examples/imessage.ts) |
| [SMS link](#sms) | Build an RFC 5724 `sms:` URI | `createSmsLink()` | [sms.ts](examples/sms.ts) |
| [FaceTime link](#facetime) | Build `facetime:` / `facetime-audio:` URI | `createFaceTimeLink()` | [facetime.ts](examples/facetime.ts) |
| [WhatsApp link](#whatsapp) | Build `wa.me` universal or `whatsapp://` scheme link | `createWhatsAppLink()` | [whatsapp.ts](examples/whatsapp.ts) |
| [Telegram link](#telegram) | Build `t.me` universal or `tg://` scheme link | `createTelegramLink()` | [telegram.ts](examples/telegram.ts) |
| [Unified dispatcher](#unified-dispatcher) | One function for all platforms via a discriminated union | `createLink()` | [unified.ts](examples/unified.ts) |
| [Parse URIs back](#parsing-uris) | Reverse operation: any supported URI to `{ platform, to, body, ... }` | `parseLink()` | [parse.ts](examples/parse.ts) |
| [E.164 normalization](#phone-numbers) | Strict phone normalization + validation | `assertE164()` | — |
| [Body encoding](#body-encoding) | RFC 3986-compliant query body encoder | `encodeBody()` | — |
| [Typed errors](#error-handling) | `instanceof`-friendly error classes | `MessageUriError` | — |

---

## Quick Start

### Installation

```bash
bun add @photon-ai/uri
npm install @photon-ai/uri
```

### Basic usage

```ts
import { createIMessageLink, createLink, parseLink } from "@photon-ai/uri";

createIMessageLink({ to: "+14155551234", body: "hello" });
// imessage://+14155551234?body=hello

createLink({ platform: "sms", to: "+14155551234" });
// sms:+14155551234

parseLink("imessage://+14155551234?body=hi%20%F0%9F%91%8B");
// { platform: "imessage", to: "+14155551234", body: "hi 👋" }
```

---

## Core Concepts

### Phone numbers

All phone inputs must be in E.164 format: a leading `+`, country code, and subscriber number with no spaces or formatting. The library normalizes common formatting (spaces, dashes, parentheses, dots) internally, but the `+` prefix is required.

```ts
import { assertE164 } from "@photon-ai/uri";

assertE164("+1 (415) 555-1234"); // "+14155551234"
assertE164("415-555-1234"); // throws InvalidPhoneNumberError
```

### Recipient types per platform

| Platform | Phone | Email | Username | Notes |
| --- | --- | --- | --- | --- |
| iMessage | yes | yes | — | |
| SMS | yes | — | — | Phone only |
| FaceTime | yes | yes | — | Email works for Apple IDs |
| WhatsApp | yes | — | — | Strips `+` in URL path |
| Telegram | yes | — | yes | Pre-filled body only for usernames |

### Platform quirks

- **FaceTime** has no body support. Pass `mode: "audio"` for audio calls.
- **WhatsApp** strips the `+` from phone numbers in the URL; you still pass E.164 with `+` in options.
- **Telegram** phone links (`t.me/+...`) do not support pre-filled message text; only username links support `body`.
- **SMS** URIs follow RFC 5724 (`sms:+phone?body=text`), not iOS-specific variants.

### Body encoding

Message bodies embedded in query strings use `encodeBody()` (and round-trip with `decodeBody()`). Reserved characters, newlines, and Unicode are percent-encoded per RFC 3986.

```ts
import { decodeBody, encodeBody } from "@photon-ai/uri";

encodeBody("hi 👋"); // "hi%20%F0%9F%91%8B"
decodeBody(encodeBody("a\nb\nc")); // "a\nb\nc"
```

---

## iMessage

> Example: [imessage.ts](examples/imessage.ts)

Builds `imessage://` URIs. Supports both phone numbers (E.164) and email addresses as recipients.

```ts
import { createIMessageLink } from "@photon-ai/uri";

createIMessageLink({ to: "+14155551234" });
// imessage://+14155551234

createIMessageLink({ to: "+14155551234", body: "hi 👋" });
// imessage://+14155551234?body=hi%20%F0%9F%91%8B

createIMessageLink({ to: "user@example.com", body: "hello" });
// imessage://user@example.com?body=hello
```

**Options**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `to` | `string` | yes | Phone (E.164) or email |
| `body` | `string` | no | Pre-filled message text |

---

## SMS

> Example: [sms.ts](examples/sms.ts)

Builds RFC 5724 `sms:` URIs. Recipients must be E.164 phone numbers.

```ts
import { createSmsLink } from "@photon-ai/uri";

createSmsLink({ to: "+14155551234" });
// sms:+14155551234

createSmsLink({ to: "+14155551234", body: "Hello" });
// sms:+14155551234?body=Hello
```

**Options**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `to` | `string` | yes | E.164 phone |
| `body` | `string` | no | Pre-filled message text |

---

## FaceTime

> Example: [facetime.ts](examples/facetime.ts)

Builds `facetime:` (video) or `facetime-audio:` (audio) URIs. There is no message body; recipients are phone (E.164) or email (Apple ID).

```ts
import { createFaceTimeLink } from "@photon-ai/uri";

createFaceTimeLink({ to: "+14155551234" });
// facetime:+14155551234

createFaceTimeLink({ to: "+14155551234", mode: "audio" });
// facetime-audio:+14155551234

createFaceTimeLink({ to: "user@icloud.com", mode: "audio" });
// facetime-audio:user@icloud.com
```

**Options**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `to` | `string` | yes | E.164 phone or email |
| `mode` | `"video" \| "audio"` | no | Defaults to `"video"` |

---

## WhatsApp

> Example: [whatsapp.ts](examples/whatsapp.ts)

Builds `https://wa.me/...` (universal) or `whatsapp://send?...` (scheme) links. Phone numbers are normalized to E.164 in options; the `+` is omitted in the generated path or `phone` query value.

```ts
import { createWhatsAppLink } from "@photon-ai/uri";

createWhatsAppLink({ to: "+14155551234", body: "Hello" });
// https://wa.me/14155551234?text=Hello

createWhatsAppLink({ to: "+14155551234", variant: "scheme", body: "hi" });
// whatsapp://send?phone=14155551234&text=hi
```

**Options**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `to` | `string` | yes | E.164 phone |
| `body` | `string` | no | Pre-filled message text |
| `variant` | `"universal" \| "scheme"` | no | Defaults to `"universal"` |

---

## Telegram

> Example: [telegram.ts](examples/telegram.ts)

Builds `https://t.me/...` (universal) or `tg://resolve?...` (scheme) links. Recipients are either E.164 phones (`+...` or digits) or valid usernames (`@` prefix is stripped). Pre-filled `body` is supported for usernames only; phone links throw `UnsupportedFeatureError` if `body` is non-empty.

```ts
import { createTelegramLink } from "@photon-ai/uri";

createTelegramLink({ to: "durov", body: "hi 👋" });
// https://t.me/durov?text=hi%20%F0%9F%91%8B

createTelegramLink({ to: "+14155551234" });
// https://t.me/+14155551234

createTelegramLink({ to: "durov", variant: "scheme" });
// tg://resolve?domain=durov
```

**Options**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `to` | `string` | yes | E.164 phone, digits, or username |
| `body` | `string` | no | Pre-filled text (username only) |
| `variant` | `"universal" \| "scheme"` | no | Defaults to `"universal"` |

---

## Unified dispatcher

> Example: [unified.ts](examples/unified.ts)

`createLink()` dispatches to the correct builder from a single options object. The `platform` field discriminates the union so each platform only accepts its own options (for example, `mode` is only valid for FaceTime).

```ts
import { createLink } from "@photon-ai/uri";

createLink({ platform: "imessage", to: "+14155551234", body: "hi" });
// imessage://+14155551234?body=hi

createLink({ platform: "facetime", to: "+14155551234", mode: "audio" });
// facetime-audio:+14155551234
```

---

## Parsing URIs

> Example: [parse.ts](examples/parse.ts)

`parseLink()` is the inverse of the builders for supported schemes: `imessage://`, `sms:`, `facetime:` / `facetime-audio:`, `https://wa.me/`, `https://t.me/`, `whatsapp://send`, and `tg://resolve`. It returns a `ParsedLink` discriminated union with `platform`, `to`, optional `body`, and platform-specific fields (`mode` for FaceTime, `variant` for WhatsApp and Telegram).

```ts
import { parseLink } from "@photon-ai/uri";

parseLink("sms:+14155551234?body=hello");
// { platform: "sms", to: "+14155551234", body: "hello" }

parseLink("facetime-audio:user@icloud.com");
// { platform: "facetime", to: "user@icloud.com", mode: "audio" }
```

Round-trips are stable for values produced by the builders: build with a given option object, parse, then build again with the parsed fields and you get the same string where applicable.

---

## Error handling

Errors extend `MessageUriError` and are safe to catch with `instanceof`:

| Class | When |
| --- | --- |
| `InvalidPhoneNumberError` | Phone input is not valid E.164 after normalization |
| `InvalidRecipientError` | Email or Telegram username validation failed |
| `UnsupportedFeatureError` | Valid recipient but feature not available (e.g. Telegram phone + body) |
| `UnrecognizedLinkError` | `parseLink()` input is not a supported URI shape |

```ts
import {
  InvalidPhoneNumberError,
  parseLink,
  UnrecognizedLinkError,
} from "@photon-ai/uri";

try {
  parseLink("https://example.com/");
} catch (err) {
  if (err instanceof UnrecognizedLinkError) {
    // handle unknown link
  }
}
```

---

## Examples

Run any example with Bun:

```bash
bun run examples/<filename>.ts
```

### Per-platform

| File | Description |
| --- | --- |
| [imessage.ts](examples/imessage.ts) | Build `imessage://` URIs |
| [sms.ts](examples/sms.ts) | Build RFC 5724 `sms:` URIs |
| [facetime.ts](examples/facetime.ts) | Build `facetime:` / `facetime-audio:` URIs |
| [whatsapp.ts](examples/whatsapp.ts) | Build `wa.me` / `whatsapp://` URIs |
| [telegram.ts](examples/telegram.ts) | Build `t.me` / `tg://` URIs |

### Advanced

| File | Description |
| --- | --- |
| [unified.ts](examples/unified.ts) | Unified `createLink` dispatcher |
| [parse.ts](examples/parse.ts) | Parse URIs back with `parseLink` |

---

## License

[MIT](LICENSE)

---

## Author

Photon
