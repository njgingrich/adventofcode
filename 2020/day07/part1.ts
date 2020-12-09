import * as it from "iter-tools";
import * as path from "path";

import { readInputAsStrings } from "../util";

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

function canHoldBags(
  searchColor: string | undefined,
  bags: Record<string, Record<string, number>>,
): string[] {
  if (!searchColor) return [];

  const toReturn: string[] = [];
  Object.entries(bags).forEach(([color, canContain]) => {
    if (Object.keys(canContain).includes(searchColor)) {
      toReturn.push(color);
    }
  });

  return toReturn;
}

function solve(lines: string[], searchColor: string) {
  const bags = lines.map(parse).reduce<Record<string, Record<string, number>>>(
    (obj, val) => {
      obj[val.color] = val.canContain;
      return obj;
    },
    {},
  );

  const validContainers: string[] = [];
  const toSearch = [searchColor];

  while (toSearch.length > 0) {
    const search = toSearch.shift();

    const found = canHoldBags(search, bags);
    validContainers.push(...found);
    toSearch.push(...found);
  }

  Object.entries(bags).forEach(([color, canContain]) => {
    if (Object.keys(canContain).includes(searchColor)) {
      validContainers.push(color);
    }
  });

  return new Set(validContainers).size;
}

export default async function run() {
  const input = await readInputAsStrings(path.join(__dirname, "./input.txt"));
  return solve(input, "shiny gold");
}

