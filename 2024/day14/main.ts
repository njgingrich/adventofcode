import { run } from "aocrunner";
import { parse, SEPARATOR } from "@std/path";
import { mod } from "../util/index.ts";

type Pair = [number, number];
type Input = { pos: Pair; v: Pair }[];
type Bounds = [number, number, number, number];

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

function parseInput(rawInput: string): Input {
  return rawInput.split("\n").filter(Boolean).map((line) => {
    const [x, y, vx, vy] = line.match(/p=(-?\d+),(-?\d+)\sv=(-?\d+),(-?\d+)/)!.slice(1).map(Number);
    return {
      pos: [x, y] as Pair,
      v: [vx, vy] as Pair,
    };
  });
}

function move(
  input: Input,
  xBound: number,
  yBound: number,
  times: number,
): Input {
  return input.map(({ pos, v }) => ({
      pos: [mod(pos[0] + (v[0] * times), xBound), mod(pos[1] + (v[1] * times), yBound)] as Pair,
      v,
  }));
}

function inRegion(pos: Pair, region: Bounds): boolean {
  const [x1, y1, x2, y2] = region;
  return pos[0] >= x1 && pos[0] <= x2 && pos[1] >= y1 && pos[1] <= y2;
}

function countQuadrants(input: Input, xBound: number, yBound: number): number {
  const quadrants = [0, 0, 0, 0];

  const midX = Math.floor(xBound / 2);
  const midY = Math.floor(yBound / 2);

  const q1 = [midX + 1, 0,        xBound - 1, midY - 1] as Bounds;
  const q2 = [0,        0,        midX - 1,   midY - 1] as Bounds;
  const q3 = [0,        midY + 1, midX - 1,   yBound - 1] as Bounds;
  const q4 = [midX + 1, midY + 1, xBound - 1, yBound - 1] as Bounds;

  for (const { pos } of input) {
    // console.log(`---- [${pos}]`)
    if (inRegion(pos, q1)) {
      // console.log(`${pos} in Q1: ${q1}`)
      quadrants[0]++;
    } else if (inRegion(pos, q2)) {
      // console.log(`${pos} in Q2: ${q2}`)
      quadrants[1]++;
    } else if (inRegion(pos, q3)) {
      // console.log(`${pos} in Q3: ${q3}`)
      quadrants[2]++;
    } else if (inRegion(pos, q4)) {
      // console.log(`${pos} in Q4: ${q4}`)
      quadrants[3]++;
    } else {
      // console.log(`${pos} not found for region`)
    }
  }

  return quadrants.reduce((acc, v) => acc * v, 1);
}

function part1(rawInput: string) {
  const input = parseInput(rawInput);
  const times = 100;
  const WIDTH = 101; // 11 for test
  const HEIGHT = 103; // 7 for test

  const moved = move(input, WIDTH, HEIGHT, times);
  return countQuadrants(moved, WIDTH, HEIGHT);
}

function part2(rawInput: string) {
  const input = parseInput(rawInput);
  const WIDTH = 101; // 11 for test
  const HEIGHT = 103; // 7 for test

  let seconds = 0;
  let moved = input;
  let overlapping = new Set(moved.map(({ pos }) => pos.join(",")));

  // We're assuming a christmas tree shape requires all robots on their own spot
  // don't love this but IDK what a christmas tree looks like exactly
  while (overlapping.size !== moved.length) {
    moved = move(moved, WIDTH, HEIGHT, 1);
    overlapping = new Set(moved.map(({ pos }) => pos.join(",")));
    seconds++;
  }

  return seconds;
}

run({
  part1: {
    tests: [
      {
        input: `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`,
        expected: 12,
      },
    ],
    solver: part1,
    solve: true,
  },
  part2: {
    solver: part2,
    solve: true,
  },
  input: await getRawInput(),
  day: getDay(),
});
