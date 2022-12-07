import { sum } from "itertools";
import * as path from "path";

import { readInputAsStrings } from "../util";

const INPUT_PATH = path.join(__dirname, "./input.txt");

class Directory {
    name: string;
    parent?: Directory;
    entries: Record<string, Directory | number>;
    totalSize: number;

    constructor(name: string, parent?: Directory) {
        this.name = name;
        this.parent = parent;
        this.entries = {};
        this.totalSize = 0;
    }

    static print(tree: Directory, level: number = 0) {
        console.log(
            `${" ".repeat(level * 2)}- ${tree.name} (dir, total_size=${
                tree.totalSize
            })`
        );

        const children = Object.entries(tree.entries).sort((a, b) =>
            a[0].localeCompare(b[0])
        );
        for (let [name, entry] of children) {
            if (typeof entry === "number") {
                console.log(
                    `${" ".repeat(
                        (level + 1) * 2
                    )}- ${name} (file, size=${entry})`
                );
            } else {
                Directory.print(entry, level + 1);
            }
        }
    }

    determineTotalSize() {
        let totalSize = 0;
        for (let [name, entry] of Object.entries(this.entries)) {
            if (typeof entry === "number") {
                totalSize += entry;
            } else {
                entry.determineTotalSize();
                totalSize += entry.totalSize;
            }
        }

        this.totalSize = totalSize;
    }
}

interface Command {
    name: "ls" | "cd";
    arguments: string[];
}

function getCommand(line: string): Command {
    if (line.startsWith("$ cd")) {
        return { name: "cd", arguments: [line.slice(5)] };
    } else if (line.startsWith("$ ls")) {
        return { name: "ls", arguments: [] };
    } else {
        throw new Error("unknown command");
    }
}

function parse(lines: string[]) {
    const root = new Directory("/");
    let pwd = root;

    const output = [...lines.reverse()];
    while (output.length > 0) {
        let line = output.pop();
        if (!line) throw new Error("expected line");

        const command = getCommand(line);
        // console.log('Computer state:', {root, pwd, line, command});
        switch (command.name) {
            case "cd": {
                const target = command.arguments[0];
                if (target === "/") {
                    pwd = root;
                } else if (target === "..") {
                    if (!pwd.parent) {
                        throw new Error(
                            "tried to go to a parent that does not exist"
                        );
                    }
                    pwd = pwd.parent;
                } else {
                    const dir = pwd.entries[target];
                    if (typeof dir === "number") {
                        throw new Error("Tried to cd to a file");
                    }

                    pwd = dir;
                }

                break;
            }
            case "ls": {
                // Get all the output
                while (output.length > 0) {
                    line = output.pop();
                    if (!line) throw new Error("expected line");

                    const [first, name] = line?.split(/\s+/);
                    if (first === "dir") {
                        pwd.entries[name] = new Directory(name, pwd);
                    } else if (first.match(/\d+/)) {
                        pwd.entries[name] = Number(first);
                    } else {
                        // push the command back onto the stack
                        output.push(line);
                        break;
                    }
                }

                break;
            }
        }
    }

    root.determineTotalSize();
    Directory.print(root);
    return root;
}

function getDirectories(tree: Directory) {
    const items = Object.entries(tree.entries);
    const directories = [tree];

    for (let [name, entry] of items) {
        if (typeof entry === "number") continue;
        directories.push(entry);

        items.push(...Object.entries(entry.entries));
    }

    return directories;
}

function solve(lines: string[]) {
    const root = parse(lines);

    const directories = getDirectories(root);
    const filtered = directories
        .filter(dir => dir.totalSize <= 100000)
        .map(dir => dir.totalSize);
    return sum(filtered);
}

export default async function run() {
    const input = await readInputAsStrings(INPUT_PATH);
    return solve(input);
}
