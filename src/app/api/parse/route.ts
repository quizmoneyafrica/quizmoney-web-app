import { getBaseUrl, getParseHeaders } from "@/lib/parseHeaders";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { endpoint, method = "POST", body } = await req.json();
    const sessionToken = req.headers.get("x-session-token") ?? undefined;

    if (!endpoint) {
      return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
    }
    const BASE_URL = getBaseUrl();
    const res = await fetch(`${BASE_URL}/${endpoint}`, {
      method,
      headers: getParseHeaders(sessionToken),
      body: method === "GET" ? undefined : JSON.stringify(body || {}),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
