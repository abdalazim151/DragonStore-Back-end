/**
 * Smoke test against a running API (default http://localhost:3000).
 * Requires: node index.js with valid MONGO_URI, or set API_URL to a deployed server.
 */
const base = process.env.API_URL || "http://localhost:3000";

async function req(path, opts = {}) {
  const r = await fetch(`${base}${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", ...opts.headers },
  });
  const text = await r.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  return { ok: r.ok, status: r.status, body };
}

async function main() {
  const checks = [];

  const h = await req("/health");
  checks.push(["GET /health", h.ok && h.body?.status === "ok"]);

  const p = await req("/api/products?limit=1");
  checks.push(["GET /api/products", p.ok && p.body?.status === "success"]);

  const failed = checks.filter(([, ok]) => !ok);
  for (const [name, ok] of checks) {
    console.log(ok ? `✓ ${name}` : `✗ ${name}`);
  }
  if (failed.length) {
    console.error(
      "\nSmoke test failed. Start the server: npm run dev\nOr set API_URL to a reachable backend."
    );
    process.exit(1);
  }
  console.log("\nSmoke tests passed.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
