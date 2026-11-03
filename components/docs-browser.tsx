"use client";
import Link from "next/link";
import { useState } from "react";
import { MagnifyingGlass, ArrowRight, BookOpen } from "@phosphor-icons/react";
import { docs } from "@/lib/docs";
export function DocsBrowser() {
  const [q, setQ] = useState("");
  const filtered = docs.filter((d) =>
    `${d.title} ${d.description} ${d.sections.map((s) => s.body).join(" ")}`
      .toLowerCase()
      .includes(q.toLowerCase()),
  );
  return (
    <>
      <label className="docs-search">
        <MagnifyingGlass size={22} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the documentation…"
          aria-label="Search documentation"
        />
      </label>
      <div className="docs-index">
        {filtered.map((d) => (
          <Link key={d.slug} href={`/docs/${d.slug}`}>
            <BookOpen size={23} />
            <div>
              <h2>{d.title}</h2>
              <p>{d.description}</p>
            </div>
            <ArrowRight size={20} />
          </Link>
        ))}
      </div>
      {!filtered.length && (
        <p className="docs-empty">
          No articles match “{q}”. Try “performance”, “keywords”, or “account”.
        </p>
      )}
    </>
  );
}
