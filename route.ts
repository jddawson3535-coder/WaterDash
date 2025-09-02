import { NextRequest } from "next/server";

export const runtime = "edge";

const startedAt = Date.now();

export async function GET(_req: NextRequest) {
  const uptimeMs = Date.now() - startedAt;
  const envHasKey = Boolean(process.env.DATA_GOV_API_KEY || process.env.ECHO_API_KEY);
  const payload = {
    status: "ok",
    uptime_ms: uptimeMs,
    proxy_env_key_present: envHasKey,
    timestamp: new Date().toISOString(),
    version: "1.1.0"
  };
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { "content-type": "application/json", "cache-control": "no-store" }
  });
}
