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
});
