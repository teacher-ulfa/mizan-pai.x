import React, { useState, useEffect } from 'react';
import { Chapter, StudentProgress } from '../types';
import { DiagnosticSection } from './DiagnosticSection';
import { MateriSection } from './MateriSection';
import { ZonaLatihanSection } from './ZonaLatihanSection';
import { AsesmenANBKSection } from './AsesmenANBKSection';
import { NilaiRefleksiSection } from './NilaiRefleksiSection';
import { KKTP_SCORE } from '../data/schoolData';
import { HelpCircle, BookOpen, Dumbbell, FileText, HeartHandshake, CheckCircle2, ChevronRight, Lock } from 'lucide-react';

interface ChapterViewProps {
  chapter: Chapter;
  progress: StudentProgress;
  onSaveDiagnostic: (score: number) => void;
  onSaveFormative: (score: number) => void;
  onSaveSumative: (score: number) => void;
  onUnlockNext: () => void;
  onSaveSelfAssessment: (answers: Record<string, { answer: string; reason: string }>) => void;
  onSavePeerAssessment: (answers: Record<string, { peerName: string; rating: number; note: string }>) => void;
  onSaveReflection: (note: string) => void;
}

export type ChapterStage = 'diagnostik' | 'materi' | 'latihan' | 'sumatif' | 'refleksi';

export const ChapterView: React.FC<ChapterViewProps> = ({
  chapter,
  progress,
  onSaveDiagnostic,
  onSaveFormative,
  onSaveSumative,
  onUnlockNext,
  onSaveSelfAssessment,
  onSavePeerAssessment,
  onSaveReflection
}) => {
  const [activeStage, setActiveStage] = useState<ChapterStage>('materi');

  // Reset to 'materi' or 'diagnostik' when chapter changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [chapter.id]);

  const hasDiagnostic = progress.diagnosticScores[chapter.id] !== undefined;
  const hasFormative = progress.formativeScores[chapter.id] !== undefined;
  const sumativeScore = progress.sumativeScores[chapter.id];
  const isSumativePassed = sumativeScore !== undefined && sumativeScore >= KKTP_SCORE;
  const hasReflection = progress.reflectionNotes[chapter.id] !== undefined;

  return (
    <div className="space-y-6">
      {/* Stage Selector Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
          {/* Stage 1: Diagnostik */}
          <button
            onClick={() => setActiveStage('diagnostik')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
              activeStage === 'diagnostik'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span className="truncate">1. Asesmen Awal</span>
            {hasDiagnostic && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 ml-1 shrink-0" />}
          </button>

          {/* Stage 2: Materi Inti */}
          <button
            onClick={() => setActiveStage('materi')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
              activeStage === 'materi'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span className="truncate">2. Materi Inti</span>
          </button>

          {/* Stage 3: Zona Latihan */}
          <button
            onClick={() => setActiveStage('latihan')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
              activeStage === 'latihan'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Dumbbell className="w-4 h-4 shrink-0" />
            <span className="truncate">3. Zona Latihan</span>
            {hasFormative && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 ml-1 shrink-0" />}
          </button>

          {/* Stage 4: Asesmen Sumatif ANBK */}
          <button
            onClick={() => setActiveStage('sumatif')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all relative ${
              activeStage === 'sumatif'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span className="truncate">4. Sumatif ANBK</span>
            {isSumativePassed ? (
              <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-emerald-200 text-emerald-950 font-bold rounded-sm">
                {sumativeScore}
              </span>
            ) : (
              <span className="ml-1 text-[10px] text-amber-600 font-bold">KKTP</span>
            )}
          </button>

          {/* Stage 5: Nilai Refleksi */}
          <button
            onClick={() => setActiveStage('refleksi')}
            className={`col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
              activeStage === 'refleksi'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <HeartHandshake className="w-4 h-4 shrink-0" />
            <span className="truncate">5. Nilai Refleksi</span>
            {hasReflection && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 ml-1 shrink-0" />}
          </button>
        </div>
      </div>

      {/* Render Active Stage */}
      {activeStage === 'diagnostik' && (
        <DiagnosticSection
          chapter={chapter}
          savedScore={progress.diagnosticScores[chapter.id]}
          onSaveScore={onSaveDiagnostic}
          onContinueToMateri={() => setActiveStage('materi')}
        />
      )}

      {activeStage === 'materi' && (
        <MateriSection
          chapter={chapter}
          onGoToLatihan={() => setActiveStage('latihan')}
        />
      )}

      {activeStage === 'latihan' && (
        <ZonaLatihanSection
          chapter={chapter}
          savedScore={progress.formativeScores[chapter.id]}
          onSaveScore={onSaveFormative}
          onContinueToSumatif={() => setActiveStage('sumatif')}
        />
      )}

      {activeStage === 'sumatif' && (
        <AsesmenANBKSection
          chapter={chapter}
          savedScore={progress.sumativeScores[chapter.id]}
          onSaveSumativeScore={onSaveSumative}
          onUnlockNextChapter={onUnlockNext}
          onGoToRefleksi={() => setActiveStage('refleksi')}
          isNextChapterUnlocked={progress.unlockedChapters.includes(chapter.id + 1)}
        />
      )}

      {activeStage === 'refleksi' && (
        <NilaiRefleksiSection
          chapter={chapter}
          savedSelfAnswers={progress.selfAssessmentAnswers[chapter.id]}
          savedPeerAnswers={progress.peerAssessmentAnswers[chapter.id]}
          savedReflectionNote={progress.reflectionNotes[chapter.id]}
          onSaveSelf={onSaveSelfAssessment}
          onSavePeer={onSavePeerAssessment}
          onSaveReflection={onSaveReflection}
        />
      )}
    </div>
  );
};
