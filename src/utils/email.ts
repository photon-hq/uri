import { InvalidRecipientError } from "./errors";

const SIMPLE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(input: string): boolean {
  if (input.trim() !== input || input.length === 0) {
    return false;
  }
  return SIMPLE_EMAIL.test(input);
}

export function assertEmail(input: string): string {
  if (!isEmail(input)) {
    throw new InvalidRecipientError(input, "expected a simple email address");
  }
  return input;
}
