import * as it from "iter-tools";
import * as path from "path";

import { readInputAsJson } from "../util";

function isObject(value: any): boolean {
    return Object.prototype.toString.call(value) === '[object Object]';
}

function getCountFromJson(blob: any): number {
    // console.log('Looking at:', blob);
    if (!isNaN(Number(blob))) {
        return Number(blob);
    }

    if (Array.isArray(blob)) {
        return blob.reduce((sum, val) => sum + getCountFromJson(val), 0);
    } else if (isObject(blob)) {
        return Object.keys(blob).reduce((sum, key) => sum + getCountFromJson(blob[key]), 0);
    } else {
        return 0;
    }
}

function solve(json: any) {
    return getCountFromJson(json);
}

export default async function run() {
  const input = await readInputAsJson(path.join(__dirname, "./input.json"));
  return solve(input);
}
