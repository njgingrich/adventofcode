async function readInput(): Promise<string[]> {
  const file = await Deno.readTextFile("./input.txt");
  return file.split("\n").filter(Boolean);
}

function isNice(word: string) {
  const chars = word.split("");
  let hasPair = false;
  let hasPalindrome = false;

  // We can go to chars.length - 1 because we always look at i+1 anyway but don't
  // need to look at it directly.
  for (let i = 0; i < chars.length - 1; i++) {
    if (!hasPair) {
      const pair = word.substring(i, i + 2);
      const otherPairIx = word.indexOf(pair);

      hasPair = otherPairIx >= 0 && (otherPairIx + 1) < i;
    }

    if (!hasPalindrome) {
      const triple = word.substring(i - 1, i + 2).split("");
      if (triple.length !== 3) continue;
      hasPalindrome = triple[0] === triple[2];
    }
  }

  if (hasPair && hasPalindrome) return true;
  return false;
}

function solve(lines: string[]) {
  return lines.filter(isNice).length;
}

const lines = await readInput();
console.log(solve(lines));

export {};
