import * as it from "itertools";
import * as path from "path";

import { lcm, readInputAsStrings } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

function parse(lines: string[]) {
    return {
        instruction: lines[0].split(''),
        map: lines[1].split('\n').reduce((acc, cur) => {
            let l = cur.split(/\s+=\s+/)
            acc[l[0]] = [l[1].slice(1, 4), l[1].slice(6, 9)];
            return acc;
        }, {} as Record<string, [string, string]>)
    }
}

function firstZ(node: string, parsed: ReturnType<typeof parse>) {
    const {instruction, map} = parsed;
    let instructionIx = 0;
    let activeInstruction = instruction[instructionIx];
    let cur = node;
    let step = 0;

    while (!cur.endsWith('Z')) {
        step++;
        activeInstruction = instruction[instructionIx];
        const newElement = map[cur][activeInstruction === 'L' ? 0 : 1];
        // console.log(`Moving ${activeInstruction} from ${cur} to ${newElement}, step=${step}`)
        cur = newElement;

        instructionIx = ++instructionIx % instruction.length;
    }

    return step;
}

function solve(lines: string[]) {
    const parsed = parse(lines);
    let nodes = Object.keys(parsed.map).filter(k => k.endsWith('A'));

    const firstZs = nodes.map(n => firstZ(n, parsed));
    return firstZs.reduce(lcm);
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH, '\n\n');
    return solve(input);
}
