import * as it from "https://cdn.pika.dev/itertools@1.6.1";

async function readInput(): Promise<string[]> {
  const file = await Deno.readTextFile("./input.txt");
  return file.split("\n").filter(Boolean);
}

type ParsedData = {
  from: string;
  toward: string;
  happiness: number;
};

function parseLine(line: string): ParsedData {
  const split = line.split(" ");
  return {
    from: split[0],
    toward: split[10].substring(0, split[10].length - 1),
    happiness: Number(split[3]) * (split[2] === "lose" ? -1 : 1),
  };
}

function getHappinessForOrdering(
  ordering: string[],
  sentiments: Record<string, Record<string, number>>,
) {
  let totalHappiness = 0;
  for (let i = 0; i < ordering.length; i++) {
    const towardIx = (i + 1) % ordering.length; // loop over to front
    const from = ordering[i];
    const toward = ordering[towardIx];

    totalHappiness += sentiments[from][toward];
    totalHappiness += sentiments[toward][from];
  }

  return totalHappiness;
}

function solve(lines: string[]) {
  const data = lines.map(parseLine);
  const people = new Set(data.map((d) => d.from));
  people.add("Me");
  const permutations: string[][] = it.permutations(people);

  const sentiments: Record<string, Record<string, number>> = {};
  sentiments["Me"] = {};
  data.forEach((row) => {
    if (!sentiments[row.from]) sentiments[row.from] = {};
    sentiments[row.from][row.toward] = row.happiness;
    sentiments[row.from]["Me"] = 0;
    sentiments["Me"][row.from] = 0;
  });

  return it.max(
    it.map(it.permutations(people), (permutation: string[]) =>
      getHappinessForOrdering(permutation, sentiments)),
  );
}

const input = await readInput();
console.log(solve(input));

export {};
