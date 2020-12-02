import { createHash } from "https://deno.land/std@0.79.0/hash/mod.ts";

async function readInput(): Promise<string> {
  return Deno.readTextFile("./input.txt");
}

function solve(data: string) {
    let num = -1;
    let hashOutput = '';

    while (hashOutput.substring(0, 5) !== '00000') {
        num += 1;
        const hash = createHash("md5");
        hash.update(`${data}${num}`);
        hashOutput = hash.toString();
    }

    return num;
}

const data = await readInput();
console.log(solve(data));

export {};
