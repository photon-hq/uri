import { describe, expect, it } from "bun:test";
import { createSmsLink } from "../sms";
import { encodeBody } from "../utils/encode";
import { InvalidPhoneNumberError } from "../utils/errors";

describe("createSmsLink", () => {
  it("happy path with body", () => {
    expect(createSmsLink({ to: "+14155551234", body: "Hello" })).toBe(
      "sms:+14155551234?body=Hello",
    );
  });

  it("happy path no body", () => {
    expect(createSmsLink({ to: "+14155551234" })).toBe("sms:+14155551234");
  });

  it("normalizes formatted phone input", () => {
    expect(createSmsLink({ to: "+1 (415) 555-1234" })).toBe("sms:+14155551234");
    expect(createSmsLink({ to: "+1 (415) 555-1234", body: "x" })).toBe("sms:+14155551234?body=x");
  });

  it("omits query when body is empty string", () => {
    expect(createSmsLink({ to: "+14155551234", body: "" })).toBe("sms:+14155551234");
  });

  it("omits query when body is whitespace-only", () => {
    expect(createSmsLink({ to: "+14155551234", body: "   " })).toBe("sms:+14155551234");
  });

  it("encodes body with emoji", () => {
    expect(createSmsLink({ to: "+14155551234", body: "hi 👋" })).toBe(
      "sms:+14155551234?body=hi%20%F0%9F%91%8B",
    );
  });

  it("encodes body with special characters", () => {
    const body = "&?=#+/!*'()";
    expect(createSmsLink({ to: "+14155551234", body })).toBe(
      `sms:+14155551234?body=${encodeBody(body)}`,
    );
  });

  it("encodes body with newlines", () => {
    const body = "a\nb\nc";
    expect(createSmsLink({ to: "+14155551234", body })).toBe(
      `sms:+14155551234?body=${encodeBody(body)}`,
    );
  });

  it("throws for email recipient", () => {
    expect(() => createSmsLink({ to: "user@example.com" })).toThrow(InvalidPhoneNumberError);
  });

  it("throws for non-E.164 phone", () => {
    expect(() => createSmsLink({ to: "415-555-1234" })).toThrow(InvalidPhoneNumberError);
  });

  it("throws for empty to", () => {
    expect(() => createSmsLink({ to: "" })).toThrow(InvalidPhoneNumberError);
  });
});
