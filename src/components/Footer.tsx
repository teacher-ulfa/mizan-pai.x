import React from 'react';
import { SMAN1_KREMBUNG } from '../data/schoolData';
import { BookOpen, MapPin, Award, Heart, ExternalLink, MessageCircle, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Col 1: School Info & Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={SMAN1_KREMBUNG.logoUrl}
                alt="Logo MIZAN SMAN 1 Krembung"
                className="w-14 h-14 object-contain rounded-xl p-1 bg-white/10"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="font-bold text-white text-base">
                  {SMAN1_KREMBUNG.name}
                </h4>
                <p className="text-xs text-emerald-400 font-semibold">
                  MIZAN (Media Interaktif, Zona Akhlak dan Nalar Kritis)
                </p>
                <p className="text-[11px] text-slate-400">
                  {SMAN1_KREMBUNG.shortName} · Sidoarjo, Jawa Timur
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Media Pembelajaran Digital Pendidikan Agama Islam dan Budi Pekerti Fase E (Kelas X) berbasis Kurikulum Merdeka & Deep Learning. Mengintegrasikan kekuatan dzikir (Zona Akhlak) dan kekuatan fikir (Zona Nalar Kritis) dalam bingkai moderasi beragama Tawazzun dan profil Ulul Albab.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{SMAN1_KREMBUNG.address}</span>
            </div>
          </div>

          {/* Col 2: Kurikulum & Bahan Tayang */}
          <div className="space-y-3">
            <h5 className="text-sm font-semibold text-white tracking-wide uppercase">
              Kurikulum & Regulasi
            </h5>
            <ul className="text-xs text-slate-400 space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Kepka BKPDM No. 20 Tahun 2026</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Tahun Pelajaran 2026/2027</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Asesmen Diagnostik, Formatif, dan Sumatif ANBK</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>6 Dimensi Profil Pelajar Pancasila</span>
              </li>
            </ul>

            <div className="pt-2">
              <a
                href={SMAN1_KREMBUNG.videoFolderDrive}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-300 border border-emerald-700/50 rounded-lg text-xs font-medium transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Bahan Tayang & Video (Bab 1–5 Google Drive)</span>
              </a>
            </div>
          </div>

          {/* Col 3: Pengembang & Kredensial */}
          <div className="space-y-4 bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60">
            <h5 className="text-sm font-semibold text-white tracking-wide uppercase flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Pengembang Media</span>
            </h5>
            <div className="space-y-1">
              <p className="text-sm font-bold text-white">
                oleh Ulfatul Husna, S.Ag.,M.Pd.
              </p>
              <p className="text-xs text-emerald-300">
                {SMAN1_KREMBUNG.teacherTitle}
              </p>
              <p className="text-[11px] text-slate-400">
                NIP: {SMAN1_KREMBUNG.teacherNip}
              </p>
              <p className="text-[11px] text-amber-300/90 font-medium">
                Pangkat: {SMAN1_KREMBUNG.teacherPangkat}
              </p>
            </div>
            <p className="text-xs text-slate-400 pt-2 border-t border-slate-700/60 leading-relaxed italic">
              "Mendidik dengan hati, menginspirasi dengan budi pekerti, mencetak generasi berkarakter unggul dan berkebinekaan global."
            </p>

            {/* Link Media Sosial Resmi */}
            <div className="pt-3 border-t border-slate-700/60 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                Link Media Sosial & Kontak:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href={`https://wa.me/62${SMAN1_KREMBUNG.teacherWa.replace(/^0/, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900/60 hover:bg-emerald-950/40 text-slate-300 hover:text-emerald-400 border border-slate-700 transition-colors col-span-2 sm:col-span-1"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">WA: {SMAN1_KREMBUNG.teacherWa}</span>
                  <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
                </a>

                <a
                  href={`mailto:${SMAN1_KREMBUNG.teacherEmail}`}
                  className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900/60 hover:bg-teal-950/40 text-slate-300 hover:text-teal-400 border border-slate-700 transition-colors col-span-2 sm:col-span-1"
                >
                  <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span className="truncate">Email Guru</span>
                  <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
                </a>

                <a
                  href="https://www.youtube.com/channel/UCGIyli6pacuKHCMcgXutVRg"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900/60 hover:bg-red-950/40 text-slate-300 hover:text-red-400 border border-slate-700 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <span className="truncate">YouTube</span>
                  <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
                </a>

                <a
                  href="https://www.facebook.com/ulfa.husna/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900/60 hover:bg-blue-950/40 text-slate-300 hover:text-blue-400 border border-slate-700 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span className="truncate">Facebook</span>
                  <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
                </a>

                <a
                  href="https://www.instagram.com/ulfa_h/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900/60 hover:bg-pink-950/40 text-slate-300 hover:text-pink-400 border border-slate-700 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                  <span className="truncate">Instagram</span>
                  <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
                </a>

                <a
                  href="https://ulfahusna.my.id"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-900/60 hover:bg-emerald-950/40 text-slate-300 hover:text-emerald-400 border border-slate-700 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="truncate font-semibold">ulfahusna.my.id</span>
                  <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; 2026 - 2027 E-Modul MIZAN PAI & Budi Pekerti Fase E · SMA Negeri 1 Krembung. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>oleh Ulfatul Husna, S.Ag.,M.Pd.</span>
            <span>·</span>
            <span>Edisi Digital LMS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
