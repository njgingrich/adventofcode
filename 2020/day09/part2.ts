import * as it from "iter-tools";
import * as path from "path";

import { min, max, readInputAsNumbers, sum } from '../util';

function findWeakness(numbers: number[]) {
  return min(numbers) + max(numbers);
}

function solve(lines: number[], invalidNumber: number) {
  let numbers: number[] = [];
  let rearPtr = 1;

  for (let i = 0; i < lines.length; i++) {
    for (let k = rearPtr; k < lines.length; k++) {
      numbers = lines.slice(i, rearPtr);
      // console.log(`Looking at range [${i}, ${rearPtr}] = ${numbers}`);
      const s = sum(numbers);

      // Move front pointer
      if (s > invalidNumber) {
        break;
      } // Move rear pointer
      else if (s < invalidNumber) {
        rearPtr += 1;
      } else if (s === invalidNumber) {
        return findWeakness(numbers);
      }
    }
  }
}


export default async function run() {
  const input = await readInputAsNumbers(path.join(__dirname, './input.txt'));
  return solve(input, 400480901);
}
