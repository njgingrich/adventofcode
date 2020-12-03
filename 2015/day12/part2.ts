async function readInput(): Promise<string> {
  return Deno.readTextFile("./input.json");
}

// deno-lint-ignore no-explicit-any
function isObject(value: any): boolean {
  return Object.prototype.toString.call(value) === "[object Object]";
}

// deno-lint-ignore no-explicit-any
function getCountFromJson(blob: any): number {
  // console.log('Looking at:', blob);
  if (!isNaN(Number(blob))) {
    return Number(blob);
  }

  if (Array.isArray(blob)) {
    return blob.reduce((sum, val) => sum + getCountFromJson(val), 0);
  } else if (isObject(blob)) {
    const keys = Object.keys(blob);
    if (keys.some((k) => blob[k] === "red")) return 0;

    return keys.reduce((sum, key) => sum + getCountFromJson(blob[key]), 0);
  } else {
    return 0;
  }
}

function solve(data: string) {
  const json = JSON.parse(data);
  return getCountFromJson(json);
}

const input = await readInput();
console.log(solve(input));

export {};
