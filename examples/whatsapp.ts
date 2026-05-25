// Demonstrates createWhatsAppLink: official https://wa.me/ links.

import { createWhatsAppLink } from "@photon-ai/uri";

console.log(createWhatsAppLink({ to: "+14155551234", body: "Hello" }));
// https://wa.me/14155551234?text=Hello

console.log(createWhatsAppLink({ to: "+14155551234" }));
// https://wa.me/14155551234

console.log(createWhatsAppLink({ to: "+14155551234", body: "hi 👋" }));
// https://wa.me/14155551234?text=hi%20%F0%9F%91%8B
