import * as it from "iter-tools";
import * as path from "path";

import { readInput } from "../util";

function solve(input: string, size: number) {
  const starting = input.split(",").map(Number);

  const turns = new Array(size + 1).fill(-1);
  const indexes = new Map<number, number>();
  const spoken = new Set<number>();

  for (let turn = 1; turn <= size; turn++) {
    // console.log(`Turn ${turn}: (Last = ${turns[turn-1]}) ------------`)
    const lastNumber = turns[turn - 1];
    if (turn <= starting.length) {
      turns[turn] = starting[turn - 1];
      // console.log(`Use starting number: ${starting[turn-1]}.`)
    } else {
      if (spoken.has(lastNumber)) {
        const lastIndex = indexes.get(lastNumber);
        if (lastIndex === undefined) throw new Error();
        const diff = turn - lastIndex - 2;
        // console.log(`Difference between the numbers: ${diff}`);
        turns[turn] = diff;
      } else {
        turns[turn] = 0;
        // console.log(`Last number was new, speaking 0.`);
      }
    }

    if (turn === 1) continue; // dont add the -1
    indexes.set(lastNumber, turn - 2);
    spoken.add(lastNumber);
  }

  return turns[size];
}

export default async function run() {
  const input = await readInput(path.join(__dirname, "./input.txt"));
  return solve(input, 30000000);
}
