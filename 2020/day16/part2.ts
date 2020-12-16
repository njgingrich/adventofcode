import * as it from "iter-tools";
import * as path from "path";

import { readInputAsStrings, sum } from "../util";

type Ranges = Record<string, number[][]>;
type BoolRecord = Record<string, boolean>;

function getFieldRanges(lines: string[]): Ranges {
  return lines.reduce<Ranges>((obj, line) => {
    const split = line.split(": ");
    const numbers = split[1].split(" or ").map((s) => s.split("-").map(Number));
    obj[split[0]] = numbers;
    return obj;
  }, {});
}

function getMyTicket(lines: string[]): number[] {
  return lines[1].split(',').map(Number);
}

function getNearbyTickets(lines: string[]): number[][] {
  return lines.slice(1).map(l => l.split(',').map(Number));
}

function isValidForRanges(num: number, ranges: number[][]) {
  return ranges.some((range) => num >= range[0] && num <= range[1]);
}

function hasInvalidTicketNumbers(numbers: number[], ranges: Ranges): boolean {
  return numbers.some(number => {
    return Object.keys(ranges).every(key => !isValidForRanges(number, ranges[key]));
  });
}

function solve(lines: string[]) {
  const ranges = getFieldRanges(lines[0].split("\n"));
  const myTicket = getMyTicket(lines[1].split("\n"));
  const nearbyTickets = getNearbyTickets(lines[2].split("\n"));

  const validTickets = nearbyTickets.filter(t => !hasInvalidTicketNumbers(t, ranges));
  // console.log({ validTickets });

  const store = new Map<number, BoolRecord>();
  // Transform each number on the ticket into a map of whether or not a number is valid for each field
  // i.e. [3,2,5] => [{key1: true, key2: true, key3: false}, ...]
  const validMapping = validTickets.map(ticket => {
    return ticket.map(num => {
      let validities = store.get(num);
      // Memoize already calculated keys
      if (validities === undefined) {
        validities = Object.keys(ranges).reduce<BoolRecord>((obj, k) => {
          obj[k] = isValidForRanges(num, ranges[k]);
          return obj;
        }, {});
        store.set(num, validities);
      }

      return validities;
    });
  });

  // Store the mapping of {key1: ix, key2: ix} to use to lookup the right IX in my ticket
  const keyToIx: Record<string, number> = {};
  const keysToDetermine = Object.keys(ranges);
  
  while (keysToDetermine.length > 0) {
    for (let i = 0; i < validMapping[0].length; i++) {
      // Get the list of field validities for each index and check if that field works for every ticket[ix]
      const mappingForIx = validMapping.map(validities => validities[i]);
      const keysValidForAll = keysToDetermine.filter(key => mappingForIx.map(obj => obj[key]).every(Boolean));

      // We found the one choice, so add it to result and remove it from the list of possibilities.
      if (keysValidForAll.length === 1) {
        // console.log(`Found ${keysValidForAll[0]} as key for ix ${i}, removing from list.`);
        const removeIx = keysToDetermine.findIndex(k => k === keysValidForAll[0]);
        keysToDetermine.splice(removeIx, 1);

        // Add to resulting list
        keyToIx[keysValidForAll[0]] = i;
      }
    }
  }
  
  const depatureKeys = Object.keys(keyToIx).filter(k => k.startsWith('departure'));
  return depatureKeys.reduce((product, key) => product * myTicket[keyToIx[key]], 1);
}

export default async function run() {
  const input = await readInputAsStrings(path.join(__dirname, "./input.txt"), "\n\n");
  return solve(input);
}
