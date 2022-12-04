import * as it from "itertools";
import * as path from "path";

import { readInputAsStrings } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

type Range = [number, number];
type RangePair = [Range, Range];

// return true if first contains the second range,
// for example, [2,8] contains [3,7], and [4,6] contains [6,6]
function contains(first: Range, second: Range) {
    const [fLower, fUpper] = first;
    const [sLower, sUpper] = second;
    return fLower <= sLower && fUpper >= sUpper;
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
        return contains(first, second) || contains(second, first);
    });
    return containedRanges.length;
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH);
    return solve(input);
}
