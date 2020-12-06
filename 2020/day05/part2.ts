import * as it from "https://cdn.pika.dev/itertools@1.6.1";

async function readInput(): Promise<string[]> {
  const file = await Deno.readTextFile("./input.txt");
  return file.split("\n").filter(Boolean);
}

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
    .replaceAll("F", "0")
    .replaceAll("B", "1")
    .replaceAll("L", "0")
    .replaceAll("R", "1");
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

const input = await readInput();
console.log(solve(input));

export {};
