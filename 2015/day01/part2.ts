async function readInput(): Promise<string> {
  const file = await Deno.readTextFile("./input.txt");
  return file;
}

function solve(characters: string[]) {
  let floor = 0;

  for (let i = 0; i < characters.length; i++) {
      const ch = characters[i];
      if (ch === "(") floor += 1;
      if (ch === ")") floor -= 1;
  
      if (floor === -1) return (i + 1); // 1-based
  }
}

const chars = (await readInput()).split("");
console.log(solve(chars));

export {};