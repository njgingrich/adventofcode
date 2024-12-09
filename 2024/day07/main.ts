import { run } from "aocrunner";
import { parse, SEPARATOR } from "@std/path";
import { roundrobin, repeat, sum } from 'itertools';

function getRawInput(): Promise<string> {
  return Deno.readTextFile("input.txt");
}

const OPS = ['*', '+' ];
const PART_2_OPS = ['*', '+', '||'];

function getDay(): number {
  // TODO: extract to util function we import
  const module = import.meta.url;
  const parsed = parse(module);
  const dayString = parsed.dir.split(SEPARATOR).pop() ?? "";
  return Number(dayString.slice(-2));
}

function parseInput(rawInput: string): ([number, number[]])[] {
  const list: [number, number[]][] = [];
  for (const line of rawInput.split("\n").filter(Boolean)) {
    const [total, nums] = line.split(": ");
    list.push([Number(total), nums.split(/\s+/).map(Number)]);
  }
  return list;
}

function multiply<T>(arr: T[], num: number): T[][] {
  const result: T[][] = [];
  for (arr of repeat(arr, num)) {
    result.push(arr);
  }

  return result;
}

function product<T>(...iterables: T[][]): T[][] {
  const result: T[][] = [];

  function generateCombinations(index: number, current: T[]): void {
    if (index === iterables.length) {
      result.push(current);
      return;
    }

    for (const item of iterables[index]) {
      generateCombinations(index + 1, [...current, item]);
    }
  }

  generateCombinations(0, []);
  return result;
}

function trySum(total: number, nums: number[], staticOps: string[]): number {
  const ops = [...product(...multiply(staticOps, nums.length - 1))];

  for (let opList of ops) {
    let sum = nums[0];
    for (let i = 0; i < opList.length; i++) {
      const op = opList[i];
      const next = nums[i + 1];
      if (op === "+") {
        sum += next;
      } else if (op === "*") {
        sum *= next;
      } else if (op === "||") {
        sum = Number(`${sum}${next}`);
      }
    }
    // const equation = [...roundrobin(nums.map(String), opList)].join(" ");
    // console.log({equation, sum});

    if (sum === total) {
      return sum;
    }
  }

  return 0;
}

function part1(rawInput: string) {
  const input = parseInput(rawInput);
  return sum(input.map(([total, nums]) => {
    return trySum(total, nums, OPS);
  }));
}

function part2(rawInput: string) {
  const input = parseInput(rawInput);

  return sum(input.map(([total, nums]) => {
    return trySum(total, nums, PART_2_OPS);
  }));
}

run({
  part1: {
    tests: [
      {
        input: `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`,
        expected: 3749,
      },
    ],
    solver: part1,
    solve: true,
  },
  part2: {
    tests: [
      {
        input: `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`,
        expected: 11387,
      },
      {
        input: `100: 10 10 4
4: 2 2 100`,
        expected: 0,
      },
      {
        input: `1460: 9 5 3 9 7 9 4`,
        expected: 1460,
      },
      {
        input: `1460: 8 78 3 36 2 1 794`,
        expected: 1460,
      }
    ],
    solver: part2,
    solve: true,
  },
  input: await getRawInput(),
  day: getDay(),
});
