import _ from "lodash";
import * as path from "path";

import { readInputAsStrings } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

type Point = [number, number]; // row, column

function parse(lines: string[]): number[][] {
  return lines.map(line => line.split('').map(Number));
}

function adjacentForPoint(point: Point, grid: number[][]) {
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

function getBasinSize(startPoint: Point, grid: number[][]) {
  const basinPoints = new Set();
  basinPoints.add(startPoint.toString());
  let pointsToSearch = findAdjacentNonHighPoints(startPoint, grid);
  pointsToSearch.forEach(p => basinPoints.add(p.toString()));

  while (pointsToSearch.length > 0) {
    // console.log({startPoint, pointsToSearch, basin: [...basinPoints.values()]})
    let point = pointsToSearch.shift();
    if (!point) break;

    let newAdjacent = findAdjacentNonHighPoints(point, grid);
    newAdjacent.forEach((p) => {
      if (!basinPoints.has(p.toString())) {
        pointsToSearch.push(p);
        basinPoints.add(p.toString());
      }
    });
  }

  return basinPoints.size;
}

function findAdjacentNonHighPoints(point: Point, grid: number[][]) {
    const adjacent = adjacentForPoint(point, grid);
    return adjacent.filter(([r, c]) => grid[r][c] !== 9);
}

function solve(lines: string[]) {
  const grid = parse(lines);
  let lowPoints: Point[] = [];

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      let point: Point = [row, col];
      let adjacent = adjacentForPoint(point, grid);

      if (isLowPoint(point, adjacent, grid)) {
        lowPoints.push(point);
      }
    }
  }

  const sizes = lowPoints.map(p => getBasinSize(p, grid)).sort((a,b) => b - a);
  return sizes.slice(0, 3).reduce((val, cur) => val * cur, 1);
//   return _.sum(lowPoints.map(([r, c]) => grid[r][c] + 1));
}

export default async function run() {
  const input = await readInputAsStrings(INPUT_PATH);
  return solve(input);
}
