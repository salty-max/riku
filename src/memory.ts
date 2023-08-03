export interface Memory {
  byteLength: number;
  read(address: number): number;
  read16(address: number): number;
  write(address: number, value: number): void;
  write16(address: number, value: number): void;
  load(data: Uint8Array, offset?: number): void;
  slice(start: number, end: number): Uint8Array;
}

export const createRAM = (size: number): Memory => {
  const memory = new DataView(new ArrayBuffer(size));
  return {
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
    }
  };
}

export const createROM = (data: Uint8Array): Memory => {
  const memory = new DataView(data.buffer);
  return {
    byteLength: memory.byteLength,
    read: memory.getUint8.bind(memory),
    read16: memory.getUint16.bind(memory),
    write: () => 0,
    write16: () => 0,
    load() {
      throw new Error('Cannot load ROM');
    },
    slice(start: number, end: number) {
      return new Uint8Array(memory.buffer.slice(start, end));
    }
  };
}