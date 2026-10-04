export interface SchoolInfo {
  name: string;
  shortName: string;
  appTitle: string;
  appSubtitle: string;
  appFullDescription: string;
  npsn: string;
  address: string;
  city: string;
  province: string;
  logoUrl: string;
  teacherName: string;
  teacherTitle: string;
  teacherNip: string;
  teacherPangkat: string;
  teacherPhotoUrl: string;
  teacherWa: string;
  teacherEmail: string;
  principalName: string;
  principalNip: string;
  principalPangkat: string;
  academicYear: string;
  curriculum: string;
  videoFolderDrive: string;
  kataPengantarPenyusun: {
    title: string;
    author: string;
    paragraphs: string[];
    zonaAkhlak: string;
    zonaNalarKritis: string;
    dalilUlulAlbab: {
      surah: string;
      arab: string;
      arti: string;
    };
  };
  photos: {
    url: string;
    caption: string;
    description: string;
  }[];
}

export const TAUGHT_CLASSES = ["X-1", "X-2", "X-3", "X-4"] as const;
export const KKTP_SCORE = 78;

export const SMAN1_KREMBUNG: SchoolInfo = {
  name: "SMA Negeri 1 Krembung",
  shortName: "SMANIKRE",
  appTitle: "MIZAN",
  appSubtitle: "Media Interaktif, Zona Akhlak dan Nalar Kritis",
  appFullDescription: "MIZAN (Media Interaktif, Zona Akhlak dan Nalar Kritis) Pendidikan Agama Islam dan Budi Pekerti Fase E",
  npsn: "20501678",
  address: "Jl.Raya Kecamatan No.2 Krembung-Sidoarjo",
  city: "Kabupaten Sidoarjo",
  province: "Jawa Timur",
  logoUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiRAV4PosL9AgFXRTELx7YzR8V54t2qomMY5NH3zhMBMOocjsZjlBSU2A4MDeESA6HP_NU7qxiBvlRc3tuL-N0tcw-_UD1cH7a0IlUiDXGaffKDjXVFyqRbWVECpm5EHzQUAaXzTQ1yPavmu1wSrP0K4XRMVbWXPaEUfS-WnOhGSWnHdTSVRE6cqfb9x-39/s508/image__1_-removebg-preview.png",
  teacherName: "Ulfatul Husna, S.Ag.,M.Pd.",
  teacherTitle: "Guru Pendidikan Agama Islam & Budi Pekerti",
  teacherNip: "197410101998022001",
  teacherPangkat: "Pembina Utama Muda / IV.c",
  teacherPhotoUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhsLCOg4qZSUwGV5tS7hWfHuOXhO3lPOjvcoK-liVXfydR7d6gdihB1O5bA2N1iOu_0wy8Qk0sroPNA19SW2MSC9RkV9khmihcU0EEU_mawyZkhvT_7m9iE3GC4fjOGsiILwwDyY1-sSf-7YPdn7vwnkWuB9lUjHFxIWB2smSsibHZThKz6CHP5qyvMD66J/s4160/ulfa_MAS.jpeg",
  teacherWa: "082232754232",
  teacherEmail: "pembelajaranulfa@gmail.com",
  principalName: "Siwi Kuntarsih, S.Pd.,M.Pd.",
  principalNip: "197710052006042021",
  principalPangkat: "Pembina / IV.a",
  academicYear: "2026/2027",
  curriculum: "Kurikulum Merdeka (Kepka BKPDM No. 20 Tahun 2026)",
  videoFolderDrive: "https://drive.google.com/drive/folders/1_uhssQoz8b1IA3g-q9u3TVtBjOWuhpV8?usp=sharing",
  kataPengantarPenyusun: {
    title: "Kata Pengantar Penyusun",
    author: "Ulfatul Husna, S.Ag., M.Pd.",
    paragraphs: [
      "Pengembangan e-modul mandiri ini hadir sebagai bentuk adaptasi terhadap kemajuan teknologi digital sekaligus wujud komitmen dalam mengimplementasikan pembelajaran mendalam dan kurikulum berbasis cinta. MIZAN, yang secara bahasa bermakna \"timbangan\" atau \"keseimbangan\", diangkat sebagai filosofi utama platform ini. Filosofi ini berakar kuat pada firman Allah SWT dalam QS. Ali 'Imran: 190–191, yang menggambarkan profil Ulul Albab—yakni manusia yang mampu memadukan antara kekuatan dzikir (kesadaran spiritual dan penataan akhlak) dengan kekuatan fikir (kemampuan bernalar kritis dalam memetakan tanda-tanda kebesaran-Nya di alam semesta).",
      "Keseimbangan antara dimensi akhlak dan nalar kritis ini merupakan cerminan nyata dari nilai utama Moderasi Beragama, yaitu Tawazzun (keseimbangan yang proporsional). Melalui E-Modul MIZAN-PAI, peserta didik tidak hanya diajak untuk memahami ajaran Islam secara dogmatis, tetapi juga dibimbing untuk:",
      "E-modul ini dirancang secara interaktif dan mandiri agar peserta didik dapat belajar sesuai dengan kecepatan, gaya belajar, dan fleksibilitas masing-masing, tanpa kehilangan kedalaman substansi materi PAI."
    ],
    zonaAkhlak: "Mengasah Zona Akhlak: Membentuk kepribadian yang santun, bertakwa, berempati, serta memiliki integritas moril sebagai upaya mewujudkan Delapan Profil Lulusan.",
    zonaNalarKritis: "Mengembangkan Zona Nalar Kritis: Melatih daya analitis, kemampuan pemecahan masalah (problem solving), serta sikap kritis-objektif dalam merespons berbagai dinamika sosial dan informasi di era digital.",
    dalilUlulAlbab: {
      surah: "QS. Ali 'Imran: 190–191",
      arab: "إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ وَاخْتِلَافِ اللَّيْلِ وَالنَّهَارِ لَآيَاتٍ لِّأُولِي الْأَلْبَابِ ﴿١٩٠﴾ الَّذِينَ يَذْكُرُونَ اللَّهَ قِيَامًا وَقُعُودًا وَعَلَىٰ جُنُوبِهِمْ وَيَتَفَكَّرُونَ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ...",
      arti: "Sesungguhnya dalam penciptaan langit dan bumi, dan pergantian malam dan siang terdapat tanda-tanda (kebesaran Allah) bagi orang yang berakal (Ulul Albab), (yaitu) orang-orang yang mengingat Allah sambil berdiri, duduk atau dalam keadaan berbaring, dan mereka memikirkan tentang penciptaan langit dan bumi..."
    }
  },
  photos: [
    {
      url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhTHwCG4OYCtXduvj891IjmDUv52MTVKRaBpzpKg3z98yw9_v5G6t_lli2bCJixVqAdiwPaxLyGzXkgIiBPyWOX_smLBIr4UbMNoqolq27ZJeZZgbi4KnSq0khh6q793AEvk1ZRIKLpfnwh8Hz1wBOcIHLIXKban3KOG5tjobT1hGkVulfF6kio34cGOjnk/s1600/Image_20250730_111825_005.jpeg",
      caption: "Aktivitas Kolaborasi & Diskusi Siswa SMAN 1 Krembung",
      description: "Murid kelas X mendiskusikan implementasi nilai fastabiqul khairat dan syu'abul iman secara interaktif di kelas."
    },
    {
      url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjck4L0StkjujtxeXw9oAV4Obs_9rtkmu8u5akCjvTlNCZNejg8h9s_sQ1il6_T5hpFz61v7oTBA0rQ3F21DXx1sP0joIK82tDIGQoiaSz_ewrWNkMGKq9HCAy-iYxZddWPrHuMjrYq7xf0iStI5wyJPowxap6YwCXtQxazrI_e206l0DK_VE2XlSH6mh-1/s1600/IMG_1324%20%281%29.jpeg",
      caption: "Pembelajaran Bermakna PAI & Budi Pekerti SMANIKRE",
      description: "Suasana refleksi dan presentasi tugas infografis fikih muamalah dan syaja'ah oleh siswa SMA Negeri 1 Krembung."
    },
    {
      url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh1jzOHZb8jQtfD3KL6IM8ecRNEDIxqFHsTys9nSwTfmk17Jb0wzvT4C24abUsImVixJ7zr-EtTtz5uJ2VLpeojHYCuTDu-FLXnKjEftJXfGFF0Olg8tmm6V_PQtlvIl9HSBZgGTtRfDDBiaEAoIZ7_lN6RBd1VNSl2KXITwuSNdmYD-pOhcB6Gv0Rf0s0H/s1600/IMG_1120%20%281%29.jpeg",
      caption: "Semangat Belajar Mandiri & Berkelanjutan",
      description: "Kegiatan tadarus Al-Qur'an dan asesmen berbasis digital dengan pendampingan Ibu Ulfatul Husna, S.Ag., M.Pd."
    }
  ]
};

export const BADGES_LIST = [
  {
    id: "badge-fastabiqul",
    title: "Pionir Kebaikan",
    description: "Tuntas Asesmen Sumatif Bab 1 tentang Fastabiqul Khairat & Etos Kerja",
    iconName: "Flame",
    requiredChapter: 1,
    requirement: "Selesaikan Bab 1 dengan nilai KKTP ≥ 78"
  },
  {
    id: "badge-mahabbatullah",
    title: "Pencinta Rida Allah",
    description: "Memahami dan mengamalkan hakikat Mahabbatullah dalam menggapai rida Allah Swt.",
    iconName: "Heart",
    requiredChapter: 2,
    requirement: "Selesaikan Bab 2 dengan nilai KKTP ≥ 78"
  },
  {
    id: "badge-zuhud",
    title: "Pribadi Rendah Hati",
    description: "Mampu membentengi diri dari sifat israf, riya', sum'ah, takabbur, dan hasad",
    iconName: "HeartHandshake",
    requiredChapter: 3,
    requirement: "Selesaikan Bab 3 dengan nilai KKTP ≥ 78"
  },
  {
    id: "badge-hukum-islam",
    title: "Penegak Maqashid Syariah",
    description: "Menguasai 4 sumber hukum Islam dan 5 pilar universal Al-Kulliyatu Al-Khamsah",
    iconName: "Scale",
    requiredChapter: 4,
    requirement: "Selesaikan Bab 4 dengan nilai KKTP ≥ 78"
  },
  {
    id: "badge-ulama-jawa",
    title: "Pewaris Dakwah Jawa",
    description: "Meneladani strategi dakwah kultural dan kearifan Wali Songo di Tanah Jawa",
    iconName: "Compass",
    requiredChapter: 5,
    requirement: "Selesaikan Bab 5 dengan nilai KKTP ≥ 78"
  },
  {
    id: "badge-penjaga-izzah",
    title: "Penjaga Kehormatan Diri",
    description: "Tegas membentengi diri dari pergaulan bebas dan perbuatan zina ('Iffah)",
    iconName: "Award",
    requiredChapter: 6,
    requirement: "Selesaikan Bab 6 dengan nilai KKTP ≥ 78"
  },
  {
    id: "badge-khauf-raja",
    title: "Hamba Penuh Tawakal",
    description: "Menyeimbangkan rasa khauf, raja', tawakkal pasca ikhtiar, dan tobat nasuha",
    iconName: "Sparkles",
    requiredChapter: 7,
    requirement: "Selesaikan Bab 7 dengan nilai KKTP ≥ 78"
  },
  {
    id: "badge-penjaga-lisan",
    title: "Ksatria Penahan Amarah",
    description: "Menguasai manajemen amarah (ghadab) dan menjaga kehormatan lisan dari ghibah",
    iconName: "Shield",
    requiredChapter: 8,
    requirement: "Selesaikan Bab 8 dengan nilai KKTP ≥ 78"
  },
  {
    id: "badge-ekonomi-wakaf",
    title: "Pelopor Ekonomi Syariah & Wakaf",
    description: "Memahami transaksi syariah tanpa riba dan mempelopori wakaf uang produktif",
    iconName: "Coins",
    requiredChapter: 9,
    requirement: "Selesaikan Bab 9 dengan nilai KKTP ≥ 78"
  },
  {
    id: "badge-ulama-luar-jawa",
    title: "Duta Islam Nusantara",
    description: "Menuntaskan seluruh 10 Bab Fase E dan menyerap keteladanan ulama luar Jawa",
    iconName: "Crown",
    requiredChapter: 10,
    requirement: "Selesaikan Bab 10 dengan predikat tuntas"
  }
];
