export type { BaseLinkOptions, Platform } from "./types";
export {
  InvalidPhoneNumberError,
  InvalidRecipientError,
  MessageUriError,
  UnrecognizedLinkError,
  UnsupportedFeatureError,
} from "./utils/errors";
export { assertEmail, isEmail } from "./utils/email";
export { decodeBody, encodeBody } from "./utils/encode";
export { assertE164, isE164, normalizePhone } from "./utils/phone";

export { createIMessageLink, type IMessageLinkOptions } from "./imessage";
export { createSmsLink, type SmsLinkOptions } from "./sms";
export { createFaceTimeLink, type FaceTimeLinkOptions } from "./facetime";
export { createWhatsAppLink, type WhatsAppLinkOptions } from "./whatsapp";
export { createTelegramLink, type TelegramLinkOptions } from "./telegram";

export { createLink, type CreateLinkOptions } from "./unified";
export { parseLink, type ParsedLink } from "./parse";
