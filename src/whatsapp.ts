import { encodeBody } from "./utils/encode";
import { assertE164 } from "./utils/phone";

export interface WhatsAppLinkOptions {
  body?: string;
  to: string;
}

export function createWhatsAppLink(options: WhatsAppLinkOptions): string {
  const normalized = assertE164(options.to);
  const phone = normalized.slice(1);

  let textParam: string | undefined;
  if (options.body !== undefined) {
    const trimmed = options.body.trim();
    if (trimmed !== "") {
      textParam = encodeBody(trimmed);
    }
  }

  if (textParam === undefined) {
    return `https://wa.me/${phone}`;
  }
  return `https://wa.me/${phone}?text=${textParam}`;
}
