import { describe, expect, it } from "bun:test";
import { decodeBody, encodeBody } from "../utils/encode";

describe("encodeBody / decodeBody", () => {
  it("round-trips emoji", () => {
    const s = "hi 👋";
    expect(decodeBody(encodeBody(s))).toBe(s);
  });

  it("round-trips newlines", () => {
    const s = "a\nb\nc";
    expect(decodeBody(encodeBody(s))).toBe(s);
    expect(encodeBody(s)).toContain("%0A");
  });

  it("encodes reserved and special characters for query bodies", () => {
    const s = "&?=#+/!*'()";
    expect(decodeBody(encodeBody(s))).toBe(s);
  });

  it("uses %20 for spaces (not +)", () => {
    expect(encodeBody("a b")).toBe("a%20b");
  });

  it("round-trips empty string", () => {
    expect(decodeBody(encodeBody(""))).toBe("");
  });

  it("round-trips unicode beyond BMP", () => {
    const s = "𠜎";
    expect(decodeBody(encodeBody(s))).toBe(s);
  });
});
