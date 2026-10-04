import React, { useState, useEffect } from 'react';
import { Gamepad2, Trophy, Sparkles, Timer, CheckCircle, RotateCcw, Flame, Shuffle, HelpCircle } from 'lucide-react';
import { QUIZ_CERDAS_CERMAT, MATCHING_CARDS_SETS, WORD_SCRAMBLE_PUZZLES, QuizGameQuestion } from '../data/gamesData';
import confetti from 'canvas-confetti';

interface EducationalGamesProps {
  gameScore: number;
  totalXP: number;
  onAddScore: (points: number, xp: number) => void;
}

export const EducationalGames: React.FC<EducationalGamesProps> = ({
  gameScore,
  totalXP,
  onAddScore
}) => {
  const [activeGame, setActiveGame] = useState<'cerdas_cermat' | 'matching' | 'scramble'>('cerdas_cermat');

  // --- GAME 1: CERDAS CERMAT STATE ---
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [timer, setTimer] = useState(15);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [quizGameOver, setQuizGameOver] = useState(false);

  useEffect(() => {
    if (activeGame !== 'cerdas_cermat' || isAnswered || quizGameOver) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAnswer(-1); // timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeGame, isAnswered, quizGameOver, currentQIndex]);

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedOpt(index);
    setIsAnswered(true);

    const question = QUIZ_CERDAS_CERMAT[currentQIndex];
    if (index === question.correctIndex) {
      const addedPoints = 100 + streak * 20;
      setQuizScore(prev => prev + addedPoints);
      setStreak(prev => prev + 1);
      onAddScore(addedPoints, question.xp);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    } else {
      setStreak(0);
    }
  };

  const handleNextQuiz = () => {
    if (currentQIndex < QUIZ_CERDAS_CERMAT.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
      setTimer(15);
    } else {
      setQuizGameOver(true);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setTimer(15);
    setQuizScore(0);
    setStreak(0);
    setQuizGameOver(false);
  };

  // --- GAME 2: MATCHING CARDS STATE ---
  const [matchingSetIndex, setMatchingSetIndex] = useState(0);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [matchMoves, setMatchMoves] = useState(0);
  const currentSet = MATCHING_CARDS_SETS[matchingSetIndex];

  const handleCardClick = (cardId: string, pairId: string) => {
    if (selectedCards.length === 2 || selectedCards.includes(cardId) || matchedPairs.includes(pairId)) return;

    const newSelected = [...selectedCards, cardId];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMatchMoves(prev => prev + 1);
      const firstCard = currentSet.cards.find(c => c.id === newSelected[0]);
      const secondCard = currentSet.cards.find(c => c.id === newSelected[1]);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        setMatchedPairs(prev => [...prev, firstCard.pairId]);
        onAddScore(150, 40);
        confetti({ particleCount: 30, spread: 40 });
        setTimeout(() => setSelectedCards([]), 600);
      } else {
        setTimeout(() => setSelectedCards([]), 1000);
      }
    }
  };

  const handleResetMatching = () => {
    setSelectedCards([]);
    setMatchedPairs([]);
    setMatchMoves(0);
  };

  // --- GAME 3: WORD SCRAMBLE STATE ---
  const [scrambleIndex, setScrambleIndex] = useState(0);
  const [scrambleGuess, setScrambleGuess] = useState('');
  const [scrambleSubmitted, setScrambleSubmitted] = useState(false);
  const [isScrambleCorrect, setIsScrambleCorrect] = useState(false);

  const currentScramble = WORD_SCRAMBLE_PUZZLES[scrambleIndex];

  const handleCheckScramble = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanGuess = scrambleGuess.trim().toUpperCase();
    const cleanSolution = currentScramble.solution.replace(/\s+/g, '').toUpperCase();
    const isRight = cleanGuess.replace(/\s+/g, '') === cleanSolution;

    setIsScrambleCorrect(isRight);
    setScrambleSubmitted(true);

    if (isRight) {
      onAddScore(100, 35);
      confetti({ particleCount: 50, spread: 60 });
    }
  };

  const handleNextScramble = () => {
    if (scrambleIndex < WORD_SCRAMBLE_PUZZLES.length - 1) {
      setScrambleIndex(prev => prev + 1);
    } else {
      setScrambleIndex(0);
    }
    setScrambleGuess('');
    setScrambleSubmitted(false);
    setIsScrambleCorrect(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-emerald-400" />
              <h2 className="text-xl sm:text-2xl font-bold font-serif">
                Zona Game Edukasi MIZAN
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-emerald-200">
              Belajar mandiri semakin seru, asyik, dan menantang dengan ragam kuis & permainan edukatif Islam.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/10 text-center">
              <span className="text-[10px] text-emerald-200 block uppercase font-bold">Total Skor</span>
              <span className="text-xl font-black text-amber-300 tabular-nums">{gameScore} Poin</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/10 text-center">
              <span className="text-[10px] text-emerald-200 block uppercase font-bold">Pengalaman (XP)</span>
              <span className="text-xl font-black text-white tabular-nums">{totalXP} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setActiveGame('cerdas_cermat')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeGame === 'cerdas_cermat'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Timer className="w-4 h-4" />
          <span>1. Kuis Kilat Cerdas Cermat</span>
        </button>

        <button
          onClick={() => setActiveGame('matching')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeGame === 'matching'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>2. Pencocokan Kartu Konsep</span>
        </button>

        <button
          onClick={() => setActiveGame('scramble')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeGame === 'scramble'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Shuffle className="w-4 h-4" />
          <span>3. Tebak Tokoh & Istilah</span>
        </button>
      </div>

      {/* GAME 1: CERDAS CERMAT */}
      {activeGame === 'cerdas_cermat' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          {!quizGameOver ? (
            <>
              {/* Game Status Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-lg">
                    Soal {currentQIndex + 1} / {QUIZ_CERDAS_CERMAT.length}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {QUIZ_CERDAS_CERMAT[currentQIndex].category}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {streak > 1 && (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-600 animate-bounce">
                      <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span>{streak}x Combo Streak!</span>
                    </span>
                  )}
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${
                    timer <= 5 ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}>
                    <Timer className="w-4 h-4" />
                    <span>{timer}s</span>
                  </div>
                </div>
              </div>

              {/* Question */}
              <div className="my-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed font-serif">
                  {QUIZ_CERDAS_CERMAT[currentQIndex].question}
                </h3>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {QUIZ_CERDAS_CERMAT[currentQIndex].options.map((opt, oIdx) => {
                  const q = QUIZ_CERDAS_CERMAT[currentQIndex];
                  let btnStyle = "bg-white text-slate-800 border-slate-200 hover:bg-slate-50";

                  if (isAnswered) {
                    if (oIdx === q.correctIndex) {
                      btnStyle = "bg-emerald-600 text-white border-emerald-700 shadow-xs";
                    } else if (selectedOpt === oIdx) {
                      btnStyle = "bg-rose-600 text-white border-rose-700";
                    } else {
                      btnStyle = "bg-slate-50 text-slate-400 border-slate-100 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleAnswer(oIdx)}
                      className={`p-4 rounded-xl border text-xs sm:text-sm font-semibold text-left transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && oIdx === q.correctIndex && (
                        <CheckCircle className="w-4 h-4 text-white shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next */}
              {isAnswered && (
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-xs text-slate-600">
                    <span className="font-bold text-slate-800">Pembahasan: </span>
                    {QUIZ_CERDAS_CERMAT[currentQIndex].explanation}
                  </p>
                  <button
                    onClick={handleNextQuiz}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
                  >
                    {currentQIndex < QUIZ_CERDAS_CERMAT.length - 1 ? 'Soal Berikutnya' : 'Selesai & Lihat Skor'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center space-y-4">
              <Trophy className="w-16 h-16 text-amber-500 mx-auto animate-bounce" />
              <h3 className="text-2xl font-bold text-slate-900 font-serif">Kuis Selesai!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Selamat! Anda telah menyelesaikan seluruh babak kuis cerdas cermat kilat PAI Fase E.
              </p>
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl inline-block">
                <span className="text-xs text-emerald-800 font-semibold block uppercase">Skor Ronde Ini:</span>
                <span className="text-3xl font-black text-emerald-950 tabular-nums">+{quizScore} Poin</span>
              </div>
              <div>
                <button
                  onClick={handleRestartQuiz}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Mainkan Lagi
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* GAME 2: MATCHING CARDS */}
      {activeGame === 'matching' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 font-serif">
                Pencocokan Kartu Konsep: {currentSet.title}
              </h3>
              <p className="text-xs text-slate-500">
                Pilih dua kartu yang memiliki pasangan konsep dan definisi yang cocok.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700">
                Langkah: {matchMoves}
              </span>
              <button
                onClick={handleResetMatching}
                className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {currentSet.cards.map((card) => {
              const isSelected = selectedCards.includes(card.id);
              const isMatched = matchedPairs.includes(card.pairId);

              return (
                <button
                  key={card.id}
                  disabled={isMatched}
                  onClick={() => handleCardClick(card.id, card.pairId)}
                  className={`min-h-[100px] p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex flex-col justify-between text-left ${
                    isMatched
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 opacity-60'
                      : isSelected
                      ? 'bg-amber-100 border-amber-500 text-amber-950 ring-2 ring-amber-400 scale-[1.02]'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {card.type === 'concept' ? 'Konsep' : 'Definisi'}
                  </span>
                  <span className="my-1 leading-snug line-clamp-3">{card.text}</span>
                  {isMatched && (
                    <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Cocok
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {matchedPairs.length * 2 === currentSet.cards.length && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <h4 className="text-sm font-bold text-emerald-950">Luar Biasa! Semua Kartu Terhubung Sempurna!</h4>
              <p className="text-xs text-emerald-800 mt-1">Anda mendapatkan +150 Poin dan +40 XP ke rapor!</p>
            </div>
          )}
        </div>
      )}

      {/* GAME 3: WORD SCRAMBLE */}
      {activeGame === 'scramble' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Puzzle {scrambleIndex + 1} / {WORD_SCRAMBLE_PUZZLES.length} · {currentScramble.category}
              </span>
              <h3 className="font-bold text-base text-slate-900 font-serif mt-0.5">
                Susun Huruf Acak Menjadi Istilah Tepat
              </h3>
            </div>
            <button
              onClick={handleNextScramble}
              className="text-xs text-teal-700 font-semibold hover:underline"
            >
              Ganti Kata &rarr;
            </button>
          </div>

          {/* Clue box */}
          <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-100">
            <span className="text-[11px] font-bold text-teal-800 block uppercase">Petunjuk (Clue):</span>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
              "{currentScramble.clue}"
            </p>
          </div>

          {/* Scrambled Letters */}
          <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-400 block mb-2 font-medium">Huruf yang Diacak:</span>
            <span className="text-2xl sm:text-4xl font-black text-emerald-900 tracking-widest font-mono">
              {currentScramble.scrambled}
            </span>
          </div>

          {/* Answer Form */}
          <form onSubmit={handleCheckScramble} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                disabled={scrambleSubmitted && isScrambleCorrect}
                value={scrambleGuess}
                onChange={(e) => setScrambleGuess(e.target.value)}
                placeholder="Ketikkan jawaban Anda di sini (contoh: SUNAN BONANG)..."
                className="flex-1 p-3 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600 uppercase font-semibold"
              />
              <button
                type="submit"
                disabled={!scrambleGuess.trim() || (scrambleSubmitted && isScrambleCorrect)}
                className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
              >
                Cek Jawaban
              </button>
            </div>

            {scrambleSubmitted && (
              <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                isScrambleCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}>
                {isScrambleCorrect ? (
                  <>
                    <p className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      Jawaban Tepat: {currentScramble.solution}!
                    </p>
                    <p className="text-slate-600">{currentScramble.trivia}</p>
                    <button
                      type="button"
                      onClick={handleNextScramble}
                      className="mt-3 px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold"
                    >
                      Lanjut ke Kata Berikutnya
                    </button>
                  </>
                ) : (
                  <p className="font-medium text-rose-900">
                    Masih kurang tepat, coba periksa kembali susunan hurufnya ya!
                  </p>
                )}
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
