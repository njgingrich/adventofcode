import * as it from "iter-tools";
import * as path from "path";

import { readInputAsStrings, sum } from "../util";

type Ranges = Record<string, number[][]>

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

function invalidTicketNumbers(numbers: number[], ranges: Ranges): number[] {
  return numbers.filter(number => {
    return Object.keys(ranges).every(key => !isValidForRanges(number, ranges[key]));
  });
}

function solve(lines: string[]) {
  const ranges = getFieldRanges(lines[0].split('\n'));
  const myTicket = getMyTicket(lines[1].split('\n'));
  const nearbyTickets = getNearbyTickets(lines[2].split("\n"));

  const invalid: number[] = [];
  for (let ticket of nearbyTickets) {
    const invalidNums = invalidTicketNumbers(ticket, ranges);
    // console.log('invalid for ticket:', invalidNums);
    invalid.push(...invalidNums);
  }
  return sum(invalid);
}

export default async function run() {
  const input = await readInputAsStrings(path.join(__dirname, "./input.txt"), "\n\n");
  return solve(input);
}
