import { run } from "aocrunner";
import { parse, SEPARATOR } from "@std/path";

function getRawInput(): Promise<string> {
  return Deno.readTextFile("input.txt");
}

function getDay(): number {
  // TODO: extract to util function we import
  const module = import.meta.url;
  const parsed = parse(module);
  const dayString = parsed.dir.split(SEPARATOR).pop() ?? "";
  return Number(dayString.slice(-2));
}

function parseInput(rawInput: string): {registers: number[], program: number[]} {
  const [registers, programLine] = rawInput.split("\n\n");
  const registerLines = registers.split("\n").filter(Boolean);
  const program = programLine.replace("Program: ", "").replace(/\n/g, "");

  return {
    registers: registerLines.map(line => Number(line.match(/Register ([A-Z]): (\d+)/)![2])),
    program: program.split(",").map(Number),
  }
}

type Registers = Record<'A' | 'B' | 'C', number>;

class Computer {
  registers: Registers;
  program: number[];
  pointer: number = 0;
  output: number[] = [];

  constructor({registers, program}: {registers: number[], program: number[]}) {
    this.registers = {
      A: registers[0],
      B: registers[1],
      C: registers[2],
    }

    this.program = program;
  }

  run() {
    while (this.pointer < this.program.length) {
      this.instruction();
    }
  }

  print() {
    return this.output.join(",");
  }

  comboOperand(operand: number) {
    switch (operand) {
      case 1:
      case 2:
      case 3:
        return operand;
      case 4: return this.registers.A;
      case 5: return this.registers.B;
      case 6: return this.registers.C;
      case 7: throw new Error("Unexpected operand (7)");
      default: return operand;
    }
  }

  instruction() {
    const opcode = this.program[this.pointer];
    const operand = this.program[this.pointer+1];
    // console.log(`Running instruction ${opcode} with operand ${operand}, pointer=${this.pointer}`);

    switch (opcode) {
      case 0:
        this.adv(operand);
        this.pointer += 2;
        break;
      case 1:
        this.bxl(operand);
        this.pointer += 2;
        break;
      case 2:
        this.bst(operand);
        this.pointer += 2;
        break;
      case 3:
        const jumped = this.jnz(operand);
        if (!jumped) {
          this.pointer += 2;
        }
        break
      case 4:
        this.bxc(operand);
        this.pointer += 2;
        break;
      case 5:
        this.out(operand);
        this.pointer += 2;
        break;
      case 6:
        this.bdv(operand);
        this.pointer += 2;
        break;
      case 7:
        this.cdv(operand);
        this.pointer += 2;
        break;
    }
  }

  adv(operand: number) {
    const numerator = this.registers.A;
    const denominator = Math.pow(2, this.comboOperand(operand));
    const result = Math.floor(numerator / denominator);
    this.registers.A = result;
  }

  bxl(operand: number) {
    const result = this.registers.B ^ operand;
    this.registers.B = result;
  }

  bst(operand: number) {
    const result = this.comboOperand(operand) % 8;
    this.registers.B = result;
  }

  jnz(operand: number) {
    if (this.registers.A === 0) return false;

    this.pointer = operand;
    return true;
  }

  bxc(operand: number) {
    const result = this.registers.B ^ this.registers.C;
    this.registers.B = result;
  }

  out(operand: number) {
    const result = this.comboOperand(operand) % 8;
    this.output.push(result);
  }

  bdv(operand: number) {
    const numerator = this.registers.A;
    const denominator = Math.pow(2, this.comboOperand(operand));
    const result = Math.floor(numerator / denominator);
    this.registers.B = result;
  }

  cdv(operand: number) {
    const numerator = this.registers.A;
    const denominator = Math.pow(2, this.comboOperand(operand));
    const result = Math.floor(numerator / denominator);
    this.registers.C = result;
  }
}

function part1(rawInput: string) {
  const input = parseInput(rawInput);
  const computer = new Computer(input);
  computer.run();

  return computer.print();
}

function part2(rawInput: string) {
  const input = parseInput(rawInput);

  const expected = input.program.join(',');
  let output = '';
  let A = 0;

  while (output !== expected && A < 10) {
    const newInput = Object.assign({}, input, {registers: [A, input.registers[1], input.registers[2]]});
    const computer = new Computer(newInput);
    computer.run();
    output = computer.print();
    console.log(`${output} --- A=${computer.registers.A}, B=${computer.registers.B}, C=${computer.registers.C}`);
    A++;
  }

  return A-1;
}

run({
  part1: {
    tests: [
      {
        input: `Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0
`,
        expected: "4,6,3,5,6,3,5,2,1,0",
      },
    ],
    solver: part1,
    solve: true,
  },
  part2: {
    tests: [
      {
        input: `Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0
`,
        expected: 117440,
      },
    ],
    solver: part2,
    solve: true,
  },
  input: await getRawInput(),
  day: await getDay(),
});
