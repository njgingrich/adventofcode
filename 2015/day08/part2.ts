async function readInput(): Promise<string[]> {
  const file = await Deno.readTextFile("./input.txt");
  return file.split("\n").filter(Boolean);
}

function getCodeCharCount(str: string): number {
  return str.length;
}

function getMemoryCharCount(str: string): number {
  const chars = str.split("");
  let count = 0;

  // We can always ignore the open/closing quotes
  for (let i = 1; i < chars.length - 1; i++) {
    const double = str.substring(i, i + 2);
    if (double === "\\\\") {
      i += 1;
    } else if (double === '\\"') {
      i += 1;
    } else if (double === "\\x") {
      i += 3;
    }
    count += 1;
  }

  return count;
}

function getEncodedCharCount(str: string): number {
  const chars = str.split("");
  let count = 6; // The open/closing quotes always will add 6, from " to \" in front and back

  // We can always ignore the open/closing quotes
  for (let i = 1; i < chars.length - 1; i++) {
    const double = str.substring(i, i + 2);
    if (double === "\\\\") {
      count += 4;
      i += 1;
    } else if (double === '\\"') {
      count += 4;
      i += 1;
    } else if (double === "\\x") {
      count += 5;
      i += 3;
    } else {
      count += 1;
    }
  }

  return count;
}

function solve(lines: string[]) {
  let totalCodeCount = 0;
  let totalEncodedCount = 0;

  lines.forEach((line) => {
    totalCodeCount += getCodeCharCount(line);
    totalEncodedCount += getEncodedCharCount(line);
    //   console.log({line, totalCodeCount, totalEncodedCount})
  });

  return totalEncodedCount - totalCodeCount;
}

const lines = await readInput();
console.log(solve(lines));

export {};
