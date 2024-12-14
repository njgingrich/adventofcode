// import * as path from "path";
// import { promises as fs } from "fs";

// export async function readInput(dir: string): Promise<string> {
//   const file = await fs.readFile(dir, "utf-8");
//   return file;
// }

// export async function readInputAsStrings(
//   dir: string,
//   split: string = "\n",
// ): Promise<string[]> {
//   const file = await fs.readFile(dir, "utf-8");
//   return file.split(split).filter(Boolean);
// }

// export async function readInputAsNumbers(dir: string): Promise<number[]> {
//   const file = await fs.readFile(dir, "utf-8");
//   return file.split("\n").filter(Boolean).map(Number);
// }

// export async function readInputAsString(
//   dir: string,
//   split: string = ",",
// ): Promise<string[]> {
//   const file = await readInput(dir);
//   return file.split(split);
// }

// export async function readInputAsStringGrid(
//   dir: string,
//   split: string = "",
// ): Promise<string[][]> {
//   const strings = await readInputAsStrings(dir);
//   return strings.map((row) => row.split(split));
// }

// export async function readInputAsNumberGrid(
//   dir: string,
//   split: string = "",
// ): Promise<number[][]> {
//   const strings = await readInputAsStrings(dir);
//   return strings.map((row) => row.split(split).map(Number));
// }

// export async function readInputAsGrid<T>(
//   dir: string,
//   split: string = "",
//   parser: (el: string) => T,
// ): Promise<T[][]> {
//   const strings = await readInputAsStrings(dir);
//   return strings.map((row) => row.split(split).map(parser));
// }

// export function intersection<T = any>(
//   arr1: Array<T>,
//   arr2: Array<T>,
// ): Array<T> {
//   const set2 = new Set(arr2);
//   return [...new Set(arr1)].filter((v) => set2.has(v));
// }

// export function nonNullable<T>(value: T): value is NonNullable<T> {
//   return value !== null && value !== undefined;
// }

export function gcd(a: number, b: number): number {
  return !b ? a : gcd(b, a % b);
}

export function lcm(a: number, b: number) {
  return (a * b) / gcd(a, b);
}

// export function getPairs<T>(elements: T[]) {
//   return elements.flatMap((val, i) => elements.slice(i + 1).map((v) => [val, v]));
// }
