import React from 'react';
import { StudentProgress, Chapter } from '../types';
import { ALL_CHAPTERS } from '../data/chaptersData';
import { SMAN1_KREMBUNG, BADGES_LIST, KKTP_SCORE } from '../data/schoolData';
import { Award, Printer, CheckCircle, ShieldCheck, Star, Trophy, Sparkles, BookCheck } from 'lucide-react';

interface StudentReportCardProps {
  progress: StudentProgress;
}

export const StudentReportCard: React.FC<StudentReportCardProps> = ({ progress }) => {
  const handlePrint = () => {
    window.print();
  };

  // Helper calculations
  const sem1Chapters = ALL_CHAPTERS.slice(0, 5);
  const sem2Chapters = ALL_CHAPTERS.slice(5, 10);

  const calculateAvg = (chapters: Chapter[]) => {
    let sum = 0;
    let count = 0;
    chapters.forEach(ch => {
      const score = progress.sumativeScores[ch.id];
      if (score !== undefined) {
        sum += score;
        count += 1;
      }
    });
    return count > 0 ? Math.round(sum / count) : 0;
  };

  const avgSem1 = calculateAvg(sem1Chapters);
  const avgSem2 = calculateAvg(sem2Chapters);
  const overallAvg = calculateAvg(ALL_CHAPTERS);

  const getPredicate = (score?: number) => {
    if (score === undefined || score === 0) return { label: 'Belum Asesmen', color: 'text-slate-400' };
    if (score >= 90) return { label: 'Sangat Mahir (A)', color: 'text-emerald-700 font-bold' };
    if (score >= 82) return { label: 'Mahir (B)', color: 'text-teal-700 font-bold' };
    if (score >= KKTP_SCORE) return { label: `Cakap (C - Tuntas ≥${KKTP_SCORE})`, color: 'text-amber-700 font-semibold' };
    return { label: 'Perlu Bimbingan (D)', color: 'text-rose-600 font-bold' };
  };

  return (
    <div className="space-y-8">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-xs gap-3 no-print">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-serif">
            Rapor Capaian Belajar Mandiri Murid (Digital & Cetak)
          </h2>
          <p className="text-xs text-slate-500">
            Khusus Mata Pelajaran Pendidikan Agama Islam & Budi Pekerti (E-Modul MIZAN PAI) · Fase E Kelas X
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak / Simpan PDF Rapor</span>
        </button>
      </div>

      {/* Rewards & Badges Showcase */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs no-print space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base text-slate-900">
              Koleksi Lencana Penghargaan (Badges & Rewards)
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
            {progress.badges.length} / {BADGES_LIST.length} Terbuka
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {BADGES_LIST.map((b) => {
            const isEarned = progress.badges.includes(b.id);
            return (
              <div
                key={b.id}
                className={`p-3.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                  isEarned
                    ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                    : 'bg-slate-50/50 border-slate-200 opacity-50 grayscale'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-xs ${
                  isEarned ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300' : 'bg-slate-200 text-slate-400'
                }`}>
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{b.title}</h4>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{b.description}</p>
                <span className="mt-2 text-[9px] font-semibold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                  {isEarned ? '★ TERDIRI' : b.requirement}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Report Card Sheet (Optimized for Screen & Print) */}
      <div className="bg-white rounded-2xl border border-slate-300 p-8 sm:p-12 shadow-sm space-y-8 print:p-0 print:border-none print:shadow-none">
        {/* Header Rapor Khusus Belajar Mandiri E-Modul (MIZAN PAI) */}
        <div className="flex items-center justify-between pb-6 border-b-2 border-emerald-800 gap-4">
          <img
            src={SMAN1_KREMBUNG.logoUrl}
            alt="Logo MIZAN PAI"
            className="w-16 h-16 object-contain shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 text-center space-y-1">
            <h1 className="text-base sm:text-xl font-bold tracking-tight text-slate-900 font-serif uppercase">
              RAPOR CAPAIAN BELAJAR MANDIRI E-MODUL (MIZAN PAI)
            </h1>
            <h2 className="text-xs sm:text-sm font-bold tracking-wide text-emerald-800 uppercase">
              Mata Pelajaran Pendidikan Agama Islam & Budi Pekerti (Fase E - Kelas X)
            </h2>
            <p className="text-xs text-slate-600">
              MIZAN (Media Interaktif, Zona Akhlak dan Nalar Kritis) · Kurikulum Merdeka
            </p>
          </div>
          <div className="w-16 hidden sm:block"></div>
        </div>

        {/* Student Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Nama Peserta Didik:</span>
            <span className="font-bold text-slate-900 text-sm">{progress.studentName}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">NISN:</span>
            <span className="font-bold text-slate-900 text-sm">{progress.nisn}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Kelas / Fase:</span>
            <span className="font-bold text-slate-900 text-sm">{progress.studentClass} / Fase E</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Tahun Pelajaran:</span>
            <span className="font-bold text-slate-900 text-sm">{SMAN1_KREMBUNG.academicYear}</span>
          </div>
        </div>

        {/* Table of Grades: Semester 1 & 2 */}
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold uppercase text-[11px]">
                  <th className="py-2.5 px-3 border-r border-slate-300 w-12 text-center">Bab</th>
                  <th className="py-2.5 px-3 border-r border-slate-300">Materi Pokok Pembelajaran</th>
                  <th className="py-2.5 px-3 border-r border-slate-300 w-20 text-center">Diagnostik</th>
                  <th className="py-2.5 px-3 border-r border-slate-300 w-20 text-center">Formatif</th>
                  <th className="py-2.5 px-3 border-r border-slate-300 w-24 text-center">Sumatif ANBK</th>
                  <th className="py-2.5 px-3 border-r border-slate-300 w-20 text-center">Sikap/Refleksi</th>
                  <th className="py-2.5 px-3 w-36 text-center">Capaian & Predikat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {/* Semester 1 Section */}
                <tr className="bg-emerald-50/70 font-bold text-emerald-950">
                  <td colSpan={7} className="py-2 px-3 text-xs uppercase tracking-wider">
                    SEMESTER 1 (GANJIL) · Kriteria Ketuntasan (KKTP): {KKTP_SCORE}
                  </td>
                </tr>
                {sem1Chapters.map((ch) => {
                  const diag = progress.diagnosticScores[ch.id];
                  const form = progress.formativeScores[ch.id];
                  const sum = progress.sumativeScores[ch.id];
                  const hasRef = progress.reflectionNotes[ch.id] ? 'Lengkap' : '-';
                  const pred = getPredicate(sum);

                  return (
                    <tr key={ch.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 border-r border-slate-200 text-center font-bold">{ch.number}</td>
                      <td className="py-2.5 px-3 border-r border-slate-200 font-medium">
                        <div className="font-semibold text-slate-900">{ch.shortTitle}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-1">{ch.theme}</div>
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 text-center tabular-nums">{diag ?? '-'}</td>
                      <td className="py-2.5 px-3 border-r border-slate-200 text-center tabular-nums">{form ?? '-'}</td>
                      <td className="py-2.5 px-3 border-r border-slate-200 text-center font-bold tabular-nums text-slate-950">
                        {sum ?? '-'}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 text-center text-[11px]">{hasRef}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`text-[11px] ${pred.color}`}>{pred.label}</span>
                      </td>
                    </tr>
                  );
                })}

                {/* Semester 2 Section */}
                <tr className="bg-teal-50/70 font-bold text-teal-950">
                  <td colSpan={7} className="py-2 px-3 text-xs uppercase tracking-wider">
                    SEMESTER 2 (GENAP) · Kriteria Ketuntasan (KKTP): {KKTP_SCORE}
                  </td>
                </tr>
                {sem2Chapters.map((ch) => {
                  const diag = progress.diagnosticScores[ch.id];
                  const form = progress.formativeScores[ch.id];
                  const sum = progress.sumativeScores[ch.id];
                  const hasRef = progress.reflectionNotes[ch.id] ? 'Lengkap' : '-';
                  const pred = getPredicate(sum);

                  return (
                    <tr key={ch.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 border-r border-slate-200 text-center font-bold">{ch.number}</td>
                      <td className="py-2.5 px-3 border-r border-slate-200 font-medium">
                        <div className="font-semibold text-slate-900">{ch.shortTitle}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-1">{ch.theme}</div>
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 text-center tabular-nums">{diag ?? '-'}</td>
                      <td className="py-2.5 px-3 border-r border-slate-200 text-center tabular-nums">{form ?? '-'}</td>
                      <td className="py-2.5 px-3 border-r border-slate-200 text-center font-bold tabular-nums text-slate-950">
                        {sum ?? '-'}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 text-center text-[11px]">{hasRef}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`text-[11px] ${pred.color}`}>{pred.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Rata-Rata Nilai Akhir */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            <div className="text-center">
              <span className="text-slate-500 block">Rata-rata Semester 1:</span>
              <span className="text-xl font-bold text-emerald-900 tabular-nums">{avgSem1 || '-'}</span>
            </div>
            <div className="text-center border-t sm:border-t-0 sm:border-x border-slate-300 pt-2 sm:pt-0">
              <span className="text-slate-500 block">Rata-rata Semester 2:</span>
              <span className="text-xl font-bold text-teal-900 tabular-nums">{avgSem2 || '-'}</span>
            </div>
            <div className="text-center border-t sm:border-t-0 border-slate-300 pt-2 sm:pt-0">
              <span className="text-slate-500 block">Nilai Akhir Keseluruhan Fase E:</span>
              <span className="text-2xl font-black text-slate-950 tabular-nums">{overallAvg || '-'}</span>
            </div>
          </div>
        </div>

        {/* 6 Dimensi Profil Pelajar Pancasila Summary */}
        <div className="p-4 rounded-xl border border-slate-200 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Penilaian Perkembangan Karakter (Profil Pelajar Pancasila)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="font-semibold block text-slate-800">1. Beriman & Bertakwa:</span>
              <span className="text-emerald-700 font-bold">Berkembang Sangat Baik (BSB)</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="font-semibold block text-slate-800">2. Bernalar Kritis:</span>
              <span className="text-emerald-700 font-bold">Berkembang Sesuai Harapan (BSH)</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="font-semibold block text-slate-800">3. Mandiri:</span>
              <span className="text-emerald-700 font-bold">Berkembang Sangat Baik (BSB)</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="font-semibold block text-slate-800">4. Gotong Royong:</span>
              <span className="text-emerald-700 font-bold">Berkembang Sangat Baik (BSB)</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="font-semibold block text-slate-800">5. Kebinekaan Global:</span>
              <span className="text-emerald-700 font-bold">Berkembang Sangat Baik (BSB)</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="font-semibold block text-slate-800">6. Kreatif:</span>
              <span className="text-emerald-700 font-bold">Berkembang Sesuai Harapan (BSH)</span>
            </div>
          </div>
        </div>

        {/* Catatan Guru Mata Pelajaran */}
        <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 text-xs space-y-1">
          <span className="font-bold text-amber-900 block">Catatan Guru PAI & Budi Pekerti:</span>
          <p className="text-slate-700 leading-relaxed italic">
            "Ananda {progress.studentName} menunjukkan komitmen belajar mandiri yang sangat terpuji melalui platform MIZAN. Konsistensi dalam mempelajari materi dan menuntaskan asesmen berjenjang mencerminkan karakter pelajar yang religius, santun, dan siap menjadi teladan bagi lingkungan sekitar."
          </p>
        </div>

        {/* Tanda Tangan Resmi */}
        <div className="pt-8 grid grid-cols-2 gap-8 text-xs text-center">
          <div className="space-y-16">
            <p>Mengetahui,<br />Kepala SMAN 1 Krembung</p>
            <div>
              <p className="font-bold text-slate-900 underline">{SMAN1_KREMBUNG.principalName}</p>
              <p className="text-slate-500">NIP. {SMAN1_KREMBUNG.principalNip}</p>
              <p className="text-slate-500 text-[11px]">{SMAN1_KREMBUNG.principalPangkat}</p>
            </div>
          </div>

          <div className="space-y-16">
            <p>Krembung, Sidoarjo, Oktober 2026<br />Guru Mata Pelajaran PAI & BP</p>
            <div>
              <p className="font-bold text-slate-900 underline">{SMAN1_KREMBUNG.teacherName}</p>
              <p className="text-slate-500">NIP. {SMAN1_KREMBUNG.teacherNip}</p>
              <p className="text-slate-500 text-[11px]">{SMAN1_KREMBUNG.teacherPangkat}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
