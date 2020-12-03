async function readInput(): Promise<string> {
  const file = await Deno.readTextFile("./input.txt");
  return file;
}

function solve(characters: string[]) {
    let floor = 0;
    characters.forEach(ch => {
        if (ch === '(') floor += 1;
        if (ch === ')') floor -= 1;
    });

    return floor;
}

const chars = (await readInput()).split("");
console.log(solve(chars));

export {};