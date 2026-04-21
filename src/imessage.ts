import { assertEmail } from "./utils/email";
import { encodeBody } from "./utils/encode";
import { InvalidRecipientError } from "./utils/errors";
import { assertE164 } from "./utils/phone";

export interface IMessageLinkOptions {
  /**
   * A single recipient or a list of recipients. Each recipient must be
   * either an E.164 phone number or an email address (Apple ID).
   *
   * Multiple recipients produce a comma-separated list
   * (`imessage://+111,+222?body=...`). Duplicates (after normalization) are
   * stripped while preserving first-occurrence order. Phones and emails
   * may be mixed in the same list.
   */
  to: string | string[];
  body?: string;
}

function normalizeRecipient(input: string): string {
  return input.includes("@") ? assertEmail(input) : assertE164(input);
}

function normalizeRecipients(to: string | string[]): string[] {
  const raw = Array.isArray(to) ? to : [to];
  if (raw.length === 0) {
    throw new InvalidRecipientError("", "at least one recipient is required");
  }
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of raw) {
    const normalized = normalizeRecipient(item);
    if (!seen.has(normalized)) {
      seen.add(normalized);
      out.push(normalized);
    }
  }
  return out;
}

export function createIMessageLink(options: IMessageLinkOptions): string {
  const recipients = normalizeRecipients(options.to);
  let href = `imessage://${recipients.join(",")}`;
  if (options.body !== undefined && options.body.trim() !== "") {
    href += `?body=${encodeBody(options.body)}`;
  }
  return href;
}
