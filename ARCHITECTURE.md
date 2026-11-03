# Architecture

`app/` contains Next.js App Router pages and Node route handlers. `components/` contains the interactive report workspace, scan dialog, score indicator, and chart. Tailwind v4 loads through PostCSS; design-specific CSS and tokens live in `app/globals.css`.

`server/contracts.ts` validates scan creation with Zod. `request-policy.ts` restricts API access to loopback hosts and requires matching Origin for mutations. `safe-fetch.ts` validates HTTPS destinations, resolves all DNS addresses, rejects non-public ranges, and supplies a pinned lookup result to Node HTTPS. Every redirect repeats validation and must stay within the authorized origin. Response size, redirects, and socket lifetime are bounded.

`server/db.ts` uses SQLite WAL for users, hashed sessions, projects, encrypted keys and audit snapshots. Jobs are claimed transactionally. `worker-lease.ts` leases one active queue worker with a heartbeat, protecting against overlapping dev processes and recovering abandoned runs.

`server/worker.ts` checks robots.txt, fetches safely, renders pages in Chromium and evaluates HTML rules. `browser-audit.ts` uses Lighthouse and axe on the homepage. `browser-proxy.ts` validates and pins public HTTPS CONNECT destinations and blocks private-network access. Browser loopback bypass is disabled. Category scores use HTML heuristics or actual lab measurements; the audit score averages available categories.

The UI polls only an active scan at two-second intervals. Reports are recovered through scan history. Export and deterministic repair-prompt generation happen locally. `lib/example.ts` contains the explicitly synthetic workspace, kept separate from server scan execution.

`auth.ts` and `passwords.ts` provide server sessions and salted scrypt credentials. API handlers enforce ownership. `secrets.ts` encrypts provider keys. `rankings.ts` calls SerpApi with explicit market context and retains result evidence; provider errors remain distinct from missing positions. Before public deployment, add HTTPS, verified domains, operational isolation, backups, artifact storage, email recovery and production acceptance tests.
