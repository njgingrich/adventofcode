import * as it from "itertools";
import * as path from "path";

import { readInputAsStrings } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

class Player {
  position: number;
  score: number;

  constructor(pos: number, score = 0) {
    this.position = pos;
    this.score = score;
  }

  move(distance: number) {
    this.position = (this.position + distance) % 10;
    if (this.position === 0) {
      this.position += 10;
    }
    this.score += this.position;
  }

  wins(): boolean {
    return this.score >= 21;
  }
}

const dicemap = new Map<number, number>();
for (let d1 = 1; d1 <= 3; d1++) {
  for (let d2 = 1; d2 <= 3; d2++) {
    for (let d3 = 1; d3 <= 3; d3++) {
      let roll = d1 + d2 + d3;
      dicemap.set(roll, (dicemap.get(roll) ?? 0) + 1);
    }
  }
}
let minOutcome = Infinity;
let maxOutcome = -Infinity;
for (let val of dicemap.keys()) {
  minOutcome = Math.min(minOutcome, val);
  maxOutcome = Math.max(maxOutcome, val);
}

function parse(lines: string[]) {
  return {
    start1: Number(lines[0][lines[0].length - 1]),
    start2: Number(lines[1][lines[1].length - 1]),
  };
}

function quantumTurn(p1: Player, p2: Player, turn: number = 0) {
  if (p1.wins()) return 1;
  if (p2.wins()) return 0;
  
  const p = turn % 2 === 0 ? p1 : p2;
  let sum = 0;

  for (let outcome = minOutcome; outcome <= maxOutcome; outcome++) {
    const oldPos = p.position;
    const oldScore = p.score;
    p.move(outcome);

    sum += (dicemap.get(outcome) ?? 0) * quantumTurn(p1, p2, turn + 1);

    p.position = oldPos;
    p.score = oldScore;
  }

  return sum;
}

export default async function run() {
  const input = await readInputAsStrings(INPUT_PATH);
  let { start1, start2 } = parse(input);

  const p1 = new Player(start1);
  const p2 = new Player(start2);

  return quantumTurn(p1, p2);
}
