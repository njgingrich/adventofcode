import _ from 'lodash';
import * as path from "path";

import { readInputAsStrings } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

function parse(patterns: string[]): string[][] {
    return patterns.map(p => p.split('\n'));
}

function transpose(pattern: string[]): string[] {
    const grid = pattern.map(p => p.split(''));
    const transposed = _.zip(...grid);
    return transposed.map(t => t.join(''));
}

/** Find a row-based reflection for a grid */
function findReflection(pattern: string[]) {
    for (let row = 1; row < pattern.length; row++) {
        let top = pattern.slice(0, row).reverse();
        let bottom = pattern.slice(row);

        // limit size based on what row we're on
        top = top.slice(0, bottom.length);
        bottom = bottom.slice(0, top.length);
        
        const diffs = top.reduce((sum, row, i) => {
            const topRow = row.split('');
            const bottomRow = bottom[i].split('');
            return sum + topRow.map((ch, ix) => ch !== bottomRow[ix]).filter(Boolean).length;
        }, 0);
        if (diffs === 1) {
            return row;
        }
    }

    return 0;
}

function solve(lines: string[]) {
    const patterns = parse(lines);
    let sum = 0;

    for (let pattern of patterns) {
        const rowIndex = findReflection(pattern);
        sum += rowIndex * 100; // if no row, += 0 * 100 won't affect anything

        const transposed = transpose(pattern);
        const colIndex = findReflection(transposed);
        sum += colIndex;
    }
    
    return sum;
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH, "\n\n");
    return solve(input);
}
