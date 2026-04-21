import { describe, expect, it } from "bun:test";
import { createFaceTimeLink } from "../facetime";
import { InvalidPhoneNumberError, InvalidRecipientError } from "../utils/errors";

describe("createFaceTimeLink", () => {
  it("defaults to video mode for phone", () => {
    expect(createFaceTimeLink({ to: "+14155551234" })).toBe("facetime:+14155551234");
  });

  it("supports explicit video mode", () => {
    expect(createFaceTimeLink({ to: "+14155551234", mode: "video" })).toBe("facetime:+14155551234");
  });

  it("uses facetime-audio scheme for audio mode", () => {
    expect(createFaceTimeLink({ to: "+14155551234", mode: "audio" })).toBe(
      "facetime-audio:+14155551234",
    );
  });

  it("normalizes phone input to E.164", () => {
    expect(createFaceTimeLink({ to: "+1 (415) 555-1234" })).toBe("facetime:+14155551234");
  });

  it("accepts email recipient with video", () => {
    expect(createFaceTimeLink({ to: "user@example.com" })).toBe("facetime:user@example.com");
  });

  it("accepts email recipient with audio", () => {
    expect(createFaceTimeLink({ to: "user@example.com", mode: "audio" })).toBe(
      "facetime-audio:user@example.com",
    );
  });

  it("accepts Apple ID-style iCloud email", () => {
    expect(createFaceTimeLink({ to: "user@icloud.com", mode: "audio" })).toBe(
      "facetime-audio:user@icloud.com",
    );
  });

  it("throws InvalidPhoneNumberError for invalid phone", () => {
    expect(() => createFaceTimeLink({ to: "not-a-number" })).toThrow(InvalidPhoneNumberError);
  });

  it("throws InvalidRecipientError for invalid email", () => {
    expect(() => createFaceTimeLink({ to: "@broken" })).toThrow(InvalidRecipientError);
  });

  it("throws for empty to", () => {
    expect(() => createFaceTimeLink({ to: "" })).toThrow(InvalidPhoneNumberError);
  });
});
