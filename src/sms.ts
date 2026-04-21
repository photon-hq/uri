import { encodeBody } from "./utils/encode";
import { assertE164 } from "./utils/phone";

export interface SmsLinkOptions {
  to: string;
  body?: string;
}

export function createSmsLink(options: SmsLinkOptions): string {
  const recipient = assertE164(options.to);
  const base = `sms:${recipient}`;
  if (options.body === undefined) {
    return base;
  }
  const trimmed = options.body.trim();
  if (trimmed === "") {
    return base;
  }
  return `${base}?body=${encodeBody(trimmed)}`;
}
