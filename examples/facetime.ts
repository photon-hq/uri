// Demonstrates createFaceTimeLink: facetime: and facetime-audio: URIs (no body support).

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
