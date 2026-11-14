export const PRIVACY_REQUEST_TYPES = [
  { value: "access", label: "Access my data" },
  { value: "correction", label: "Correct my data" },
  { value: "portability", label: "Data portability" },
  { value: "restriction", label: "Restrict processing" },
  { value: "objection", label: "Object to processing" },
  { value: "deletion", label: "Request deletion" },
  { value: "other", label: "Other privacy request" },
] as const;

export type PrivacyRequestType = (typeof PRIVACY_REQUEST_TYPES)[number]["value"];

export const ACCOUNT_DELETE_CONFIRMATION = "DELETE";

export function canConfirmAccountDeletion(value: string): boolean {
  return value === ACCOUNT_DELETE_CONFIRMATION;
}
