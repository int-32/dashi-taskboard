import { constants } from "node:fs";
import { copyFile, mkdir, readdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_SOURCE_DIRECTORY = fileURLToPath(new URL("../agents/", import.meta.url));

export async function installBuiltinAgents({
  codexHome = process.env.CODEX_HOME || path.join(os.homedir(), ".codex"),
  sourceDirectory = DEFAULT_SOURCE_DIRECTORY,
} = {}) {
  const targetDirectory = path.join(codexHome, "agents");
  await mkdir(targetDirectory, { recursive: true });

  const installed = [];
  const existing = [];
  const entries = await readdir(sourceDirectory, { withFileTypes: true });
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    if (!entry.isFile() || !entry.name.endsWith(".toml")) continue;
    const targetPath = path.join(targetDirectory, entry.name);
    try {
      await copyFile(
        path.join(sourceDirectory, entry.name),
        targetPath,
        constants.COPYFILE_EXCL,
      );
      installed.push(targetPath);
    } catch (error) {
      if (error?.code !== "EEXIST") throw error;
      existing.push(targetPath);
    }
  }

  return { installed, existing };
}
