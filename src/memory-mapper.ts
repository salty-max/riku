import { Memory } from './memory';

interface Region {
  label: string;
  device: Memory;
  start: number;
  end: number;
  remap: boolean;
}

export default class MemoryMapper {
  private _regions: Array<Region>;

  constructor() {
    this._regions = [];
  }

  get byteLength(): number {
    return Math.max(...this._regions.map((r) => r.end));
  }

  map(
    label: string,
    device: Memory,
    start: number,
    size: number,
    remap = true,
  ) {
    const end = start + size - 1;
    const region: Region = { label, device, start, end, remap };

    this._regions.unshift(region);

    console.log(
      `Mapping ${label} from 0x${start.toString(16)} to 0x${(
        start +
        size -
        1
      ).toString(16)}`,
    );

    return () => {
      this._regions = this._regions.filter((r) => r !== region);
    };
  }

  findRegion(address: number): Region {
    const region = this._regions.find(
      (r) => r.start <= address && r.end >= address,
    );

    if (!region) {
      throw new Error(`No region found for address 0x${address.toString(16)}`);
    }

    return region;
  }

  read(address: number): number {
    const region = this.findRegion(address);
    const offset = region.remap ? address - region.start : address;
    try {
      return region.device.read(offset);
    } catch (ex) {
      console.error(
        `Attempted read from address 0x${address.toString(
          16,
        )} of mapped device (final address=0x${offset.toString(16)})`,
      );
      console.log(this);
      debugger;
      return 0;
    }
  }

  read16(address: number): number {
    const region = this.findRegion(address);
    const offset = region.remap ? address - region.start : address;
    try {
      return region.device.read16(offset, true);
    } catch (ex) {
      console.error(
        `Attempted read from address 0x${address.toString(
          16,
        )} of mapped device (final address=0x${offset.toString(16)})`,
      );
      console.log(this);
      debugger;
      return 0;
    }
  }

  write(address: number, value: number): void {
    const region = this.findRegion(address);
    const offset = region.remap ? address - region.start : address;
    try {
      region.device.write(offset, value);
    } catch (ex) {
      console.error(
        `Attempted write to address 0x${address.toString(
          16,
        )} of mapped device (final address=0x${offset.toString(16)})`,
      );
      console.log(this);
      debugger;
    }
  }

  write16(address: number, value: number): void {
    const region = this.findRegion(address);
    const offset = region.remap ? address - region.start : address;
    try {
      region.device.write16(offset, value, true);
    } catch (ex) {
      console.error(
        `Attempted write to address 0x${address.toString(
          16,
        )} of mapped device (final address=0x${offset.toString(16)})`,
      );
      console.log(this);
      debugger;
    }
  }

  load(data: Uint8Array, offset = 0): void {
    const region = this.findRegion(offset);
    const start = region.remap ? offset - region.start : offset;
    region.device.load(data, start);
  }

  reset() {
    this._regions.forEach((r) => r.device.reset());
  }
}
