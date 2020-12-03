import * as it from "https://cdn.pika.dev/itertools@1.6.1";

async function readInput(): Promise<string[]> {
  const file = await Deno.readTextFile("./input.txt");
  return file.split('\n').filter(Boolean);
}

type ParsedData = {
    from: string,
    toward: string,
    happiness: number,
}

function parseLine(line: string): ParsedData {
    const split = line.split(' ');
    return {
        from: split[0],
        toward: split[10].substring(0, split[10].length - 1),
        happiness: Number(split[3]) * (split[2] === 'lose' ? -1 : 1),
    }
}

function solve(lines: string[]) {
    const data = lines.map(parseLine);
    const people = new Set(data.map(d => d.from));
    const permutations: string[][] = it.permutations(people);

    const sentiments: Record<string, Record<string, number>> = {};
    data.forEach(row => {
        if (!sentiments[row.from]) sentiments[row.from] = {};
        sentiments[row.from][row.toward] = row.happiness;
    });

    const happinesses = [];
    for (const p of permutations) {
        let totalHappiness = 0;
        for (let i = 0; i < p.length; i++) {
            const towardIx = (i + 1) % p.length; // loop over to front
            const from = p[i];
            const toward = p[towardIx];
            
            totalHappiness += sentiments[from][toward];
            totalHappiness += sentiments[toward][from];
        }

        // console.log(p, totalHappiness);
        happinesses.push(totalHappiness);
    }

    return Math.max(...happinesses);
}

const input = await readInput();
console.log(solve(input));

export {};
