import * as it from "itertools";
import * as path from "path";

import { readInputAsStrings } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

type Race = [time: number, distance: number];

function parse(lines: string[]): Race[] {
    const nums = lines.map(line => line.split(/\s+/).slice(1).map(Number));
    return it.zip(nums[0], nums[1]);
}

function getDistance(t: number, speed: number) {
    return t * speed - speed ** 2;
}

function solve(lines: string[]) {
    const races = parse(lines);

    const numWaysToWin = races.map(race => {
        let winning = 0;
        for (let s = 1; s <= race[0]; s++) {
            // console.log(`Distance for s=${s}, (time=${race[0]}): ${getDistance(race[0], s)} - vs ${race[1]}`)
            if (getDistance(race[0], s) > race[1]) {
                winning++;
            }
        }

        return winning;
    });

    return numWaysToWin.reduce((prev, cur) => prev * cur, 1);
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH);
    return solve(input);
}
