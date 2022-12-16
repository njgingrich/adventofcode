import * as _ from "lodash";
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
    manhattan: number;

    constructor(location: Coord, beacon: Coord) {
        this.location = location;
        this.beacon = beacon;
        this.manhattan = Grid.manhattanDistance(location, beacon);
    }
}

function parse(lines: string[]): Sensor[] {
    const nums = lines.map((l) =>
        [...l.matchAll(/-?\d+/g)].map((n) => Number(n[0]))
    );
    return nums.map((arr) => new Sensor([arr[0], arr[1]], [arr[2], arr[3]]));
}

function findImpossibleSpots(sensors: Sensor[], y: number) {
    const blockedIntervals = sensors.map((s) => {
        const dist = Grid.manhattanDistance(s.location, [s.location[0], y]);
        if (dist > s.manhattan) {
            return [];
        }
        const yDist = y - s.location[1];
        const xDist = s.manhattan - Math.abs(yDist);
        const interval = [s.location[0] - xDist, s.location[0] + xDist];
        // console.log(`For [${s.location.toString()}]:`, {xDist, yDist, interval});
        return interval;
    });

    const values = _.flatten(blockedIntervals);
    let min = values[0];
    let max = values[0];

    for (let v of values) {
        if (v < min) min = v;
        if (v > max) max = v;
    }

    return Math.abs(min) + Math.abs(max);
}

function solve(lines: string[]) {
    const sensors = parse(lines);
    const grid = new Grid<Tile>({ getDefault: () => Tile.None });
    sensors.forEach((s) => {
        grid.setCoord(s.location, Tile.Sensor);
        grid.setCoord(s.beacon, Tile.Beacon);
    });

    return findImpossibleSpots(sensors, 2000000);
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH);
    return solve(input);
}
