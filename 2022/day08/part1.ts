import * as it from "itertools";
import * as path from "path";

import { readInputAsNumberGrid } from "../util";
import Grid, { Coord } from "../util/grid";

const INPUT_PATH = path.join(__dirname, "./input.txt");

function parse(lines: number[][]) {
    return Grid.fromArray(lines, { getDefault: () => -1 });
}

function isVisible<T extends number>(coord: Coord, grid: Grid<T>): boolean {
    const [x, y] = coord;
    const height = grid.get(x, y);

    // is edge
    if (
        x === 0 ||
        y === 0 ||
        x === grid.width() - 1 ||
        y === grid.height() - 1
    ) {
        return true;
    }
    const row = grid.getRow(y);
    const col = grid.getCol(x);
    // Get surrounding cells WITHOUT the current cell
    const left = row.slice(0, x);
    const right = row.slice(x + 1);
    const up = col.slice(0, y);
    const down = col.slice(y + 1);

    const results = [up, right, down, left].map((arr) => {
        return arr.every((entry) => entry[0] < height);
    });
    return results.some(Boolean);
}

function solve(lines: number[][]) {
    const grid = parse(lines);
    const visible = grid.findWhere((coord) => isVisible(coord, grid));
    return visible.length;
}

export default async function run() {
    const input = await readInputAsNumberGrid(INPUT_PATH);
    return solve(input);
}
