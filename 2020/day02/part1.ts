import * as it from "iter-tools";
import * as path from "path";

import { readInputAsStrings } from "../util";

type PasswordLine = {
    min: number,
    max: number,
    letter: string,
    password: string,
}

const regex = new RegExp(/(\d+)-(\d+)\s(\w):\s(\w+)/);
function toPasswordLine(line: string): PasswordLine {
    const match = line.match(regex);
    if (match == null) throw new Error();
    
    return {
        min: Number(match[1]),
        max: Number(match[2]),
        letter: match[3],
        password: match[4],
    }
}

function solve(lines: string[]) {
  const passwordLines = lines.map(toPasswordLine);
  let numCorrect = 0;

  passwordLines.forEach(line => {
      const numLettersInPass = line.password.split('').reduce((sum, letter) => (letter === line.letter) ? sum += 1 : sum, 0);
        if (numLettersInPass <= line.max && numLettersInPass >= line.min) {
            numCorrect += 1;
        }
  })

  return numCorrect;
}

export default async function run() {
  const input = await readInputAsStrings(path.join(__dirname, "./input.txt"));
  return solve(input);
}
