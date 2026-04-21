export type Platform = "sms" | "imessage" | "facetime" | "whatsapp" | "telegram";

export interface BaseLinkOptions {
  to: string;
  body?: string;
}
