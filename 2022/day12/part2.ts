import * as it from "itertools";
import * as path from "path";

import { readInputAsNumberGrid, readInputAsStrings } from "../util";
import Grid, { astar, Coord, reconstructPath } from "../util/grid";

const INPUT_PATH = path.join(__dirname, "./input.txt");

function getNumericalValue(char: string) {
    if (char === "S") return 0;
    if (char === "E") return 27;
    return char.charCodeAt(0) - 96;
}

function parse(lines: string[]) {
    const cells = lines.map((line) =>
        line.split("").map((ch) => getNumericalValue(ch))
    );
    return Grid.fromArray<number>(cells, { getDefault: () => -1 });
}

function neighborCondition(
    current: Coord,
    entry: [string, Coord],
    grid: Grid<number>
) {
    const neighbor = grid.getByCoord(entry[1]);
    const cur = grid.getByCoord(current);
    // console.log(`Comparing [${current.toString()}]=${cur} to neighbor [${entry[1].toString()}]=${neighbor} => ${Math.abs(neighbor - cur)}`);
    return neighbor - cur <= 1;
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH);
    const grid = parse(input);

    const starts = grid.findWhere(
        (c) => grid.getByCoord(c) === 0 || grid.getByCoord(c) === 1
    );
    const end = grid.findFirstWhere((c) => grid.getByCoord(c) === 27);
    if (!end) {
        throw new Error("Could not find end positions.");
    }

    const lengths = starts.map((start) => {
        // console.log(`Starting at [${start[1].toString()}]`);
        try {
            const cameFrom = astar(grid, start[1], end[1], {
                neighborCondition,
                heuristic: Grid.manhattanDistance,
            });
            const path = reconstructPath(start[1], end[1], cameFrom);
            // console.log(cameFrom);
            // console.log(path);
            return Object.keys(path).length - 1;
            // console.log(grid.toString());
        } catch (err) {
            // console.log(`No path found for start [${start[1].toString()}]`);
            return Number.POSITIVE_INFINITY;
        }
    });
    return lengths.sort((a, b) => a - b)[0];
}
