import React, { useState, useEffect } from 'react';
import { Chapter, StudentProgress, DiscussionPost, StudentUser } from './types';
import { ALL_CHAPTERS, getChapterById } from './data/chaptersData';
import { SMAN1_KREMBUNG } from './data/schoolData';
import { loadStudentsList, saveStudentsList } from './data/studentsData';
import {
  loadStudentProgress,
  saveStudentProgress,
  loadDiscussions,
  saveDiscussions,
  isTeacherModeActive,
  setTeacherMode,
  checkAndUpdateBadges
} from './utils/storage';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ChapterNav } from './components/ChapterNav';
import { ChapterView } from './components/ChapterView';
import { StudentReportCard } from './components/StudentReportCard';
import { EducationalGames } from './components/EducationalGames';
import { DiscussionCorner } from './components/DiscussionCorner';
import { SchoolGallery } from './components/SchoolGallery';
import { StudentSelectorModal } from './components/StudentSelectorModal';
import { ImportStudentsModal } from './components/ImportStudentsModal';
import { ClassGradebook } from './components/ClassGradebook';
import { KataPengantarCard } from './components/KataPengantarCard';
import {
  saveStudentProgressToFirestore,
  subscribeToAllStudentsProgress,
  subscribeToDiscussions,
  saveDiscussionToFirestore
} from './services/firestoreService';

import { Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'modul' | 'games' | 'rapor' | 'diskusi' | 'galeri' | 'rekap'>('modul');
  const [currentChapterId, setCurrentChapterId] = useState<number>(1);
  const [progress, setProgress] = useState<StudentProgress>(loadStudentProgress);
  const [discussions, setDiscussions] = useState<DiscussionPost[]>(loadDiscussions);
  const [teacherMode, setTeacherModeState] = useState<boolean>(isTeacherModeActive);
  const [notification, setNotification] = useState<string | null>(null);

  // Student roster state
  const [students, setStudents] = useState<StudentUser[]>(loadStudentsList);
  const [isStudentSelectorOpen, setIsStudentSelectorOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Real-time Cloud Firestore state
  const [allCloudProgress, setAllCloudProgress] = useState<Record<string, StudentProgress>>({});
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(true);

  // Subscribe to real-time Firestore updates across all student devices
  useEffect(() => {
    const unsubStudents = subscribeToAllStudentsProgress((cloudData) => {
      setAllCloudProgress(cloudData);
      setIsCloudConnected(true);
      if (progress.nisn && cloudData[progress.nisn]) {
        const cloudProg = cloudData[progress.nisn];
        setProgress(prev => {
          if (prev.nisn === cloudProg.nisn) {
            return {
              ...prev,
              diagnosticScores: { ...prev.diagnosticScores, ...cloudProg.diagnosticScores },
              formativeScores: { ...prev.formativeScores, ...cloudProg.formativeScores },
              sumativeScores: { ...prev.sumativeScores, ...cloudProg.sumativeScores },
              unlockedChapters: Array.from(new Set([...prev.unlockedChapters, ...cloudProg.unlockedChapters])),
              completedChapters: Array.from(new Set([...prev.completedChapters, ...cloudProg.completedChapters])),
              totalXP: Math.max(prev.totalXP, cloudProg.totalXP || 0),
              badges: Array.from(new Set([...prev.badges, ...(cloudProg.badges || [])]))
            };
          }
          return prev;
        });
      }
    });

    const unsubDiscussions = subscribeToDiscussions((cloudPosts) => {
      if (cloudPosts && cloudPosts.length > 0) {
        setDiscussions(cloudPosts);
      }
    });

    return () => {
      unsubStudents();
      unsubDiscussions();
    };
  }, [progress.nisn]);

  // Sync to local storage & Firestore whenever progress changes
  useEffect(() => {
    saveStudentProgress(progress);
    if (progress.nisn) {
      try {
        localStorage.setItem(`mizan_progress_${progress.nisn}`, JSON.stringify(progress));
      } catch (e) {
        console.error(e);
      }
      saveStudentProgressToFirestore(progress);
    }
  }, [progress]);

  // Sync discussions
  useEffect(() => {
    saveDiscussions(discussions);
  }, [discussions]);

  // Sync students roster
  useEffect(() => {
    saveStudentsList(students);
  }, [students]);

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleToggleTeacherMode = () => {
    const nextVal = !teacherMode;
    setTeacherModeState(nextVal);
    setTeacherMode(nextVal);
    showToast(nextVal ? "Mode Guru Diaktifkan: Semua 10 Bab Terbuka untuk Penilaian" : "Mode Murid Diaktifkan: Akses Terstruktur Berurutan");
  };

  const handleUpdateStudent = (name: string, nisn: string, studentClass: string) => {
    setProgress(prev => ({
      ...prev,
      studentName: name,
      nisn: nisn,
      studentClass: studentClass
    }));
    showToast(`Identitas diperbarui: ${name} (${studentClass})`);
  };

  const handleSelectStudentFromRoster = (student: StudentUser, studentProg?: StudentProgress) => {
    if (studentProg) {
      setProgress(studentProg);
      showToast(`Beralih ke peserta didik: ${student.name} (${student.studentClass})`);
      return;
    }

    if (allCloudProgress && allCloudProgress[student.nisn]) {
      setProgress(allCloudProgress[student.nisn]);
      showToast(`Beralih ke peserta didik: ${student.name} (${student.studentClass})`);
      return;
    }

    // Check if we have saved progress for this specific student in localStorage
    const studentStorageKey = `mizan_progress_${student.nisn}`;
    let loaded: StudentProgress | null = null;
    try {
      const saved = localStorage.getItem(studentStorageKey);
      if (saved) {
        loaded = JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }

    if (loaded) {
      setProgress(loaded);
    } else {
      // Create new progress for this student
      const newProg: StudentProgress = {
        studentId: student.id,
        studentName: student.name,
        nisn: student.nisn,
        studentClass: student.studentClass,
        unlockedChapters: [1],
        completedChapters: [],
        diagnosticScores: {},
        formativeScores: {},
        sumativeScores: {},
        selfAssessmentAnswers: {},
        peerAssessmentAnswers: {},
        reflectionNotes: {},
        badges: [],
        gameScore: 0,
        totalXP: 100
      };
      setProgress(newProg);
    }

    showToast(`Beralih ke peserta didik: ${student.name} (${student.studentClass})`);
  };

  const handleImportStudents = (newStudents: StudentUser[]) => {
    setStudents(prev => {
      // Merge unique by NISN
      const existingNisns = new Set(prev.map(s => s.nisn));
      const filtered = newStudents.filter(s => !existingNisns.has(s.nisn));
      const combined = [...prev, ...filtered];
      saveStudentsList(combined);
      return combined;
    });
    showToast(`Berhasil mengimpor ${newStudents.length} data murid kelas X SMANIKRE!`);
  };

  const handleAddNewSingleStudent = (newStudent: StudentUser) => {
    setStudents(prev => {
      const updated = [newStudent, ...prev.filter(s => s.nisn !== newStudent.nisn)];
      saveStudentsList(updated);
      return updated;
    });
    showToast(`Murid baru ditambahkan: ${newStudent.name} (${newStudent.studentClass})`);
  };

  const handleSelectChapter = (chId: number) => {
    const isUnlocked = teacherMode || progress.unlockedChapters.includes(chId);
    if (!isUnlocked) {
      showToast(`Bab ${chId} masih terkunci! Selesaikan Asesmen Sumatif Bab ${chId - 1} dengan nilai minimal KKTP ≥ 78 terlebih dahulu.`);
      return;
    }
    setCurrentChapterId(chId);
    setActiveTab('modul');
  };

  // Chapter assessments handlers
  const handleSaveDiagnostic = (score: number) => {
    setProgress(prev => {
      const updated = {
        ...prev,
        diagnosticScores: {
          ...prev.diagnosticScores,
          [currentChapterId]: score
        },
        totalXP: prev.totalXP + 25
      };
      if (prev.nisn) {
        localStorage.setItem(`mizan_progress_${prev.nisn}`, JSON.stringify(updated));
      }
      return updated;
    });
    showToast(`Asesmen Awal Bab ${currentChapterId} tersimpan: ${score} Poin (+25 XP)`);
  };

  const handleSaveFormative = (score: number) => {
    setProgress(prev => {
      const updated = {
        ...prev,
        formativeScores: {
          ...prev.formativeScores,
          [currentChapterId]: score
        },
        totalXP: prev.totalXP + 35
      };
      if (prev.nisn) {
        localStorage.setItem(`mizan_progress_${prev.nisn}`, JSON.stringify(updated));
      }
      return updated;
    });
    showToast(`Latihan Formatif Bab ${currentChapterId} tersimpan: ${score} Poin (+35 XP)`);
  };

  const handleSaveSumative = (score: number) => {
    setProgress(prev => {
      const updated = {
        ...prev,
        sumativeScores: {
          ...prev.sumativeScores,
          [currentChapterId]: score
        },
        totalXP: prev.totalXP + 50
      };

      const { updatedProgress, newBadges } = checkAndUpdateBadges(updated);
      if (newBadges.length > 0) {
        showToast(`Selamat! Anda mendapatkan Lencana Baru: ${newBadges.join(', ')}`);
      }
      if (prev.nisn) {
        localStorage.setItem(`mizan_progress_${prev.nisn}`, JSON.stringify(updatedProgress));
      }
      return updatedProgress;
    });
  };

  const handleUnlockNextChapter = () => {
    setProgress(prev => {
      const completed = new Set(prev.completedChapters);
      completed.add(currentChapterId);

      const unlocked = new Set(prev.unlockedChapters);
      if (currentChapterId < 10) {
        unlocked.add(currentChapterId + 1);
      }

      const updated: StudentProgress = {
        ...prev,
        completedChapters: Array.from(completed),
        unlockedChapters: Array.from(unlocked),
        totalXP: prev.totalXP + 100
      };

      saveStudentProgress(updated);
      if (prev.nisn) {
        localStorage.setItem(`mizan_progress_${prev.nisn}`, JSON.stringify(updated));
      }
      return updated;
    });

    if (currentChapterId < 10) {
      showToast(`Alhamdulillah! Bab ${currentChapterId + 1} TELAH TERBUKA! (+100 XP)`);
    } else {
      showToast("Selamat! Seluruh 10 Bab Fase E telah Tuntas Paripurna!");
    }
  };

  const handleSaveSelfAssessment = (answers: Record<string, { answer: string; reason: string }>) => {
    setProgress(prev => {
      const updated = {
        ...prev,
        selfAssessmentAnswers: {
          ...prev.selfAssessmentAnswers,
          [currentChapterId]: answers
        },
        totalXP: prev.totalXP + 20
      };
      if (prev.nisn) {
        localStorage.setItem(`mizan_progress_${prev.nisn}`, JSON.stringify(updated));
      }
      return updated;
    });
    showToast(`Penilaian Diri Bab ${currentChapterId} berhasil disimpan ke rapor!`);
  };

  const handleSavePeerAssessment = (answers: Record<string, { peerName: string; rating: number; note: string }>) => {
    setProgress(prev => {
      const updated = {
        ...prev,
        peerAssessmentAnswers: {
          ...prev.peerAssessmentAnswers,
          [currentChapterId]: answers
        },
        totalXP: prev.totalXP + 20
      };
      if (prev.nisn) {
        localStorage.setItem(`mizan_progress_${prev.nisn}`, JSON.stringify(updated));
      }
      return updated;
    });
    showToast(`Penilaian Rekan Sejawat berhasil disimpan!`);
  };

  const handleSaveReflection = (note: string) => {
    setProgress(prev => {
      const updated = {
        ...prev,
        reflectionNotes: {
          ...prev.reflectionNotes,
          [currentChapterId]: note
        },
        totalXP: prev.totalXP + 25
      };
      if (prev.nisn) {
        localStorage.setItem(`mizan_progress_${prev.nisn}`, JSON.stringify(updated));
      }
      return updated;
    });
    showToast(`Jurnal Refleksi & Muhasabah Bab ${currentChapterId} tersimpan!`);
  };

  // Educational games handlers
  const handleAddGameScore = (points: number, xp: number) => {
    setProgress(prev => {
      const updated = {
        ...prev,
        gameScore: prev.gameScore + points,
        totalXP: prev.totalXP + xp
      };
      if (prev.nisn) {
        localStorage.setItem(`mizan_progress_${prev.nisn}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Discussion handlers
  const handleAddDiscussionPost = (post: Omit<DiscussionPost, 'id' | 'timestamp' | 'likes' | 'replies'>) => {
    const newPost: DiscussionPost = {
      ...post,
      id: `post-${Date.now()}`,
      timestamp: "Baru saja",
      likes: 0,
      replies: []
    };
    setDiscussions(prev => [newPost, ...prev]);
    saveDiscussionToFirestore(newPost);
    setProgress(prev => ({ ...prev, totalXP: prev.totalXP + 30 }));
    showToast("Pertanyaan/refleksi Anda berhasil dipublikasikan! (+30 XP)");
  };

  const handleAddReply = (postId: string, content: string) => {
    setDiscussions(prev => prev.map(p => {
      if (p.id === postId) {
        const updatedPost = {
          ...p,
          replies: [
            ...p.replies,
            {
              id: `rep-${Date.now()}`,
              authorName: teacherMode ? "Ulfatul Husna, S.Ag., M.Pd." : `${progress.studentName} (${progress.studentClass})`,
              authorRole: (teacherMode ? 'guru' : 'murid') as 'guru' | 'murid',
              content: content,
              timestamp: "Baru saja"
            }
          ]
        };
        saveDiscussionToFirestore(updatedPost);
        return updatedPost;
      }
      return p;
    }));
    setProgress(prev => ({ ...prev, totalXP: prev.totalXP + 15 }));
    showToast("Tanggapan Anda terkirim! (+15 XP)");
  };

  const handleToggleLike = (postId: string) => {
    setDiscussions(prev => prev.map(p => {
      if (p.id === postId) {
        const liked = !p.likedByMe;
        const updatedPost = {
          ...p,
          likedByMe: liked,
          likes: liked ? p.likes + 1 : Math.max(0, p.likes - 1)
        };
        saveDiscussionToFirestore(updatedPost);
        return updatedPost;
      }
      return p;
    }));
  };

  const currentChapter = getChapterById(currentChapterId) || ALL_CHAPTERS[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        progress={progress}
        onUpdateStudent={handleUpdateStudent}
        teacherMode={teacherMode}
        onToggleTeacherMode={handleToggleTeacherMode}
        onOpenStudentSelector={() => setIsStudentSelectorOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* TAB 1: E-MODUL (Alur Bab 1 s.d. Bab 10) */}
        {activeTab === 'modul' && (
          <div className="space-y-8">
            {/* Kata Pengantar Penyusun & Filosofi MIZAN */}
            <KataPengantarCard />

            {/* Timeline Navigator */}
            <ChapterNav
              currentChapterId={currentChapterId}
              onSelectChapter={handleSelectChapter}
              progress={progress}
              teacherMode={teacherMode}
            />

            {/* Main Chapter Content Container */}
            <ChapterView
              chapter={currentChapter}
              progress={progress}
              onSaveDiagnostic={handleSaveDiagnostic}
              onSaveFormative={handleSaveFormative}
              onSaveSumative={handleSaveSumative}
              onUnlockNext={handleUnlockNextChapter}
              onSaveSelfAssessment={handleSaveSelfAssessment}
              onSavePeerAssessment={handleSavePeerAssessment}
              onSaveReflection={handleSaveReflection}
            />
          </div>
        )}

        {/* TAB 2: ZONA GAME EDUKASI */}
        {activeTab === 'games' && (
          <EducationalGames
            gameScore={progress.gameScore}
            totalXP={progress.totalXP}
            onAddScore={handleAddGameScore}
          />
        )}

        {/* TAB 3: RAPOR CAPAIAN MURID */}
        {activeTab === 'rapor' && (
          <StudentReportCard progress={progress} />
        )}

        {/* TAB 4: REKAPITULASI NILAI KELAS X (BUKU NILAI GURU) */}
        {activeTab === 'rekap' && (
          <ClassGradebook
            students={students}
            activeStudentNisn={progress.nisn}
            activeStudentProgress={progress}
            allCloudProgress={allCloudProgress}
            isCloudConnected={isCloudConnected}
            onSelectStudent={handleSelectStudentFromRoster}
            onOpenReportCard={() => setActiveTab('rapor')}
          />
        )}

        {/* TAB 5: POJOK DISKUSI & REFLEKSI */}
        {activeTab === 'diskusi' && (
          <DiscussionCorner
            discussions={discussions}
            onAddPost={handleAddDiscussionPost}
            onAddReply={handleAddReply}
            onToggleLike={handleToggleLike}
            progress={progress}
            teacherMode={teacherMode}
          />
        )}

        {/* TAB 6: GALERI & PROFIL SEKOLAH */}
        {activeTab === 'galeri' && (
          <SchoolGallery />
        )}
      </main>

      {/* Modals */}
      <StudentSelectorModal
        isOpen={isStudentSelectorOpen}
        onClose={() => setIsStudentSelectorOpen(false)}
        students={students}
        currentNisn={progress.nisn}
        onSelectStudent={handleSelectStudentFromRoster}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onAddNewStudent={handleAddNewSingleStudent}
      />

      <ImportStudentsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportStudents}
      />

      {/* Official Footer with Ulfatul Husna, S.Ag.,M.Pd. and SMANIKRE */}
      <Footer />
    </div>
  );
}
