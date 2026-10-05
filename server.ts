import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

app.use(express.json());

// Persistent data directory
const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const ASSESSMENTS_FILE = path.join(DATA_DIR, 'assessments.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

function loadAssessments(): Record<string, any> {
  try {
    if (fs.existsSync(ASSESSMENTS_FILE)) {
      const content = fs.readFileSync(ASSESSMENTS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('Error reading assessments file:', e);
  }
  return {};
}

function saveAssessments(data: Record<string, any>) {
  try {
    fs.writeFileSync(ASSESSMENTS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing assessments file:', e);
  }
}

const DEFAULT_SPREADSHEET_URL =
  'https://script.google.com/macros/s/AKfycbxUD72h2JmKfXDveNzQIRmegRbYnxPFqcbQNXW3LQT6Ir1QUok7ykJSd0ikqF9Hp3gReg/exec';

function loadSettings(): { spreadsheetUrl: string } {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const content = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && parsed.spreadsheetUrl) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading settings file:', e);
  }
  return { spreadsheetUrl: DEFAULT_SPREADSHEET_URL };
}

function saveSettings(data: { spreadsheetUrl: string }) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing settings file:', e);
  }
}

// -----------------------------------------------------------------------------
// API ROUTES
// -----------------------------------------------------------------------------

// Get and update Google Spreadsheet Webhook settings
app.get('/api/settings', (_req, res) => {
  res.json(loadSettings());
});

app.post('/api/settings', (req, res) => {
  const { spreadsheetUrl } = req.body;
  const current = loadSettings();
  current.spreadsheetUrl = typeof spreadsheetUrl === 'string' ? spreadsheetUrl.trim() : '';
  saveSettings(current);
  res.json({ success: true, settings: current });
});

// Get all recorded student assessments
app.get('/api/assessments', (_req, res) => {
  res.json(loadAssessments());
});

// Submit a single assessment
app.post('/api/assessments', async (req, res) => {
  try {
    const { nisn, studentName, studentClass, chapterId, category, score, timestamp } = req.body;

    if (!nisn) {
      return res.status(400).json({ error: 'NISN is required' });
    }

    const all = loadAssessments();
    if (!all[nisn]) {
      all[nisn] = {
        nisn,
        studentName: studentName || '',
        studentClass: studentClass || '',
        diagnosticScores: {},
        formativeScores: {},
        sumativeScores: {},
        updatedAt: new Date().toISOString()
      };
    }

    // Keep name & class up to date
    if (studentName) all[nisn].studentName = studentName;
    if (studentClass) all[nisn].studentClass = studentClass;

    const chId = Number(chapterId);

    // Save corresponding score category
    if (category === 'diagnostik' || category === 'diagnostic') {
      all[nisn].diagnosticScores[chId] = Number(score);
    } else if (category === 'formatif' || category === 'formative') {
      all[nisn].formativeScores[chId] = Number(score);
    } else if (category === 'sumatif' || category === 'sumative') {
      all[nisn].sumativeScores[chId] = Number(score);
    }
    all[nisn].updatedAt = new Date().toISOString();
    saveAssessments(all);

    // Forward to Google Spreadsheet if configured
    const settings = loadSettings();
    if (settings.spreadsheetUrl && settings.spreadsheetUrl.startsWith('http')) {
      const categoryName =
        category === 'diagnostik' ? 'Asesmen Awal / Diagnostik' :
        category === 'formatif' ? 'Asesmen Formatif (Latihan)' : 'Asesmen Sumatif (ANBK)';

      const sheetPayload = {
        timestamp: timestamp || new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
        nisn,
        nama: studentName || all[nisn].studentName,
        kelas: studentClass || all[nisn].studentClass,
        bab: chId,
        kategori: categoryName,
        skor: Number(score),
        status: Number(score) >= 78 ? 'Tuntas' : 'Remidi'
      };

      fetch(settings.spreadsheetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(sheetPayload)
      }).catch(err => {
        console.warn('Forwarding to spreadsheet notice:', err.message);
      });
    }

    return res.json({ success: true, record: all[nisn] });
  } catch (error) {
    console.error('Error submitting assessment:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Batch sync all recorded scores to Google Spreadsheet
app.post('/api/sync-spreadsheet', async (req, res) => {
  try {
    const settings = loadSettings();
    const targetUrl = req.body.spreadsheetUrl || settings.spreadsheetUrl;

    if (!targetUrl || !targetUrl.startsWith('http')) {
      return res.status(400).json({ error: 'URL Google Spreadsheet Webhook belum diatur' });
    }

    const all = loadAssessments();
    let sentCount = 0;

    for (const nisn of Object.keys(all)) {
      const student = all[nisn];
      // Diagnostik
      for (const chId of Object.keys(student.diagnosticScores || {})) {
        const score = student.diagnosticScores[chId];
        await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            timestamp: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
            nisn: student.nisn,
            nama: student.studentName,
            kelas: student.studentClass,
            bab: Number(chId),
            kategori: 'Asesmen Awal / Diagnostik',
            skor: Number(score),
            status: Number(score) >= 78 ? 'Tuntas' : 'Remidi'
          })
        }).catch(() => {});
        sentCount++;
      }
      // Formatif
      for (const chId of Object.keys(student.formativeScores || {})) {
        const score = student.formativeScores[chId];
        await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            timestamp: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
            nisn: student.nisn,
            nama: student.studentName,
            kelas: student.studentClass,
            bab: Number(chId),
            kategori: 'Asesmen Formatif (Latihan)',
            skor: Number(score),
            status: Number(score) >= 78 ? 'Tuntas' : 'Remidi'
          })
        }).catch(() => {});
        sentCount++;
      }
      // Sumatif
      for (const chId of Object.keys(student.sumativeScores || {})) {
        const score = student.sumativeScores[chId];
        await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            timestamp: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
            nisn: student.nisn,
            nama: student.studentName,
            kelas: student.studentClass,
            bab: Number(chId),
            kategori: 'Asesmen Sumatif (ANBK)',
            skor: Number(score),
            status: Number(score) >= 78 ? 'Tuntas' : 'Remidi'
          })
        }).catch(() => {});
        sentCount++;
      }
    }

    return res.json({ success: true, count: sentCount });
  } catch (error) {
    console.error('Error syncing to spreadsheet:', error);
    return res.status(500).json({ error: 'Gagal melakukan sinkronisasi massal' });
  }
});

// -----------------------------------------------------------------------------
// VITE INTEGRATION / SPA SERVING
// -----------------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: 3000 },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server MIZAN berjalan di http://localhost:${port}`);
  });
}

startServer();
