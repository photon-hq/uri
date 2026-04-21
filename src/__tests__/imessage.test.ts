import { describe, expect, it } from "bun:test";
import { createIMessageLink } from "../imessage";
import { InvalidPhoneNumberError, InvalidRecipientError } from "../utils/errors";

describe("createIMessageLink", () => {
  it("happy path phone with body", () => {
    expect(createIMessageLink({ to: "+14155551234", body: "hello" })).toBe(
      "imessage://+14155551234?body=hello",
    );
  });

  it("happy path phone no body", () => {
    expect(createIMessageLink({ to: "+14155551234" })).toBe("imessage://+14155551234");
  });

  it("normalizes formatted phone input", () => {
    expect(createIMessageLink({ to: "+1 (415) 555-1234" })).toBe("imessage://+14155551234");
  });

  it("email recipient with body", () => {
    expect(createIMessageLink({ to: "user@example.com", body: "hello" })).toBe(
      "imessage://user@example.com?body=hello",
    );
  });

  it("email recipient no body", () => {
    expect(createIMessageLink({ to: "user@example.com" })).toBe("imessage://user@example.com");
  });

  it("omits query when body is empty string", () => {
    expect(createIMessageLink({ to: "+14155551234", body: "" })).toBe("imessage://+14155551234");
  });

  it("omits query when body is whitespace only", () => {
    expect(createIMessageLink({ to: "+14155551234", body: "   \t\n" })).toBe(
      "imessage://+14155551234",
    );
  });

  it("encodes body with special chars", () => {
    expect(createIMessageLink({ to: "+14155551234", body: "&?#" })).toBe(
      "imessage://+14155551234?body=%26%3F%23",
    );
  });

  it("encodes body with emoji", () => {
    expect(createIMessageLink({ to: "+14155551234", body: "hi 👋" })).toBe(
      "imessage://+14155551234?body=hi%20%F0%9F%91%8B",
    );
  });

  it("encodes body with newlines", () => {
    expect(createIMessageLink({ to: "+14155551234", body: "a\nb\nc" })).toBe(
      "imessage://+14155551234?body=a%0Ab%0Ac",
    );
  });

  it("throws InvalidPhoneNumberError for invalid phone", () => {
    expect(() => createIMessageLink({ to: "not-a-number" })).toThrow(InvalidPhoneNumberError);
  });

  it("throws InvalidRecipientError for invalid email", () => {
    expect(() => createIMessageLink({ to: "@broken" })).toThrow(InvalidRecipientError);
  });

  describe("group / multi-recipient", () => {
    it("single-element array matches the string form", () => {
      expect(createIMessageLink({ to: ["+14155551234"] })).toBe(
        createIMessageLink({ to: "+14155551234" }),
      );
      expect(createIMessageLink({ to: ["+14155551234"] })).toBe("imessage://+14155551234");
    });

    it("joins two phone recipients with a comma", () => {
      expect(createIMessageLink({ to: ["+14155551234", "+14155556789"] })).toBe(
        "imessage://+14155551234,+14155556789",
      );
    });

    it("joins a phone and an email recipient", () => {
      expect(createIMessageLink({ to: ["+14155551234", "user@example.com"] })).toBe(
        "imessage://+14155551234,user@example.com",
      );
    });

    it("preserves body when sending to a group", () => {
      expect(
        createIMessageLink({
          to: ["+14155551234", "+14155556789"],
          body: "hi 👋",
        }),
      ).toBe("imessage://+14155551234,+14155556789?body=hi%20%F0%9F%91%8B");
    });

    it("normalizes each phone independently", () => {
      expect(createIMessageLink({ to: ["+1 (415) 555-1234", "+1-415-555-6789"] })).toBe(
        "imessage://+14155551234,+14155556789",
      );
    });

    it("deduplicates mixed phones and emails after normalization", () => {
      expect(
        createIMessageLink({
          to: ["+14155551234", "user@example.com", "+1 (415) 555-1234", "user@example.com"],
        }),
      ).toBe("imessage://+14155551234,user@example.com");
    });

    it("throws InvalidRecipientError for empty array", () => {
      expect(() => createIMessageLink({ to: [] })).toThrow(InvalidRecipientError);
    });

    it("throws InvalidPhoneNumberError if any phone in list is invalid", () => {
      expect(() => createIMessageLink({ to: ["+14155551234", "not-a-phone"] })).toThrow(
        InvalidPhoneNumberError,
      );
    });

    it("throws InvalidRecipientError if any email in list is invalid", () => {
      expect(() => createIMessageLink({ to: ["+14155551234", "@broken"] })).toThrow(
        InvalidRecipientError,
      );
    });
  });
});
