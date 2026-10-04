import React, { useState } from 'react';
import { Chapter } from '../types';
import { HeartHandshake, UserCheck, Check, Sparkles, BookOpenCheck, Save } from 'lucide-react';

interface NilaiRefleksiSectionProps {
  chapter: Chapter;
  savedSelfAnswers?: Record<string, { answer: string; reason: string }>;
  savedPeerAnswers?: Record<string, { peerName: string; rating: number; note: string }>;
  savedReflectionNote?: string;
  onSaveSelf: (answers: Record<string, { answer: string; reason: string }>) => void;
  onSavePeer: (answers: Record<string, { peerName: string; rating: number; note: string }>) => void;
  onSaveReflection: (note: string) => void;
}

const LIKERT_OPTIONS = [
  { code: 'SS', label: 'Sangat Setuju' },
  { code: 'S', label: 'Setuju' },
  { code: 'R', label: 'Ragu-Ragu' },
  { code: 'TS', label: 'Tidak Setuju' },
  { code: 'STS', label: 'Sangat Tidak Setuju' }
];

export const NilaiRefleksiSection: React.FC<NilaiRefleksiSectionProps> = ({
  chapter,
  savedSelfAnswers,
  savedPeerAnswers,
  savedReflectionNote,
  onSaveSelf,
  onSavePeer,
  onSaveReflection
}) => {
  // Self assessment state
  const [selfAnswers, setSelfAnswers] = useState<Record<string, { answer: string; reason: string }>>(
    savedSelfAnswers || {}
  );
  // Peer assessment state
  const [peerName, setPeerName] = useState<string>('');
  const [peerRatings, setPeerRatings] = useState<Record<string, number>>({});
  const [peerNote, setPeerNote] = useState<string>('');
  // Reflection note state
  const [reflectionText, setReflectionText] = useState<string>(savedReflectionNote || '');
  const [isSavedNotice, setIsSavedNotice] = useState<boolean>(false);

  const handleSelfChoice = (itemId: string, choiceCode: string) => {
    setSelfAnswers(prev => ({
      ...prev,
      [itemId]: {
        answer: choiceCode,
        reason: prev[itemId]?.reason || ''
      }
    }));
  };

  const handleSelfReason = (itemId: string, reasonText: string) => {
    setSelfAnswers(prev => ({
      ...prev,
      [itemId]: {
        answer: prev[itemId]?.answer || 'S',
        reason: reasonText
      }
    }));
  };

  const handleSaveAll = () => {
    onSaveSelf(selfAnswers);
    onSaveReflection(reflectionText);

    if (peerName.trim()) {
      const peerData: Record<string, { peerName: string; rating: number; note: string }> = {};
      chapter.peerAssessmentItems.forEach(item => {
        peerData[item.id] = {
          peerName: peerName.trim(),
          rating: peerRatings[item.id] || 4,
          note: peerNote
        };
      });
      onSavePeer(peerData);
    }

    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-2 text-emerald-800">
          <BookOpenCheck className="w-5 h-5 text-emerald-700" />
          <div>
            <h3 className="font-bold text-lg text-slate-900 font-serif">
              Nilai Refleksi & Penilaian Sikap (Fase E)
            </h3>
            <span className="text-xs text-slate-500">
              Self-Assessment (Penilaian Diri) & Peer-Assessment (Penilaian Antar Teman)
            </span>
          </div>
        </div>

        {isSavedNotice && (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-lg animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>Tersimpan di Rapor!</span>
          </span>
        )}
      </div>

      {/* Bagian 1: Self Assessment (Penilaian Diri) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
            1
          </span>
          <h4 className="font-bold text-base text-slate-900">
            Penilaian Diri (Self-Assessment)
          </h4>
        </div>
        <p className="text-xs text-slate-500">
          Berikan tanda centang pada opsi yang paling menggambarkan kebiasaan nyata Anda dan tuliskan alasan singkatnya.
        </p>

        <div className="space-y-4">
          {chapter.selfAssessmentItems.map((item, idx) => {
            const current = selfAnswers[item.id] || { answer: '', reason: '' };

            return (
              <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                    {idx + 1}. {item.statement}
                  </span>
                  <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">
                    {item.dimension}
                  </span>
                </div>

                {/* Likert Scale Buttons */}
                <div className="flex flex-wrap gap-2">
                  {LIKERT_OPTIONS.map((opt) => {
                    const isSelected = current.answer === opt.code;
                    return (
                      <button
                        key={opt.code}
                        type="button"
                        onClick={() => handleSelfChoice(item.id, opt.code)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {opt.code} ({opt.label})
                      </button>
                    );
                  })}
                </div>

                {/* Reason Text */}
                <div>
                  <input
                    type="text"
                    value={current.reason}
                    onChange={(e) => handleSelfReason(item.id, e.target.value)}
                    placeholder="Tuliskan alasan atau bukti konkret perilaku Anda di sini..."
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bagian 2: Peer Assessment (Penilaian Antar Teman) */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs font-bold">
            2
          </span>
          <h4 className="font-bold text-base text-slate-900">
            Penilaian Antar Teman (Peer-Assessment)
          </h4>
        </div>
        <p className="text-xs text-slate-500">
          Nilai perilaku positif rekan belajar Anda di kelas X SMAN 1 Krembung secara jujur dan objektif.
        </p>

        <div className="p-4 rounded-xl border border-teal-200/80 bg-teal-50/30 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Teman Sekelas yang Dinilai
            </label>
            <input
              type="text"
              value={peerName}
              onChange={(e) => setPeerName(e.target.value)}
              placeholder="Contoh: Aisyah Putri / Budi Santoso"
              className="w-full sm:w-80 text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div className="space-y-3">
            {chapter.peerAssessmentItems.map((pItem, pIdx) => (
              <div key={pItem.id} className="p-3 rounded-lg bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs text-slate-800 font-medium">
                  {pIdx + 1}. {pItem.statement}
                </span>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setPeerRatings(prev => ({ ...prev, [pItem.id]: star }))}
                      className={`w-7 h-7 rounded-md border text-xs font-bold transition-all ${
                        (peerRatings[pItem.id] || 4) >= star
                          ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-xs'
                          : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}
                    >
                      {star}★
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan Apresiasi & Masukan untuk Rekan
            </label>
            <input
              type="text"
              value={peerNote}
              onChange={(e) => setPeerNote(e.target.value)}
              placeholder="Contoh: Sangat kooperatif dalam kerja kelompok dan selalu menghargai giliran bicara."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600"
            />
          </div>
        </div>
      </div>

      {/* Bagian 3: Jurnal Muhasabah & Komitmen Diri */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs font-bold">
            3
          </span>
          <h4 className="font-bold text-base text-slate-900">
            Jurnal Muhasabah & Komitmen Nyata
          </h4>
        </div>
        <p className="text-xs text-slate-500">
          Tuliskan refleksi pribadi dan komitmen yang akan Anda amalkan setelah mempelajari Bab {chapter.number}.
        </p>

        <textarea
          rows={4}
          value={reflectionText}
          onChange={(e) => setReflectionText(e.target.value)}
          placeholder={`Setelah mempelajari Bab ${chapter.number} (${chapter.shortTitle}), komitmen nyata saya dalam kehidupan sehari-hari di SMAN 1 Krembung adalah...`}
          className="w-full p-3.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
        />
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end pt-4">
        <button
          type="button"
          onClick={handleSaveAll}
          className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Seluruh Nilai Refleksi</span>
        </button>
      </div>
    </div>
  );
};
