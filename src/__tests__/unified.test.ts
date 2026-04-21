import { describe, expect, it } from "bun:test";
import { createIMessageLink } from "../imessage";
import { createLink } from "../unified";
import { InvalidPhoneNumberError } from "../utils/errors";

describe("createLink", () => {
  it("imessage happy path", () => {
    expect(createLink({ platform: "imessage", to: "+14155551234", body: "hi" })).toBe(
      "imessage://+14155551234?body=hi",
    );
  });

  it("sms happy path", () => {
    expect(createLink({ platform: "sms", to: "+14155551234" })).toBe("sms:+14155551234");
  });

  it("facetime happy path", () => {
    expect(createLink({ platform: "facetime", to: "+14155551234", mode: "audio" })).toBe(
      "facetime-audio:+14155551234",
    );
  });

  it("whatsapp happy path", () => {
    expect(
      createLink({
        platform: "whatsapp",
        to: "+14155551234",
        body: "hi",
        variant: "scheme",
      }),
    ).toBe("whatsapp://send?phone=14155551234&text=hi");
  });

  it("telegram happy path", () => {
    expect(createLink({ platform: "telegram", to: "durov", body: "hi" })).toBe(
      "https://t.me/durov?text=hi",
    );
  });

  it("rejects options that do not belong to the chosen platform", () => {
    // @ts-expect-error SMS does not accept FaceTime mode
    createLink({ platform: "sms", to: "+14155551234", mode: "audio" });
  });

  it("matches direct builder for imessage", () => {
    const to = "+14155551234";
    const body = "hi";
    expect(createLink({ platform: "imessage", to, body })).toBe(createIMessageLink({ to, body }));
  });

  it("propagates InvalidPhoneNumberError from sms", () => {
    expect(() => createLink({ platform: "sms", to: "junk" })).toThrowError(InvalidPhoneNumberError);
  });
});
