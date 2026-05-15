export { createFaceTimeLink, type FaceTimeLinkOptions } from "./facetime";
export { createIMessageLink, type IMessageLinkOptions } from "./imessage";
export { type ParsedLink, parseLink } from "./parse";
export { createSmsLink, type SmsLinkOptions } from "./sms";
export { createTelegramLink, type TelegramLinkOptions } from "./telegram";
export type { BaseLinkOptions, Platform } from "./types";
export { type CreateLinkOptions, createLink } from "./unified";
export { assertEmail, isEmail } from "./utils/email";
export { decodeBody, encodeBody } from "./utils/encode";
export {
  InvalidPhoneNumberError,
  InvalidRecipientError,
  MessageUriError,
  UnrecognizedLinkError,
  UnsupportedFeatureError,
} from "./utils/errors";
export { assertE164, isE164, normalizePhone } from "./utils/phone";
export { createWhatsAppLink, type WhatsAppLinkOptions } from "./whatsapp";
