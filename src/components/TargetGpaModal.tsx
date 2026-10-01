import React, { useState } from 'react';
import { Target, X, Calculator, AlertCircle, CheckCircle2 } from 'lucide-react';
import { calculateRequiredSemesterGpa } from '../utils/calculator';

interface TargetGpaModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCurrentGpa?: string;
  defaultCompletedHours?: string;
}

export const TargetGpaModal: React.FC<TargetGpaModalProps> = ({
  isOpen,
  onClose,
  defaultCurrentGpa = '',
  defaultCompletedHours = '',
}) => {
  const [currentGpa, setCurrentGpa] = useState(defaultCurrentGpa || '');
  const [completedHours, setCompletedHours] = useState(defaultCompletedHours || '');
  const [targetGpa, setTargetGpa] = useState('');
  const [semesterHours, setSemesterHours] = useState('15');
  const [result, setResult] = useState<{
    requiredSemesterGpa: number;
    isPossible: boolean;
    message: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const curG = parseFloat(currentGpa);
    const compH = parseInt(completedHours, 10);
    const tarG = parseFloat(targetGpa);
    const semH = parseInt(semesterHours, 10);

    if (isNaN(curG) || curG < 0 || curG > 4.2) {
      setError('يرجى إدخال المعدل التراكمي الحالي بين 0.00 و 4.20');
      return;
    }
    if (isNaN(compH) || compH <= 0) {
      setError('يرجى إدخال عدد الساعات المقطوعة بشكل صحيح (أكبر من صفر)');
      return;
    }
    if (isNaN(tarG) || tarG < 0 || tarG > 4.2) {
      setError('يرجى إدخال المعدل المستهدف بين 0.00 و 4.20');
      return;
    }
    if (isNaN(semH) || semH <= 0) {
      setError('يرجى إدخال عدد ساعات الفصل القادم');
      return;
    }

    const res = calculateRequiredSemesterGpa({
      currentGpa: curG,
      completedHours: compH,
      desiredCgpa: tarG,
      upcomingHours: semH,
    });
    setResult(res);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#FFFDF9] w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#eddcc4] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#960112] text-white p-4 flex items-center justify-between shrink-0 border-b border-[#7d010f]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-300">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">تخطيط المعدل المستهدف</h3>
              <p className="text-[11px] text-amber-200">
                حساب المعدل الفصلي المطلوب لتحقيق هدفك
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleCalculate} className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                المعدل التراكمي الحالي
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4.20"
                value={currentGpa}
                onChange={(e) => setCurrentGpa(e.target.value)}
                placeholder="مثال: 2.85"
                className="w-full h-11 px-3 rounded-lg border border-[#eddcc4] bg-white text-xs font-bold text-slate-900 focus:border-[#960112] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                الساعات المقطوعة سابقاً
              </label>
              <input
                type="number"
                step="1"
                min="1"
                value={completedHours}
                onChange={(e) => setCompletedHours(e.target.value)}
                placeholder="مثال: 45"
                className="w-full h-11 px-3 rounded-lg border border-[#eddcc4] bg-white text-xs font-bold text-slate-900 focus:border-[#960112] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                المعدل التراكمي المستهدف
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4.20"
                value={targetGpa}
                onChange={(e) => setTargetGpa(e.target.value)}
                placeholder="مثال: 3.00"
                className="w-full h-11 px-3 rounded-lg border-2 border-[#EAA313] bg-[#FFF9EF] text-xs font-bold text-[#960112] focus:border-[#960112] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                ساعات الفصل القادم
              </label>
              <input
                type="number"
                step="1"
                min="1"
                max="24"
                value={semesterHours}
                onChange={(e) => setSemesterHours(e.target.value)}
                placeholder="مثال: 15"
                className="w-full h-11 px-3 rounded-lg border border-[#eddcc4] bg-white text-xs font-bold text-slate-900 focus:border-[#960112] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-[#960112] hover:bg-[#7e010f] text-white font-bold flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-xs"
          >
            <Calculator className="w-4 h-4 text-amber-300" />
            <span>احتساب المعدل الفصلي المطلوب</span>
          </button>

          {/* Result Box */}
          {result && (
            <div
              className={`p-3.5 rounded-xl border ${
                result.isPossible
                  ? 'bg-[#FFF9EF] border-[#EAA313] text-slate-900'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5 font-bold">
                {result.isPossible ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                )}
                <span className={result.isPossible ? 'text-[#960112]' : 'text-rose-900'}>
                  {result.isPossible
                    ? `المعدل الفصلي المطلوب: ${result.requiredSemesterGpa.toFixed(2)}`
                    : 'الهدف يتطلب خطة ممتدة'}
                </span>
              </div>
              <p className="text-[11.5px] leading-relaxed text-slate-700">{result.message}</p>
            </div>
          )}
        </form>

        <div className="p-3 bg-[#FFF9EF] border-t border-[#eddcc4] text-center shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-10 rounded-xl bg-white border border-[#eddcc4] hover:bg-[#FFFDF9] text-slate-800 font-bold cursor-pointer text-xs"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
