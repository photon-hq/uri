import { describe, expect, it } from "bun:test";
import {
  InvalidPhoneNumberError,
  InvalidRecipientError,
  MessageUriError,
  UnrecognizedLinkError,
  UnsupportedFeatureError,
} from "../utils/errors";

describe("typed errors", () => {
  it("preserves instanceof and inheritance", () => {
    const e = new InvalidPhoneNumberError("+bad");
    expect(e instanceof InvalidPhoneNumberError).toBe(true);
    expect(e instanceof MessageUriError).toBe(true);
    expect(e instanceof Error).toBe(true);
  });

  it("sets correct .name for each class", () => {
    expect(new MessageUriError("x").name).toBe("MessageUriError");
    expect(new InvalidPhoneNumberError("+x").name).toBe("InvalidPhoneNumberError");
    expect(new InvalidRecipientError("x").name).toBe("InvalidRecipientError");
    expect(new UnsupportedFeatureError("body", "sms").name).toBe("UnsupportedFeatureError");
    expect(new UnrecognizedLinkError("x").name).toBe("UnrecognizedLinkError");
  });

  it("exposes optional reason on phone, recipient, and link errors", () => {
    expect(new InvalidPhoneNumberError("+x", "bad format").reason).toBe("bad format");
    expect(new InvalidPhoneNumberError("+x").reason).toBeUndefined();
    expect(new InvalidRecipientError("x", "not an email").reason).toBe("not an email");
    expect(new InvalidRecipientError("x").reason).toBeUndefined();
    expect(new UnrecognizedLinkError("x", "unknown scheme").reason).toBe("unknown scheme");
    expect(new UnrecognizedLinkError("x").reason).toBeUndefined();
  });
});
