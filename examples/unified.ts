// Demonstrates createLink: one entry point for all platforms via a discriminated union on `platform`.

import { createLink } from "@photon-ai/uri";

console.log(
  createLink({ platform: "imessage", to: "+14155551234", body: "hi" }),
);
// imessage://+14155551234?body=hi

console.log(createLink({ platform: "sms", to: "+14155551234" }));
// sms:+14155551234

console.log(
  createLink({ platform: "facetime", to: "+14155551234", mode: "audio" }),
);
// facetime-audio:+14155551234

console.log(
  createLink({ platform: "whatsapp", to: "+14155551234", body: "hi" }),
);
// https://wa.me/14155551234?text=hi

console.log(createLink({ platform: "telegram", to: "durov", body: "hi" }));
// https://t.me/durov?text=hi

// @ts-expect-error SMS does not accept FaceTime mode
createLink({ platform: "sms", to: "+14155551234", mode: "audio" });
