#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const skillsRoot = join(root, "skills");
const pluginsRoot = join(root, "plugins");

const skills = [
  {
    name: "svg-diagram",
    description:
      "Production-grade hand-written SVG diagrams for sequence diagrams, flowcharts, architecture diagrams, ERDs, timelines, and state machines.",
  },
  {
    name: "poly-wiki",
    description:
      "Knowledge-base compiler for ingesting raw materials, extracting reusable patterns, linting wiki structure, and querying archived knowledge.",
  },
];

const excludedNames = new Set([".DS_Store", "node_modules"]);
const excludedSkillDirs = new Set(["codex", "openclaw"]);

function copySkillForCodex(skillName) {
  const source = join(skillsRoot, skillName);
  const target = join(pluginsRoot, skillName, "skills", skillName);

  if (!existsSync(source)) {
    throw new Error(`Missing skill source: ${source}`);
  }

  rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });

  for (const entry of readdirSync(source)) {
    if (excludedNames.has(entry) || excludedSkillDirs.has(entry)) {
      continue;
    }

    const from = join(source, entry);
    const to = join(target, entry);
    const stats = statSync(from);

    if (stats.isDirectory() || stats.isFile()) {
      cpSync(from, to, {
        recursive: stats.isDirectory(),
        filter: (path) => {
          const parts = path.split(/[\\/]/);
          return !parts.some((part) => excludedNames.has(part));
        },
      });
    }
  }
}

for (const skill of skills) {
  const pluginRoot = join(pluginsRoot, skill.name);
  mkdirSync(join(pluginRoot, "skills"), { recursive: true });
  copySkillForCodex(skill.name);
}

console.log(`Built ${skills.length} Codex plugin skill packages.`);
