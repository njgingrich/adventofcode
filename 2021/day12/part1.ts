import * as it from "itertools";
import * as path from "path";

import { readInputAsStrings } from "../util";

type AdjacencyList = Record<string, string[]>;

const INPUT_PATH = path.join(__dirname, "./input.txt");

const IsUpper = new RegExp(/[A-Z]/);

function parse(lines: string[]) {
  const adjacencyList: AdjacencyList = {};

  for (let line of lines) {
    const [a, b] = line.split("-");
    if (Array.isArray(adjacencyList[a])) {
      adjacencyList[a].push(b);
    } else {
      adjacencyList[a] = [b];
    }

    if(Array.isArray(adjacencyList[b])) {
      adjacencyList[b].push(a);
    } else {
      adjacencyList[b] = [a];
    }
  }

  return adjacencyList;
}

function pathfind(nodes: AdjacencyList, cave: string, history: string[] = []) {
  let results: string[][] = [];
  let newHistory = history.concat(cave);

  if (cave === "end") {
    return [newHistory];
  }

  for (let neighbor of nodes[cave]) {
    if (neighbor !== "start") {
      // We can only revisit big caves
      if (!history.includes(neighbor) || IsUpper.test(neighbor)) {
        // console.log(`Visiting cave ${neighbor}, from node ${cave}.`);
        let newResults = pathfind(nodes, neighbor, newHistory);
        results = results.concat(newResults);
      }
    }
  }

  return results;
}

function solve(lines: string[]) {
  const nodes = parse(lines);
  const results = pathfind(nodes, 'start');
  
  return results.length;
}

export default async function run() {
  const input = await readInputAsStrings(INPUT_PATH);
  return solve(input);
}
