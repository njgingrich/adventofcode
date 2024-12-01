
import { run } from "aocrunner";

function getRawInput(): Promise<string> {
  return Deno.readTextFile("input.txt");
}

function getDay(): number {
  const module = import.meta.url;
  // TODO: use path.parse
  const parts = module.split("/");
  const dayString = parts.at(-1) ?? "";
  return Number(dayString.slice(-2));
}

function parseInput(rawInput: string): {left:number[], right:number[]} {
  const lines = rawInput.trim().split("\n");
  const left: number[] = [];
  const right: number[] = [];
  lines.forEach(line => {
    const [l, r] = line.split(/\s+/);
    left.push(Number(l));
    right.push(Number(r));
  });
  return {left, right};
}

function part1(rawInput: string) {
  const {left, right} = parseInput(rawInput);

  const leftSorted = left.slice().sort((a, b) => a - b);
  const rightSorted = right.slice().sort((a, b) => a - b);

  const sums = leftSorted.map((l, i) => Math.abs(l - rightSorted[i]));
  return sums.reduce((acc, curr) => acc + curr, 0).toString();
}

function part2(rawInput: string) {
  const {left, right} = parseInput(rawInput);

  const counts = left.map((el, i) => {
    const elCount = right.filter((rEl) => rEl === el).length;
    return el * elCount;
  });
  return counts.reduce((acc, curr) => acc + curr, 0).toString();
}

run({
  part1: {
    tests: [
      {
        input: `3   4
4   3
2   5
1   3
3   9
3   3`,
        expected: "11",
      },
    ],
    solver: part1,
    solve: true,
  },
  part2: {
    tests: [
      {
        input: `3   4
4   3
2   5
1   3
3   9
3   3`,
        expected: "31",
      },
    ],
    solver: part2,
    solve: true,
  },
  input: await getRawInput(),
  day: getDay(),
});
