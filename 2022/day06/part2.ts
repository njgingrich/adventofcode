import * as it from "itertools";
import _ from "lodash";
import * as path from "path";

import { readInputAsString } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

function isMarker(chars: string[]) {
    return _.uniq(chars).length === 14;
}

function solve(chars: string[]) {
    for (let i = 14; i <= chars.length; i++) {
        if (isMarker(chars.slice(i - 14, i))) {
            return i;
        }
    }
    return -1;
}

export default async function run() {
    const input = await readInputAsString(INPUT_PATH, "");
    return solve(input);
}
