import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
const require = createRequire(import.meta.url);
// The desktop host may supply a custom NODE_ENV; Next requires its standard values.
process.env.NODE_ENV = process.argv[2] === "dev" ? "development" : "production";
await import(pathToFileURL(require.resolve("next/dist/bin/next")).href);
