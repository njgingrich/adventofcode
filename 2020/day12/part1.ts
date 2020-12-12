import * as it from "iter-tools";
import * as path from "path";

import { readInputAsStrings } from "../util";

type Dir = 'N' | 'S' | 'E' | 'W';
type Command = Dir | 'F' | 'L' | 'R';
type Ship = {
  facing: Dir,
  route: Record<Dir, number>
}

const COMMANDS = ['N', 'S', 'E', 'W', 'F', 'L', 'R'];

function assertIsCommand(d: string): asserts d is Command {
  if (!COMMANDS.includes(d)) throw new Error();
}

function solve(lines: string[]) {
  const ship: Ship = { facing: 'E', route: { N: 0, S: 0, E: 0, W: 0} };
  lines.forEach(line => {
    const match = line.match(/(\w)(\d+)/);
    if (!match) throw new Error();
    const count = Number(match[2]);
    let dir = match[1];
    assertIsCommand(dir);

    if (dir === 'F') {
      // console.log(`Moving FORWARD. Facing ${ship.facing}, moving ${count} units.`);
      ship.route[ship.facing] += count;
    } else if (dir === 'L') { // E -> N -> W -> S -> E
      const order: Dir[] = ['E', 'N', 'W', 'S'];
      const ix = order.indexOf(ship.facing);
      const newIx = (ix + count / 90) % order.length;
      // console.log(`Rotating LEFT. Was facing ${ship.facing}, now facing ${order[newIx]}.`)
      ship.facing = order[newIx];
    } else if (dir === 'R') { // E -> S -> W -> N -> E
      const order: Dir[] = ['E', 'S', 'W', 'N'];
      const ix = order.indexOf(ship.facing);
      const newIx = (ix + count / 90) % order.length;
      // console.log(`Rotating RIGHT. Was facing ${ship.facing}, now facing ${order[newIx]}.`)
      ship.facing = order[newIx];
    } else {
      ship.route[dir] += count;
    }

    // console.log(ship.route);
  });

  return (Math.abs(ship.route.N - ship.route.S) + Math.abs(ship.route.E - ship.route.W));
}

export default async function run() {
  const input = await readInputAsStrings(path.join(__dirname, "./input.txt"));
  return solve(input);
}
