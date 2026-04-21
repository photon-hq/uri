import { InvalidPhoneNumberError } from "./errors";

const E164_PATTERN = /^\+[1-9]\d{0,14}$/;

function stripFormatting(input: string): string {
  let out = "";
  for (const ch of input) {
    if (ch === " " || ch === "\t" || ch === "\n" || ch === "\r") {
      continue;
    }
    if (ch === "-" || ch === "(" || ch === ")" || ch === ".") {
      continue;
    }
    out += ch;
  }
  return out;
}

export function normalizePhone(input: string): string {
  const normalized = stripFormatting(input.trim());
  if (!E164_PATTERN.test(normalized)) {
    throw new InvalidPhoneNumberError(input, "must be E.164 (+ and 1-15 digits, first digit 1-9)");
  }
  return normalized;
}

export function assertE164(input: string): string {
  return normalizePhone(input);
}

export function isE164(input: string): boolean {
  try {
    normalizePhone(input);
    return true;
  } catch {
    return false;
  }
}
