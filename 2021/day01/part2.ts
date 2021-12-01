import * as path from "path";

import { readInputAsNumbers } from "../util";

function countIncreases(numbers: number[]): number {
  return numbers.reduce((increases, curr, ix, arr) => {
    if (ix === 0) {
      return 0;
    }
    if (curr > arr[ix - 1]) {
      increases += 1;
    }
    return increases;
  }, 0);
}

function getWindows(numbers: number[]): number[] {
  let windows = [];
  for (let i = 1; i < numbers.length - 1; i++) {
    const sum = numbers[i - 1] + numbers[i] + numbers[i + 1];
    windows.push(sum);
  }
  return windows;
}

function solve(numbers: number[]): number {
  const windows = getWindows(numbers);
  return countIncreases(windows);
}

export default async function run() {
  const input = await readInputAsNumbers(path.join(__dirname, "./input.txt"));
  return solve(input);
}
