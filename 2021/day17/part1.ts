import * as it from "itertools";
import * as path from "path";

import { readInput } from "../util";

type Point = {x: number, y: number};
type Velocity = {x: number, y: number};
type Area = {minX: number, maxX: number, minY: number, maxY: number};

const INPUT_PATH = path.join(__dirname, "./input.txt");

function parse(line: string): Area {
  const [_, coords] = line.split(': ');
  const [xs, ys] = coords.split(', ');

  const [minX, maxX] = xs.slice(2).split('..');
  const [minY, maxY] = ys.slice(2).split('..');
  return {
    minX: Number(minX),
    maxX: Number(maxX),
    minY: Number(minY),
    maxY: Number(maxY),
  };
}

function step(point: Point, velocity: Velocity): {point: Point, velocity: Velocity} {
  let newPoint = {x: point.x, y: point.y};
  let newVelocity = {x: velocity.x, y: velocity.y};

  newPoint.x += velocity.x;
  newPoint.y += velocity.y;

  if (velocity.x < 0) {
    newVelocity.x += 1;
  } else if (velocity.x > 0) {
    newVelocity.x -= 1;
  }
  newVelocity.y -= 1;

  return {point: newPoint, velocity: newVelocity};
}

function isInTargetArea(point: Point, area: Area) {
  return area.minX <= point.x && area.maxX >= point.x && area.minY <= point.y && area.maxY >= point.y;
}

function isPastTargetArea(point: Point, area: Area) {
  return point.y < area.minY || point.x > area.maxX;
}

function getPathForVelocity(initialV: Velocity, area: Area) {
  let p = {x: 0, y: 0};
  let v = initialV;
  const points: Point[] = [p];

  while (!isPastTargetArea(p, area) && !isInTargetArea(p, area)) {
    let res = step(p, v);
    p = res.point;
    v = res.velocity;
    points.push(res.point);
  }

  return {points, success: isInTargetArea(p, area)};
}

function solve(lines: string) {
  const targetArea = parse(lines);
  let maxY = -Infinity;

  for (let x = 0; x < 1000; x++) {
    for (let y = 0; y < 1000; y++) {
      let v: Velocity = {x, y};

      const {points, success} = getPathForVelocity(v, targetArea);
      if (success) {
        maxY = Math.max(maxY, ...points.map(p => p.y));
      }
    }
  }

  return maxY;
}

export default async function run() {
  const input = await readInput(INPUT_PATH);
  return solve(input);
}
