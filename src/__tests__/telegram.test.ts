import { describe, expect, it } from "bun:test";
import { createTelegramLink } from "../telegram";
import { encodeBody } from "../utils/encode";
import {
  InvalidPhoneNumberError,
  InvalidRecipientError,
  UnsupportedFeatureError,
} from "../utils/errors";

describe("createTelegramLink", () => {
  it("username universal, no body", () => {
    expect(createTelegramLink({ to: "durov" })).toBe("https://t.me/durov");
  });

  it("username universal, with body", () => {
    expect(createTelegramLink({ to: "durov", body: "hi 👋" })).toBe(
      "https://t.me/durov?text=hi%20%F0%9F%91%8B",
    );
  });

  it("username universal, @ prefix stripped", () => {
    expect(createTelegramLink({ to: "@durov" })).toBe("https://t.me/durov");
  });

  it("username scheme, no body", () => {
    expect(createTelegramLink({ to: "durov", variant: "scheme" })).toBe(
      "tg://resolve?domain=durov",
    );
  });

  it("username scheme, with body", () => {
    expect(createTelegramLink({ to: "durov", variant: "scheme", body: "hi" })).toBe(
      "tg://resolve?domain=durov&text=hi",
    );
  });

  it("phone universal, no body", () => {
    expect(createTelegramLink({ to: "+14155551234" })).toBe("https://t.me/+14155551234");
  });

  it("phone scheme, no body", () => {
    expect(createTelegramLink({ to: "+14155551234", variant: "scheme" })).toBe(
      "tg://resolve?phone=14155551234",
    );
  });

  it("phone + body throws UnsupportedFeatureError", () => {
    expect(() => createTelegramLink({ to: "+14155551234", body: "hi" })).toThrow(
      UnsupportedFeatureError,
    );
  });

  it("username too short throws", () => {
    expect(() => createTelegramLink({ to: "a" })).toThrow(InvalidRecipientError);
  });

  it("username too long (>32) throws", () => {
    const long = `a${"b".repeat(32)}`;
    expect(long.length).toBe(33);
    expect(() => createTelegramLink({ to: long })).toThrow(InvalidRecipientError);
  });

  it("username starts with digit throws", () => {
    expect(() => createTelegramLink({ to: "1username" })).toThrow(InvalidRecipientError);
  });

  it("username with invalid chars throws", () => {
    expect(() => createTelegramLink({ to: "not-a-name!" })).toThrow(InvalidRecipientError);
  });

  it("body with emoji (username)", () => {
    expect(createTelegramLink({ to: "durov", body: "hi 👋" })).toBe(
      "https://t.me/durov?text=hi%20%F0%9F%91%8B",
    );
  });

  it("body with special chars (username)", () => {
    const body = "&?=#+/!*'()";
    expect(createTelegramLink({ to: "durov", body })).toBe(
      `https://t.me/durov?text=${encodeBody(body)}`,
    );
  });

  it("body with newlines (username)", () => {
    const body = "a\nb\nc";
    expect(createTelegramLink({ to: "durov", body })).toBe(
      `https://t.me/durov?text=${encodeBody(body)}`,
    );
  });

  it("empty body dropped", () => {
    expect(createTelegramLink({ to: "durov", body: "" })).toBe("https://t.me/durov");
  });

  it("whitespace body dropped", () => {
    expect(createTelegramLink({ to: "durov", body: "   " })).toBe("https://t.me/durov");
  });

  it("valid username exactly 5 chars works", () => {
    expect(createTelegramLink({ to: "abcde" })).toBe("https://t.me/abcde");
  });

  it("valid username exactly 32 chars works", () => {
    const u = `a${"b".repeat(31)}`;
    expect(u.length).toBe(32);
    expect(createTelegramLink({ to: u })).toBe(`https://t.me/${u}`);
  });

  it("+abc throws InvalidPhoneNumberError", () => {
    expect(() => createTelegramLink({ to: "+abc" })).toThrow(InvalidPhoneNumberError);
  });
});
