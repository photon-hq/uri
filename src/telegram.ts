import { encodeBody } from "./utils/encode";
import {
  InvalidPhoneNumberError,
  InvalidRecipientError,
  UnsupportedFeatureError,
} from "./utils/errors";
import { assertE164, isE164 } from "./utils/phone";

const USERNAME_RE = /^[a-zA-Z][a-zA-Z0-9_]{4,31}$/;

export interface TelegramLinkOptions {
  to: string;
  body?: string;
  variant?: "universal" | "scheme";
}

function isDigitOnly(s: string): boolean {
  return s.length > 0 && /^[0-9]+$/.test(s);
}

function parseRecipient(
  to: string,
): { kind: "phone"; e164: string } | { kind: "username"; username: string } {
  const trimmed = to.trim();
  if (trimmed === "") {
    throw new InvalidPhoneNumberError(to, "must be E.164 (+ and 1-15 digits, first digit 1-9)");
  }

  if (trimmed.startsWith("+")) {
    return { kind: "phone", e164: assertE164(trimmed) };
  }

  if (isDigitOnly(trimmed)) {
    return { kind: "phone", e164: assertE164(`+${trimmed}`) };
  }

  if (isE164(trimmed)) {
    return { kind: "phone", e164: assertE164(trimmed) };
  }

  const username = trimmed.replace(/^@+/, "");
  if (!USERNAME_RE.test(username)) {
    throw new InvalidRecipientError(
      to,
      "must be a valid Telegram username (5-32 chars, letter first, letters/digits/underscore only)",
    );
  }

  return { kind: "username", username };
}

export function createTelegramLink(options: TelegramLinkOptions): string {
  const recipient = parseRecipient(options.to);
  const variant = options.variant ?? "universal";

  let textParam: string | undefined;
  if (options.body !== undefined) {
    const trimmed = options.body.trim();
    if (trimmed !== "") {
      textParam = encodeBody(trimmed);
    }
  }

  if (recipient.kind === "phone") {
    if (textParam !== undefined) {
      throw new UnsupportedFeatureError(
        "prefilled text (Telegram t.me phone links do not support pre-filled messages)",
        "telegram",
      );
    }
    const digits = recipient.e164.slice(1);
    if (variant === "universal") {
      return `https://t.me/${recipient.e164}`;
    }
    return `tg://resolve?phone=${digits}`;
  }

  const { username } = recipient;

  if (variant === "universal") {
    if (textParam === undefined) {
      return `https://t.me/${username}`;
    }
    return `https://t.me/${username}?text=${textParam}`;
  }

  if (textParam === undefined) {
    return `tg://resolve?domain=${username}`;
  }
  return `tg://resolve?domain=${username}&text=${textParam}`;
}
