import * as it from "iter-tools";
import * as path from "path";

import { readInputAsStrings } from "../util";

type BitField = number[];

function parse(lines: string[]): BitField[] {
  return lines.map(line => {
    return line.split('').map(Number);
  });
}

function solve(lines: BitField[]) {
  let width = lines[0].length;

  let zerosAndOnesCount = Array.from({ length: width }, () => ({ zero: 0, one: 0 }));
  lines.forEach(line => {
    line.forEach((bit, i) => {
      zerosAndOnesCount[i][bit === 0 ? 'zero' : 'one'] += 1;
    });
  });

  let gammaStr = zerosAndOnesCount.reduce(
    (str, cur) => (cur.zero > cur.one ? `${str}0` : `${str}1`),
    ""
  );
  let epsilonStr = zerosAndOnesCount.reduce(
    (str, cur) => (cur.zero > cur.one ? `${str}1` : `${str}0`),
    ""
  );
  
  return parseInt(gammaStr, 2) * parseInt(epsilonStr, 2);
}

export default async function run() {
  const input = await readInputAsStrings(path.join(__dirname, "./input.txt"));
  return solve(parse(input));
}
