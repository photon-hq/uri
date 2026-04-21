// Demonstrates createTelegramLink: t.me universal links and tg:// scheme; phone vs username rules.

import {
  createTelegramLink,
  UnsupportedFeatureError,
} from "@photon-ai/uri";

// Username with body
console.log(createTelegramLink({ to: "durov", body: "hi 👋" }));
// https://t.me/durov?text=hi%20%F0%9F%91%8B

// @ prefix is stripped for usernames
console.log(createTelegramLink({ to: "@durov" }));
// https://t.me/durov

// Phone universal link (no body)
console.log(createTelegramLink({ to: "+14155551234" }));
// https://t.me/+14155551234

// Pre-filled text is not supported for phone links on t.me
try {
  createTelegramLink({ to: "+14155551234", body: "hi" });
} catch (err) {
  if (err instanceof UnsupportedFeatureError) {
    console.error(err.message);
    // Unsupported feature "prefilled text (Telegram t.me phone links do not support pre-filled messages)" on telegram
  }
}

// Scheme variant
console.log(createTelegramLink({ to: "durov", variant: "scheme" }));
// tg://resolve?domain=durov

console.log(
  createTelegramLink({ to: "+14155551234", variant: "scheme" }),
);
// tg://resolve?phone=14155551234
