import * as it from "itertools";
import * as path from "path";

import { readInputAsStrings } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

type Throw = {blue: number; red: number; green: number}
interface Game {
    id: string;
    throws: Throw[]
}

function findCountForColor(str: string, color: 'red' | 'blue' | 'green') {
    const ix = str.indexOf(color);
    const substr = str.slice(Math.max(0, ix - 5), ix);
    const match = substr.match(/\d+/);

    if (ix >= 0 && match) {
        return Number.parseInt(match[0]);
    }
    return 0;
}

function parse(lines: string[]): Game[] {
    return lines.map(line => {
        const [idString, throwString] = line.split(': ');
        const id = idString.slice(5);
        const throwStrings = throwString.split('; ');

        const throws = throwStrings.map((str) => {
            let obj = {
                red: findCountForColor(str, 'red'),
                blue: findCountForColor(str, 'blue'),
                green: findCountForColor(str, 'green'),
            };
            return obj;
        });

        return {id, throws}
    })
}

function getMinRequired(throws: Throw[]): Throw {
    return {
        red: it.max(throws.map(t => t.red))?.valueOf() ?? 0,
        blue: it.max(throws.map(t => t.blue))?.valueOf() ?? 0,
        green: it.max(throws.map(t => t.green))?.valueOf() ?? 0,
    }
}

function solve(lines: string[]) {
    const parsed = parse(lines);
    const mins = parsed.map(g => getMinRequired(g.throws));
    const powers = mins.map(t => t.red * t.blue * t.green);
    return it.sum(powers);
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH);
    return solve(input);
}
