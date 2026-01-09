export function normalizeEd25519PublicKey(hex: string): string {
  const cleaned = hex.startsWith('0x') ? hex.slice(2) : hex
  if (cleaned.length === 66 && cleaned.startsWith('00')) {
    return cleaned.slice(2)
  }
  return cleaned
}

export function normalizeHex(hex: string): string {
  return hex.startsWith('0x') ? hex.slice(2) : hex
}
