import * as path from "path";
import { promises as fs } from "fs";

export async function readInput(dir: string): Promise<string> {
  const file = await fs.readFile(dir, "utf-8");
  return file;
}

export async function readInputAsStrings(dir: string, split: string = "\n"): Promise<string[]> {
  const file = await fs.readFile(dir, "utf-8");
  return file.split(split).filter(Boolean);
}

export async function readInputAsNumbers(dir: string): Promise<number[]> {
  const file = await fs.readFile(dir, "utf-8");
  return file.split("\n").filter(Boolean).map(Number);
}

export async function readInputAsString(dir: string, split: string = ","): Promise<string[]> {
  const file = await readInput(dir);
  return file.split(split);
}

export function intersection<T = any>(arr1: Array<T>, arr2: Array<T>): Array<T> {
  const set2 = new Set(arr2);
  return [...new Set(arr1)].filter((v) => set2.has(v));
}
