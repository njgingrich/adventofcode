import * as it from "itertools";
import { sum } from "lodash";
import * as path from "path";

import { readInput } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

function parse(file: string): number[][] {
    const lines = file.split("\n");
    let elves: number[][] = [];
    let elf: number[] = [];
    for (let line of lines) {
        if (line.length === 0) {
            elves.push([...elf]);
            elf = [];
        } else {
            elf.push(Number.parseInt(line));
        }
    }
    elves.push([...elf]);

    return elves;
}

function solve(lines: string) {
    const elfCalories = parse(lines);
    const [best, second, third, ...rest] = elfCalories.map(sum).sort((a,b) => b-a);
    return best + second + third;
}

export default async function run() {
    const input = await readInput(INPUT_PATH);
    return solve(input);
}
