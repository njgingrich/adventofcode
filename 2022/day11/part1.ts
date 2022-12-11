import * as it from "itertools";
import * as path from "path";

import { readInputAsStrings } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

class Monkey {
    items: number[];
    // Given current worry level, return what it changes to
    operation: (worry: number) => number;
    // Returns the number of the monkey to throw to if true/false
    test: (worry: number) => number;


    constructor(items: number[], operation: (w: number) => number, test: (w: number) => number) {
        this.items = items;
        this.operation = operation;
        this.test = test;
    }
}

function parseMonkey(lines: string[]): Monkey {
    const items = [...lines[1].matchAll(/\d+/g)].map(match => Number(match[0]));
    let op = lines[2][23];
    let opNum: number = Number(lines[2].match(/\d+/)?.[0]);
    // If 'opNum' if 'old', we convert summing itself to multiplying by 2,
    // and multiplying by itself to exponentiation by 2
    if (Number.isNaN(opNum)) {
        if (op === '+') {
            op = '*';
        } else if (op === '*') {
            op = '**';
        }
        opNum = 2;
    }
    
    const operation = (worry: number) => {
        if (op === '+') {
            return worry + opNum;
        } else if (op === '*') {
            return worry * opNum;
        } else if (op === '**') {
            return worry ** opNum;
        }
        return worry * opNum;
    }

    const testNum = Number(lines[3].match(/\d+/)?.[0]);
    const trueMonkey = Number(lines[4].match(/\d+/)?.[0]);
    const falseMonkey = Number(lines[5].match(/\d+/)?.[0]);
    const test = (worry: number) => {
        return worry % testNum === 0 ? trueMonkey : falseMonkey;
    }

    return new Monkey(items, operation, test);
}

function parse(monkeyLines: string[]): Monkey[] {
    return monkeyLines.map((line) => {
        return parseMonkey(line.split('\n'));
    });
}

function solve(lines: string[]) {
    const monkeys = parse(lines);
    
    const ROUNDS = 20;
    const roundResults: number[][][] = [];
    const inspections = Array.from(new Array(monkeys.length), () => 0);
    for (let round = 0; round < ROUNDS; round++) {
        for (let mIx = 0; mIx < monkeys.length; mIx++) {
            // console.log(`Monkey ${mIx}`);
            const monkey = monkeys[mIx];

            while (monkey.items.length > 0) {
                let item = monkey.items.shift();
                if (!item) continue;
    
                // console.log(`\tMonkey inspects an item with a worry level of ${item}`);
                item = monkey.operation(item);
                inspections[mIx] += 1;
                // console.log(`\tWorry level is multiplied to ${item}`);
                item = Math.floor(item / 3);
                // console.log(`\tWorry level is divided to ${item}`);
                const thrownTo = monkey.test(item);
                // console.log(`\tThrowing item ${item} to monkey ${thrownTo}`);
                monkeys[thrownTo].items.push(item);
            }
        }

        roundResults.push(monkeys.map((m) => [...m.items]));
    }

    inspections.sort((a, b) => b - a);
    return inspections[0] * inspections[1];
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH, '\n\n');
    return solve(input);
}
