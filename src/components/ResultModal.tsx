import React, { useState } from 'react';
import {
  FileText,
  Copy,
  CheckCircle2,
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  BookOpen,
  ShieldCheck,
} from 'lucide-react';
import { CalculationResult } from '../types';
import { formatResultShareText } from '../utils/calculator';
import { getStanding } from '../constants';
import { EngineeringLogo } from './EngineeringLogo';

interface ResultModalProps {
  result: CalculationResult | null;
  onClose: () => void;
  onViewCertificate: () => void;
  isFreshman: boolean;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  result,
  onClose,
  onViewCertificate,
  isFreshman,
}) => {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const handleCopy = async () => {
    try {
      const text = formatResultShareText(result);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {}
  };

  const semStanding = getStanding(result.semesterGpa);
  const cumStanding = getStanding(result.newCumulativeGpa);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#FFFDF9] w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#eddcc4] overflow-hidden max-h-[92vh] flex flex-col font-bold">
        {/* Header with #960112 and Engineering Logo */}
        <div className="bg-[#960112] text-white p-4 sm:p-5 flex items-center justify-between shrink-0 border-b border-[#7d010f]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFF9EF] p-1 flex items-center justify-center shadow-xs shrink-0">
              <EngineeringLogo className="w-full h-full" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight font-bukra">نتيجة احتساب المعدل</h3>
              <p className="text-xs text-amber-200 font-bukra">
                لجنة كلية الهندسة
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Main 2-Column Result Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Semester GPA */}
            <div className="bg-white border border-[#eddcc4] rounded-2xl p-3.5 text-center flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-[11px] font-bold text-[#960112] block mb-0.5">
                  المعدل الفصلي
                </span>
                <div className="text-3xl font-black text-[#960112] tabular-nums tracking-tight font-bukra">
                  {result.semesterGpa.toFixed(2)}
                </div>
                <div className="text-[10px] text-[#960112]/60 mt-0.5 font-bold">من 4.20</div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-[#f4e8d8]">
                <span
                  className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${semStanding.badgeBg}`}
                >
                  {result.semesterStanding}
                </span>
                <p className="text-[10px] text-[#960112]/80 mt-1 font-bold">
                  {result.semesterHours} ساعات مسجلة
                </p>
              </div>
            </div>

            {/* Cumulative GPA */}
            <div className="bg-white border-2 border-[#EAA313] rounded-2xl p-3.5 text-center flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-[11px] font-black text-[#960112] block mb-0.5">
                  المعدل التراكمي الجديد
                </span>
                <div className="text-3xl font-black text-[#960112] tabular-nums tracking-tight font-bukra">
                  {result.newCumulativeGpa.toFixed(2)}
                </div>
                <div className="text-[10px] text-[#EAA313] mt-0.5 font-bold">من 4.20</div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-[#f4e8d8]">
                <span
                  className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${cumStanding.badgeBg}`}
                >
                  {result.newCumulativeStanding}
                </span>

                {result.gpaChange !== null && !isFreshman ? (
                  <div className="flex items-center justify-center gap-1 mt-1 text-[11px] font-bold">
                    {result.gpaChange > 0 ? (
                      <span className="text-emerald-700 flex items-center">
                        <TrendingUp className="w-3 h-3 ml-0.5" />
                        +{result.gpaChange.toFixed(2)}
                      </span>
                    ) : result.gpaChange < 0 ? (
                      <span className="text-rose-600 flex items-center">
                        <TrendingDown className="w-3 h-3 ml-0.5" />
                        {result.gpaChange.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-slate-500 flex items-center">
                        <Minus className="w-3 h-3 ml-0.5" />
                        بدون تغيير
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-[10px] text-[#960112]/80 mt-1 font-bold">
                    {result.totalCumulativeHours} ساعة إجمالية
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Academic Evaluation Remark */}
          <div className="p-3.5 rounded-xl bg-white border border-[#eddcc4] text-[#960112] text-xs flex items-start gap-2.5 shadow-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-[#960112] shrink-0 mt-0.5" />
            <div>
              <span className="font-black text-[#960112] block mb-0.5 font-bukra">التقييم الأكاديمي:</span>
              <p className="text-[12px] text-[#960112]/90 leading-relaxed font-bold">
                {result.academicRemark}
              </p>
            </div>
          </div>

          {/* Courses Detailed Table */}
          <div>
            <h4 className="text-xs font-bold text-[#960112] mb-2 flex items-center gap-1.5 font-bukra">
              <BookOpen className="w-3.5 h-3.5 text-[#960112]" />
              <span>تفاصيل مساقات الفصل المحتسبة:</span>
            </h4>
            <div className="border border-[#eddcc4] rounded-xl overflow-hidden text-xs bg-white shadow-xs">
              <table className="w-full text-right font-bold">
                <thead className="bg-[#FFF9EF] text-[#960112] font-black text-[11px] border-b border-[#eddcc4] font-bukra">
                  <tr>
                    <th className="py-2.5 px-3">المساق</th>
                    <th className="py-2.5 px-2 text-center">الساعات</th>
                    <th className="py-2.5 px-2 text-center">العلامة</th>
                    <th className="py-2.5 px-3 text-left">النقاط</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4e8d8] bg-white">
                  {result.coursesBreakdown.map((c) => (
                    <tr key={c.id} className="hover:bg-[#FFF9EF]/40">
                      <td className="py-2.5 px-3 font-bold text-[#960112] max-w-[130px] truncate">
                        {c.name}
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-[#960112] tabular-nums">
                        {c.hours}
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-[#960112]">
                        {c.gradeSymbol}
                        <span className="text-[10px] font-bold text-[#960112]/60 mr-1">
                          ({c.gradePoints})
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-left font-black text-[#960112] tabular-nums">
                        {c.totalPoints.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#FFF9EF] border-t border-[#eddcc4] flex flex-col sm:flex-row gap-2 shrink-0">
          <button
            type="button"
            onClick={onViewCertificate}
            className="w-full sm:flex-1 h-12 rounded-xl bg-[#960112] hover:bg-[#7e010f] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer shadow-sm font-bukra"
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span>عرض وتحميل الشهادة (Certificate)</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="w-full sm:w-auto h-12 px-4 rounded-xl border border-[#eddcc4] hover:bg-white text-[#960112] text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-bukra"
          >
            {copied ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>{copied ? 'تم النسخ' : 'نسخ الكشف'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
