import _ from 'lodash';
import * as path from "path";

import { readInputAsStrings, sum } from "../util";

function doMath(first: string | number, op: any, second: any): number {
  switch (op) {
    case '+': return Number(first) + Number(second);
    case '-': return Number(first) - Number(second);
    case '*': return Number(first) * Number(second);
  }
  throw new Error();
}

function evalExpr(expr: (string | number)[]): number {
  let result = Number(expr[0]);
  for (let i = 1; i < expr.length - 1; i += 2) {
    result = doMath(result, expr[i], expr[i+1]);
  }
  return result;
}

function getParenEndIx(expr: string[], startIx: number) {
  let parenCount = 1;
  for (let i = startIx; i < expr.length; i++) {
    if (expr[i] === '(') parenCount += 1;
    if (expr[i] === ')') parenCount -= 1;
    if (parenCount === 0) return i;
  }

  return expr.length - 1;
}

function parse(expr: string[]): number {
  let result: (string | number)[] = [];

  for (let i = 0; i < expr.length; i += 1) {
    if (expr[i] === '(') {
      const endIx = getParenEndIx(expr, i + 1);
      const slice = expr.slice(i + 1, endIx);

      const parsed = parse(slice);
      result.push(parsed);
      i += slice.length + 1;
    } else {
      result.push(expr[i]);
    }
  }

  return evalExpr(result);
}

function solve(lines: string[]) {
  const results = lines.map(line => {
    const expr = line.split('').filter(el => el !== ' ');
    return parse(expr);
  });
  return sum(results);
}

export default async function run() {
  const input = await readInputAsStrings(path.join(__dirname, "./input.txt"));
  return solve(input);
}
