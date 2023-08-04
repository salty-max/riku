export interface Instruction {
  opcode: number;
  ticks: number;
  size: number;
}

export const instructions: Record<string, Instruction> = {
  NOP: { opcode: 0x00, ticks: 1, size: 1 },
  LDA_IMM: { opcode: 0xa9, ticks: 2, size: 2 },
  LDA_ZP: { opcode: 0xa5, ticks: 3, size: 2 },
  LDA_ZP_X: { opcode: 0xb5, ticks: 4, size: 2 },
  LDA_ABS: { opcode: 0xad, ticks: 4, size: 3 },
  LDA_ABS_X: { opcode: 0xbd, ticks: 4, size: 3 },
  LDA_ABS_Y: { opcode: 0xb9, ticks: 4, size: 3 },
};
