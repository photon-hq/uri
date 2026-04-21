// Demonstrates createWhatsAppLink: https://wa.me/ universal links and whatsapp:// scheme.

import { createWhatsAppLink } from "@photon-ai/uri";

// Universal (wa.me) with body
console.log(createWhatsAppLink({ to: "+14155551234", body: "Hello" }));
// https://wa.me/14155551234?text=Hello

// Universal without body
console.log(createWhatsAppLink({ to: "+14155551234" }));
// https://wa.me/14155551234

// Scheme variant with body
console.log(
  createWhatsAppLink({ to: "+14155551234", body: "hi", variant: "scheme" }),
);
// whatsapp://send?phone=14155551234&text=hi

// Body with emoji
console.log(createWhatsAppLink({ to: "+14155551234", body: "hi 👋" }));
// https://wa.me/14155551234?text=hi%20%F0%9F%91%8B
