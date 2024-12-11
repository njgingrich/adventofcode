import { run } from "aocrunner";
import { parse, SEPARATOR } from "@std/path";
import { sum, map } from 'itertools';
import Grid, { type Coord } from "../util/grid.ts";

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
    rawInput.split("\n").filter(Boolean).map((line) => line.split("")),
    { getDefault: () => '.' },
  );
}

function trailheads(grid: Grid<string>) {
  return grid
    .findWhere((c) => grid.getByCoord(c) === '0')
    .map(([v, coord]) => coord);
}

function walk(grid: Grid<string>, start: Coord, endPositions: string[], unique: boolean) {
  const neighbors = grid.neighbors(start);
  const validNeighbors = neighbors.values().filter((coord) => {
    if (grid.getByCoord(coord) === '.') return false;
    return grid.inBoundsCoord(coord) && Number(grid.getByCoord(coord)) === Number(grid.getByCoord(start)) + 1;
  });

  for (const neighbor of validNeighbors) {
    // console.log(`Walking to [${neighbor}]`);
    if (grid.getByCoord(neighbor) === '9') {
      // console.log(`Found end of trail at: [${neighbor}]`);
      if (!unique || !endPositions.includes(Grid.coordToId(neighbor))) {
        endPositions.push(Grid.coordToId(neighbor));
      }
    } else {
      walk(grid, neighbor, endPositions, unique);
    }
  }
}

function part1(rawInput: string) {
  const input = parseInput(rawInput);

  return sum(map(trailheads(input), ((c) => {
    const endPositions: string[] = [];
    walk(input, c, endPositions, true);
    return endPositions.length;
  })));
}

function part2(rawInput: string) {
  const input = parseInput(rawInput);

  return sum(map(trailheads(input), ((c) => {
    const endPositions: string[] = [];
    walk(input, c, endPositions, false);
    return endPositions.length;
  })));
}

run({
  part1: {
    tests: [
      {
        input: `0123
1234
8765
9876`,
        expected: 1,
      },
      {
        input: `..90..9
...1.98
...2..7
6543456
765.987
876....
987....`,
        expected: 4,
      },
      {
        input: `10..9..
2...8..
3...7..
4567654
...8..3
...9..2
.....01`,
        expected: 3,
      },
      {
        input: `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`,
        expected: 36,
      },
    ],
    solver: part1,
    solve: true,
  },
  part2: {
    tests: [
      {
        input: `..90..9
...1.98
...2..7
6543456
765.987
876....
987....`,
        expected: 13,
      },
      {
        input: `012345
123456
234567
345678
4.6789
56789.`,
        expected: 227,
      },
      {
        input: `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`,
        expected: 81,
      }
    ],
    solver: part2,
    solve: true,
  },
  input: await getRawInput(),
  day: await getDay(),
});
