import * as it from "itertools";
import * as path from "path";

import { readInputAsStrings } from "../util";

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

function solve(lines: string[]) {
    const {instruction, map} = parse(lines);
    
    let instructionIx = 0;
    let activeInstruction = instruction[instructionIx];
    let cur = 'AAA';
    let step = 0;

    while (cur !== 'ZZZ') {
        step++;
        activeInstruction = instruction[instructionIx];
        const newElement = map[cur][activeInstruction === 'L' ? 0 : 1];
        // console.log(`Moving ${activeInstruction} from ${cur} to ${newElement}, step=${step}`)
        cur = newElement;

        // loop the index
        instructionIx = ++instructionIx % instruction.length;
    }

    return step;
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH, '\n\n');
    return solve(input);
}
