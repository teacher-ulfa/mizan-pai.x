import React, { useState } from 'react';
import { parseStudentImportText } from '../data/studentsData';
import { TAUGHT_CLASSES } from '../data/schoolData';
import { StudentUser } from '../types';
import { Upload, FileSpreadsheet, Check, AlertCircle, X, Users } from 'lucide-react';

interface ImportStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newStudents: StudentUser[]) => void;
}

export const ImportStudentsModal: React.FC<ImportStudentsModalProps> = ({
  isOpen,
  onClose,
  onImport
}) => {
  const [inputText, setInputText] = useState('');
  const [targetClass, setTargetClass] = useState('X-1');
  const [previewList, setPreviewList] = useState<StudentUser[]>([]);

  if (!isOpen) return null;

  const handleParse = (text: string, cls: string) => {
    setInputText(text);
    if (text.trim()) {
      const parsed = parseStudentImportText(text, cls);
      setPreviewList(parsed);
    } else {
      setPreviewList([]);
    }
  };

  const handleApply = () => {
    if (previewList.length > 0) {
      onImport(previewList);
      onClose();
    }
  };

  const sampleExample = `0081234510\tAhmad Fikri\tX-1\tL
0081234511\tAlya Nabila\tX-1\tP
0081234512\tBambang Pamungkas\tX-1\tL
0081234513\tCantika Putri\tX-1\tP`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-emerald-800">
            <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-lg text-slate-900 font-serif">
              Impor Data Siswa Kelas X SMAN 1 Krembung
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto py-4 space-y-4 flex-1 pr-1 text-xs">
          <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-emerald-950 space-y-1">
            <span className="font-bold block text-emerald-900">Petunjuk Format Data:</span>
            <p className="text-slate-600">
              Salin (Copy) langsung dari <strong>Microsoft Excel</strong>, <strong>Google Sheets</strong>, atau ketikkan daftar nama siswa per baris.
            </p>
            <p className="text-slate-500 font-mono text-[11px]">
              Format: NISN [tab/koma] Nama Siswa [tab/koma] Kelas [tab/koma] L/P
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <label className="font-semibold text-slate-700">Pilih Kelas Default:</label>
            <select
              value={targetClass}
              onChange={(e) => {
                setTargetClass(e.target.value);
                handleParse(inputText, e.target.value);
              }}
              className="p-2 border border-slate-300 rounded-lg bg-white text-xs font-semibold"
            >
              {TAUGHT_CLASSES.map(c => (
                <option key={c} value={c}>Kelas {c}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => handleParse(sampleExample, targetClass)}
              className="text-[11px] text-emerald-700 hover:underline font-medium"
            >
              + Gunakan Contoh Format
            </button>
          </div>

          <div>
            <textarea
              rows={6}
              value={inputText}
              onChange={(e) => handleParse(e.target.value, targetClass)}
              placeholder="Paste data siswa di sini..."
              className="w-full p-3 font-mono text-xs border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            />
          </div>

          {/* Preview Table */}
          {previewList.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-700" />
                  <span>Pratinjau Hasil Pembacaan ({previewList.length} Siswa Terdeteksi):</span>
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 sticky top-0 font-bold text-slate-700">
                    <tr>
                      <th className="py-2 px-3 border-b">No</th>
                      <th className="py-2 px-3 border-b">NISN</th>
                      <th className="py-2 px-3 border-b">Nama Siswa</th>
                      <th className="py-2 px-3 border-b">Kelas</th>
                      <th className="py-2 px-3 border-b text-center">L/P</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewList.map((st, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-1.5 px-3 text-slate-400">{i + 1}</td>
                        <td className="py-1.5 px-3 font-mono text-[11px]">{st.nisn}</td>
                        <td className="py-1.5 px-3 font-semibold text-slate-900">{st.name}</td>
                        <td className="py-1.5 px-3 text-emerald-800 font-bold">{st.studentClass}</td>
                        <td className="py-1.5 px-3 text-center">{st.gender}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={previewList.length === 0}
            onClick={handleApply}
            className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Simpan {previewList.length} Siswa ke Database</span>
          </button>
        </div>
      </div>
    </div>
  );
};
