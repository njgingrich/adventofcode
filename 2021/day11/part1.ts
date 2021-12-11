import Denque from "denque";
import * as it from "itertools";
import * as path from "path";

import { readInputAsNumberGrid } from "../util";
import Grid from "../util/grid";

const INPUT_PATH = path.join(__dirname, "./input.txt");

function step(grid: Grid<number>) {
  for (let [coordString, value] of grid) {
    const coord = Grid.asCoord(coordString);
    grid.setCoord(coord, value + 1);
  }

  const shouldFlash = grid
    .findWhere(coord => grid.getByCoord(coord) > 9)
    .map(([_, coord]) => coord);
  const flashed = new Set<string>(shouldFlash.map(Grid.coordToId));
  const flashQueue = new Denque(shouldFlash);

  while (!flashQueue.isEmpty()) {
    const coord = flashQueue.shift();
    if (!coord) break;

    flashed.add(Grid.coordToId(coord));

    for (let neighbor of grid.neighbors(coord, "moores").values()) {
      const newVal = grid.getByCoord(neighbor) + 1;
      grid.setCoord(neighbor, newVal);

      if (newVal > 9 && !flashed.has(Grid.coordToId(neighbor))) {
        flashed.add(Grid.coordToId(neighbor));
        flashQueue.push(neighbor);
      }
    }
  }

  for (let coordString of flashed) {
    grid.setCoord(Grid.asCoord(coordString), 0);
  }

  return flashed.size;
}


function solve(numbers: number[][]) {
  const grid = Grid.fromArray<number>(numbers, { getDefault: () => 0 });

  const sum = it.sum(it.map(it.range(100), () => step(grid)));
  return sum;
}

export default async function run() {
  const input = await readInputAsNumberGrid(INPUT_PATH);
  return solve(input);
}
