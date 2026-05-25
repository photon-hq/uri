const IOS_USER_AGENT_RE = /iPhone|iPad|iPod/;

/**
 * iOS registers `facetime-prompt:` / `facetime-audio-prompt:` URL handlers.
 * macOS does not — `open` fails with kLSApplicationNotFoundErr (-10814).
 * Regular `facetime:` links already prompt before calling on macOS (per Apple).
 *
 * Only returns true when iOS is positively detected (browser user agent).
 * Server-side and unknown runtimes default to false so links work on macOS too.
 */
export function supportsFaceTimePromptScheme(): boolean {
  if (typeof navigator !== "undefined" && typeof navigator.userAgent === "string") {
    return IOS_USER_AGENT_RE.test(navigator.userAgent);
  }

  return false;
}
