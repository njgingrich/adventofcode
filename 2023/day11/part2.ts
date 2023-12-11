import * as it from "itertools";
import * as path from "path";

import { getPairs, readInputAsStringGrid } from "../util";
import Grid, { Coord } from "../util/grid";

const INPUT_PATH = path.join(__dirname, "./input.txt");

function parse(lines: string[][]) {
    let expandedRows: number[] = [];
    let expandedCols: number[] = [];

    lines.forEach((l, i) => {
        if (l.every(el => el === '.')) {
            expandedRows.push(i);
        }
    });
    for (let x = 0; x < lines[0].length; x++) {
        let isExpanded = true;
        for (let y = 0; y < lines.length; y++) {
            if (lines[y][x] !== '.') isExpanded = false; 
        }
        if (isExpanded) {
            expandedCols.push(x);
        }
    }

    return {
        expandedRows,
        expandedCols,
        grid: Grid.fromArray(lines, {getDefault: () => '.'}),
    }
}

function getGalaxies(grid: Grid<string>) {
    return grid.findWhere((coord) => grid.getByCoord(coord) === '#').map(([_, coord]) => coord);
}

const EXPANSION_MULT = 1000000;
function getDistance(start: Coord, end: Coord, expandedRows: number[], expandedCols: number[]) {
    const manhattan = Grid.manhattanDistance(start, end);
    // ex: [1, 5] -> [4, 9] :: expandedRows [3,7], expandedCols = [2,5,8]
    // manhattan = 7
    // expandedRows 7 is within (5, 9) and expandedCols 2 is between (1, 4)
    // so total = 7 + 1 + 1
    const extraRows = it.map(
        it.range(start[1], end[1], start[1] > end[1] ? -1 : 1),
        (n) => expandedRows.includes(n),
    ).filter(Boolean).length;
    const extraCols = it.map(
        it.range(start[0], end[0], start[0] > end[0] ? -1 : 1),
        (n) => expandedCols.includes(n),
    ).filter(Boolean).length;

    return manhattan + extraRows * (EXPANSION_MULT-1) + extraCols * (EXPANSION_MULT-1);
}

function solve(lines: string[][]) {
    const {expandedCols, expandedRows, grid} = parse(lines);
    const galaxies = getGalaxies(grid);
    const pairs = getPairs(galaxies);
    const distances = pairs.map(p => getDistance(p[0], p[1], expandedRows, expandedCols));
    return it.sum(distances);
}

export default async function run() {
    const input = await readInputAsStringGrid(INPUT_PATH);
    return solve(input);
}
