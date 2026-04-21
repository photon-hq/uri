// Demonstrates parseLink: reverse supported URIs into { platform, to, body?, ... }.

import {
  createIMessageLink,
  createWhatsAppLink,
  parseLink,
  UnrecognizedLinkError,
} from "@photon-ai/uri";

// Parse each supported shape (examples)
console.log(parseLink("imessage://+14155551234"));
// { platform: "imessage", to: "+14155551234" }

console.log(parseLink("sms:+14155551234?body=hello"));
// { platform: "sms", to: "+14155551234", body: "hello" }

console.log(parseLink("facetime:+14155551234"));
// { platform: "facetime", to: "+14155551234", mode: "video" }

console.log(parseLink("https://wa.me/14155551234?text=hi"));
// { platform: "whatsapp", to: "+14155551234", body: "hi", variant: "universal" }

console.log(parseLink("https://t.me/durov?text=hi"));
// { platform: "telegram", to: "durov", body: "hi", variant: "universal" }

// Round-trip: build → parse → build again → equal
const built = createIMessageLink({ to: "+14155551234", body: "hi 👋" });
const parsed = parseLink(built);
if (parsed.platform !== "imessage") {
  throw new Error("expected imessage");
}
const again = createIMessageLink({ to: parsed.to, body: parsed.body });
console.log(built === again);
// true

const wa = createWhatsAppLink({
  to: "+14155551234",
  body: "hi there",
  variant: "universal",
});
const waParsed = parseLink(wa);
if (waParsed.platform !== "whatsapp") {
  throw new Error("expected whatsapp");
}
const waAgain = createWhatsAppLink({
  to: waParsed.to,
  body: waParsed.body,
  variant: waParsed.variant,
});
console.log(wa === waAgain);
// true

// Unrecognized URIs
try {
  parseLink("foo://bar");
} catch (err) {
  if (err instanceof UnrecognizedLinkError) {
    console.error(err.message);
    // Unrecognized link: "foo://bar"
  }
}
