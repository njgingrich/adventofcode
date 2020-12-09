import * as it from "iter-tools";
import * as path from "path";

import { readInputAsStrings, sum } from "../util";

function requiredpaper(l: number, w: number, h: number): number {
    const surfaceArea = 2 * ((l * w) + (w * h) + (h * l));
    const smallestArea = Math.min((l * w), (w * h), (h * l));
    return surfaceArea + smallestArea;
}

function solve(lines: string[]) {
    return sum(lines.map(line => {
        const [l, w, h] = line.split('x').map(n => Number(n));
        return requiredpaper(l, w, h);
    }))
}

export default async function run() {
  const input = await readInputAsStrings(path.join(__dirname, "./input.txt"));
  return solve(input);
}
