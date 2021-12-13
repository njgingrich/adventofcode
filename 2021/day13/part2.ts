import * as it from "itertools";
import * as path from "path";

import { readInput } from "../util";
import Grid from "../util/grid";

type Entry = "." | "#";
type FoldInstruction = ["x" | "y", number];

const INPUT_PATH = path.join(__dirname, "./input.txt");

function parse(input: string) {
  const [coords, foldLines] = input.split("\n\n");

  const grid = new Grid<Entry>({ getDefault: () => "." });
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

  let width = grid.width();
  let height = grid.height();

  for (let [direction, ix] of folds) {
    // console.log({width, height, direction, ix});

    if (direction === "y") {
      for (let y of it.range(ix + 1, height)) {
        for (let x of it.range(0, width)) {
          if (grid.get(x, y) === "#") {
            const newY = ix + (ix - y);
            // console.log(`Reflecting dot from [${Grid.toId(x, y)}] to [${Grid.toId(x, newY)}]`);
            grid.set(x, newY, "#");
            grid.unset(x, y);
          }
        }
      }

      height = ix;
    } else {
      for (let x of it.range(ix + 1, width)) {
        for (let y of it.range(0, height)) {
          if (grid.get(x, y) === "#") {
            const newX = ix + (ix - x);
            // console.log(`Reflecting dot from [${Grid.toId(x, y)}] to [${Grid.toId(newX, y)}]`);
            grid.set(newX, y, "#");
            grid.unset(x, y);
          }
        }
      }

      width = ix;
    }

  }
  
  const numberOfChars = 8;
  const requiredWidth = (numberOfChars * 4) + (1 * (numberOfChars - 1)) - 1;
  const subgrid = grid.subgrid(0, requiredWidth, 0, 5);
  return subgrid.toString();
}
