import { type FaceTimeLinkOptions, createFaceTimeLink } from "./facetime";
import { type IMessageLinkOptions, createIMessageLink } from "./imessage";
import { type SmsLinkOptions, createSmsLink } from "./sms";
import { type TelegramLinkOptions, createTelegramLink } from "./telegram";
import { type WhatsAppLinkOptions, createWhatsAppLink } from "./whatsapp";

export type CreateLinkOptions =
  | ({ platform: "imessage" } & IMessageLinkOptions)
  | ({ platform: "sms" } & SmsLinkOptions)
  | ({ platform: "facetime" } & FaceTimeLinkOptions)
  | ({ platform: "whatsapp" } & WhatsAppLinkOptions)
  | ({ platform: "telegram" } & TelegramLinkOptions);

export function createLink(options: CreateLinkOptions): string {
  switch (options.platform) {
    case "imessage": {
      const { platform: _platform, ...rest } = options;
      return createIMessageLink(rest);
    }
    case "sms": {
      const { platform: _platform, ...rest } = options;
      return createSmsLink(rest);
    }
    case "facetime": {
      const { platform: _platform, ...rest } = options;
      return createFaceTimeLink(rest);
    }
    case "whatsapp": {
      const { platform: _platform, ...rest } = options;
      return createWhatsAppLink(rest);
    }
    case "telegram": {
      const { platform: _platform, ...rest } = options;
      return createTelegramLink(rest);
    }
    default: {
      const _exhaustive: never = options;
      throw new Error(`Unknown platform: ${(_exhaustive as { platform: string }).platform}`);
    }
  }
}
