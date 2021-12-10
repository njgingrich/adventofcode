import * as it from "itertools";
import { chunk } from "lodash";
import * as path from "path";

import { readInputAsStrings, nonNullable } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

type ChunkOpenType = "{" | "[" | "(" |"<";
type ChunkCloseType = "}" | "]" | ")" | ">";
type ChunkType = ChunkOpenType | ChunkCloseType;
type Name = 'brace' | 'bracket' | 'paren' | 'angle';

const sumMap = {
  "}": 1197,
  "]": 57,
  ")": 3,
  ">": 25137,
};

const typeMap: Record<ChunkType, Name> = {
  "{": 'brace',
  "}": 'brace',
  "[": 'bracket',
  "]": 'bracket',
  "(": 'paren',
  ")": 'paren',
  "<": 'angle',
  ">": 'angle',
};

function solve(lines: string[]) {
  const inputs = lines.map((l) => l.split("")) as ChunkType[][];

  return it.sum(
    inputs
      .map((line) => {
        let chunks: Name[] = [];

        for (let char of line) {
          if (["}", "]", ")", ">"].includes(char)) {
            let top = chunks.pop();
            if (top !== typeMap[char]) {
              return char as ChunkCloseType;
            }
          } else {
            chunks.push(typeMap[char]);
          }
        }

        return undefined;
      })
      .filter(nonNullable)
      .map(v => sumMap[v])
    );
}

export default async function run() {
  const input = await readInputAsStrings(INPUT_PATH);
  return solve(input);
}
