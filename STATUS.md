# Implementation status

Implemented: landing, pricing, searchable docs, signup/login/logout, private saved projects, repeat scans, larger typography, pinned sidebar settings, real charts, Chromium rendering, homepage Lighthouse/axe metrics, encrypted SerpApi integration, findings, prompts, exports, progress/cancellation and a leased worker queue. Free is unlimited; Basic/Pro/Max are Coming soon.

Unavailable: field-performance data, AI-answer visibility, Search Console, screenshot artifacts, email verification/recovery, teams, sharing, scheduling and payments. Live rankings and competitors require an optional SerpApi key; no provider account was available for external verification.

Production work remains: verified ownership, PostgreSQL/Redis, artifact storage, team authorization, scheduling, billing, sharing, full Arabic/RTL localization, operational isolation and the complete product-spec acceptance suite. Keep this installation local until deployment hardening is complete.

Verification: unit/security checks and production build pass. Local integration checks passed for account isolation, logout/login, scan reuse and actual browser measurements. The real worker completed an example.com Lighthouse/axe audit; the user's saved website also completed a measured Lighthouse report. Interactive visual QA of this revision was blocked by declined preview permission.
