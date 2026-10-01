import React from 'react';
import { History, User, AlertCircle, UserCheck } from 'lucide-react';
import { FormErrors } from '../types';

interface PreviousRecordCardProps {
  studentName: string;
  previousGpa: string;
  previousHours: string;
  isFreshman: boolean;
  errors: FormErrors;
  onChangeStudentName: (val: string) => void;
  onChangePreviousGpa: (val: string) => void;
  onChangePreviousHours: (val: string) => void;
  onToggleFreshman: (isFreshman: boolean) => void;
}

export const PreviousRecordCard: React.FC<PreviousRecordCardProps> = ({
  studentName,
  previousGpa,
  previousHours,
  isFreshman,
  errors,
  onChangeStudentName,
  onChangePreviousGpa,
  onChangePreviousHours,
  onToggleFreshman,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-[#eddcc4] p-4 sm:p-5 transition-all">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#f4e8d8] mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#960112]/10 text-[#960112] flex items-center justify-center font-bold">
            <History className="w-4 h-4 text-[#960112]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">
              البيانات الأكاديمية والتراكمية
            </h2>
            <p className="text-[11px] text-slate-500">
              السجل الأكاديمي المكتمل حتى بداية الفصل الحالي
            </p>
          </div>
        </div>

        {/* Freshman Switch */}
        <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-700 bg-[#FFF9EF] hover:bg-[#f6ebd7] py-1.5 px-2.5 rounded-lg border border-[#eddcc4] select-none">
          <input
            type="checkbox"
            checked={isFreshman}
            onChange={(e) => onToggleFreshman(e.target.checked)}
            className="w-4 h-4 text-[#960112] rounded border-slate-300 focus:ring-0"
          />
          <span>طالب مستجد (سنة أولى)</span>
        </label>
      </div>

      {/* Student Name Input */}
      <div className="mb-3.5">
        <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>اسم الطالب (يظهر في كشف التقدير والشهادة)</span>
          </span>
          <span className="text-[10px] text-slate-400 font-normal">اختياري</span>
        </label>
        <input
          type="text"
          value={studentName}
          onChange={(e) => onChangeStudentName(e.target.value)}
          placeholder="أدخل اسمك"
          className="w-full h-11 px-3.5 rounded-xl border border-[#eddcc4] bg-[#FFFDF9] text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#960112] focus:bg-white focus:outline-none transition-colors"
        />
      </div>

      {isFreshman ? (
        <div className="p-3 bg-[#FFF9EF] border border-[#ecdac2] rounded-xl text-xs text-slate-800 flex items-start gap-2">
          <UserCheck className="w-4 h-4 text-[#960112] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-[#960112] mb-0.5">نظام الطالب المستجد:</p>
            <p className="text-slate-700 text-[11.5px] leading-relaxed">
              سيتم اعتماد معدل الفصل الحالي كمعدل تراكمي لك، دون الحاجة لاحتساب ساعات سابقة.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Previous CGPA */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>المعدل التراكمي السابق (من 4.20)</span>
              <span className="text-[10px] text-slate-400 font-normal">مثال: 3.15</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                max="4.20"
                inputMode="decimal"
                value={previousGpa}
                onChange={(e) => onChangePreviousGpa(e.target.value)}
                placeholder="أدخل معدلك السابق (0.00 - 4.20)"
                className={`w-full h-12 px-3.5 rounded-xl border text-sm font-bold transition-all outline-none text-slate-800 placeholder:text-slate-400 ${
                  errors.previousGpa
                    ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                    : 'border-[#eddcc4] bg-[#FFFDF9] hover:border-[#960112] focus:bg-white focus:border-[#960112] focus:ring-1 focus:ring-[#960112]'
                }`}
              />
            </div>
            {errors.previousGpa && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.previousGpa}</span>
              </p>
            )}
          </div>

          {/* Previous Hours */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>الساعات المقطوعة والناجحة</span>
              <span className="text-[10px] text-slate-400 font-normal">مثال: 45</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="1"
                min="0"
                max="300"
                inputMode="numeric"
                value={previousHours}
                onChange={(e) => onChangePreviousHours(e.target.value)}
                placeholder="عدد الساعات المنجزة (مثال: 48)"
                className={`w-full h-12 px-3.5 rounded-xl border text-sm font-bold transition-all outline-none text-slate-800 placeholder:text-slate-400 ${
                  errors.previousHours
                    ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                    : 'border-[#eddcc4] bg-[#FFFDF9] hover:border-[#960112] focus:bg-white focus:border-[#960112] focus:ring-1 focus:ring-[#960112]'
                }`}
              />
            </div>
            {errors.previousHours && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.previousHours}</span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
