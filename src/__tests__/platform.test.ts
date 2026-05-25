import { describe, expect, it } from "bun:test";
import { supportsFaceTimePromptScheme } from "../utils/platform";

describe("supportsFaceTimePromptScheme", () => {
  it("returns false on macOS runtimes (darwin)", () => {
    if (process.platform === "darwin") {
      expect(supportsFaceTimePromptScheme()).toBe(false);
    }
  });
});
