import * as it from "itertools";
import * as path from "path";

import { readInputAsString } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

function parse(input: string[]) {
  const [template, ruleStrings] = input;

  const rules = new Map<string, string>();
  ruleStrings.split('\n').forEach(line => {
    let split = line.split(' -> ');
    rules.set(split[0], split[1]);
  });

  return {template, rules};
}

function step(template: string, rules: Map<string, string>) {
  const newTemplate = [];

  for (let i = 0; i < template.length - 1; i++) {
    const lookup = template.substring(i, i + 2);
    const element = rules.get(lookup);

    if (element) {
      newTemplate.push(template.charAt(i), element);
    }
  }
  newTemplate.push(template.charAt(template.length-1));
  return newTemplate.join('');
}

function count(template: string) {
  let map = new Map<string, number>();
  for (let ch of template) {
    map.set(ch, (map.get(ch) ?? 0) + 1);
  }

  let min = Infinity;
  let max = -Infinity;
  for (let val of map.values()) {
    min = Math.min(min, val);
    max = Math.max(max, val);
  }

  return max - min;
}

export default async function run() {
  const input = await readInputAsString(INPUT_PATH, '\n\n');

  const {template, rules} = parse(input);
  let output = template;
  for (let _ of it.range(0)) {
    output = step(output, rules);
  }
  return count(output);
}
