import * as it from "iter-tools";
import _ from "lodash";
import * as path from "path";

import { readInputAsStrings } from "../util";

type Board = number[][];
type MarkedBoard = boolean[][];

function solve(
  boards: Board[],
  markedBoards: MarkedBoard[],
  numbers: number[]
) {
  let newMarked = markedBoards;
  let winningBoards = boards.map(_ => false);
  let allWinners = false;
  let lastBoardIx = -1;

  let i = 0;
  while (allWinners === false && i < numbers.length) {
    newMarked = markNumber(numbers[i], boards, newMarked);
    newMarked.forEach((board, i) => {
      if (isWinner(board)) {
        winningBoards[i] = true;
      }
    });
  
    if (winningBoards.filter(v => v === false).length === 1) {
      // track which board is last
      lastBoardIx = winningBoards.findIndex(b => b === false);
    }

    allWinners = winningBoards.every(Boolean);

    if (allWinners === false) {
      i += 1;
    }
  }

  const losingBoard = boards[lastBoardIx];
  const losingMarkedBoard = markedBoards[lastBoardIx];
  const boardSum = sumUnmarked(losingBoard, losingMarkedBoard);

  return boardSum * numbers[i];
}

function parse(lines: string[]): {
  boards: Board[];
  markedBoards: MarkedBoard[];
  numbers: number[];
} {
  let numbers = lines[0].split(",").map(Number);

  let boards = _.chunk(lines.slice(1), 5);
  let numberBoards = boards.map((board) => {
    return board.map((row) => {
      return row.trim().split(/\s+/).map(Number);
    });
  });

  let markedBoards: MarkedBoard[] = numberBoards.map((board) => {
    return board.map((row) => {
      return row.map((val) => false);
    });
  });

  return { boards: numberBoards, markedBoards, numbers };
}

function markNumber(
  number: number,
  boards: Board[],
  markedBoards: MarkedBoard[]
) {
  for (let b = 0; b < boards.length; b++) {
    let board = boards[b];

    for (let r = 0; r < board.length; r++) {
      let row = board[r];

      for (let c = 0; c < row.length; c++) {
        if (row[c] === number) {
          // console.log('Marking a', number, 'at')
          // console.log({b, r, c});
          markedBoards[b][r][c] = true;
        }
      }
    }
  }

  return markedBoards;
}

function sumUnmarked(board: Board, markedBoard: MarkedBoard): number {
  let sum = 0;

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board.length; c++) {
      if (markedBoard[r][c] === false) {
        sum += board[r][c];
      }
    }
  }

  return sum;
}

function isWinner(markedBoard: MarkedBoard) {
  // rows
  for (let row of markedBoard) {
    if (row.filter(Boolean).length === row.length) {
      return true;
    }
  }

  // cols
  let cols = Array.from({ length: markedBoard.length }, (_, i) => i);
  let columns = cols.map((ix) => {
    return markedBoard.map((x) => x[ix]);
  });

  if (columns.some((col) => col.filter(Boolean).length === col.length)) {
    return true;
  }
  return false;
}

export default async function run() {
  const input = await readInputAsStrings(path.join(__dirname, "./input.txt"));
  const { numbers, boards, markedBoards } = parse(input);

  return solve(boards, markedBoards, numbers);
}
