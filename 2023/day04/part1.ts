import * as it from "itertools";
import * as path from "path";

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

function countWinningNumbers(card: Card) {
    return card.winning.filter(n => card.numbers.includes(n)).length;
}

function solve(lines: string[]) {
    const cards = parse(lines);
    const points = cards.map(countWinningNumbers);
    return it.sum(points.map((n) => n === 0 ? 0 : 2 ** (n - 1)));
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH);
    return solve(input);
}
