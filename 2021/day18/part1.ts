import * as it from "itertools";
import * as path from "path";

import { readInputAsStrings } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

function explode(nodes: Node[]): boolean {
  let prev = nodes[0];

  for (let i = 1; i < nodes.length; i++) {
    const current = nodes[i];
    
    const prevDepth = prev.left + prev.right;
    if (prevDepth > 4 && prev.left - 1 === current.left && prev.right + 1 === current.right) {
      // add to left
      if (i - 2 >= 0) {
        nodes[i-2].value += nodes[i-1].value;
      }
      // add to right
      if (i + 1 < nodes.length) {
        nodes[i+1].value += nodes[i].value;
      }
      // replace it
      nodes.splice(i - 1, 2, { left: current.left, right: prev.right, value: 0 });
      return true;
    }
    prev = current;
  }

  return false;
}

function split(nodes: Node[]): boolean {
  const i = nodes.findIndex(node => node.value >= 10);
  if (i < 0) return false;

  const n = nodes[i];
  const newLeft = { left: n.left + 1, right: n.right, value: Math.floor(n.value / 2) };
  const newRight = { left: n.left, right: n.right + 1, value: Math.ceil(n.value / 2) };

  nodes.splice(i, 1, newLeft, newRight);
  return true;
}

function add(first: Node[], second: Node[]): Node[] {
  const combined = [
    ...first.map(({ left, right, value}) => ({ left: left+1, right, value })),
    ...second.map(({ left, right, value}) => ({ left, right: right+1, value })),
  ];

  while (explode(combined) || split(combined));
  return combined;
}

function magnitude(node: Node) {
  return 3 ** node.left * 2 ** node.right * node.value;
}

interface Node {
  left: number;
  right: number;
  value: number;
}

function parsePairs(input: string) {
  let pairs: Node[] = [];
  let left = 0;
  let right = 0;

  for (let ch of input) {
    switch (ch) {
      case '[':
        left++;
        break;
      case ']':
        right--;
        break;
      case ',':
        left--;
        right++;
        break;
      default:
        pairs.push({ left, right, value: Number(ch) });
    }
  }

  return pairs;
}

export default async function run() {
  const input = await readInputAsStrings(INPUT_PATH);
  return input
    .map(line => parsePairs(line))
    .reduce((a, b) => add(a, b))
    .reduce((sum, node) => sum + magnitude(node), 0);
}
