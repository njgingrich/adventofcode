import { run } from "aocrunner";
import { parse, SEPARATOR } from "@std/path";
import { sum } from "itertools";

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

function countStone(map: Map<number, number>, stone: number, num: number) {
  // console.log(`Counting ${num} of stone ${stone}`);
  return map.set(stone, (map.get(stone) ?? 0) + num);
}

function parseInput(rawInput: string): Map<number, number> {
  const stones = rawInput.split(" ").map(Number);
  const map = new Map<number, number>();
  for (const stone of stones) {
    countStone(map, stone, 1)
  }

  return map;
}

function blink(stones: Map<number, number>) {
  const after = new Map<number, number>();

  for (const [stone, count] of stones) {
    // If the stone is engraved with the number 0, it is replaced by a stone engraved with the number 1.
    if (stone === 0) {
      countStone(after, 1, count)
      continue;
    }

    // If the stone is engraved with a number that has an even number of digits, it is replaced by two stones.
    const stoneStr = String(stone);
    if (stoneStr.length % 2 === 0) {
      const half = stoneStr.length / 2;
      const left = Number(stoneStr.slice(0, half));
      const right = Number(stoneStr.slice(half));
      countStone(after, left, count);
      countStone(after, right, count);
      continue;
    }

    // If none of the other rules apply, the stone is replaced by a new stone; the old stone's number multiplied by 2024 is engraved on the new stone.
    countStone(after, stone * 2024, count);
  }

  return after;
}

function doBlinks(map: Map<number, number>, count: number) {
  for (let i = 0; i < count; i++) {
    map = blink(map);
    // console.log(`${sum(input.values())} stones after ${i + 1} blinks`);
  }

  return map;
}

function part1(rawInput: string) {
  let input = parseInput(rawInput);
  return sum(doBlinks(input, 25).values());
}

function part2(rawInput: string) {
  let input = parseInput(rawInput);
  return sum(doBlinks(input, 75).values());
}

run({
  part1: {
    tests: [
      // {
      //   input: "0 1 10 99 999",
      //   expected: 7, // after 1 blink
      // },
      { 
        input: "125 17",
        expected: 55312, // after 25
      },
    ],
    solver: part1,
    solve: true,
  },
  part2: {
    tests: [],
    solver: part2,
    solve: true,
  },
  input: await getRawInput(),
  day: await getDay(),
});
