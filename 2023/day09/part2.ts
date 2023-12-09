import * as it from "itertools";
import * as path from "path";

import { readInputAsStrings } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

function parse(lines: string[]) {
    return lines.map(l => l.split(/\s+/).map(Number));
}

function predict(history: number[]) {
    let newHistory: number[] = [];

    for (let i = 1; i <= history.length - 1; i++) {
        newHistory.push(history[i] - history[i-1]);
    }
    return newHistory;
}

function getHistorySet(history: number[]) {
    const historySet = [history];
    let newHistory = history;

    while (newHistory.some(el => el !== 0)) {
        newHistory = predict(newHistory);
        historySet.push(newHistory);
    }

    return historySet;
}
/**
 * 5  10  13  16  21  30  45
     C   3   3   5   9  15
       B   0   2   4   6
         A   2   2   2
           0   0   0
 * Find A by A => A + 0 (below) = 2 => 2
    Find B by B => B + A (2) = 0 => -2
 * For for R, find preceding element by: R[-1] = R[0] - R+1[-1]
 */
function next(history: number[]) {
    const historySet = getHistorySet(history);
    
    const fills: number[] = [];
    // Bottom row is always 0
    fills[historySet.length-1] = 0;
    for (let i = historySet.length - 2; i >= 0; i--) {
        const row = historySet[i];
        fills[i] = row[0] - fills[i+1];
    }

    return fills[0];
}

function solve(lines: string[]) {
    const histories = parse(lines);
    return it.sum(histories.map(h => next(h)));
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH);
    return solve(input);
}
