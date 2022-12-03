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
    const groups = [...it.chunked(lines, 3)];
    const badges = groups.map(group => {
        return _.intersection(...group.flat().map(sack => sack.split('')))[0];
    })
    return it.sum(badges.map(getValue));
}

function solve(lines: string[]) {
    const parsed = parse(lines);
    return parsed;
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH);
    return solve(input);
}
