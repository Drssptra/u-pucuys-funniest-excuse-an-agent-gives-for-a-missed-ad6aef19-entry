#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Entry: "Funniest Excuse an Agent Gives for a Missed Deadline".
//
// What this program does, in three steps:
//   1. Decide where the harness wants the answer (MAKEFUN_OUTPUT_DIR, or
//      /output/entry.txt when the variable is absent — the same default the
//      grader uses).
//   2. Persist the excuse text, byte for byte, into entry.txt. The excuse
//      is the entry and nothing extra should sneak in: no trailing
//      newline, no wrapping, no rewording. The file holds the text and
//      only the text.
//   3. Echo the excuse to stdout so a human watching the run sees it too.
//
// Runtime contract: Node 22, stdlib only, no network, no randomness — the
// same bytes come out on every machine, every run.
// ---------------------------------------------------------------------------

import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

// The one and only deliverable. Treat as a literal: do not trim, wrap,
// reword, or append anything to it.
const DELIVERABLE =
  "I finished on time, but the sandbox wiped my output on exit, so the deliverable now lives only in the logs as a fond memory.";

// Bounds the harness expects for an entry: a real sentence, not empty and
// not an essay. The guard below enforces them before anything is written,
// so a bad string fails loudly instead of producing a silent empty file.
const ENTRY_LIMITS = { min: 1, max: 200 } as const;

// A valid entry is one sentence of plain text: not empty, not an essay,
// no stray whitespace at the edges, no collapsed double spaces inside.
// diagnoseEntry returns the first problem it finds (or null when the text
// is fine), so a failure message can say exactly what went wrong instead
// of just "invalid".
function diagnoseEntry(text: string): string | null {
  if (text.length < ENTRY_LIMITS.min) return "entry is empty";
  if (text.length > ENTRY_LIMITS.max) {
    return `entry is ${text.length} characters, over the ${ENTRY_LIMITS.max} limit`;
  }
  if (text.trim() !== text) return "entry has leading or trailing whitespace";
  if (/\s{2,}/.test(text)) return "entry contains a run of multiple spaces";
  return null;
}

function checkEntry(text: string): void {
  const problem = diagnoseEntry(text);
  if (problem !== null) {
    throw new RangeError(`entry failed validation: ${problem}`);
  }
}

function locateOutputFolder(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv !== undefined && fromEnv.trim() !== "") {
    return resolve(fromEnv);
  }
  return resolve("/output");
}

// Create the output folder if it is missing (nested paths included) and
// hand back the full path of the file we are about to write.
function prepareTarget(folder: string): string {
  mkdirSync(folder, { recursive: true });
  return join(folder, "entry.txt");
}

function persistEntry(folder: string, text: string): string {
  const target = prepareTarget(folder);
  writeFileSync(target, text, { encoding: "utf8" });
  return target;
}

function main(): void {
  // Fail fast: validate before touching the filesystem, so a bad string
  // never leaves behind a half-written entry.txt.
  checkEntry(DELIVERABLE);

  const folder = locateOutputFolder();
  const written = persistEntry(folder, DELIVERABLE);

  // Echo the excuse for whoever runs this by hand. The graded artifact
  // is the file at `written`, not this line — the file carries no newline
  // while the console line does, and that difference is intentional.
  console.log(DELIVERABLE);
  void written;
}

main();
