import * as it from "itertools";
import * as path from "path";

import { readInputAsStrings } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

type Input = 'rock' | 'paper' | 'scissors';

type ElfInput = 'A' | 'B' | 'C';
type YourInput = 'X' | 'Y' | 'Z';

function getInput(input: string) {
    switch (input) {
        case 'A':
        case 'X':
            return 'rock';
        case 'B':
        case 'Y':
            return 'paper';
        case 'C':
        case 'Z':
            return 'scissors';
        default:
            throw new Error('invalid piece');
    }
}

function play(yours: Input, theirs: Input): 'win' | 'loss' | 'draw' {
    switch (theirs) {
        case 'rock': {
            if (yours === "paper") {
                return "win";
            } else if (yours === "scissors") {
                return "loss";
            } else {
                return "draw";
            }
        }
        case 'paper': {
             if (yours === "scissors") {
                 return "win";
             } else if (yours === "rock") {
                 return "loss";
             } else {
                 return "draw";
             }
        }
        case 'scissors': {
            if (yours === "rock") {
                return "win";
            } else if (yours === "paper") {
                return "loss";
            } else {
                return "draw";
            }
        }
    }
}

function score(yours: Input, theirs: Input) {
    const result = play(yours, theirs);
    const gameScore = result === 'win' ? 6 : result === 'draw' ? 3 : 0;
    const pieceScore = yours === 'rock' ? 1 : yours === 'paper' ? 2 : 3;
    return gameScore + pieceScore;
}

function parse(lines: string[]) {
  return lines.map(l => {
    const [theirs, yours] = l.split(/\s/).map(piece => getInput(piece));
    return [theirs, yours] as [Input, Input];
  });
}

function solve(lines: string[]) {
  const games = parse(lines);
  const scores = games.map(([theirs, yours]) => score(yours, theirs));
  return it.sum(scores);
}

export default async function run() {
  const input = await readInputAsStrings(INPUT_PATH);
  return solve(input);
}
