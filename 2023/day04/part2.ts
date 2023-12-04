import * as it from "itertools";
import * as path from "path";
import Queue from "tinyqueue";

import { readInputAsStrings } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

interface Card {
    id: number;
    winning: number[];
    numbers: number[];
}

function parse(lines: string[]): Card[] {
    return lines.map((line, i) => {
        const [winningStr, numbersStr] = line.split(': ')[1].split(' | ');
        return {
            id: i + 1,
            winning: winningStr.split(/\s+/).map(n => Number.parseInt(n, 10)),
            numbers: numbersStr.split(/\s+/).map(n => Number.parseInt(n, 10)),
        }
    });
}

function getWinningCardIds(card: Card) {
    const numWins = card.winning.filter(n => card.numbers.includes(n)).length;
    return Array.from({length: numWins}, (_, ix) => card.id + ix + 1);
}

const CardMap = new Map<number, {card: Card, winningIds: number[]}>();

function solve(lines: string[]) {
    const baseCards = parse(lines);
    for (let card of baseCards) {
        CardMap.set(card.id, {card, winningIds: getWinningCardIds(card)});
    }

    // id -> count
    let counts = new Map<number, number>();
    for (let id of CardMap.keys()) {
        counts.set(id, 1);
    }

    for (let active = 1; active <= baseCards.length; active++) {
        const activeEl = CardMap.get(active);
        if (!activeEl) throw new Error('missing card');

        const winningNumbers = activeEl.winningIds;
        const count = counts.get(active) ?? 1;

        for (let n of winningNumbers) {
            counts.set(n, (counts.get(n) ?? 0) + count);
        }
    }

    return it.sum(counts.values());
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH);
    return solve(input);
}
