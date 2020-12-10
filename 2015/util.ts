import * as path from "path";
import { promises as fs } from "fs";
import * as it from "iter-tools";

export async function readInput(
  dir: string,
  split: string = "\n"
): Promise<string> {
  const file = await fs.readFile(dir, "utf-8");
  return file;
}

export async function readInputAsStrings(
  dir: string,
  split: string = "\n"
): Promise<string[]> {
  const file = await fs.readFile(dir, "utf-8");
  return file.split(split).filter(Boolean);
}

export async function readInputAsNumbers(dir: string): Promise<number[]> {
  const file = await fs.readFile(dir, "utf-8");
  return file.split("\n").filter(Boolean).map(Number);
}

export async function readInputAsJson(dir: string): Promise<any> {
  const file = await fs.readFile(dir, "utf-8");
  return JSON.parse(file);
}

export function min(arr: Iterable<number>) {
  return it.reduce<number, number>((x, y) => (x < y ? x : y), arr);
}

export function max(arr: Iterable<number>) {
  return it.reduce<number, number>((x, y) => (x > y ? x : y), arr);
}

export function sum(arr: Iterable<number>) {
  return it.reduce<number, number>(0, (x, y) => x + y, arr);
}

export function intersection<T = any>(
  arr1: Array<T>,
  arr2: Array<T>
): Array<T> {
  const set2 = new Set(arr2);
  return [...new Set(arr1)].filter((v) => set2.has(v));
}
