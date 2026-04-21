import { MessageUriError } from "./errors";

const RFC3986_EXTRA = /[!*'()]/g;

function encodeRfc3986ReservedInFragment(text: string): string {
  return encodeURIComponent(text).replace(
    RFC3986_EXTRA,
    (ch) => `%${ch.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0")}`,
  );
}

export function encodeBody(text: string): string {
  return encodeRfc3986ReservedInFragment(text);
}

export function decodeBody(text: string): string {
  try {
    return decodeURIComponent(text);
  } catch {
    throw new MessageUriError("Invalid percent-encoding in body");
  }
}
