export enum Register {
  R0 = 0,
  RX = 1,
  RY = 2,
  A = 3,
  FR = 4,
  IR = 5,
  PC = 6,
  SP = 7,
  FP = 8,
  IE = 9,
  IF = 10,
}

export type RegisterMap = Record<Register, Register8 | Register16>;

export class Register8 {
  private _value;

  constructor(v = 0) {
    this._value = v & 0xff;
  }

  get value(): number {
    return this._value;
  }

  set value(v: number) {
    this._value = v & 0xff;
  }
}

export class Register16 {
  private _value;

  constructor(v = 0) {
    this._value = v & 0xffff;
  }

  get value(): number {
    return this._value;
  }

  set value(v: number) {
    this._value = v & 0xffff;
  }
}

export const createRegisters = (): RegisterMap => ({
  [Register.R0]: new Register8(0),
  [Register.RX]: new Register8(0),
  [Register.RY]: new Register8(0),
  [Register.A]: new Register8(0),
  [Register.FR]: new Register8(0),
  [Register.IR]: new Register8(0),
  [Register.PC]: new Register16(0),
  [Register.SP]: new Register16(0),
  [Register.FP]: new Register16(0),
  [Register.IE]: new Register8(0),
  [Register.IF]: new Register8(0),
});
