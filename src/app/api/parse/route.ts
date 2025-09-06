/* eslint-disable @typescript-eslint/no-explicit-any */
import { getBaseUrl, getParseHeaders } from "@/lib/parseHeaders";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { endpoint, method = "POST", ...params } = await req.json();
    const accessToken = req.headers.get("Authorization") ?? undefined;

    if (!endpoint) {
      return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
    }
    const BASE_URL = getBaseUrl();
    const res = await fetch(`${BASE_URL}/${endpoint}`, {
      method,
      headers: getParseHeaders(accessToken),
      body: method === "GET" ? undefined : JSON.stringify(params),
      next: { revalidate: 0 },
    });

    const data = await res.json();

   

  
    
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    console.error("Proxy error:", err);
    return NextResponse.json(
      { error: err ?? "Internal error" },
      { status: 500 }
    );
  }
}
