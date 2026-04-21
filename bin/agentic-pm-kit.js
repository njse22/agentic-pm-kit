#!/usr/bin/env node

// Production entry point.
// Imports the compiled output from `npm run build` (dist/bin.js).
// For development use `bun run src/bin.ts` instead.

import("../dist/bin.js")
  .then((m) => m.main?.())
  .catch((err) => {
    if (err?.code === "ERR_MODULE_NOT_FOUND" || err?.code === "MODULE_NOT_FOUND") {
      console.error(
        "Error: dist/bin.js not found. Did you forget to run `npm run build`?"
      );
    } else {
      console.error("Fatal error:", err);
    }
    process.exit(1);
  });
