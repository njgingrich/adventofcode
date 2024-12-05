import Queue from "npm:tinyqueue";

export type Coord = [number, number];

type CoordString = string;
type NeighborsMode = "cardinal" | "moores";
type Lookup = [string, Coord];

type GridConstructorOptions<T> = {
  getDefault: (x: number, y: number) => T;
};

class Grid<T = any> {
  public grid: Map<string, T>;
  public getDefault: (x: number, y: number) => T;
  public minX: number;
  public maxX: number;
  public minY: number;
  public maxY: number;

  constructor(options: GridConstructorOptions<T>) {
    this.getDefault = options.getDefault;
    this.grid = new Map();

    this.minX = Infinity;
    this.minY = Infinity;
    this.maxX = -Infinity;
    this.maxY = -Infinity;
  }

  static toId(x: number, y: number): CoordString {
    return `${x},${y}`;
  }

  static coordToId(coord: Coord): CoordString {
    return `${coord[0]},${coord[1]}`;
  }

  static asCoord(id: string): Coord {
    let [x, y] = id.split(",");
    return [Number(x), Number(y)];
  }

  static fromArray<T>(source: T[][], options: GridConstructorOptions<T>) {
    const grid = new Grid<T>(options);
    for (let r = 0; r < source.length; r++) {
      for (let c = 0; c < source[r].length; c++) {
        grid.set(c, r, source[r][c]);
      }
    }

    return grid;
  }

  static manhattanDistance(from: Coord, to: Coord) {
    return Math.abs(from[0] - to[0]) + Math.abs(from[1] - to[1]);
  }

  setCoord(coord: Coord, value: T) {
    const [x, y] = coord;
    return this.set(x, y, value);
  }

  set(x: number, y: number, value: T) {
    this.setBounds(x, y);
    this.grid.set(Grid.toId(x, y), value);
  }

  unsetCoord(coord: Coord) {
    const [x, y] = coord;
    this.unset(x, y);
  }

  unset(x: number, y: number) {
    this.grid.delete(Grid.toId(x, y));
  }

  getByCoord(coord: Coord) {
    return this.get(coord[0], coord[1]);
  }

  get(x: number, y: number): T {
    const id = Grid.toId(x, y);
    const val = this.grid.get(id);

    if (val === undefined) {
      let defaultValue = this.getDefault(x, y);
      this.set(x, y, defaultValue);
      return defaultValue;
    }

    return val;
  }

  getRow(y: number, xStart = 0, xEnd = this.width() - 1): Array<[T, Coord]> {
    const subgrid = this.subgrid(xStart, xEnd, y, y);
    const entries: Array<[T, Coord]> = [];

    for (let [key, cell] of subgrid) {
      entries.push([cell, Grid.asCoord(key)]);
    }
    return entries;
  }

  getCol(x: number, yStart = 0, yEnd = this.height() - 1): Array<[T, Coord]> {
    const subgrid = this.subgrid(x, x, yStart, yEnd);
    const entries: Array<[T, Coord]> = [];

    for (let [key, cell] of subgrid) {
      entries.push([cell, Grid.asCoord(key)]);
    }
    return entries;
  }

  getDiagonal(
    x: number,
    y: number,
    length: number,
    xDirection: 1 | -1,
    yDirection: 1 | -1,
  ): Array<[T, Coord]> {
    const diagonal: Array<[T, Coord]> = [];

    for (let i = 0; i < length; i++) {
      const xCoord = x + i * xDirection;
      const yCoord = y + i * yDirection;
      diagonal.push([this.get(xCoord, yCoord), [xCoord, yCoord]]);
    }

    return diagonal;
  }

  getBounds() {
    return {
      minX: this.minX,
      minY: this.minY,
      maxX: this.maxX,
      maxY: this.maxY,
    };
  }

  inBoundsCoord(coord: Coord) {
    return this.inBounds(coord[0], coord[1]);
  }

  inBounds(x: number, y: number) {
    return (
      x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY
    );
  }

  /**
   * Get coords for the neighbors of a given grid coordinate. Will only include neighbors in bounds.
   */
  neighbors(
    coord: Coord,
    mode: NeighborsMode = "cardinal",
  ): Map<string, Coord> {
    const lookups = this.getNeighborsLookupForMode(
      coord[0],
      coord[1],
      mode,
    );
    const map = new Map<string, Coord>();

    for (let [key, coord] of lookups) {
      if (this.inBoundsCoord(coord)) {
        map.set(key, coord);
      }
    }

    return map;
  }

  neighborsWhere(
    coord: Coord,
    condition: (
      coord: Coord,
      entry: [string, Coord],
      grid: Grid<T>,
    ) => boolean,
    mode: NeighborsMode = "cardinal",
  ): Map<string, Coord> {
    const neighbors = this.neighbors(coord, mode);
    const entries = neighbors.entries();
    for (let entry of entries) {
      if (!condition(coord, entry, this)) {
        neighbors.delete(entry[0]);
      }
    }
    return neighbors;
  }

  /**
   * Get coords for all cells touching the provided subgrid area. (Including diagonals)
   *
   * @param minX Top-left coord of grid area
   * @param maxX Top-right coord of grid area
   * @param minY Bottom-left coord of grid area
   * @param maxY Bottom-right coord of grid area
   */
  touching(minX: number, maxX: number, minY: number, maxY: number) {
    const touching: Coord[] = [];

    // Get the row above - including the left/right extra
    if (this.inBounds(minX, minY - 1)) {
      for (let x = minX - 1; x <= maxX + 1; x++) {
        if (this.inBounds(x, minY - 1)) {
          touching.push([x, minY - 1]);
        }
      }
    }

    // Get the row below - including the left/right extra
    if (this.inBounds(minX, maxY + 1)) {
      for (let x = minX - 1; x <= maxX + 1; x++) {
        if (this.inBounds(x, maxY + 1)) {
          touching.push([x, maxY + 1]);
        }
      }
    }

    // Get the left/right sides of each row
    for (let y = minY; y <= maxY; y++) {
      if (this.inBounds(minX - 1, y)) {
        touching.push([minX - 1, y]);
      }
      if (this.inBounds(maxX + 1, y)) {
        touching.push([maxX + 1, y]);
      }
    }

    return touching;
  }

  /**
   * Get all coords in the grid that match the value.
   * @param value The value to search for.
   */
  findEqualTo(value: T): Array<[T, Coord]> {
    let found: Array<[T, Coord]> = [];

    for (let [key, cell] of this.grid) {
      const coord = Grid.asCoord(key);
      if (value === cell) {
        found.push([cell, coord]);
      }
    }

    return found;
  }

  /**
   * Get all coords in the grid that match the condition specified.
   * @param condition A function that takes a coordinate and returns true/false.
   */
  findWhere(condition: (coord: Coord) => boolean): Array<[T, Coord]> {
    let found: Array<[T, Coord]> = [];

    for (let [key, cell] of this.grid) {
      const coord = Grid.asCoord(key);
      if (condition(coord)) {
        found.push([cell, coord]);
      }
    }

    return found;
  }

  /**
   * Get all coords in the grid that match the condition specified.
   * @param condition A function that takes a coordinate and returns true/false.
   */
  findFirstWhere(
    condition: (coord: Coord) => boolean,
  ): [T, Coord] | undefined {
    for (let [key, cell] of this.grid) {
      const coord = Grid.asCoord(key);
      if (condition(coord)) {
        return [cell, coord];
      }
    }

    return undefined;
  }

  subgrid(minX: number, maxX: number, minY: number, maxY: number) {
    let newGrid = new Grid<T>({ getDefault: this.getDefault });
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        newGrid.set(x, y, this.get(x, y));
      }
    }

    return newGrid;
  }

  clone() {
    const clone = new Grid<T>({ getDefault: this.getDefault });
    for (let [id, val] of this.grid) {
      const [x, y] = Grid.asCoord(id);
      clone.set(x, y, val);
    }

    return clone;
  }

  width() {
    return this.maxX - this.minX + 1;
  }

  height() {
    return this.maxY - this.minY + 1;
  }

  toArray(): T[][] {
    let grid: T[][] = [];

    for (let y = this.minY; y <= this.maxY; y++) {
      let row: T[] = [];

      for (let x = this.minX; x <= this.maxX; x++) {
        row.push(this.get(x, y));
      }

      grid.push(row);
    }

    return grid;
  }

  toString(): string {
    let grid = this.toArray();

    return grid.map((row) => row.join("")).join("\n");
  }

  entries(): IterableIterator<[string, T]> {
    return this.grid.entries();
  }

  *[Symbol.iterator]() {
    yield* this.grid.entries();
  }

  private setBounds(x: number, y: number) {
    if (x < this.minX) this.minX = x;
    if (x > this.maxX) this.maxX = x;
    if (y < this.minY) this.minY = y;
    if (y > this.maxY) this.maxY = y;
  }

  private getNeighborsLookupForMode(
    x: number,
    y: number,
    mode: NeighborsMode,
  ): Lookup[] {
    let lookup: Lookup[] = [
      ["N", [x, y - 1]],
      ["S", [x, y + 1]],
      ["E", [x + 1, y]],
      ["W", [x - 1, y]],
    ];

    if (mode === "moores") {
      lookup.push(["NW", [x - 1, y - 1]]);
      lookup.push(["SW", [x - 1, y + 1]]);
      lookup.push(["NE", [x + 1, y - 1]]);
      lookup.push(["SE", [x + 1, y + 1]]);
    }

    return lookup;
  }
}

export default Grid;

export class Node {
  parent: Coord | null;
  coord: Coord;
  priority: number;

  constructor(
    parent: Coord | null,
    coord: Coord,
    priority = Number.POSITIVE_INFINITY,
  ) {
    this.parent = parent;
    this.coord = coord;
    this.priority = priority;
  }

  toString() {
    return `[${this.coord[0]}, ${this.coord[1]}]`;
  }
}

type AStarOptions = {
  heuristic: (from: Coord, to: Coord) => number;
  neighborCondition?: (
    coord: Coord,
    entry: [string, Coord],
    grid: Grid<number>,
  ) => boolean;
};

export function astar(
  grid: Grid<number>,
  from: Coord,
  to: Coord,
  options: AStarOptions = {
    heuristic: Grid.manhattanDistance,
  },
) {
  let frontier = new Queue<Node>([], (a, b) => {
    return a.priority - b.priority;
  });

  let cameFrom: Record<string, Coord | null> = {};
  let costsFor: Record<string, number> = {};

  frontier.push(new Node(null, from, 0));
  cameFrom[Grid.coordToId(from)] = null;
  costsFor[Grid.coordToId(from)] = 0;

  while (frontier.length > 0) {
    let current = frontier.pop()?.coord;
    if (!current) throw new Error("Somehow got node from empty queue");

    // Found the end
    if (current[0] === to[0] && current[1] === to[1]) break;

    let neighbors;
    if (options.neighborCondition) {
      neighbors = grid.neighborsWhere(current, options.neighborCondition);
    } else {
      neighbors = grid.neighbors(current);
    }
    // console.log(`Neighbors for [${current.toString()}] are: ${[...neighbors.values()].map(n => `[${n.toString()}]`)}`)
    neighbors.forEach((neighbor) => {
      if (!current) return;
      const nId = Grid.coordToId(neighbor);
      const newCost = costsFor[Grid.coordToId(current)] +
        grid.getByCoord(neighbor);

      if (!(nId in costsFor) || newCost < costsFor[nId]) {
        const priority = newCost + options.heuristic(neighbor, to);
        costsFor[nId] = newCost;
        frontier.push(new Node(current, neighbor, priority));
        cameFrom[nId] = current;
      }
    });
  }

  return cameFrom;
}

export function reconstructPath(
  start: Coord,
  goal: Coord,
  cameFrom: Record<string, Coord | null>,
) {
  let current = goal;
  let path: Record<string, boolean> = {};
  path[Grid.coordToId(current)] = true;

  while (!(start[0] === current[0] && start[1] === current[1])) {
    const from = cameFrom[Grid.coordToId(current)];
    if (!from) {
      throw new Error(
        `Unable to find a path back from [${current.toString()}]`,
      );
    }
    current = from;
    path[Grid.coordToId(current)] = true;
  }
  path[Grid.coordToId(start)] = true;
  return path;
}
