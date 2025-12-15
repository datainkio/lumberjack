/** @format */

import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const projectRoot = path.resolve(process.cwd());
const srcDir = path.join(projectRoot, "src");
const distDir = path.join(projectRoot, "dist");

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

await cp(srcDir, distDir, {
  recursive: true,
});

console.log("Built dist from src:", distDir);
