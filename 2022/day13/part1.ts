import * as it from "itertools";
import * as path from "path";

import { readInputAsStrings } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

export type PacketData = Array<PacketData | number>;
export type CompareResult = "correct" | "incorrect" | "continue";

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
): CompareResult {
    // console.log(`${' '.repeat(level * 2)}Compare ${pretty(left)} vs ${pretty(right)}`);
    if (typeof left === "number" && typeof right === "number") {
        if (left - right === 0) {
            return "continue";
        }
        if (left - right < 0) {
            // console.log(`${' '.repeat(level * 2)}Left side is smaller, so inputs are in the right order`)
            return "correct";
        } else {
            // console.log(`${' '.repeat(level * 2)}Right side is smaller, so inputs are NOT in the right order`)
            return "incorrect";
        }
    } else if (Array.isArray(left) && Array.isArray(right)) {
        let result: CompareResult = "continue";
        let maxLen = Math.max(left.length, right.length);

        for (let i = 0; i < maxLen; i++) {
            if (left[i] === undefined && result === "continue") {
                // console.log(`${' '.repeat(level * 2)}Left side ran out of items, so inputs are in the right order`)
                return "correct";
            } else if (right[i] === undefined && result === "continue") {
                // console.log(`${' '.repeat(level * 2)}Right side ran out of items, so inputs are not in the right order`);
                return "incorrect";
            }

            if (result !== "continue") {
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
    const results = pairs.map((pair) => compare(pair[0], pair[1]));
    return it.sum(results.map((el, i) => (el === "correct" ? i + 1 : 0)));
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH, "\n\n");
    return solve(input);
}
