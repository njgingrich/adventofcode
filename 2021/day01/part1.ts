import * as path from "path";

import { readInputAsNumbers } from "../util";

function countIncreases(numbers: number[]): number {
  return numbers.reduce((increases, curr, ix, arr) => {
    if (ix === 0) {
      return 0;
    }
    if (curr > arr[ix-1]) {
      increases += 1;
    }
    return increases;
  }, 0);
}

function solve(numbers: number[]): number {
    return countIncreases(numbers);
}

export default async function run() {
  const input = await readInputAsNumbers(path.join(__dirname, "./input.txt"));
  return solve(input);
}
