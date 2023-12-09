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

function next(history: number[]) {
    const historySet = getHistorySet(history);
    return it.sum(historySet.map(history => history.at(-1) as number));
}

function solve(lines: string[]) {
    const histories = parse(lines);
    return it.sum(histories.map(h => next(h)));
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH);
    return solve(input);
}
