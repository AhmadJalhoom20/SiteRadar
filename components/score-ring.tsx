export function ScoreRing({ score }: { score: number | null }) {
  const radius = 65,
    circumference = 2 * Math.PI * radius;
  return (
    <div
      className="score-ring"
      aria-label={
        score === null
          ? "Overall score unavailable"
          : `Overall health ${score} out of 100`
      }
    >
      <svg viewBox="0 0 180 180" aria-hidden="true">
        <circle cx="90" cy="90" r="83" className="ring-guide" />
        <circle cx="90" cy="90" r="74" className="ring-guide" />
        <circle cx="90" cy="90" r={radius} className="ring-track" />
        <circle
          cx="90"
          cy="90"
          r={radius}
          className="ring-value"
          strokeDasharray={`${(circumference * (score ?? 0)) / 100} ${circumference}`}
          transform="rotate(-90 90 90)"
        />
        <circle cx="90" cy="7" r="3" fill="var(--green)" />
      </svg>
      <div className="score-number">
        <strong>{score ?? "—"}</strong>
        <span>{score === null ? "not measured" : "out of 100"}</span>
      </div>
    </div>
  );
}
