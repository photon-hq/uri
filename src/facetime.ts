import { assertEmail } from "./utils/email";
import { assertE164 } from "./utils/phone";

export interface FaceTimeLinkOptions {
  to: string;
  mode?: "video" | "audio";
}

function resolveRecipient(to: string): string {
  if (to.includes("@")) {
    return assertEmail(to);
  }
  return assertE164(to);
}

export function createFaceTimeLink(options: FaceTimeLinkOptions): string {
  const { to, mode = "video" } = options;
  const recipient = resolveRecipient(to);
  const scheme = mode === "audio" ? "facetime-audio:" : "facetime:";
  return `${scheme}${recipient}`;
}
