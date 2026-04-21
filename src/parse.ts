import { decodeBody } from "./utils/encode";
import { UnrecognizedLinkError } from "./utils/errors";

export type ParsedLink =
  | { platform: "imessage"; to: string | string[]; body?: string }
  | { platform: "sms"; to: string | string[]; body?: string }
  | { platform: "facetime"; to: string; mode: "video" | "audio"; prompt: boolean }
  | { platform: "whatsapp"; to: string; body?: string; variant: "universal" | "scheme" }
  | { platform: "telegram"; to: string; body?: string; variant: "universal" | "scheme" };

const IMESSAGE_PREFIX = /^imessage:\/\//i;

function optionalBodyFromQuery(query: string, key: "body" | "text"): string | undefined {
  if (!query) {
    return undefined;
  }
  const q = query.startsWith("?") ? query : `?${query}`;
  const params = new URLSearchParams(q);
  const raw = params.get(key);
  if (raw === null || raw === "") {
    return undefined;
  }
  const decoded = decodeBody(raw);
  if (decoded.trim() === "") {
    return undefined;
  }
  return decoded;
}

function decodeRecipientSegment(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

/**
 * Splits a comma-separated recipient list from a URI path and returns either
 * a single string (when there is exactly one recipient) or an array (two or
 * more). Empty segments are dropped.
 */
function parseRecipientList(raw: string): string | string[] {
  const parts = raw
    .split(",")
    .map((s) => decodeRecipientSegment(s.trim()))
    .filter((s) => s !== "");
  if (parts.length === 1) {
    return parts[0] as string;
  }
  return parts;
}

function throwUnrecognized(uri: string): never {
  throw new UnrecognizedLinkError(uri);
}

export function parseLink(uri: string): ParsedLink {
  const trimmed = uri.trim();
  if (trimmed === "") {
    throwUnrecognized(uri);
  }

  const im = trimmed.match(IMESSAGE_PREFIX);
  if (im) {
    const rest = trimmed.slice(im[0].length);
    const qIdx = rest.indexOf("?");
    const rawRecipient = qIdx === -1 ? rest : rest.slice(0, qIdx);
    if (rawRecipient === "") {
      throwUnrecognized(uri);
    }
    const to = parseRecipientList(rawRecipient);
    if (Array.isArray(to) ? to.length === 0 : to === "") {
      throwUnrecognized(uri);
    }
    const query = qIdx === -1 ? "" : rest.slice(qIdx + 1);
    const body = optionalBodyFromQuery(query, "body");
    const out: { platform: "imessage"; to: string | string[]; body?: string } = {
      platform: "imessage",
      to,
    };
    if (body !== undefined) {
      out.body = body;
    }
    return out;
  }

  const lower = trimmed.toLowerCase();
  if (lower.startsWith("sms://")) {
    throwUnrecognized(uri);
  }
  if (lower.startsWith("sms:")) {
    const rest = trimmed.slice(4);
    const qIdx = rest.indexOf("?");
    const rawPhones = qIdx === -1 ? rest : rest.slice(0, qIdx);
    if (rawPhones === "") {
      throwUnrecognized(uri);
    }
    const to = parseRecipientList(rawPhones);
    if (Array.isArray(to) ? to.length === 0 : to === "") {
      throwUnrecognized(uri);
    }
    const query = qIdx === -1 ? "" : rest.slice(qIdx + 1);
    const body = optionalBodyFromQuery(query, "body");
    const out: { platform: "sms"; to: string | string[]; body?: string } = {
      platform: "sms",
      to,
    };
    if (body !== undefined) {
      out.body = body;
    }
    return out;
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throwUnrecognized(uri);
  }

  if (url.protocol === "facetime-audio-prompt:") {
    const to = url.pathname;
    if (to === "") {
      throwUnrecognized(uri);
    }
    return { platform: "facetime", to, mode: "audio", prompt: true };
  }

  if (url.protocol === "facetime-audio:") {
    const to = url.pathname;
    if (to === "") {
      throwUnrecognized(uri);
    }
    return { platform: "facetime", to, mode: "audio", prompt: false };
  }

  if (url.protocol === "facetime-prompt:") {
    const to = url.pathname;
    if (to === "") {
      throwUnrecognized(uri);
    }
    return { platform: "facetime", to, mode: "video", prompt: true };
  }

  if (url.protocol === "facetime:") {
    const to = url.pathname;
    if (to === "") {
      throwUnrecognized(uri);
    }
    return { platform: "facetime", to, mode: "video", prompt: false };
  }

  if (url.protocol === "https:") {
    const host = url.hostname.toLowerCase();
    if (host === "wa.me") {
      const raw = url.pathname.replace(/^\//, "");
      if (raw === "" || !/^[0-9]+$/.test(raw)) {
        throwUnrecognized(uri);
      }
      const text = optionalBodyFromQuery(url.search, "text");
      const out: {
        platform: "whatsapp";
        to: string;
        body?: string;
        variant: "universal";
      } = {
        platform: "whatsapp",
        to: `+${raw}`,
        variant: "universal",
      };
      if (text !== undefined) {
        out.body = text;
      }
      return out;
    }

    if (host === "t.me") {
      const path = url.pathname;
      if (path === "" || path === "/") {
        throwUnrecognized(uri);
      }
      const segment = path.replace(/^\//, "");
      if (segment.includes("/")) {
        throwUnrecognized(uri);
      }
      const decoded = decodeRecipientSegment(segment);
      if (decoded === "") {
        throwUnrecognized(uri);
      }
      if (decoded.startsWith("+") && !/^\+[0-9]+$/.test(decoded)) {
        throwUnrecognized(uri);
      }
      const to = decoded;
      const text = optionalBodyFromQuery(url.search, "text");
      const out: {
        platform: "telegram";
        to: string;
        body?: string;
        variant: "universal";
      } = {
        platform: "telegram",
        to,
        variant: "universal",
      };
      if (text !== undefined) {
        out.body = text;
      }
      return out;
    }
  }

  if (url.protocol === "whatsapp:" && url.hostname.toLowerCase() === "send") {
    const phone = url.searchParams.get("phone");
    if (phone === null || phone === "") {
      throwUnrecognized(uri);
    }
    const text = optionalBodyFromQuery(url.search, "text");
    const out: {
      platform: "whatsapp";
      to: string;
      body?: string;
      variant: "scheme";
    } = {
      platform: "whatsapp",
      to: `+${phone}`,
      variant: "scheme",
    };
    if (text !== undefined) {
      out.body = text;
    }
    return out;
  }

  if (url.protocol === "tg:" && url.hostname.toLowerCase() === "resolve") {
    const domain = url.searchParams.get("domain");
    const phone = url.searchParams.get("phone");
    let to: string;
    if (domain !== null && domain !== "") {
      to = domain;
    } else if (phone !== null && phone !== "") {
      to = `+${phone}`;
    } else {
      throwUnrecognized(uri);
    }
    const text = optionalBodyFromQuery(url.search, "text");
    const out: {
      platform: "telegram";
      to: string;
      body?: string;
      variant: "scheme";
    } = {
      platform: "telegram",
      to,
      variant: "scheme",
    };
    if (text !== undefined) {
      out.body = text;
    }
    return out;
  }

  throwUnrecognized(uri);
}
