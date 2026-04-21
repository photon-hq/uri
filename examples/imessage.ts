// Demonstrates createIMessageLink: building imessage:// URIs for phone and email.

import {
  createIMessageLink,
  InvalidPhoneNumberError,
} from "@photon-ai/uri";

// Phone number, no body
console.log(createIMessageLink({ to: "+14155551234" }));
// imessage://+14155551234

// Phone number, with body (emoji)
console.log(createIMessageLink({ to: "+14155551234", body: "hi 👋" }));
// imessage://+14155551234?body=hi%20%F0%9F%91%8B

// Email recipient, with body
console.log(
  createIMessageLink({ to: "user@example.com", body: "hello" }),
);
// imessage://user@example.com?body=hello

// Normalization: formatted phone input is normalized to E.164
console.log(createIMessageLink({ to: "+1 (415) 555-1234" }));
// imessage://+14155551234

// Group / multi-recipient — phones and emails can be mixed
console.log(
  createIMessageLink({
    to: ["+14155551234", "+14155556789"],
    body: "hi 👋",
  }),
);
// imessage://+14155551234,+14155556789?body=hi%20%F0%9F%91%8B

console.log(
  createIMessageLink({ to: ["+14155551234", "user@example.com"] }),
);
// imessage://+14155551234,user@example.com

// Error handling: invalid phone (not E.164 / email)
try {
  createIMessageLink({ to: "not-a-phone" });
} catch (err) {
  if (err instanceof InvalidPhoneNumberError) {
    console.error(err.message);
    // Invalid phone number: "not-a-phone" (must be E.164 (+ and 1-15 digits, first digit 1-9))
  }
}
