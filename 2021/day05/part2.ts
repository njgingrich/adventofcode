import * as path from "path";

import { readInputAsStrings } from "../util";

type Coord = [number, number];
// x1,y1 => x2,y2
type CoordPair = [Coord, Coord];

// Map of vents along the sea floor. Top left corner is (0, 0).
class VentMap {
  width: number;
  height: number;
  grid: number[][];

  constructor(input: CoordPair[]) {
    this.width =
      input.reduce((val, cur) => {
        return Math.max(val, cur[0][0], cur[1][0]);
      }, 0) + 1;
    this.height =
      input.reduce((val, cur) => {
        return Math.max(val, cur[0][1], cur[1][1]);
      }, 0) + 1;

    this.grid = new Array(this.height).fill(false).map(() => {
      return new Array(this.width).fill(0);
    });

    input.forEach((input) => {
      this.getCoordsForPairs(input).forEach(([x, y]) => {
        this.grid[y][x] += 1;
      });
    });
  }

  // 1,4 -> 1,1 we want 1,4 : 1,3 : 1,2 : 1,1
  // 9,7 -> 7,9 we want 9,7 : 8,8 : 7,9
  getCoordsForPairs(input: CoordPair): Coord[] {
    const x1 = Math.min(input[0][0], input[1][0]);
    const x2 = Math.max(input[0][0], input[1][0]);
    const y1 = Math.min(input[0][1], input[1][1]);
    const y2 = Math.max(input[0][1], input[1][1]);
    // console.log({ x1, x2, y1, y2 });

    let pairs: Coord[] = [];

    // console.log(`[[${x1}, ${y1}], [${x2}, ${y2}]]`);
    if (x1 === x2) {
      for (let y = y1; y <= y2; y++) {
        pairs.push([x1, y]);
      }
    } else if (y1 === y2) {
      for (let x = x1; x <= x2; x++) {
        pairs.push([x, y1]);
      }
    } else {
      // get matching y1 from x1, opposite for y2
      let y = x1 === input[0][0] ? input[0][1] : input[1][1];
      let y2 = x1 === input[0][0] ? input[1][1] : input[0][1];

      for (let x = x1; x <= x2; x++) {
        pairs.push([x, y]);
        y < y2 ? y++ : y--;
      }
    }

    return pairs;
  }

  getOverlapsCount() {
    let sum = 0;

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.grid[y][x];
        if (cell > 1) {
          sum++;
        }
      }
    }

    return sum;
  }

  print() {
    console.log(
      `  ${new Array(this.width)
        .fill(0)
        .map((_, i) => i)
        .join(" ")}`
    );
    for (let r = 0; r < this.height; r++) {
      let str = `${r}`;
      for (let c = 0; c < this.height; c++) {
        const cell = this.grid[r][c];
        str += ` ${cell === 0 ? "." : `${cell}`}`;
      }
      console.log(str);
    }
  }
}

function parse(lines: string[]): CoordPair[] {
  return lines.map((line) => {
    const [left, right] = line.split(/\s+->\s+/);
    const leftCoords = left.split(",").map(Number) as Coord;
    const rightCoords = right.split(",").map(Number) as Coord;

    const pair = [leftCoords, rightCoords] as CoordPair;
    return pair;
  });
}

function solve(lines: string[]) {
  const pairs = parse(lines);
  const map = new VentMap(pairs);
  // console.log(map.print());

  return map.getOverlapsCount();
}

export default async function run() {
  const input = await readInputAsStrings(path.join(__dirname, "./input.txt"));
  return solve(input);
}
