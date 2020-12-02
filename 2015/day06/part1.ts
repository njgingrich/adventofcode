async function readInput(): Promise<string[]> {
  const file = await Deno.readTextFile("./input.txt");
  return file.split("\n").filter(Boolean);
}

const lights: boolean[][] = new Array(1000).fill(false).map(() => new Array<boolean>(1000).fill(false));
const regex = new RegExp(/[a-z\s]+(\d+),(\d+)\s[a-z\s]+(\d+),(\d+)/);

function solve(lines: string[]) {
    lines.forEach(line => {
        const match = line.match(regex);
        if (!match) return false;

        const coord1 = [Number(match[1]), Number(match[2])];
        const coord2 = [Number(match[3]), Number(match[4])];

        const instruction = line.substring(0, 7);
        for (let r = coord1[0]; r <= coord2[0]; r++) {
            for (let c = coord1[1]; c <= coord2[1]; c++) {
                if (instruction === 'turn on') {
                    lights[r][c] = true;
                } else if (instruction === 'turn of') {
                    lights[r][c] = false;
                } else if (instruction === 'toggle ') {
                    lights[r][c] = !lights[r][c];
                }
            }
        }
    });
    
    const sum = lights.reduce((sum, row) => {
        return sum + row.reduce((sum, light) => sum + Number(light), 0);
    }, 0);
    return sum;
}

const lines = await readInput();
console.log(solve(lines));

export {};
