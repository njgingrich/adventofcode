import * as it from "iter-tools";
import * as path from "path";

import { readInput } from "../util";

function solve(line: string) {
  const characters = line.split("");
  let floor = 0;
  characters.forEach((ch) => {
    if (ch === "(") floor += 1;
    if (ch === ")") floor -= 1;
  });

  return floor;
}

export default async function run() {
  const input = await readInput(path.join(__dirname, "./input.txt"));
  return solve(input);
}
