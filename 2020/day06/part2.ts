import * as it from "https://cdn.pika.dev/itertools@1.6.1";

async function readInput(): Promise<string[]> {
  const file = await Deno.readTextFile("./input.txt");
  return file.split("\n\n").filter(Boolean);
}

// deno-lint-ignore no-explicit-any
function intersection<T = any>(arr1: Array<T>, arr2: Array<T>): Array<T> {
  const set2 = new Set(arr2);
  return [...new Set(arr1)].filter((v) => set2.has(v));
}

function parse(group: string) {
  const people = group.split("\n").filter(Boolean);
  return people.map(el => el.split(''));
}

function solve(lines: string[]) {
  const groups = lines.map(parse);
  const intersect = groups.map(group => {
      return group.reduce((all, cur) => intersection(all, cur), group[0]);
  })
  return it.sum(intersect.map(arr => arr.length));
}

const input = await readInput();
console.log(solve(input));

export {};
