export type Platform = "sms" | "imessage" | "facetime" | "whatsapp" | "telegram";

export interface BaseLinkOptions {
  body?: string;
  to: string;
}
