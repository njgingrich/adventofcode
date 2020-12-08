import * as it from "https://cdn.pika.dev/itertools@1.6.1";

async function readInput(): Promise<string[]> {
  const file = await Deno.readTextFile("./input.txt");
  return file.split("\n").filter(Boolean);
}

type Operation = "acc" | "jmp" | "nop";
const OP_KEYS = ["acc", "jmp", "nop"];

type Instruction = {
  operation: Operation;
  argument: number;
};

function isOp(val: string): val is Operation {
  return OP_KEYS.includes(val);
}

function parse(lines: string[]): Instruction[] {
  return lines.map((line) => {
    const [op, num] = line.split(" ");
    if (!isOp(op)) throw new Error("Unknown operation.");

    return { operation: op, argument: Number(num) };
  });
}

function solve(lines: string[]) {
  const instructions = parse(lines);
  const visited: boolean[] = new Array(instructions.length).fill(false);
  let accumulator = 0;

  let i = 0;
  while (true) {
    const instruction = instructions[i];
    if (visited[i]) {
      break;
    }
    visited[i] = true;

    switch (instruction.operation) {
      case "acc": {
        accumulator += instruction.argument;
        i += 1;
        break;
      }
      case "nop": {
        i += 1;
        break;
      }
      case "jmp": {
        i += instruction.argument;
        break;
      }
    }
  }

  return accumulator;
}

const input = await readInput();
console.log(solve(input));

export {};
