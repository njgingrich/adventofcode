async function readInput(): Promise<string> {
  return Deno.readTextFile("./input.txt");
}

const LETTERS = "abcdefghijklmnopqrstuvwxyz";
const letterArray = LETTERS.split("");
const letterMap: Record<string, number> = {};
letterArray.forEach((l, i) => letterMap[l] = i);

function nextLetter(letter: string) {
  const ix = (letterMap[letter] + 1) % 26;
  return letterArray[ix];
}

function increment(pass: string[]) {
  let ix = pass.length - 1;
  while (pass[ix] === "z") {
    ix -= 1;
  }
  for (let i = ix; i < pass.length; i++) {
    pass[i] = nextLetter(pass[i]);
  }
  return pass;
}

function strHasStraight(chars: string[], startIx: number): boolean {
  if (startIx + 2 >= chars.length) return false;
  return (letterMap[chars[startIx + 1]] - letterMap[chars[startIx]] === 1) &&
    (letterMap[chars[startIx + 2]] - letterMap[chars[startIx + 1]] === 1);
}

function hasPair(chars: string[], startIx: number): boolean {
  if (startIx + 1 >= chars.length) return false;
  return chars[startIx] === chars[startIx + 1];
}

function solve(start: string) {
  let currentAttempt = start.split("");
  let isValid = false;

  while (!isValid) {
    let hasStraight = false;
    const pairStartIxs: number[] = [];
    currentAttempt = increment(currentAttempt);

    for (let i = 0; i < currentAttempt.length; i++) {
      if (!hasStraight) {
        hasStraight = strHasStraight(currentAttempt, i);
      }

      if (pairStartIxs.length < 2) {
        if (hasPair(currentAttempt, i)) {
          // if current index is at most 1 away from any pair, then it overlaps
          // so only allow non-overlapping
          if (!pairStartIxs.some((val) => Math.abs(val - i) <= 1)) {
            pairStartIxs.push(i);
          }
        }
      }
    }

    isValid = hasStraight && pairStartIxs.length >= 2;
  }
  return currentAttempt.join("");
}

const input = await readInput();
console.log(solve(input));

export {};
