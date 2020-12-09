import * as it from "iter-tools";
import * as path from "path";

import { max, readInputAsStrings } from "../util";

type Ticket = {
  row: number;
  col: number;
};

function parse(str: string): Ticket {
  const rowStr = str.slice(0, 7);
  const colStr = str.slice(7);
  return {
    row: toBoolThenNumber(rowStr),
    col: toBoolThenNumber(colStr),
  };
}

function toBoolThenNumber(str: string): number {
  const asNumberStr = str
    .replace(/[FL]/g, "0")
    .replace(/[BR]/g, "1");
  return parseInt(asNumberStr, 2);
}

function getSeatId(ticket: Ticket): number {
  return ticket.row * 8 + ticket.col;
}

function solve(lines: string[]) {
  return max(lines.map(parse).map(getSeatId));
}

export default async function run() {
  const input = await readInputAsStrings(path.join(__dirname, "./input.txt"));
  return solve(input);
}
