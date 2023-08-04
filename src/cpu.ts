import {
  IE_OFFSET,
  IF_OFFSET,
  INTERRUPT_VECTOR_OFFSET,
  ROM_START,
  STACK_START,
} from './constants';
import { instructions } from './instructions';
import MemoryMapper from './memory-mapper';
import { Register, RegisterMap, createRegisters } from './register';
import { toHexString } from './util';

export default class CPU {
  private _memory: MemoryMapper;
  private _registers: RegisterMap;
  private _stackFrameSize = 0

  constructor(mm: MemoryMapper) {
    this._memory = mm;

    this._registers = createRegisters();
    this.initRegisters()
  }

  viewMemoryAt(address: number, n = 8) {
    // 0x0f01: 0x04 0x05 0xA3 0xFE 0x13 0x0D 0x44 0x0F ...
    const nextNBytes = Array.from({ length: n }, (_, i) =>
      this._memory.read(address + i)
    ).map((v) => `${toHexString(v)}`)

    console.log(
      `memory @ ${toHexString(address, 4)}: ${nextNBytes.join(
        ' '
      )}`
    )
  }

  initRegisters() {
    this._registers[Register.PC].value = ROM_START;
    this._registers[Register.SP].value = STACK_START - 1;
    this._registers[Register.FP].value = STACK_START - 1;
  }

  readRegister(index: Register): number {
    return this._registers[index].value;
  }

  writeRegister(index: Register, value: number) {
    this._registers[index].value = value;
  }

  fetch(noIncrement = false): number {
    const pc = this.readRegister(Register.PC);
    const value = this._memory.read(pc);
    !noIncrement && this.writeRegister(Register.PC, pc + 1);
    return value;
  }

  fetch16(noIncrement = false): number {
    const pc = this.readRegister(Register.PC);
    const value = this._memory.read16(pc);
    !noIncrement && this.writeRegister(Register.PC, pc + 2);
    return value;
  }

  fetchInstruction(): number {
    const ins = this.fetch();
    this.writeRegister(Register.IR, ins);
    return ins;
  }

  push(value: number) {
    const spAddr = this.readRegister(Register.SP);
    this._memory.write16(spAddr, value);
    this.writeRegister(Register.SP, spAddr - 2);
    this._stackFrameSize += 2
  }

  pop(): number {
    const nextSPAdrr = this.readRegister(Register.SP) + 2;
    this.writeRegister(Register.SP, nextSPAdrr);
    this._stackFrameSize -= 2
    return this._memory.read16(nextSPAdrr);
  }

  requestInterrupt(interrupt: number) {
    const IF = this._memory.read(IF_OFFSET);
    this._memory.write(IF_OFFSET, IF | (1 << interrupt));
  }

  isInterruptRequested(interrupt: number): boolean {
    const IF = this._memory.read(IF_OFFSET);
    return (IF & (1 << interrupt)) !== 0;
  }

  clearInterruptFlag(interrupt: number) {
    const IF = this._memory.read(IF_OFFSET);
    this._memory.write(IF_OFFSET, IF & ~(1 << interrupt));
  }

  handleInterrupts() {
    const IE = this._memory.read(IE_OFFSET);
    const IF = this._memory.read(IF_OFFSET);

    if (IE && IF !== 0) {
      for (let i = 0; i < 8; i++) {
        if (IF & (1 << i) && IE & (1 << i)) {
          // Save current PC to stack
          this.push(this._registers[Register.PC].value);

          // Get the address of the interrupt vector for this interrupt
          const interruptVectorAddr = INTERRUPT_VECTOR_OFFSET + i * 2;
          const interruptHandlerAddr = this._memory.read16(interruptVectorAddr);

          // Call the interrupt handler
          this._registers[Register.PC].value = interruptHandlerAddr;

          // Clear the interrupt flag for this interrupt
          this.clearInterruptFlag(i);

          // Break the loop to handle only one interrupt at a time
          break;
        }
      }
    }
  }

  ldaSetFlags() {
    const A = this._registers[Register.A];
    const FR = this._registers[Register.FR];

    if (A.value === 0) {
      FR.value |= 0b01000000;
    }
    if ((A.value & 0b10000000) > 0) {
      FR.value |= 0b00000001;
    }
  }

  cycle() {
    const ins = this.fetchInstruction();
    switch (ins) {
      case instructions.NOP.opcode: {
        break;
      }
      case instructions.LDA_IMM.opcode: {
        const value = this.fetch();

        this._registers[Register.A].value = value;
        this.ldaSetFlags();

        break;
      }
      case instructions.LDA_ZP.opcode: {
        const addr = this.fetch();
        const value = this._memory.read(addr);
        
        this._registers[Register.A].value = value;
        this.ldaSetFlags();

        break;
      }
      case instructions.JSR.opcode: {
        const subAddr = this.fetch16();
        
        this.push(this.readRegister(Register.PC));
        this.writeRegister(Register.PC, subAddr);

        break;
      }
      default:
        console.error(`Unknown instruction: ${ins.toString(16)}`);
        debugger;
    }
  }

  reset() {
    this.initRegisters()
  }
}
