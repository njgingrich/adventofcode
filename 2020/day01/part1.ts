import * as it from "iter-tools";
import * as path from "path";

import { readInputAsNumbers } from "../util";

function solve(numbers: number[]): number {
    for (let i = 0; i < numbers.length; i++) {
        for (let j = i; j < numbers.length; j++) {
            if (numbers[i] + numbers[j] === 2020) {
                // console.log(`${numbers[i]} and ${numbers[j]}`)
                return numbers[i] * numbers[j];
            }
        }
    }
    return -1;
}

export default async function run() {
  const input = await readInputAsNumbers(path.join(__dirname, "./input.txt"));
  return solve(input);
}
