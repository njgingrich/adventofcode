import * as it from "itertools";
import * as path from "path";

import { readInputAsStrings } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

type Stack = string[];
type Move = {
    count: number;
    startStack: number;
    endStack: number;
};

function parse(lines: string[]) {
    const countLineIx = lines.findIndex((line) => line.trim().startsWith("1"));
    const countLine = lines[countLineIx];
    const stackCount = Number(countLine?.trim().split(/\s+/).at(-1));

    // First, pull out the crate arrays
    const stacks: Stack[] = Array.from({ length: stackCount }, () => []);
    const sidewaysStacks = lines.slice(0, countLineIx);
    const maxIx = 4 * stackCount - 1; // -1 for the last space, -1 for 0-based

    for (let line of sidewaysStacks.reverse()) {
        let currStack = 0;

        for (let i = 1; i < maxIx; i += 4) {
            // 1,5,9, etc.
            if (line[i] !== " ") {
                stacks[currStack].push(line[i]);
            }
            currStack++;
        }
    }

    // Then, get the moves
    const moves = lines.slice(countLineIx + 1).map((line) => {
        const [count, startStack, endStack] = line.matchAll(/\d+/g);
        return {
            count: Number(count[0]),
            startStack: Number(startStack[0]) - 1,
            endStack: Number(endStack[0]) - 1,
        };
    });

    return {
        stacks,
        moves,
        stackCount,
    };
}

function doMove(move: Move, stacks: Stack[]): Stack[] {
    const { count, startStack, endStack } = move;

    const len = stacks[startStack].length;
    const popped = stacks[startStack].splice(len - count, count);
    stacks[endStack].push(...popped);
    return stacks;
}

function solve(lines: string[]) {
    let { stacks, moves, stackCount } = parse(lines);

    moves.forEach((move) => {
        stacks = doMove(move, stacks);
    });

    return stacks.map((stack) => stack.pop()).join("");
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH);
    return solve(input);
}
