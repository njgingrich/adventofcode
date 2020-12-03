import * as it from "https://cdn.pika.dev/itertools@1.6.1";

async function readInput(): Promise<string[]> {
  const file = await Deno.readTextFile("./input.txt");
  return file.split("\n").filter(Boolean);
}

const places: Set<string> = new Set();
const routes: Record<string, Record<string, number>> = {};

function solve(lines: string[]) {
  lines.forEach((line) => {
    const [start, _, dest, __, distance] = line.split(" ");
    places.add(start);
    places.add(dest);

    if (!routes[start]) routes[start] = {};
    if (!routes[dest]) routes[dest] = {};
    routes[start][dest] = Number(distance);
    routes[dest][start] = Number(distance);
  });

  // console.log(routes);
  const distances: number[] = [];
  for (const p of it.permutations(places)) {
    if (!Array.isArray(p)) break;

    const slice1 = p.slice(0, p.length - 1);
    const slice2 = p.slice(1, p.length);
    const zipped: string[][] = it.zip(slice1, slice2);
    const sum: number = it.sum(
      zipped.map(([start, dest]) => routes[start][dest]),
    );
    distances.push(sum);
  }

  return Math.max(...distances);
}

const lines = await readInput();
console.log(solve(lines));

export {};
