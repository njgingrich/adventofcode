import { run } from "aocrunner";
import { parse, SEPARATOR } from "@std/path";
import Grid, { type Coord } from "../util/grid.ts";

type Direction = "N" | "E" | "S" | "W";
type Position = "^" | ">" | "v" | "<";
const DIRECTIONS = ["N", "E", "S", "W"] as const;
const POSITIONS = ["^", ">", "v", "<"] as const;

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

function parseInput(rawInput: string): { guard: Coord; grid: Grid<string> } {
  const grid = Grid.fromArray(rawInput.split("\n").map((line) => line.split("")), {
    getDefault: () => ".",
  });
  const guardRes = grid.findFirstWhere((cell) => grid.getByCoord(cell) === "^");
  if (!guardRes) {
    throw new Error("no guard found");
  }

  return { guard: guardRes[1], grid };
}

function getOffsetForDir(direction: Direction): [-1 | 0 | 1, -1 | 0 | 1] {
  switch (direction) {
    case "N":
      return [0, -1];
    case "E":
      return [1, 0];
    case "S":
      return [0, 1];
    case "W":
      return [-1, 0];
  }
}

function getNextPos(currentDir: Direction): Position {
  const dirIx = DIRECTIONS.indexOf(currentDir);
  return POSITIONS[(dirIx + 1) % POSITIONS.length];
}

function getPosition(direction: Direction): Position {
  return POSITIONS[DIRECTIONS.indexOf(direction)];
}

function getDirection(grid: Grid<string>, guard: Coord): Direction {
  const pos = grid.getByCoord(guard);
  const posIx = POSITIONS.indexOf(pos as Position);
  return DIRECTIONS[(posIx) % DIRECTIONS.length];
}

function isObstructed(grid: Grid<string>, coord: Coord): boolean {
  return grid.getByCoord(coord) === "#";
}

function getRoute(grid: Grid<string>, guard: Coord, direction: Direction): {route: Coord[], done: boolean} {
  // console.log(`Get route for [${guard}], heading ${direction}`)
  const offset = getOffsetForDir(direction);
  const route = [guard];

  while (true) {
    const current: Coord = [...route[route.length - 1]];
    const next: Coord = [current[0] + offset[0], current[1] + offset[1]];

    if (!grid.inBoundsCoord(next)) {
      return {route, done: true};
    }

    if (isObstructed(grid, next)) {
      return {route, done: false};
    }
    route.push(next);
  }
}

function move(grid: Grid<string>, guard: Coord): {done: boolean, guard: Coord, route: Coord[]} {
  const currentDir = getDirection(grid, guard);
  // console.log(`Moving from [${guard}], heading ${currentDir}`)
  const offset = getOffsetForDir(currentDir);
  // something in front?
  const inFront: Coord = [guard[0] + offset[0], guard[1] + offset[1]];
  // console.log(`Obstruction for [${inFront}]? ${isObstructed(grid, inFront)}`)

  if (isObstructed(grid, inFront)) {
    // turn right 90deg!
    grid.setCoord(guard, getNextPos(currentDir));
    return {done: false, guard, route: []};
  }

  // move in current direction
  const {route, done} = getRoute(grid, guard, currentDir);
  for (const coord of route) {
    grid.setCoord(coord, 'X');
  }

  // Removing it from the route we return
  const newGuard = route.pop() as Coord;
  if (!done) {
      grid.setCoord(newGuard, getPosition(currentDir));
  }

  return {done, guard: newGuard, route};
}

function part1(rawInput: string) {
  const { grid, guard } = parseInput(rawInput);

  let done = false;
  let guardPos: Coord = [...guard];

  while (!done) {
    const moved = move(grid, guardPos);
    done = moved.done;
    guardPos = moved.guard;
  }

  // console.log(grid.toString());
  return grid.findWhere((cell) => grid.getByCoord(cell) === 'X').length;
}

function part2(rawInput: string) {
  const {grid, guard} = parseInput(rawInput);
  let loops = 0;

  for (let x = 0; x < grid.width(); x++) {
    for (let y = 0; y < grid.height(); y++) {
      const testGrid = grid.clone();
      const coord: Coord = [x, y];

      if (coord[0] === guard[0] && coord[1] === guard[1]) {
        continue; // can't be guard's start position
      }

      // Try obstacle
      if (testGrid.getByCoord(coord) === '.') {
        // console.log(`Setting obstacle at [${coord}]`)
        testGrid.setCoord(coord, '#');
      } else {
        // console.log(`Skipping [${coord}]`)
        continue;
      }

      let done = false;
      let guardPos: Coord = [...guard];
      const totalRoute: Coord[] = [];

      while (!done) {
        const moved = move(testGrid, guardPos);
        done = moved.done;
        guardPos = moved.guard;
        totalRoute.push(...moved.route);

        // max loop size is a loop around the grid, so ~w*h*w*h
        // this is not a great loop detection system but it should do the trick
        if (totalRoute.length > 2 * testGrid.width() * testGrid.height()) {
          loops++;
          break;
        }
      }
    }
  }

  return loops;
}

run({
  part1: {
    tests: [
      {
        input: `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`,
        expected: 41,
      },
    ],
    solver: part1,
    solve: false,
  },
  part2: {
    tests: [
      {
        input: `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`,
        expected: 6,
      },
    ],
    solver: part2,
    solve: true,
  },
  input: await getRawInput(),
  day: getDay(),
});
