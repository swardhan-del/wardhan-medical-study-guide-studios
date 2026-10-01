import { realpathSync } from "node:fs";
import { execFileSync } from "node:child_process";

/** Vercel snapshots can contain a .git entry without a usable Git repository. */
export function hasGitWorktree(directory) {
  try {
    const root = execFileSync("git", ["-C", directory, "rev-parse", "--show-toplevel"], { encoding: "utf8", stdio: "pipe" }).trim();
    return realpathSync(root) === realpathSync(directory);
  } catch {
    return false;
  }
}
