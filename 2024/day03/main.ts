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

const mulRegex = /mul\((\d+),(\d+)\)/g;
const bigRegex = /(?<mul>mul\((\d+),(\d+)\))|(?<do>do\(\))|(?<dont>don't\(\))/g;

function parseInput(rawInput: string): string {
  return rawInput;
}

// turn mul(a,b) into a*b
function instructionToMul(instruction: string): number {
  const [a, b] = instruction.slice(4).replace(/[\(\)]/g, "").split(",").map(
    Number,
  );
  return a * b;
}

function part1(rawInput: string) {
  const input = parseInput(rawInput);
  const matches = input.match(mulRegex);
  if (matches === null) {
    return "0";
  }

  const matchVals = matches.map(instructionToMul);
  return matchVals.reduce((acc, val) => acc + val, 0).toString();
}

function part2(rawInput: string) {
  const input = parseInput(rawInput);

  let mulEnabled = true;
  let sum = 0;

  const matches = input.matchAll(bigRegex);
  for (const match of matches) {
    if (match.groups?.mul) {
      if (mulEnabled) {
        sum += instructionToMul(match.groups.mul);
      }
    } else if (match.groups?.do) {
      mulEnabled = true;
    } else if (match.groups?.dont) {
      mulEnabled = false;
    }
  }

  return sum.toString();
}

run({
  part1: {
    tests: [
      {
        input: "mul(4*, mul(6,9!, ?(12,34)",
        expected: "0",
      },
      {
        input: "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))",
        expected: "161",
      },
    ],
    solver: part1,
    solve: true,
  },
  part2: {
    tests: [
      {
        input: "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))",
        expected: "48",
      },
    ],
    solver: part2,
    solve: true,
  },
  input: await getRawInput(),
  day: getDay(),
});
