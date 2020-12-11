import * as it from "iter-tools";
import * as path from "path";

import { readInputAsStrings } from "../util";

const S = {
  Empty: 'L',
  Occupied: '#',
  Floor: '.',
}

function getNearestVisibleSeats(area: string[][], row: number, col: number): string[] {
  const seats: string[] = [];
  const directions = [
    { name: "N", found: false, offset: [-1, 0] },
    { name: "NE", found: false, offset: [-1, +1] },
    { name: "E", found: false, offset: [0, +1] },
    { name: "SE", found: false, offset: [+1, +1] },
    { name: "S", found: false, offset: [+1, 0] },
    { name: "SW", found: false, offset: [+1, -1] },
    { name: "W", found: false, offset: [0, -1] },
    { name: "NW", found: false, offset: [-1, -1] },
  ];

  function trySeat(row: number, col: number) {
    // Say we've found it if we hit the boundaries so we stop checking
    if (row < 0 || row >= area.length || col < 0 || col >= area[0].length) return true;

    let seat = area[row][col];
    if (seat === S.Occupied || seat === S.Empty) {
      seats.push(seat);
      return true;
    }

    return false;
  }

  for (let i = 1; i < Math.max(area.length, area[0].length); i++) {
    // Stop iterating if we've found everything
    if (directions.map(d => d.found).every(Boolean)) break;

    for (let dir of directions) {
      if (!dir.found) dir.found = trySeat(row + (i * dir.offset[0]), col + (i * dir.offset[1]));
    }
  }

  return seats;
}

// If 0 adjacent seats to board[row][col], return true
function isClear(seats: string[], row: number, col: number) {
  return seats.every(s => s !== S.Occupied);
}

// If 5+ adjacent seats to board[row][col], return true
function isCrowded(seats: string[], row: number, col: number) {
  return seats.filter((s) => s === S.Occupied).length >= 5;
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
      const adjacentSeats = getNearestVisibleSeats(area, r, c);

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
