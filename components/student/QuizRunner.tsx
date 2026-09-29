"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { submitQuiz } from "@/lib/student-actions";

type Question = {
  id: string;
  questionText: string;
  marks: number;
  questionType: string;
  options: string | null;
};

type Quiz = {
  id: string;
  title: string;
  durationMinutes: number;
  passingScore: number;
};

type QuizState = {
  success: boolean;
  error?: string;
  score?: number;
  totalMarks?: number;
  percentage?: number;
  passed?: boolean;
};

const initialState: QuizState = { success: false };

/**
 * Options are stored as a `String?` field on QuizQuestion.
 * Historically this has been either a JSON array of strings or a raw
 * newline-separated list. Handle both to avoid a total quiz failure if
 * a teacher pasted text instead of JSON.
 */
function parseOptions(raw: string | null): string[] {
  if (!raw) return [];
  const trimmed = raw.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((v) => String(v)).filter(Boolean);
      }
    } catch {
      // fall through
    }
  }

  // Fallback: split by newlines and strip leading bullets/numbers.
  return trimmed
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim())
    .filter(Boolean);
}

export function QuizRunner({
  quiz,
  questions,
}: {
  quiz: Quiz;
  questions: Question[];
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    submitQuiz,
    initialState
  );

  const totalSeconds = quiz.durationMinutes * 60;
  const formRef = useRef<HTMLFormElement>(null);

  // Wall-clock start time so timer stays accurate across tab switches.
  const [startedAt] = useState(() => Date.now());
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const hasAutoSubmittedRef = useRef(false);

  // ─── Timer ───
  useEffect(() => {
    const tick = () => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = Math.max(0, totalSeconds - elapsed);
      setSecondsLeft(remaining);
    };
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [startedAt, totalSeconds]);

  // ─── Auto-submit when time runs out ───
  useEffect(() => {
    if (secondsLeft > 0) return;
    if (hasAutoSubmittedRef.current) return;
    if (hasSubmitted) return;
    hasAutoSubmittedRef.current = true;

    // Give the DOM one frame to settle before submitting.
    const id = window.setTimeout(() => {
      formRef.current?.requestSubmit();
    }, 50);
    return () => window.clearTimeout(id);
  }, [secondsLeft, hasSubmitted]);

  // ─── Warn on page close/refresh while quiz is active ───
  useEffect(() => {
    if (hasSubmitted) return;

    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      // Some browsers require a return value
      e.returnValue = "";
      return "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [hasSubmitted]);

  // ─── Handle result ───
  useEffect(() => {
    if (state.success) {
      setHasSubmitted(true);
      toast.success(
        `Quiz submitted! Score: ${state.score ?? 0}/${state.totalMarks ?? 0}`,
        { duration: 4000 }
      );
      router.push("/student/results");
    } else if (state.error) {
      toast.error(state.error);
      // Allow the user to retry after a server error.
      hasAutoSubmittedRef.current = false;
    }
  }, [state, router]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const isTimeCritical = secondsLeft <= 60 && secondsLeft > 0;
  const isTimeUp = secondsLeft === 0;
  const isLocked = isPending || hasSubmitted || isTimeUp;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Sticky header with timer */}
      <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between sticky top-16 z-20">
        <div>
          <h1 className="font-heading text-xl font-bold text-primary">
            {quiz.title}
          </h1>
          <p className="text-sm text-gray-500">
            {questions.length} question{questions.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Time remaining</p>
          <p
            role="timer"
            aria-live="off"
            className={`text-lg font-bold ${
              isTimeCritical ? "text-red-600" : "text-primary"
            }`}
          >
            {timeDisplay}
          </p>
        </div>
      </div>

      {isTimeUp && !isPending && !hasSubmitted && (
        <div
          role="alert"
          className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 text-sm"
        >
          Time is up. Submitting your answers...
        </div>
      )}

      <form ref={formRef} action={formAction} className="space-y-6">
        <input type="hidden" name="quizId" value={quiz.id} />

        {questions.map((q, idx) => {
          const options = parseOptions(q.options);
          const inputName = `question_${q.id}`;

          return (
            <fieldset
              key={q.id}
              disabled={isLocked}
              className="bg-white rounded-lg shadow-sm p-6 disabled:opacity-70"
            >
              <legend className="text-sm text-gray-500 mb-1">
                Question {idx + 1} of {questions.length} · {q.marks} mark
                {q.marks === 1 ? "" : "s"}
              </legend>
              <p className="font-medium text-gray-900 mb-4">
                {q.questionText}
              </p>

              {q.questionType === "multiple_choice" && options.length > 0 ? (
                <div className="space-y-2">
                  {options.map((opt, i) => {
                    const optId = `${inputName}-${i}`;
                    return (
                      <label
                        key={optId}
                        htmlFor={optId}
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          id={optId}
                          type="radio"
                          name={inputName}
                          value={opt}
                          required
                          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        />
                        <span className="text-sm">{opt}</span>
                      </label>
                    );
                  })}
                </div>
              ) : q.questionType === "true_false" ? (
                <div className="space-y-2">
                  {["true", "false"].map((opt, i) => {
                    const optId = `${inputName}-${i}`;
                    return (
                      <label
                        key={optId}
                        htmlFor={optId}
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          id={optId}
                          type="radio"
                          name={inputName}
                          value={opt}
                          required
                          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        />
                        <span className="text-sm capitalize">{opt}</span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <>
                  <label htmlFor={inputName} className="sr-only">
                    Your answer
                  </label>
                  <input
                    id={inputName}
                    type="text"
                    name={inputName}
                    placeholder="Your answer"
                    required
                    maxLength={500}
                    autoComplete="off"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </>
              )}
            </fieldset>
          );
        })}

        <button
          type="submit"
          disabled={isLocked}
          className="w-full bg-primary text-white px-4 py-3 rounded-md hover:bg-primary-light disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {isPending ? "Submitting..." : "Submit Quiz"}
        </button>
      </form>
    </div>
  );
}