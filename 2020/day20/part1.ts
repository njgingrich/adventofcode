import * as it from "iter-tools";
import * as path from "path";

import { readInputAsStrings } from "../util";

type FourNumbers = [number, number, number, number];

type Tile = {
  id: number;
  lines: string[][];
  checksums: FourNumbers; // bit array in base10 for T R B L
  checksumsFlipped: FourNumbers; // same T R B L, but for horizontal flip
};

// binary str 010110100 to number
function toBinary(str: string): number {
  return Number.parseInt(str, 2);
}

function tileLineToBitstring(chars: string[]): number {
  const binString = chars
    .map((ch) => {
      if (ch === ".") return "0";
      if (ch === "#") return "1";
      return ch;
    })
    .join("");
  return toBinary(binString);
}

function parseTile(lines: string[]): Tile {
  const match = lines[0].match(/\d+/);
  if (!match) throw new Error();

  const tileLines = lines.slice(1).map((l) => l.split(""));
  const squareSize = tileLines.length;
  const checksums: FourNumbers = [-1, -1, -1, -1];
  const checksumsFlipped: FourNumbers = [-1, -1, -1, -1];

  const left = new Array<string>(squareSize).fill("");
  const right = new Array<string>(squareSize).fill("");
  for (let i = squareSize - 1; i >= 0; i--) {
    left[squareSize - 1 - i] = tileLines[i][0];
    right[squareSize - 1 - i] = tileLines[i][squareSize - 1];
  }

  // TOP
  checksums[0] = tileLineToBitstring(tileLines[0]);
  checksumsFlipped[0] = tileLineToBitstring(tileLines[0].reverse());
  // RIGHT
  checksums[1] = tileLineToBitstring(right);
  checksumsFlipped[1] = tileLineToBitstring(right.reverse());
  // BOTTOM
  checksums[2] = tileLineToBitstring(tileLines[squareSize - 1]);
  checksumsFlipped[2] = tileLineToBitstring(tileLines[squareSize - 1].reverse());
  // LEFT
  checksums[3] = tileLineToBitstring(left);
  checksumsFlipped[3] = tileLineToBitstring(left.reverse());

  return {
    id: Number(match[0]),
    lines: tileLines,
    checksums,
    checksumsFlipped,
  };
}

function matchesForTile(tile: Tile, tiles: Tile[]): Tile[] {
  return tiles.filter((t) => {
    if (t.id === tile.id) return false;
    if (tile.checksums.some((sum) => t.checksums.includes(sum) || t.checksumsFlipped.includes(sum))) return true;
    if (tile.checksumsFlipped.some((sum) => t.checksums.includes(sum) || t.checksumsFlipped.includes(sum))) return true;

    return false;
  });
}

function solve(lines: string[]) {
  const tiles = lines.map((line) => parseTile(line.split("\n")));

  const matches = tiles.reduce<Record<string, Tile[]>>((obj, t) => {
    obj[t.id] = matchesForTile(t, tiles)
    return obj;
  }, {});
  const corners = Object.entries(matches).filter(([id, tiles]) => {
    // Corners will only have two matches
    return tiles.length === 2;
  });
  return corners.reduce((prod, entry) => prod *= Number(entry[0]), 1);
}

export default async function run() {
  const input = await readInputAsStrings(
    path.join(__dirname, "./input.txt"),
    "\n\n"
  );
  return solve(input);
}
