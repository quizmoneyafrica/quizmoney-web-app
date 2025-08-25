/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";

type Question = {
  number: string;
  question: string;
  options: string[];
  correctAnswer: string;
};

export function useQuestions() {
  const [data, setData] = useState<Question[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/demo-questions");
        const randomQuestions = await res.json();
        setData(randomQuestions);
      } catch (e: any) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, loading, err };
}
