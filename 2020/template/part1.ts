import * as it from "https://cdn.pika.dev/itertools@1.6.1";

async function readInput(): Promise<string[]> {
  const file = await Deno.readTextFile("./input.txt");
  return file.split("\n").filter(Boolean);
}

function solve(lines: string[]) {
  return lines;
}

const input = await readInput();
console.log(solve(input));

export {};
