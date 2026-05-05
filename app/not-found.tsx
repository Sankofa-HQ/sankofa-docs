import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="container"
      style={{
        padding: "128px 24px",
        maxWidth: 640,
        textAlign: "center",
      }}
    >
      <p
        style={{
          font: "500 12px/16px var(--font-mono)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--accent)",
          margin: "0 0 16px",
        }}
      >
        404
      </p>
      <h1
        style={{
          font: "600 48px/56px var(--font-display)",
          letterSpacing: "-0.02em",
          margin: "0 0 16px",
        }}
      >
        Page not found
      </h1>
      <p
        style={{
          font: "400 17px/28px var(--font-sans)",
          color: "var(--page-fg-muted)",
          margin: "0 0 32px",
        }}
      >
        The page you’re looking for doesn’t exist, was moved, or hasn’t been
        written yet.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <Link href="/" className="btn btn-primary">
          Back to home
        </Link>
        <Link href="/search" className="btn btn-ghost">
          Search docs
        </Link>
      </div>
    </main>
  );
}
