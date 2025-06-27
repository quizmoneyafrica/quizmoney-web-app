import { NextResponse } from "next/server";
import { getParseHeaders } from "@/lib/parseHeaders"; // your existing header util
import { getBaseUrl } from "@/lib/parseHeaders"; // same here
import { store } from "@/app/store/store";
import { decryptData } from "@/app/utils/crypto";

export async function GET() {
  const encrypted = store.getState().auth.userEncryptedData;
  const user = encrypted ? decryptData(encrypted) : null;
  const sessionToken = user?.sessionToken;
  try {
    if (!sessionToken) {
      throw new Error("User session token not found");
    }
    const BASE_URL = getBaseUrl();
    const res = await fetch(`${BASE_URL}/classes/Avatars`, {
      method: "GET",
      headers: getParseHeaders(sessionToken),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error fetching avatars:", error);
    return NextResponse.json(
      { error: "Failed to fetch avatars" },
      { status: 500 }
    );
  }
}
