// Demonstrates createFaceTimeLink: facetime: and facetime-audio: URIs,
// plus the `-prompt` variants that show a confirmation dialog before dialing.

import { createFaceTimeLink } from "@photon-ai/uri";

// Video call (default)
console.log(createFaceTimeLink({ to: "+14155551234" }));
// facetime:+14155551234

// Audio call
console.log(createFaceTimeLink({ to: "+14155551234", mode: "audio" }));
// facetime-audio:+14155551234

// Email recipient (Apple ID / iCloud)
console.log(createFaceTimeLink({ to: "user@example.com" }));
// facetime:user@example.com

console.log(createFaceTimeLink({ to: "user@icloud.com", mode: "audio" }));
// facetime-audio:user@icloud.com

// Prompt variants: iOS shows a "FaceTime <recipient>?" confirmation before
// dialing. Recommended for links embedded on public web pages.
console.log(createFaceTimeLink({ to: "+14155551234", prompt: true }));
// facetime-prompt:+14155551234

console.log(
  createFaceTimeLink({ to: "+14155551234", mode: "audio", prompt: true }),
);
// facetime-audio-prompt:+14155551234
