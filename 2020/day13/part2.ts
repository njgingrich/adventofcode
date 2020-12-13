import { time } from "console";
import * as it from "iter-tools";
import * as path from "path";

import { max, readInputAsStrings } from "../util";

type Bus = { n: number, ix: number }

function getBuses(numbers: (number | 'x')[]): Bus[] {
  let buses: Bus[] = [];
  numbers.forEach((n, ix) => {
    if (typeof n === 'string') return;
    buses.push({ n, ix })
  });
  return buses;
}

function solve(lines: string[]) {
  const busIds = lines[1].split(",").map((id) => {
    if (id === 'x') return id;
    return Number(id);
  });

  const buses = getBuses(busIds);

  let t = 0;
  let jump = buses[0].n;
  for (let bus of buses.slice(1)) {
    while ((t + bus.ix) % bus.n !== 0) {
      t += jump;
    }
    jump *= bus.n;
  }
  return t;
}

export default async function run() {
  const input = await readInputAsStrings(path.join(__dirname, "./input.txt"));
  return solve(input);
}
