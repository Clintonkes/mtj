export default function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 1;
  const left  = Math.max(1, page - delta);
  const right = Math.min(totalPages, page + delta);

  if (left > 1)          { pages.push(1); if (left > 2) pages.push("…"); }
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < totalPages) { if (right < totalPages - 1) pages.push("…"); pages.push(totalPages); }

  const btnBase = {
    minWidth: "36px", height: "36px", padding: "0 10px",
    border: "1.5px solid var(--gray-300)", borderRadius: "var(--r-sm)",
    background: "var(--white)", cursor: "pointer", fontSize: ".85rem",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    transition: "all var(--t-fast)",
  };
  const btnActive = { ...btnBase, background: "var(--grass)", borderColor: "var(--grass)", color: "#fff", fontWeight: 700 };
  const btnDisabled = { ...btnBase, opacity: 0.4, cursor: "not-allowed" };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: ".4rem", padding: "1.25rem 0 .5rem", flexWrap: "wrap" }}>
      <button
        style={page === 1 ? btnDisabled : btnBase}
        disabled={page === 1}
        onClick={() => onPage(page - 1)}
        aria-label="Previous page"
      >
        ‹
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} style={{ padding: "0 4px", color: "var(--gray-500)", fontSize: ".85rem" }}>…</span>
        ) : (
          <button
            key={p}
            style={p === page ? btnActive : btnBase}
            onClick={() => onPage(p)}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        style={page === totalPages ? btnDisabled : btnBase}
        disabled={page === totalPages}
        onClick={() => onPage(page + 1)}
        aria-label="Next page"
      >
        ›
      </button>
    </div>
  );
}
