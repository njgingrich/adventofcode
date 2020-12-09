import * as it from "iter-tools";
import * as path from "path";

import { readInput } from "../util";

const map: Record<Direction, "n" | "s" | "e" | "w"> = {
  "^": "n",
  "v": "s",
  ">": "e",
  "<": "w",
};

type Direction = "^" | "v" | ">" | "<";

function solve(line: string) {
  const directions = line.split("").filter(Boolean) as Direction[];
  const santaPos = { n: 0, s: 0, e: 0, w: 0 };
  const robotPos = { n: 0, s: 0, e: 0, w: 0 };
  const coords: Record<string, number> = {};

  directions.forEach((dir: Direction, i) => {
    const pos = i % 2 === 0 ? santaPos : robotPos;
    pos[map[dir]] += 1;
    const coord = `${pos.n - pos.s}:${pos.e - pos.w}`;
    const existing = coords[coord];
    coords[coord] = existing ? existing + 1 : 1;
  });

  return Object.keys(coords).length;
}

export default async function run() {
  const input = await readInput(path.join(__dirname, "./input.txt"));
  return solve(input);
}
