import React, { useState } from 'react';
import { SMAN1_KREMBUNG } from '../data/schoolData';
import { BookOpen, Scale, Heart, Brain, ChevronDown, ChevronUp, Quote, MapPin, Award, MessageCircle, Mail } from 'lucide-react';

export const KataPengantarCard: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const kp = SMAN1_KREMBUNG.kataPengantarPenyusun;

  return (
    <div className="bg-linear-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-500/20 shadow-lg relative overflow-hidden">
      {/* Decorative Islamic Background Ornament Graphic */}
      <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute right-6 bottom-4 opacity-5 pointer-events-none text-9xl font-serif">
        ⚖
      </div>

      <div className="relative z-10 space-y-6">
        {/* Centered Profil Penyusun & Pengembang Modul */}
        <div className="text-center pt-2 pb-5 border-b border-white/10">
          <div className="separator" style={{ clear: 'both' }}>
            <a
              href="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhsLCOg4qZSUwGV5tS7hWfHuOXhO3lPOjvcoK-liVXfydR7d6gdihB1O5bA2N1iOu_0wy8Qk0sroPNA19SW2MSC9RkV9khmihcU0EEU_mawyZkhvT_7m9iE3GC4fjOGsiILwwDyY1-sSf-7YPdn7vwnkWuB9lUjHFxIWB2smSsibHZThKz6CHP5qyvMD66J/s4160/ulfa_MAS.jpeg"
              target="_blank"
              rel="noreferrer"
              style={{ display: 'block', padding: '0.5em 0', textAlign: 'center' }}
            >
              <div className="inline-block p-1.5 rounded-3xl bg-linear-to-tr from-amber-400 via-emerald-400 to-teal-300 shadow-xl">
                <img
                  alt="Foto Profil Penyusun: Ulfatul Husna, S.Ag.,M.Pd."
                  width={240}
                  className="rounded-2xl object-cover aspect-4/3 sm:aspect-square mx-auto shadow-inner hover:scale-102 transition-transform"
                  src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhsLCOg4qZSUwGV5tS7hWfHuOXhO3lPOjvcoK-liVXfydR7d6gdihB1O5bA2N1iOu_0wy8Qk0sroPNA19SW2MSC9RkV9khmihcU0EEU_mawyZkhvT_7m9iE3GC4fjOGsiILwwDyY1-sSf-7YPdn7vwnkWuB9lUjHFxIWB2smSsibHZThKz6CHP5qyvMD66J/s320/ulfa_MAS.jpeg"
                  referrerPolicy="no-referrer"
                />
              </div>
            </a>
          </div>

          <div className="mt-4 space-y-1.5 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-semibold">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>Penyusun & Pengembang Media Pembelajaran</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black font-serif tracking-tight text-white">
              {SMAN1_KREMBUNG.teacherName}
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-emerald-200 font-medium">
              <span className="px-2.5 py-0.5 rounded-md bg-white/10">NIP. {SMAN1_KREMBUNG.teacherNip}</span>
              <span>·</span>
              <span className="px-2.5 py-0.5 rounded-md bg-white/10">Pangkat/Golongan: {SMAN1_KREMBUNG.teacherPangkat}</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
              <a
                href={`https://wa.me/62${SMAN1_KREMBUNG.teacherWa.replace(/^0/, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-600/50 hover:bg-emerald-500/70 text-white font-medium border border-emerald-400/40 shadow-xs transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
                <span>WA: {SMAN1_KREMBUNG.teacherWa}</span>
              </a>
              <a
                href={`mailto:${SMAN1_KREMBUNG.teacherEmail}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-600/50 hover:bg-teal-500/70 text-white font-medium border border-teal-400/40 shadow-xs transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-teal-300" />
                <span>{SMAN1_KREMBUNG.teacherEmail}</span>
              </a>
            </div>

            <div className="pt-2">
              <h3 className="text-lg sm:text-xl font-black font-serif tracking-tight text-amber-300">
                MIZAN (Media Interaktif, Zona Akhlak dan Nalar Kritis)
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 font-medium">
                Pendidikan Agama Islam dan Budi Pekerti Fase E (Kelas X)
              </p>
              <p className="text-xs text-emerald-300 flex items-center justify-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{SMAN1_KREMBUNG.name} · {SMAN1_KREMBUNG.address}</span>
              </p>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-emerald-200 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isExpanded ? "Tutup Pengantar Penyusun" : "Buka Pengantar Penyusun"}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expandable Pengantar Penyusun */}
        {isExpanded && (
          <div className="space-y-5 text-xs sm:text-sm leading-relaxed text-slate-200 animate-in fade-in duration-200">
            {/* Paragraph 1 */}
            <p className="font-normal text-slate-100">
              {kp.paragraphs[0]}
            </p>

            {/* Dalil QS Ali Imran: 190-191 Callout */}
            <div className="p-4 sm:p-5 rounded-2xl bg-black/25 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs text-amber-300 font-semibold pb-1 border-b border-white/10">
                <span className="flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-amber-400" />
                  Landasan Filosofis: {kp.dalilUlulAlbab.surah}
                </span>
                <span className="text-[11px] text-emerald-300">Profil Ulul Albab</span>
              </div>
              <p className="font-arabic text-right text-lg sm:text-2xl text-amber-100 leading-loose pt-1">
                {kp.dalilUlulAlbab.arab}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-300 italic pt-1">
                "{kp.dalilUlulAlbab.arti}"
              </p>
            </div>

            {/* Paragraph 2 */}
            <p className="text-slate-100">
              {kp.paragraphs[1]}
            </p>

            {/* Two Pillars Grid: Zona Akhlak & Zona Nalar Kritis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Zona Akhlak Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-emerald-400/20 space-y-2">
                <div className="flex items-center gap-2 text-emerald-300">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                    <Heart className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-300">
                    Zona Akhlak (Kekuatan Dzikir)
                  </h4>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-normal">
                  {kp.zonaAkhlak}
                </p>
              </div>

              {/* Zona Nalar Kritis Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-teal-400/20 space-y-2">
                <div className="flex items-center gap-2 text-teal-300">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-300">
                    <Brain className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-teal-300">
                    Zona Nalar Kritis (Kekuatan Fikir)
                  </h4>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-normal">
                  {kp.zonaNalarKritis}
                </p>
              </div>
            </div>

            {/* Paragraph 3 */}
            <p className="text-slate-100 pt-1 font-normal">
              {kp.paragraphs[2]}
            </p>

            {/* Author Signature Line */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Quote className="w-4 h-4 text-emerald-400" />
                <span>Penyusun & Pengembang Media:</span>
                <strong className="text-white font-bold">{kp.author}</strong>
                <span className="text-slate-400">(NIP. {SMAN1_KREMBUNG.teacherNip})</span>
              </div>
              <span className="text-[11px] text-emerald-300 font-medium">
                {SMAN1_KREMBUNG.teacherPangkat} · {SMAN1_KREMBUNG.name}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
