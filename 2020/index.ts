import minimist from 'minimist';
import { exit } from 'process';
import { PerformanceObserver, performance } from 'perf_hooks';

const perfObserver = new PerformanceObserver((items) => {
  items.getEntries().forEach((entry) => {
    console.log(`Solution ran in ${entry.duration.toPrecision(4)}ms.`);
  });
});

perfObserver.observe({ entryTypes: ["measure"], buffered: true });

async function run() {
  const args = minimist(process.argv.slice(2));
  const options = Object.assign({p: 1}, args);

  if (!options.d) {
    console.log('Must pass a day (-d #).');
    exit(1);
  }
  if (!([1, 2].includes(options.p))) {
    console.log('Part must be either 1 or 2. (-p {1,2})');
    exit(1);
  }

  const importPath = `./day${options.d < 10 ? "0" : ""}${options.d}/part${options.p}`;
  try {
    performance.mark('start');
    console.log(`Running solution for 2020 Day ${options.d}, Part ${options.p}:`)
    const soln = (await import(importPath)).default;
    const output = await soln();
    performance.mark('end');

    console.log(output);
    performance.measure('runtime', 'start', 'end');

  } catch (err) {
    console.log('Error importing module from', importPath);
    console.log(err);
    exit(1);
  }
}

run();
