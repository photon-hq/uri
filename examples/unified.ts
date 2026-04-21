// Demonstrates createLink: one entry point for all platforms via a discriminated union on `platform`.

import { createLink } from "@photon-ai/uri";

// iMessage
console.log(
  createLink({ platform: "imessage", to: "+14155551234", body: "hi" }),
);
// imessage://+14155551234?body=hi

// SMS
console.log(createLink({ platform: "sms", to: "+14155551234" }));
// sms:+14155551234

// FaceTime (audio)
console.log(
  createLink({ platform: "facetime", to: "+14155551234", mode: "audio" }),
);
// facetime-audio:+14155551234

// WhatsApp (scheme variant)
console.log(
  createLink({
    platform: "whatsapp",
    to: "+14155551234",
    body: "hi",
    variant: "scheme",
  }),
);
// whatsapp://send?phone=14155551234&text=hi

// Telegram (username + body)
console.log(createLink({ platform: "telegram", to: "durov", body: "hi" }));
// https://t.me/durov?text=hi

// Type safety: `mode` is only valid for FaceTime — this must not compile:
// @ts-expect-error SMS does not accept FaceTime mode
createLink({ platform: "sms", to: "+14155551234", mode: "audio" });
