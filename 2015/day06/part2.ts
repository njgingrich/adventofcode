import * as it from "iter-tools";
import * as path from "path";

import { readInputAsStrings } from "../util";

const lights: number[][] = new Array(1000).fill(false).map(() =>
  new Array<number>(1000).fill(0)
);
const regex = new RegExp(/[a-z\s]+(\d+),(\d+)\s[a-z\s]+(\d+),(\d+)/);

function solve(lines: string[]) {
  lines.forEach((line) => {
    const match = line.match(regex);
    if (!match) return false;

    const coord1 = [Number(match[1]), Number(match[2])];
    const coord2 = [Number(match[3]), Number(match[4])];

    const instruction = line.substring(0, 7);
    for (let r = coord1[0]; r <= coord2[0]; r++) {
      for (let c = coord1[1]; c <= coord2[1]; c++) {
        if (instruction === "turn on") {
          lights[r][c] += 1;
        } else if (instruction === "turn of") {
          lights[r][c] = Math.max(lights[r][c] - 1, 0);
        } else if (instruction === "toggle ") {
          lights[r][c] += 2;
        }
      }
    }
  });

  const sum = lights.reduce((sum, row) => {
    return sum + row.reduce((sum, light) => sum + Number(light), 0);
  }, 0);
  return sum;
}

export default async function run() {
  const input = await readInputAsStrings(path.join(__dirname, "./input.txt"));
  return solve(input);
}
