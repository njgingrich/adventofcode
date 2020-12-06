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
  return it.max(lines.map(parse).map(getSeatId));
}

const input = await readInput();
console.log(solve(input));

export {};
