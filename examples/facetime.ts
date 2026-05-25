// Demonstrates createFaceTimeLink: video/audio and prompt intent (iOS uses -prompt schemes; macOS falls back).

import { createFaceTimeLink } from "@photon-ai/uri";

console.log(createFaceTimeLink({ to: "+14155551234" }));
// facetime:+14155551234

console.log(createFaceTimeLink({ to: "+14155551234", mode: "audio" }));
// facetime-audio:+14155551234

console.log(createFaceTimeLink({ to: "user@example.com" }));
// facetime:user@example.com

console.log(createFaceTimeLink({ to: "user@icloud.com", mode: "audio" }));
// facetime-audio:user@icloud.com

console.log(createFaceTimeLink({ to: "+14155551234", prompt: true }));
// macOS: facetime:+14155551234  |  iOS: facetime-prompt:+14155551234

console.log(
  createFaceTimeLink({ to: "+14155551234", mode: "audio", prompt: true }),
);
// macOS: facetime-audio:+14155551234  |  iOS: facetime-audio-prompt:+14155551234
