import * as it from "iter-tools";
import * as path from "path";

import { readInputAsStrings, sum } from "../util";

function parse(group: string) {
  const people = group.split('\n').join('').split('');
  return new Set(people).size;
}

function solve(lines: string[]) {
  return sum(lines.map(parse));
}

export default async function run() {
  const input = await readInputAsStrings(path.join(__dirname, "./input.txt"), "\n\n");
  return solve(input);
}

