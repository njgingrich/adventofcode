import * as it from "itertools";
import * as path from "path";

import { readInput } from "../util";
import Grid from "../util/grid";

type Entry = '.' | '#';
type FoldInstruction = ['x' | 'y', number]

const INPUT_PATH = path.join(__dirname, "./input.txt");

function parse(input: string) {
  const [coords, foldLines] = input.split('\n\n');

  const grid = new Grid<Entry>({ getDefault: () => '.' });
  coords
    .split('\n')
    .map(c => c.split(',').map(Number))
    .forEach(([x, y]) => grid.set(x, y, '#'));

  const folds = foldLines
    .split("\n")
    .map((l) => l.split(" ")[2].split("="))
    .map(([dir, ix]) => [dir, Number(ix)] as FoldInstruction); 

  return {grid, folds};
}

export default async function run() {
  const input = await readInput(INPUT_PATH);
  const {grid, folds} = parse(input);

  let [direction, ix] = folds[0];
  for (let [coord, _] of grid) {
    const [x, y] = Grid.asCoord(coord);

    if (direction === "y" && y > ix) {
      const newY = ix + (ix - y);
      grid.set(x, newY, "#");
      grid.unset(x, y);
    } else if (direction === "x" && x > ix) {
      const newX = ix + (ix - x);
      grid.set(newX, y, "#");
      grid.unset(x, y);
    }
  }

  return grid.findWhere(([x, y]) => grid.get(x, y) === '#').length;
}
