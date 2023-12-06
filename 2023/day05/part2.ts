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

function getSeedsFromRanges(str: string) {
    const nums = str.split(': ')[1].split(/\s+/).map(Number);
    let ranges: {start: number, end: number}[] = [];
    
    for (let i = 0; i < nums.length; i += 2) {
        ranges.push({start: nums[i], end: nums[i] + nums[i+1] - 1})
    }

    return ranges;
}

function parse(lines: string[]) {
    return {
        seedRanges: getSeedsFromRanges(lines[0]),
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

function getLocationForSeed(seed: number, data: ReturnType<typeof parse>) {
    return getDest(
        getDest(
            getDest(
                getDest(
                    getDest(
                        getDest(
                            getDest(seed, data.seedToSoilMap),
                            data.soilToFertilizerMap),
                        data.fertilizerToWaterMap),
                    data.waterToLightMap),
                data.lightToTemperatureMap),
            data.temperatureToHumidityMap),
        data.humidityToLocationMap);
}

function solve(lines: string[]) {
    const data = parse(lines);

    // const locations = data.seeds
    //     .map(s => getDest(s, data.seedToSoilMap))
    //     .map(s => getDest(s, data.soilToFertilizerMap))
    //     .map(s => getDest(s, data.fertilizerToWaterMap))
    //     .map(s => getDest(s, data.waterToLightMap))
    //     .map(s => getDest(s, data.lightToTemperatureMap))
    //     .map(s => getDest(s, data.temperatureToHumidityMap))
    //     .map(s => getDest(s, data.humidityToLocationMap));

    let minLocation = Number.MAX_SAFE_INTEGER;
    for (let range of data.seedRanges) {
        for (let i = range.start; i <= range.end; i++) {
            minLocation = Math.min(minLocation, getLocationForSeed(i, data));
        }
    }

    return minLocation;
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH, "\n\n");
    return solve(input);
}
