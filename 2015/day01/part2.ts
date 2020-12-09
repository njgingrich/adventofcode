import * as it from "iter-tools";
import * as path from "path";

import { readInput } from "../util";

function solve(line: string) {
  const characters = line.split("");
  let floor = 0;

  for (let i = 0; i < characters.length; i++) {
      const ch = characters[i];
      if (ch === "(") floor += 1;
      if (ch === ")") floor -= 1;
  
      if (floor === -1) return (i + 1); // 1-based
  }
}

export default async function run() {
  const input = await readInput(path.join(__dirname, "./input.txt"));
  return solve(input);
}
