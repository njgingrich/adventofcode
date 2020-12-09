import * as it from "iter-tools";
import * as path from "path";

import { readInputAsStrings } from "../util";

type Operation = "acc" | "jmp" | "nop";
const OP_KEYS = ["acc", "jmp", "nop"];

type Instruction = {
  operation: Operation;
  argument: number;
};

type RunResult = {
  accumulator: number;
  cleanExit: boolean;
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

function runProgram(instructions: Instruction[]): RunResult {
  const visited: boolean[] = new Array(instructions.length).fill(false);
  let accumulator = 0;
  let cleanExit = false;

  let i = 0;
  while (true) {
    if (i === instructions.length) {
      // console.log("End of program.");
      cleanExit = true;
      break;
    }
    if (visited[i]) {
      // console.log('Found repeating instruction at index:', i);
      break;
    }

    const instruction = instructions[i];
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
  return { accumulator, cleanExit };
}

function solve(lines: string[]) {
  const _instructions = parse(lines);
  let instructions = JSON.parse(JSON.stringify(_instructions));

  for (let i = 0; i < instructions.length; i++) {
    if (instructions[i].operation === "nop") {
      //   console.log('Swapping NOP for JMP at index', i);
      instructions[i].operation = "jmp";
    } else if (instructions[i].operation === "jmp") {
      //   console.log('Swapping JMP for NOP at index', i);
      instructions[i].operation = "nop";
    }

    const { accumulator, cleanExit } = runProgram(instructions);
    if (cleanExit) {
      return accumulator;
    }
    instructions = JSON.parse(JSON.stringify(_instructions));
  }

  return -1;
}

export default async function run() {
  const input = await readInputAsStrings(path.join(__dirname, "./input.txt"));
  return solve(input);
}
