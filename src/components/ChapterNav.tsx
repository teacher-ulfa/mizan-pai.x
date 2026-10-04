import React from 'react';
import { ALL_CHAPTERS } from '../data/chaptersData';
import { KKTP_SCORE } from '../data/schoolData';
import { StudentProgress, Chapter } from '../types';
import { Lock, CheckCircle2, ChevronRight, BookOpen, Star, AlertCircle, Sparkles } from 'lucide-react';

interface ChapterNavProps {
  currentChapterId: number;
  onSelectChapter: (id: number) => void;
  progress: StudentProgress;
  teacherMode: boolean;
}

export const ChapterNav: React.FC<ChapterNavProps> = ({
  currentChapterId,
  onSelectChapter,
  progress,
  teacherMode
}) => {
  const isUnlocked = (chId: number): boolean => {
    if (teacherMode) return true;
    return progress.unlockedChapters.includes(chId);
  };

  const isCompleted = (chId: number): boolean => {
    return progress.completedChapters.includes(chId) || (progress.sumativeScores[chId] !== undefined && progress.sumativeScores[chId] >= KKTP_SCORE);
  };

  const getScore = (chId: number): number | undefined => {
    return progress.sumativeScores[chId];
  };

  const completedCount = ALL_CHAPTERS.filter(ch => isCompleted(ch.id)).length;
  const progressPercent = Math.round((completedCount / ALL_CHAPTERS.length) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
      {/* Header & Overall LMS Progression */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 font-serif">
              Alur Pembelajaran Terstruktur LMS
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              10 Bab Fase E
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Akses berurutan dari Bab 1 hingga Bab 10. Tuntaskan Asesmen Sumatif (KKTP ≥ {KKTP_SCORE}) untuk membuka bab berikutnya.
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="w-36 bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
            <div
              className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <span className="text-xs font-bold text-slate-700 tabular-nums">
            {progressPercent}% Tuntas ({completedCount}/10)
          </span>
        </div>
      </div>

      {teacherMode && (
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-900">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Mode Guru Aktif:</strong> Semua bab terbuka tanpa kunci untuk keperluan simulasi pembelajaran, evaluasi, dan penilaian mandiri.
          </span>
        </div>
      )}

      {/* Chapters Grid by Semester */}
      <div className="mt-6 space-y-6">
        {/* Semester 1 (Ganjil) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Semester 1 (Ganjil) · Bab 1 s.d. Bab 5</span>
            </h3>
            <span className="text-xs text-slate-400">TP 2026/2027</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {ALL_CHAPTERS.slice(0, 5).map((chapter) => {
              const unlocked = isUnlocked(chapter.id);
              const completed = isCompleted(chapter.id);
              const isCurrent = currentChapterId === chapter.id;
              const score = getScore(chapter.id);

              return (
                <button
                  key={chapter.id}
                  onClick={() => {
                    if (unlocked) {
                      onSelectChapter(chapter.id);
                    }
                  }}
                  disabled={!unlocked}
                  className={`text-left p-3.5 rounded-xl border transition-all relative flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                      : unlocked
                      ? 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                      : 'bg-slate-50/80 border-slate-200/60 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-emerald-700 uppercase">
                        BAB {chapter.number}
                      </span>
                      {completed ? (
                        <div className="flex items-center text-emerald-600" title="Bab Tuntas">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : unlocked ? (
                        <span className="text-[10px] font-medium text-slate-400">
                          Aktif
                        </span>
                      ) : (
                        <div className="flex items-center text-slate-400" title="Terkunci: Tuntaskan Bab sebelumnya">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <h4 className="text-xs font-semibold text-slate-900 line-clamp-2 leading-snug">
                      {chapter.shortTitle}
                    </h4>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    {score !== undefined ? (
                      <span className="font-bold text-emerald-700 tabular-nums">
                        Nilai: {score}
                      </span>
                    ) : unlocked ? (
                      <span className="text-slate-400 text-[10px]">Belum Sumatif</span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">Terkunci</span>
                    )}

                    {unlocked && (
                      <ChevronRight className={`w-3.5 h-3.5 ${isCurrent ? 'text-emerald-700' : 'text-slate-400'}`} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Semester 2 (Genap) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-600"></span>
              <span>Semester 2 (Genap) · Bab 6 s.d. Bab 10</span>
            </h3>
            <span className="text-xs text-slate-400">TP 2026/2027</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {ALL_CHAPTERS.slice(5, 10).map((chapter) => {
              const unlocked = isUnlocked(chapter.id);
              const completed = isCompleted(chapter.id);
              const isCurrent = currentChapterId === chapter.id;
              const score = getScore(chapter.id);

              return (
                <button
                  key={chapter.id}
                  onClick={() => {
                    if (unlocked) {
                      onSelectChapter(chapter.id);
                    }
                  }}
                  disabled={!unlocked}
                  className={`text-left p-3.5 rounded-xl border transition-all relative flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-teal-50 border-teal-500 shadow-sm ring-2 ring-teal-500/20'
                      : unlocked
                      ? 'bg-white border-slate-200 hover:border-teal-300 hover:bg-slate-50'
                      : 'bg-slate-50/80 border-slate-200/60 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-teal-700 uppercase">
                        BAB {chapter.number}
                      </span>
                      {completed ? (
                        <div className="flex items-center text-teal-600" title="Bab Tuntas">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : unlocked ? (
                        <span className="text-[10px] font-medium text-slate-400">
                          Aktif
                        </span>
                      ) : (
                        <div className="flex items-center text-slate-400" title="Terkunci: Tuntaskan Bab sebelumnya">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <h4 className="text-xs font-semibold text-slate-900 line-clamp-2 leading-snug">
                      {chapter.shortTitle}
                    </h4>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    {score !== undefined ? (
                      <span className="font-bold text-teal-700 tabular-nums">
                        Nilai: {score}
                      </span>
                    ) : unlocked ? (
                      <span className="text-slate-400 text-[10px]">Belum Sumatif</span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">Terkunci</span>
                    )}

                    {unlocked && (
                      <ChevronRight className={`w-3.5 h-3.5 ${isCurrent ? 'text-teal-700' : 'text-slate-400'}`} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
