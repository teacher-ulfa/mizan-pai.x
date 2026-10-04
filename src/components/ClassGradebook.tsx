import React, { useState, useMemo } from 'react';
import { StudentUser, StudentProgress } from '../types';
import { ALL_CHAPTERS } from '../data/chaptersData';
import { SMAN1_KREMBUNG, TAUGHT_CLASSES, KKTP_SCORE } from '../data/schoolData';
import {
  Table,
  Download,
  Printer,
  Search,
  CheckCircle2,
  Users,
  Award,
  ArrowUpRight,
  TrendingUp,
  FileSpreadsheet,
  GraduationCap,
  Sparkles,
  Phone,
  Mail
} from 'lucide-react';

interface ClassGradebookProps {
  students: StudentUser[];
  activeStudentNisn: string;
  activeStudentProgress?: StudentProgress;
  onSelectStudent: (student: StudentUser) => void;
  onOpenReportCard: () => void;
}

export const ClassGradebook: React.FC<ClassGradebookProps> = ({
  students,
  activeStudentNisn,
  activeStudentProgress,
  onSelectStudent,
  onOpenReportCard
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Dynamically obtain available classes with priority to TAUGHT_CLASSES (X-1, X-2, X-3, X-4)
  const availableClasses = useMemo(() => {
    const classSet = new Set<string>(TAUGHT_CLASSES);
    students.forEach(s => classSet.add(s.studentClass));
    return Array.from(classSet).sort();
  }, [students]);

  // Retrieves authentic student scores without generating mock/simulated numbers
  const getStudentScores = (student: StudentUser): Record<number, number> => {
    // 1. If currently active student, use authentic state from App
    if (student.nisn === activeStudentNisn && activeStudentProgress?.sumativeScores) {
      return activeStudentProgress.sumativeScores;
    }

    // 2. Check for locally saved progress by student NISN
    try {
      const saved =
        localStorage.getItem(`mizan_progress_${student.nisn}`) ||
        localStorage.getItem(`mizan_student_progress_${student.nisn}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.sumativeScores) {
          return parsed.sumativeScores;
        }
      }
    } catch (e) {
      console.error(e);
    }

    // 3. Return clean empty scores record (all demo mock data removed)
    return {};
  };

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchClass = selectedClass === 'all' || s.studentClass === selectedClass;
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nisn.includes(searchTerm);
      return matchClass && matchSearch;
    });
  }, [students, selectedClass, searchTerm]);

  // Aggregated Statistics for the selected view
  const classStats = useMemo(() => {
    let totalScoreSum = 0;
    let gradedStudentsCount = 0;
    let tuntasCount = 0;

    filteredStudents.forEach(s => {
      const scores = getStudentScores(s);
      let studentSum = 0;
      let studentCount = 0;
      ALL_CHAPTERS.forEach(c => {
        const val = scores[c.id];
        if (val !== undefined) {
          studentSum += val;
          studentCount++;
        }
      });
      if (studentCount > 0) {
        const avg = Math.round(studentSum / studentCount);
        if (avg >= KKTP_SCORE) tuntasCount++;
        totalScoreSum += avg;
        gradedStudentsCount++;
      }
    });

    const averageScore = gradedStudentsCount > 0 ? Math.round(totalScoreSum / gradedStudentsCount) : 0;
    const tuntasPercent =
      gradedStudentsCount > 0 ? Math.round((tuntasCount / gradedStudentsCount) * 100) : 0;

    return {
      totalStudents: filteredStudents.length,
      gradedStudentsCount,
      averageScore,
      tuntasCount,
      tuntasPercent
    };
  }, [filteredStudents, activeStudentNisn, activeStudentProgress]);

  const exportToCSV = () => {
    const titleHeader = [
      `"REKAPITULASI BUKU NILAI PENDIDIKAN AGAMA ISLAM DAN BUDI PEKERTI FASE E"`,
      `"SMA NEGERI 1 KREMBUNG - TAHUN AJARAN ${SMAN1_KREMBUNG.academicYear}"`,
      `"Kepala Sekolah: ${SMAN1_KREMBUNG.principalName} | NIP: ${SMAN1_KREMBUNG.principalNip} | ${SMAN1_KREMBUNG.principalPangkat}"`,
      `"Guru Pengampu: ${SMAN1_KREMBUNG.teacherName} | NIP: ${SMAN1_KREMBUNG.teacherNip} | ${SMAN1_KREMBUNG.teacherPangkat}"`,
      `"Kelas: ${selectedClass === 'all' ? 'X-1, X-2, X-3, X-4 (Semua Kelas Diampu)' : selectedClass} | Dicetak: ${new Date().toLocaleDateString('id-ID')}"`,
      `""`
    ];

    const tableHeaders = [
      "No",
      "NISN",
      "Nama Siswa",
      "Kelas",
      "L/P",
      ...ALL_CHAPTERS.map(c => `Bab ${c.number}`),
      "Rata-Rata",
      "Status KKTP"
    ];

    const rows = filteredStudents.map((s, idx) => {
      const scores = getStudentScores(s);
      let sum = 0;
      let count = 0;
      const chapterScores = ALL_CHAPTERS.map(c => {
        const val = scores[c.id];
        if (val !== undefined) {
          sum += val;
          count += 1;
          return val;
        }
        return "-";
      });
      const numericAvg = count > 0 ? Math.round(sum / count) : null;
      const avgDisplay = numericAvg !== null ? numericAvg : "-";
      const status = numericAvg !== null ? (numericAvg >= KKTP_SCORE ? `TUNTAS (>=${KKTP_SCORE})` : "REMIDI") : "BELUM ADA NILAI";

      return [
        idx + 1,
        `'${s.nisn}`,
        `"${s.name}"`,
        s.studentClass,
        s.gender,
        ...chapterScores,
        avgDisplay,
        status
      ];
    });

    const csvContent =
      "\uFEFF" +
      titleHeader.join("\n") +
      "\n" +
      [tableHeaders.join(","), ...rows.map(r => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Rekap_Nilai_PAI_Kelas_${selectedClass === 'all' ? 'X-1_sd_X-4_Semua' : selectedClass}_SMAN1_Krembung_Ulfatul_Husna.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      {/* Official Header & Teacher Badge */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 text-emerald-800">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Table className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                Buku Nilai & Rekapitulasi Capaian Kelas X
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Pendidikan Agama Islam & Budi Pekerti (Fase E) · SMA Negeri 1 Krembung
              </p>
            </div>
          </div>

          {/* Teacher Credentials Lockup */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="font-bold text-emerald-900">Guru Pengampu:</span>
            <span className="font-semibold text-slate-800">{SMAN1_KREMBUNG.teacherName}</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">NIP. {SMAN1_KREMBUNG.teacherNip}</span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-700 font-medium">{SMAN1_KREMBUNG.teacherPangkat}</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 flex items-center gap-1">
              <Phone className="w-3 h-3 text-emerald-600" />
              {SMAN1_KREMBUNG.teacherWa}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start lg:self-center shrink-0 no-print">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Excel (.CSV)</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Rekap</span>
          </button>
        </div>
      </div>

      {/* Class Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-linear-to-br from-emerald-50 to-teal-50/50 border border-emerald-200 text-emerald-950 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
            <span>Siswa Tampil</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-950 font-serif">
            {classStats.totalStudents} <span className="text-xs font-sans font-normal text-emerald-700">Murid</span>
          </div>
          <p className="text-[10px] text-emerald-700">
            {selectedClass === 'all' ? 'Total 4 Rombel (X-1 s.d. X-4)' : `Kelas ${selectedClass}`}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-linear-to-br from-amber-50 to-orange-50/50 border border-amber-200 text-amber-950 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-800">
            <span>Rata-rata Capaian</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-950 font-serif">
            {classStats.gradedStudentsCount > 0 ? classStats.averageScore : '-'} <span className="text-xs font-sans font-normal text-amber-700">/ 100</span>
          </div>
          <p className="text-[10px] text-amber-700">
            {classStats.gradedStudentsCount > 0
              ? `${classStats.gradedStudentsCount} murid telah mengikuti asesmen`
              : 'Belum ada nilai tersimpan'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-linear-to-br from-teal-50 to-cyan-50/50 border border-teal-200 text-teal-950 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-teal-800">
            <span>Ketuntasan KKTP</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-teal-950 font-serif">
            {classStats.gradedStudentsCount > 0 ? `${classStats.tuntasPercent}%` : '-'}
          </div>
          <p className="text-[10px] text-teal-700">
            {classStats.gradedStudentsCount > 0
              ? `${classStats.tuntasCount} dari ${classStats.gradedStudentsCount} tuntas (≥${KKTP_SCORE})`
              : `Standar KKTP ≥ ${KKTP_SCORE}`}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Kelas Diampu</span>
            <GraduationCap className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-lg font-black text-slate-800 font-serif">
            X-1, X-2, X-3, X-4
          </div>
          <p className="text-[10px] text-slate-500">Total 139 Murid Aktif</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
          <span className="font-bold text-slate-600 mr-1 text-[11px] shrink-0">Kelas Diampu:</span>
          <button
            onClick={() => setSelectedClass('all')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              selectedClass === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Kelas Diampu ({students.length})
          </button>
          {availableClasses.map(c => {
            const count = students.filter(s => s.studentClass === c).length;
            return (
              <button
                key={c}
                onClick={() => setSelectedClass(c)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  selectedClass === c
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Kelas {c} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama atau NISN murid..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-emerald-600 bg-slate-50 focus:bg-white"
          />
        </div>
      </div>

      {/* Printable Kop Surat (Shown when printed) */}
      <div className="hidden print:block pb-6 border-b-2 border-slate-900 mb-6">
        <div className="flex items-center justify-between gap-4">
          <img
            src={SMAN1_KREMBUNG.logoUrl}
            alt="Logo SMAN 1 Krembung"
            className="w-16 h-16 object-contain"
          />
          <div className="flex-1 text-center">
            <h1 className="text-xs uppercase font-medium text-slate-700">
              Pemerintah Provinsi Jawa Timur · Dinas Pendidikan
            </h1>
            <h2 className="text-lg font-bold uppercase text-slate-950 font-serif">
              {SMAN1_KREMBUNG.name}
            </h2>
            <p className="text-[11px] text-slate-600">{SMAN1_KREMBUNG.address}</p>
            <p className="text-xs font-bold text-emerald-900 mt-1">
              REKAPITULASI BUKU NILAI PENDIDIKAN AGAMA ISLAM & BUDI PEKERTI (FASE E)
            </p>
            <p className="text-[11px] text-slate-700">
              Guru Pengampu: {SMAN1_KREMBUNG.teacherName} (NIP. {SMAN1_KREMBUNG.teacherNip}) · Kelas {selectedClass === 'all' ? 'X-1, X-2, X-3, X-4' : selectedClass}
            </p>
          </div>
          <div className="w-16"></div>
        </div>
      </div>

      {/* Gradebook Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-2xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-800 text-[11px]">
              <th className="py-2.5 px-3 border-r border-slate-200 w-10 text-center">No</th>
              <th className="py-2.5 px-3 border-r border-slate-200 w-28">NISN</th>
              <th className="py-2.5 px-3 border-r border-slate-200 min-w-[200px]">Nama Peserta Didik</th>
              <th className="py-2.5 px-3 border-r border-slate-200 w-16 text-center">Kelas</th>
              <th className="py-2.5 px-2 border-r border-slate-200 w-10 text-center">L/P</th>
              {ALL_CHAPTERS.map(ch => (
                <th key={ch.id} className="py-2.5 px-2 border-r border-slate-200 text-center w-12" title={`Bab ${ch.number}: ${ch.shortTitle}`}>
                  B{ch.number}
                </th>
              ))}
              <th className="py-2.5 px-3 border-r border-slate-200 text-center w-16">Rata²</th>
              <th className="py-2.5 px-3 border-r border-slate-200 text-center w-20">Status</th>
              <th className="py-2.5 px-3 text-center w-24 no-print">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={18} className="py-12 text-center text-slate-400">
                  Tidak ada data siswa yang cocok dengan kriteria filter "{selectedClass}" dan kata kunci "{searchTerm}".
                </td>
              </tr>
            ) : (
              filteredStudents.map((student, idx) => {
                const scores = getStudentScores(student);
                let sum = 0;
                let count = 0;
                ALL_CHAPTERS.forEach(c => {
                  const val = scores[c.id];
                  if (val !== undefined) {
                    sum += val;
                    count += 1;
                  }
                });
                const avg = count > 0 ? Math.round(sum / count) : 0;
                const isActive = student.nisn === activeStudentNisn;

                return (
                  <tr key={student.id} className={`hover:bg-slate-50 transition-colors ${isActive ? 'bg-emerald-50/60 font-medium' : ''}`}>
                    <td className="py-2.5 px-3 border-r border-slate-100 text-center text-slate-400 font-mono">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-100 font-mono text-slate-600 text-[11px]">
                      {student.nisn}
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-100 font-semibold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span>{student.name}</span>
                        {isActive && (
                          <span className="text-[9px] px-1.5 py-0.5 bg-emerald-600 text-white rounded font-bold">
                            Aktif
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-100 text-center font-bold text-slate-700">
                      {student.studentClass}
                    </td>
                    <td className="py-2.5 px-2 border-r border-slate-100 text-center text-slate-500 font-medium">
                      {student.gender || '-'}
                    </td>

                    {/* Bab 1 - 10 scores */}
                    {ALL_CHAPTERS.map(ch => {
                      const score = scores[ch.id];
                      return (
                        <td key={ch.id} className="py-2.5 px-1 border-r border-slate-100 text-center font-mono text-[11px]">
                          {score !== undefined ? (
                            <span className={score >= KKTP_SCORE ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>
                              {score}
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                      );
                    })}

                    <td className="py-2.5 px-3 border-r border-slate-100 text-center font-bold font-mono text-slate-900">
                      {count > 0 ? avg : <span className="text-slate-300">-</span>}
                    </td>

                    <td className="py-2.5 px-3 border-r border-slate-100 text-center">
                      {count > 0 ? (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          avg >= KKTP_SCORE ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {avg >= KKTP_SCORE ? 'TUNTAS' : 'REMIDI'}
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-400">
                          BELUM ADA
                        </span>
                      )}
                    </td>

                    <td className="py-2.5 px-3 text-center no-print">
                      <button
                        onClick={() => {
                          onSelectStudent(student);
                          onOpenReportCard();
                        }}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center justify-center gap-0.5 mx-auto hover:underline"
                      >
                        <span>Rapor</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Official Signature and Footer for Print & Screen */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="space-y-0.5 text-center sm:text-left">
          <p>
            Kriteria Ketuntasan Tujuan Pembelajaran (KKTP): <strong>≥ {KKTP_SCORE} Poin</strong>.
          </p>
          <p className="text-[11px] text-slate-500">
            SMAN 1 Krembung: {SMAN1_KREMBUNG.address} · Email: {SMAN1_KREMBUNG.teacherEmail}
          </p>
        </div>
        <div className="text-center sm:text-right font-medium">
          <p>
            Guru Pengampu: <strong className="text-emerald-900">{SMAN1_KREMBUNG.teacherName}</strong>
          </p>
          <p className="text-[11px] text-slate-500">NIP. {SMAN1_KREMBUNG.teacherNip} ({SMAN1_KREMBUNG.teacherPangkat})</p>
        </div>
      </div>

      {/* Print Signature Section */}
      <div className="hidden print:grid grid-cols-2 gap-8 pt-8 text-xs text-center">
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
  );
};
