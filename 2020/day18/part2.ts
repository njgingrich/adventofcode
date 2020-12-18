import _ from 'lodash';
import * as path from "path";

import { readInputAsStrings, sum } from "../util";

function doMath(first: any, op: any, second: any): number {
  switch (op) {
    case '+': return Number(first) + Number(second);
    case '*': return Number(first) * Number(second);
  }
  throw new Error();
}

const PRECISION = {
  '*': 2,
  '+': 3,
  '(': 1
}

function isop(op: string): op is '*' | '+' | '(' {
  return ['*','+','('].includes(op);
}

function prec(op: string) {
  if (!isop(op)) throw new Error();
  return PRECISION[op];
}

function toPostfix(expr: string[]): string[] {
  const stack: string[] = [];
  const list: string[] = [];

  for (let token of expr) {
    if ('0123456789'.includes(token)) {
      list.push(token);
    } else if (token === '(') {
      stack.push(token);
    } else if (token === ')') {
      let popped = stack.pop();
      if (!popped) throw new Error();

      while (popped !== '(') {
        list.push(popped);
        popped = stack.pop();
        if (!popped) throw new Error();
      }
    } else {
      while (!(stack.length === 0) && (prec(stack[stack.length-1]) >= prec(token))) {
        let popped = stack.pop();
        if (!popped) throw new Error();
        list.push(popped);
      }
      stack.push(token);
    }
  }

  while (stack.length > 0) {
    const pop = stack.pop();
    if (!pop) throw new Error();
    list.push(pop);
  }

  return list;
}

function evalPostfix(expr: string[]): number {
  const stack: (string | number)[] = [];
  for (let token of expr) {
    if (token === '*' || token === '+') {
      const second = stack.pop();
      const first = stack.pop();
      if (!first || !second) throw new Error();
      stack.push(doMath(first, token, second));
    } else {
      stack.push(token);
    }
  }

  const res = stack.pop();
  return res as number;
}

function solve(lines: string[]) {
  const results = lines.map(line => {
    const expr = line.split('').filter(el => el !== ' ');
    return evalPostfix(toPostfix(expr));
  });
  return sum(results);
}

export default async function run() {
  const input = await readInputAsStrings(path.join(__dirname, "./input.txt"));
  return solve(input);
}
