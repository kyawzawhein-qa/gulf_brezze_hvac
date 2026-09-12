#!/usr/bin/env node
import { readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "public/scroll/sequence");
const frames = readdirSync(dir)
  .filter((f) => /^frame_\d+\.webp$/i.test(f))
  .sort();
const manifest = {
  version: 1,
  width: 1600,
  height: 900,
  frameCount: frames.length,
  pattern: "frame_{###}.webp",
  frames: frames.map((name) => `/scroll/sequence/${name}`),
  captions: [
    { at: 0.0, text: "We keep Lee County cool" },
    { at: 0.22, text: "From the roof" },
    { at: 0.48, text: "through the ducts" },
    { at: 0.74, text: "to every room" },
  ],
};
writeFileSync(join(dir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`Wrote manifest.json with ${frames.length} frames`);
