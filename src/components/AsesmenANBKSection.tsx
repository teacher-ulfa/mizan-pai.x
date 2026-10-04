import React, { useState } from 'react';
import { Chapter, AssessmentQuestion } from '../types';
import { KKTP_SCORE } from '../data/schoolData';
import { FileText, CheckCircle2, XCircle, Award, Unlock, AlertCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AsesmenANBKSectionProps {
  chapter: Chapter;
  savedScore?: number;
  onSaveSumativeScore: (score: number) => void;
  onUnlockNextChapter: () => void;
  onGoToRefleksi: () => void;
  isNextChapterUnlocked: boolean;
}

export const AsesmenANBKSection: React.FC<AsesmenANBKSectionProps> = ({
  chapter,
  savedScore,
  onSaveSumativeScore,
  onUnlockNextChapter,
  onGoToRefleksi,
  isNextChapterUnlocked
}) => {
  // Answer states
  const [singleAnswers, setSingleAnswers] = useState<Record<string, string>>({});
  const [complexAnswers, setComplexAnswers] = useState<Record<string, string[]>>({});
  const [boolAnswers, setBoolAnswers] = useState<Record<string, boolean>>({});
  const [matchingSelections, setMatchingSelections] = useState<Record<string, Record<string, string>>>({});
  const [essayText, setEssayText] = useState<Record<string, string>>({});
  const [essaySelfScore, setEssaySelfScore] = useState<Record<string, number>>({});

  const [submitted, setSubmitted] = useState<boolean>(savedScore !== undefined);
  const [finalScore, setFinalScore] = useState<number>(savedScore || 0);

  // Handlers
  const handleSingleSelect = (qId: string, optId: string) => {
    if (submitted) return;
    setSingleAnswers(prev => ({ ...prev, [qId]: optId }));
  };

  const handleComplexToggle = (qId: string, optId: string) => {
    if (submitted) return;
    const current = complexAnswers[qId] || [];
    if (current.includes(optId)) {
      setComplexAnswers(prev => ({ ...prev, [qId]: current.filter(x => x !== optId) }));
    } else {
      setComplexAnswers(prev => ({ ...prev, [qId]: [...current, optId] }));
    }
  };

  const handleBoolSelect = (qId: string, val: boolean) => {
    if (submitted) return;
    setBoolAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleMatchingChange = (qId: string, leftText: string, rightVal: string) => {
    if (submitted) return;
    setMatchingSelections(prev => ({
      ...prev,
      [qId]: {
        ...(prev[qId] || {}),
        [leftText]: rightVal
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let earnedPoints = 0;
    const totalQuestions = chapter.sumativeQuestions.length;
    const pointsPerQuestion = 100 / totalQuestions;

    chapter.sumativeQuestions.forEach(q => {
      if (q.type === 'multiple_choice') {
        if (singleAnswers[q.id] === q.correctAnswer) {
          earnedPoints += pointsPerQuestion;
        }
      } else if (q.type === 'multiple_choice_complex') {
        const userSelected = (complexAnswers[q.id] || []).sort();
        const expected = Array.isArray(q.correctAnswer) ? [...q.correctAnswer].sort() : [];
        if (userSelected.length === expected.length && userSelected.every((v, i) => v === expected[i])) {
          earnedPoints += pointsPerQuestion;
        } else if (userSelected.some(v => expected.includes(v))) {
          // partial points
          earnedPoints += pointsPerQuestion * 0.5;
        }
      } else if (q.type === 'true_false') {
        if (boolAnswers[q.id] === q.correctBoolean) {
          earnedPoints += pointsPerQuestion;
        }
      } else if (q.type === 'matching' && q.matchingPairs) {
        const userMatches = matchingSelections[q.id] || {};
        let matchesCorrect = 0;
        q.matchingPairs.forEach(pair => {
          if (userMatches[pair.left] === pair.right) {
            matchesCorrect += 1;
          }
        });
        const ratio = matchesCorrect / q.matchingPairs.length;
        earnedPoints += pointsPerQuestion * ratio;
      } else if (q.type === 'essay') {
        // essay gets 80% if text written, or self-assessed points
        const textLen = (essayText[q.id] || '').trim().length;
        if (textLen >= 50) {
          earnedPoints += pointsPerQuestion;
        } else if (textLen > 10) {
          earnedPoints += pointsPerQuestion * 0.7;
        }
      }
    });

    const calculatedTotal = Math.min(100, Math.round(earnedPoints));
    setFinalScore(calculatedTotal);
    setSubmitted(true);
    onSaveSumativeScore(calculatedTotal);

    if (calculatedTotal >= KKTP_SCORE) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      onUnlockNextChapter();
    }
  };

  const handleReset = () => {
    setSingleAnswers({});
    setComplexAnswers({});
    setBoolAnswers({});
    setMatchingSelections({});
    setEssayText({});
    setSubmitted(false);
  };

  const isPassed = finalScore >= KKTP_SCORE;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-2 text-emerald-800">
          <FileText className="w-5 h-5 text-emerald-700" />
          <div>
            <h3 className="font-bold text-lg text-slate-900 font-serif">
              Asesmen Sumatif Berbasis ANBK
            </h3>
            <span className="text-xs text-slate-500">
              Literasi Membaca & Penalaran Kontekstual · Kriteria Ketuntasan (KKTP): {KKTP_SCORE}
            </span>
          </div>
        </div>

        {submitted && (
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              isPassed ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
            }`}>
              {isPassed ? "TUNTAS (BAB BERIKUTNYA TERBUKA)" : `BELUM MENCAPAI KKTP (≥${KKTP_SCORE})`}
            </span>
          </div>
        )}
      </div>

      {/* Result Card when submitted */}
      {submitted && (
        <div className={`p-5 rounded-2xl border ${
          isPassed
            ? 'bg-linear-to-r from-emerald-50 to-teal-50 border-emerald-300'
            : 'bg-rose-50 border-rose-200'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Capaian Asesmen Sumatif Bab {chapter.number}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className={`text-4xl font-black tabular-nums ${isPassed ? 'text-emerald-900' : 'text-rose-900'}`}>
                  {finalScore}
                </span>
                <span className="text-xs text-slate-500">/ 100 Poin Standar ANBK</span>
              </div>
              <p className="text-xs sm:text-sm mt-2 text-slate-700 leading-relaxed">
                {isPassed
                  ? `Alhamdulillah! Selamat, Anda berhasil menuntaskan Bab ${chapter.number}. Pintu materi Bab berikutnya kini telah TERBUKA untuk Anda!`
                  : `Nilai Anda (${finalScore}) belum mencapai KKTP ${KKTP_SCORE}. Silakan baca ulang wawasan materi di atas dan coba kembali asesmen sumatif ini.`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi Asesmen</span>
              </button>

              {isPassed && (
                <button
                  type="button"
                  onClick={onGoToRefleksi}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors"
                >
                  <span>Isi Nilai Refleksi Diri</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stimulus Literasi ANBK */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-700 text-white">
            Stimulus Literasi Wacana
          </span>
          <span className="text-xs text-slate-400">Model AKM / ANBK Kemendikbudristek</span>
        </div>
        <h4 className="text-base font-bold text-slate-900 font-serif">
          {chapter.anbkStimulus.title}
        </h4>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {chapter.anbkStimulus.text}
        </p>
        <span className="text-[11px] text-slate-400 italic block">
          Sumber: {chapter.anbkStimulus.source}
        </span>
      </div>

      {/* Questions Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {chapter.sumativeQuestions.map((q, idx) => (
          <div key={q.id} className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-xs space-y-4">
            {/* Header Soal */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                Soal {idx + 1} · {
                  q.type === 'multiple_choice' ? 'Pilihan Ganda Tunggal' :
                  q.type === 'multiple_choice_complex' ? 'Pilihan Ganda Kompleks (Centang Semua Pilihan Benar)' :
                  q.type === 'true_false' ? 'Pernyataan Benar / Salah' :
                  q.type === 'matching' ? 'Menjodohkan Konsep' : 'Uraian Bernalar Kritis'
                }
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-900 leading-relaxed">
              {q.question}
            </p>

            {/* Type 1: Multiple Choice */}
            {q.type === 'multiple_choice' && q.options && (
              <div className="space-y-2">
                {q.options.map((opt) => {
                  const isChecked = singleAnswers[q.id] === opt.id;
                  const isCorrect = opt.id === q.correctAnswer;

                  let optStyle = "border-slate-200 hover:bg-slate-50";
                  if (submitted) {
                    if (isCorrect) {
                      optStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-medium";
                    } else if (isChecked && !isCorrect) {
                      optStyle = "border-rose-400 bg-rose-50 text-rose-900";
                    } else {
                      optStyle = "border-slate-100 text-slate-400";
                    }
                  } else if (isChecked) {
                    optStyle = "border-emerald-600 bg-emerald-50 text-emerald-900 font-medium ring-1 ring-emerald-600";
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleSingleSelect(q.id, opt.id)}
                      className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-3 transition-all ${optStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {opt.id}
                      </span>
                      <span className="flex-1 leading-snug">{opt.text}</span>
                      {submitted && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {submitted && isChecked && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Type 2: Multiple Choice Complex */}
            {q.type === 'multiple_choice_complex' && q.options && (
              <div className="space-y-2">
                {q.options.map((opt) => {
                  const isChecked = (complexAnswers[q.id] || []).includes(opt.id);
                  const isExpected = Array.isArray(q.correctAnswer) && q.correctAnswer.includes(opt.id);

                  let optStyle = "border-slate-200 hover:bg-slate-50";
                  if (submitted) {
                    if (isExpected) {
                      optStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-medium";
                    } else if (isChecked && !isExpected) {
                      optStyle = "border-rose-400 bg-rose-50 text-rose-900";
                    } else {
                      optStyle = "border-slate-100 text-slate-400";
                    }
                  } else if (isChecked) {
                    optStyle = "border-emerald-600 bg-emerald-50 text-emerald-900 font-medium ring-1 ring-emerald-600";
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleComplexToggle(q.id, opt.id)}
                      className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-3 transition-all ${optStyle}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="w-4 h-4 text-emerald-600 rounded-sm mt-0.5 pointer-events-none"
                      />
                      <span className="flex-1 leading-snug">{opt.text}</span>
                      {submitted && isExpected && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Type 3: True / False */}
            {q.type === 'true_false' && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800">
                  <span className="font-semibold">{q.trueFalseStatement}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={submitted}
                    onClick={() => handleBoolSelect(q.id, true)}
                    className={`flex-1 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all ${
                      boolAnswers[q.id] === true
                        ? 'bg-emerald-700 text-white border-emerald-800'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    BENAR
                  </button>
                  <button
                    type="button"
                    disabled={submitted}
                    onClick={() => handleBoolSelect(q.id, false)}
                    className={`flex-1 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all ${
                      boolAnswers[q.id] === false
                        ? 'bg-rose-700 text-white border-rose-800'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    SALAH
                  </button>
                </div>
              </div>
            )}

            {/* Type 4: Matching Pairs */}
            {q.type === 'matching' && q.matchingPairs && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">Pilih pasangan yang tepat untuk setiap konsep di lajur kiri:</p>
                <div className="space-y-2">
                  {q.matchingPairs.map((pair, pIdx) => {
                    const currentVal = (matchingSelections[q.id] || {})[pair.left] || '';
                    const isRight = submitted && currentVal === pair.right;

                    return (
                      <div key={pIdx} className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-xs font-bold text-slate-800">{pair.left}</span>
                        <select
                          disabled={submitted}
                          value={currentVal}
                          onChange={(e) => handleMatchingChange(q.id, pair.left, e.target.value)}
                          className={`w-full text-xs p-2 rounded-lg border bg-white ${
                            submitted
                              ? isRight ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium' : 'border-rose-400 bg-rose-50 text-rose-900'
                              : 'border-slate-300'
                          }`}
                        >
                          <option value="">-- Pilih Pasangan Jawaban --</option>
                          {q.matchingPairs?.map((opt, oIdx) => (
                            <option key={oIdx} value={opt.right}>
                              {opt.right}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Type 5: Essay */}
            {q.type === 'essay' && (
              <div className="space-y-2">
                <textarea
                  rows={4}
                  disabled={submitted}
                  value={essayText[q.id] || ''}
                  onChange={(e) => setEssayText(prev => ({ ...prev, [q.id]: e.target.value }))}
                  placeholder="Ketikkan uraian dan argumentasi analisis Anda di sini..."
                  className="w-full p-3 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
                />
                {q.rubricHint && (
                  <p className="text-[11px] text-slate-500 italic">
                    <span className="font-semibold">Petunjuk Rubrik Penilaian:</span> {q.rubricHint}
                  </p>
                )}
              </div>
            )}

            {/* Explanation when submitted */}
            {submitted && (
              <div className="mt-3 p-3 rounded-xl bg-slate-100 text-xs text-slate-700 border-l-4 border-emerald-600">
                <span className="font-bold text-slate-900">Pembahasan & Analisis: </span>
                {q.explanation}
              </div>
            )}
          </div>
        ))}

        {!submitted && (
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <span>Kirim & Nilai Asesmen Sumatif</span>
              <Award className="w-4 h-4" />
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
