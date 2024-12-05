import { run } from "aocrunner";
import { parse, SEPARATOR } from "@std/path";

function getRawInput(): Promise<string> {
  return Deno.readTextFile("input.txt");
}

function getDay(): number {
  // TODO: extract to util function we import
  const module = import.meta.url;
  const parsed = parse(module);
  const dayString = parsed.dir.split(SEPARATOR).pop() ?? "";
  return Number(dayString.slice(-2));
}

function parseInput(
  rawInput: string,
): { rules: number[][]; updates: number[][] } {
  const [rules, nums] = rawInput.split("\n\n");
  const rulesList = rules.split("\n").map((rule) => {
    return rule.split("|").map(Number);
  });

  const updatesList = nums.split("\n").map((line) => {
    return line.split(",").map(Number);
  });

  return {
    rules: rulesList,
    updates: updatesList,
  };
}

function findInvalidIndex(
  list: number[],
  num: number,
  map: Map<number, number[]>,
): number | undefined {
  for (let i = 0; i < list.length; i++) {
    const el = list[i];

    if (el === num) continue;
    if (!map.has(el)) continue;
    if (!map.get(el)?.includes(num)) return i;
  }
}

function isValidUpdate(
  update: number[],
  beforeMap: Map<number, number[]>,
  afterMap: Map<number, number[]>,
): boolean {
  for (let i = 0; i < update.length - 1; i++) {
    let num = update[i];
    let befores = update.slice(0, i + 1);
    let afters = update.slice(i);

    if (findInvalidIndex(befores, num, beforeMap) !== undefined) return false;
    if (findInvalidIndex(afters, num, afterMap) !== undefined) return false;
  }

  return true;
}

function findInvalidIndexes(
  update: number[],
  beforeMap: Map<number, number[]>,
  afterMap: Map<number, number[]>,
) {
  const invalidBefore: number[] = [];
  const invalidAfter: number[] = [];
  for (let i = 0; i < update.length - 1; i++) {
    let num = update[i];
    let befores = update.slice(0, i + 1);
    let afters = update.slice(i);

    let invalidIx = findInvalidIndex(befores, num, beforeMap);
    if (invalidIx !== undefined) {
      console.log("adding to invalidBefore", invalidIx);
      invalidBefore.push(invalidIx);
    }
    invalidIx = findInvalidIndex(afters, num, afterMap);
    if (invalidIx !== undefined) {
      console.log("adding to invalidAfter", i);
      invalidAfter.push(i);
    }
  }

  return { before: invalidBefore, after: invalidAfter };
}

function getMiddleElement(arr: number[]): number {
  return arr[Math.floor(arr.length / 2)];
}

function getMaps(
  rules: number[][],
): { beforeMap: Map<number, number[]>; afterMap: Map<number, number[]> } {
  // Key is rule number, value is list of numbers it must be before
  // AKA 43|17 would be inserted as { 43: [17]}, as 43 must come before 17
  const beforeMap = new Map<number, number[]>();
  // Key is rule number, value is list of numbers it must be after
  // AKA 75|47 would be inserted as { 47: [75]}, as 47 must come after 75
  const afterMap = new Map<number, number[]>();

  for (const rule of rules) {
    const [before, after] = rule;
    if (!beforeMap.has(before)) {
      beforeMap.set(before, []);
    }
    if (!afterMap.has(after)) {
      afterMap.set(after, []);
    }

    beforeMap.get(before)?.push(after);
    afterMap.get(after)?.push(before);
  }

  return { beforeMap, afterMap };
}

function getAlternatives(update: number[], invalidIx: number) {
  const alternatives: number[][] = [];
  const updateWithout = [...update];
  updateWithout.splice(invalidIx, 1);

  for (let i = 0; i < update.length; i++) {
    if (i === invalidIx) continue;
    const newUpdate = [...updateWithout];
    newUpdate.splice(i, 0, update[invalidIx]);
    alternatives.push(newUpdate);
  }

  return alternatives;
}

function buildUpdate(
  update: number[],
  beforeMap: Map<number, number[]>,
  afterMap: Map<number, number[]>,
) {
  /**
   * We can determine the correct order of the list by looking at how many elements each number
   * must come before, and how many it must come after. Then we can sort by that score.
   * (Probably can insert into a presized array or something too but this works!)
   * 
   * Example: Given [97,13,75,29,47] and the maps:
   * beforeMap: {
   *   47 => [ 53, 13, 61, 29 ],
   *   97 => [ 13, 61, 47, 29, 53, 75 ],
   *   75 => [ 29, 53, 47, 61, 13 ],
   *   61 => [ 13, 53, 29 ],
   *   29 => [ 13 ],
   *   53 => [ 29, 13 ]
   * },
   * afterMap: {
   *   53 => [ 47, 75, 61, 97 ],
   *   13 => [ 97, 61, 29, 47, 75, 53 ],
   *   61 => [ 97, 47, 75 ],
   *   47 => [ 97, 75 ],
   *   29 => [ 75, 97, 53, 61, 47 ],
   *   75 => [ 97 ]
   * }
   *
   * look at 97 - [        ] before 13, before 75, before 29, before 47 -> 0 - 4 =  4
   * look at 13 - after 97,  [        ] after 75,  after 29,  after 47  -> 4 - 0 = -4
   * look at 75 - after 97,  before 13, [        ] before 29, before 47 -> 1 - 3 = -2
   * look at 29 - after 75,  before 13, after 75,  [        ] after 47  -> 3 - 1 =  2
   * look at 47 - after 97,  before 13, after 75,  before 29, [       ] -> 2 - 2 =  0
  */

  const scores = new Map<number, number>();

  for (let i = 0; i < update.length; i++) {
    const num = update[i];
    const remaining = update.filter((n) => n !== num);

    const beforeCount = beforeMap.get(num)?.filter((n) => remaining.includes(n)).length ?? 0;
    const afterCount = afterMap.get(num)?.filter((n) => remaining.includes(n)).length ?? 0;
    scores.set(num, afterCount - beforeCount);
  }

  return update.sort((a, b) => (scores.get(a) ?? 0) - (scores.get(b) ?? 0));
}

function part1(rawInput: string) {
  const { rules, updates } = parseInput(rawInput);
  const { beforeMap, afterMap } = getMaps(rules);

  return updates.map((update) =>
    isValidUpdate(update, beforeMap, afterMap) ? getMiddleElement(update) : 0
  ).reduce((acc, val) => acc + val, 0);
}

function part2(rawInput: string) {
  const { rules, updates } = parseInput(rawInput);
  const { beforeMap, afterMap } = getMaps(rules);

  const invalidUpdates = updates.filter((u) => !isValidUpdate(u, beforeMap, afterMap));

  return invalidUpdates.map(
    (u) => buildUpdate(u, beforeMap, afterMap),
  ).map(
    (u) => getMiddleElement(u),
  ).reduce((acc, val) => acc + val, 0);
}

run({
  part1: {
    tests: [
      {
        input: `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
        expected: 143,
      },
    ],
    solver: part1,
    solve: true,
  },
  part2: {
    tests: [
      {
        input: `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
        expected: 123,
      },
    ],
    solver: part2,
    solve: true,
  },
  input: await getRawInput(),
  day: await getDay(),
});
