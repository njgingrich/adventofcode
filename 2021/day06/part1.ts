import * as it from "iter-tools";
import * as path from "path";

import { readInput } from "../util";

class LanternFish {
  timer: number;

  constructor(internalTimer: number) {
    this.timer = internalTimer;
  }

  update(): LanternFish | null {
    // update the day _after_ we hit 0
    if (this.timer === 0) {
      this.timer = 6;
      return new LanternFish(8);
    } else {
      this.timer -= 1;
      return null;
    }
  }

  toString() {
    return `${this.timer}`;
  }
}

function sim(initialFish: LanternFish[], days: number) {
  let fish = Array.from(initialFish);

  for (let day = 1; day <= days; day++) {
    let newFish = Array.from(fish);

    fish.forEach((f) => {
      let res = f.update();
      if (res !== null) {
        newFish.push(res);
      }
    });

    fish = newFish;
    // console.log(`After day ${day}:`, fish.map((f) => f.toString()).join(","));
  }

  return fish.length;
}

function parse(line: string) {
  return line.split(',').filter(Boolean).map(v => new LanternFish(Number(v)));
}

function solve(line: string) {
  const fish = parse(line);
  let count = sim(fish, 80);

  console.log(count);
}

export default async function run() {
  const input = await readInput(path.join(__dirname, "./input.txt"));
  return solve(input);
}
