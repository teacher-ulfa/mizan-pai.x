import React from 'react';
import { SMAN1_KREMBUNG } from '../data/schoolData';
import { KataPengantarCard } from './KataPengantarCard';
import { Image, ExternalLink, Sparkles, Video, GraduationCap, MapPin, MessageCircle, Mail } from 'lucide-react';

export const SchoolGallery: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Kata Pengantar Penyusun & Filosofi MIZAN */}
      <KataPengantarCard />

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-800">
              <Image className="w-6 h-6 text-emerald-700" />
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                Galeri & Profil SMAN 1 Krembung
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Potret aktivitas belajar mandiri dan kolaboratif murid kelas X dalam mata pelajaran Pendidikan Agama Islam dan Budi Pekerti.
            </p>
          </div>

          <a
            href={SMAN1_KREMBUNG.videoFolderDrive}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
          >
            <Video className="w-4 h-4" />
            <span>Folder Video & PPT Pembelajaran</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>
      </div>

      {/* Photo Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SMAN1_KREMBUNG.photos.map((photo, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col group hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={(e) => {
                  // Fallback container in case external image fails
                  const target = e.target as HTMLElement;
                  target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-semibold text-white drop-shadow-xs">
                  {photo.caption}
                </span>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
              <p className="text-xs text-slate-600 leading-relaxed">
                {photo.description}
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Dokumentasi Sekolah</span>
                <span className="font-semibold text-emerald-700">SMANIKRE</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* School & Educator Profile Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* School Overview */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={SMAN1_KREMBUNG.logoUrl}
              alt="Logo SMAN 1 Krembung"
              className="w-14 h-14 object-contain bg-white rounded-full p-1 border border-emerald-100 shadow-xs"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="font-bold text-base text-slate-900">{SMAN1_KREMBUNG.name}</h3>
              <p className="text-xs text-emerald-700 font-semibold">{SMAN1_KREMBUNG.city}, {SMAN1_KREMBUNG.province}</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <p>
              SMA Negeri 1 Krembung berkomitmen menyelenggarakan pendidikan berkualitas tinggi yang mengintegrasikan kecerdasan intelektual (IQ), emosional (EQ), dan spiritual (SQ).
            </p>
            <p>
              Melalui modul digital <strong>MIZAN</strong>, seluruh murid Fase E dibimbing untuk mempelajari ajaran Islam secara bertahap (tadrij), mendalam (deep learning), dan berorientasi pada kemaslahatan umat.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Kepala Sekolah:</span>
                <span className="font-bold text-slate-800">{SMAN1_KREMBUNG.principalName}</span>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span>NIP. {SMAN1_KREMBUNG.principalNip}</span>
                  <span>·</span>
                  <span className="text-emerald-700 font-medium">{SMAN1_KREMBUNG.principalPangkat}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1 border-t border-slate-100">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{SMAN1_KREMBUNG.address}</span>
            </div>
          </div>
        </div>

        {/* Teacher Profile */}
        <div className="bg-linear-to-br from-emerald-50 to-teal-50/50 rounded-2xl border border-emerald-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-800">
              <GraduationCap className="w-5 h-5 text-emerald-700" />
              <span className="text-xs font-bold uppercase tracking-wider">Profil Guru Pengampu & Pengembang Media</span>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={SMAN1_KREMBUNG.teacherPhotoUrl}
                alt={SMAN1_KREMBUNG.teacherName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-300 shadow-md shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-0.5">
                <h3 className="text-base sm:text-lg font-bold text-slate-950 font-serif">
                  {SMAN1_KREMBUNG.teacherName}
                </h3>
                <p className="text-xs text-emerald-800 font-semibold">
                  {SMAN1_KREMBUNG.teacherTitle}
                </p>
                <p className="text-[11px] text-slate-600">
                  NIP. {SMAN1_KREMBUNG.teacherNip}
                </p>
                <p className="text-[11px] text-emerald-700 font-medium">
                  {SMAN1_KREMBUNG.teacherPangkat}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1.5 text-xs">
                  <a
                    href={`https://wa.me/62${SMAN1_KREMBUNG.teacherWa.replace(/^0/, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-colors shadow-2xs"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>WA: {SMAN1_KREMBUNG.teacherWa}</span>
                  </a>
                  <a
                    href={`mailto:${SMAN1_KREMBUNG.teacherEmail}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-semibold transition-colors shadow-2xs"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed italic bg-white/70 p-3.5 rounded-xl border border-emerald-100">
              "Modul MIZAN ini dihadirkan agar setiap murid dapat belajar mandiri secara mudah di HP maupun laptop, mengukur capaian diri, serta menginternalisasikan nilai-nilai Islam rahmatan lil 'alamin dalam tindakan sehari-hari."
            </p>
          </div>

          <div className="pt-2 text-[11px] text-emerald-900 font-medium flex items-center justify-between border-t border-emerald-200/60">
            <span>Kurikulum Merdeka 2026/2027</span>
            <span>Kepka BKPDM No. 20 Tahun 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
