import * as it from "iter-tools";
import * as path from "path";

import { max, readInputAsStrings } from "../util";

type Reindeer = {
    speed: number,
    moveTime: number,
    restTime: number,
}

type Racer = {
    name: string,
    stats: Reindeer,
    state: 'moving' | 'resting',
    stateTime: number,
    distance: number,
}

function parse(line: string): Racer {
    const split = line.split(' ');
    const reindeer = { speed: Number(split[3]), moveTime: Number(split[6]), restTime: Number(split[13]) }

    return {
        name: split[0],
        stats: reindeer,
        state: 'moving',
        stateTime: reindeer.moveTime,
        distance: 0,
    }
}

function solve(lines: string[], seconds: number) {
    const racers = lines.map(parse);
    
    for (let t = 1; t <= seconds; t++) {
        for (const racer of racers) {
            racer.stateTime -= 1;
            if (racer.state === 'moving') {
                racer.distance += racer.stats.speed;
            }

            if (racer.stateTime === 0) {
                if (racer.state === 'moving') {
                    racer.state = 'resting';
                    racer.stateTime = racer.stats.restTime;
                } else {
                    racer.state = 'moving';
                    racer.stateTime = racer.stats.moveTime;
                }
            }
        }
    }

    const distances = racers.map(racer => racer.distance);
    return max(distances);
}

export default async function run() {
  const input = await readInputAsStrings(path.join(__dirname, "./input.txt"));
  return solve(input, 2503);
}
