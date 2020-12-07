import * as it from "https://cdn.pika.dev/itertools@1.6.1";

async function readInput(): Promise<string[]> {
  const file = await Deno.readTextFile("./input.txt");
  return file.split("\n\n").filter(Boolean);
}

function parse(group: string) {
  const people = group.split('\n').join('').split('');
  return new Set(people).size;
}

function solve(lines: string[]) {
  return it.sum(lines.map(parse));
}

const input = await readInput();
console.log(solve(input));

export {};
