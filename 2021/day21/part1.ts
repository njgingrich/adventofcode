import * as it from "itertools";
import * as path from "path";

import { readInputAsStrings } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

class Die {
  value: number;
  max: number;

  constructor(start: number, max: number) {
    this.value = start;
    this.max = max;
  }

  roll() {
    const val = this.value;
    this.value = (this.value % this.max) + 1;
    return val;
  }
}

class Player {
  position: number;
  score: number;

  constructor(pos: number, score = 0) {
    this.position = pos;
    this.score = score;
  }

  move(distance: number) {
    this.position = (this.position + distance) % 10
    if (this.position === 0) {
      this.position += 10;
    }
    this.score += this.position;
  }

  wins(): boolean {
    return this.score >= 1000;
  }
}

function turn(p: Player, die: Die) {
  const rolls = die.roll() + die.roll() + die.roll();
  p.move(rolls);
}

function parse(lines: string[]) {
  return {
    start1: Number(lines[0][lines[0].length-1]),
    start2: Number(lines[1][lines[1].length-1]),
  }
}

export default async function run() {
  const input = await readInputAsStrings(INPUT_PATH);
  let {start1, start2} = parse(input);

  const die = new Die(1, 100);
  const p1 = new Player(start1);
  const p2 = new Player(start2);

  let rolls = 0;
  while (!p1.wins() && !p2.wins()) {
    const p = rolls % 2 === 0 ? p1 : p2;
    turn(p, die);

    rolls += 3;
  }
  
  const loser = Math.min(p1.score, p2.score);
  return loser * rolls;
}
