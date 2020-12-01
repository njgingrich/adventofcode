export async function readInput(): Promise<string[]> {
    const file = await Deno.readTextFile("./input.txt");
    return file.split('\n').filter(Boolean);
}

function solve(): number {
    for (let i = 0; i < numbers.length; i++) {
        for (let j = i; j < numbers.length; j++) {
            if (numbers[i] + numbers[j] === 2020) {
                console.log(`${numbers[i]} and ${numbers[j]}`)
                return numbers[i] * numbers[j];
            }
        }
    }
    return -1;
}

const numbers = (await readInput()).map((n) => Number(n));
console.log(solve());
