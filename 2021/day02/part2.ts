import * as it from "iter-tools";
import * as path from "path";

import { readInputAsStrings } from "../util";

type Direction = "forward" | "down" | "up";
type Instruction = {
  direction: Direction;
  distance: number;
};

function parseLines(lines: string[]): Instruction[] {
  return lines.map((line) => {
    const [direction, distance] = line.split(" ");
    return {
      direction: direction as Direction,
      distance: Number(distance),
    };
  });
}

function solve(lines: Instruction[]) {
  let horizontalPos = 0;
  let depth = 0;
  let aim = 0;

  lines.forEach((line) => {
    switch (line.direction) {
      case "down": {
        aim += line.distance;
        return;
      }
      case "up": {
        aim -= line.distance;
        return;
      }
      case "forward":
        horizontalPos += line.distance;
        depth += aim * line.distance;
        return;
    }
  });

  return horizontalPos * depth;
}

export default async function run() {
  const input = await readInputAsStrings(path.join(__dirname, "./input.txt"));
  const instructions = parseLines(input);

  return solve(instructions);
}
