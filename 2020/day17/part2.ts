import _ from "lodash";
import * as path from "path";

import { readInputAsStrings } from "../util";

type Coord = [number, number, number, number]; // x,y,z,w

function getInitialActiveCubes(lines: string[]) {
  const cubes: Coord[] = [];
  for (let r = 0; r < lines.length; r++) {
    for (let c = 0; c < lines[0].length; c++) {
      if (lines[r][c] === "#") {
        cubes.push([r, c, 0, 0]);
      }
    }
  }

  return cubes;
}

function getNeighbors(cube: Coord) {
  const neighbors: Coord[] = [];
  for (let x = cube[0] - 1; x <= cube[0] + 1; x++) {
    for (let y = cube[1] - 1; y <= cube[1] + 1; y++) {
      for (let z = cube[2] - 1; z <= cube[2] + 1; z++) {
        for (let w = cube[3] - 1; w <= cube[3] + 1; w++) {
          if (x === cube[0] && y === cube[1] && z === cube[2] && w === cube[3]) continue;
          neighbors.push([x, y, z, w]);
        }
      }
    }
  }

  return neighbors;
}

function isActive(cube: Coord, activeCubes: Coord[]) {
  return activeCubes.find((c) => {
    return c[0] === cube[0] && c[1] === cube[1] && c[2] === cube[2] && c[3] === cube[3];
  });
}

function getActiveNeighborsForCoord(cube: Coord, activeCubes: Coord[]): number {
  return getNeighbors(cube).filter((neighbor) =>
    isActive(neighbor, activeCubes)
  ).length;
}

function solve(lines: string[], rounds: number) {
  let activeCubes = getInitialActiveCubes(lines);
  for (let round = 0; round < rounds; round++) {
    let potentialCubes = activeCubes.slice();

    for (let cube of activeCubes) {
      const neighbors = getNeighbors(cube);
      potentialCubes.push(...neighbors);
    }
    potentialCubes = _.uniqBy(potentialCubes, _.toString);

    const newActiveCubes: Coord[] = [];
    for (let cube of potentialCubes) {
      const activeNeighbors = getActiveNeighborsForCoord(cube, activeCubes);
      // console.log(`Active neighbors for coord [${cube}]: ${activeNeighbors}`)
      if (isActive(cube, activeCubes)) {
        if (activeNeighbors === 2 || activeNeighbors === 3) {
          newActiveCubes.push(cube);
        } // otherwise it's no longer active
      } else {
        if (activeNeighbors === 3) {
          newActiveCubes.push(cube);
        }
      }
    }
    activeCubes = newActiveCubes;
    // console.log(`Active cubes after round ${round+1}: ${activeCubes.length}`)
  }

  return activeCubes.length;
}

export default async function run() {
  const input = await readInputAsStrings(path.join(__dirname, "./input.txt"));
  return solve(input, 6);
}
