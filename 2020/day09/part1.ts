import * as it from 'iter-tools';
import * as path from 'path';

import { readInputAsNumbers } from "../util";

function solve(lines: number[], preambleSize: number) {
  const numbers = lines.slice(0, preambleSize);
  const map = it.map(
    (zip: number[]) => zip[0] + zip[1],
    it.permutations(numbers, 2),
  );

  let sums: number[] = [...map];

  for (let i = preambleSize; i < lines.length; i++) {
    const current = lines[i];
    // console.log(numbers);
    // console.log(sums);

    // check for fail
    if (!sums.includes(current)) return current;

    // sums is chunked into (n-1) size lists of sums
    // pop off the first (n-1) then push the next onto it
    sums = sums.slice((preambleSize - 1));

    numbers.shift();
    const nextSums = it.map((num: number) => num + current, numbers);
    numbers.push(current);

    sums.push(...nextSums);
  }
}

export default async function run() {
  const input = await readInputAsNumbers(path.join(__dirname, "./input.txt"));
  return solve(input, 25);
}
