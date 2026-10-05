import React, { useState } from 'react';
import { UserCheck, CheckCircle2, Search, GraduationCap } from 'lucide-react';
import { StudentUser } from '../types';
import { SMAN1_KREMBUNG } from '../data/schoolData';

interface StudentWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentUser[];
  onSelectStudent: (student: StudentUser) => void;
}

export const StudentWelcomeModal: React.FC<StudentWelcomeModalProps> = ({
  isOpen,
  onClose,
  students,
  onSelectStudent
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('X-1');
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentUser | null>(null);

  if (!isOpen) return null;

  const classStudents = students.filter(s => s.studentClass === selectedClass);
  const filtered = classStudents.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.nisn.includes(search)
  );

  const handleConfirm = () => {
    if (selectedStudent) {
      onSelectStudent(selectedStudent);
      try {
        localStorage.setItem('mizan_identity_confirmed', 'true');
      } catch (e) {
        console.error(e);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <UserCheck className="w-7 h-7 text-emerald-700" />
          </div>
          <h3 className="text-xl font-bold font-serif text-slate-900">
            Selamat Datang di MIZAN PAI
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            {SMAN1_KREMBUNG.name} · Fase E
            <br />
            Silakan pilih identitas Anda agar seluruh nilai asesmen tercatat resmi atas nama Anda.
          </p>
        </div>

        {/* Class Selection Tabs */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            1. Pilih Kelas Anda:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {['X-1', 'X-2', 'X-3', 'X-4'].map(cls => (
              <button
                key={cls}
                type="button"
                onClick={() => {
                  setSelectedClass(cls);
                  setSelectedStudent(null);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center border ${
                  selectedClass === cls
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Kelas {cls}
              </button>
            ))}
          </div>
        </div>

        {/* Student Search & List */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>2. Pilih Nama Anda dari Daftar ({filtered.length} Siswa):</span>
            <span className="text-[11px] font-normal text-slate-400">Kelas {selectedClass}</span>
          </label>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ketik nama atau NISN Anda..."
              className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-slate-50/50">
            {filtered.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                Nama tidak ditemukan. Silakan cek ejaan nama Anda.
              </div>
            ) : (
              filtered.map((s) => {
                const isSelected = selectedStudent?.nisn === s.nisn;
                return (
                  <button
                    key={s.nisn}
                    type="button"
                    onClick={() => setSelectedStudent(s)}
                    className={`w-full text-left p-2.5 text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-emerald-100/70 text-emerald-950 font-bold'
                        : 'hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">NISN: {s.nisn} ({s.gender})</div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Student Confirmation Pill */}
        {selectedStudent && (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <span>Anda memilih: </span>
              <strong>{selectedStudent.name}</strong> ({selectedStudent.studentClass} - NISN: {selectedStudent.nisn})
            </div>
          </div>
        )}

        {/* Confirm Button */}
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!selectedStudent}
          className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-xs ${
            selectedStudent
              ? 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {selectedStudent ? 'Konfirmasi & Mulai Mengerjakan Asesmen' : 'Pilih Nama Anda di Atas'}
        </button>
      </div>
    </div>
  );
};
