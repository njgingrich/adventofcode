import * as it from "https://cdn.pika.dev/itertools@1.6.1";

async function readInput(): Promise<string[]> {
  const file = await Deno.readTextFile("./input.txt");
  return file.split("\n\n").map(l => l.replaceAll('\n', ' ')).filter(Boolean);
}
// deno-lint-ignore no-explicit-any
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

const input = await readInput();
console.log(solve(input));

export {};
