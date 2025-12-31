/**
 * Generate a unique ID using timestamp and random string
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a short unique ID
 */
export function generateShortId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Generate a UUID-like ID
 */
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Check if a string is a valid ID format
 */
export function isValidId(id: string): boolean {
  return /^[a-zA-Z0-9-]+$/.test(id) && id.length > 0;
}
