import { describe, expect, it } from "vitest";
import { createPolicyAcceptance, hasCurrentPolicyAcceptance } from "./legal-policies";

describe("policy acceptance", () => {
  it("blocks visitors who have not accepted", () => {
    expect(hasCurrentPolicyAcceptance(null)).toBe(false);
  });
  it("accepts both policies dated November 11, 2026", () => {
    const record = JSON.parse(createPolicyAcceptance());
    expect(record.termsVersion).toBe("2026-11-11");
    expect(record.privacyVersion).toBe("2026-11-11");
    expect(hasCurrentPolicyAcceptance(JSON.stringify(record))).toBe(true);
  });
  it("requires acceptance again when either policy is outdated", () => {
    expect(hasCurrentPolicyAcceptance(JSON.stringify({ termsVersion: "2026-04-10", privacyVersion: "2026-11-11" }))).toBe(false);
    expect(hasCurrentPolicyAcceptance(JSON.stringify({ termsVersion: "2026-11-11", privacyVersion: "2026-04-11" }))).toBe(false);
  });
  it("does not accept malformed or incomplete records", () => {
    for (const raw of ["invalid", "null", "{}", '{"termsVersion":"2026-11-11"}']) {
      expect(hasCurrentPolicyAcceptance(raw)).toBe(false);
    }
  });
});