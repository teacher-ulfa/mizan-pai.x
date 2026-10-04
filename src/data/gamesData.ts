export interface QuizGameQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xp: number;
}

export interface MatchingCard {
  id: string;
  pairId: string;
  text: string;
  type: 'concept' | 'definition';
}

export interface WordScramblePuzzle {
  id: string;
  clue: string;
  category: string;
  scrambled: string;
  solution: string;
  trivia: string;
}

export const QUIZ_CERDAS_CERMAT: QuizGameQuestion[] = [
  {
    id: "qcc-1",
    category: "Al-Qur'an & Hadis (Bab 1)",
    question: "Apa arti potongan ayat 'fastabiqul khairāt' dalam Q.S. al-Ma'idah/5: 48?",
    options: ["Berlomba-lomba dalam kebajikan", "Mencari rezeki yang banyak", "Menahan amarah", "Membaca Al-Qur'an setiap malam"],
    correctIndex: 0,
    explanation: "Fastabiqul khairat berarti bersegera dan berlomba-lomba dalam berbuat kebajikan.",
    xp: 50
  },
  {
    id: "qcc-2",
    category: "Akidah (Bab 2)",
    question: "Menurut Q.S. al-Baqarah/2: 165, siapakah yang kecintaannya kepada Allah Swt. amat sangat mendalam?",
    options: ["Para raja dunia", "Orang-orang yang beriman", "Orang-orang munafik", "Para pedagang kaya"],
    correctIndex: 1,
    explanation: "Ayat menyatakan: 'Walladzīna āmanū asyaddu hubbal lillāh' (Orang-orang beriman amat sangat mendalam cintanya kepada Allah).",
    xp: 50
  },
  {
    id: "qcc-3",
    category: "Akhlak (Bab 3)",
    question: "Memamerkan amal ibadah kepada orang lain dengan harapan mendapat pujian disebut...",
    options: ["Sum'ah", "Riya'", "Hasad", "Ujub"],
    correctIndex: 1,
    explanation: "Riya' berasal dari kata ra'aa (melihat), yaitu ingin memperlihatkan ibadah agar dipuji manusia.",
    xp: 50
  },
  {
    id: "qcc-4",
    category: "Fikih (Bab 4)",
    question: "Larangan membunuh dan penerapan hukum qisas dalam syariat Islam merupakan wujud pemeliharaan...",
    options: ["Hifzhu al-Din", "Hifzhu al-Nafs (Jiwa)", "Hifzhu al-'Aql", "Hifzhu al-Mal"],
    correctIndex: 1,
    explanation: "Hifzhu al-Nafs adalah prinsip menjaga keselamatan dan kelangsungan jiwa manusia.",
    xp: 50
  },
  {
    id: "qcc-5",
    category: "Sejarah Islam Jawa (Bab 5)",
    question: "Sunan Kalijaga memanfaatkan pertunjukan kesenian tradisional sebagai media dakwah kultural, yaitu...",
    options: ["Tari Saman", "Wayang Kulit & Tembang Ilir-ilir", "Ketoprak Humor", "Gamelan Degung Sunda"],
    correctIndex: 1,
    explanation: "Sunan Kalijaga menggubah lakon wayang kulit dan tembang bernafaskan Islam tanpa merusak tradisi lokal.",
    xp: 50
  },
  {
    id: "qcc-6",
    category: "Al-Qur'an & Hadis (Bab 6)",
    question: "Dalam Q.S. al-Isra'/17: 32, mengapa Allah Swt. melarang manusia 'mendekati' zina?",
    options: [
      "Sebagai tindakan preventif (saddudz dzari'ah) menutup segala pintu dan sarana kemaksiatan",
      "Karena zina hanya dilarang bagi pemuda",
      "Supaya manusia berjalan lebih cepat",
      "Agar manusia tidak saling menyapa"
    ],
    correctIndex: 0,
    explanation: "Larangan mendekati zina menutup seluruh celah seperti pandangan liar, pornografi, dan khalwat.",
    xp: 50
  },
  {
    id: "qcc-7",
    category: "Akidah & Tasawuf (Bab 7)",
    question: "Menyeimbangkan rasa takut (khauf) dan rasa harap (raja') kepada Allah Swt. diibaratkan seperti...",
    options: ["Dua sayap burung yang terbang seimbang", "Dua roda pedati yang berbeda ukuran", "Matahari dan bulan", "Air dan minyak"],
    correctIndex: 0,
    explanation: "Imam al-Ghazali mengibaratkan khauf dan raja' laksana dua sayap burung yang menjaga kesetimbangan rohani.",
    xp: 50
  },
  {
    id: "qcc-8",
    category: "Akhlak (Bab 8)",
    question: "Menurut hadis riwayat Bukhari-Muslim, siapakah yang disebut sebagai 'orang kuat' sebenarnya?",
    options: [
      "Juara adu fisik dan gulat",
      "Orang yang mampu menguasai dirinya ketika sedang marah (ghadab)",
      "Orang yang memiliki suara paling keras",
      "Orang yang tidak pernah tersenyum"
    ],
    correctIndex: 1,
    explanation: "Kekuatan sejati diukur dari kemampuan mengendalikan gejolak emosi amarah.",
    xp: 50
  },
  {
    id: "qcc-9",
    category: "Fikih Muamalah (Bab 9)",
    question: "Harta wakaf memiliki karakteristik unik yang membedakannya dari sedekah biasa, yaitu...",
    options: [
      "Pokok hartanya ditahan/dijaga agar tetap abadi dan manfaatnya terus disalurkan",
      "Langsung habis dibagikan kepada fakir miskin",
      "Boleh diperjualbelikan kembali",
      "Hanya berupa uang koin kuno"
    ],
    correctIndex: 0,
    explanation: "Wakaf mensyaratkan pokok harta tetap lestari dan manfaatnya terus dialirkan untuk kemaslahatan umat.",
    xp: 50
  },
  {
    id: "qcc-10",
    category: "Sejarah Luar Jawa (Bab 10)",
    question: "Tokoh ulama pejuang asal Makassar yang diasingkan ke Afrika Selatan dan diakui sebagai pahlawan nasional di dua negara adalah...",
    options: ["Syekh Yusuf al-Makassari", "Datuk Ri Bandang", "Sultan Hasanuddin", "Syekh Abdur Rauf Singkili"],
    correctIndex: 0,
    explanation: "Syekh Yusuf al-Makassari (Tuanta Salamaka) diakui sebagai pahlawan di Indonesia dan Afrika Selatan.",
    xp: 50
  }
];

export const MATCHING_CARDS_SETS = [
  {
    title: "Konsep Muamalah Syariah & Wakaf",
    cards: [
      { id: "c1", pairId: "p1", text: "Mudharabah", type: "concept" as const },
      { id: "c2", pairId: "p1", text: "Kerja sama pemilik modal 100% dan pengelola usaha bagi hasil", type: "definition" as const },
      { id: "c3", pairId: "p2", text: "Murabahah", type: "concept" as const },
      { id: "c4", pairId: "p2", text: "Jual beli dengan marjin keuntungan yang disepakati bersama", type: "definition" as const },
      { id: "c5", pairId: "p3", text: "Tabarru'", type: "concept" as const },
      { id: "c6", pairId: "p3", text: "Akad hibah tolong-menolong menanggung risiko asuransi syariah", type: "definition" as const },
      { id: "c7", pairId: "p4", text: "Wakaf Uang", type: "concept" as const },
      { id: "c8", pairId: "p4", text: "Wakaf berupa uang yang diinvestasikan secara produktif untuk umat", type: "definition" as const },
      { id: "c9", pairId: "p5", text: "Gharar", type: "concept" as const },
      { id: "c10", pairId: "p5", text: "Ketidakjelasan spekulatif yang dilarang dalam transaksi", type: "definition" as const },
      { id: "c11", pairId: "p6", text: "Maysir", type: "concept" as const },
      { id: "c12", pairId: "p6", text: "Unsur perjudian yang mengeksploitasi kerugian orang lain", type: "definition" as const }
    ]
  },
  {
    title: "Al-Kulliyatu al-Khamsah & Maqashid Syariah",
    cards: [
      { id: "c21", pairId: "p21", text: "Hifzhu al-Din", type: "concept" as const },
      { id: "c22", pairId: "p21", text: "Menjaga agama & jaminan kebebasan beribadah", type: "definition" as const },
      { id: "c23", pairId: "p22", text: "Hifzhu al-Nafs", type: "concept" as const },
      { id: "c24", pairId: "p22", text: "Menjaga keselamatan jiwa & penegakan hukum qisas", type: "definition" as const },
      { id: "c25", pairId: "p23", text: "Hifzhu al-'Aql", type: "concept" as const },
      { id: "c26", pairId: "p23", text: "Menjaga akal pikiran & larangan miras serta narkoba", type: "definition" as const },
      { id: "c27", pairId: "p24", text: "Hifzhu al-Nasl", type: "concept" as const },
      { id: "c28", pairId: "p24", text: "Menjaga keturunan sah & larangan perzinaan", type: "definition" as const },
      { id: "c29", pairId: "p25", text: "Hifzhu al-Mal", type: "concept" as const },
      { id: "c30", pairId: "p25", text: "Menjaga hak kepemilikan harta halal & larangan mencuri/riba", type: "definition" as const }
    ]
  },
  {
    title: "Tokoh Ulama Nusantara & Warisan Karyanya",
    cards: [
      { id: "c31", pairId: "p31", text: "Sunan Kalijaga", type: "concept" as const },
      { id: "c32", pairId: "p31", text: "Dakwah kultural wayang kulit & tembang Ilir-Ilir di Jawa", type: "definition" as const },
      { id: "c33", pairId: "p32", text: "Abdur Rauf Singkili", type: "concept" as const },
      { id: "c34", pairId: "p32", text: "Penulis tafsir Tarjuman al-Mustafid di Kesultanan Aceh", type: "definition" as const },
      { id: "c35", pairId: "p33", text: "Syekh Yusuf al-Makassari", type: "concept" as const },
      { id: "c36", pairId: "p33", text: "Ulama pejuang anti-kolonial asal Gowa hingga Cape Town", type: "definition" as const },
      { id: "c37", pairId: "p34", text: "Arsyad al-Banjari", type: "concept" as const },
      { id: "c38", pairId: "p34", text: "Pengarang mahakarya fikih Sabilal Muhtadin di Banjar", type: "definition" as const }
    ]
  }
];

export const WORD_SCRAMBLE_PUZZLES: WordScramblePuzzle[] = [
  {
    id: "wsp-1",
    clue: "Prinsip kompetisi dalam kebaikan yang termaktub dalam Q.S. al-Ma'idah/5: 48",
    category: "Al-Qur'an",
    scrambled: "FAKISBTAUL - RHIAAKT",
    solution: "FASTABIQUL KHAIRAT",
    trivia: "Fastabiqul khairat bermakna berpacu dan bersegera dalam beramal saleh demi maslahat bersama."
  },
  {
    id: "wsp-2",
    clue: "Istilah kecintaan tulus dan mendalam seorang hamba kepada Sang Khalik",
    category: "Akidah",
    scrambled: "LLUHAHBMAAT",
    solution: "MAHABBATULLAH",
    trivia: "Mahabbatullah adalah puncak cinta mukmin sejati yang mendatangkan halawatul iman."
  },
  {
    id: "wsp-3",
    clue: "Sifat menjaga kesucian diri dan kehormatan moral dari pergaulan bebas",
    category: "Akhlak",
    scrambled: "HFAFI",
    solution: "IFFAH",
    trivia: "Sifat 'iffah membentengi kehormatan pemuda-pemudi muslim dari perbuatan keji."
  },
  {
    id: "wsp-4",
    clue: "Harta yang diserahkan untuk dimanfaatkan bagi kemaslahatan umum dengan pokok harta tetap abadi",
    category: "Fikih",
    scrambled: "AAKWF",
    solution: "WAKAF",
    trivia: "Wakaf produktif terus mengalirkan pahala jariyah abadi bagi pewakafnya."
  },
  {
    id: "wsp-5",
    clue: "Nilai utama moderasi beragama yang bermakna keseimbangan yang proporsional",
    category: "Moderasi Beragama",
    scrambled: "ZZAAWTUN",
    solution: "TAWAZZUN",
    trivia: "Tawazzun memadukan antara kekuatan dzikir (akhlak) dan kekuatan fikir (nalar kritis)."
  }
];
