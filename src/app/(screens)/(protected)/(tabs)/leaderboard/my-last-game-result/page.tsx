import { Metadata } from "next";
import ResultContent from "./ResultContent";

export const metadata: Metadata = {
  title: "My Last Game Result | QuizMoney",
  description:
    "View your last game performance, scores, and detailed question analysis on QuizMoney. Track your progress and earnings from your most recent quiz game.",
  keywords:
    "quiz game results, game performance, quiz scores, game analysis, QuizMoney results",
};

const Result = () => {
  return <ResultContent />;
};

export default Result;
