import * as it from "iter-tools";
import * as path from "path";

import { readInputAsStrings } from "../util";

/*
  0:      1:      2:      3:      4:
 aaaa    ....    aaaa    aaaa    ....
b    c  .    c  .    c  .    c  b    c
b    c  .    c  .    c  .    c  b    c
 ....    ....    dddd    dddd    dddd
e    f  .    f  e    .  .    f  .    f
e    f  .    f  e    .  .    f  .    f
 gggg    ....    gggg    gggg    ....

  5:      6:      7:      8:      9:
 aaaa    aaaa    aaaa    aaaa    aaaa
b    .  b    .  .    c  b    c  b    c
b    .  b    .  .    c  b    c  b    c
 dddd    dddd    ....    dddd    dddd
.    f  e    f  .    f  e    f  .    f
.    f  e    f  .    f  e    f  .    f
 gggg    gggg    ....    gggg    gggg

  aaaa
 b    c
 b    c
  dddd
 e    f
 e    f
  gggg

 Segments -> numbers:
 0  ->  n/a
 1  ->  n/a
 2  ->  1
 3  ->  7
 4  ->  4
 5  ->  2, 3, 5
 6  ->  0, 6, 9
 7  ->  8
*/

const INPUT_PATH = path.join(__dirname, "./input.txt");

type Segment = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';

// 10 unique patterns that correspond to unique digits, then 4 digits of output
function parse(lines: string[]) {
  return lines.map(line => {
    let [patternsString, outputsString] = line.split(/\s+\|\s+/);
    let patterns = patternsString.split(/\s+/);
    let outputs = outputsString.split(/\s+/);

    return {
      patterns: patterns.map((p) => p.split("").sort()) as Segment[][],
      outputs: outputs.map((o) => o.split("").sort()) as Segment[][],
    };
  });
}

function solve(lines: string[]) {
  const parsed = parse(lines);
  let count = 0;

  parsed.forEach(({ patterns, outputs }) => {
    for (let pattern of outputs) {
      if (pattern.length === 2 || pattern.length === 3 || pattern.length === 4 || pattern.length === 7) {
        count += 1;
      }
    }
  });

  return count;
}

export default async function run() {
  const input = await readInputAsStrings(INPUT_PATH);
  return solve(input);
}
