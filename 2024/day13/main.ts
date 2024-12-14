import { run } from "aocrunner";
import { parse, SEPARATOR } from "@std/path";
import { lcm } from "../util/index.ts";
import { map, sum } from "itertools";

type Pair = [number, number];

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

// Returns an array of objects with equations and prize
// The list of equations is an array of [x, y] pairs
function parseInput(rawInput: string): { equations: [Pair, Pair]; prize: Pair }[] {
  return rawInput.split("\n\n")
    .map((group) => {
      const lines = group.split("\n");
      const prizeLine = lines.pop()!;
      const equationLines = lines.map((line) => line.match(/(\d+)/g)!.map(Number));
      if (!equationLines.every((l) => l.length === 2)) {
        throw new Error("Invalid input");
      }

      const prize = prizeLine.match(/(\d+)/g)!.map(Number) as Pair;

      return {
        equations: equationLines as [Pair, Pair],
        prize,
      };
    });
}

// Solve the system of equations
// return [a, b]
function solve(equations: [Pair, Pair], prize: Pair): Pair {
  const [a1, a2] = equations[0];
  const [b1, b2] = equations[1];
  const [c1, c2] = prize;

  // TIL about Cramer's Rule - https://en.wikipedia.org/wiki/Cramer%27s_rule
  const denominator = a1 * b2 - b1 * a2;
  if (denominator === 0) return [0,0];

  const a = (b2 * c1 - b1 * c2) / denominator;
  if (!Number.isInteger(a)) return [0,0];
  const b = (a1 * c2 - a2 * c1) / denominator;

  if (!Number.isInteger(b)) return [0,0];
  return [a, b];
}

function tokens(pair: Pair): number {
  const [a, b] = pair;
  return 3 * a + b;
}

function part1(rawInput: string) {
  const input = parseInput(rawInput);

  return sum(map(
    input,
    ({ equations, prize }) => tokens(solve(equations, prize))
  ));
}

function part2(rawInput: string) {
  let input = parseInput(rawInput);

  // Add the offset to every prize
  input = input.map(({ equations, prize }) => {
    prize = [10000000000000+prize[0], 10000000000000+prize[1]];
    return { equations, prize };
  });

  return sum(map(
    input,
    ({ equations, prize }) => tokens(solve(equations, prize))
  ));
}

run({
  part1: {
    tests: [
      {
        input: `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`,
        expected: 480,
      },
    ],
    solver: part1,
    solve: true,
  },
  part2: {
    tests: [
      {
        input: `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`,
        expected: 875318608908,
      },
    ],
    solver: part2,
    solve: true,
  },
  input: await getRawInput(),
  day: getDay(),
});
