import * as it from "iter-tools";
import * as path from "path";

import { max, readInputAsNumbers, sum } from "../util";

function isValid(array: number[]) {
  for (let i = 1; i < array.length; i++) {
    const prev = array[i-1];
    const item = array[i];
    if (item - prev !== 1 && item - prev !== 3) {
      return false;
    }
  }

  return true;
}

// Too slow
// function getSolutions(joltages: number[]) {
//   const solutions: number[][] = [];
//   const builtIn = joltages[joltages.length - 1];

//   function backtrack(candidate: number[], ix: number) {
//     // Fail case
//     if (candidate.length >= 2) {
//       const diff = candidate[candidate.length - 1] - candidate[candidate.length - 2];
//       if (diff !== 1 && diff !== 2 && diff !== 3) return;
//     }

//     // Success case - built a full solution
//     // console.log('candidate:', candidate);
//     if (candidate[candidate.length - 1] === builtIn) {
//       solutions.push(candidate);
//       return;
//     }

//     // Still working
//     let nextCandidate;
//     for (let i = ix; i < joltages.length; i++) {
//       const item = joltages[i];

//       nextCandidate = [...candidate, item];
//       // console.log('Next candidate:', nextCandidate);
//       backtrack(nextCandidate, ix + 1);
//       nextCandidate = [...candidate];
//     }
//   }

//   backtrack([joltages[0]], 1)
//   return solutions.length;
// }

function countPossibilities(adapters: number[]) {
  const counts = new Map<number, number>();

  function differenceSums(num: number) {
    return sum([num + 1, num + 2, num + 3].map(el => counts.get(el) || 0))
  }

  counts.set(adapters[adapters.length - 1], 1);
  for (let i = adapters.length - 2; i >= 0; i--) {
    const adapter = adapters[i];
    counts.set(adapter, differenceSums(adapter));
  }

  return differenceSums(0);
}

function solve(adapters: number[]) {
  adapters = adapters.sort((a, b) => a - b);
  const builtIn = adapters[adapters.length - 1] + 3;
  adapters.push(builtIn);

  // console.log(adapters);
  return countPossibilities(adapters);
}

export default async function run() {
  const input = await readInputAsNumbers(path.join(__dirname, "./input.txt"));
  return solve(input);
}
