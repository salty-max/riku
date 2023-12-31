export interface Memory {
  ab: ArrayBuffer
  byteLength: number;
  read(offset: number): number;
  read16(offset: number, littleEndian?: boolean): number;
  write(offset: number, value: number): void;
  write16(offset: number, value: number, littleEndian?: boolean): void;
  load(data: Uint8Array, offset?: number): void;
  slice(start: number, end: number): Uint8Array;
  reset(): void;
}

export const createRAM = (size: number): Memory => {
  const memory = new DataView(new ArrayBuffer(size));
  return {
    ab: memory.buffer,
    byteLength: memory.byteLength,
    read: memory.getUint8.bind(memory),
    read16: memory.getUint16.bind(memory),
    write: memory.setUint8.bind(memory),
    write16: memory.setUint16.bind(memory),
    load(data: Uint8Array, offset = 0) {
      data.forEach((byte, index) => memory.setUint8(index + offset, byte));
    },
    slice(start: number, end: number) {
      return new Uint8Array(memory.buffer.slice(start, end));
    },
    reset() {
      for (let i = 0; i < memory.byteLength; i++) {
        memory.setUint8(i, 0);
      }
    },
  };
};

export const createROM = (size: number): Memory => {
  const memory = new DataView(new ArrayBuffer(size));
  return {
    ab: memory.buffer,
    byteLength: memory.byteLength,
    read: memory.getUint8.bind(memory),
    read16: memory.getUint16.bind(memory),
    write: () => 0,
    write16: () => 0,
    load(data: Uint8Array, offset = 0) {
      data.forEach((byte, index) => memory.setUint8(offset + index, byte));
    },
    slice(start: number, end: number) {
      return new Uint8Array(memory.buffer.slice(start, end));
    },
    reset() {
      for (let i = 0; i < memory.byteLength; i++) {
        memory.setUint8(i, 0);
      }
    },
  };
};
