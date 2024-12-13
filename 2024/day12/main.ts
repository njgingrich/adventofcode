import { run } from "aocrunner";
import { parse, SEPARATOR } from "@std/path";
import Grid, { type Coord, type Direction } from "../util/grid.ts";
import { map, sum } from "itertools";

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
  const grid = Grid.fromArray(
    rawInput.split("\n").map((line) => line.split("")),
    { getDefault: () => "." },
  );

  return grid;
}

function floodFill(grid: Grid<string>, start: Coord): Coord[] {
  const key = grid.getByCoord(start);
  const q = [start];
  const region = new Set<string>();
  region.add(Grid.coordToId(start));

  while (q.length > 0) {
    const current = q.pop()!;

    for (const [_, neighbor] of grid.neighbors(current)) {
      if (!grid.inBoundsCoord(neighbor)) continue;
      if (region.has(Grid.coordToId(neighbor))) continue;
      if (grid.getByCoord(neighbor) !== key) continue;

      region.add(Grid.coordToId(neighbor));
      q.push(neighbor);
    }
  }

  return [...region].map(Grid.asCoord);
}

function perimeter(region: Coord[], grid: Grid<string>) {
  let p = 0;
  for (const coord of region) {
    for (const [_, neighbor] of grid.neighbors(coord, "cardinal", false)) {
      if (!grid.inBoundsCoord(neighbor)) {
        p++;
        continue;
      }
      if (!region.find((c) => c[0] === neighbor[0] && c[1] === neighbor[1])) {
        p++;
      }
    }
  }

  return p;
}

function countLCorners(region: Coord[], neighborsMatch: Map<Direction, boolean>, grid: Grid<string>): number {
  let corners = 0;
  if (neighborsMatch.get("N") && neighborsMatch.get("E") && !neighborsMatch.get("NE")!) {
    corners += 1;
  }
  if (neighborsMatch.get("S") && neighborsMatch.get("E") && !neighborsMatch.get("SE")!) {
    corners += 1;
  }
  if (neighborsMatch.get("S") && neighborsMatch.get("W") && !neighborsMatch.get("SW")!) {
    corners += 1;
  }
  if (neighborsMatch.get("N") && neighborsMatch.get("W") && !neighborsMatch.get("NW")!) {
    corners += 1;
  }
  return corners;
}

function countCorners(region: Coord[], grid: Grid<string>) {
  // Got some helpful hints from https://www.reddit.com/r/adventofcode/comments/1hcdnk0/2024_day_12_solutions/m1uyp1z/
  let corners = 0;
  const val = grid.getByCoord(region[0]);
  for (const coord of region) {
    const neighbors = grid.neighbors(coord, "moores", false);
    const neighborsMatch = new Map<Direction, boolean>();
    for (const [dir, neighbor] of neighbors) {
      neighborsMatch.set(dir, grid.getByCoord(neighbor) === val);
    }

    // count of neighbors that are in the region
    const neswNeighborCount = (["N", "E", "S", "W"] as Direction[])
      .filter((dir: Direction) => neighborsMatch.get(dir)).length;

    if (neswNeighborCount === 0) {
      // No neighbors, so 4 corners
      corners += 4;
    } else if (neswNeighborCount === 1) {
      corners += 2;
    } else if (neswNeighborCount === 2) {
      let posCorners = 0;
      if (
        (neighborsMatch.get("N") && neighborsMatch.get("E")) ||
        (neighborsMatch.get("S") && neighborsMatch.get("E")) ||
        (neighborsMatch.get("S") && neighborsMatch.get("W")) ||
        (neighborsMatch.get("N") && neighborsMatch.get("W"))
      ) {
        posCorners = 1;
      }
      corners += posCorners + countLCorners(region, neighborsMatch, grid);
    } else if (neswNeighborCount === 3 || neswNeighborCount === 4) {
      corners += countLCorners(region, neighborsMatch, grid);
    }
  }

  return corners;
}

function price(region: Coord[], grid: Grid<string>) {
  const area = region.length;
  const p = perimeter(region, grid);

  // console.log(`Price for region ${grid.getByCoord(region[0])}: ${area * p}`);
  return area * p;
}

function priceBySide(region: Coord[], grid: Grid<string>) {
  const area = region.length;
  const sides = countCorners(region, grid);

  return area * sides;
}

function getRegions(grid: Grid<string>): [string, Coord[]][] {
  const regions: ([string, Coord[]])[] = [];

  let coords = [...grid.grid.keys()].map(Grid.asCoord);
  while (coords.length > 0) {
    const start = coords.pop()!;
    const region = floodFill(grid, start);
    coords = coords.filter((c) => !region.find((r) => r[0] === c[0] && r[1] === c[1]));
    regions.push([grid.getByCoord(start), region]);
  }

  return regions;
}

function part1(rawInput: string) {
  const grid = parseInput(rawInput);
  const regions = getRegions(grid);

  return sum(map(regions, ([key, region]) => price(region, grid)));
}

function part2(rawInput: string) {
  const grid = parseInput(rawInput);
  const regions = getRegions(grid);

  return sum(map(regions, ([key, region]) => priceBySide(region, grid)));
}

run({
  part1: {
    tests: [
      {
        input: `AAAA
BBCD
BBCC
EEEC`,
        expected: 140,
      },
      {
        input: `OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`,
        expected: 772,
      },
      {
        input: `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`,
        expected: 1930,
      },
    ],
    solver: part1,
    solve: true,
  },
  part2: {
    tests: [
      {
        input: `AAAA
BBCD
BBCC
EEEC`,
        expected: 80,
      },
      {
        input: `EEEEE
EXXXX
EEEEE
EXXXX
EEEEE`,
        expected: 236,
      },
      {
        input: `AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA`,
        expected: 368,
      },
      {
        input: `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`,
        expected: 1206,
      },
    ],
    solver: part2,
    solve: true,
  },
  input: await getRawInput(),
  day: getDay(),
});
