import * as it from "itertools";
import _ from "lodash";
import * as path from "path";

import { readInputAsStrings } from "../util";
import Grid from "../util/grid";
import type { Coord } from "../util/grid";

const INPUT_PATH = path.join(__dirname, "./input.txt");

function isLowPoint(coord: Coord, grid: Grid<number>) {
  return it.all(
    grid.neighbors(coord).values(),
    (n => grid.getCoord(n) > grid.getCoord(coord))
  );
}

function getBasinSize(start: Coord, grid: Grid<number>) {
  const filterOutPeaks = (c: Coord) => grid.get(c[0], c[1]) !== 9;

  const frontier = it.filter(grid.neighbors(start).values(), filterOutPeaks);
  const basin = new Set(frontier.map((p) => p.toString()));
  basin.add(start.toString());

  while (frontier.length > 0) {
    let coord = frontier.shift();
    if (!coord) break;

    it.filter(grid.neighbors(coord).values(), filterOutPeaks)
      .filter((c) => !basin.has(c.toString()))
      .forEach((c) => {
        frontier.push(c);
        basin.add(c.toString());
      });
  }

  return basin.size;
}

function solve(lines: string[]) {
  const numbers = lines.map((line) => line.split("").map(Number));
  const grid = Grid.fromArray<number>(numbers, { getDefault: () => 0 });
  const lowPoints = grid.findWhere((coord) => isLowPoint(coord, grid));

  return lowPoints
    .map(([_, coord]) => coord)
    .map((p) => getBasinSize(p, grid))
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((val, cur) => val * cur, 1);
}

export default async function run() {
  const input = await readInputAsStrings(INPUT_PATH);
  return solve(input);
}
