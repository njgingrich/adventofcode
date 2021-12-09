import _ from "lodash";
import * as path from "path";

import { readInputAsStrings } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

type Point = [number, number]; // row, column

function parse(lines: string[]): number[][] {
  return lines.map(line => line.split('').map(Number));
}

function adjacentForPoint(grid: number[][], point: Point) {
  const points: Point[] = [];
  let width = grid[0].length;
  let height = grid.length;

  if (point[0] > 0) {
    points.push([point[0] - 1, point[1]]);
  }
  if (point[0] < height - 1) {
    points.push([point[0] + 1, point[1]]);
  }
  if (point[1] > 0) {
    points.push([point[0], point[1] - 1]);
  }
  if (point[1] < width - 1) {
    points.push([point[0], point[1] + 1]);
  }

  return points;
}

function isLowPoint(point: Point, adjacent: Point[], grid: number[][]) {
  return adjacent.every(([r, c]) => grid[r][c] > grid[point[0]][point[1]]);
}

function solve(lines: string[]) {
  const grid = parse(lines);
  let lowPoints: Point[] = [];

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      let point: Point = [row, col];
      let adjacent = adjacentForPoint(grid, point);
      // console.log({point, adjacent});

      if (isLowPoint(point, adjacent, grid)) {
        lowPoints.push(point);
      }
    }
  }

  // console.log({lowPoints})
  return _.sum(lowPoints.map(([r, c]) => grid[r][c] + 1));
}

export default async function run() {
  const input = await readInputAsStrings(INPUT_PATH);
  return solve(input);
}
