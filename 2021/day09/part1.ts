import _ from "lodash";
import * as path from "path";

import { readInputAsStrings } from "../util";
import Grid from "../util/grid";
import type {Coord} from "../util/grid";

const INPUT_PATH = path.join(__dirname, "./input.txt");

function isLowPoint(coord: Coord, grid: Grid<number>) {
  let neighbors = grid.neighbors(coord).values();
  for (let [x, y] of neighbors) {
    if (grid.get(x, y) <= grid.get(coord[0], coord[1])) {
      return false;
    }
  }

  return true;
}

function solve(lines: string[]) {
  const numbers = lines.map((line) => line.split("").map(Number));
  const grid = Grid.fromArray<number>(numbers, { getDefault: () => 0 });
  const lowPoints = grid.findWhere((coord => isLowPoint(coord, grid)));

  return _.sum(lowPoints.map(([num, _]) => num + 1));
}

export default async function run() {
  const input = await readInputAsStrings(INPUT_PATH);
  return solve(input);
}
