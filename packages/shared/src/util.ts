/**
 * Normalizes a hex string for Ed25519 public key (32 bytes = 64 hex chars).
 * Removes leading '00' padding if present, as Privy returns 33-byte keys.
 */
export function normalizeEd25519PublicKey(hex: string): string {
  const cleaned = hex.startsWith('0x') ? hex.slice(2) : hex
  // Privy returns 33-byte keys (66 hex chars) with leading 00, but Ed25519 needs 32 bytes (64 hex chars)
  if (cleaned.length === 66 && cleaned.startsWith('00')) {
    return cleaned.slice(2)
  }
  return cleaned
}

/**
 * Normalizes a hex string by removing the '0x' prefix if present.
 */
export function normalizeHex(hex: string): string {
  return hex.startsWith('0x') ? hex.slice(2) : hex
}
