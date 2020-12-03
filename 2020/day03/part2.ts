async function readInput(): Promise<string[]> {
  const file = await Deno.readTextFile("./input.txt");
  return file.split("\n").filter(Boolean);
}

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

function solve(lines: string[], slope: Slope) {
  const map = getMap(lines);
  const pos = { row: 1, col: 1 };
  let numTrees = 0;

  while (pos.row < map.length) {
    pos.row += slope.rows;
    pos.col += slope.cols;

    if (getMapCoord(pos.row, pos.col, map) === "#") numTrees++;
  }

  return numTrees;
}

const lines = await readInput();
const slopes = [
  { rows: 1, cols: 1 },
  { rows: 1, cols: 3 },
  { rows: 1, cols: 5 },
  { rows: 1, cols: 7 },
  { rows: 2, cols: 1 },
];

const results = slopes.map((slope) => {
  const trees = solve(lines, slope);
//   console.log(`Trees for [${slope.rows}, ${slope.cols}]: ${trees}`);
  return trees;
});

console.log(results.reduce((sum, val) => sum * val, 1));

export {};
