import * as it from "itertools";
import { slice } from "lodash";
import * as path from "path";

import { readInputAsStrings } from "../util";
import Grid, { Coord } from "../util/grid";

const INPUT_PATH = path.join(__dirname, "./input.txt");

const enum Tile {
    Air = ".",
    Sand = "o",
    Source = "+",
    Rock = "#",
}

function parse(lines: string[]) {
    let coordLines: Coord[][] = lines
        .map((line) => line.split(" -> "))
        .map((c) =>
            c.map((str) => {
                let chars = str.split(",");
                return [Number(chars[0]), Number(chars[1])];
            })
        );

    const grid = new Grid<Tile>({ getDefault: () => Tile.Air });
    coordLines.forEach((line) => {
        for (let cIx = 0; cIx < line.length - 1; cIx++) {
            const start = line[cIx];
            const end = line[cIx + 1];

            // Horizontal
            if (start[0] - end[0] !== 0) {
                const [s, e] = [start[0], end[0]].sort((a, b) => a - b);
                for (let i = s; i <= e; i++) {
                    grid.set(i, start[1], Tile.Rock);
                }
            }
            // Vertical
            else {
                const [s, e] = [start[1], end[1]].sort((a, b) => a - b);
                for (let i = s; i <= e; i++) {
                    grid.set(start[0], i, Tile.Rock);
                }
            }
        }
    });

    return grid;
}

function isBlocked(tile: Tile) {
    return [Tile.Rock, Tile.Sand].includes(tile);
}

type Blockages = {
    blockedLeft: boolean;
    blockedDown: boolean;
    blockedRight: boolean;
};
function getBlockages(slice: Grid<Tile>, coord: Coord) {
    let blockedLeft = isBlocked(slice.get(coord[0] - 1, coord[1] + 1));
    let blockedDown = isBlocked(slice.get(coord[0], coord[1] + 1));
    let blockedRight = isBlocked(slice.get(coord[0] + 1, coord[1] + 1));
    return { blockedLeft, blockedDown, blockedRight };
}

// Returns the coord we placed
function dropSand(slice: Grid<Tile>, source: Coord): Coord {
    let sand: Coord = [...source];
    // while left, middle, right down could be possible
    let { blockedLeft, blockedDown, blockedRight } = getBlockages(slice, sand);

    while (!blockedDown || !blockedLeft || !blockedRight) {
        // console.log(`Comparing [${sand.toString()}] to:`);
        // console.log(`left: [${sand[0] - 1}, ${sand[1] + 1}]=${blockedLeft}`);
        // console.log(`down: [${sand[0]}, ${sand[1] + 1}]=${blockedDown}`);
        // console.log(`right: [${sand[0] + 1}, ${sand[1] + 1}]=${blockedRight}`);

        // try to go down as much as possible
        if (!blockedDown) {
            const col = slice.getCol(sand[0], sand[1]);
            const block = col.find(([t, c]) => isBlocked(t));
            if (!block) {
                // we are past the bottom
                return [sand[0], slice.maxY + 1];
            }
            // console.log(`Found blockage at: ${block[1]}`);
            sand = [sand[0], block[1][1] - 1];
            ({ blockedLeft, blockedDown, blockedRight } = getBlockages(
                slice,
                sand
            ));

            continue;
        }

        // try to go left 1
        if (!blockedLeft) {
            // console.log(`Moving down left to [${sand[0] - 1}, ${sand[1] + 1}]`);
            sand = [sand[0] - 1, sand[1] + 1];
            ({ blockedLeft, blockedDown, blockedRight } = getBlockages(
                slice,
                sand
            ));
            continue;
        }

        // try to go right 1
        if (!blockedRight) {
            // console.log(`Moving down right to [${sand[0] + 1}, ${sand[1] + 1}]`);
            sand = [sand[0] + 1, sand[1] + 1];
            ({ blockedLeft, blockedDown, blockedRight } = getBlockages(
                slice,
                sand
            ));
            continue;
        }
    }

    return sand;
}

function solve(lines: string[]) {
    const slice = parse(lines);
    const source: Coord = [500, 0];

    slice.setCoord(source, Tile.Source);
    console.log(slice.toString());

    let droppedCoord = dropSand(slice, source);
    let units = 0;

    while (droppedCoord[1] <= slice.maxY) {
        droppedCoord = dropSand(slice, source);
        if (droppedCoord[1] <= slice.maxY) {
            slice.setCoord(droppedCoord, Tile.Sand);
            units++;
        }
    }
    console.log(slice.toString());

    return units;
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH);
    return solve(input);
}
