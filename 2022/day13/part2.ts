import * as it from "itertools";
import * as _ from 'lodash';
import * as path from "path";

import { readInputAsStrings } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

export type PacketData = Array<PacketData | number>;
export type Comparator = -1 | 0 | 1;

function pretty(packet: PacketData | number) {
    if (Array.isArray(packet)) {
        return `[${packet.join(",")}]`;
    } else {
        return packet;
    }
}

function compare(
    left: PacketData | number,
    right: PacketData | number,
    level = 0
): Comparator {
    // console.log(`${' '.repeat(level * 2)}Compare ${pretty(left)} vs ${pretty(right)}`);
    if (typeof left === "number" && typeof right === "number") {
        if (left - right === 0) {
            return 0;
        }
        if (left - right < 0) {
            // console.log(`${' '.repeat(level * 2)}Left side is smaller, so inputs are in the right order`)
            return -1;
        } else {
            // console.log(`${' '.repeat(level * 2)}Right side is smaller, so inputs are NOT in the right order`)
            return 1;
        }
    } else if (Array.isArray(left) && Array.isArray(right)) {
        let result: Comparator = 0;
        let maxLen = Math.max(left.length, right.length);

        for (let i = 0; i < maxLen; i++) {
            if (left[i] === undefined && result === 0) {
                // console.log(`${' '.repeat(level * 2)}Left side ran out of items, so inputs are in the right order`)
                return -1;
            } else if (right[i] === undefined && result === 0) {
                // console.log(`${' '.repeat(level * 2)}Right side ran out of items, so inputs are not in the right order`);
                return 1;
            }

            if (result !== 0) {
                return result;
            }

            result = compare(left[i], right[i], level + 1);
        }
        return result;
    } else if (typeof left === "number" && Array.isArray(right)) {
        return compare([left], right, level + 1);
    } else if (Array.isArray(left) && typeof right === "number") {
        return compare(left, [right], level + 1);
    } else {
        throw new Error(
            `Unknown comparison condition. left=${typeof left}, right=${typeof right}`
        );
    }
}

function parse(groups: string[]) {
    return groups.map((lines) => {
        return lines.split("\n").map((str) => JSON.parse(str));
    });
}

function solve(lines: string[]) {
    const pairs = parse(lines);
    const dividers: PacketData = [[[2]], [[6]]];
    const sorted = _.flatMap(pairs).concat(...dividers).sort(compare);
    
    const lowerDivider = sorted.findIndex(
        (p) => Array.isArray(p) && p[0] === 2
    );
    const upperDivider = sorted.findIndex(
        (p) => Array.isArray(p) && p[0] === 6
    );
    return (lowerDivider + 1) * (upperDivider + 1);
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH, "\n\n");
    return solve(input);
}
