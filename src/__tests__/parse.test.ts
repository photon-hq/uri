import { describe, expect, it } from "bun:test";
import { createFaceTimeLink } from "../facetime";
import { createIMessageLink } from "../imessage";
import { parseLink } from "../parse";
import { createSmsLink } from "../sms";
import { createTelegramLink } from "../telegram";
import { UnrecognizedLinkError } from "../utils/errors";
import { createWhatsAppLink } from "../whatsapp";

describe("parseLink", () => {
  describe("direct parse (one per platform / variant)", () => {
    it("parses imessage phone", () => {
      expect(parseLink("imessage://+14155551234")).toEqual({
        platform: "imessage",
        to: "+14155551234",
      });
    });

    it("parses imessage phone with body", () => {
      expect(parseLink("imessage://+14155551234?body=hi%20%F0%9F%91%8B")).toEqual({
        platform: "imessage",
        to: "+14155551234",
        body: "hi 👋",
      });
    });

    it("parses imessage email", () => {
      expect(parseLink("imessage://user@example.com")).toEqual({
        platform: "imessage",
        to: "user@example.com",
      });
    });

    it("parses sms", () => {
      expect(parseLink("sms:+14155551234?body=hello")).toEqual({
        platform: "sms",
        to: "+14155551234",
        body: "hello",
      });
    });

    it("parses facetime video", () => {
      expect(parseLink("facetime:+14155551234")).toEqual({
        platform: "facetime",
        to: "+14155551234",
        mode: "video",
        prompt: false,
      });
    });

    it("parses facetime audio", () => {
      expect(parseLink("facetime-audio:user@icloud.com")).toEqual({
        platform: "facetime",
        to: "user@icloud.com",
        mode: "audio",
        prompt: false,
      });
    });

    it("parses facetime-prompt (video prompt)", () => {
      expect(parseLink("facetime-prompt:+14155551234")).toEqual({
        platform: "facetime",
        to: "+14155551234",
        mode: "video",
        prompt: true,
      });
    });

    it("parses facetime-audio-prompt (audio prompt)", () => {
      expect(parseLink("facetime-audio-prompt:user@icloud.com")).toEqual({
        platform: "facetime",
        to: "user@icloud.com",
        mode: "audio",
        prompt: true,
      });
    });

    it("parses whatsapp universal", () => {
      expect(parseLink("https://wa.me/14155551234")).toEqual({
        platform: "whatsapp",
        to: "+14155551234",
        variant: "universal",
      });
    });

    it("parses whatsapp universal with text", () => {
      expect(parseLink("https://wa.me/14155551234?text=hi")).toEqual({
        platform: "whatsapp",
        to: "+14155551234",
        body: "hi",
        variant: "universal",
      });
    });

    it("parses whatsapp scheme", () => {
      expect(parseLink("whatsapp://send?phone=14155551234&text=hi")).toEqual({
        platform: "whatsapp",
        to: "+14155551234",
        body: "hi",
        variant: "scheme",
      });
    });

    it("parses telegram universal username", () => {
      expect(parseLink("https://t.me/durov")).toEqual({
        platform: "telegram",
        to: "durov",
        variant: "universal",
      });
    });

    it("parses telegram universal username with text", () => {
      expect(parseLink("https://t.me/durov?text=hi")).toEqual({
        platform: "telegram",
        to: "durov",
        body: "hi",
        variant: "universal",
      });
    });

    it("parses telegram universal phone", () => {
      expect(parseLink("https://t.me/+14155551234")).toEqual({
        platform: "telegram",
        to: "+14155551234",
        variant: "universal",
      });
    });

    it("parses telegram scheme domain", () => {
      expect(parseLink("tg://resolve?domain=durov&text=hi")).toEqual({
        platform: "telegram",
        to: "durov",
        body: "hi",
        variant: "scheme",
      });
    });

    it("parses telegram scheme phone", () => {
      expect(parseLink("tg://resolve?phone=14155551234")).toEqual({
        platform: "telegram",
        to: "+14155551234",
        variant: "scheme",
      });
    });
  });

  describe("round-trip (builder → parseLink)", () => {
    it("iMessage phone with body", () => {
      const opts = { to: "+14155551234", body: "hi 👋" } as const;
      const built = createIMessageLink(opts);
      expect(parseLink(built)).toEqual({
        platform: "imessage",
        to: opts.to,
        body: opts.body,
      });
    });

    it("iMessage phone no body", () => {
      const opts = { to: "+14155551234" } as const;
      const built = createIMessageLink(opts);
      expect(parseLink(built)).toEqual({
        platform: "imessage",
        to: opts.to,
      });
    });

    it("iMessage email with body", () => {
      const opts = { to: "user@example.com", body: "hello" } as const;
      const built = createIMessageLink(opts);
      expect(parseLink(built)).toEqual({
        platform: "imessage",
        to: opts.to,
        body: opts.body,
      });
    });

    it("iMessage email no body", () => {
      const opts = { to: "user@example.com" } as const;
      const built = createIMessageLink(opts);
      expect(parseLink(built)).toEqual({
        platform: "imessage",
        to: opts.to,
      });
    });

    it("SMS with body", () => {
      const opts = { to: "+14155551234", body: "hello" } as const;
      const built = createSmsLink(opts);
      expect(parseLink(built)).toEqual({
        platform: "sms",
        to: opts.to,
        body: opts.body,
      });
    });

    it("SMS no body", () => {
      const opts = { to: "+14155551234" } as const;
      const built = createSmsLink(opts);
      expect(parseLink(built)).toEqual({
        platform: "sms",
        to: opts.to,
      });
    });

    it("FaceTime video, phone", () => {
      const opts = { to: "+14155551234", mode: "video" as const };
      const built = createFaceTimeLink(opts);
      expect(parseLink(built)).toEqual({
        platform: "facetime",
        to: opts.to,
        mode: "video",
        prompt: false,
      });
    });

    it("FaceTime audio, phone", () => {
      const opts = { to: "+14155551234", mode: "audio" as const };
      const built = createFaceTimeLink(opts);
      expect(parseLink(built)).toEqual({
        platform: "facetime",
        to: opts.to,
        mode: "audio",
        prompt: false,
      });
    });

    it("FaceTime video, email", () => {
      const opts = { to: "user@icloud.com", mode: "video" as const };
      const built = createFaceTimeLink(opts);
      expect(parseLink(built)).toEqual({
        platform: "facetime",
        to: opts.to,
        mode: "video",
        prompt: false,
      });
    });

    it("FaceTime video prompt, phone", () => {
      const opts = { to: "+14155551234", mode: "video" as const, prompt: true };
      const built = createFaceTimeLink(opts);
      expect(parseLink(built)).toEqual({
        platform: "facetime",
        to: opts.to,
        mode: "video",
        prompt: true,
      });
    });

    it("FaceTime audio prompt, email", () => {
      const opts = { to: "user@icloud.com", mode: "audio" as const, prompt: true };
      const built = createFaceTimeLink(opts);
      expect(parseLink(built)).toEqual({
        platform: "facetime",
        to: opts.to,
        mode: "audio",
        prompt: true,
      });
    });

    it("WhatsApp universal no body", () => {
      const opts = { to: "+14155551234", variant: "universal" as const };
      const built = createWhatsAppLink(opts);
      expect(parseLink(built)).toEqual({
        platform: "whatsapp",
        to: opts.to,
        variant: "universal",
      });
    });

    it("WhatsApp universal with body", () => {
      const opts = {
        to: "+14155551234",
        body: "hi there",
        variant: "universal" as const,
      };
      const built = createWhatsAppLink(opts);
      expect(parseLink(built)).toEqual({
        platform: "whatsapp",
        to: opts.to,
        body: opts.body,
        variant: "universal",
      });
    });

    it("WhatsApp scheme no body", () => {
      const opts = { to: "+14155551234", variant: "scheme" as const };
      const built = createWhatsAppLink(opts);
      expect(parseLink(built)).toEqual({
        platform: "whatsapp",
        to: opts.to,
        variant: "scheme",
      });
    });

    it("WhatsApp scheme with body", () => {
      const opts = {
        to: "+14155551234",
        body: "hi",
        variant: "scheme" as const,
      };
      const built = createWhatsAppLink(opts);
      expect(parseLink(built)).toEqual({
        platform: "whatsapp",
        to: opts.to,
        body: opts.body,
        variant: "scheme",
      });
    });

    it("Telegram username universal no body", () => {
      const opts = { to: "durov", variant: "universal" as const };
      const built = createTelegramLink(opts);
      expect(parseLink(built)).toEqual({
        platform: "telegram",
        to: "durov",
        variant: "universal",
      });
    });

    it("Telegram username universal with body", () => {
      const opts = {
        to: "durov",
        body: "hi 👋",
        variant: "universal" as const,
      };
      const built = createTelegramLink(opts);
      expect(parseLink(built)).toEqual({
        platform: "telegram",
        to: "durov",
        body: opts.body,
        variant: "universal",
      });
    });

    it("Telegram username scheme no body", () => {
      const opts = { to: "durov", variant: "scheme" as const };
      const built = createTelegramLink(opts);
      expect(parseLink(built)).toEqual({
        platform: "telegram",
        to: "durov",
        variant: "scheme",
      });
    });

    it("Telegram username scheme with body", () => {
      const opts = {
        to: "durov",
        body: "hi",
        variant: "scheme" as const,
      };
      const built = createTelegramLink(opts);
      expect(parseLink(built)).toEqual({
        platform: "telegram",
        to: "durov",
        body: opts.body,
        variant: "scheme",
      });
    });

    it("Telegram phone universal", () => {
      const opts = { to: "+14155551234", variant: "universal" as const };
      const built = createTelegramLink(opts);
      expect(parseLink(built)).toEqual({
        platform: "telegram",
        to: opts.to,
        variant: "universal",
      });
    });

    it("Telegram phone scheme", () => {
      const opts = { to: "+14155551234", variant: "scheme" as const };
      const built = createTelegramLink(opts);
      expect(parseLink(built)).toEqual({
        platform: "telegram",
        to: opts.to,
        variant: "scheme",
      });
    });

    it("round-trip body: special chars (SMS)", () => {
      const opts = { to: "+14155551234", body: "&?#" } as const;
      const built = createSmsLink(opts);
      expect(parseLink(built)).toEqual({
        platform: "sms",
        to: opts.to,
        body: opts.body,
      });
    });

    it("round-trip body: newlines (iMessage)", () => {
      const opts = { to: "+14155551234", body: "a\nb\nc" } as const;
      const built = createIMessageLink(opts);
      expect(parseLink(built)).toEqual({
        platform: "imessage",
        to: opts.to,
        body: opts.body,
      });
    });

    it("round-trip body: special chars (Telegram username universal)", () => {
      const body = "&?=#+/!*'()";
      const opts = { to: "durov", body, variant: "universal" as const };
      const built = createTelegramLink(opts);
      expect(parseLink(built)).toEqual({
        platform: "telegram",
        to: "durov",
        body,
        variant: "universal",
      });
    });
  });

  describe("body edge cases", () => {
    it("omits body when query param is empty", () => {
      expect(parseLink("imessage://+14155551234?body=")).toEqual({
        platform: "imessage",
        to: "+14155551234",
      });
    });

    it("omits body when text is empty (whatsapp)", () => {
      expect(parseLink("https://wa.me/14155551234?text=")).toEqual({
        platform: "whatsapp",
        to: "+14155551234",
        variant: "universal",
      });
    });
  });

  describe("unrecognized", () => {
    it("throws for empty string", () => {
      expect(() => parseLink("")).toThrow(UnrecognizedLinkError);
    });

    it("throws for whitespace-only", () => {
      expect(() => parseLink("   ")).toThrow(UnrecognizedLinkError);
    });

    it("throws for non-URI", () => {
      expect(() => parseLink("not a uri")).toThrow(UnrecognizedLinkError);
    });

    it("throws for https://example.com/", () => {
      expect(() => parseLink("https://example.com/")).toThrow(UnrecognizedLinkError);
    });

    it("throws for sms://", () => {
      expect(() => parseLink("sms://+14155551234")).toThrow(UnrecognizedLinkError);
    });

    it("throws for unknown scheme", () => {
      expect(() => parseLink("foo://bar")).toThrow(UnrecognizedLinkError);
    });
  });
});
