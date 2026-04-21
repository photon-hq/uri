// Demonstrates createSmsLink: building RFC 5724 sms: URIs.

import { createSmsLink, InvalidPhoneNumberError } from "@photon-ai/uri";

// Phone, no body
console.log(createSmsLink({ to: "+14155551234" }));
// sms:+14155551234

// Phone, with body
console.log(createSmsLink({ to: "+14155551234", body: "Hello" }));
// sms:+14155551234?body=Hello

// Body with special characters (emoji, newline, ampersand) — RFC 3986 query encoding
console.log(createSmsLink({ to: "+14155551234", body: "hi 👋" }));
// sms:+14155551234?body=hi%20%F0%9F%91%8B

console.log(createSmsLink({ to: "+14155551234", body: "a\nb\nc" }));
// sms:+14155551234?body=a%0Ab%0Ac

console.log(createSmsLink({ to: "+14155551234", body: "&?=#+/!*'()" }));
// sms:+14155551234?body=%26%3F%3D%23%2B%2F%21%2A%27%28%29

// Group / multi-recipient (RFC 5724 comma-separated list)
console.log(createSmsLink({ to: ["+14155551234", "+14155556789"] }));
// sms:+14155551234,+14155556789

console.log(
  createSmsLink({
    to: ["+14155551234", "+14155556789", "+442071838750"],
    body: "meet at 7",
  }),
);
// sms:+14155551234,+14155556789,+442071838750?body=meet%20at%207

// Duplicates are stripped after normalization (first occurrence wins)
console.log(createSmsLink({ to: ["+14155551234", "+1 (415) 555-1234"] }));
// sms:+14155551234

// Error handling: SMS is phone-only (E.164)
try {
  createSmsLink({ to: "user@example.com" });
} catch (err) {
  if (err instanceof InvalidPhoneNumberError) {
    console.error(err.message);
    // Invalid phone number: "user@example.com" (must be E.164 (+ and 1-15 digits, first digit 1-9))
  }
}
