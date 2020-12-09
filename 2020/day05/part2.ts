import * as it from "iter-tools";
import * as path from "path";

import { readInputAsStrings } from "../util";

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
  const asNumberStr = str.replace(/[FL]/g, "0").replace(/[BR]/g, "1");
  return parseInt(asNumberStr, 2);
}

function getSeatId(ticket: Ticket): number {
  return ticket.row * 8 + ticket.col;
}

function solve(lines: string[]) {
  const seatIds = lines.map(parse).map(getSeatId);
  seatIds.sort((a,b) => a-b);

  for (let i = 0; i < seatIds.length; i++) {
      if (seatIds[i+1] - seatIds[i] > 1) {
          return seatIds[i] + 1;
      }
  }
}

export default async function run() {
  const input = await readInputAsStrings(path.join(__dirname, "./input.txt"));
  return solve(input);
}
