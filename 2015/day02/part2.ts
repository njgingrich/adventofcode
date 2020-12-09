import * as it from "iter-tools";
import * as path from "path";

import { readInputAsStrings, sum } from "../util";

function requiredRibbon(l: number, w: number, h: number): number {
  const forBow = l * w * h;
  const nums = [l, w, h].sort((a, b) => a - b);
  const forSides = 2 * (nums[0] + nums[1]);

  return forBow + forSides;
}

function solve(lines: string[]) {
  return sum(
    lines.map((line) => {
      const [l, w, h] = line.split("x").map((n) => Number(n));
      return requiredRibbon(l, w, h);
    })
  );
}

export default async function run() {
  const input = await readInputAsStrings(path.join(__dirname, "./input.txt"));
  return solve(input);
}
