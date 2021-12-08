import * as it from "iter-tools";
import * as path from "path";
import * as _ from "lodash";

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

type Segment = "a" | "b" | "c" | "d" | "e" | "f" | "g";

// 10 unique patterns that correspond to unique digits, then 4 digits of output
function parse(lines: string[]) {
  return lines.map((line) => {
    let [patternsString, outputsString] = line.split(/\s+\|\s+/);
    let patterns = patternsString.split(/\s+/);
    let outputs = outputsString.split(/\s+/);

    return {
      patterns: patterns.map((p) => p.split("").sort()) as Segment[][],
      outputs: outputs.map((o) => o.split("").sort()) as Segment[][],
    };
  });
}

function getPatternsForDigits(patterns: Segment[][]): Segment[][] {
  let patternForDigit: Segment[][] = Array.from({ length: 10 })
    .fill([])
    .map((_) => []);

  let sixLengthPatterns: Segment[][] = []; // 2, 3, 5
  let fiveLengthPatterns: Segment[][] = []; // 0, 6, 9

  for (let pattern of patterns) {
    if (pattern.length === 2) {
      patternForDigit[1] = pattern;
    } else if (pattern.length === 3) {
      patternForDigit[7] = pattern;
    } else if (pattern.length === 4) {
      patternForDigit[4] = pattern;
    } else if (pattern.length === 5) {
      fiveLengthPatterns.push(pattern);
    } else if (pattern.length === 6) {
      sixLengthPatterns.push(pattern);
    } else if (pattern.length === 7) {
      patternForDigit[8] = pattern;
    }
  }

  // for 0,6,9, all have (f) but only 6 does not have (c)
  // so find from the set of 6 lengths the one that does not have both from the onePattern
  const sixPattern = sixLengthPatterns.find((pattern) => {
    const hasBoth =
      pattern.find((p) => p === patternForDigit[1][0]) &&
      pattern.find((p) => p === patternForDigit[1][1]);
    return !hasBoth;
  }) as Segment[];
  patternForDigit[6] = sixPattern;

  let cSegment: Segment;
  let fSegment: Segment;
  // we can get c and f from A, B (the onePattern)
  // if 6-pattern contains patternForDigit[1][0], then [f, c] === patternForDigit[1] (6 doesnt have c)
  // else, [c, f] = patternForDigit[1]
  if (sixPattern.includes(patternForDigit[1][0])) {
    [fSegment, cSegment] = patternForDigit[1];
  } else {
    [cSegment, fSegment] = patternForDigit[1];
  }

  // 5 is the 5-length that has (f) but not (c)
  let fivePattern = fiveLengthPatterns.find((pattern) => {
    return !pattern.includes(cSegment) && pattern.includes(fSegment);
  }) as Segment[];
  // 2 is the 5-length that has (c) but not (f)
  let twoPattern = fiveLengthPatterns.find((pattern) => {
    return pattern.includes(cSegment) && !pattern.includes(fSegment);
  }) as Segment[];
  // 3 is the 5-length that has both
  let threePattern = fiveLengthPatterns.find((pattern) => {
    return pattern.includes(cSegment) && pattern.includes(fSegment);
  }) as Segment[];
  patternForDigit[5] = fivePattern;
  patternForDigit[2] = twoPattern;
  patternForDigit[3] = threePattern;

  // (e) is the odd one out from 5 and 6
  let eSegment = _.difference(sixPattern, fivePattern)[0];

  // we can get 9 from comparing 0,6,9
  // 9 is the 6-length that does not have (e) (G in this example)
  let ninePattern = sixLengthPatterns.find((pattern) => {
    return !pattern.find((p) => p === eSegment);
  }) as Segment[];
  // 0 is the remaining 6-length
  let zeroPattern = sixLengthPatterns.find((pattern) => {
    return !_.isEqual(pattern, sixPattern) && !_.isEqual(pattern, ninePattern);
  }) as Segment[];
  patternForDigit[0] = zeroPattern;
  patternForDigit[9] = ninePattern;

  return patternForDigit;
}

function solve(lines: string[]) {
  const parsed = parse(lines);

  const outputs = parsed.map(({ patterns, outputs }) => {
    const patternForDigit = getPatternsForDigits(patterns);
    const output = outputs.map((pattern) => {
      return patternForDigit.findIndex((digitPattern) =>
        _.isEqual(digitPattern, pattern)
      );
    });

    return output[0] * 1000 + output[1] * 100 + output[2] * 10 + output[3];
  });

  return _.sum(outputs);
}

export default async function run() {
  const input = await readInputAsStrings(INPUT_PATH);
  return solve(input);
}
