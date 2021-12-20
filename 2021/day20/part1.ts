import * as it from "itertools";
import * as path from "path";

import { readInputAsStrings } from "../util";
import Grid from "../util/grid";

type Pixel = '#' | '.';

const INPUT_PATH = path.join(__dirname, "./input.txt");

function parse(lines: string[]) {
  let algorithm = lines[0].split('') as Pixel[];
  const array = lines.slice(1).map(l => l.split('') as Pixel[]);
  let input = Grid.fromArray<Pixel>(array, { getDefault: () => "." });
  addBorder(input, '.');

  return {algorithm, input};
}

// Put an empty border of '.'s around the input grid.
// Of the infinite grid of '.'s, only the bordering pixels will matter
// when getting the 3x3 neighbors of a pixel to get the output image.
function addBorder(grid: Grid<Pixel>, defaultPixel: Pixel) {
  let minY = grid.minY;
  let maxY = grid.maxY;
  let minX = grid.minX;
  let maxX = grid.maxX;

  for (let y = minY - 1; y <= maxY + 1; y++) {
    grid.set(minX - 1, y, defaultPixel);
    grid.set(maxX + 1, y, defaultPixel);
  }
  for (let x = minX - 1; x <= maxX + 1; x++) {
    grid.set(x, minY - 1, defaultPixel);
    grid.set(x, maxY + 1, defaultPixel);
  }
}

function getPixel(algorithm: Pixel[], bitstring: string) {
  const bitstringValue = Number.parseInt(bitstring, 2);
  return algorithm[bitstringValue];
}

function enhance(input: Grid<Pixel>, algorithm: Pixel[]) {
  const pixel = input.get(input.minX, input.minY) === '#' ? '1' : '0';
  const defaultBitstring = pixel.repeat(9);
  const defaultPixel = getPixel(algorithm, defaultBitstring);
  const output = new Grid<Pixel>({ getDefault: () => defaultPixel });

  const entries = [...input.entries()];

  for (let [id, pixel] of entries) {
    let bitstring = '';
    let [cx, cy] = Grid.asCoord(id);

    for (let y = cy - 1; y <= cy + 1; y++) {
      for (let x = cx - 1; x <= cx + 1; x++) {
        bitstring += input.get(x, y) === '#' ? '1' : '0';
      }
    }

    const outputPixel = getPixel(algorithm, bitstring);
    // console.log(`Bitstring for [${cx}, ${cy}]: ${bitstring} (value=${bitstringValue})`);
    output.set(cx, cy, outputPixel);
  }

  addBorder(output, defaultPixel);
  return output;
}

function countLit(grid: Grid<Pixel>): number {
  return it.sum(it.map(grid.entries(), (([_, pixel]) => pixel === '#' ? 1 : 0)));
}

export default async function run() {
  const lines = await readInputAsStrings(INPUT_PATH);
  let { algorithm, input } = parse(lines);

  input = enhance(input, algorithm);
  input = enhance(input, algorithm);
  return countLit(input);
}
