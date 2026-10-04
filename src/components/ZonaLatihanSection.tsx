import React, { useState } from 'react';
import { Chapter } from '../types';
import { Dumbbell, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface ZonaLatihanSectionProps {
  chapter: Chapter;
  savedScore?: number;
  onSaveScore: (score: number) => void;
  onContinueToSumatif: () => void;
}

export const ZonaLatihanSection: React.FC<ZonaLatihanSectionProps> = ({
  chapter,
  savedScore,
  onSaveScore,
  onContinueToSumatif
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(savedScore !== undefined);
  const [score, setScore] = useState<number>(savedScore || 0);

  const handleSelect = (qId: string, idx: number) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: idx }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let correctCount = 0;
    chapter.formativeExercises.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const calculatedScore = Math.round((correctCount / chapter.formativeExercises.length) * 100);
    setScore(calculatedScore);
    setSubmitted(true);
    onSaveScore(calculatedScore);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center gap-2 text-emerald-800">
        <Dumbbell className="w-5 h-5 text-emerald-600" />
        <h3 className="font-bold text-lg font-serif">Zona Latihan (Formatif Interaktif)</h3>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">
        Latihan ini dirancang untuk memperkuat pemahaman konsep inti dan daya nalar Anda sebelum menempuh Asesmen Sumatif ANBK. Jawablah setiap pertanyaan dan cermati ulasan kuncinya.
      </p>

      {submitted && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-teal-800 uppercase tracking-wide">
              Hasil Latihan Formatif
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-teal-950 tabular-nums">{score}</span>
              <span className="text-xs text-teal-700">/ 100 Poin</span>
            </div>
            <p className="text-xs text-teal-800 mt-1">
              {score >= 78
                ? "Luar biasa! Pemahaman konsep Anda matang. Anda sangat siap menghadapi Asesmen Sumatif ANBK."
                : "Sudah baik! Cermati kembali penjelasan jawaban di bawah untuk hasil maksimal di Asesmen Sumatif."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Coba Lagi</span>
            </button>
            <button
              onClick={onContinueToSumatif}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
            >
              <span>Lanjut ke Asesmen Sumatif ANBK</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {chapter.formativeExercises.map((q, idx) => {
          const userChoice = selectedAnswers[q.id];
          const isCorrect = userChoice === q.correctIndex;

          return (
            <div key={q.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <p className="text-sm font-semibold text-slate-900 mb-3">
                <span className="text-teal-700 font-bold mr-1.5">{idx + 1}.</span>
                {q.question}
              </p>

              <div className="space-y-2">
                {q.options.map((option, optIdx) => {
                  let optionClass = "border-slate-200 bg-white text-slate-700 hover:bg-slate-50";

                  if (submitted) {
                    if (optIdx === q.correctIndex) {
                      optionClass = "border-emerald-500 bg-emerald-50 text-emerald-950 font-medium";
                    } else if (userChoice === optIdx && !isCorrect) {
                      optionClass = "border-rose-400 bg-rose-50 text-rose-900";
                    } else {
                      optionClass = "border-slate-100 bg-slate-50 text-slate-400";
                    }
                  } else if (userChoice === optIdx) {
                    optionClass = "border-teal-600 bg-teal-50 text-teal-900 font-medium ring-1 ring-teal-600";
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleSelect(q.id, optIdx)}
                      className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-all flex items-start gap-2.5 ${optionClass}`}
                    >
                      <span className="w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {submitted && optIdx === q.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {submitted && userChoice === optIdx && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600">
                  <span className="font-bold text-slate-700">Kunci & Pembahasan: </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}

        {!submitted && (
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={Object.keys(selectedAnswers).length < chapter.formativeExercises.length}
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <span>Kirim Jawaban Latihan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
