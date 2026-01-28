import { readdirSync, mkdirSync, renameSync, statSync } from "fs";
import { join, dirname } from "path";

const distDir = "dist";

function processDir(dir) {
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (entry.endsWith(".html") && entry !== "index.html") {
      // Convert foo.html to foo/index.html
      const baseName = entry.slice(0, -5);
      const newDir = join(dir, baseName);
      const newPath = join(newDir, "index.html");

      mkdirSync(newDir, { recursive: true });
      renameSync(fullPath, newPath);
      console.log(`${fullPath} -> ${newPath}`);
    }
  }
}

processDir(distDir);
