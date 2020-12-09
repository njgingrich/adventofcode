import * as it from "iter-tools";
import * as path from "path";

import { readInputAsStrings } from "../util";

type Slope = {
  rows: number;
  cols: number;
};

function getMap(lines: string[]): string[][] {
  const geography = lines.map((line) => line.split(""));
  return geography;
}

function getMapCoord(row: number, col: number, map: string[][]): string {
  const width = map[0].length;

  const offsetRow = row - 1;
  const offsetCol = (col - 1) % width;
  // console.log(`Look at real map [${offsetRow}, ${offsetCol}] = ${map[offsetRow][offsetCol]}`);
  return map[offsetRow][offsetCol];
}

function solveForSlope(map: string[][], slope: Slope) {
  const pos = { row: 1, col: 1 };
  let numTrees = 0;

  while (pos.row < map.length) {
    pos.row += slope.rows;
    pos.col += slope.cols;

    if (getMapCoord(pos.row, pos.col, map) === "#") numTrees++;
  }

  return numTrees;
}

function solve(lines: string[], slopes: Slope[]) {
  const map = getMap(lines);
  const trees = slopes.map((slope) => solveForSlope(map, slope));
  return trees.reduce((sum, val) => sum * val, 1);
}

export default async function run() {
  const lines = await readInputAsStrings(path.join(__dirname, "./input.txt"));
  const slopes = [
    { rows: 1, cols: 1 },
    { rows: 1, cols: 3 },
    { rows: 1, cols: 5 },
    { rows: 1, cols: 7 },
    { rows: 2, cols: 1 },
  ];

  return solve(lines, slopes);
}
