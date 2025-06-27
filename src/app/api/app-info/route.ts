import { encryptData } from "@/app/utils/crypto";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    const d = encryptData(data.ip);
    return NextResponse.json(d);
  } catch (error) {
    console.error("Failed to fetch:", error);
    return NextResponse.json({ error: "Failed to get data" }, { status: 500 });
  }
}
