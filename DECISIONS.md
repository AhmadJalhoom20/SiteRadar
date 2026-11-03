# Decisions

- Preserve the user's requested Next.js, Node.js, Tailwind stack. Hosting is local because the Sites Worker runtime is not a match for a standalone Node worker and Node SQLite. No cloud deployment was attempted.
- Use stable packages resolved in package-lock.json; no canary dependencies. Next.js 16.4.4 and React 19 are installed. Vitest was upgraded to 5.1.0 after npm audit identified vulnerable older test dependencies. The final install reported zero vulnerabilities.
- Use Node 24 native TypeScript stripping for the worker and built-in SQLite to avoid a second local database service. This is a documented local implementation boundary, not a replacement for the spec's multi-tenant production design.
- Use actual Chromium, Lighthouse 13.5.0 and axe measurements. Lighthouse was pinned to a stable release with a clean dependency audit. Example data remains separate from live worker execution.
- Market context configures SERP queries; device also selects the browser viewport and Lighthouse profile. No network-location spoofing is claimed.
- Free remains unlimited until an explicit owner instruction changes it. Basic/Pro/Max are Coming soon, with no payment actions.
- Persist project configuration, protect report ownership, encrypt provider keys, lease one active worker, and use deterministic date locale/timezone.
- Use a deterministic evidence-based prompt generator. An AI API is unnecessary for assembling exact observations and would introduce another trust boundary.
