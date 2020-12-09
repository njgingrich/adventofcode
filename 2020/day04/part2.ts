import * as it from "iter-tools";
import * as path from "path";

import { intersection, readInputAsStrings } from "../util";

type AnyRecord = Record<string, any>;
const REQUIRED_FIELDS = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];

function parse(str: string): AnyRecord {
  const split = str.split(" ");
  const passport: AnyRecord = {};
  split.forEach((str) => {
    const [k, v] = str.split(":");
    passport[k] = v;
  });

  return passport;
}

function isValid(pass: AnyRecord) {
  const keys = Object.keys(pass);
  if (intersection(keys, REQUIRED_FIELDS).length < 7) return false;

  const isValidForKey = keys.map((key) => {
    switch (key) {
      case "byr": {
        const year = Number(pass[key]);
        return year >= 1920 && year <= 2002;
      }
      case "iyr": {
        const year = Number(pass[key]);
        return year >= 2010 && year <= 2020;
      }
      case "eyr": {
        const year = Number(pass[key]);
        return year >= 2020 && year <= 2030;
      }
      case "hgt": {
        const match = (pass[key] as string).match(/(\d+)(\w+)/);
        if (!match) return false;

        const [_, numStr, units] = match;
        const num = Number(numStr);
        if (units === "cm") return num >= 150 && num <= 193;
        return num >= 59 && num <= 76;
      }
      case "hcl": {
        return new RegExp(/#[a-z0-9]{6}/).test(pass[key]);
      }
      case "ecl": {
        return ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(
          pass[key],
        );
      }
      case "pid": {
        return new RegExp(/\d{9}/).test(pass[key]);
      }
      case 'cid': {
        return true;
      }
    }
  });

  return isValidForKey.every(Boolean);
}

function solve(lines: string[]) {
  return lines.map(parse).filter(isValid).length;
}

export default async function run() {
  let input = await readInputAsStrings(
    path.join(__dirname, "./input.txt"),
    "\n\n"
  );
  input = input.map((l) => l.replace(/\n/g, " ")).filter(Boolean);
  return solve(input);
}

