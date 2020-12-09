import * as it from "https://cdn.pika.dev/itertools@1.6.1";

async function readInput(): Promise<number[]> {
  const file = await Deno.readTextFile("./input.txt");
  return file.split("\n").filter(Boolean).map(Number);
}

function solve(lines: number[], preambleSize: number) {
  const numbers = lines.slice(0, preambleSize);
  let sums: number[] = [
    ...it.map(
      it.permutations(numbers, 2),
      (zip: string[]) => zip[0] + zip[1],
    ),
  ];

  for (let i = preambleSize; i < lines.length; i++) {
    const current = lines[i];
    // console.log(numbers);
    // console.log(sums);

    // check for fail
    if (!sums.includes(current)) return current;

    // sums is chunked into (n-1) size lists of sums
    // pop off the first (n-1) then push the next onto it
    sums = sums.slice((preambleSize - 1));

    numbers.shift();
    const nextSums = it.map(numbers, (num: number) => num + current);
    numbers.push(current);

    sums.push(...nextSums);
  }
}

const input = await readInput();
console.log(solve(input, 25));

export {};
