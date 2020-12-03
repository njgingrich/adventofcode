async function readInput(): Promise<string> {
  return Deno.readTextFile("./input.txt");
}

function solve(start: string, count: number) {
    let output = start;
    
    for (let num = 0; num < count; num++) {
        const newOutput: string[] = [];
        const chars = output.split('');
        let currentChar = chars[0];
        let charCount = 0;

        for (let i = 0; i < chars.length; i++) {
            if (chars[i] !== currentChar) {
                newOutput.push(`${charCount}`, currentChar);
                currentChar = chars[i];
                charCount = 1;
            } else {
                charCount += 1;
            }
        }
        newOutput.push(`${charCount}`, currentChar);

        output = newOutput.join('');
    }

    return output.length;
}

const input = await readInput();
console.log(solve(input, 40));

export {};
