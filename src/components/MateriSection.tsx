import React, { useState } from 'react';
import { Chapter } from '../types';
import {
  BookOpen,
  Sparkles,
  Scale,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Quote,
  Layers,
  Lightbulb,
  Compass,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Scroll,
  MessageSquare
} from 'lucide-react';

interface MateriSectionProps {
  chapter: Chapter;
  onGoToLatihan: () => void;
}

export const MateriSection: React.FC<MateriSectionProps> = ({
  chapter,
  onGoToLatihan
}) => {
  const isQuran = Boolean(chapter.isQuranElement);
  
  // Set default active tab depending on whether this is an Al-Qur'an element
  const [activeMateriTab, setActiveMateriTab] = useState<'quran' | 'wawasan' | 'profil_moderasi' | 'kisah' | 'karakter'>(
    isQuran ? 'quran' : 'wawasan'
  );

  const [arabicFontSize, setArabicFontSize] = useState<'normal' | 'large'>('large');
  const [expandedAsbabun, setExpandedAsbabun] = useState(true);
  const [selectedAyatIndex, setSelectedAyatIndex] = useState<number>(0);

  return (
    <div className="space-y-6">
      {/* Chapter Banner & Essential Info */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-900">
          <img
            src={chapter.bannerUrl}
            alt={chapter.title}
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-900/60 to-transparent"></div>

          <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 text-white">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500 text-white">
                  BAB {chapter.number} · Semester {chapter.semester}
                </span>
                {isQuran ? (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    Elemen Al-Qur'an & Hadis
                  </span>
                ) : (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-400 text-slate-950 flex items-center gap-1">
                    <Scale className="w-3 h-3" />
                    8 Profil Lulusan & Moderasi
                  </span>
                )}
                <span className="text-xs text-slate-300 font-medium">
                  {chapter.theme}
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black font-serif tracking-tight text-white leading-tight">
                {chapter.title}
              </h2>
            </div>

            {chapter.googleDriveLink && (
              <a
                href={chapter.googleDriveLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white text-xs font-semibold transition-colors shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Bahan Tayang & Video</span>
              </a>
            )}
          </div>
        </div>

        {/* CP & TP Section */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Capaian Pembelajaran (CP)
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {chapter.capaianPembelajaran}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Tujuan Pembelajaran (TP)
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                {chapter.tujuanPembelajaran.map((tp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0"></span>
                    <span>{tp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Infografis Ringkas */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>Peta Konsep & Alur Pembelajaran Mandiri</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {chapter.infografisSummary.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-all flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-700 leading-snug font-medium">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation for Materi Sections */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-200/70 rounded-xl">
        {/* Tab 1: Elemen Al-Qur'an (khusus Bab 1 & 6) */}
        {isQuran && (
          <button
            onClick={() => setActiveMateriTab('quran')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeMateriTab === 'quran'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>Elemen Al-Qur'an & Hadis</span>
          </button>
        )}

        {/* Tab 2: Wawasan Keislaman */}
        <button
          onClick={() => setActiveMateriTab('wawasan')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeMateriTab === 'wawasan'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Lightbulb className="w-4 h-4 text-emerald-700" />
          <span>Wawasan Keislaman (Deep Learning)</span>
        </button>

        {/* Tab 3: 8 Profil Lulusan & Moderasi Beragama */}
        <button
          onClick={() => setActiveMateriTab('profil_moderasi')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeMateriTab === 'profil_moderasi'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Scale className="w-4 h-4 text-emerald-700" />
          <span>8 Profil Lulusan & Moderasi Beragama</span>
        </button>

        {/* Tab 4: Tadabbur & Kisah */}
        <button
          onClick={() => setActiveMateriTab('kisah')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeMateriTab === 'kisah'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Quote className="w-4 h-4 text-emerald-700" />
          <span>Tadabbur & Kisah Inspiratif</span>
        </button>

        {/* Tab 5: Karakter Pelajar Pancasila & Rangkuman */}
        <button
          onClick={() => setActiveMateriTab('karakter')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeMateriTab === 'karakter'
              ? 'bg-white text-emerald-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Compass className="w-4 h-4 text-emerald-700" />
          <span>Internalisasi Karakter & Rangkuman</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: KHUSUS ELEMEN AL-QUR'AN & HADIS (BAB 1 & BAB 6) */}
      {/* ========================================================= */}
      {activeMateriTab === 'quran' && isQuran && (
        <div className="space-y-6">
          {/* Ayat Selector Bar when additionalAyat is available */}
          {chapter.additionalAyat && chapter.additionalAyat.length > 0 && (
            <div className="bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md border border-emerald-500/30">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Pilihan Pembahasan Ayat Al-Qur'an:
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    Pelajari kedua ayat utama secara mendalam beserta tajwid & mufrodat
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedAyatIndex(0)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedAyatIndex === 0
                      ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300'
                      : 'bg-white/10 hover:bg-white/20 text-emerald-100'
                  }`}
                >
                  Ayat 1: Q.S. al-Ma'idah/5: 48 (Fastabiqul Khairat)
                </button>
                {chapter.additionalAyat.map((extra, eIdx) => (
                  <button
                    key={eIdx}
                    type="button"
                    onClick={() => setSelectedAyatIndex(eIdx + 1)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedAyatIndex === eIdx + 1
                        ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300'
                        : 'bg-white/10 hover:bg-white/20 text-emerald-100'
                    }`}
                  >
                    Ayat {eIdx + 2}: {extra.surahName} (Etos Kerja)
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setSelectedAyatIndex(-1)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedAyatIndex === -1
                      ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300'
                      : 'bg-white/10 hover:bg-white/20 text-emerald-100'
                  }`}
                >
                  Tampilkan Semua Ayat
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* AYAT 1: Q.S. al-Ma'idah/5: 48 (Fastabiqul Khairat)            */}
          {/* ============================================================== */}
          {(selectedAyatIndex === 0 || selectedAyatIndex === -1) && (
            <div className="space-y-6">
              {chapter.additionalAyat && chapter.additionalAyat.length > 0 && selectedAyatIndex === -1 && (
                <div className="flex items-center gap-2 pt-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs">
                    Bagian 1: Fastabiqul Khairat (Q.S. al-Ma'idah/5: 48)
                  </span>
                </div>
              )}

              {/* Asbabun Nuzul Accordion */}
              {chapter.asbabunNuzul && (
                <div className="bg-amber-50/60 rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-xs">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedAsbabun(!expandedAsbabun)}
                  >
                    <div className="flex items-center gap-2.5 text-amber-900">
                      <Scroll className="w-5 h-5 text-amber-700" />
                      <h3 className="font-bold text-base font-serif">
                        Asbabun Nuzul: {chapter.tadarus?.surahName || "Latar Belakang Turunnya Ayat"}
                      </h3>
                    </div>
                    <button
                      type="button"
                      className="p-1 rounded-lg text-amber-800 hover:bg-amber-100 transition-colors"
                    >
                      {expandedAsbabun ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {expandedAsbabun && (
                    <div className="mt-3 pt-3 border-t border-amber-200/60 text-xs sm:text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-line">
                      <p>{chapter.asbabunNuzul}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Ayat & Tadarus Card */}
              {chapter.tadarus && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-emerald-700" />
                      <h3 className="font-bold text-lg text-slate-900 font-serif">
                        Ayo Tadarus: {chapter.tadarus.surahName}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span>Ukuran Arab:</span>
                      <button
                        type="button"
                        onClick={() => setArabicFontSize('normal')}
                        className={`px-2 py-0.5 rounded-md border text-xs ${
                          arabicFontSize === 'normal' ? 'bg-emerald-100 text-emerald-900 font-bold border-emerald-300' : 'border-slate-200'
                        }`}
                      >
                        Sedang
                      </button>
                      <button
                        type="button"
                        onClick={() => setArabicFontSize('large')}
                        className={`px-2 py-0.5 rounded-md border text-xs ${
                          arabicFontSize === 'large' ? 'bg-emerald-100 text-emerald-900 font-bold border-emerald-300' : 'border-slate-200'
                        }`}
                      >
                        Besar
                      </button>
                    </div>
                  </div>

                  {/* Arabic Box */}
                  <div className="my-6 p-6 rounded-2xl bg-amber-50/40 border border-amber-100/80">
                    <p
                      className={`font-arabic text-right text-slate-900 leading-loose tracking-wide ${
                        arabicFontSize === 'large' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                      }`}
                    >
                      {chapter.tadarus.arabicText}
                    </p>
                  </div>

                  {/* Transliteration & Translation */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Transliterasi Arab-Latin
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                        {chapter.tadarus.latinText}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
                        Terjemahan Resmi (Kementerian Agama RI)
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                        "{chapter.tadarus.translation}"
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tajwid Table */}
              {chapter.tajwidList && chapter.tajwidList.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Kaidah Hukum Bacaan Tajwid ({chapter.tadarus?.surahName || "Ayat 1"})</span>
                    </h4>
                    <span className="text-xs text-slate-500">
                      {chapter.tajwidList.length} Kaidah Utama
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                          <th className="py-2.5 px-3">Potongan Lafaz</th>
                          <th className="py-2.5 px-3">Hukum Tajwid</th>
                          <th className="py-2.5 px-3">Alasan / Kaidah Pembacaan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {chapter.tajwidList.map((t) => (
                          <tr key={t.id} className="hover:bg-slate-50/60">
                            <td className="py-3 px-3 font-arabic text-lg sm:text-xl text-slate-900">{t.lafaz}</td>
                            <td className="py-3 px-3 font-semibold text-emerald-800">{t.hukum}</td>
                            <td className="py-3 px-3 text-slate-600 text-xs sm:text-sm">{t.alasan}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Vocabulary / Arti Mufrodat Table */}
              {chapter.vocabularyList && chapter.vocabularyList.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                  <h4 className="font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-teal-600" />
                    <span>Kamus Mufrodat ({chapter.tadarus?.surahName || "Ayat 1"})</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {chapter.vocabularyList.map((v) => (
                      <div key={v.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                        <span className="font-arabic text-lg text-slate-900">{v.arab}</span>
                        <span className="text-xs font-medium text-slate-700 bg-white px-2 py-1 rounded-md border border-slate-200">
                          {v.arti}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* AYAT 2: Q.S. at-Taubah/9: 105 (Etos Kerja Produktif)          */}
          {/* ============================================================== */}
          {chapter.additionalAyat && chapter.additionalAyat.map((extra, eIdx) => {
            const isVisible = selectedAyatIndex === eIdx + 1 || selectedAyatIndex === -1;
            if (!isVisible) return null;

            return (
              <div key={eIdx} className="space-y-6 pt-4 border-t-2 border-emerald-100">
                {/* Section Header */}
                <div className="p-4 rounded-2xl bg-linear-to-r from-amber-50 to-emerald-50 border border-amber-200 flex items-center justify-between gap-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider">
                      Materi Tambahan: Etos Kerja
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 font-serif mt-1">
                      {extra.surahName} · {extra.tema || "Etos Kerja Muslim & Tanggung Jawab Moral"}
                    </h3>
                  </div>
                </div>

                {/* Asbabun Nuzul Q.S. at-Taubah: 105 */}
                {extra.asbabunNuzul && (
                  <div className="bg-amber-50/60 rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-xs">
                    <div className="flex items-center gap-2.5 text-amber-900 pb-2 border-b border-amber-200/60">
                      <Scroll className="w-5 h-5 text-amber-700" />
                      <h4 className="font-bold text-base font-serif">
                        Asbabun Nuzul: {extra.surahName}
                      </h4>
                    </div>
                    <div className="mt-3 text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                      <p>{extra.asbabunNuzul}</p>
                    </div>
                  </div>
                )}

                {/* Tadarus Box Q.S. at-Taubah: 105 */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-emerald-700" />
                      <h3 className="font-bold text-lg text-slate-900 font-serif">
                        Ayo Tadarus: {extra.surahName} (Etos Kerja)
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span>Ukuran Arab:</span>
                      <button
                        type="button"
                        onClick={() => setArabicFontSize('normal')}
                        className={`px-2 py-0.5 rounded-md border text-xs ${
                          arabicFontSize === 'normal' ? 'bg-emerald-100 text-emerald-900 font-bold border-emerald-300' : 'border-slate-200'
                        }`}
                      >
                        Sedang
                      </button>
                      <button
                        type="button"
                        onClick={() => setArabicFontSize('large')}
                        className={`px-2 py-0.5 rounded-md border text-xs ${
                          arabicFontSize === 'large' ? 'bg-emerald-100 text-emerald-900 font-bold border-emerald-300' : 'border-slate-200'
                        }`}
                      >
                        Besar
                      </button>
                    </div>
                  </div>

                  {/* Arabic Box */}
                  <div className="my-6 p-6 rounded-2xl bg-amber-50/40 border border-amber-100/80">
                    <p
                      className={`font-arabic text-right text-slate-900 leading-loose tracking-wide ${
                        arabicFontSize === 'large' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                      }`}
                    >
                      {extra.arabicText}
                    </p>
                  </div>

                  {/* Transliteration & Translation */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Transliterasi Arab-Latin
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                        {extra.latinText}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
                        Terjemahan Resmi (Kementerian Agama RI)
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                        "{extra.translation}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tajwid Table Q.S. at-Taubah: 105 */}
                {extra.tajwidList && extra.tajwidList.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>Kaidah Hukum Bacaan Tajwid ({extra.surahName})</span>
                      </h4>
                      <span className="text-xs text-slate-500 font-semibold">
                        {extra.tajwidList.length} Kaidah Utama
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                            <th className="py-2.5 px-3">Potongan Lafaz</th>
                            <th className="py-2.5 px-3">Hukum Tajwid</th>
                            <th className="py-2.5 px-3">Alasan / Kaidah Pembacaan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {extra.tajwidList.map((t) => (
                            <tr key={t.id} className="hover:bg-slate-50/60">
                              <td className="py-3 px-3 font-arabic text-lg sm:text-xl text-slate-900">{t.lafaz}</td>
                              <td className="py-3 px-3 font-semibold text-emerald-800">{t.hukum}</td>
                              <td className="py-3 px-3 text-slate-600 text-xs sm:text-sm">{t.alasan}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Vocabulary Table Q.S. at-Taubah: 105 */}
                {extra.vocabularyList && extra.vocabularyList.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                    <h4 className="font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-teal-600" />
                      <span>Kamus Mufrodat ({extra.surahName} - Kosa Kata Kunci Etos Kerja)</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {extra.vocabularyList.map((v) => (
                        <div key={v.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                          <span className="font-arabic text-lg text-slate-900">{v.arab}</span>
                          <span className="text-xs font-medium text-slate-700 bg-white px-2 py-1 rounded-md border border-slate-200">
                            {v.arti}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Kumpulan Hadis Terkait */}
          {chapter.hadisList && chapter.hadisList.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <MessageSquare className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-lg text-slate-900 font-serif">
                  Hadis-Hadis Shahih Terkait (Fastabiqul Khairat & Etos Kerja)
                </h3>
              </div>

              <div className="space-y-4">
                {chapter.hadisList.map((h, hIdx) => (
                  <div key={hIdx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <p className="font-arabic text-right text-lg sm:text-xl text-slate-900 leading-loose">
                      {h.arab}
                    </p>
                    {h.latin && (
                      <p className="text-xs text-slate-600 italic">
                        {h.latin}
                      </p>
                    )}
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800">
                      <strong className="text-emerald-800 block mb-1">Terjemahan ({h.rawi}):</strong>
                      "{h.arti}"
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-900">
                      <span className="font-bold">Hikmah & Syarah Hadis: </span>
                      {h.hikmah}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: WAWASAN KEISLAMAN (DEEP LEARNING) */}
      {/* ========================================================= */}
      {activeMateriTab === 'wawasan' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Konsep Inti & Deep Learning
            </span>
            <h3 className="text-xl font-bold text-slate-900 font-serif mt-1">
              Wawasan Keislaman Mendalam: {chapter.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              {chapter.wawasanKeislaman.overview}
            </p>
          </div>

          {/* Key points with Dalil & Examples */}
          <div className="space-y-6 pt-2">
            {chapter.wawasanKeislaman.keyPoints.map((point, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/40 space-y-3">
                <h4 className="text-base font-bold text-slate-900">
                  {point.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {point.content}
                </p>

                {point.dalil && (
                  <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/60 space-y-2">
                    <p className="font-arabic text-right text-lg sm:text-xl text-slate-900 leading-loose">
                      {point.dalil.arab}
                    </p>
                    <p className="text-xs text-slate-700 italic">
                      Artinya: "{point.dalil.arti}"
                    </p>
                    <p className="text-[11px] font-semibold text-amber-800">
                      Sumber: {point.dalil.source}
                    </p>
                  </div>
                )}

                {point.examples && point.examples.length > 0 && (
                  <div className="pt-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-2">
                      Contoh & Implementasi Kontekstual:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {point.examples.map((ex, exIdx) => (
                        <li key={exIdx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                          <span>{ex}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Rangkuman Box */}
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <h4 className="text-sm font-bold text-emerald-950 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>Rangkuman Intisari Bab {chapter.number}</span>
            </h4>
            <ul className="space-y-2 text-xs text-emerald-900 leading-relaxed">
              {chapter.rangkuman.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold text-emerald-700">{idx + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: 8 PROFIL LULUSAN & MODERASI BERAGAMA */}
      {/* ========================================================= */}
      {activeMateriTab === 'profil_moderasi' && (
        <div className="space-y-6">
          {/* 8 Profil Lulusan Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Kurikulum Berbasis Cinta
                </span>
                <span className="text-xs text-slate-400">SMA Negeri 1 Krembung</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-serif mt-2">
                Delapan (8) Profil Lulusan dalam Konteks Bab {chapter.number}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Internalisasi nilai substansi materi Bab {chapter.number} ke dalam Delapan Profil Lulusan untuk membentuk pribadi berakhlak mulia, berintegritas moril, dan memiliki nalar kritis solutif.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chapter.profilLulusan && chapter.profilLulusan.map((prof, pIdx) => (
                <div
                  key={pIdx}
                  className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-emerald-50/40 hover:border-emerald-300 transition-all flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {pIdx + 1}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">
                      {prof.dimensi}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    {prof.deskripsi}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Nilai Moderasi Beragama (Wasathiyah) Card */}
          <div className="bg-linear-to-br from-slate-900 via-teal-950 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-teal-500/20 space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Pilar Moderasi Beragama (Islam Wasathiyah)
                </span>
              </div>
              <h3 className="text-xl font-bold text-white font-serif mt-1">
                Manifestasi Nilai Wasathiyah & Toleransi
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                Penerapan prinsip moderasi Islam dalam memandang keberagaman dan merespons problematika sosial secara seimbang (Tawazzun) dan adil (I'tidal).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {chapter.moderasiBeragama && chapter.moderasiBeragama.map((mod, mIdx) => (
                <div
                  key={mIdx}
                  className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xs space-y-2"
                >
                  <div className="flex items-center gap-2 text-amber-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wide text-amber-300">
                      {mod.nilai}
                    </h4>
                  </div>
                  <p className="text-[11px] text-emerald-200 italic">
                    "{mod.makna}"
                  </p>
                  <div className="pt-2 border-t border-white/10 text-xs text-slate-200">
                    <strong className="text-white block text-[11px] uppercase tracking-wider mb-0.5">
                      Penerapan Konkret:
                    </strong>
                    {mod.penerapan}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: TADABBUR & KISAH INSPIRATIF */}
      {/* ========================================================= */}
      {activeMateriTab === 'kisah' && (
        <div className="space-y-6">
          {/* Tadabbur Prompt */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-2 text-amber-800">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-lg font-serif">Tadabbur & Refleksi Awal</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-amber-50/50 p-4 rounded-xl border border-amber-200/60 font-normal">
              {chapter.tadabburPrompt}
            </p>
          </div>

          {/* Kisah Inspiratif */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-emerald-800 pb-2 border-b border-slate-100">
              <Quote className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="font-bold text-lg font-serif text-slate-900">
                  {chapter.story.title}
                </h3>
                <span className="text-[11px] text-slate-400">
                  Sumber: {chapter.story.source}
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              {chapter.story.content.map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-950 mt-4">
              <span className="text-xs font-bold uppercase tracking-wider block mb-1 text-teal-800">
                Pesan Moral & Hikmah Kehidupan:
              </span>
              <p className="text-xs sm:text-sm italic">
                "{chapter.story.moralMessage}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: PROFIL PELAJAR PANCASILA & RANGKUMAN */}
      {/* ========================================================= */}
      {activeMateriTab === 'karakter' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Implementasi Nyata Pelajar Pancasila
            </span>
            <h3 className="text-xl font-bold text-slate-900 font-serif mt-1">
              Internalisasi Profil Pelajar Pancasila di SMAN 1 Krembung
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Integrasi nilai-nilai ajaran Islam Bab {chapter.number} ke dalam 6 Dimensi Profil Pelajar Pancasila.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chapter.karakterPancasila.map((kp, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                  "{kp.perilaku}"
                </p>
                <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Dimensi Pancasila:</span>
                  <span className="font-bold text-emerald-700">{kp.dimensi}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Call to Action: Proceed to Zona Latihan */}
      <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Sudah Selesai Mendalami Materi?</h4>
          <p className="text-xs text-slate-500">Lanjutkan ke Zona Latihan Formatif untuk menguji pemahaman konsep Anda.</p>
        </div>
        <button
          onClick={onGoToLatihan}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors shrink-0"
        >
          Masuk ke Zona Latihan
        </button>
      </div>
    </div>
  );
};
