import * as it from "iter-tools";
import * as path from "path";

import { readInputAsStrings } from "../util";

const graph: Record<string, string[]> = {};
const output: Record<string, number> = {};

type TypeOp = "NOT" | "LSHIFT" | "RSHIFT" | "AND" | "OR";
// deno-lint-ignore no-explicit-any
const Operations: Record<TypeOp, any> = {
    'NOT'(x: number) {
        return ~x & 0xffff;
    },
    'LSHIFT'(x: number, y: number) {
        return x << y;
    },
    'RSHIFT'(x: number, y: number) {
        return x >> y;
    },
    'AND'(x: number, y: number) {
        return x & y;
    },
    'OR'(x: number, y: number) {
        return x | y;
    },
}

function read(wire: string) {
    if (!isNaN(Number(wire))) return Number(wire);

    if (!output[wire]) {
        let result;
        const ops = graph[wire];

        if (ops.length === 1) {
            result = read(ops[0])
        } else if (ops.length === 2) {
            result = Operations[ops[0] as TypeOp](read(ops[1]))
        } else if (ops.length === 3) {
            result = Operations[ops[1] as TypeOp](read(ops[0]), read(ops[2]));
        }

        output[wire] = result;
    }
    return output[wire];
}

function solve(lines: string[]) {
  lines.forEach((line) => {
    const [operand, result] = line.split(' -> ');
    graph[result] = operand.split(' ');
  });

  console.log(read('a'));
}

export default async function run() {
  const input = await readInputAsStrings(path.join(__dirname, "./input.txt"));
  return solve(input);
}
