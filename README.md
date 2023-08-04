# Riku

Riku is an 8-bit console inspired by the Game Boy. It uses a simple CPU with 8-bit and 16-bit registers, and a memory map for various parts of the system. The console also includes a VBlank interrupt for synchronization between the CPU and GPU.

## CPU

The CPU includes the following registers:

- 8-bit general purpose registers (RX | RY)
- 8-bit accumulator register (A)
- 8-bit flag register (FR)
- 8-bit instruction register (IR)
- 16-bit program counter (PC)
- 16-bit stack pointer (SP)
- 16-bit frame pointer (FP)
- 16-bit interrupt enable register (IE)
- 16-bit interrupt flag register (IF)

### Registers

#### R0
A read-only register which always returns 0
#### RX, RY
General purpose registers
#### A
Accumulator register
#### FR
Flag register. Each bit is a specific flag.
- C = Carry
- Z = Zero
- Unused
- D = Decimal mode
- Unused
- Unused
- O = Overflow
- N = Negative
#### IR
Instruction register (for debugging)
#### PC
Program counter
#### SP
Stack pointer
#### FP
Frame pointer for subroutines
#### IE
Interrupt enable. If set, a interrupt is handled atm.
#### IF
Interrupt flag. Each bit correspond to a specific interrupt being requested
- V_BLANK (Screen draw interrupt)

## Memory Map

The memory map of the console is as follows:

| Address Range       | Description                           | Size                 |
|---------------------|---------------------------------------|----------------------|
| 0x0000 - 0x00FF     | Zero Page                             | 256 bytes (0.25 KB)  |
| 0x0100 - 0x01FF     | Stack                                 | 256 bytes (0.25 KB)  |
| 0x0200 - 0x02FF     | I/O Registers                         | 256 bytes (0.25 KB)  |              
| 0x0300 - 0x42FF     | ROM bank 0                            | 16384 bytes (16 KB)  |
| 0x4300 - 0x62FF     | Switchable ROM bank (if needed)       | 8192 bytes (8 KB)    |
| 0x6300 - 0x66FF     | Cartridge save data                   | 1024 bytes (1 KB)    |          
| 0x6700 - 0xC6FF     | Internal RAM                          | 24576 bytes (24 KB)  |
| 0xC&00 - 0xCAFF     | VRAM                                  | 1024 bytes (1 KB)    |  
| 0xCB00 - 0xCCFF     | Sprite attribute table                | 512 bytes (0.5 KB)   |                
| 0xCD00 - 0xDCFF     | SID Registers                         | 4096 bytes (4 KB)    |         
| 0xDD00 - 0xDFFF     | Unused                                | 768 bytes (0.75 KB)  |         
| 0xE000 - 0xFFFF     | Kernel ROM                            | 8192 bytes (8 KB)    |      

## GPU

The GPU uses the HTML canvas for rendering, and communicates with the CPU via a VBlank interrupt. This interrupt is triggered at the start of each vertical blanking interval, allowing the CPU to update video memory without causing visual artifacts.

### Palette

4 shades of grey. Implementing palettes in a possibility
- Lightest Shade: #9BBC0F
- Light Shade: #8BAC0F
- Dark Shade: #306230
- Darkest Shade: #0F380F

## Instructions


| Opcode | Instruction       | Description                            | Operand Size |
|--------|-------------------|----------------------------------------|--------------|
| 0x00   | NOP               | No operation                           | None         |
| 0x10   | MOV RX, RY        | Move value from RY to RX               | 16-bit        |
| 0x12   | LDA imm           | Load 8-bit immediate value to A       | 8-bit        |
| 0x13   | LDA zero_page     | Load 8-bit from zero page address to A       | 16-bit        |
| 0x14   | LDA zero_page, X  | Load 8-bit from zero page address + offset from X to A       | 16-bit        |
| 0x15   | LDA absolute      | Load 8-bit value from memory address to A    | 24-bit       |
| 0x16   | LDA absolute, X   | Load 8-bit value from memory address + offset from X to A     | 24-bit       |
| 0x17   | LDA absolute, Y   | Load 8-bit value from memory address + offset from Y to A     | 24-bit       |
| 0x11   | LDR RX, imm       | Load 8-bit immediate value to RX       | 8-bit        |
| 0x12   | LDR RX, addr      | Load 8-bit value from memory to RX     | 16-bit       |
| 0x13   | STR RX, addr      | Store 8-bit value in RX into memory    | 16-bit       |
| 0x20   | ADD RX, RY        | Add RY to RX, store in A               | 8-bit        |
| 0x21   | ADD RX, imm       | Add immediate value to RX, store in A  | 8-bit        |
| 0x22   | SUB RX, RY        | Subtract RY from RX, store in A        | 8-bit        |
| 0x23   | SUB RX, imm       | Subtract immediate value from RX, store in A | 8-bit     |
| 0x24   | MUL RX, RY        | Multiply RX with RY, store in A        | 8-bit        |
| 0x25   | DIV RX, RY        | Divide RX by RY, store in A            | 8-bit        |
| 0x26   | INC RX            | Increment value in RX                  | 8-bit        |
| 0x27   | DEC RX            | Decrement value in RX                  | 8-bit        |
| 0x30   | AND RX, RY        | Bitwise AND between RX and RY, store in A | 8-bit        |
| 0x31   | AND RX, imm       | Bitwise AND between RX and immediate value, store in A | 8-bit   |
| 0x32   | OR RX, RY         | Bitwise OR between RX and RY, store in A | 8-bit        |
| 0x33   | OR RX, imm        | Bitwise OR between RX and immediate value, store in A | 8-bit    |
| 0x34   | XOR RX, RY        | Bitwise XOR between RX and RY, store in A | 8-bit        |
| 0x35   | XOR RX, imm       | Bitwise XOR between RX and immediate value, store in A | 8-bit   |
| 0x40   | JMP addr          | Jump to a memory address                | 16-bit       |
| 0x41   | JZ addr           | Jump to a memory address if zero flag is set | 16-bit   |
| 0x42   | JNZ addr          | Jump to a memory address if zero flag is not set | 16-bit   |
| 0x43   | JC addr           | Jump to a memory address if carry flag is set | 16-bit   |
| 0x44   | JNC addr          | Jump to a memory address if carry flag is not set | 16-bit   |
| 0x45   | CALL addr         | Call a subroutine at a memory address   | 16-bit       |
| 0x46   | RET               | Return from a subroutine                | None         |
| 0x47   | PUSH RX           | Push RX onto the stack                  | 8-bit        |
| 0x48   | PUSH imm          | Push immediate value onto the stack     | 8-bit        |
| 0x49   | POP RX            | Pop a value from the stack into RX      | 8-bit        |
| 0x50   | JEQ RX, RY        | Jump if RX === RY                      | 8-bit, 8-bit |
| 0x51   | JEQ RX, imm       | Jump if RX === immediate value         | 8-bit, 8-bit |
| 0x52   | JNE RX, RY        | Jump if RX !== RY                      | 8-bit, 8-bit |
| 0x53   | JNE RX, imm       | Jump if RX !== immediate value         | 8-bit, 8-bit |
| 0x54   | JLT RX, RY        | Jump if RX < RY                        | 8-bit, 8-bit |
| 0x55   | JLT RX, imm       | Jump if RX < immediate value           | 8-bit, 8-bit |
| 0x56   | JGT RX, RY        | Jump if RX > RY                        | 8-bit, 8-bit |
| 0x57   | JGT RX, imm       | Jump if RX > immediate value           | 8-bit, 8-bit |
| 0x58   | JLE RX, RY        | Jump if RX <= RY                       | 8-bit, 8-bit |
| 0x59   | JLE RX, imm       | Jump if RX <= immediate value          | 8-bit, 8-bit |
| 0x5A   | JGE RX, RY        | Jump if RX >= RY                       | 8-bit, 8-bit |
| 0x5B   | JGE RX, imm       | Jump if RX >= immediate value          | 8-bit, 8-bit |
| 0xC0   | DEFINE_TILE addr  | Define a new tile                      | 16-bit       |
| 0xC1   | DEFINE_SPRITE addr| Define a new sprite                    | 16-bit       |
| 0xFB   | INT               | Trigger software interrupt             | 8-bit        |
| 0xFC   | RTI               | Return from interrupt                  | None         |
| 0xFD   | EI                | Enable interrupts                      | None         |
| 0xFE   | DI                | Disable interrupts                     | None         |
| 0xFF   | HALT              | Halt the CPU and stop execution        | None         |






