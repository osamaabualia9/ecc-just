import React from 'react';
import { Award, X, Info } from 'lucide-react';
import { JUST_GRADES, STANDINGS } from '../constants';

interface GradeScaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GradeScaleModal: React.FC<GradeScaleModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#FFFDF9] w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#eddcc4] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#960112] text-white p-4 flex items-center justify-between shrink-0 border-b border-[#7d010f]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-300">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">سلم علامات ونقاط المعدل</h3>
              <p className="text-[11px] text-amber-200">نظام النقاط المعتمد (من 4.20)</p>
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

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Standing Ranges */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2">
              تصنيف المعدل التراكمي العام:
            </h4>
            <div className="grid grid-cols-1 gap-1.5">
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-300">
                <span className="font-bold text-emerald-900">3.65 - 4.20</span>
                <span className="font-bold text-emerald-950">ممتاز (مرتبة الشرف)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 border border-[#EAA313]">
                <span className="font-bold text-amber-900">3.00 - 3.64</span>
                <span className="font-bold text-amber-950">جيد جداً</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#FFF9EF] border border-[#eddcc4]">
                <span className="font-bold text-slate-800">2.50 - 2.99</span>
                <span className="font-bold text-slate-900">جيد</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-orange-50 border border-orange-300">
                <span className="font-bold text-orange-900">2.00 - 2.49</span>
                <span className="font-bold text-orange-950">مقبول (الحد الأدنى للاستمرار)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50 border border-rose-300">
                <span className="font-bold text-rose-900">أقل من 2.00</span>
                <span className="font-bold text-rose-950">ضعيف (إنذار أكاديمي)</span>
              </div>
            </div>
          </div>

          {/* Grades Table */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2">جدول الرموز وأوزان النقاط:</h4>
            <div className="border border-[#eddcc4] rounded-xl overflow-hidden bg-white shadow-xs">
              <table className="w-full text-center">
                <thead className="bg-[#FFF9EF] text-slate-700 font-bold text-[11px] border-b border-[#eddcc4]">
                  <tr>
                    <th className="py-2 px-3 text-right">الرمز</th>
                    <th className="py-2 px-3">النقاط (Weight)</th>
                    <th className="py-2 px-3 text-left">التصنيف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4e8d8]">
                  {JUST_GRADES.map((g) => (
                    <tr key={g.symbol} className="hover:bg-[#FFF9EF]/40">
                      <td className="py-2 px-3 text-right font-bold text-slate-900">
                        {g.symbol}
                      </td>
                      <td className="py-2 px-3 font-bold text-[#960112] tabular-nums">
                        {g.points.toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-left text-[11px] text-slate-600">
                        {g.points === 0 ? (
                          <span className="text-rose-700 font-bold">راسب</span>
                        ) : g.points >= 3.75 ? (
                          <span className="text-emerald-800 font-bold">مرتفع</span>
                        ) : (
                          'ناجح'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3 bg-[#FFF9EF] border border-[#eddcc4] rounded-xl text-slate-700 text-[11px] leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-[#960112] shrink-0 mt-0.5" />
            <p>
              تُحسب نقاط المساق بضرب عدد ساعاته المعتمدة في وزن الرمز، ويقسم مجموع نقاط كافة المساقات على مجموع الساعات المقطوعة.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#FFF9EF] border-t border-[#eddcc4] text-center shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-11 rounded-xl bg-[#960112] hover:bg-[#7e010f] text-white font-bold cursor-pointer text-xs"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
