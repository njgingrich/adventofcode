import * as it from "itertools";
import * as path from "path";

import { readInputAsStrings } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

type Race = [time: number, distance: number];

function parse(lines: string[]): Race {
    const nums = lines.map(line => Number.parseInt(line.replaceAll(/\s+/g, '').split(':')[1], 10));
    return [nums[0], nums[1]];
}

function getDistance(t: number, speed: number) {
    return t * speed - speed ** 2;
}

function solve(lines: string[]) {
    const race = parse(lines);

    let winning = 0;
    for (let s = 1; s <= race[0]; s++) {
        if (getDistance(race[0], s) > race[1]) {
            winning++;
        }
    }

    return winning;
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH);
    return solve(input);
}
