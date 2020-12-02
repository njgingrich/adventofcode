async function readInput(): Promise<string[]> {
  const file = await Deno.readTextFile("./input.txt");
  return file.split("\n").filter(Boolean);
}

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

const lines = await readInput();
console.log(solve(lines));

export {};
