import React, { useState, useMemo } from 'react';
import { StudentUser } from '../types';
import { SMAN1_KREMBUNG, TAUGHT_CLASSES } from '../data/schoolData';
import { Search, UserCheck, Plus, Upload, X, Filter, GraduationCap } from 'lucide-react';

interface StudentSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentUser[];
  currentNisn: string;
  onSelectStudent: (student: StudentUser) => void;
  onOpenImportModal: () => void;
  onAddNewStudent: (student: StudentUser) => void;
}

export const StudentSelectorModal: React.FC<StudentSelectorModalProps> = ({
  isOpen,
  onClose,
  students,
  currentNisn,
  onSelectStudent,
  onOpenImportModal,
  onAddNewStudent
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [isAddingSingle, setIsAddingSingle] = useState(false);
  const [newName, setNewName] = useState('');
  const [newNisn, setNewNisn] = useState('');
  const [newClass, setNewClass] = useState('X-1');
  const [newGender, setNewGender] = useState<'L' | 'P'>('L');

  const availableClasses = useMemo(() => {
    const set = new Set<string>(TAUGHT_CLASSES);
    students.forEach(s => set.add(s.studentClass));
    return Array.from(set).sort();
  }, [students]);

  if (!isOpen) return null;

  const handleCreateSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newStudent: StudentUser = {
      id: `std-custom-${Date.now()}`,
      nisn: newNisn.trim() || `008${Math.floor(1000000 + Math.random() * 9000000)}`,
      name: newName.trim(),
      studentClass: newClass,
      gender: newGender
    };

    onAddNewStudent(newStudent);
    onSelectStudent(newStudent);
    setIsAddingSingle(false);
    setNewName('');
    setNewNisn('');
    onClose();
  };

  const filtered = students.filter(s => {
    const matchClass = selectedClassFilter === 'all' || s.studentClass === selectedClassFilter;
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.nisn.includes(searchTerm);
    return matchClass && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-emerald-800">
            <GraduationCap className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-lg text-slate-900 font-serif">
              Pilih Murid Kelas X (SMAN 1 Krembung)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Top Bar */}
        <div className="py-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama atau NISN murid..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-600 bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddingSingle(!isAddingSingle)}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah 1 Siswa</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenImportModal();
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Impor Excel/CSV</span>
            </button>
          </div>
        </div>

        {/* Single Add Form */}
        {isAddingSingle && (
          <form onSubmit={handleCreateSingle} className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 text-xs">
            <span className="font-bold text-slate-800 block">Tambah Murid Baru:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nama Lengkap Siswa"
                className="p-2 border border-slate-300 rounded-lg bg-white"
              />
              <input
                type="text"
                value={newNisn}
                onChange={(e) => setNewNisn(e.target.value)}
                placeholder="NISN (Opsional)"
                className="p-2 border border-slate-300 rounded-lg bg-white"
              />
              <select
                value={newClass}
                onChange={(e) => setNewClass(e.target.value)}
                className="p-2 border border-slate-300 rounded-lg bg-white"
              >
                {availableClasses.map(c => (
                  <option key={c} value={c}>Kelas {c}</option>
                ))}
              </select>
              <select
                value={newGender}
                onChange={(e) => setNewGender(e.target.value as 'L' | 'P')}
                className="p-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="L">Laki-laki (L)</option>
                <option value="P">Perempuan (P)</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingSingle(false)}
                className="px-3 py-1.5 text-slate-500 hover:bg-slate-200 rounded-lg"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-700 text-white font-bold rounded-lg"
              >
                Simpan & Pilih
              </button>
            </div>
          </form>
        )}

        {/* Class Filter Tabs */}
        <div className="py-2.5 flex items-center gap-1 overflow-x-auto text-[11px] border-b border-slate-100">
          <button
            onClick={() => setSelectedClassFilter('all')}
            className={`px-2.5 py-1 rounded-md font-semibold whitespace-nowrap ${
              selectedClassFilter === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({students.length})
          </button>
          {availableClasses.map(c => {
            const count = students.filter(s => s.studentClass === c).length;
            return (
              <button
                key={c}
                onClick={() => setSelectedClassFilter(c)}
                className={`px-2 py-1 rounded-md font-semibold whitespace-nowrap ${
                  selectedClassFilter === c
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c} ({count})
              </button>
            );
          })}
        </div>

        {/* Student List Grid */}
        <div className="flex-1 overflow-y-auto py-3 space-y-1.5 pr-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Tidak ada data siswa yang cocok dengan pencarian.
            </div>
          ) : (
            filtered.map((s) => {
              const isCurrent = s.nisn === currentNisn;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    onSelectStudent(s);
                    onClose();
                  }}
                  className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all ${
                    isCurrent
                      ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500'
                      : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      s.gender === 'P' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{s.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 font-semibold text-slate-600">
                          {s.studentClass}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">NISN: {s.nisn}</span>
                    </div>
                  </div>

                  {isCurrent && (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <UserCheck className="w-4 h-4" /> Aktif
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
