import * as path from "path";

import { readInputAsStrings } from "../util";

type BitField = number[];
type ZeroAndOnes = [number, number][];

function parse(lines: string[]): BitField[] {
  return lines.map((line) => {
    return line.split("").map(Number);
  });
}

function getZerosAndOnes(lines: BitField[]): ZeroAndOnes {
  let width = lines[0].length;

  let zerosAndOnesCount: ZeroAndOnes = Array.from({ length: width }, () => ([0, 0]));
  lines.forEach((line) => {
    line.forEach((bit, i) => {
      zerosAndOnesCount[i][bit] += 1;
    });
  });

  return zerosAndOnesCount;
}

function getOxygenRating(zerosAndOnes: ZeroAndOnes, lines: BitField[], ix = 0) {
  let mostCommonFirstBit = zerosAndOnes[ix][1] >= zerosAndOnes[ix][0] ? 1 : 0;
  let matching = lines.filter((line) => line[ix] === mostCommonFirstBit);

  while (matching.length > 1 && ix < lines[0].length) {
    matching = getOxygenRating(getZerosAndOnes(matching), matching, ix + 1);
  }

  return matching;
}

function getCo2Rating(zerosAndOnes: ZeroAndOnes, lines: BitField[], ix = 0) {
  let leastCommonFirstBit = zerosAndOnes[ix][1] >= zerosAndOnes[ix][0] ? 0 : 1;
  let matching = lines.filter((line) => line[ix] === leastCommonFirstBit);

  while (matching.length > 1 && ix < lines[0].length) {
    matching = getCo2Rating(getZerosAndOnes(matching), matching, ix + 1);
  }

  return matching;
}

function solve(lines: BitField[]) {
  let zerosAndOnesCount = getZerosAndOnes(lines);

  let oxygenRating = getOxygenRating(zerosAndOnesCount, lines)[0].join('');
  let co2Rating = getCo2Rating(zerosAndOnesCount, lines)[0].join('');

  return parseInt(oxygenRating, 2) * parseInt(co2Rating, 2);
}

export default async function run() {
  const input = await readInputAsStrings(path.join(__dirname, "./input.txt"));
  return solve(parse(input));
}
