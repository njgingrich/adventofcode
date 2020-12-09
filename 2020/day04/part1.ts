import * as it from "iter-tools";
import * as path from "path";

import { max, readInputAsStrings } from "../util";

type AnyRecord = Record<string, any>;
const REQUIRED_FIELDS = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];

// deno-lint-ignore no-explicit-any
function intersection<T = any>(arr1: Array<T>, arr2: Array<T>): Array<T> {
    const set2 = new Set(arr2);
    return [...new Set(arr1)].filter((v) => set2.has(v));
}

function parse(str: string): AnyRecord {
    const split = str.split(' ');
    const passport: AnyRecord = {};
    split.forEach(str => {
        const [k, v] = str.split(':');
        passport[k] = v;
    })

    return passport;
}

function isValid(pass: AnyRecord) {
    return (intersection(Object.keys(pass), REQUIRED_FIELDS).length) >= 7;
}

function solve(lines: string[]) {
    return lines.map(parse).filter(isValid).length;
}

export default async function run() {
  let input = await readInputAsStrings(path.join(__dirname, "./input.txt"), "\n\n")
  input = input
    .map((l) => l.replace(/\n/g, " "))
    .filter(Boolean);
  return solve(input);
}

