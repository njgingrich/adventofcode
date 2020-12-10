import * as it from "iter-tools";
import * as path from "path";

import { max, readInputAsNumbers } from "../util";

function differences(arr: number[]) {
  let diff1s = 0;
  let diff3s = 0;

  for (let i = 1; i < arr.length; i++) {
    const prev = arr[i - 1];
    const item = arr[i];

    if (item - prev === 1) diff1s++;
    else if (item - prev === 3) diff3s++;
    else throw new Error('Unknown difference');
  }

  // console.log(arr);
  // console.log('Diff 1s:', diff1s);
  // console.log('Diff 3s:', diff3s);
  return diff1s * diff3s;
}

function solve(adapters: number[]) {
  const joltages = adapters.sort((a, b) => a - b);
  const builtIn = joltages[joltages.length - 1] + 3;
  joltages.unshift(0);
  joltages.push(builtIn);

  return differences(joltages);
}

export default async function run() {
  const input = await readInputAsNumbers(path.join(__dirname, "./input.txt"));
  return solve(input);
}
