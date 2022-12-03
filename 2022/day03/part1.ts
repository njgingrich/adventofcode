import * as it from "itertools";
import _ from "lodash";
import * as path from "path";

import { readInputAsStrings } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

function getValue(char: string) {
    if (char.toUpperCase() === char) {
        // A = 65
        return char.charCodeAt(0) - 38;
    } else {
        // a = 97
        return char.charCodeAt(0) - 96;
    }
}

function parse(lines: string[]) {
    const sacks = lines.map((line) => {
        const first = line.slice(0, line.length / 2);
        const second = line.slice(line.length / 2);
        return [first, second];
    });
    const errors = sacks.map(([left, right]) => {
        return _.intersection(left.split(""), right.split(""))[0];
    });
    return it.sum(errors.map(getValue));
}

function solve(lines: string[]) {
    const parsed = parse(lines);
    return parsed;
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH);
    return solve(input);
}
