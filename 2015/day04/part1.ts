import * as it from "iter-tools";
import * as path from "path";
import { createHash } from "crypto";

import { readInput } from "../util";

function solve(data: string) {
    let num = -1;
    let hashOutput = '';

    while (hashOutput.substring(0, 5) !== '00000') {
        num += 1;
        const hash = createHash("md5");
        hash.update(`${data}${num}`);
        hashOutput = hash.digest('hex');
    }

    return num;
}

export default async function run() {
  const input = await readInput(path.join(__dirname, "./input.txt"));
  return solve(input);
}
