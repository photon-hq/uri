import { encodeBody } from "./utils/encode";
import { InvalidRecipientError } from "./utils/errors";
import { assertE164 } from "./utils/phone";

export interface SmsLinkOptions {
  /**
   * A single recipient or a list of recipients. Each recipient must be an
   * E.164 phone number (`+` and country code + subscriber digits).
   *
   * Multiple recipients produce a comma-separated list per RFC 5724
   * (`sms:+111,+222?body=...`). Duplicates (after E.164 normalization) are
   * stripped while preserving first-occurrence order.
   */
  to: string | string[];
  body?: string;
}

function normalizeRecipients(to: string | string[]): string[] {
  const raw = Array.isArray(to) ? to : [to];
  if (raw.length === 0) {
    throw new InvalidRecipientError("", "at least one recipient is required");
  }
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of raw) {
    const normalized = assertE164(item);
    if (!seen.has(normalized)) {
      seen.add(normalized);
      out.push(normalized);
    }
  }
  return out;
}

export function createSmsLink(options: SmsLinkOptions): string {
  const recipients = normalizeRecipients(options.to);
  const base = `sms:${recipients.join(",")}`;
  if (options.body === undefined) {
    return base;
  }
  const trimmed = options.body.trim();
  if (trimmed === "") {
    return base;
  }
  return `${base}?body=${encodeBody(trimmed)}`;
}
