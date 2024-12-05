import { run } from "aocrunner";
import { parse, SEPARATOR } from "@std/path";
import Grid, { type Coord } from "../util/grid.ts";
import { input } from "npm:@inquirer/prompts@^7.1.0";

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
  const strs = rawInput.split("\n").filter(Boolean).map((l: string) => l.split(""));
  return Grid.fromArray(strs, { getDefault: (x: number, y: number) => "." });
}

function findChars(grid: Grid<string>, char: string): Coord[] {
  return grid.findWhere((c) => grid.getByCoord(c) === char).map((entry) => entry[1]);
}

function findXmasCount(grid: Grid<string>, xCoords: Coord[]): number {
  let sum = 0;

  const mappings = ([x, y]: Coord) => [
    [x, y - 3], // up
    [x, y + 3], // down
    [x - 3, y], // left
    [x + 3, y], // right
    [x - 3, y - 3], // up-left
    [x + 3, y + 3], // down-right
    [x - 3, y + 3], // down-left
    [x + 3, y - 3], // up-right
  ];
  for (const xCoord of xCoords) {
    for (let [x, y] of mappings(xCoord)) {
      if (!grid.inBounds(x, y)) {
        continue;
      }

      // console.log(`Checking subgrid: x from ${xCoord[0]} to ${x}, y from ${xCoord[1]} to ${y}`);
      // if x doesn't change, get col (y is changing)
      let text;
      if (x === xCoord[0]) {
        if (y < xCoord[1]) {
          text = grid.getCol(xCoord[0], y, xCoord[1]).map((r) => r[0]).join("");
        } else {
          text = grid.getCol(xCoord[0], xCoord[1], y).map((r) => r[0]).join("");
        }
        // if x doesn't change, get row (x is changing)
      } else if (y === xCoord[1]) {
        if (x < xCoord[0]) {
          text = grid.getRow(xCoord[1], x, xCoord[0]).map((r) => r[0]).join("");
        } else {
          text = grid.getRow(xCoord[1], xCoord[0], x).map((r) => r[0]).join("");
        }
      } else {
        const xdir = x > xCoord[0] ? 1 : -1;
        const ydir = y > xCoord[1] ? 1 : -1;
        text = grid.getDiagonal(xCoord[0], xCoord[1], 4, xdir, ydir).map((r) => r[0]).join("");
      }

      // console.log('Text:', text);
      if (text === "XMAS" || text === "SAMX") {
        sum++;
      }
    }
  }

  return sum;
}

function findMasXsCount(grid: Grid<string>, aCoords: Coord[]) {
  const masNeighbors = aCoords.map((aCoord) => {
    const neighbors = grid.neighbors(aCoord, "moores");
    const diagonals = {
      "NW": neighbors.get("NW"),
      "NE": neighbors.get("NE"),
      "SW": neighbors.get("SW"),
      "SE": neighbors.get("SE"),
    } as Record<string, Coord>;
    if (Object.values(diagonals).some((val) => val === undefined)) {
      // console.log("Diagonals undefined", Object.values(diagonals));
      return 0;
    }

    if (Object.values(diagonals).some((val) => !["M", "S"].includes(grid.getByCoord(val)))) {
      // console.log("Diagonals not M or S", Object.values(diagonals));
      return 0;
    }

    if (
      grid.getByCoord(diagonals.NW) === grid.getByCoord(diagonals.SE) ||
      grid.getByCoord(diagonals.NE) === grid.getByCoord(diagonals.SW)
    ) {
      // console.log("Matching diagonals", Object.values(diagonals));
      return 0;
    }
    return 1;
  });

  return masNeighbors.reduce((acc: number, val) => acc + val, 0);
}

function part1(rawInput: string) {
  const input = parseInput(rawInput);
  const xs = findChars(input, "X");
  return findXmasCount(input, xs);
}

function part2(rawInput: string) {
  const input = parseInput(rawInput);
  const aChars = findChars(input, "A");
  return findMasXsCount(input, aChars);
}

run({
  part1: {
    tests: [
      {
        input: `..X...
.SAMX.
.A..A.
XMAS.S
.X....`,
        expected: 4,
      },
      {
        input: `
....XXMAS.
.SAMXMS...
...S..A...
..A.A.MS.X
XMASAMX.MM
X.....XA.A
S.S.S.S.SS
.A.A.A.A.A
..M.M.M.MM
.X.X.XMASX`,
        expected: 18,
      },
    ],
    solver: part1,
    solve: true,
  },
  part2: {
    tests: [
      {
        input: `
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
        expected: 9,
      },
    ],
    solver: part2,
    solve: true,
  },
  input: await getRawInput(),
  day: await getDay(),
});
