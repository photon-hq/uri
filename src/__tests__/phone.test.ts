import { describe, expect, it } from "bun:test";
import { InvalidPhoneNumberError } from "../utils/errors";
import { assertE164, isE164, normalizePhone } from "../utils/phone";

describe("normalizePhone / assertE164 / isE164", () => {
  it("normalizes US-style input to E.164", () => {
    expect(normalizePhone("+1 (415) 555-1234")).toBe("+14155551234");
    expect(assertE164("+1 (415) 555-1234")).toBe("+14155551234");
  });

  it("accepts minimum length (+ and one digit)", () => {
    expect(normalizePhone("+1")).toBe("+1");
  });

  it("accepts maximum length (15 digits after +)", () => {
    expect(normalizePhone("+123456789012345")).toBe("+123456789012345");
  });

  it("rejects numbers without leading +", () => {
    expect(() => normalizePhone("415-555-1234")).toThrow(InvalidPhoneNumberError);
  });

  it("rejects leading zero after +", () => {
    expect(() => normalizePhone("+0123456789")).toThrow(InvalidPhoneNumberError);
  });

  it("rejects empty input", () => {
    expect(() => normalizePhone("")).toThrow(InvalidPhoneNumberError);
  });

  it("rejects bare +", () => {
    expect(() => normalizePhone("+")).toThrow(InvalidPhoneNumberError);
  });

  it("rejects too many digits", () => {
    expect(() => normalizePhone("+999999999999999999")).toThrow(InvalidPhoneNumberError);
  });

  it("rejects junk", () => {
    expect(() => normalizePhone("not-a-phone")).toThrow(InvalidPhoneNumberError);
  });

  it("isE164 mirrors throwing behavior", () => {
    expect(isE164("+14155551234")).toBe(true);
    expect(isE164("415")).toBe(false);
  });
});
