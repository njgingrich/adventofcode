import * as it from "iter-tools";
import * as path from "path";

import { intersection, readInputAsStrings, sum } from "../util";

function parse(group: string) {
  const people = group.split("\n").filter(Boolean);
  return people.map(el => el.split(''));
}

function solve(lines: string[]) {
  const groups = lines.map(parse);
  const intersect = groups.map(group => {
      return group.reduce((all, cur) => intersection(all, cur), group[0]);
  })
  return sum(intersect.map(arr => arr.length));
}

export default async function run() {
  const input = await readInputAsStrings(
    path.join(__dirname, "./input.txt"),
    "\n\n"
  );
  return solve(input);
}
