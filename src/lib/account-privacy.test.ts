import { describe, expect, it } from "vitest";
import { canConfirmAccountDeletion, normalizeDisplayName } from "./account-privacy";

describe("account deletion confirmation", () => {
  it("only allows permanent deletion after typing DELETE exactly", () => {
    expect(canConfirmAccountDeletion("DELETE")).toBe(true);
    expect(canConfirmAccountDeletion("delete")).toBe(false);
    expect(canConfirmAccountDeletion("DELETE ")).toBe(false);
    expect(canConfirmAccountDeletion("")).toBe(false);
  });
});

describe("automatic display-name correction", () => {
  it("trims a valid name and accepts up to 40 characters", () => {
    expect(normalizeDisplayName("  Leon  ")).toBe("Leon");
    expect(normalizeDisplayName("x".repeat(40))).toBe("x".repeat(40));
  });

  it("rejects empty names and names longer than 40 characters", () => {
    expect(normalizeDisplayName("   ")).toBeNull();
    expect(normalizeDisplayName("x".repeat(41))).toBeNull();
  });
});
