import * as it from "iter-tools";
import * as path from "path";

import { readInputAsStrings, sum } from "../util";

type Entry = {
  address: number;
  value: number;
};

function toBinary(num: number): string {
  return (num >>> 0).toString(2);
}

function masked(mask: string, num: string): number {
  let outStr = new Array(36 - num.length).fill("0");
  outStr = outStr.concat(num.split(""));

  for (let i = 35; i >= 0; i--) {
    if (mask[i] !== "X") {
      outStr[i] = mask[i];
    }
  }

  return Number.parseInt(outStr.join(""), 2);
}

function getMask(str: string) {
  return str.slice(7);
}

function parse(line: string): Entry {
  const match = line.match(/mem\[(\d+)\] = (\d+)/);
  if (!match) throw new Error();

  return { address: Number(match[1]), value: Number(match[2]) };
}

function solve(lines: string[]) {
  const memory = new Map<number, number>();

  let mask = getMask(lines[0]);
  for (let line of lines) {
    if (line.startsWith("mask")) {
      mask = getMask(line);
    } else {
      const entry = parse(line);
      const out = masked(mask, toBinary(entry.value));
      // console.log(`Setting mem[${entry.address}] = ${out}`)
      memory.set(entry.address, out);
    }
  }

  return sum(memory.values());
}

export default async function run() {
  const input = await readInputAsStrings(path.join(__dirname, "./input.txt"));
  return solve(input);
}
