async function readInput(): Promise<string[]> {
  const file = await Deno.readTextFile("./input.txt");
  return file.split("").filter(Boolean);
}

const map: Record<Direction, "n" | "s" | "e" | "w"> = {
  '^': 'n',
  "v": 's',
  ">": 'e',
  "<": 'w',
}

type Direction = "^" | "v" | ">" | "<";

function solve(directions: Direction[]) {
  const pos = { n: 0, s: 0, e: 0, w: 0 };
  const coords: Record<string, number> = {};

  directions.forEach((dir: Direction) => {
    pos[map[dir]] += 1;
    const coord = `${pos.n - pos.s}:${pos.e - pos.w}`;
    const existing = coords[coord];
    coords[coord] = existing ? existing + 1 : 1;
  });

  return Object.keys(coords).length;
}

const dirs = await readInput();
console.log(solve(dirs as Direction[]));

export {};
