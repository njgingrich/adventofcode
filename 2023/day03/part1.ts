import * as it from "itertools";
import * as path from "path";

import { readInputAsStringGrid } from "../util";
import Grid, { Coord } from "../util/grid";

const INPUT_PATH = path.join(__dirname, "./input.txt");

function parse(lines: string[][]) {
    const grid = Grid.fromArray(lines, {getDefault: () => '.'});
    return grid;
}

// Return start/end coord for a found digit
function findDigits(grid: Grid<string>): Map<string, [Coord, Coord]> {
    const digits = new Map<string, [Coord, Coord]>();

    for (let y = 0; y < grid.height(); y++) {
        const row = grid.getRow(y);
        let digit = '';
        let startIx = -1;
        let endIx = -1;

        for (let x = 0; x < row.length; x++ ){
            const cell = row[x][0];
            // If we find a digit, start constructing the full digit
            if (!Number.isNaN(Number.parseInt(cell, 10))) {
                // If we're at the start of a digit
                if (digit === '') {
                    startIx = x;
                }

                digit += cell;
                endIx = x;
            // Only set a digit if we've come to the end of a digit string
            } else if (digit !== '') {
                digits.set(`${digit}__${[[y, startIx], [y, endIx]]}`, [[y, startIx], [y, endIx]]);
                digit = '';
            }
        }
        if (digit !== '') {
            digits.set(`${digit}__${[[y, startIx], [y, endIx]]}`, [[y, startIx], [y, endIx]]);
            digit = '';
        }
    }

    return digits;
}

function findPartNumbers(grid: Grid<string>, digits: Map<string, [Coord, Coord]>) {
    return it.filter(digits.entries(), ([_, [start, end]]) => {
        const touching = grid.touching(start[1], end[1], start[0], end[0]);

        return touching.some(coord => grid.getByCoord(coord) !== '.');
    });
}

function solve(lines: string[][]) {
    const grid = parse(lines);
    const digits = findDigits(grid);
    const validNumbers = findPartNumbers(grid, digits);
    return it.sum(validNumbers.map(entry => {
        const num = entry[0].split('__')[0];
        return Number.parseInt(num, 10);
    }));
}

export default async function run() {
    const input = await readInputAsStringGrid(INPUT_PATH);
    return solve(input);
}
