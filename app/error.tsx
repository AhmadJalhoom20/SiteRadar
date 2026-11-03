"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="error-page">
      <h1>The workspace couldn’t load.</h1>
      <p>Your saved scans remain on this device.</p>
      <button className="btn primary" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
