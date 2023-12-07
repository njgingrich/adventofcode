import * as it from "itertools";
import * as path from "path";

import { readInputAsStrings } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

const CARDS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

type HandType = 'five_of_kind' | 'four_of_kind' | 'full_house' | 'three_of_kind' | 'two_pair' | 'one_pair' | 'high_card';

const HandTypeStrengths: Record<HandType, number> = {
    'five_of_kind': 7,
    'four_of_kind': 6,
    'full_house': 5,
    'three_of_kind': 4,
    'two_pair': 3,
    'one_pair': 2,
    'high_card': 1,
}

function getType(hand: string[]): HandType {
    if (hand.every(h => h === hand[0])) {
        return 'five_of_kind';
    }
    const groupsByLength = it.map(
        it.groupby(it.sorted(hand), (i) => i),
        (el) => ([el[0], [...el[1]].length]),
    ).sort((elA, elB) => (elB as [string, number])[1] - (elA as [string, number])[1]);

    const hasFourOfAKind = groupsByLength[0][1] === 4;    
    if (hasFourOfAKind) {
        return 'four_of_kind';
    }

    const hasFullHouse = groupsByLength[0][1] === 3 && groupsByLength[1][1] === 2;
    if (hasFullHouse) {
        return 'full_house';
    }

    const hasThreeOfAKind = groupsByLength[0][1] === 3;
    if (hasThreeOfAKind) {
        return 'three_of_kind';
    }

    const hasTwoPair = groupsByLength.filter(el => el[1] === 2).length === 2;
    if (hasTwoPair) {
        return 'two_pair';
    }

    const hasOnePair = groupsByLength.filter(el => el[1] === 2).length === 1;
    if (hasOnePair) {
        return 'one_pair';
    }

    return 'high_card';
}

/**
 * Return negative if handA < handB, positive if handA > handB
 * If two hands have the same type:
 * 1. compare first card - if different, the stronger card wins
 * 2. compare second, third, etc. cards
*/
function compare(handA: string[], handB: string[]) {
    const strengthA = HandTypeStrengths[getType(handA)];
    const strengthB = HandTypeStrengths[getType(handB)];

    if (strengthA === strengthB) {
        for (let i = 0; i < handA.length; i++) {
            // Stronger card has lower index
            const indexA = CARDS.findIndex(el => el === handA[i]);
            const indexB = CARDS.findIndex(el => el === handB[i]);
            if (indexA === indexB) {
                continue;
            } else {
                return indexB - indexA;
            }
        }
    }

    return strengthA - strengthB;
}

function parse(lines: string[]): {hand: string[], bid: number}[] {
    return lines.map(l => {
        const split = l.split(/\s+/);
        return {
            hand: split[0].split(''),
            bid: Number(split[1]),
        }
    });
}

function solve(lines: string[]) {
    const entries = parse(lines);
    entries.sort((a, b) => compare(a.hand, b.hand));
    
    return it.sum(entries.map((e, i) => e.bid * (i + 1)));
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH);
    return solve(input);
}
