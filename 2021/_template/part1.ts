import * as it from "iter-tools";
import * as path from "path";

import { readInputAsStrings } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

function parse(lines: string[]) {
  return lines;
}

function solve(lines: string[]) {
  const parsed = parse(lines);
  return parsed;
}

export default async function run() {
  const input = await readInputAsStrings(INPUT_PATH);
  return solve(input);
}
