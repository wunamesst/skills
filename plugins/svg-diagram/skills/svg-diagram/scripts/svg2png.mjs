#!/usr/bin/env node
import { readFileSync, existsSync, mkdirSync } from "fs";
import { basename, dirname, extname, join, resolve } from "path";
import { argv, exit } from "process";

function parseViewBox(svg) {
  const vb = svg.match(/viewBox\s*=\s*"([^"]+)"/);
  if (vb) {
    const parts = vb[1].split(/[\s,]+/).map(Number);
    if (parts.length >= 4 && parts[2] > 0 && parts[3] > 0) {
      return { width: parts[2], height: parts[3] };
    }
  }
  const w = svg.match(/\bwidth\s*=\s*"(\d+(?:\.\d+)?)"(?!\s*%)/);
  const h = svg.match(/\bheight\s*=\s*"(\d+(?:\.\d+)?)"(?!\s*%)/);
  if (w && h) return { width: Number(w[1]), height: Number(h[1]) };
  return null;
}

function printHelp() {
  console.log(`Usage: node svg2png.mjs <input.svg> [options]

Options:
  -s, --scale <n>   Scale factor (default: 2)
  -o, --output <p>  Output path (default: <name>@Nx.png)
  -h, --help        Show help

Examples:
  node svg2png.mjs diagram.svg
  node svg2png.mjs diagram.svg -s 3
  node svg2png.mjs diagram.svg -o output.png`);
}

function parseArgs(args) {
  const opts = { input: "", scale: 2, output: "" };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "-h" || arg === "--help") { printHelp(); exit(0); }
    else if (arg === "-s" || arg === "--scale") {
      const s = Number(args[++i]);
      if (isNaN(s) || s <= 0) { console.error(`Invalid scale: ${args[i]}`); exit(1); }
      opts.scale = s;
    }
    else if (arg === "-o" || arg === "--output") opts.output = args[++i];
    else if (!arg.startsWith("-") && !opts.input) opts.input = arg;
  }
  if (!opts.input) { console.error("Error: Input SVG file required"); printHelp(); exit(1); }
  return opts;
}

async function main() {
  const opts = parseArgs(argv.slice(2));
  const input = resolve(opts.input);

  if (!existsSync(input)) { console.error(`Error: ${input} not found`); exit(1); }
  if (extname(input).toLowerCase() !== ".svg") { console.error("Error: Input must be an SVG file"); exit(1); }

  const svg = readFileSync(input).toString("utf-8");
  const dims = parseViewBox(svg);
  if (!dims) { console.error("Error: Cannot determine SVG dimensions from viewBox or width/height"); exit(1); }

  const width = Math.round(dims.width * opts.scale);
  const height = Math.round(dims.height * opts.scale);

  let output;
  if (opts.output) {
    output = resolve(opts.output);
  } else {
    const dir = dirname(input);
    const base = basename(input, ".svg");
    const suffix = opts.scale === 1 ? "" : `@${opts.scale}x`;
    output = join(dir, `${base}${suffix}.png`);
  }

  mkdirSync(dirname(output), { recursive: true });

  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.error("Error: sharp not found. Install with:");
    console.error("  cd skills/svg-diagram/scripts && npm install");
    exit(1);
  }

  await sharp(Buffer.from(svg), { density: 72 * opts.scale })
    .resize(width, height)
    .png()
    .toFile(output);

  console.log(`${input} → ${output} (${width}×${height})`);
}

main();
