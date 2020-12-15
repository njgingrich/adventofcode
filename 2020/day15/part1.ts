import * as it from "iter-tools";
import * as path from "path";

import { readInput } from "../util";

function lastIndexOf(numbers: number[], goal: number, startIx: number) {
  for (let i = startIx; i >= 0; i--) {
    if (numbers[i] === goal) return i;
  }

  throw new Error();
}

function solve(input: string) {
  const starting = input.split(',').map(Number);

  const turns = new Array(2021).fill(-1);
  const spoken = new Set<number>();

  for (let turn = 1; turn <= 2020; turn++) {
    // console.log(`Turn ${turn}: (Last = ${turns[turn-1]}) ------------`)
    const lastNumber = turns[turn-1];
    if (turn <= starting.length) {
      turns[turn] = starting[turn-1];
      // console.log(`Use starting number: ${starting[turn-1]}.`)
    } else {
      if (spoken.has(lastNumber)) {
        const diff = (turn - 1) - lastIndexOf(turns, lastNumber, turn - 2);
        // console.log(`Difference between the numbers: ${diff}`);
        turns[turn] = diff;
      } else {
        turns[turn] = 0;
        // console.log(`Last number was new, speaking 0.`);
      }
    }

    if (turn === 1) continue; // dont add the -1
    spoken.add(lastNumber);
  }

  return turns[2020];
}

export default async function run() {
  const input = await readInput(path.join(__dirname, "./input.txt"));
  return solve(input);
}
