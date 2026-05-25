const IOS_USER_AGENT_RE = /iPhone|iPad|iPod/;

/**
 * iOS registers `facetime-prompt:` / `facetime-audio-prompt:` URL handlers.
 * macOS does not — `open` fails with kLSApplicationNotFoundErr (-10814).
 * Regular `facetime:` links already prompt before calling on macOS (per Apple).
 */
export function supportsFaceTimePromptScheme(): boolean {
  if (typeof navigator !== "undefined" && typeof navigator.userAgent === "string") {
    return IOS_USER_AGENT_RE.test(navigator.userAgent);
  }

  if (typeof process !== "undefined" && typeof process.platform === "string") {
    return process.platform !== "darwin";
  }

  return false;
}
