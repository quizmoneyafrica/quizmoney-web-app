/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

function getRandomSubset<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

const BASE = "https://demo.qmtech.org";

export async function GET() {
  const manifest = await fetch(`${BASE}/manifest.json`, { cache: "no-store" }).then(r => r.json());
  const res = await fetch(`${BASE}${manifest.current}`, { cache: "force-cache" });
  const file = await res.json();
  const allQuestions: any[] = Array.isArray(file) ? file : file.questions;

  const random10 = getRandomSubset(allQuestions, 10);
  return NextResponse.json(random10, { status: 200 });
}