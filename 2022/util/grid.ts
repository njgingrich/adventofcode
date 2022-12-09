export type Coord = [number, number];

type CoordString = string;
type NeighborsMode = 'cardinal' | 'moores';
type Lookup = [string, Coord];

type GridConstructorOptions<T> = {
  getDefault: (x: number, y: number) => T;
}

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

    getRow(y: number): Array<[T, Coord]> {
        const subgrid = this.subgrid(0, this.width() - 1, y, y);
        const entries: Array<[T, Coord]> = [];

        for (let [key, cell] of subgrid) {
            entries.push([cell, Grid.asCoord(key)]);
        }
        return entries;
    }

    getCol(x: number): Array<[T, Coord]> {
        const subgrid = this.subgrid(x, x, 0, this.height() - 1);
        const entries: Array<[T, Coord]> = [];

        for (let [key, cell] of subgrid) {
            entries.push([cell, Grid.asCoord(key)]);
        }
        return entries;
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
        mode: NeighborsMode = "cardinal"
    ): Map<string, Coord> {
        const lookups = this.getNeighborsLookupForMode(
            coord[0],
            coord[1],
            mode
        );
        const map = new Map<string, Coord>();

        for (let [key, coord] of lookups) {
            if (this.inBoundsCoord(coord)) {
                map.set(key, coord);
            }
        }

        return map;
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
        mode: NeighborsMode
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
