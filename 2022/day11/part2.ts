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
    divisor: number;

    constructor(
        items: number[],
        operation: (w: number) => number,
        test: (w: number) => number,
        divisor: number,
    ) {
        this.items = items;
        this.operation = operation;
        this.test = test;
        this.divisor = divisor;
    }
}

function parseMonkey(lines: string[]): Monkey {
    const items = [...lines[1].matchAll(/\d+/g)].map((match) =>
        Number(match[0])
    );
    let op = lines[2][23];

    let opNum: number = 2;
    const opNumMatch = lines[2].match(/\d+/)?.[0];
    if (opNumMatch) {
        opNum = Number(opNumMatch);
    }
    // If 'opNum' if 'old', we convert summing itself to multiplying by 2,
    // and multiplying by itself to exponentiation by 2
    if (!opNumMatch) {
        if (op === "+") {
            op = "*";
        } else if (op === "*") {
            op = "**";
        }
        opNum = 2;
    }

    const operation = (worry: number) => {
        if (op === "+") {
            return worry + opNum;
        } else if (op === "*") {
            return worry * opNum;
        } else if (op === "**") {
            return worry ** opNum;
        }
        return worry * opNum;
    };

    const testNum = Number(lines[3].match(/\d+/)?.[0] ?? 0);
    const trueMonkey = Number(lines[4].match(/\d+/)?.[0] ?? 0);
    const falseMonkey = Number(lines[5].match(/\d+/)?.[0] ?? 0);
    const test = (worry: number) => {
        return worry % testNum === 0 ? trueMonkey : falseMonkey;
    };

    return new Monkey(items, operation, test, testNum);
}

function parse(monkeyLines: string[]): Monkey[] {
    return monkeyLines.map((line) => {
        return parseMonkey(line.split("\n"));
    });
}

function solve(lines: string[]) {
    const monkeys = parse(lines);
    const lcm = monkeys.map(m => m.divisor).reduce((prod, cur) => prod * cur, 1);

    const ROUNDS = 10_000;
    const inspections = Array.from(new Array(monkeys.length), () => 0);

    for (let round = 0; round < ROUNDS; round++) {
        for (let mIx = 0; mIx < monkeys.length; mIx++) {
            const monkey = monkeys[mIx];

            while (monkey.items.length > 0) {
                let item = monkey.items.shift();
                if (!item) continue;

                item = monkey.operation(item);
                // let's keep things reasonable
                item %= lcm;
                inspections[mIx] += 1;

                const thrownTo = monkey.test(item);
                monkeys[thrownTo].items.push(item);
            }
        }
    }

    inspections.sort((a, b) => b - a);
    return inspections[0] * inspections[1];
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH, "\n\n");
    return solve(input);
}
