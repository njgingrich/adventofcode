import * as it from "iter-tools";
import * as path from "path";

import { readInputAsStrings, sum } from "../util";

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
        const zipped = it.toArray(it.zip(slice1, slice2));
    const s: number = sum(
      zipped.map(([start, dest]) => routes[start][dest]),
    );
    distances.push(s);
  }

  return Math.max(...distances);
}

export default async function run() {
  const input = await readInputAsStrings(path.join(__dirname, "./input.txt"));
  return solve(input);
}
