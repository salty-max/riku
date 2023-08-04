export const toHexString = (value: number, length = 2): string => {
  return `0x${value.toString(16).padStart(length, '0')}`;
}

export const toBinaryString = (value: number, length = 8): string => {
  return `0b${value.toString(2).padStart(length, '0')}`;
}