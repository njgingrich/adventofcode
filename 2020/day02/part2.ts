async function readInput(): Promise<string[]> {
  const file = await Deno.readTextFile("./input.txt");
  return file.split("\n").filter(Boolean);
}

type PasswordLine = {
  firstIx: number;
  lastIx: number;
  letter: string;
  password: string;
};

const regex = new RegExp(/(\d+)-(\d+)\s(\w):\s(\w+)/);
function toPasswordLine(line: string): PasswordLine {
  const match = line.match(regex);
  if (match == null) throw new Error();

  return {
    firstIx: Number(match[1]),
    lastIx: Number(match[2]),
    letter: match[3],
    password: match[4],
  };
}

function solve(lines: string[]) {
  const passwordLines = lines.map(toPasswordLine);
  let numCorrect = 0;

  passwordLines.forEach((line) => {
    const atFirstPos = line.password.charAt(line.firstIx - 1) === line.letter;
    const atLastPos = line.password.charAt(line.lastIx - 1) === line.letter;

    if (atFirstPos && !atLastPos || !atFirstPos && atLastPos) numCorrect += 1;
  });

  return numCorrect;
}

const lines = await readInput();
console.log(solve(lines));

export {};
