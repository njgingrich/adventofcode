import * as it from "itertools";
import * as path from "path";
import Queue from "tinyqueue";

import { readInputAsNumberGrid } from "../util";
import Grid, { Coord } from "../util/grid";

class Node {
  parent: Coord | null;
  coord: Coord;
  priority: number;

  constructor(
    parent: Coord | null,
    coord: Coord,
    priority = Number.POSITIVE_INFINITY
  ) {
    this.parent = parent;
    this.coord = coord;
    this.priority = priority;
  }

  toString() {
    return `[${this.coord[0]}, ${this.coord[1]}]`;
  }
}

const INPUT_PATH = path.join(__dirname, "./input.txt");

function parse(lines: number[][]) {
  const grid = Grid.fromArray(lines, { getDefault: () => 0 });
  const clone = grid.clone();
  let width = grid.width();
  let height = grid.height();

  // We need to go from (x,y) to (x >= 9 ? 1 : x + 1)
  // (1,1)=6 we need to set (11,1)=7 and (1,11)=7
  // AND (x,y) to (x, y >= / ? 1 : y + 1)
  for (let [id, val] of grid) {
    const [x, y] = Grid.asCoord(id);

    for (let row of it.range(5)) {
      for (let col of it.range(5)) {
        if (row === 0 && col === 0) continue;

        let newVal = val + row + col;
        if (newVal > 9) newVal -= 9;

        clone.set(x + width * col, y + height * row, newVal);
      }
    }
  }

  return clone;
}

function astar(grid: Grid<number>, from: Coord, to: Coord) {
  let frontier = new Queue<Node>([], (a, b) => {
    return a.priority - b.priority;
  });

  let cameFrom: Record<string, Coord | null> = {};
  let costsFor: Record<string, number> = {};

  frontier.push(new Node(null, from, 0));
  cameFrom[Grid.coordToId(from)] = null;
  costsFor[Grid.coordToId(from)] = 0;

  while (frontier.length > 0) {
    let current = frontier.pop()?.coord;
    if (!current) throw new Error("Somehow got node from empty queue");

    // Found the end
    if (current[0] === to[0] && current[1] === to[1]) break;

    grid.neighbors(current).forEach((neighbor) => {
      const nId = Grid.coordToId(neighbor);
      if (!current) return;
      const newCost =
        costsFor[Grid.coordToId(current)] + grid.getByCoord(neighbor);

      if (!(nId in costsFor) || newCost < costsFor[nId]) {
        const priority = newCost + Grid.manhattanDistance(neighbor, to);
        costsFor[nId] = newCost;
        frontier.push(new Node(current, neighbor, priority));
        cameFrom[nId] = current;
      }
    });
  }

  return cameFrom;
}

function reconstructPath(
  start: Coord,
  goal: Coord,
  cameFrom: Record<string, Coord | null>
) {
  let current = goal;
  let path: Record<string, boolean> = {};
  path[Grid.coordToId(current)] = true;

  while (!(start[0] === current[0] && start[1] === current[1])) {
    current = cameFrom[Grid.coordToId(current)] ?? [0, 0];
    path[Grid.coordToId(current)] = true;
  }
  path[Grid.coordToId(start)] = true;
  return path;
}

function sumPath(
  path: Record<string, boolean>,
  grid: Grid<number>,
  start: Coord
) {
  let sum = Object.keys(path).reduce(
    (sum, key) => sum + grid.getByCoord(Grid.asCoord(key)),
    0
  );
  sum -= grid.getByCoord(start);

  return sum;
}

export default async function run() {
  const input = await readInputAsNumberGrid(INPUT_PATH);
  const grid = parse(input);

  const start: Coord = [0, 0];
  const end: Coord = [grid.width() - 1, grid.height() - 1];
  const cameFrom = astar(grid, start, end);
  const path = reconstructPath(start, end, cameFrom);
  const sum = sumPath(path, grid, start);

  return sum;
}
