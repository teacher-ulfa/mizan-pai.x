export interface TajwidItem {
  id: string;
  lafaz: string;
  hukum: string;
  alasan: string;
}

export interface VocabularyItem {
  id: string;
  arab: string;
  arti: string;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export type QuestionType = 'multiple_choice' | 'multiple_choice_complex' | 'true_false' | 'matching' | 'essay';

export interface AssessmentQuestion {
  id: string;
  type: QuestionType;
  stimulus?: string; // stimulus literasi bacaan / cerita kasus ala ANBK
  question: string;
  options?: QuestionOption[];
  correctAnswer?: string | string[]; // string for single choice, array for complex
  matchingPairs?: { left: string; right: string }[]; // for matching
  trueFalseStatement?: string;
  correctBoolean?: boolean;
  explanation: string;
  rubricHint?: string; // for essay
}

export interface DiagnosticQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface FormativeExercise {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SelfAssessmentItem {
  id: string;
  statement: string;
  dimension: string; // dimensi profil pelajar pancasila
}

export interface PeerAssessmentItem {
  id: string;
  statement: string;
  dimension: string;
}

export interface Chapter {
  id: number;
  semester: 1 | 2;
  number: number;
  title: string;
  shortTitle: string;
  theme: string;
  capaianPembelajaran: string;
  tujuanPembelajaran: string[];
  bannerUrl: string;
  videoUrl?: string;
  googleDriveLink?: string;
  
  // Section A & B: Overview & Infografis
  infografisSummary: string[];
  
  // Section C: Ayo Tadarus & Quranic Analysis
  isQuranElement?: boolean; // Khusus Bab 1 & Bab 6 (Elemen Al-Qur'an & Hadis)
  asbabunNuzul?: string;
  hadisList?: {
    arab: string;
    latin?: string;
    arti: string;
    rawi: string;
    hikmah: string;
  }[];
  tadarus?: {
    surahName: string;
    arabicText: string;
    latinText: string;
    translation: string;
    audioHint?: string;
  };
  additionalAyat?: {
    surahName: string;
    arabicText: string;
    latinText: string;
    translation: string;
    tema?: string;
    asbabunNuzul?: string;
    tajwidList?: TajwidItem[];
    vocabularyList?: VocabularyItem[];
  }[];
  
  // Tajwid & Vocabulary (Wajib di Elemen Al-Qur'an Bab 1 & 6)
  tajwidList?: TajwidItem[];
  vocabularyList?: VocabularyItem[];

  // 8 Profil Lulusan & Nilai Moderasi Beragama
  profilLulusan: {
    dimensi: string;
    deskripsi: string;
  }[];
  moderasiBeragama: {
    nilai: string;
    makna: string;
    penerapan: string;
  }[];
  
  // Section D: Tadabbur & Kisah Inspiratif
  tadabburPrompt: string;
  story: {
    title: string;
    source: string;
    content: string[];
    moralMessage: string;
  };
  
  // Section E: Wawasan Keislaman (Deep Learning Material)
  wawasanKeislaman: {
    overview: string;
    keyPoints: {
      title: string;
      content: string;
      dalil?: {
        arab: string;
        arti: string;
        source: string;
      };
      examples?: string[];
    }[];
    caturKarakter?: {
      poin: string;
      implementasi: string;
    }[];
  };

  // Section F: Profil Pelajar Pancasila
  karakterPancasila: {
    perilaku: string;
    dimensi: string;
  }[];

  // Rangkuman Bab
  rangkuman: string[];

  // Asesmen Diagnostik Awal
  diagnosticQuestions: DiagnosticQuestion[];

  // Zona Latihan (Formatif)
  formativeExercises: FormativeExercise[];

  // Asesmen Sumatif ANBK
  anbkStimulus: {
    title: string;
    text: string;
    source: string;
  };
  sumativeQuestions: AssessmentQuestion[];

  // Nilai Refleksi
  selfAssessmentItems: SelfAssessmentItem[];
  peerAssessmentItems: PeerAssessmentItem[];
}

export interface StudentUser {
  id: string;
  nisn: string;
  name: string;
  studentClass: string;
  gender: 'L' | 'P';
}

export interface StudentProgress {
  studentId?: string;
  studentName: string;
  nisn: string;
  studentClass: string;
  unlockedChapters: number[]; // e.g. [1] initially, unlocks [1, 2] once ch 1 passed
  completedChapters: number[];
  diagnosticScores: Record<number, number>; // chapterId -> score %
  formativeScores: Record<number, number>; // chapterId -> score %
  sumativeScores: Record<number, number>; // chapterId -> score (0-100)
  selfAssessmentAnswers: Record<number, Record<string, { answer: string; reason: string }>>;
  peerAssessmentAnswers: Record<number, Record<string, { peerName: string; rating: number; note: string }>>;
  reflectionNotes: Record<number, string>;
  badges: string[]; // badge IDs
  gameScore: number;
  totalXP: number;
}

export interface DiscussionPost {
  id: string;
  chapterId: number;
  authorName: string;
  authorRole: 'murid' | 'guru' | 'alumni';
  authorAvatar?: string;
  timestamp: string;
  content: string;
  likes: number;
  likedByMe?: boolean;
  replies: {
    id: string;
    authorName: string;
    authorRole: 'murid' | 'guru';
    content: string;
    timestamp: string;
  }[];
}

export interface BadgeInfo {
  id: string;
  title: string;
  description: string;
  iconName: string;
  requiredChapter?: number;
  requirement: string;
}
