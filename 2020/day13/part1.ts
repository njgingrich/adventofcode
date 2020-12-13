import { time } from "console";
import * as it from "iter-tools";
import * as path from "path";

import { readInputAsStrings } from "../util";

function solve(lines: string[]) {
  const timestamp = Number(lines[0]);
  const busIds = lines[1].split(',').map(Number).filter(Boolean);

  let found: number | undefined = undefined;
  let t = timestamp;
  while (found == null) {
    for (let id of busIds) {
      if ((t / id) % 1 === 0) {
        found = id;
        break;
      }
    };

    t++;
  }

  return (t - 1 - timestamp) * found;
}

export default async function run() {
  const input = await readInputAsStrings(path.join(__dirname, "./input.txt"));
  return solve(input);
}
