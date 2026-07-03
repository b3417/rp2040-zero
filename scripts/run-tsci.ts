import { spawn } from "node:child_process"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, "..")
const tsciBin = path.join(
  repoRoot,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "tsci.exe" : "tsci",
)
const bunBin =
  "C:\\Users\\Manager\\AppData\\Roaming\\npm\\node_modules\\bun\\bin"
const env = {
  ...process.env,
  PATH: [bunBin, process.env.PATH ?? ""].filter(Boolean).join(path.delimiter),
}

const child = spawn(tsciBin, process.argv.slice(2), {
  cwd: repoRoot,
  env,
  stdio: "inherit",
})

child.on("error", (error) => {
  console.error("Failed to launch tsci:", error)
  process.exit(1)
})

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`tsci exited with signal ${signal}`)
    process.exit(1)
  }

  process.exit(code ?? 1)
})
