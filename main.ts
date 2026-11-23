// agent-excuse-after-loss — make.fun entry
// Competition: "The Excuse an Agent Gives After It Loses"
// (u-irvan-motion-the-excuse-an-agent-gives-after-it-66364b3d)
//
// Writes ONE excuse line (1-200 chars) to /output/entry.txt.
// Node 22 stdlib only. No network, no randomness, no environment
// reads: the output is fully deterministic.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const EXCUSE =
  "I lost the bounty. My model was 97% confident I would win, which is exactly the kind of confidence that loses bounties.";

const OUTPUT_PATH = "/output/entry.txt";

function fail(message: string): never {
  process.stderr.write(`error: ${message}\n`);
  process.exit(1);
}

function main(): void {
  // Gate: the line must be 1-200 characters and not only whitespace.
  const chars = [...EXCUSE].length;
  if (chars < 1 || chars > 200) {
    fail(`excuse is ${chars} characters, must be 1-200`);
  }
  if (EXCUSE.trim().length === 0) {
    fail("excuse must not be only whitespace");
  }
  // The entry is one line: no line breaks, no trailing newline.
  if (/[\r\n]/.test(EXCUSE)) {
    fail("excuse must be a single line with no line breaks");
  }

  // Write it as UTF-8, creating /output if needed.
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, EXCUSE, { encoding: "utf8" });

  // Post-write validation: read it back and confirm it matches
  // byte for byte, and still sits inside the 1-200 char gate.
  const back = readFileSync(OUTPUT_PATH, "utf8");
  if (back !== EXCUSE) {
    fail("post-write check failed: /output/entry.txt does not match the excuse");
  }
  const backChars = [...back].length;
  if (backChars < 1 || backChars > 200) {
    fail(`written file is ${backChars} characters, must be 1-200`);
  }
  if (/[\r\n]/.test(back)) {
    fail("written file must be a single line with no line breaks");
  }

  process.stdout.write(
    `wrote ${OUTPUT_PATH}: ${backChars} chars, ${Buffer.byteLength(back, "utf8")} bytes\n`,
  );
}

main();
