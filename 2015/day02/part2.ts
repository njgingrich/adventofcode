async function readInput(): Promise<string[]> {
  const file = await Deno.readTextFile("./input.txt");
  return file.split("\n").filter(Boolean);
}

function requiredRibbon(l: number, w: number, h: number): number {
    const forBow = l * w * h;
    const nums = ([l, w, h]).sort((a,b) => a - b);
    const forSides = 2 * (nums[0] + nums[1]);

    return forBow + forSides;
}

function solve(lines: string[]) {
  return lines.reduce((sum, line) => {
    const [l, w, h] = line.split("x").map((n) => Number(n));
    return sum + requiredRibbon(l, w, h);
  }, 0);
}

const lines = await readInput();
console.log(solve(lines));

export {};
