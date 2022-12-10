import * as path from "path";

import { readInputAsStrings } from "../util";
import Grid, { Coord } from "../util/grid";

const INPUT_PATH = path.join(__dirname, "./input.txt");

type Dir = "R" | "U" | "L" | "D";
type Instruction = [Dir, number];

class Node {
    hasHead: boolean;
    hasTail: boolean;
    visited: boolean;

    constructor({
        hasHead,
        hasTail,
        visited,
    }: {
        hasHead: boolean;
        hasTail: boolean;
        visited?: boolean;
    }) {
        this.hasHead = hasHead;
        this.hasTail = hasTail;
        this.visited = visited !== undefined ? visited : false;
    }

    toString() {
        if (this.hasHead && this.hasTail) {
            return "B";
        } else if (this.hasHead) {
            return "H";
        } else if (this.hasTail) {
            return "T";
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

function step(
    grid: Grid<Node>,
    headPosition: Coord,
    tailPosition: Coord,
    instruction: Instruction
) {
    // move head
    const currentHead = grid.getByCoord(headPosition);
    currentHead.hasHead = false;

    grid.setCoord(headPosition, currentHead);
    const newHead = getNewCoord(headPosition, instruction);
    const newCell = grid.getByCoord(newHead);
    newCell.hasHead = true;

    grid.setCoord(newHead, newCell);

    // move tail
    const currentTail = grid.getByCoord(tailPosition);
    currentTail.hasTail = false;
    grid.setCoord(tailPosition, currentTail);

    // determine where to move tail
    const newTail = determineTailCoord(grid, newHead, tailPosition);
    const newTailCell = grid.getByCoord(newTail);
    newTailCell.hasTail = true;
    newTailCell.visited = true;
    grid.setCoord(newTail, newTailCell);

    return {
        headPosition: newHead,
        tailPosition: newTail,
    };
}

function solve(lines: string[]) {
    const instructions = parse(lines);

    const grid = new Grid<Node>({
        getDefault: () => new Node({ hasHead: false, hasTail: false }),
    });
    let headPosition: Coord = [0, 0];
    let tailPosition: Coord = [0, 0];
    grid.setCoord(
        headPosition,
        new Node({ hasHead: true, hasTail: true, visited: true })
    );

    for (let i of instructions) {
        // console.log(`## Moving ${i[0]} for ${i[1]} ##`);
        for (let count = 1; count <= i[1]; count++) {
            ({ headPosition, tailPosition } = step(
                grid,
                headPosition,
                tailPosition,
                i
            ));
            // console.log(`After step ${count}: head is at [${headPosition}], tail is at [${tailPosition}]`);
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
