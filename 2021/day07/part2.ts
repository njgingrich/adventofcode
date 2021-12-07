import * as it from "iter-tools";
import * as path from "path";

import { readInputAsString } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

function parse(lines: string[]): {
  min: number;
  max: number;
  numbers: Map<number, number>;
} {
  let numbers = lines.map(Number);
  let map = new Map<number, number>();

  let min = Math.min(...numbers);
  let max = Math.max(...numbers);

  numbers.forEach((num) => {
    let existing = map.get(num);
    if (existing) {
      map.set(num, existing + 1);
    } else {
      map.set(num, 1);
    }
  });

  return { min, max, numbers: map };
}

function getCostForEndPosition(map: Map<number, number>, pos: number) {
  let cost = 0;

  for (let [num, count] of map.entries()) {
    // Summing 1,2,3... Math.abs(num-pos)
    const dist = Math.abs(num - pos);
    const costForDistance = (dist * (dist + 1)) / 2;
    cost += costForDistance * count;
  }

  return cost;
}

function solve(lines: string[]) {
  const { min, max, numbers } = parse(lines);
  let costs = [];

  for (let i = min; i <= max; i++) {
    costs.push(getCostForEndPosition(numbers, i));
  }

  return Math.min(...costs);
}

export default async function run() {
  const input = await readInputAsString(INPUT_PATH, ",");
  return solve(input);
}
