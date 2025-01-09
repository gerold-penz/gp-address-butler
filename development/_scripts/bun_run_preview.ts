#!/usr/bin/env bun
import { $ } from "bun"
import { join } from "node:path"


$.cwd(join(__dirname, "..", "sveltekit_src"))

let exitCode = 1
try {
    exitCode = (await $`bun run preview`).exitCode
} finally {
    if (exitCode !== 0) {
        prompt("\nPress ENTER to exit.")
    }
}
