import { run } from "aocrunner";
import { parse, SEPARATOR } from "@std/path";
import Grid, { type Coord } from "../util/grid.ts";
import { find, permutations } from "itertools";

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

function parseInput(rawInput: string): { grid: Grid<string>; nodes: Map<string, Coord[]> } {
  const grid = Grid.fromArray(
    rawInput.split("\n").filter(Boolean).map((line) => line.split("")),
    { getDefault: () => "." },
  );

  const nodes = new Map<string, Coord[]>();
  for (const [coordStr, value] of grid.entries()) {
    if (value === ".") continue;
    if (!nodes.has(value)) {
      nodes.set(value, []);
    }

    nodes.get(value)!.push(Grid.asCoord(coordStr));
  }
  return { grid, nodes };
}

function resonate(grid: Grid<string>, a: Coord, b: Coord) {
  const antinodes: Coord[] = [];
  let left: Coord = [a[0], a[1]];
  let right: Coord = [b[0], b[1]];
  while (grid.inBoundsCoord(left)) {
    antinodes.push(left);
    const [lX, lY] = left;
    const [rX, rY] = right;
    left = [lX + (lX - rX), lY + (lY - rY)];
    right = [lX, lY];
  }

  return antinodes;
}

function getAntinodes(grid: Grid<string>, nodes: Map<string, Coord[]>, node: string, resontate = false) {
  const antinodes: Coord[] = [];
  const nodePairs = permutations(nodes.get(node)!, 2);

  // [ [4,3], [5,5] ] -> [3,1] and [6,7]
  // [ [5,5], [4,3] ] -> [3,1] and [6,7]
  for (const [a, b] of nodePairs) {
    if (resontate) {
      antinodes.push(...resonate(grid, a, b));
      antinodes.push(...resonate(grid, b, a));
    } else {
      const [aX, aY] = a;
      const [bX, bY] = b;
      const left: Coord = [aX + (aX - bX), aY + (aY - bY)];
      const right: Coord = [bX + (bX - aX), bY + (bY - aY)];
      // console.log(`Found offsets for pair [${a}, ${b}] -> ${left}, ${right}")`)
      if (grid.inBoundsCoord(left)) antinodes.push(left);
      if (grid.inBoundsCoord(right)) antinodes.push(right);
    }

  }

  return antinodes;
}

function part1(rawInput: string) {
  const {grid, nodes} = parseInput(rawInput);
  const antinodesGrid = grid.clone();

  // console.log(grid.toString());
  for (const node of nodes.keys()) {
    const antinodes = getAntinodes(grid, nodes, node);
    for (const antinode of antinodes) {
      antinodesGrid.setCoord(antinode, "#");
    }
  }
  // console.log(antinodesGrid.toString());
  return antinodesGrid.findWhere((value) => antinodesGrid.getByCoord(value) === "#").length;
}

function part2(rawInput: string) {
  const {grid, nodes} = parseInput(rawInput);
  const antinodesGrid = grid.clone();

  // console.log(grid.toString());
  for (const node of nodes.keys()) {
    const antinodes = getAntinodes(grid, nodes, node, true);
    for (const antinode of antinodes) {
      antinodesGrid.setCoord(antinode, "#");
    }
  }
  // console.log('ANTINODES:')
  // console.log(antinodesGrid.toString());
  return antinodesGrid.findWhere((value) => antinodesGrid.getByCoord(value) === "#").length;
}

run({
  part1: {
    tests: [
      {
        input: `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`,
        expected: 14,
      },
    ],
    solver: part1,
    solve: true,
  },
  part2: {
    tests: [
      {
        input: `T.........
...T......
.T........
..........
..........
..........
..........
..........
..........
..........`,
        expected: 9,
      },
      {
        input: `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`,
        expected: 34,
      },
    ],
    solver: part2,
    solve: true,
  },
  input: await getRawInput(),
  day: getDay(),
});
