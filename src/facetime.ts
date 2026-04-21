import { assertEmail } from "./utils/email";
import { assertE164 } from "./utils/phone";

export interface FaceTimeLinkOptions {
  to: string;
  mode?: "video" | "audio";
  /**
   * When `true`, emits the `-prompt` scheme variant (`facetime-prompt:` or
   * `facetime-audio-prompt:`), which shows a confirmation dialog before
   * placing the call instead of dialing immediately. Recommended for links
   * embedded in public web pages.
   *
   * @default false
   */
  prompt?: boolean;
}

function resolveRecipient(to: string): string {
  if (to.includes("@")) {
    return assertEmail(to);
  }
  return assertE164(to);
}

function resolveScheme(mode: "video" | "audio", prompt: boolean): string {
  if (mode === "audio") {
    return prompt ? "facetime-audio-prompt:" : "facetime-audio:";
  }
  return prompt ? "facetime-prompt:" : "facetime:";
}

export function createFaceTimeLink(options: FaceTimeLinkOptions): string {
  const { to, mode = "video", prompt = false } = options;
  const recipient = resolveRecipient(to);
  return `${resolveScheme(mode, prompt)}${recipient}`;
}
