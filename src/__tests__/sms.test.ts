import { describe, expect, it } from "bun:test";
import { createSmsLink } from "../sms";
import { encodeBody } from "../utils/encode";
import { InvalidPhoneNumberError, InvalidRecipientError } from "../utils/errors";

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

  describe("group / multi-recipient", () => {
    it("single-element array matches the string form", () => {
      expect(createSmsLink({ to: ["+14155551234"] })).toBe(createSmsLink({ to: "+14155551234" }));
      expect(createSmsLink({ to: ["+14155551234"] })).toBe("sms:+14155551234");
    });

    it("joins two recipients with a comma per RFC 5724", () => {
      expect(createSmsLink({ to: ["+14155551234", "+14155556789"] })).toBe(
        "sms:+14155551234,+14155556789",
      );
    });

    it("joins three recipients in order with body", () => {
      expect(
        createSmsLink({
          to: ["+14155551234", "+14155556789", "+442071838750"],
          body: "meet at 7",
        }),
      ).toBe("sms:+14155551234,+14155556789,+442071838750?body=meet%20at%207");
    });

    it("normalizes each element independently", () => {
      expect(createSmsLink({ to: ["+1 (415) 555-1234", "+1-415-555-6789"] })).toBe(
        "sms:+14155551234,+14155556789",
      );
    });

    it("deduplicates after normalization, preserving first-occurrence order", () => {
      expect(
        createSmsLink({
          to: ["+14155556789", "+1 (415) 555-1234", "+14155551234", "+14155556789"],
        }),
      ).toBe("sms:+14155556789,+14155551234");
    });

    it("single-element-array-after-dedup collapses like a string", () => {
      expect(createSmsLink({ to: ["+14155551234", "+1 (415) 555-1234"] })).toBe("sms:+14155551234");
    });

    it("throws InvalidRecipientError for empty array", () => {
      expect(() => createSmsLink({ to: [] })).toThrow(InvalidRecipientError);
    });

    it("throws InvalidPhoneNumberError on invalid element mid-list", () => {
      expect(() => createSmsLink({ to: ["+14155551234", "not-a-phone", "+14155556789"] })).toThrow(
        InvalidPhoneNumberError,
      );
    });

    it("still rejects email recipients in any position", () => {
      expect(() => createSmsLink({ to: ["+14155551234", "user@example.com"] })).toThrow(
        InvalidPhoneNumberError,
      );
    });
  });
});
