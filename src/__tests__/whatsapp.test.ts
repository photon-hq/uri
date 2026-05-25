import { describe, expect, it } from "bun:test";
import { encodeBody } from "../utils/encode";
import { InvalidPhoneNumberError } from "../utils/errors";
import { createWhatsAppLink } from "../whatsapp";

describe("createWhatsAppLink", () => {
  it("with body", () => {
    expect(createWhatsAppLink({ to: "+14155551234", body: "Hello" })).toBe(
      "https://wa.me/14155551234?text=Hello",
    );
  });

  it("no body", () => {
    expect(createWhatsAppLink({ to: "+14155551234" })).toBe("https://wa.me/14155551234");
  });

  it("normalizes phone and strips + from URL", () => {
    expect(createWhatsAppLink({ to: "+1 (415) 555-1234", body: "hello" })).toBe(
      "https://wa.me/14155551234?text=hello",
    );
  });

  it("encodes body with emoji", () => {
    expect(createWhatsAppLink({ to: "+14155551234", body: "hi 👋" })).toBe(
      "https://wa.me/14155551234?text=hi%20%F0%9F%91%8B",
    );
  });

  it("encodes body with special characters", () => {
    const body = "&?=#";
    expect(createWhatsAppLink({ to: "+14155551234", body })).toBe(
      `https://wa.me/14155551234?text=${encodeBody(body)}`,
    );
  });

  it("encodes body with newlines", () => {
    const body = "a\nb\nc";
    expect(createWhatsAppLink({ to: "+14155551234", body })).toBe(
      `https://wa.me/14155551234?text=${encodeBody(body)}`,
    );
  });

  it("omits text param when body is empty string", () => {
    expect(createWhatsAppLink({ to: "+14155551234", body: "" })).toBe("https://wa.me/14155551234");
  });

  it("omits text param when body is whitespace-only", () => {
    expect(createWhatsAppLink({ to: "+14155551234", body: "   " })).toBe(
      "https://wa.me/14155551234",
    );
  });

  it("throws for non-E.164 phone", () => {
    expect(() => createWhatsAppLink({ to: "415-555-1234" })).toThrow(InvalidPhoneNumberError);
  });

  it("throws for email", () => {
    expect(() => createWhatsAppLink({ to: "user@example.com" })).toThrow(InvalidPhoneNumberError);
  });
});
