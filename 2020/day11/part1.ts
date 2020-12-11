import * as it from "iter-tools";
import * as path from "path";

import { readInputAsStrings } from "../util";

const S = {
  Empty: 'L',
  Occupied: '#',
  Floor: '.',
}

function getAdjacentSeats(area: string[][], row: number, col: number): string[] {
  const seats = [];
  for (let r = Math.max(0, row-1); r <= Math.min(area.length - 1, row+1); r++) {
    for (let c = Math.max(0, col-1); c <= Math.min(area[0].length - 1, col+1); c++) {
      if (r === row && c === col) continue; // skip the same seat
      seats.push(area[r][c]);
    }
  }

  return seats;
}

// If 0 adjacent seats to board[row][col], return true
function isClear(seats: string[], row: number, col: number) {
  return seats.every(s => s !== S.Occupied);
}

// If 4+ adjacent seats to board[row][col], return true
function isCrowded(seats: string[], row: number, col: number) {
  return seats.filter((s) => s === S.Occupied).length >= 4;
}

function countOccupied(area: string[][]) {
  return area.reduce((sum, row) => {
    return sum + row.reduce((sum, cell) => sum + (cell === S.Occupied ? 1 : 0), 0)
  }, 0);
}

function update(area: string[][]) {
  const newArea = new Array(area.length).fill(0).map(() => new Array<string>(area[0].length).fill(''));
  let changes = 0;

  for (let r = 0; r < area.length; r++) {
    for (let c = 0; c < area[0].length; c++) {
      const seat = area[r][c];
      const adjacentSeats = getAdjacentSeats(area, r, c);
      // console.log(`Seat at area[${r}][${c}] = ${seat}`);

      if (seat === S.Empty && isClear(adjacentSeats, r, c)) {
        changes += 1;
        newArea[r][c] = S.Occupied;
      } else if (seat === S.Occupied && isCrowded(adjacentSeats, r, c)) {
        changes += 1;
        newArea[r][c] = S.Empty;
      } else {
        newArea[r][c] = area[r][c];
      }
    }
  }

  return { area: newArea, changes };
}

function solve(lines: string[]) {
  let area = lines.map(l => l.split(''));
  let changes = 1;

  while (changes !== 0) {
    const result = update(area);
    area = result.area;
    changes = result.changes;
  }

  return countOccupied(area);
}

export default async function run() {
  const input = await readInputAsStrings(path.join(__dirname, "./input.txt"));
  return solve(input);
}
