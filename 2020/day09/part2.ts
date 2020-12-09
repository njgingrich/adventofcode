import * as it from "https://cdn.pika.dev/itertools@1.6.1";

async function readInput(): Promise<number[]> {
  const file = await Deno.readTextFile("./input.txt");
  return file.split("\n").filter(Boolean).map(Number);
}

function findWeakness(numbers: number[]) {
  return it.min(numbers) + it.max(numbers);
}

function solve(lines: number[], invalidNumber: number) {
  let numbers: number[] = [];

  let rearPtr = 1;

  for (let i = 0; i < lines.length; i++) {
    for (let k = rearPtr; k < lines.length; k++) {
      numbers = lines.slice(i, rearPtr);
      // console.log(`Looking at range [${i}, ${rearPtr}] = ${numbers}`);
      const sum = it.sum(numbers);

      // Move front pointer
      if (sum > invalidNumber) {
        break;
      } // Move rear pointer
      else if (sum < invalidNumber) {
        rearPtr += 1;
      } else if (sum === invalidNumber) {
        return findWeakness(numbers);
      }
    }
  }
}

const input = await readInput();
console.log(solve(input, 400480901));

export {};
