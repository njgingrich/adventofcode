import * as it from "itertools";
import * as path from "path";

import { readInputAsStrings } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

const mapping = {
    'one': '1',
    'two': '2',
    'three': '3',
    'four': '4',
    'five': '5',
    'six': '6',
    'seven': '7',
    'eight': '8',
    'nine': '9',
}

// Replace strings like 'one' or 'seven' with '1' and '7'
function replaceNumbersWithDigits(input: string): string {
    let str = input;
    
    for (let i = 0; i < str.length; i++) {
        for (let [key, val] of Object.entries(mapping)) {
            if (str.slice(i, i + key.length) === key) {
                str = `${str.slice(0, i)}${val}${str.slice(i + key.length)}`;
            }
        }
    }

    return str;
}

function parse(lines: string[]): number[] {
    // Take input like 1abc2 and return a 2-digit number created from the 1st and last digits
    return lines.map(line => {
        line = replaceNumbersWithDigits(line);
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
