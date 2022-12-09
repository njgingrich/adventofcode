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

function getScore<T extends number>(coord: Coord, grid: Grid<T>): number {
    const [x, y] = coord;
    const height = grid.get(x, y);
    const row = grid.getRow(y);
    const col = grid.getCol(x);

    const left = row.slice(0, x).reverse();
    const right = row.slice(x + 1);
    const up = col.slice(0, y).reverse();
    const down = col.slice(y + 1);

    const [u,r,d,l] = [up, right, down, left].map(arr => {
        const ix = arr.findIndex(([h, coord]) => h >= height);
        // we hit the edge
        if (ix === -1) {
            return arr.length;
        }
        return ix + 1
    });

    return u * r * d * l;
}

function solve(lines: number[][]) {
    const grid = parse(lines);
    
    const scores = [];
    for (let [id, height] of grid) {
        scores.push(getScore(Grid.asCoord(id), grid));
    }
    return it.max(scores);
}

export default async function run() {
    const input = await readInputAsNumberGrid(INPUT_PATH);
    return solve(input);
}
