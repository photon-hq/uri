export class MessageUriError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MessageUriError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidPhoneNumberError extends MessageUriError {
  readonly input: string;
  readonly reason?: string;

  constructor(input: string, reason?: string) {
    const msg =
      reason !== undefined
        ? `Invalid phone number: ${JSON.stringify(input)} (${reason})`
        : `Invalid phone number: ${JSON.stringify(input)}`;
    super(msg);
    this.name = "InvalidPhoneNumberError";
    this.input = input;
    this.reason = reason;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidRecipientError extends MessageUriError {
  readonly input: string;

  constructor(input: string, reason?: string) {
    const msg =
      reason !== undefined
        ? `Invalid recipient: ${JSON.stringify(input)} (${reason})`
        : `Invalid recipient: ${JSON.stringify(input)}`;
    super(msg);
    this.name = "InvalidRecipientError";
    this.input = input;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UnsupportedFeatureError extends MessageUriError {
  readonly feature: string;
  readonly platform?: string;

  constructor(feature: string, platform?: string) {
    const msg =
      platform !== undefined
        ? `Unsupported feature ${JSON.stringify(feature)} on ${platform}`
        : `Unsupported feature ${JSON.stringify(feature)}`;
    super(msg);
    this.name = "UnsupportedFeatureError";
    this.feature = feature;
    this.platform = platform;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UnrecognizedLinkError extends MessageUriError {
  readonly input: string;

  constructor(input: string, reason?: string) {
    const msg =
      reason !== undefined
        ? `Unrecognized link: ${JSON.stringify(input)} (${reason})`
        : `Unrecognized link: ${JSON.stringify(input)}`;
    super(msg);
    this.name = "UnrecognizedLinkError";
    this.input = input;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
