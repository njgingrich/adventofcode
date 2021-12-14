import * as it from "itertools";
import * as path from "path";

import { readInputAsString } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

function parse(input: string[]) {
  const [template, ruleStrings] = input;

  // NN -> 0 for now
  const pairs = new Map<string, number>();
  const rules = new Map<string, string>();
  ruleStrings.split("\n").forEach((line) => {
    let split = line.split(" -> ");
    rules.set(split[0], split[1]);
    pairs.set(split[0], 0);
  });

  // NN -> 0 for now
  for (let i = 0; i < template.length - 1; i++) {
    const lookup = template.substring(i, i + 2);
    pairs.set(lookup, (pairs.get(lookup) ?? 0) + 1);
  }

  return { template, pairs, rules };
}

function getPairs(template: string, rules: Map<string, string>) {
  const pairs = new Map<string, number>();
  for (let k of rules.keys()) {
    pairs.set(k, 0);
  }

  for (let i = 0; i < template.length - 1; i++) {
    const lookup = template.substring(i, i + 2);
    pairs.set(lookup, (pairs.get(lookup) ?? 0) + 1);
  }
  return pairs;
}

function step(pairs: Map<string, number>, rules: Map<string, string>): Map<string, number> {
  const newPairs = new Map(pairs);
  for (let key of pairs.keys()) {
    newPairs.set(key, 0);
  };

  for (let [key, val] of pairs.entries()) {
    if (val === 0) continue;

    const element = rules.get(key);
    if (!element) throw new Error(`expected element ${key}`);

    const newPairLeft = `${key[0]}${element}`;
    const newPairRight = `${element}${key[1]}`;
    newPairs.set(newPairLeft, (newPairs.get(newPairLeft) ?? 0) + val);
    newPairs.set(newPairRight, (newPairs.get(newPairRight) ?? 0) + val);
  }
  return newPairs;
}

function count(pairs: Map<string, number>, startingTemplate: string) {
  let map = new Map<string, number>();
  for (let [key, val] of pairs.entries()) {
    if (val === 0) continue;
    map.set(key[0], (map.get(key[0]) ?? 0) + val);
    map.set(key[1], (map.get(key[1]) ?? 0) + val);
  }
  // We also have to set the start + end to +1, for when we halve them later
  const lastIx = startingTemplate.length - 1;
  map.set(startingTemplate[0], (map.get(startingTemplate[0]) ?? 0) + 1);
  map.set(startingTemplate[lastIx], (map.get(startingTemplate[lastIx]) ?? 0) + 1);

  let min = Infinity;
  let max = -Infinity;
  for (let val of map.values()) {
    min = Math.min(min, val / 2);
    max = Math.max(max, val / 2);
  }

  return max - min;
}

export default async function run() {
  const input = await readInputAsString(INPUT_PATH, "\n\n");

  let { template, pairs, rules } = parse(input);
  for (let _ of it.range(40)) {
    pairs = step(pairs, rules);
  }
  return count(pairs, template);
}
