/**
 * Service to sync student assessments to server and Google Spreadsheet
 */

export interface AssessmentPayload {
  nisn: string;
  studentName: string;
  studentClass: string;
  chapterId: number;
  category: 'diagnostik' | 'formatif' | 'sumatif';
  score: number;
  timestamp?: string;
}

export interface StudentServerRecord {
  nisn: string;
  studentName: string;
  studentClass: string;
  diagnosticScores: Record<number, number>;
  formativeScores: Record<number, number>;
  sumativeScores: Record<number, number>;
  updatedAt: string;
}

export const DEFAULT_SPREADSHEET_URL =
  'https://script.google.com/macros/s/AKfycbxUD72h2JmKfXDveNzQIRmegRbYnxPFqcbQNXW3LQT6Ir1QUok7ykJSd0ikqF9Hp3gReg/exec';

// Local storage key cache for teacher's Google Spreadsheet Webhook URL
const STORAGE_KEY_SPREADSHEET_URL = 'mizan_google_spreadsheet_url';

export const getCachedSpreadsheetUrl = (): string => {
  return localStorage.getItem(STORAGE_KEY_SPREADSHEET_URL) || DEFAULT_SPREADSHEET_URL;
};

export const setCachedSpreadsheetUrl = (url: string) => {
  localStorage.setItem(STORAGE_KEY_SPREADSHEET_URL, (url || DEFAULT_SPREADSHEET_URL).trim());
};

/**
 * Submits an assessment result to both the internal backend server and the Google Spreadsheet
 */
export const submitAssessmentResult = async (payload: AssessmentPayload): Promise<boolean> => {
  const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
  const fullPayload = { ...payload, timestamp };

  let success = false;

  // 1. Post to Server API (/api/assessments)
  try {
    const res = await fetch('/api/assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullPayload)
    });
    if (res.ok) {
      success = true;
    }
  } catch (e) {
    console.warn('Server assessment post error:', e);
  }

  // 2. Direct client-side post to Google Spreadsheet Webhook (mode: 'no-cors' works across domains)
  const cachedUrl = getCachedSpreadsheetUrl();
  if (cachedUrl && cachedUrl.startsWith('http')) {
    try {
      const categoryName =
        payload.category === 'diagnostik' ? 'Asesmen Awal / Diagnostik' :
        payload.category === 'formatif' ? 'Asesmen Formatif (Latihan)' : 'Asesmen Sumatif (ANBK)';

      await fetch(cachedUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          timestamp,
          nisn: payload.nisn,
          nama: payload.studentName,
          kelas: payload.studentClass,
          bab: `Bab ${payload.chapterId}`,
          kategori: categoryName,
          skor: payload.score,
          status: payload.score >= 78 ? 'Tuntas' : 'Remidi'
        })
      });
      success = true;
    } catch (sheetErr) {
      console.warn('Direct Google Sheet submission notice:', sheetErr);
    }
  }

  return success;
};

/**
 * Fetches all student records recorded by the server
 */
export const fetchAllAssessmentsFromServer = async (): Promise<Record<string, StudentServerRecord>> => {
  try {
    const res = await fetch('/api/assessments');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Failed to fetch assessments from server:', e);
  }
  return {};
};

/**
 * Loads teacher Google Spreadsheet settings
 */
export const fetchSpreadsheetSettings = async (): Promise<{ spreadsheetUrl: string }> => {
  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const data = await res.json();
      if (data.spreadsheetUrl) {
        setCachedSpreadsheetUrl(data.spreadsheetUrl);
      }
      return data;
    }
  } catch (e) {
    console.warn('Failed to fetch settings from server:', e);
  }
  return { spreadsheetUrl: getCachedSpreadsheetUrl() };
};

/**
 * Saves teacher Google Spreadsheet URL
 */
export const saveSpreadsheetSettings = async (spreadsheetUrl: string): Promise<boolean> => {
  setCachedSpreadsheetUrl(spreadsheetUrl);
  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spreadsheetUrl })
    });
    return res.ok;
  } catch (e) {
    console.warn('Failed to save settings to server:', e);
    return true; // Still cached locally
  }
};

/**
 * Batch syncs all local and server data to Google Spreadsheet
 */
export const syncAllDataToGoogleSpreadsheet = async (spreadsheetUrl?: string): Promise<{ success: boolean; count?: number; error?: string }> => {
  const urlToUse = spreadsheetUrl || getCachedSpreadsheetUrl();
  if (!urlToUse || !urlToUse.startsWith('http')) {
    return { success: false, error: 'URL Google Spreadsheet Webhook belum diisi.' };
  }

  try {
    const res = await fetch('/api/sync-spreadsheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spreadsheetUrl: urlToUse })
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, count: data.count };
    }
  } catch (e: any) {
    console.error('Batch sync error:', e);
    return { success: false, error: e.message || 'Gagal mengirim data' };
  }

  return { success: false, error: 'Server tidak merespons' };
};

// -----------------------------------------------------------------------------
// SPREADSHEET IMPORT HELPERS (SPREADSHEET -> MIZAN APPLICATION)
// -----------------------------------------------------------------------------
const STORAGE_KEY_IMPORTED_SCORES = 'mizan_spreadsheet_imported_scores';

export interface ParsedSpreadsheetRow {
  timestamp?: string;
  nisn: string;
  nama: string;
  kelas: string;
  bab: number;
  kategori: 'diagnostik' | 'formatif' | 'sumatif';
  skor: number;
  status: string;
}

export const getImportedSpreadsheetScores = (): Record<string, StudentServerRecord> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_IMPORTED_SCORES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return {};
};

export const saveImportedSpreadsheetScores = (records: Record<string, StudentServerRecord>) => {
  try {
    localStorage.setItem(STORAGE_KEY_IMPORTED_SCORES, JSON.stringify(records));
  } catch (e) {
    console.error(e);
  }
};

/**
 * Parses raw text copied from Google Spreadsheet (TSV/CSV) or uploaded file
 */
export const parseSpreadsheetText = (rawText: string): ParsedSpreadsheetRow[] => {
  const lines = rawText.trim().split(/\r?\n/);
  const results: ParsedSpreadsheetRow[] = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    // Split by tab or comma
    const delimiter = line.includes('\t') ? '\t' : ',';
    const parts = line.split(delimiter).map(p => p.trim().replace(/^["']|["']$/g, ''));
    if (parts.length < 5) continue;

    // Check if it's the header row
    const firstCol = parts[0].toLowerCase();
    const secondCol = (parts[1] || '').toLowerCase();
    if (firstCol.includes('waktu') || firstCol.includes('timestamp') || secondCol.includes('nisn')) {
      continue; // Skip header row
    }

    let timestamp = '';
    let nisn = '';
    let nama = '';
    let kelas = '';
    let rawBab = '';
    let rawKategori = '';
    let rawSkor = '';
    let status = '';

    // Check if column 0 is a timestamp/date or NISN
    if (
      parts[0].includes('/') ||
      parts[0].includes('-') ||
      parts[0].includes(':') ||
      (isNaN(Number(parts[0])) && parts[1]?.match(/^\d{6,14}$/))
    ) {
      timestamp = parts[0];
      nisn = parts[1] || '';
      nama = parts[2] || '';
      kelas = parts[3] || '';
      rawBab = parts[4] || '';
      rawKategori = parts[5] || '';
      rawSkor = parts[6] || '';
      status = parts[7] || '';
    } else {
      nisn = parts[0] || '';
      nama = parts[1] || '';
      kelas = parts[2] || '';
      rawBab = parts[3] || '';
      rawKategori = parts[4] || '';
      rawSkor = parts[5] || '';
      status = parts[6] || '';
    }

    nisn = nisn.replace(/\D/g, '');
    if (!nisn && !nama) continue;

    // Extract Bab number (e.g. "Bab 1" -> 1)
    const babMatch = rawBab.match(/\d+/);
    const babNum = babMatch ? parseInt(babMatch[0]) : 1;

    // Extract category
    const katLower = rawKategori.toLowerCase();
    let kategori: 'diagnostik' | 'formatif' | 'sumatif' = 'diagnostik';
    if (katLower.includes('awal') || katLower.includes('diagnostik')) {
      kategori = 'diagnostik';
    } else if (katLower.includes('formatif') || katLower.includes('latihan')) {
      kategori = 'formatif';
    } else if (katLower.includes('sumatif') || katLower.includes('anbk') || katLower.includes('akhir')) {
      kategori = 'sumatif';
    }

    // Extract score
    const scoreVal = parseInt(rawSkor.replace(/[^\d.-]/g, ''));
    if (isNaN(scoreVal)) continue;

    results.push({
      timestamp,
      nisn,
      nama,
      kelas,
      bab: babNum,
      kategori,
      skor: scoreVal,
      status: status || (scoreVal >= 78 ? 'Tuntas' : 'Remidi')
    });
  }

  return results;
};

/**
 * Applies parsed rows to storage and posts each to internal server API
 */
export const applyParsedRowsToStorage = async (
  rows: ParsedSpreadsheetRow[]
): Promise<{ count: number; updated: Record<string, StudentServerRecord> }> => {
  const current = getImportedSpreadsheetScores();
  let count = 0;

  for (const r of rows) {
    if (!current[r.nisn]) {
      current[r.nisn] = {
        nisn: r.nisn,
        studentName: r.nama,
        studentClass: r.kelas,
        diagnosticScores: {},
        formativeScores: {},
        sumativeScores: {},
        updatedAt: new Date().toISOString()
      };
    }
    const student = current[r.nisn];
    if (r.nama) student.studentName = r.nama;
    if (r.kelas) student.studentClass = r.kelas;

    if (r.kategori === 'diagnostik') {
      student.diagnosticScores[r.bab] = r.skor;
    } else if (r.kategori === 'formatif') {
      student.formativeScores[r.bab] = r.skor;
    } else {
      student.sumativeScores[r.bab] = r.skor;
    }
    count++;

    // Forward to internal server so it's also kept
    fetch('/api/assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nisn: r.nisn,
        studentName: r.nama,
        studentClass: r.kelas,
        chapterId: r.bab,
        category: r.kategori,
        score: r.skor,
        timestamp: r.timestamp
      })
    }).catch(() => {});
  }

  saveImportedSpreadsheetScores(current);
  return { count, updated: current };
};

/**
 * Attempts to fetch data directly from the Web App URL if doGet is implemented
 */
export const fetchSpreadsheetDataFromWebApp = async (
  spreadsheetUrl?: string
): Promise<{ success: boolean; data?: ParsedSpreadsheetRow[]; error?: string }> => {
  const targetUrl = spreadsheetUrl || getCachedSpreadsheetUrl();
  if (!targetUrl || !targetUrl.startsWith('http')) {
    return { success: false, error: 'URL Google Apps Script belum diatur.' };
  }

  try {
    const res = await fetch(targetUrl, { method: 'GET' });
    const text = await res.text();

    if (text.startsWith('[') || text.startsWith('{')) {
      const json = JSON.parse(text);
      if (Array.isArray(json)) {
        const rows: ParsedSpreadsheetRow[] = json.map(item => ({
          timestamp: item.timestamp,
          nisn: String(item.nisn).replace(/^'/, '').trim(),
          nama: String(item.nama || '').trim(),
          kelas: String(item.kelas || '').trim(),
          bab: typeof item.bab === 'number' ? item.bab : parseInt(String(item.bab).replace(/\D/g, '')) || 1,
          kategori: String(item.kategori || '').toLowerCase().includes('formatif') ? 'formatif' :
                    String(item.kategori || '').toLowerCase().includes('sumatif') ? 'sumatif' : 'diagnostik',
          skor: Number(item.skor) || 0,
          status: String(item.status || '')
        }));
        return { success: true, data: rows };
      }
    }
    return {
      success: false,
      error: 'Google Apps Script belum memiliki fungsi doGet(e) untuk penarikan otomatis.'
    };
  } catch (e: any) {
    return { success: false, error: e.message || 'Koneksi ke Web App gagal.' };
  }
};

