import * as it from "itertools";
import * as path from "path";

import { readInputAsStrings } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

type Range = [number, number];
type RangePair = [Range, Range];

// return true if one range overlaps the other,
function overlap(first: Range, second: Range) {
    const [fLower, fUpper] = first;
    const [sLower, sUpper] = second;
    return fUpper >= sLower && fLower <= sUpper;
}

// return an array of [[number, number], [number, number]] for each line
function parse(lines: string[]): RangePair[] {
    return lines.map((line) => {
        const [first, second] = line.split(",");
        const [fLower, fUpper] = first.split("-").map(Number);
        const [sLower, sUpper] = second.split("-").map(Number);
        return [
            [fLower, fUpper],
            [sLower, sUpper],
        ];
    });
}

function solve(lines: string[]) {
    const ranges = parse(lines);

    const containedRanges = ranges.filter(([first, second]) => {
        return overlap(first, second);
    });
    return containedRanges.length;
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH);
    return solve(input);
}
