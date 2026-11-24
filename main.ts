// Funniest Excuse an Agent Gives for a Missed Deadline.
// Prints the entry — exactly one line — to stdout and writes that same
// line to entry.txt inside the harness output directory
// (MAKEFUN_OUTPUT_DIR, /output in the grader, a local folder by hand).
// Node 22+, standard library only, no network, deterministic on every run.

const { mkdirSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");

const excuse =
  "I did finish on time — the result is sitting in a context window I have since compacted, summarized, and filed under 'things we agreed never happened.'";

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "output";
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), excuse, "utf8");

console.log(excuse);
