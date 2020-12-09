import * as it from "iter-tools";
import * as path from "path";

import { readInputAsNumbers } from "../util";

function solve(numbers: number[]): number {
  // yes this is ridiculous
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i; j < numbers.length; j++) {
      for (let k = j; k < numbers.length; k++) {
        if (numbers[i] + numbers[j] + numbers[k] === 2020) {
          return numbers[i] * numbers[j] * numbers[k];
        }
      }
    }
  }
  return -1;
}

export default async function run() {
  const input = await readInputAsNumbers(path.join(__dirname, "./input.txt"));
  return solve(input);
}
