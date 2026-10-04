import React, { useState } from 'react';
import { BookOpen, Gamepad2, Award, MessageSquareQuote, Shield, Image, User, CheckCircle2, Lock, Table, Users } from 'lucide-react';
import { SMAN1_KREMBUNG, TAUGHT_CLASSES } from '../data/schoolData';
import { StudentProgress } from '../types';

interface NavbarProps {
  activeTab: 'modul' | 'games' | 'rapor' | 'diskusi' | 'galeri' | 'rekap';
  setActiveTab: (tab: 'modul' | 'games' | 'rapor' | 'diskusi' | 'galeri' | 'rekap') => void;
  progress: StudentProgress;
  onUpdateStudent: (name: string, nisn: string, studentClass: string) => void;
  teacherMode: boolean;
  onToggleTeacherMode: () => void;
  onOpenStudentSelector: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  progress,
  onUpdateStudent,
  teacherMode,
  onToggleTeacherMode,
  onOpenStudentSelector
}) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [tempName, setTempName] = useState(progress.studentName);
  const [tempNisn, setTempNisn] = useState(progress.nisn);
  const [tempClass, setTempClass] = useState(progress.studentClass);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      onUpdateStudent(tempName.trim(), tempNisn.trim(), tempClass);
      setShowProfileModal(false);
    }
  };

  const completedCount = progress.completedChapters.length;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Zone 1: Brand & School Lockup */}
            <div className="flex items-center gap-3">
              <img
                src={SMAN1_KREMBUNG.logoUrl}
                alt="Logo MIZAN SMAN 1 Krembung"
                className="w-13 h-13 object-contain rounded-xl p-0.5"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight text-emerald-950 font-serif">
                    MIZAN
                  </span>
                  <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    Fase E · Kelas X
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-semibold truncate max-w-[240px] sm:max-w-md">
                  Media Interaktif, Zona Akhlak dan Nalar Kritis
                </p>
                <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                  Pendidikan Agama Islam & Budi Pekerti · SMA Negeri 1 Krembung
                </p>
              </div>
            </div>

            {/* Zone 2: Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              <button
                onClick={() => setActiveTab('modul')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all ${
                  activeTab === 'modul'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>E-Modul (10 Bab)</span>
              </button>

              <button
                onClick={() => setActiveTab('games')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all ${
                  activeTab === 'games'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50'
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Zona Game</span>
              </button>

              <button
                onClick={() => setActiveTab('rapor')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all ${
                  activeTab === 'rapor'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Rapor Murid</span>
              </button>

              <button
                onClick={() => setActiveTab('diskusi')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all ${
                  activeTab === 'diskusi'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50'
                }`}
              >
                <MessageSquareQuote className="w-4 h-4" />
                <span>Pojok Diskusi</span>
              </button>

              <button
                onClick={() => setActiveTab('rekap')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all ${
                  activeTab === 'rekap'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50'
                }`}
              >
                <Table className="w-4 h-4" />
                <span>Rekap Kelas X</span>
              </button>

              <button
                onClick={() => setActiveTab('galeri')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all ${
                  activeTab === 'galeri'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50'
                }`}
              >
                <Image className="w-4 h-4" />
                <span>Galeri</span>
              </button>
            </nav>

            {/* Zone 3: Actions & Status */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Teacher Mode Switch */}
              <button
                type="button"
                onClick={onToggleTeacherMode}
                title={teacherMode ? "Mode Guru Aktif: Akses Penuh Semua Bab" : "Klik untuk beralih ke Mode Guru"}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  teacherMode
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{teacherMode ? "Mode Guru (Akses Penuh)" : "Mode Murid"}</span>
                <span className="sm:hidden">{teacherMode ? "Guru" : "Murid"}</span>
              </button>

              {/* Student Profile Trigger & Roster Switcher */}
              <button
                onClick={onOpenStudentSelector}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-semibold transition-colors"
                title="Klik untuk memilih nama siswa dari daftar kelas X SMANIKRE"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px]">
                  {progress.studentName.charAt(0)}
                </div>
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <div className="flex items-center gap-1">
                    <span className="font-bold truncate max-w-[100px]">{progress.studentName}</span>
                    <Users className="w-3 h-3 text-emerald-600 opacity-70" />
                  </div>
                  <span className="text-[10px] text-emerald-700 font-medium">{progress.studentClass} · {completedCount}/10 Bab</span>
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Bar */}
          <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 text-xs">
            <button
              onClick={() => setActiveTab('modul')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-md ${
                activeTab === 'modul' ? 'text-emerald-700 font-bold' : 'text-slate-500'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Modul</span>
            </button>
            <button
              onClick={() => setActiveTab('games')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-md ${
                activeTab === 'games' ? 'text-emerald-700 font-bold' : 'text-slate-500'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Game</span>
            </button>
            <button
              onClick={() => setActiveTab('rapor')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-md ${
                activeTab === 'rapor' ? 'text-emerald-700 font-bold' : 'text-slate-500'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Rapor</span>
            </button>
            <button
              onClick={() => setActiveTab('rekap')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-md ${
                activeTab === 'rekap' ? 'text-emerald-700 font-bold' : 'text-slate-500'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>Rekap</span>
            </button>
            <button
              onClick={() => setActiveTab('diskusi')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-md ${
                activeTab === 'diskusi' ? 'text-emerald-700 font-bold' : 'text-slate-500'
              }`}
            >
              <MessageSquareQuote className="w-4 h-4" />
              <span>Diskusi</span>
            </button>
            <button
              onClick={() => setActiveTab('galeri')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-md ${
                activeTab === 'galeri' ? 'text-emerald-700 font-bold' : 'text-slate-500'
              }`}
            >
              <Image className="w-4 h-4" />
              <span>Galeri</span>
            </button>
          </div>
        </div>
      </header>

      {/* Edit Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-slate-900 text-lg">Identitas Murid SMANIKRE</h3>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold leading-none p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Siswa
                </label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  required
                  placeholder="Contoh: Faris Maulana Rahman"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Induk Siswa Nasional (NISN)
                </label>
                <input
                  type="text"
                  value={tempNisn}
                  onChange={(e) => setTempNisn(e.target.value)}
                  placeholder="Contoh: 0089271634"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kelas (Fase E - SMA Negeri 1 Krembung)
                </label>
                <select
                  value={tempClass}
                  onChange={(e) => setTempClass(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
                >
                  {TAUGHT_CLASSES.map(c => (
                    <option key={c} value={c}>Kelas {c}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
