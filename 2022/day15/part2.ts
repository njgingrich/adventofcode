import { range } from "itertools";
import * as _ from "lodash";
import { max } from "lodash";
import * as path from "path";

import { readInputAsStrings } from "../util";
import Grid, { Coord } from "../util/grid";

const INPUT_PATH = path.join(__dirname, "./input.txt");

const enum Tile {
    None = ".",
    Sensor = "S",
    Beacon = "B",
}

class Sensor {
    location: Coord;
    beacon: Coord;
    // Distance to nearest beacon
    distance: number;

    constructor(location: Coord, beacon: Coord) {
        this.location = location;
        this.beacon = beacon;
        this.distance = Grid.manhattanDistance(location, beacon);
    }

    *perimeter(maxValue: number): Generator<Coord, void, void> {
        const [sensorX, sensorY] = this.location;

        const min = Math.max(0, sensorY - this.distance + 1);
        const max = Math.min(maxValue, sensorY + this.distance + 1);

        let dx = 0;
        for (let y = min; y <= max; y++) {
            if (dx === 0) {
                yield [this.location[0], y];
            } else {
                yield [sensorX - dx, y];
                yield [sensorX + dx, y];
            }

            if (y <= sensorY) dx++;
            if (y > sensorY) dx--;
        }
    }
}

function parse(lines: string[]): Sensor[] {
    const nums = lines.map((l) =>
        [...l.matchAll(/-?\d+/g)].map((n) => Number(n[0]))
    );
    return nums.map((arr) => new Sensor([arr[0], arr[1]], [arr[2], arr[3]]));
}

function isCovered(sensors: Sensor[], coord: Coord) {
    return sensors.some(
        (s) => Grid.manhattanDistance(s.location, coord) <= s.distance
    );
}

function searchByEdges(sensors: Sensor[], MAX_VALUE: number) {
    for (let s of sensors) {
        for (let coord of s.perimeter(MAX_VALUE)) {
            if (
                coord[0] >= 0 &&
                coord[0] <= MAX_VALUE &&
                !isCovered(sensors, coord)
            ) {
                return coord;
            }
        }
    }
}

function solve(lines: string[]) {
    const sensors = parse(lines);
    const MAX = 4_000_000;

    const found = searchByEdges(sensors, MAX);
    if (!found) {
        console.log("no coord found");
        return 0;
    }

    return found[0] * 4_000_000 + found[1];
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH);
    return solve(input);
}
