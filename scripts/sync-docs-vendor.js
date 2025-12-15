/** @format */

import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const projectRoot = path.resolve(process.cwd());
const distDir = path.join(projectRoot, "dist");
const docsVendorDir = path.join(
  projectRoot,
  "docs",
  "assets",
  "js",
  "vendors",
  "lumberjack"
);

await rm(docsVendorDir, { recursive: true, force: true });
await mkdir(docsVendorDir, { recursive: true });

await cp(distDir, docsVendorDir, { recursive: true });

console.log("Synced docs vendor from dist:", docsVendorDir);
