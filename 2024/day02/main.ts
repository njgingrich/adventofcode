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

function parseInput(rawInput: string): number[][] {
  return rawInput.split("\n").filter(Boolean).map((line) => {
    return line.split(/\s+/).map(Number);
  });
}

function determineSafety(record: number[]): "safe" | "unsafe" {
  let prevDiff = 0;

  for (let i = 0; i < record.length - 1; i++) {
    const level = record[i];
    const nextLevel = record[i + 1];

    const diff = nextLevel - level;
    if (Math.abs(diff) > 3 || diff === 0) {
      return "unsafe";
    }

    if ((prevDiff < 0 && diff > 0) || (prevDiff > 0 && diff < 0)) {
      return "unsafe";
    }

    prevDiff = diff;
  }

  return "safe";
}

function part1(rawInput: string) {
  const input = parseInput(rawInput);

  return input.map((record) => determineSafety(record)).filter((result) =>
    result === "safe"
  ).length.toString();
}

function part2(rawInput: string) {
  const input = parseInput(rawInput);

  const results = input.map((record) => {
    const outcome = determineSafety(record);
    if (outcome === "safe") {
      return outcome;
    }

    // screw it - try all subsets
    const newRecords: number[][] = [];
    record.forEach((_, ix) => {
      const newRecord = [...record];
      newRecord.splice(ix, 1);
      newRecords.push(newRecord);
    });

    const newOutcomes = newRecords.map((newRecord) =>
      determineSafety(newRecord)
    );
    if (newOutcomes.some((newOutcome) => newOutcome === "safe")) {
      return { result: "safe" };
    } else {
      return { result: "unsafe" };
    }
  });
  return results.filter((result) => result === "safe").length.toString();
}

run({
  part1: {
    tests: [
      {
        input: `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
        expected: "2",
      },
    ],
    solver: part1,
    solve: false,
  },
  part2: {
    tests: [
      {
        input: `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
        expected: "4",
      },
    ],
    solver: part2,
    solve: true,
  },
  input: await getRawInput(),
  day: getDay(),
});
