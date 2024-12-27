import { run } from "aocrunner";
import { parse, SEPARATOR } from "@std/path";

import Grid, { type Coord } from "../util/grid.ts";

function getRawInput(): Promise<string> {
  return Deno.readTextFile("input.txt");
}

function getDay(): number {
  // TODO: extract to util function we import
  const module = import.meta.url;
  const parsed = parse(module);
  const dayString = parsed.dir.split(SEPARATOR).pop() ?? "";
  return Number(dayString.slice(-2));
}

const INSTRUCTIONS = ["v", "^", "<", ">"] as const;
type Instruction = "v" | "^" | "<" | ">";

function parseInput(rawInput: string, width: 1 | 2): { grid: Grid<string>; instructions: Instruction[] } {
  const [gridStr, instructionsStr] = rawInput.split("\n\n");
  const instructions = instructionsStr.split("").filter((c) =>
      INSTRUCTIONS.includes(c as Instruction)
    ) as Instruction[];

  if (width === 1) {
    const grid = Grid.fromArray(
      gridStr.split("\n").map((row) => row.split("")),
      { getDefault: () => "#" },
    );
    return {grid, instructions}
  } else if (width === 2) {
    const grid = new Grid<string>({getDefault: () => "#"});
    const arr = gridStr.split("\n").map((row) => row.split(""));
    let gridX = 0;

    for (let y = 0; y < arr.length; y++) {
      gridX = 0;
      for (let x = 0; x < arr[y].length; x++) {

        if (arr[y][x] === "@") {
          grid.set(gridX, y, "@");
          grid.set(gridX + 1, y, ".");
        } else if (arr[y][x] === "O") {
          grid.set(gridX, y, "[");
          grid.set(gridX + 1, y, "]");
        } else if (arr[y][x] === "#") {
          grid.set(gridX, y, "#");
          grid.set(gridX + 1, y, "#");
        } else if (arr[y][x] === ".") {
          grid.set(gridX, y, ".");
          grid.set(gridX + 1, y, ".");
        } else {
          throw new Error(`Unknown character: ${arr[x][y]}`);
        }

        gridX += 2;
      }
    }

    return {
      grid,
      instructions,
    };
  } else {
    throw new Error(`Unknown width: ${width}`);
  }
}

function getNewPosition(coord: Coord, instruction: Instruction): Coord {
  switch (instruction) {
    case "^":
      return [coord[0], coord[1] - 1];
    case "v":
      return [coord[0], coord[1] + 1];
    case "<":
      return [coord[0] - 1, coord[1]];
    case ">":
      return [coord[0] + 1, coord[1]];
  }
}

function canMove(coord: Coord, instruction: Instruction, grid: Grid<string>, searched: Set<string>): {val: boolean, searched: Set<string>} {
  const coordStr = Grid.coordToId(coord);
  if (searched.has(coordStr)) {
    return {val: true, searched};
  }
  searched.add(coordStr);

  const newPos = getNewPosition(coord, instruction);
  const newCell = grid.getByCoord(newPos);
  // console.log(`Can move? [${coord}] -> [${newPos}] = ${newCell}`);
  switch (newCell) {
    case '#': return {val: false, searched};
    case '[': {
      const rightSide: Coord = [newPos[0] + 1, newPos[1]];
      const same = canMove(newPos, instruction, grid, searched)
      const right = canMove(rightSide, instruction, grid, searched);
      return {val: same.val && right.val, searched};
    }
    case ']': {
      const leftSide: Coord = [newPos[0] - 1, newPos[1]];
      // console.log(`Checking [${leftSide}] and [${newPos}] for ${newCell}`);
      const same = canMove(newPos, instruction, grid, searched)
      const left = canMove(leftSide, instruction, grid, searched);
      return {val: same.val && left.val, searched};
    }
    case 'O': return canMove(newPos, instruction, grid, searched);
  }

  return {val: true, searched};
}



function move(robot: Coord, instruction: Instruction, grid: Grid<string>) {
  const newPos = getNewPosition(robot, instruction);
  const newCell = grid.getByCoord(newPos);

  if (!grid.inBoundsCoord(newPos) || newCell === '#') return robot;
  if (newCell === 'O' || newCell === '[' || newCell === ']') {
    const {val, searched} = canMove(robot, instruction, grid, new Set<string>());
    if (val === false) return robot;

    while (searched.size > 0) {
      for (const str of searched) {
        const coord = Grid.asCoord(str);
        const newPos = getNewPosition(coord, instruction);

        if (!searched.has(Grid.coordToId(newPos))) {
          if (grid.getByCoord(newPos) !== '@' && grid.getByCoord(coord) !== '@') {
            grid.setCoord(newPos, grid.getByCoord(coord));
            grid.setCoord(coord, '.');
          }
          searched.delete(str);
        }
      }
    }
  }

  const temp = grid.getByCoord(robot);
  grid.setCoord(robot, grid.getByCoord(newPos));
  grid.setCoord(newPos, temp);
  return newPos;
}

function sumGps(grid: Grid<string>) {
  let sum = 0;
  for (const [coord, val] of grid.entries()) {
    if (val === "O" || val === "[") {
      const c = Grid.asCoord(coord);
      // console.log(`Box at [${coord}] - sum += ${c[0]} + 100 * ${c[1]}`);
      sum += c[0] + 100 * c[1];
    }
  }

  return sum;
}

function part1(rawInput: string) {
  const { grid, instructions } = parseInput(rawInput, 1);
  let robot = grid.findFirstWhere((el) => grid.getByCoord(el) === "@")![1];

  for (const instruction of instructions) {
    // console.log(`Moving robot [${robot}] ${instruction}`);
    robot = move(robot, instruction, grid);
  }

  return sumGps(grid);
}

function part2(rawInput: string) {
  const {grid, instructions} = parseInput(rawInput, 2);
  let robot = grid.findFirstWhere((el) => grid.getByCoord(el) === "@")![1];

  for (const instruction of instructions) {
    // console.log(`Moving robot [${robot}] ${instruction}`);
    robot = move(robot, instruction, grid);
  }

  return sumGps(grid);
}

run({
  part1: {
    tests: [
      {
        input: `########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<
`,
        expected: 2028,
      },
      {
        input: `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^
`,
        expected: 10092,
      },
    ],
    solver: part1,
    solve: true,
  },
  part2: {
    tests: [
      {
        input: `#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<^^<<^^
`,
        expected: 0,
      },
      {
        input: `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^
`,
        expected: 9021,
      },
    ],
    solver: part2,
    solve: true,
  },
  input: await getRawInput(),
  day: getDay(),
});
