import { StudentProgress, DiscussionPost } from '../types';
import { SMAN1_KREMBUNG, BADGES_LIST, KKTP_SCORE } from '../data/schoolData';

const STORAGE_KEY_PROGRESS = 'mizan_student_progress_v3';
const STORAGE_KEY_DISCUSSIONS = 'mizan_discussions_v2';
const STORAGE_KEY_TEACHER_MODE = 'mizan_teacher_mode_v2';

export const INITIAL_PROGRESS: StudentProgress = {
  studentId: "std-x1-01",
  studentName: "ABIMANA HIDAYA JATI",
  nisn: "3104161443",
  studentClass: "X-1",
  unlockedChapters: [1], // Starts at BAB 1
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

export const INITIAL_DISCUSSIONS: DiscussionPost[] = [
  {
    id: "disc-1",
    chapterId: 1,
    authorName: "Ulfatul Husna, S.Ag., M.Pd.",
    authorRole: "guru",
    authorAvatar: SMAN1_KREMBUNG.logoUrl,
    timestamp: "Kemarin, 08:30 WIB",
    content: "Assalamu'alaikum anak-anak hebat kelas X SMAN 1 Krembung. Silakan diskusikan: Bagaimana cara kalian mengimplementasikan prinsip 'M6' saat menghadapi tugas kelompok agar tidak saling mengandalkan?",
    likes: 12,
    likedByMe: true,
    replies: [
      {
        id: "rep-1",
        authorName: "Aisyah Zahra (X-1)",
        authorRole: "murid",
        content: "Wa'alaikumsalam Bu Ulfa. Kalau di kelompok kami, kami menerapkan 'Membiasakan bekerja sama' dengan membagi tugas secara adil dan menetapkan tenggat waktu bersama Bu.",
        timestamp: "Kemarin, 09:15 WIB"
      },
      {
        id: "rep-2",
        authorName: "Faris Maulana (X-2)",
        authorRole: "murid",
        content: "Kami juga memulai dengan basmalah dan berdoa agar dimudahkan dan tidak saling menyalahkan.",
        timestamp: "Kemarin, 10:04 WIB"
      }
    ]
  },
  {
    id: "disc-2",
    chapterId: 4,
    authorName: "Bima Arya (X-4)",
    authorRole: "murid",
    timestamp: "Hari ini, 07:15 WIB",
    content: "Teman-teman, apa bedanya akad Mudharabah dan Musyarakah di Bank Syariah ya? Masih agak bingung di pembagian modalnya.",
    likes: 5,
    replies: [
      {
        id: "rep-3",
        authorName: "Ulfatul Husna, S.Ag., M.Pd.",
        authorRole: "guru",
        content: "Pertanyaan bagus ananda Bima. Pada Mudharabah, modal 100% dari penyedia dana (shahibul maal) dan pihak kedua pengelola (mudharib). Sedangkan pada Musyarakah, kedua pihak sama-sama menyertakan modal usaha. Semoga semakin paham ya!",
        timestamp: "Hari ini, 07:45 WIB"
      }
    ]
  }
];

export const loadStudentProgress = (): StudentProgress => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error reading student progress from storage:", e);
  }
  return INITIAL_PROGRESS;
};

export const saveStudentProgress = (progress: StudentProgress) => {
  try {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
  } catch (e) {
    console.error("Error saving student progress to storage:", e);
  }
};

export const loadDiscussions = (): DiscussionPost[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_DISCUSSIONS);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error reading discussions from storage:", e);
  }
  return INITIAL_DISCUSSIONS;
};

export const saveDiscussions = (posts: DiscussionPost[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_DISCUSSIONS, JSON.stringify(posts));
  } catch (e) {
    console.error("Error saving discussions to storage:", e);
  }
};

export const isTeacherModeActive = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY_TEACHER_MODE) === 'true';
  } catch {
    return false;
  }
};

export const setTeacherMode = (active: boolean) => {
  try {
    localStorage.setItem(STORAGE_KEY_TEACHER_MODE, active ? 'true' : 'false');
  } catch (e) {
    console.error("Error saving teacher mode:", e);
  }
};

export const checkAndUpdateBadges = (progress: StudentProgress): { updatedProgress: StudentProgress; newBadges: string[] } => {
  const currentBadges = new Set(progress.badges);
  const newBadges: string[] = [];

  BADGES_LIST.forEach(b => {
    if (b.requiredChapter && !currentBadges.has(b.id)) {
      const score = progress.sumativeScores[b.requiredChapter];
      if (score !== undefined && score >= KKTP_SCORE) {
        currentBadges.add(b.id);
        newBadges.push(b.title);
      }
    }
  });

  const updatedProgress: StudentProgress = {
    ...progress,
    badges: Array.from(currentBadges)
  };

  saveStudentProgress(updatedProgress);
  return { updatedProgress, newBadges };
};
