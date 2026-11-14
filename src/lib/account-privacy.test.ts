import { describe, expect, it } from "vitest";
import { canConfirmAccountDeletion } from "./account-privacy";

describe("account deletion confirmation", () => {
  it("only allows permanent deletion after typing DELETE exactly", () => {
    expect(canConfirmAccountDeletion("DELETE")).toBe(true);
    expect(canConfirmAccountDeletion("delete")).toBe(false);
    expect(canConfirmAccountDeletion("DELETE ")).toBe(false);
    expect(canConfirmAccountDeletion("")).toBe(false);
  });
});
