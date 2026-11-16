export const ACCOUNT_DELETE_CONFIRMATION = "DELETE";
export const DISPLAY_NAME_MAX_LENGTH = 40;

export function canConfirmAccountDeletion(value: string): boolean {
  return value === ACCOUNT_DELETE_CONFIRMATION;
}

export function normalizeDisplayName(value: string): string | null {
  const displayName = value.trim();
  if (!displayName || displayName.length > DISPLAY_NAME_MAX_LENGTH) return null;
  return displayName;
}
