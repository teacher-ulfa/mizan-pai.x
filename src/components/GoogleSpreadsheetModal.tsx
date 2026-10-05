import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  X,
  CheckCircle2,
  Copy,
  ExternalLink,
  Send,
  AlertCircle,
  HelpCircle,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import {
  getCachedSpreadsheetUrl,
  saveSpreadsheetSettings,
  fetchSpreadsheetSettings,
  syncAllDataToGoogleSpreadsheet
} from '../services/assessmentSyncService';

interface GoogleSpreadsheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  recordsToSync?: Array<{
    timestamp: string;
    nisn: string;
    nama: string;
    kelas: string;
    bab: string;
    kategori: string;
    skor: number;
    status: string;
  }>;
}

export const GoogleSpreadsheetModal: React.FC<GoogleSpreadsheetModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  recordsToSync = []
}) => {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSpreadsheetSettings().then((settings) => {
        setUrl(settings.spreadsheetUrl || getCachedSpreadsheetUrl());
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const scriptCode = `function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Waktu Submit", "NISN", "Nama Peserta Didik", "Kelas", "Bab", "Kategori Asesmen", "Skor", "Status"]);
      sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#d1fae5");
    }
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString("id-ID"),
      "'" + data.nisn,
      data.nama,
      data.kelas,
      data.bab,
      data.kategori,
      data.skor,
      data.status
    ]);
    return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput("ERROR: " + err.message).setMimeType(ContentService.MimeType.TEXT);
  }
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    onShowToast("Kode Google Apps Script berhasil disalin ke clipboard!");
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await saveSpreadsheetSettings(url.trim());
    setIsSaving(false);
    onShowToast("Pengaturan URL Google Spreadsheet berhasil disimpan!");
  };

  const handleTestRow = async () => {
    if (!url.trim().startsWith('http')) {
      onShowToast("Harap masukkan URL Google Apps Script Web App terlebih dahulu!");
      return;
    }
    setIsSyncing(true);
    try {
      await fetch(url.trim(), {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          timestamp: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
          nisn: '0001234567',
          nama: 'CONTOH UJI COBA SINKRONISASI',
          kelas: 'X-1',
          bab: 'Bab 1',
          kategori: 'Asesmen Awal / Diagnostik',
          skor: 95,
          status: 'Tuntas'
        })
      });
      onShowToast("Baris uji coba terkirim! Silakan buka Google Spreadsheet Anda untuk memeriksa.");
    } catch (e: any) {
      onShowToast("Gagal mengirim baris uji coba: " + (e.message || 'Error'));
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncAll = async () => {
    const targetUrl = url.trim() || getCachedSpreadsheetUrl();
    if (!targetUrl.startsWith('http')) {
      onShowToast("Harap masukkan dan simpan URL Google Apps Script terlebih dahulu!");
      return;
    }
    setIsSyncing(true);

    let clientSyncCount = 0;
    // 1. Direct browser sync for each existing student score in the table
    if (recordsToSync && recordsToSync.length > 0) {
      for (const record of recordsToSync) {
        try {
          await fetch(targetUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(record)
          });
          clientSyncCount++;

          // Also save to server so backend has it recorded
          fetch('/api/assessments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nisn: record.nisn,
              studentName: record.nama,
              studentClass: record.kelas,
              chapterId: parseInt(record.bab.replace('Bab ', '')) || 1,
              category: record.kategori.includes('Awal') ? 'diagnostik' : record.kategori.includes('Formatif') ? 'formatif' : 'sumatif',
              score: record.skor,
              timestamp: record.timestamp
            })
          }).catch(() => {});
        } catch (err) {
          console.error('Error syncing record to spreadsheet:', err);
        }
      }
    }

    // 2. Also trigger server batch sync
    const serverResult = await syncAllDataToGoogleSpreadsheet(targetUrl);
    setIsSyncing(false);

    const totalCount = Math.max(clientSyncCount, serverResult.count || 0);
    if (totalCount > 0) {
      onShowToast(`Alhamdulillah! Berhasil mengirim ${totalCount} data nilai murid langsung ke Google Spreadsheet!`);
    } else {
      onShowToast(`Belum ada data nilai murid baru di tabel untuk dikirim.`);
    }
  };

  const isConnected = url.trim().startsWith('http');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800">
              <FileSpreadsheet className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif text-slate-900">
                Integrasi Google Spreadsheet
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Kirim seluruh nilai Asesmen Awal, Formatif & Sumatif murid otomatis ke Google Sheets Anda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Connection Indicator */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
          isConnected
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            )}
            <div>
              <span className="font-bold block">
                {isConnected ? 'Google Spreadsheet Terhubung' : 'Google Spreadsheet Belum Dihubungkan'}
              </span>
              <span className="text-[11px] opacity-80">
                {isConnected
                  ? 'Setiap murid yang klik Selesai Asesmen akan langsung tercatat sebagai baris baru di Spreadsheet Anda.'
                  : 'Ikuti panduan 3 langkah di bawah untuk membuat integrasi gratis dalam 1 menit.'}
              </span>
            </div>
          </div>
          {isConnected && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-200/60 text-emerald-950 font-bold text-[10px] shrink-0">
              AKTIF
            </span>
          )}
        </div>

        {/* URL Input Form */}
        <form onSubmit={handleSave} className="space-y-3">
          <label className="block text-xs font-bold text-slate-700">
            URL Aplikasi Web Google Apps Script:
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/AKfycb.../exec"
              className="flex-1 px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-slate-50 focus:bg-white font-mono"
            />
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shrink-0 shadow-xs"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan URL'}
            </button>
          </div>
        </form>

        {/* Action Buttons if Connected */}
        {isConnected && (
          <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
            <button
              type="button"
              onClick={handleTestRow}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-emerald-600" />
              <span>Kirim Baris Uji Coba</span>
            </button>
            <button
              type="button"
              onClick={handleSyncAll}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sinkronkan Seluruh Nilai Sekarang</span>
            </button>
          </div>
        )}

        {/* Step-by-Step Guide */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>Panduan 1 Menit Menghubungkan Google Sheets</span>
            </div>
            <button
              type="button"
              onClick={handleCopyCode}
              className="flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-900 font-semibold bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Tersalin!' : 'Salin Kode Apps Script'}</span>
            </button>
          </div>

          <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200 leading-relaxed">
            <ol className="list-decimal list-inside space-y-1.5">
              <li>
                Buka <strong>Google Spreadsheet baru</strong> di Google Drive Anda (misal beri judul <em>"Rekap Nilai PAI SMAN 1 Krembung"</em>).
              </li>
              <li>
                Klik menu atas: <strong>Ekstensi &gt; Apps Script</strong>.
              </li>
              <li>
                Hapus teks di editor Apps Script, lalu <strong>tempel (paste) kode yang telah disalin</strong>.
              </li>
              <li>
                Klik tombol biru <strong>Terapkan (Deploy) &gt; Deployment baru (New deployment)</strong> di kanan atas.
              </li>
              <li>
                Pilih jenis: <strong>Aplikasi web (Web app)</strong>. Atur bagian <em>"Siapa yang memiliki akses (Who has access)"</em> menjadi: <strong>Siapa saja (Anyone)</strong>.
              </li>
              <li>
                Klik <strong>Terapkan (Deploy)</strong>, lalu salin <strong>URL Aplikasi Web</strong> yang dihasilkan dan tempelkan ke kolom di atas.
              </li>
            </ol>
          </div>

          {/* Script Code Preview */}
          <div className="relative">
            <pre className="text-[11px] font-mono bg-slate-900 text-emerald-400 p-3.5 rounded-xl overflow-x-auto max-h-40 border border-slate-800">
              {scriptCode}
            </pre>
            <button
              onClick={handleCopyCode}
              className="absolute top-2 right-2 px-2.5 py-1 text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-md border border-slate-700 flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              <span>{copied ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
