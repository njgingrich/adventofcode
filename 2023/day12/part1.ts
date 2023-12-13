import * as it from "itertools";
import * as path from "path";

import { readInputAsStrings } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

function parse(lines: string[]): {line: string, lengths: number[]}[] {
    return lines.map(l => {
        const [rowStr, lengthsStr] = l.split(' ');
        return {line: rowStr, lengths: lengthsStr.split(',').map(Number)}
    });
}

// Can we find a broken arrangement from [start, end) in row?
// Where row.slice(start, end) is all '#'s (or ?s)
function canMakeGroup(row: string, start: number, end: number) {
    if (end > row.length) return false;

    // Special case when we're at the end of the row
    if (end === row.length) {
        // None in the range can be 'operational'
        return row.slice(start, end).split('').every(ch => ch !== '.')
    }

    // Make sure the whole range is not 'operational', AND the next item is not broken
    // so that the group isn't too big
    return row.slice(start, end).split('').every(ch => ch !== '.') && row.charAt(end) !== '#';
}

function getPossibilities(row: string, brokenGroupLengths: number[]) {
    // Cache keys are of the form `${rowIx}-${groupIx}`
    // Stores count of possibilities for row.slice(rowIx) and brokenGroupLengths.slice(groupIx)
    const cache = new Map<string, number>();

    function compute(rowIx: number, groupIx: number): number {
        const cacheKey = `${rowIx}-${groupIx}`;
        if (rowIx === row.length) {
            return groupIx === brokenGroupLengths.length ? 1 : 0;
        }

        function computeNext(): number {
            // console.log(`computeNext(): ${rowIx}, ${groupIx}`)
            return compute(rowIx + 1, groupIx);
        }

        function computeBrokenSpring(): number {
            // console.log(`computeBrokenSpring(): ${rowIx}, ${groupIx}`)
            // Reached the end
            if (groupIx === brokenGroupLengths.length) return 0;

            // ex: brokenGroupLengths[1] = 3, so add 3 to index to see what we get
            const endIx = rowIx + brokenGroupLengths[groupIx];
            // console.log(`Can we make group for ${row}, from [${rowIx} to ${endIx})?`)
            if (!canMakeGroup(row, rowIx, endIx)) {
                // console.log('\t (0) cannot make group')
                return 0;
            }

            if (endIx === row.length) {
                // console.log(`\t (${(groupIx === brokenGroupLengths.length - 1) ? 1 : 0}) at end of row`)
                return (groupIx === brokenGroupLengths.length - 1) ? 1 : 0;
            }

            const val = compute(endIx + 1, groupIx + 1);
            // console.log(`\t (${val}) compute(${endIx+1}, ${groupIx+1})`)
            return val;
        }

        // check cache
        const cacheVal = cache.get(cacheKey);
        if (cacheVal !== undefined) {
            // console.log(`Returning cached for ${cacheKey}: ${cacheVal}`)
            return cacheVal;
        }

        let val: number;
        const char = row[rowIx];
        // console.log(`Looking at row[${rowIx}]: ${char}`);
        switch (char) {
            case '.': // go to next ix
                val = computeNext();
                break;
            case '#': // in a group, calculate where we need to go next
                val = computeBrokenSpring();
                break;
            case '?': // 
                val = computeNext() + computeBrokenSpring();
                break;
            default:
                throw new Error('Unknown character');
        }

        cache.set(cacheKey, val);
        return val;
    }

    return compute(0, 0);
}

function solve(lines: string[]) {
    const rows = parse(lines);
    return it.sum(rows.map(r => getPossibilities(r.line, r.lengths)));
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH);
    return solve(input);
}
