import * as it from "itertools";
import * as _ from "lodash";
import * as path from "path";

import { readInputAsStrings } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

type ChunkOpenType = "{" | "[" | "(" | "<";
type ChunkCloseType = "}" | "]" | ")" | ">";
type ChunkType = ChunkOpenType | ChunkCloseType;
type Name = "brace" | "bracket" | "paren" | "angle";

const sumMap = {
  "brace": 3,
  "bracket": 2,
  "paren": 1,
  "angle": 4,
};

const typeMap: Record<ChunkType, Name> = {
  "{": "brace",
  "}": "brace",
  "[": "bracket",
  "]": "bracket",
  "(": "paren",
  ")": "paren",
  "<": "angle",
  ">": "angle",
};

function solve(lines: string[]) {
  const inputs = lines.map((l) => l.split("")) as ChunkType[][];
  const incompleted: Name[][] = [];

  inputs.forEach((line) => {
    let stack: Name[] = [];

    for (let char of line) {
      if (["}", "]", ")", ">"].includes(char)) {
        let top = stack.pop();
        if (top !== typeMap[char]) {
          return false;
        }
      } else {
        stack.push(typeMap[char]);
      }
    }

    incompleted.push(stack);
  });

  const scores = incompleted.map(stack => {
    return stack.reverse().reduce((sum, cur) => {
      return sum * 5 + sumMap[cur];
    }, 0);
  });
  scores.sort((a,b) => a-b);

  return scores[Math.floor(scores.length / 2)];
}

export default async function run() {
  const input = await readInputAsStrings(INPUT_PATH);
  return solve(input);
}
