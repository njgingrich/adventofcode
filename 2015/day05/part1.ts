import * as it from "iter-tools";
import * as path from "path";

import { readInputAsStrings } from "../util";

const vowels = ['a', 'e', 'i', 'o', 'u'];
const badPairs = ['ab', 'cd', 'pq', 'xy'];

function isNice(word: string) {
    const chars = word.split('');
    let vowelCount = 0;
    let hasPair = false;

    for (let i = 0; i < chars.length; i++) {
        if (badPairs.includes(word.substring(i, i + 2))) return false;

        const ch = chars[i];
        if (vowels.includes(ch)) vowelCount++;
        if (chars[i+1] === ch) hasPair = true;

    }
    if (vowelCount >= 3 && hasPair) {
        return true;
    }

    return false;
}

function solve(lines: string[]) {
    return lines.filter(isNice).length;
}

export default async function run() {
  const input = await readInputAsStrings(path.join(__dirname, "./input.txt"));
  return solve(input);
}
