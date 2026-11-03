import Link from "next/link";
import { PublicHeader, PublicFooter } from "@/components/public-shell";
export default function NotFound() {
  return (
    <div className="public-site">
      <PublicHeader />
      <main className="public-container">
        <div className="workspace-empty">
          <h1>This page is out of view.</h1>
          <p>
            The link may have changed. Your saved websites and reports are in
            your workspace.
          </p>
          <div className="account-actions" style={{ justifyContent: "center" }}>
            <Link className="btn primary" href="/app">
              Open workspace
            </Link>
            <Link className="btn" href="/docs">
              Read the docs
            </Link>
            <Link className="btn" href="/">
              Back to home
            </Link>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
