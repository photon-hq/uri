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

  describe("prompt variants", () => {
    it("emits facetime-prompt: for video + prompt true", () => {
      expect(createFaceTimeLink({ to: "+14155551234", prompt: true })).toBe(
        "facetime-prompt:+14155551234",
      );
    });

    it("emits facetime-audio-prompt: for audio + prompt true", () => {
      expect(createFaceTimeLink({ to: "+14155551234", mode: "audio", prompt: true })).toBe(
        "facetime-audio-prompt:+14155551234",
      );
    });

    it("prompt false is identical to omitting the option", () => {
      const base = createFaceTimeLink({ to: "+14155551234" });
      const explicit = createFaceTimeLink({ to: "+14155551234", prompt: false });
      expect(explicit).toBe(base);
      expect(explicit).toBe("facetime:+14155551234");
    });

    it("prompt works with email recipients (video)", () => {
      expect(createFaceTimeLink({ to: "user@icloud.com", prompt: true })).toBe(
        "facetime-prompt:user@icloud.com",
      );
    });

    it("prompt works with email recipients (audio)", () => {
      expect(createFaceTimeLink({ to: "user@icloud.com", mode: "audio", prompt: true })).toBe(
        "facetime-audio-prompt:user@icloud.com",
      );
    });

    it("normalizes phone input under prompt variant", () => {
      expect(createFaceTimeLink({ to: "+1 (415) 555-1234", prompt: true })).toBe(
        "facetime-prompt:+14155551234",
      );
    });
  });
});
