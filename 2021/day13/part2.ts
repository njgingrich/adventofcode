import * as it from "itertools";
import * as path from "path";

import { readInput } from "../util";
import Grid from "../util/grid";

type Entry = " " | "#";
type FoldInstruction = ["x" | "y", number];

const INPUT_PATH = path.join(__dirname, "./input.txt");

function parse(input: string) {
  const [coords, foldLines] = input.split("\n\n");

  const grid = new Grid<Entry>({ getDefault: () => " " });
  coords
    .split("\n")
    .map((c) => c.split(",").map(Number))
    .forEach(([x, y]) => grid.set(x, y, "#"));

  const folds = foldLines
    .split("\n")
    .map((l) => l.split(" ")[2].split("="))
    .map(([dir, ix]) => [dir, Number(ix)] as FoldInstruction);

  return { grid, folds };
}

export default async function run() {
  const input = await readInput(INPUT_PATH);
  const { grid, folds } = parse(input);

  for (let [direction, ix] of folds) {
    for (let [coord, _] of grid) {
      const [x, y] = Grid.asCoord(coord);

      if (direction === "y" && y > ix) {
        const newY = ix + (ix - y);
        grid.set(x, newY, "#");
        grid.unset(x, y);
      } else if (direction === "x" && x > ix) {
        const newX = ix + (ix - x);
        grid.set(newX, y, '#');
        grid.unset(x, y);
      }
    }
  }
  
  const numberOfChars = 8;
  const requiredWidth = (numberOfChars * 4) + (1 * (numberOfChars - 1)) - 1;
  const subgrid = grid.subgrid(0, requiredWidth, 0, 5);
  return subgrid.toString();
}
