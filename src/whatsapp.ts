import { encodeBody } from "./utils/encode";
import { assertE164 } from "./utils/phone";

export interface WhatsAppLinkOptions {
  to: string;
  body?: string;
  variant?: "universal" | "scheme";
}

export function createWhatsAppLink(options: WhatsAppLinkOptions): string {
  const normalized = assertE164(options.to);
  const phone = normalized.slice(1);

  const variant = options.variant ?? "universal";
  let textParam: string | undefined;
  if (options.body !== undefined) {
    const trimmed = options.body.trim();
    if (trimmed !== "") {
      textParam = encodeBody(trimmed);
    }
  }

  if (variant === "universal") {
    if (textParam === undefined) {
      return `https://wa.me/${phone}`;
    }
    return `https://wa.me/${phone}?text=${textParam}`;
  }

  if (textParam === undefined) {
    return `whatsapp://send?phone=${phone}`;
  }
  return `whatsapp://send?phone=${phone}&text=${textParam}`;
}
