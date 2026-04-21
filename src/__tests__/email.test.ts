import { describe, expect, it } from "bun:test";
import { assertEmail, isEmail } from "../utils/email";
import { InvalidRecipientError } from "../utils/errors";

describe("isEmail / assertEmail", () => {
  it("accepts a simple address", () => {
    expect(isEmail("user@example.com")).toBe(true);
    expect(assertEmail("user@example.com")).toBe("user@example.com");
  });

  it("rejects non-email strings", () => {
    expect(isEmail("notanemail")).toBe(false);
    expect(() => assertEmail("notanemail")).toThrow(InvalidRecipientError);
  });

  it("rejects empty", () => {
    expect(isEmail("")).toBe(false);
    expect(() => assertEmail("")).toThrow(InvalidRecipientError);
  });

  it("rejects missing local part", () => {
    expect(isEmail("@example.com")).toBe(false);
  });

  it("rejects missing domain", () => {
    expect(isEmail("user@")).toBe(false);
  });
});
