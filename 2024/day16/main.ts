import { run } from "aocrunner";
import { parse, SEPARATOR } from "@std/path";
import Queue from 'tinyqueue';
import Grid, { type Coord } from "../util/grid.ts";
import { mod } from "../util/index.ts";

function getRawInput(): Promise<string> {
  return Deno.readTextFile("input.txt");
}

function getDay(): number {
  // TODO: extract to util function we import
  const module = import.meta.url;
  const parsed = parse(module);
  const dayString = parsed.dir.split(SEPARATOR).pop() ?? "";
  return Number(dayString.slice(-2));
}

function parseInput(rawInput: string): Grid<string> {
  return Grid.fromArray(
    rawInput.split("\n").map((row) => row.split("")),
    {getDefault: () => "#"},
  );
}

const DIRECTIONS = ["N", "E", "S", "W"] as const;
type Direction = typeof DIRECTIONS[number];
const OFFSETS = [[0, 1], [1, 0], [0, -1], [-1, 0]] as [[number, number], [number, number], [number, number], [number, number]]; // E, S, W, N

function getOffset(dir: Direction): [number, number] {
  return OFFSETS[DIRECTIONS.indexOf(dir)];
}

function getKey(dir: Direction, coord: Coord): string {
  return `${dir}:${Grid.coordToId(coord)}`;
}

interface Node {
  score: number;
  dir: Direction
  coord: Coord;
  path: Coord[];
}

function part1(rawInput: string) {
  const grid = parseInput(rawInput);
  const start = grid.findFirstWhere((coord) => grid.getByCoord(coord) === "S")![1];
  const end = grid.findFirstWhere((coord) => grid.getByCoord(coord) === "E")![1];

  const queue = new Queue<Node>([], (a, b) => a.score - b.score);
  const visited = new Set<string>();

  queue.push({score: 0, dir: 'E', coord: start, path: [start]});
  while (queue.length > 0) {
    const {score, dir, coord, path} = queue.pop()!;

    // Found the end!
    if (end[0] === coord[0] && end[1] === coord[1]) {
      return score;
    }

    if (visited.has(getKey(dir, coord))) {
      continue;
    }
    visited.add(getKey(dir, coord));

    const offset = getOffset(dir);
    const newCoord: Coord = [coord[0] + offset[0], coord[1] + offset[1]];
    if (grid.getByCoord(newCoord) !== "#" && !visited.has(getKey(dir, newCoord))) {
      queue.push({score: score + 1, dir, coord: newCoord, path: [...path, newCoord]});
    }

    const leftDir = DIRECTIONS[mod(DIRECTIONS.indexOf(dir) - 1, DIRECTIONS.length)];
    const leftOffset = getOffset(leftDir);
    const leftCoord: Coord = [coord[0] + leftOffset[0], coord[1] + leftOffset[1]];
    if (grid.getByCoord(leftCoord) !== "#" && !visited.has(getKey(dir, leftCoord))) {
      queue.push({score: score + 1000, dir: leftDir, coord: coord, path});
    }

    const rightDir = DIRECTIONS[mod(DIRECTIONS.indexOf(dir) + 1, DIRECTIONS.length)];
    const rightOffset = getOffset(rightDir);
    const rightCoord: Coord = [coord[0] + rightOffset[0], coord[1] + rightOffset[1]];
    if (grid.getByCoord(rightCoord) !== "#" && !visited.has(getKey(dir, rightCoord))) {
      queue.push({score: score + 1000, dir: rightDir, coord: coord, path});
    }
  }

  return -1;
}

function part2(rawInput: string) {
  const grid = parseInput(rawInput);
  const start = grid.findFirstWhere((coord) => grid.getByCoord(coord) === "S")![1];
  const end = grid.findFirstWhere((coord) => grid.getByCoord(coord) === "E")![1];

  const queue = new Queue<Node>([], (a, b) => a.score - b.score);
  const visited = new Map<string, number>();
  const winningPaths: Coord[][] = [];
  let lowestScore: number | undefined = undefined;

  function canVisit(node: Node): boolean {
    const {dir, coord, score} = node;
    const previousScore = visited.get(getKey(dir, coord));
    if (previousScore !== undefined && previousScore < score) {
      return false;
    }

    visited.set(getKey(dir, coord), score);
    return true;
  }

  queue.push({score: 0, dir: 'E', coord: start, path: [start]});
  while (queue.length > 0) {
    const node = queue.pop()!;
    const {score, dir, coord, path} = node;

    if (lowestScore && score > lowestScore) {
      continue;
    }

    // Found the end!
    if (end[0] === coord[0] && end[1] === coord[1]) {
      lowestScore = score;
      winningPaths.push(path);
      continue;
    }

    if (!canVisit(node)) {
      continue;
    }

    const offset = getOffset(dir);
    const newCoord: Coord = [coord[0] + offset[0], coord[1] + offset[1]];
    if (grid.getByCoord(newCoord) !== "#" && !visited.has(getKey(dir, newCoord))) {
      queue.push({score: score + 1, dir, coord: newCoord, path: [...path, newCoord]});
    }

    const leftDir = DIRECTIONS[mod(DIRECTIONS.indexOf(dir) - 1, DIRECTIONS.length)];
    const leftOffset = getOffset(leftDir);
    const leftCoord: Coord = [coord[0] + leftOffset[0], coord[1] + leftOffset[1]];
    if (grid.getByCoord(leftCoord) !== "#" && !visited.has(getKey(dir, leftCoord))) {
      queue.push({score: score + 1000, dir: leftDir, coord: coord, path});
    }

    const rightDir = DIRECTIONS[mod(DIRECTIONS.indexOf(dir) + 1, DIRECTIONS.length)];
    const rightOffset = getOffset(rightDir);
    const rightCoord: Coord = [coord[0] + rightOffset[0], coord[1] + rightOffset[1]];
    if (grid.getByCoord(rightCoord) !== "#" && !visited.has(getKey(dir, rightCoord))) {
      queue.push({score: score + 1000, dir: rightDir, coord: coord, path});
    }
  }

  const uniquePaths = new Set<string>();
  for (const path of winningPaths) {
    for (const coord of path) {
      uniquePaths.add(Grid.coordToId(coord));
    }
  }

  return uniquePaths.size;
}

run({
  part1: {
    tests: [
      {
        input: `###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`,
        expected: 7036,
      },
      {
        input: `#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`,
        expected: 11048,
      }
    ],
    solver: part1,
    solve: true,
  },
  part2: {
    tests: [
      {
        input: `###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`,
        expected: 45,
      },
      {
        input: `#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`,
        expected: 64,
      }
    ],
    solver: part2,
    solve: true,
  },
  input: await getRawInput(),
  day: getDay(),
});
