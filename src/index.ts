import {
  BANK_ROM_SIZE,
  BANK_ROM_START,
  CART_DATA_SIZE,
  CART_DATA_START,
  FREE_1_SIZE,
  FREE_1_START,
  FREE_2_SIZE,
  FREE_2_START,
  IO_SIZE,
  IO_START,
  KERNEL_SIZE,
  KERNEL_START,
  RAM_SIZE,
  RAM_START,
  ROM_SIZE,
  ROM_START,
  SID_SIZE,
  SID_START,
  SPRITE_TABLE_SIZE,
  SPRITE_TABLE_START,
  STACK_END,
  STACK_SIZE,
  VBLANK_INTERRUPT,
  VRAM_SIZE,
  VRAM_START,
  ZP_SIZE,
  ZP_START,
} from './constants';
import CPU from './cpu';
import { createRAM, createROM } from './memory';
import MemoryMapper from './memory-mapper';

const program = new Uint8Array([
  0xa9,
  0x42, // LDA_IMM $42
]);

class Riku {
  private _cpu: CPU;
  private _MM: MemoryMapper;
  private _clockSpeed = 4194304;
  private _vBlankInterruptCycle = Math.floor(this._clockSpeed / 60);

  constructor() {
    this._MM = new MemoryMapper();
    this.initMemory();
    this._cpu = new CPU(this._MM);
  }

  boot() {
    this.loadProgram(program);
    this.loop();
  }

  reset() {
    this._MM.reset();
    this._cpu.reset();
  }

  initMemory() {
    this._MM.map('ZERO_PAGE', createRAM(256), ZP_START, ZP_SIZE);
    this._MM.map('STACK', createRAM(256), STACK_END, STACK_SIZE);
    this._MM.map('IO_REGISTERS', createRAM(256), IO_START, IO_SIZE);
    this._MM.map('FREE_1', createRAM(256), FREE_1_START, FREE_1_SIZE);
    this._MM.map('ROM', createROM(16384), ROM_START, ROM_SIZE);
    this._MM.map('BANK_ROM', createROM(8192), BANK_ROM_START, BANK_ROM_SIZE);
    this._MM.map('CART_DATA', createRAM(1024), CART_DATA_START, CART_DATA_SIZE);
    this._MM.map('RAM', createRAM(24576), RAM_START, RAM_SIZE);
    this._MM.map('VRAM', createRAM(1024), VRAM_START, VRAM_SIZE);
    this._MM.map(
      'SPRITE_TABLE',
      createRAM(512),
      SPRITE_TABLE_START,
      SPRITE_TABLE_SIZE,
    );
    this._MM.map('SID', createRAM(4096), SID_START, SID_SIZE);
    this._MM.map('FREE_2', createROM(768), FREE_2_START, FREE_2_SIZE);
    this._MM.map('KERNEL', createROM(8192), KERNEL_START, KERNEL_SIZE);

    console.log(this._MM.byteLength);
  }

  loadProgram(program: Uint8Array) {
    this._MM.load(program, ROM_START);
  }

  loop() {
    for (let cycle = 0; cycle < this._clockSpeed; cycle++) {
      this._cpu.cycle();
      if (cycle === this._vBlankInterruptCycle) {
        this._cpu.requestInterrupt(VBLANK_INTERRUPT);
      }
    }

    // TODO: DRAW

    this._cpu.handleInterrupts();
    requestAnimationFrame(() => this.loop());
  }
}

const riku = new Riku();
riku.boot();
