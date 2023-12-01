import * as it from "itertools";
import * as path from "path";

import { readInputAsStrings } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

function parse(lines: string[]): number[] {
    // Take input like 1abc2 and return a 2-digit number created from the 1st and last digits
    return lines.map(line => {
        let digits: (string | undefined)[] = [undefined, undefined];
        for (let i = 0; i < line.length; i++) {
            if (Number.parseInt(line[i], 10)) {
                digits[0] = line[i];
                break;
            }
        }

        for (let i = line.length - 1; i >= 0; i--) {
            if (Number.parseInt(line[i], 10)) {
                digits[1] = line[i];
                break;
            }
        }

        return Number.parseInt(digits.join(''));
    });
}

function solve(lines: string[]) {
    const parsed = parse(lines);
    return it.sum(parsed);
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH);
    return solve(input);
}
