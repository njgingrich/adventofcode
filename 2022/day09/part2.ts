import * as path from "path";

import { readInputAsStrings } from "../util";
import Grid, { Coord } from "../util/grid";

const INPUT_PATH = path.join(__dirname, "./input.txt");

type Dir = "R" | "U" | "L" | "D";
type Instruction = [Dir, number];
type KnotArray = [
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean,
    boolean
];
type CoordArray = [
    Coord,
    Coord,
    Coord,
    Coord,
    Coord,
    Coord,
    Coord,
    Coord,
    Coord,
    Coord
];

class Node {
    knots: KnotArray;
    visited: boolean;

    constructor(knots?: KnotArray, visited?: boolean) {
        this.knots =
            knots !== undefined ? knots : Array.from(Array(10), () => false) as KnotArray;
        this.visited = visited !== undefined ? visited : false;
    }

    setKnot(knot: number, val: boolean = true) {
        this.knots[knot] = val;
    }

    toString() {
        if (this.knots[0]) {
            return 'H';
        } else if (this.knots.some(Boolean)) {
            return this.knots.findIndex(Boolean);
        } else if (this.visited) {
            return "#";
        } else {
            return ".";
        }
    }
}

function parse(lines: string[]): Instruction[] {
    return lines.map((l) => {
        const [dir, num] = l.split(/\s+/);
        return [dir as Dir, Number(num)];
    });
}

function getNewCoord(coord: Coord, instruction: Instruction): Coord {
    switch (instruction[0]) {
        case "U":
            return [coord[0], coord[1] - 1];
        case "R":
            return [coord[0] + 1, coord[1]];
        case "D":
            return [coord[0], coord[1] + 1];
        case "L":
            return [coord[0] - 1, coord[1]];
    }
}

function determineTailCoord(
    grid: Grid<Node>,
    headPosition: Coord,
    tailPosition: Coord
): Coord {
    const neighborsMap = grid.neighbors(headPosition, "moores");
    neighborsMap.set("", headPosition);

    // if a neighbor or on top of head, it doesn't move
    for (let neighbor of neighborsMap.values()) {
        if (neighbor.toString() === tailPosition.toString()) {
            return tailPosition;
        }
    }

    const newTail = tailPosition;
    const [headX, headY] = headPosition;
    const [tailX, tailY] = tailPosition;
    if (headX - tailX >= 2) {
        newTail[0] += 1;
        // If also offset vertically, move it diagonally
        if (headY - tailY === 1) {
            newTail[1] += 1;
        } else if (headY - tailY === -1) {
            newTail[1] -= 1;
        }
    } else if (headX - tailX <= -2) {
        newTail[0] -= 1;
        // If also offset vertically, move it diagonally
        if (headY - tailY === 1) {
            newTail[1] += 1;
        } else if (headY - tailY === -1) {
            newTail[1] -= 1;
        }
    }

    if (headY - tailY >= 2) {
        newTail[1] += 1;
        // If also offset horizontally, move it diagonally
        if (headX - tailX === 1) {
            newTail[0] += 1;
        } else if (headX - tailX === -1) {
            newTail[0] -= 1;
        }
    } else if (headY - tailY <= -2) {
        newTail[1] -= 1;
        // If also offset horizontally, move it diagonally
        if (headX - tailX === 1) {
            newTail[0] += 1;
        } else if (headX - tailX === -1) {
            newTail[0] -= 1;
        }
    }
    return newTail;
}

function moveKnot(grid: Grid<Node>, knotPositions: CoordArray, knotIx: number, instruction: Instruction) {
    const knotCoord = knotPositions[knotIx];
    const current = grid.getByCoord(knotCoord);
    current.setKnot(knotIx, false);
    grid.setCoord(knotCoord, current);

    let newCoord;
    if (knotIx === 0) {
        newCoord = getNewCoord(knotCoord, instruction);
    } else {
        const prevKnot = knotPositions[knotIx - 1];
        newCoord = determineTailCoord(grid, prevKnot, knotCoord);
    }
    knotPositions[knotIx] = newCoord;

    const newCell = grid.getByCoord(newCoord);
    newCell.setKnot(knotIx, true);
    if (knotIx === 9) {
        newCell.visited = true;
    }

    grid.setCoord(newCoord, newCell);
    return knotPositions;
}

function step(
    grid: Grid<Node>,
    knotPositions: CoordArray,
    instruction: Instruction
) {
    let positions = knotPositions;
    for (let i = 0; i < knotPositions.length; i++) {
        positions = moveKnot(grid, positions, i, instruction);
    }

    return knotPositions;
}

function solve(lines: string[]) {
    const instructions = parse(lines);

    const grid = new Grid<Node>({
        getDefault: () => new Node(),
    });

    let knotPositions: CoordArray = Array.from(new Array(10), () => [0, 0]) as CoordArray;
    const headNode = new Node(Array.from(new Array(10), () => true) as KnotArray, true);
    grid.setCoord(knotPositions[0], headNode);

    for (let i of instructions) {
        // console.log(`## Moving ${i[0]} for ${i[1]} ##`);
        for (let count = 1; count <= i[1]; count++) {
            knotPositions = step(grid, knotPositions, i);
            // console.log(`After step ${count}: head is at [${knotPositions[0]}]`);
            // console.log(grid.toString());
        }
    }

    const visited = grid.findWhere((coord) => grid.getByCoord(coord).visited);
    return visited.length;
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH);
    return solve(input);
}
