import { sum } from "lodash";
import * as path from "path";

import { readInputAsString } from "../util";

function sim(initialFish: number[], days: number) {
  let fish = Array.from(initialFish);
  let fishInDay = Array.from({ length: 9 }).fill(0).map(_ => 0);

  fish.forEach(f => fishInDay[f] += 1);

  // for day in range(days) we want to:
  // those that reproduce are fishInDay[0]
  // we want to rotate left the array so the ones that were in fishInDay[1] are now fishInDay[0]
  // and the ones that were in day 0 (who add to day 6) reproduce to the same amount in new day 8
  // we add to the new day 6, those that were reproducing today
  for (let day = 0; day < days; day++) {
    let generation = fishInDay.shift() as number;

    fishInDay[6] += generation;
    fishInDay.push(generation);
  }

  return sum(fishInDay);
}

function solve(split: string[]) {
  const fish = split.map(Number);
  let count = sim(fish, 256);

  console.log(count);
}

export default async function run() {
  const input = await readInputAsString(path.join(__dirname, "./input.txt"), ",");
  return solve(input);
}
