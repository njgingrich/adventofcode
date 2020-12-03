import * as it from "https://cdn.pika.dev/itertools@1.6.1";

async function readInput(): Promise<string[]> {
  const file = await Deno.readTextFile("./input.txt");
  return file.split("\n").filter(Boolean);
}

type Reindeer = {
  speed: number;
  moveTime: number;
  restTime: number;
};

type Racer = {
  name: string;
  stats: Reindeer;
  state: "moving" | "resting";
  stateTime: number;
  distance: number;
  points: number;
};

function parse(line: string): Racer {
  const split = line.split(" ");
  const reindeer = {
    speed: Number(split[3]),
    moveTime: Number(split[6]),
    restTime: Number(split[13]),
  };

  return {
    name: split[0],
    stats: reindeer,
    state: "moving",
    stateTime: reindeer.moveTime,
    distance: 0,
    points: 0,
  };
}

function solve(lines: string[], seconds: number) {
  const racers = lines.map(parse);

  for (let t = 1; t <= seconds; t++) {
    for (const racer of racers) {
      if (racer.state === "moving") {
        racer.distance += racer.stats.speed;
      }

      racer.stateTime -= 1;
      if (racer.stateTime === 0) {
        if (racer.state === "moving") {
          racer.state = "resting";
          racer.stateTime = racer.stats.restTime;
        } else {
          racer.state = "moving";
          racer.stateTime = racer.stats.moveTime;
        }
      }
    }
    const leaderDistance = it.max(racers.map((racer) => racer.distance));

    for (const racer of racers) {
      if (racer.distance === leaderDistance) {
        racer.points += 1;
      }
    }
  }

  const points = racers.map((racer) => racer.points);
  return it.max(points);
}

const input = await readInput();
console.log(solve(input, 2503));

export {};
