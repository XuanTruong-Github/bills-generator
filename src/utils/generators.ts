const ALPHANUMERIC_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Generates a 16-character uppercase alphanumeric reference code
 * matching the format used by VCB Digibank (e.g., '6289BFTVGLCCKWSZ').
 */
export function generateRandomReferenceCode(): string {
  let result = '';
  for (let i = 0; i < 16; i++) {
    const randomIndex = Math.floor(Math.random() * ALPHANUMERIC_CHARS.length);
    result += ALPHANUMERIC_CHARS[randomIndex];
  }
  return result;
}

/**
 * Generates an 11-digit numeric transaction ID
 * matching the format used by VCB Digibank (e.g., '16559745403').
 */
export function generateRandomTransactionId(): string {
  // First digit non-zero (1-9) to avoid leading zero ambiguity
  let result = String(Math.floor(Math.random() * 9) + 1);
  for (let i = 0; i < 10; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}
