async function readInput(): Promise<string[]> {
  const file = await Deno.readTextFile("./input.txt");
  return file.split("\n").filter(Boolean);
}

function getCodeCharCount(str: string): number {
    return str.length;
}

function getMemoryCharCount(str: string): number {
    const chars = str.split('');
    let count = 0;

    // We can always ignore the open/closing quotes
    for (let i = 1; i < chars.length - 1; i++) {
        const double = str.substring(i, i + 2);
        if (double === "\\\\") {
            i += 1;
        } else if (double === '\\"') {
            i += 1;
        } else if (double === '\\x') {
            i += 3;
        }
        count += 1;
    }

    return count;
}

function solve(lines: string[]) {
  let totalCodeCount = 0;
  let totalMemoryCount = 0;

  lines.forEach((line) => {
      totalCodeCount += getCodeCharCount(line);
      totalMemoryCount += getMemoryCharCount(line);
    //   console.log({line, totalCodeCount, totalMemoryCount})
  });

  return totalCodeCount - totalMemoryCount;
}

const lines = await readInput();
console.log(solve(lines));

export {};
