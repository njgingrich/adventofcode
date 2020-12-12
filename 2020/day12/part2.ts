import * as it from "iter-tools";
import * as path from "path";

import { readInputAsStrings } from "../util";

type Dir = 'N' | 'S' | 'E' | 'W';
type Command = Dir | 'F' | 'L' | 'R';
type Ship = {
  route: Record<Dir, number>
}

enum D {
  N = 0,
  E,
  S,
  W
}

const COMMANDS = ['N', 'S', 'E', 'W', 'F', 'L', 'R'];
function assertIsCommand(d: string): asserts d is Command {
  if (!COMMANDS.includes(d)) throw new Error();
}

function solve(lines: string[]) {
  const ship: Ship = { route: { N: 0, S: 0, E: 0, W: 0} };
  let waypoint = [1, 10, 0, 0]; // N E S W offset from ship

  lines.forEach(line => {
    const match = line.match(/(\w)(\d+)/);
    if (!match) throw new Error();
    const count = Number(match[2]);
    let dir = match[1];
    assertIsCommand(dir);

    if (dir === 'F') {
      ship.route.N += waypoint[D.N] * count;
      ship.route.S += waypoint[D.S] * count;
      ship.route.E += waypoint[D.E] * count;
      ship.route.W += waypoint[D.W] * count;

    } else if (dir === 'L') { // COUNTER-CLOCKWISE: E -> N -> W -> S -> E
      // we want to shift the array left, i.e. [N, E, S, W] to [E, S, W, N]
      const change = count / 90;
      waypoint = [
        ...waypoint.slice(change),
        ...waypoint.slice(0, change),
      ];
      
    } else if (dir === 'R') { // CLOCKWISE: E -> S -> W -> N -> E
      // we want to shift the array right, i.e. [N, E, S, W] to [W, N, E, S]
      const change = count / 90;
      waypoint = [
        ...waypoint.slice(4 - change),
        ...waypoint.slice(0, (4 - change)),
      ];
    } else {
      waypoint[D[dir]] += count;
    }
  });

  return (Math.abs(ship.route.N - ship.route.S) + Math.abs(ship.route.E - ship.route.W));
}

export default async function run() {
  const input = await readInputAsStrings(path.join(__dirname, "./input.txt"));
  return solve(input);
}
