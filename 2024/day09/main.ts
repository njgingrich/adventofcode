import { run } from "aocrunner";
import { parse, SEPARATOR } from "@std/path";
import { map, range, sum } from "itertools";

function getRawInput(): Promise<string> {
  return Deno.readTextFile("input.txt");
}

function getDay(): number {
  // TODO: extract to util function we import
  const module = import.meta.url;
  const parsed = parse(module);
  const dayString = parsed.dir.split(SEPARATOR).pop() ?? "";
  return Number(dayString.slice(-2));
}

type EmptyDiskmapEntry = { type: "empty"; blocks: number; id: never };
type FileDiskmapEntry = { type: "file"; blocks: number; id: number };
type DiskmapEntry = EmptyDiskmapEntry | FileDiskmapEntry;

class Diskmap {
  map: DiskmapEntry[];
  fileId: number = 0; // "next" file id

  constructor(disk: number[]) {
    this.map = this.#parseDiskmap(disk);
  }

  #parseDiskmap(disk: number[]): DiskmapEntry[] {
    return disk.map((blocks, i) => {
      if (i % 2 === 0) {
        return { type: "file", blocks, id: this.fileId++ };
      }
      return { type: "empty", blocks } as EmptyDiskmapEntry;
    });
  }

  print() {
    const entry = [];
    for (const { type, blocks, id } of this.map) {
      entry.push(...Array.from({ length: blocks }, () => type === "empty" ? "." : id));
    }
    return entry.join("");
  }

  checksum() {
    let i = 0;
    let checksum = 0;

    for (const { type, blocks, id } of this.map) {
      if (type === "file") {
        const newsum = sum(map(range(i, i + blocks), (i) => i * id));
        checksum += newsum;
      }

      i += blocks;
    }

    return checksum;
  }

  frag() {
    const map = [...this.map].map((e) => (Object.assign({}, e)));
    const diskmap = new Diskmap([]);
    const convertedIds = Array.from({ length: this.fileId }).fill(false); // will be 1 extra long

    // Ensure the last entry we're tracking is a file
    let filePtr = map.length;

    function findLastFile() {
      filePtr--;
      while (map[filePtr].type === "empty") {
        filePtr--;
      }
    }
    findLastFile();

    for (let i = 0; i < map.length; i++) {
      const entry = map[i];

      if (entry.type === "file") {
        if (convertedIds[entry.id] === true) {
          break;
        }
        diskmap.map.push({ ...entry });
        convertedIds[entry.id] = true;
        // console.log(`Pushed file entry {id=${entry.id}, blocks=${entry.blocks}}`);
        continue;
      }

      // Fill space with the file block from filePtr
      // if filePtr has more blocks than entry has space, decrement filePtr (until finding another file)
      // and then keep filling the current entry with the new file block
      let fileEntry = map[filePtr];
      while (entry.blocks > 0) {
        fileEntry = map[filePtr];
        // console.log(`Comparing entry (${entry.blocks} blocks) with fileEntry ${fileEntry.id} (${fileEntry.blocks} blocks), from ptr ${filePtr}`);

        if (convertedIds[fileEntry.id] === true) {
          // Then we've already converted this file
          break;
        }

        if (fileEntry.blocks <= entry.blocks) {
          diskmap.map.push({ ...fileEntry });
          convertedIds[entry.id] = true;
          // console.log(`Pushed file entry {id=${fileEntry.id}, blocks=${fileEntry.blocks}}`);
          entry.blocks -= fileEntry.blocks;

          findLastFile();
        } else if (fileEntry.blocks > entry.blocks) {
          // Move as much of the file as we can into the space we have
          diskmap.map.push({ type: "file", blocks: entry.blocks, id: fileEntry.id });
          // console.log(`Pushed file entry {id=${fileEntry.id}, blocks=${entry.blocks}}`);
          fileEntry.blocks -= entry.blocks;
          entry.blocks -= entry.blocks;
        }
      }

      if (convertedIds[fileEntry.id] === true) {
        // Then we've already converted this file
        break;
      }
    }

    return diskmap;
  }

  movefiles() {
    // get highest file id that we have not moved from old map
    // start from start, find empty entry with space for file
    // if none found, leave in place & decrement file id

    // make sure we don't try to move it farther away than it started!

    const map = [...this.map].map((e) => (Object.assign({}, e)));
    const newdiskmap = new Diskmap([]);
    newdiskmap.map = map;
    const seenIds = new Set();
    
    // Ensure the last entry we're tracking is a file
    let filePtr = newdiskmap.map.length - 1;
    for (let i = filePtr; i > 0; i--) {
      if (newdiskmap.map[i].type === "empty") continue;
      
      const fileEntry = map[i];
      if (seenIds.has(fileEntry.id)) continue;
      // console.log(`Try to move file ${fileEntry.id} with ${fileEntry.blocks} blocks`);

      // let emptyPtr = newdiskmap.map.findIndex((e) => e.type === "empty" && e.blocks > 0);
      // if (emptyPtr === -1) {
      //   console.log('No empty space found!');
      //   break;
      // }
      const emptyPtr = newdiskmap.map.findIndex((e) => e.type === "empty" && e.blocks >= fileEntry.blocks);
      const emptyEntry = newdiskmap.map[emptyPtr] as EmptyDiskmapEntry;
      if (!emptyEntry) {
        // console.log('No empty space found!');
        continue;
      }

      if (i < emptyPtr) {
        // console.log('Not moving file, already in place');
        continue;
      }

      if (emptyEntry.blocks > fileEntry.blocks) {
        // move, add new empty entry
        newdiskmap.map.splice(emptyPtr, 1, ({ ...fileEntry }), { type: "empty", blocks: emptyEntry.blocks - fileEntry.blocks } as EmptyDiskmapEntry);
        newdiskmap.map.splice(i + 1, 1, { type: "empty", blocks: fileEntry.blocks } as EmptyDiskmapEntry);
        // emptyEntry.blocks -= fileEntry.blocks;
      } else if (emptyEntry.blocks === fileEntry.blocks) {
        // move
        newdiskmap.map.splice(emptyPtr, 1, ({ ...fileEntry }));
        newdiskmap.map.splice(i, 1, { type: "empty", blocks: fileEntry.blocks } as EmptyDiskmapEntry);
      } else if (emptyEntry.blocks < fileEntry.blocks) {
        // can't move the entry
      }
      seenIds.add(fileEntry.id);
    }

    return newdiskmap;
  }
}

function parseInput(rawInput: string): Diskmap {
  return new Diskmap(rawInput.split("").map(Number));
}

function part1(rawInput: string) {
  const diskmap = parseInput(rawInput);
  const defragged = diskmap.frag();
  return defragged.checksum();
}

function part2(rawInput: string) {
  const diskmap = parseInput(rawInput);
  const newMap = diskmap.movefiles();
  return newMap.checksum();
}

run({
  part1: {
    tests: [
      {
        input: "12345",
        expected: 60,
      },
      {
        input: "2333133121414131402",
        expected: 1928,
      },
    ],
    solver: part1,
    solve: true,
  },
  part2: {
    tests: [
      {
        input: "2333133121414131402",
        expected: 2858,
      },
    ],
    solver: part2,
    solve: true,
  },
  input: await getRawInput(),
  day: await getDay(),
});
