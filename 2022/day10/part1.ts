import * as it from "itertools";
import * as path from "path";

import { readInputAsStrings } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

type Op = "addx" | "noop";
type AddXInstruction = ["addx", number];
type NoopInstruction = ["noop"];
type Instruction = AddXInstruction | NoopInstruction;

function parse(lines: string[]): Instruction[] {
    return lines.map((line) => {
        const [op, num] = line.split(/\s+/);
        if (op === "addx") {
            return [op, Number(num)];
        } else if (op === "noop") {
            return [op];
        } else {
            throw new Error("");
        }
    });
}

function solve(lines: string[]) {
    const instructions = parse(lines);

    let cycle = 0;
    let x = 1;

    let signals: number[] = [];
    function doCycle(op: "addx" | "noop") {
        cycle += 1;
        if ((cycle + 20) % 40 === 0) {
            signals.push(x);
        }
        // console.log(`[Cycle ${cycle}] :: op=${op}, x=${x}`);
    }

    instructions.forEach(([op, num], ix) => {
        switch (op) {
            case "noop": {
                doCycle(op);
                break;
            }
            case "addx": {
                // after the cycle
                doCycle(op);
                doCycle(op);
                x += num;
                break;
            }
        }
    });
    if ((cycle + 20) % 40 === 0) {
        signals.push(x);
    }

    return signals.reduce((sum, cur, ix) => {
        return sum + (40 * ix + 20) * cur;
    }, 0);
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH);
    return solve(input);
}
