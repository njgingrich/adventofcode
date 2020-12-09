import * as it from "iter-tools";
import * as path from "path";

import { readInputAsStrings, sum } from "../util";

type Bag = {
  color: string;
  canContain: Record<string, number>; // bag.color is key
};

function parse(line: string): Bag {
  const [colorPart, otherPart] = line.split(" contain ");
  const colorMatch = colorPart.match(/\w+\s\w+/);
  if (!colorMatch) throw new Error();

  const bag: Bag = { color: colorMatch[0], canContain: {} };

  const partsSplit = otherPart.split(", ");
  partsSplit.forEach((split) => {
    const parts = split.match(/(\d)\s(\w+\s\w+)/);
    if (!parts) return bag;

    const [_, count, color] = parts;
    bag.canContain[color] = Number(count);
  });

  return bag;
}

function sumOfBags(
  searchColor: string,
  bags: Record<string, Record<string, number>>,
): number {
    const canContain = bags[searchColor];
    if (Object.keys(canContain).length === 0) return 0;

    const sums = Object.entries(canContain).map(([color, count]) => {
        return count + (count * sumOfBags(color, bags));
    });
    const thisSum = sum(sums);

    return thisSum;
}

function solve(lines: string[], searchColor: string) {
  const bags = lines.map(parse).reduce<Record<string, Record<string, number>>>(
    (obj, val) => {
      obj[val.color] = val.canContain;
      return obj;
    },
    {},
  );

  return sumOfBags(searchColor, bags);
}

export default async function run() {
  const input = await readInputAsStrings(path.join(__dirname, "./input.txt"));
  return solve(input, "shiny gold");
}
