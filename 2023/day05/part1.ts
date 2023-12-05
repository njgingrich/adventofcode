import * as it from "itertools";
import * as path from "path";

import { readInputAsStrings } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

interface Mapping {
    sourceStart: number,
    destStart: number,
    range: number
}

function parseMap(str: string): Mapping[] {
    return str.split('\n').slice(1).map(row => {
        let nums = row.split(/\s+/).map(Number);
        return {
            sourceStart: nums[1],
            destStart: nums[0],
            range: nums[2]
        }
    }).sort((a, b) => {
        return a.sourceStart - b.sourceStart;
    });
}

function parse(lines: string[]) {
    return {
        seeds: lines[0].split(': ')[1].split(/\s+/).map(Number),
        seedToSoilMap: parseMap(lines[1]),
        soilToFertilizerMap: parseMap(lines[2]),
        fertilizerToWaterMap: parseMap(lines[3]),
        waterToLightMap: parseMap(lines[4]),
        lightToTemperatureMap: parseMap(lines[5]),
        temperatureToHumidityMap: parseMap(lines[6]),
        humidityToLocationMap: parseMap(lines[7]),
    }
}

function getDest(sourceNum: number, mappings: Mapping[]) {
    let dest = sourceNum;

    for (let m of mappings) {
        if (sourceNum < m.sourceStart) {
            continue;
        }

        if (sourceNum <= m.sourceStart + m.range) {
            let diff = m.destStart - m.sourceStart;
            dest = sourceNum + diff;
        }
    }

    return dest;
}

function solve(lines: string[]) {
    const data = parse(lines);

    const locations = data.seeds
        .map(s => getDest(s, data.seedToSoilMap))
        .map(s => getDest(s, data.soilToFertilizerMap))
        .map(s => getDest(s, data.fertilizerToWaterMap))
        .map(s => getDest(s, data.waterToLightMap))
        .map(s => getDest(s, data.lightToTemperatureMap))
        .map(s => getDest(s, data.temperatureToHumidityMap))
        .map(s => getDest(s, data.humidityToLocationMap));

    return Math.min(...locations);
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH, "\n\n");
    return solve(input);
}
