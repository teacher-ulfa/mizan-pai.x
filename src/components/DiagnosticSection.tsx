import React, { useState } from 'react';
import { Chapter } from '../types';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface DiagnosticSectionProps {
  chapter: Chapter;
  savedScore?: number;
  onSaveScore: (score: number) => void;
  onContinueToMateri: () => void;
}

export const DiagnosticSection: React.FC<DiagnosticSectionProps> = ({
  chapter,
  savedScore,
  onSaveScore,
  onContinueToMateri
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
    chapter.diagnosticQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const calculatedScore = Math.round((correctCount / chapter.diagnosticQuestions.length) * 100);
    setScore(calculatedScore);
    setSubmitted(true);
    onSaveScore(calculatedScore);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-2 text-emerald-800">
        <HelpCircle className="w-5 h-5 text-emerald-600" />
        <h3 className="font-bold text-lg font-serif">Asesmen Awal / Diagnostik</h3>
      </div>
      <p className="text-xs text-slate-500 mb-6 leading-relaxed">
        Uji kesiapan belajar dan pengetahuan awal Anda sebelum memulai pembahasan Bab {chapter.number}. Asesmen ini tidak mengurangi nilai rapor akhir, melainkan membantu mengidentifikasi pemahaman dasar Anda.
      </p>

      {submitted && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
              Hasil Asesmen Diagnostik
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-emerald-950 tabular-nums">{score}</span>
              <span className="text-xs text-emerald-700">/ 100 Poin Kesiapan</span>
            </div>
            <p className="text-xs text-emerald-800 mt-1">
              {score >= 70
                ? "Kesiapan awal Anda sangat baik! Siap mendalami materi lebih lanjut."
                : "Bagus! Pelajari Materi Inti berikut dengan saksama untuk memperkuat pemahaman."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ulangi</span>
            </button>
            <button
              onClick={onContinueToMateri}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
            >
              <span>Lanjut ke Materi Inti</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {chapter.diagnosticQuestions.map((q, idx) => {
          const userChoice = selectedAnswers[q.id];
          const isCorrect = userChoice === q.correctIndex;

          return (
            <div key={q.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <p className="text-sm font-semibold text-slate-900 mb-3">
                <span className="text-emerald-700 font-bold mr-1.5">{idx + 1}.</span>
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
                    optionClass = "border-emerald-600 bg-emerald-50 text-emerald-900 font-medium ring-1 ring-emerald-600";
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
                  <span className="font-bold text-slate-700">Penjelasan: </span>
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
              disabled={Object.keys(selectedAnswers).length < chapter.diagnosticQuestions.length}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <span>Periksa Kesiapan Belajar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
