import { assertEmail } from "./utils/email";
import { assertE164 } from "./utils/phone";
import { supportsFaceTimePromptScheme } from "./utils/platform";

export interface FaceTimeLinkOptions {
  mode?: "video" | "audio";
  /**
   * When `true`, emits the `-prompt` scheme variant on iOS (`facetime-prompt:` /
   * `facetime-audio-prompt:`), which asks for confirmation before dialing in web
   * contexts. On macOS, where those schemes have no registered handler, falls
   * back to `facetime:` / `facetime-audio:` (macOS already prompts for those).
   *
   * @default false
   */
  prompt?: boolean;
  to: string;
}

function resolveRecipient(to: string): string {
  if (to.includes("@")) {
    return assertEmail(to);
  }
  return assertE164(to);
}

function resolveScheme(mode: "video" | "audio", prompt: boolean): string {
  const usePromptScheme = prompt && supportsFaceTimePromptScheme();
  if (mode === "audio") {
    return usePromptScheme ? "facetime-audio-prompt:" : "facetime-audio:";
  }
  return usePromptScheme ? "facetime-prompt:" : "facetime:";
}

export function createFaceTimeLink(options: FaceTimeLinkOptions): string {
  const { to, mode = "video", prompt = false } = options;
  const recipient = resolveRecipient(to);
  return `${resolveScheme(mode, prompt)}${recipient}`;
}
