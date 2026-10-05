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
