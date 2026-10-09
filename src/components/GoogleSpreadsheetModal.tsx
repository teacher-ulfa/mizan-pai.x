import React, { useState, useEffect, useMemo } from 'react';
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
  RefreshCw,
  Download,
  Upload,
  FileText,
  ArrowDownToLine,
  ArrowUpFromLine,
  Check,
  ClipboardPaste
} from 'lucide-react';
import {
  getCachedSpreadsheetUrl,
  saveSpreadsheetSettings,
  fetchSpreadsheetSettings,
  syncAllDataToGoogleSpreadsheet,
  parseSpreadsheetText,
  applyParsedRowsToStorage,
  fetchSpreadsheetDataFromWebApp,
  ParsedSpreadsheetRow
} from '../services/assessmentSyncService';

interface GoogleSpreadsheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  onImportSuccess?: () => void;
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
  onImportSuccess,
  recordsToSync = []
}) => {
  const [url, setUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'tarik' | 'kirim' | 'panduan'>('tarik');
  const [copied, setCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [pastedText, setPastedText] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchSpreadsheetSettings().then((settings) => {
        setUrl(settings.spreadsheetUrl || getCachedSpreadsheetUrl());
      });
    }
  }, [isOpen]);

  // Real-time parsing of pasted text
  const detectedRows = useMemo(() => {
    if (!pastedText.trim()) return [];
    return parseSpreadsheetText(pastedText);
  }, [pastedText]);

  if (!isOpen) return null;

  // Complete Apps Script code supporting both Real-time Write (doPost) and Automated Read (doGet)
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
}

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rows = sheet.getDataRange().getValues();
    if (rows.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
    }
    var data = [];
    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      if (!row[1] && !row[2]) continue; // lewati baris kosong
      data.push({
        timestamp: row[0],
        nisn: String(row[1]).replace(/^'/, '').trim(),
        nama: String(row[2]).trim(),
        kelas: String(row[3]).trim(),
        bab: String(row[4]).trim(),
        kategori: String(row[5]).trim(),
        skor: Number(row[6]),
        status: String(row[7]).trim()
      });
    }
    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message })).setMimeType(ContentService.MimeType.JSON);
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

  // Pull data automatically via Web App URL (doGet)
  const handleAutoPull = async () => {
    const targetUrl = url.trim() || getCachedSpreadsheetUrl();
    if (!targetUrl.startsWith('http')) {
      onShowToast("Harap masukkan URL Google Apps Script terlebih dahulu!");
      return;
    }
    setIsPulling(true);
    const result = await fetchSpreadsheetDataFromWebApp(targetUrl);
    setIsPulling(false);

    if (result.success && result.data && result.data.length > 0) {
      const applyRes = await applyParsedRowsToStorage(result.data);
      if (onImportSuccess) onImportSuccess();
      onShowToast(`Alhamdulillah! Berhasil menarik ${applyRes.count} baris nilai dari Google Spreadsheet ke aplikasi MIZAN!`);
      setPastedText('');
    } else {
      onShowToast(result.error || "Gagal menarik data otomatis. Silakan gunakan metode Salin-Tempel di bawah ini.");
    }
  };

  // Apply pasted rows from Google Sheet to application state
  const handleApplyPasted = async () => {
    if (detectedRows.length === 0) {
      onShowToast("Belum ada data nilai yang terdeteksi dari teks yang ditempelkan.");
      return;
    }
    setIsPulling(true);
    const applyRes = await applyParsedRowsToStorage(detectedRows);
    setIsPulling(false);
    if (onImportSuccess) onImportSuccess();
    onShowToast(`Alhamdulillah! Berhasil mengimpor ${applyRes.count} nilai murid dari Spreadsheet ke Rekap Nilai MIZAN!`);
    setPastedText('');
  };

  // Handle CSV file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setPastedText(text);
        onShowToast(`File CSV berhasil dibaca. Klik tombol Terapkan untuk memindahkan nilai.`);
      }
    };
    reader.readAsText(file);
  };

  const handleTestRow = async () => {
    const targetUrl = url.trim() || getCachedSpreadsheetUrl();
    if (!targetUrl.startsWith('http')) {
      onShowToast("Harap masukkan URL Google Apps Script Web App terlebih dahulu!");
      return;
    }
    setIsSyncing(true);
    try {
      await fetch(targetUrl, {
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
                Pusat Sinkronisasi Google Spreadsheet
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Tarik jawaban murid dari Google Sheet ke aplikasi MIZAN atau kirim data rekap dua arah
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('tarik')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'tarik'
                ? 'bg-emerald-700 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
            <span>Tarik ke MIZAN</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('kirim')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'kirim'
                ? 'bg-emerald-700 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ArrowUpFromLine className="w-3.5 h-3.5" />
            <span>Kirim ke Sheets</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('panduan')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'panduan'
                ? 'bg-emerald-700 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Kode & Setelan</span>
          </button>
        </div>

        {/* TAB 1: TARIK DATA KE MIZAN (SPREADSHEET -> MIZAN) */}
        {activeTab === 'tarik' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Solusi Sinkronisasi Jawaban Murid</span>
              </div>
              <p className="leading-relaxed text-slate-700">
                Seluruh jawaban murid yang sudah masuk ke Google Spreadsheet dapat dipindahkan ke Rekap Nilai MIZAN dengan 2 cara mudah di bawah:
              </p>
            </div>

            {/* Metode 1: Salin-Tempel (Paling Cepat & Anti-Gagal) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <ClipboardPaste className="w-4 h-4 text-emerald-600" />
                  <span>Cara 1: Salin-Tempel dari Google Sheet (Sangat Mudah)</span>
                </div>
                <label className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 bg-white border border-emerald-200 hover:bg-emerald-50 px-2.5 py-1 rounded-lg cursor-pointer transition-colors flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  <span>Unggah File CSV</span>
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed">
                1. Buka Google Spreadsheet Ibu $\rightarrow$ blok tabel data murid (atau tekan <strong>Ctrl + A</strong>) $\rightarrow$ tekan <strong>Ctrl + C (Copy)</strong>.<br />
                2. Tempelkan (<strong>Ctrl + V</strong>) ke dalam kotak di bawah ini:
              </p>

              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                rows={4}
                placeholder="Tempelkan baris data Google Spreadsheet di sini... (Contoh: Waktu, NISN, Nama, Kelas, Bab, Kategori, Skor, Status)"
                className="w-full p-3 text-xs font-mono border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
              />

              <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                <div className="text-xs">
                  {detectedRows.length > 0 ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                      <Check className="w-3.5 h-3.5" />
                      Terdeteksi {detectedRows.length} rekaman nilai murid siap diimpor!
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[11px]">
                      Tempel teks untuk memverifikasi data murid
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleApplyPasted}
                  disabled={detectedRows.length === 0 || isPulling}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowDownToLine className={`w-3.5 h-3.5 ${isPulling ? 'animate-spin' : ''}`} />
                  <span>Terapkan ({detectedRows.length}) Nilai ke Rekap MIZAN</span>
                </button>
              </div>
            </div>

            {/* Metode 2: Tarik Otomatis via Web App */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <RefreshCw className="w-4 h-4 text-emerald-600" />
                  <span>Cara 2: Tarik Otomatis 1-Klik dari Web App</span>
                </div>
                <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                  Memerlukan doGet
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Tarik data secara langsung dari URL Web App yang sudah dikonfigurasi fungsi <code>doGet</code>.
              </p>
              <button
                type="button"
                onClick={handleAutoPull}
                disabled={isPulling || !isConnected}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isPulling ? 'animate-spin' : ''}`} />
                <span>{isPulling ? 'Sedang Mengambil Data...' : '⚡ Tarik Otomatis Seluruh Nilai dari Spreadsheet'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: KIRIM DATA KE SPREADSHEET (MIZAN -> SPREADSHEET) */}
        {activeTab === 'kirim' && (
          <div className="space-y-4 animate-in fade-in duration-150">
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
                    {isConnected ? 'Pengiriman Otomatis Aktif' : 'URL Spreadsheet Belum Diatur'}
                  </span>
                  <span className="text-[11px] opacity-80">
                    Setiap murid yang menyelesaikan asesmen di HP mereka otomatis mengirim baris baru ke Spreadsheet Ibu.
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Kirim Nilai Manual / Uji Coba:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleTestRow}
                  disabled={isSyncing}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kirim 1 Baris Uji Coba</span>
                </button>
                <button
                  type="button"
                  onClick={handleSyncAll}
                  disabled={isSyncing}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Kirim Seluruh Rekap ({recordsToSync.length})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PANDUAN & KODE APPS SCRIPT */}
        {activeTab === 'panduan' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* URL Input Form */}
            <form onSubmit={handleSave} className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                URL Aplikasi Web Google Apps Script Ibu:
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="flex-1 px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-slate-50 focus:bg-white font-mono"
                />
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shrink-0 shadow-xs cursor-pointer"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan URL'}
                </button>
              </div>
            </form>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Kode Google Apps Script Dua Arah (doPost &amp; doGet):</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-900 font-semibold bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
                </button>
              </div>

              <pre className="text-[11px] font-mono bg-slate-900 text-emerald-400 p-3.5 rounded-xl overflow-x-auto max-h-44 border border-slate-800 leading-relaxed">
                {scriptCode}
              </pre>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                💡 <em>Tips:</em> Jika Ibu ingin fitur <strong>Tarik Otomatis 1-Klik</strong> berjalan, buka menu <strong>Ekstensi &gt; Apps Script</strong> di Google Sheets Ibu, gantikan seluruh teks dengan kode di atas, lalu klik <strong>Terapkan &gt; Deployment baru (Versi baru)</strong> dengan hak akses <strong>Siapa saja (Anyone)</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-500">
            SMAN 1 Krembung · PAI &amp; Budi Pekerti Fase E
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
