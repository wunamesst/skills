#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const expectedMarketplaceName = "flolib-skills";
const skills = ["svg-diagram", "poly-wiki"];
const errors = [];

function fail(message) {
  errors.push(message);
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    fail(`Invalid JSON at ${path}: ${error.message}`);
    return null;
  }
}

function validateSkill(path, expectedName) {
  if (!existsSync(path)) {
    fail(`Missing skill file: ${path}`);
    return;
  }

  const body = readFileSync(path, "utf8");
  const match = body.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    fail(`Missing YAML frontmatter: ${path}`);
    return;
  }

  const frontmatter = match[1];
  if (!new RegExp(`^name:\\s*${expectedName}\\s*$`, "m").test(frontmatter)) {
    fail(`Skill name mismatch in ${path}; expected ${expectedName}`);
  }
  if (!/^description:\s*(>|[|]|["']?.+)/m.test(frontmatter)) {
    fail(`Missing description in ${path}`);
  }
}

function validateNoNestedSkillFiles(skillDir) {
  const nested = [];
  const bundledDependencies = [];

  function walk(dir, depth = 0) {
    for (const entry of readdirSync(dir)) {
      if (entry === ".DS_Store") {
        continue;
      }
      const path = join(dir, entry);
      const stats = statSync(path);
      if (stats.isDirectory()) {
        if (entry === "node_modules") {
          bundledDependencies.push(path);
          continue;
        }
        walk(path, depth + 1);
      } else if (entry === "SKILL.md" && depth > 0) {
        nested.push(path);
      }
    }
  }

  walk(skillDir);
  if (nested.length > 0) {
    fail(`Generated plugin contains nested SKILL.md files: ${nested.join(", ")}`);
  }
  if (bundledDependencies.length > 0) {
    fail(`Generated plugin contains node_modules directories: ${bundledDependencies.join(", ")}`);
  }
}

function validateClaudeMarketplace() {
  const path = join(root, ".claude-plugin", "marketplace.json");
  const marketplace = readJson(path);
  if (!marketplace) {
    return;
  }

  if (marketplace.name !== expectedMarketplaceName) {
    fail(`Claude marketplace name must be ${expectedMarketplaceName}`);
  }

  for (const skill of skills) {
    const entry = marketplace.plugins?.find((plugin) => plugin.name === skill);
    if (!entry) {
      fail(`Claude marketplace missing plugin entry: ${skill}`);
      continue;
    }
    if (entry.source?.path !== `skills/${skill}`) {
      fail(`Claude marketplace path for ${skill} must be skills/${skill}`);
    }
  }
}

function validateCodexMarketplace() {
  const path = join(root, ".agents", "plugins", "marketplace.json");
  const marketplace = readJson(path);
  if (!marketplace) {
    return;
  }

  if (marketplace.name !== expectedMarketplaceName) {
    fail(`Codex marketplace name must be ${expectedMarketplaceName}`);
  }

  if (marketplace.interface?.displayName !== "FloLib Skills") {
    fail("Codex marketplace displayName must be FloLib Skills");
  }

  for (const skill of skills) {
    const entry = marketplace.plugins?.find((plugin) => plugin.name === skill);
    if (!entry) {
      fail(`Codex marketplace missing plugin entry: ${skill}`);
      continue;
    }
    if (entry.source?.source !== "local") {
      fail(`Codex marketplace source for ${skill} must be local`);
    }
    if (entry.source?.path !== `./plugins/${skill}`) {
      fail(`Codex marketplace path for ${skill} must be ./plugins/${skill}`);
    }
    if (entry.policy?.installation !== "AVAILABLE") {
      fail(`Codex marketplace installation policy for ${skill} must be AVAILABLE`);
    }
    if (entry.policy?.authentication !== "ON_INSTALL") {
      fail(`Codex marketplace authentication policy for ${skill} must be ON_INSTALL`);
    }
  }
}

function validateCodexPlugins() {
  for (const skill of skills) {
    const pluginRoot = join(root, "plugins", skill);
    const manifest = readJson(join(pluginRoot, ".codex-plugin", "plugin.json"));
    if (!manifest) {
      continue;
    }

    if (manifest.name !== skill) {
      fail(`Codex plugin manifest name mismatch for ${skill}`);
    }
    if (manifest.skills !== "./skills/") {
      fail(`Codex plugin ${skill} must declare skills as ./skills/`);
    }
    validateSkill(join(pluginRoot, "skills", skill, "SKILL.md"), skill);
    validateNoNestedSkillFiles(join(pluginRoot, "skills", skill));
  }
}

for (const skill of skills) {
  validateSkill(join(root, "skills", skill, "SKILL.md"), skill);
}
validateClaudeMarketplace();
validateCodexMarketplace();
validateCodexPlugins();

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log("flolib-skills validation passed.");
