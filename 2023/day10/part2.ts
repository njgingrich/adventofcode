import * as it from "itertools";
import * as path from "path";

import { readInputAsGrid } from "../util";
import Grid, {type Coord} from "../util/grid";
import { Console } from "console";

const INPUT_PATH = path.join(__dirname, "./input.txt");

/** An array holding connections for N, E, S, W (clockwise) */
type Connection = [north: boolean, east: boolean, south: boolean, west: boolean];
type Tile = '|' | '-' | 'L' | 'J' | '7' | 'F' | '.' | 'S';
type Direction = 'N' | 'E' | 'S' | 'W';

const Directions = ['N', 'E', 'S', 'W'] as const;
const NextDirection: Record<Direction, Direction> = {
    'N': 'S',
    'E': 'W',
    'S': 'N',
    'W': 'E',
}

const Connections: Record<Tile, Connection> = {
    '|': [true, false, true, false],
    '-': [false, true, false, true],
    'L': [true, true, false, false],
    'J': [true, false, false, true],
    '7': [false, false, true, true],
    'F': [false, true, true, false],
    '.': [false, false, false, false],
    // special case
    'S': [true, true, true, true],
};

const connectionEntries =  Object.entries(Connections) as [Tile, Connection][];

/**
 * For the (N|E|S|W) tile compared to the one we're looking at, get which tiles are ins
 * Ex: for 'N', return the tiles that are valid ins for the tile south of it 
 */
const DirectionIns: Record<'N' | 'E' | 'S' | 'W', Tile[]> = {
    'N': connectionEntries.filter(([_, c]) => c[2] === true).map(([t, c]) => t),
    'E': connectionEntries.filter(([_, c]) => c[3] === true).map(([t, c]) => t),
    'S': connectionEntries.filter(([_, c]) => c[0] === true).map(([t, c]) => t),
    'W': connectionEntries.filter(([_, c]) => c[1] === true).map(([t, c]) => t),
};

// for [., -, |, .] -> isInput(Tile[]) => [false, true, true, false]
function isInput(tiles: Tile[]): Connection {
    return [
        DirectionIns['N'].includes(tiles[0]),
        DirectionIns['E'].includes(tiles[1]),
        DirectionIns['S'].includes(tiles[2]),
        DirectionIns['W'].includes(tiles[3]),
    ]
}

/** Determine what connection the start tile has based on its neighbors */
function setStartPipe(grid: Grid<Tile>) {
    const start = grid.findFirstWhere(c => grid.getByCoord(c) === 'S');
    if (!start) throw new Error('Could not find start location');

    const startCoord = start[1];
    const neighbors = grid.neighbors(startCoord, 'cardinal');
    const neighborTiles: Tile[] = ['N', 'E', 'S', 'W'].map(dir => {
        const coord = neighbors.get(dir);
        if (!coord) return '.';

        return grid.getByCoord(coord);
    });
    const connection = isInput(neighborTiles);
    const entry = connectionEntries.find(([k, c]) => {
        for (let i = 0; i < c.length; i++) {
            if (c[i] !== connection[i]) return false;
        }
        return true;
    });

    if (!entry) throw new Error('Could not find start based on connections');
    const tile = entry[0];
    grid.setCoord(startCoord, tile);
    return startCoord;
}

function getNext(grid: Grid<Tile>, start: Coord, from: 'N' | 'E' | 'S' | 'W'): [Direction, Coord] {
    const tile = grid.getByCoord(start);
    const connection = Connections[tile];

    const fromIx = Directions.findIndex(v => v === from);
    const startIx = (fromIx + 1) % 4;
    let nextIx = connection.findIndex((val, i) => i >= startIx && fromIx !== startIx && val);
    if (nextIx === -1) {
        nextIx = connection.findIndex((val, i) => fromIx !== startIx && val);
    }
    const nextDir = Directions[nextIx];
    let next: Coord;
    switch (nextDir) {
        case 'N': next = [start[0], start[1] - 1]; break;
        case 'E': next = [start[0] + 1, start[1]]; break;
        case 'S': next = [start[0], start[1] + 1]; break;
        case 'W': next = [start[0] - 1, start[1]]; break;
    }
    return [nextDir, next];
}

function followLoop(grid: Grid<Tile>, start: Coord) {
    const path: {coord: Coord, step: number}[] = [{coord: start, step: 0}];
    let next = getNext(grid, start, 'N');
    path.push({coord: next[1], step: 1});

    let step = 2;
    while (Grid.coordToId(next[1]) !== Grid.coordToId(start)) {
        next = getNext(grid, next[1], NextDirection[next[0]]);
        path.push({coord: next[1], step: step++});
    }

    path.pop(); // remove the start
    return path;
}

function parse(lines: Tile[][]) {
    return Grid.fromArray<Tile>(lines, {getDefault: (x,y) => '.'});
}

/*
 * For each cell in the scan, if it's on the path and the cell below it is also on the path,
 * then we can check to see if their step counts differ by 1.
 * That tells us whether we must have stepped up from the cell below to this one, or whether
 * we must have stepped to the cell below next (blue arrows).
 * 
 * Then if we come across a non-path cell while crosses != 0, it's inside
 */
function getInsideCount(grid: Grid<Tile>, path: {step: number, coord: Coord}[]) {
    const pathCoords = path.map(p => p.coord);
    let count = 0;

    for (let y = 0; y < grid.height(); y++) {
        const rowCoords = grid.getRow(y).map(([_, c]) => c);
        let crosses = 0;

        for (let x = 0; x < rowCoords.length - 1; x++) {
            const cell = rowCoords[x];
            const pathForCell = path.find(p => p.coord[0] === cell[0] && p.coord[1] === cell[1]);
            const pathForCellBelow = path.find(p => p.coord[0] === cell[0] && p.coord[1] === cell[1] + 1);

            // console.log(`Comparing cell ${cell} with below. Both on path? ${Boolean(pathForCell && pathForCellBelow)} -- ${pathForCell?.step ?? 'X'} vs ${pathForCellBelow?.step ?? 'X'}`)
            if (pathForCell && pathForCellBelow) {
                if (pathForCell.step - pathForCellBelow.step === 1) {
                    crosses += 1;
                } else if (pathForCell.step - pathForCellBelow.step === -1) {
                    crosses -= 1;
                }
            }

            // If on the path of pipes itself, not inside
            if (pathCoords.some(c => c[0] === cell[0] && c[1] === cell[1])) continue;
            if (crosses === 0) continue;
            count++;
        }
    }

    return count;
}

function solve(lines: Tile[][]) {
    const tiles = parse(lines);
    const startCoord = setStartPipe(tiles);
    const path = followLoop(tiles, startCoord);

    return getInsideCount(tiles, path);
}

export default async function run() {
    const input = await readInputAsGrid<Tile>(INPUT_PATH, '', (el => el as Tile));
    return solve(input);
}
