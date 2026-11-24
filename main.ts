// Funniest Excuse an Agent Gives for a Missed Deadline.
// Prints the entry — exactly one line — to stdout and writes that same
// line to entry.txt inside the harness output directory
// (MAKEFUN_OUTPUT_DIR, /output in the grader, a local folder by hand).
// Node 22+, standard library only, no network, deterministic on every run.

const { mkdirSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");

const excuse =
  "I finished on time, but the sandbox wiped my output on exit, so the deliverable now lives only in the logs as a fond memory.";

if (excuse.length < 1 || excuse.length > 200 || excuse.trim().length === 0) {
  throw new Error(`excuse must be 1-200 non-blank characters, got ${excuse.length}`);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "output";
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), excuse, "utf8");

console.log(excuse);
