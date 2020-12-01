async function readInput(): Promise<string[]> {
  const file = await Deno.readTextFile("./input.txt");
  return file.split('\n').filter(Boolean);
}

function requiredpaper(l: number, w: number, h: number): number {
    const surfaceArea = 2 * ((l * w) + (w * h) + (h * l));
    const smallestArea = Math.min((l * w), (w * h), (h * l));
    return surfaceArea + smallestArea;
}

function solve(lines: string[]) {
    return lines.reduce((sum, line) => {
        const [l, w, h] = line.split('x').map(n => Number(n));
        return sum + requiredpaper(l, w, h);
    }, 0);
}

const lines = await readInput();
console.log(solve(lines));

export {};
