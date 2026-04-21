import { assertEmail } from "./utils/email";
import { encodeBody } from "./utils/encode";
import { assertE164 } from "./utils/phone";

export interface IMessageLinkOptions {
  to: string;
  body?: string;
}

export function createIMessageLink(options: IMessageLinkOptions): string {
  const { to, body } = options;
  const recipient = to.includes("@") ? assertEmail(to) : assertE164(to);
  let href = `imessage://${recipient}`;
  if (body !== undefined && body.trim() !== "") {
    href += `?body=${encodeBody(body)}`;
  }
  return href;
}
