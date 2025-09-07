import { getBaseUrl } from "@/lib/parseHeaders";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { tokenValue } = await req.json();

    if (!tokenValue) {
      return NextResponse.json(
        { error: "Missing tokenValue in request body" },
        { status: 400 }
      );
    }
    const BASE_URL = getBaseUrl();
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tokenValue }),
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error in /auth/refresh route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
