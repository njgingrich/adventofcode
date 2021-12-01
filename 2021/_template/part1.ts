import * as it from "iter-tools";
import * as path from "path";

import { readInputAsNumbers } from "../util";

function solve(lines: number[]) {
  return lines;
}

export default async function run() {
  const input = await readInputAsNumbers(path.join(__dirname, "./input.txt"));
  return solve(input);
}
