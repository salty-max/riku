# Riku

Riku is an 8-bit console inspired by the Game Boy. It uses a simple CPU with 8-bit and 16-bit registers, and a memory map for various parts of the system. The console also includes a VBlank interrupt for synchronization between the CPU and GPU.

## CPU

The CPU includes the following registers:

- 8-bit general purpose registers (R0-R7)
- 8-bit flag register (FR)
- 16-bit program counter (PC)
- 16-bit stack pointer (SP)
- 16-bit frame pointer (FP)
- 16-bit memory address register (MAR)
- 16-bit memory data register (MDR)
- 16-bit VBlank interrupt enable register (IE_VBLANK)
- 16-bit general interrupt enable register (IE)

## Memory Map

The memory map of the console is as follows:

| Range     | Description                           | Size                 |
|-----------|---------------------------------------|----------------------|
| 0x0000 - 0x00FF | Boot ROM                            | 256 bytes (0.25 KB) |
| 0x0100 - 0x3FFF | ROM bank 0                          | 16384 bytes (16 KB) |
| 0x4000 - 0x7FFF | Switchable ROM bank (if needed)     | 16384 bytes (16 KB) |
| 0x8000 - 0x9FFF | Video RAM                           | 8192 bytes (8 KB)   |
| 0xA000 - 0xA3FF | Cartridge save data                 | 1024 bytes (1 KB)   |
| 0xA400 - 0xDFFF | Internal RAM                        | 14080 bytes (13.75 KB) |
| 0xFE00 - 0xFE9F | Sprite attribute table              | 160 bytes           |
| 0xFF00 - 0xFF7F | Memory-mapped I/O                   | 128 bytes           |
| 0xFFFE          | VBlank Interrupt Enable register    | 1 byte              |
| 0xFFFF          | General Interrupt Enable register   | 1 byte              |

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
| 0x10   | MOV RX, RY        | Move value from RY to RX               | 8-bit        |
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






