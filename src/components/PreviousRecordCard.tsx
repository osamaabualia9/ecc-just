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
    <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-xs border border-[#eddcc4]/80 p-4 sm:p-5 mb-4 transition-all">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#eddcc4]/60 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#960112]/15 text-[#960112] flex items-center justify-center font-bold">
            <History className="w-4 h-4 text-[#960112]" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#960112] font-bukra leading-tight">
              البيانات الأكاديمية والتراكمية
            </h2>
            <p className="text-[11px] font-bold text-[#960112]/80">
              السجل الأكاديمي المكتمل حتى بداية الفصل الحالي
            </p>
          </div>
        </div>

        {/* Freshman Switch */}
        <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-[#960112] bg-[#FFF9EF]/80 hover:bg-[#FFF9EF] py-1.5 px-2.5 rounded-lg border border-[#eddcc4] select-none">
          <input
            type="checkbox"
            checked={isFreshman}
            onChange={(e) => onToggleFreshman(e.target.checked)}
            className="w-4 h-4 text-[#960112] rounded border-slate-300 focus:ring-0"
          />
          <span>طالب مستجد</span>
        </label>
      </div>

      {/* Student Name Input */}
      <div className="mb-3.5">
        <label className="block text-xs font-bold text-[#960112] mb-1 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-[#960112]" />
            <span>اسم الطالب (يظهر في كشف التقدير والشهادة)</span>
          </span>
          <span className="text-[10px] text-[#960112]/70 font-bold">اختياري</span>
        </label>
        <input
          type="text"
          value={studentName}
          onChange={(e) => onChangeStudentName(e.target.value)}
          placeholder="أدخل اسمك"
          className="w-full h-11 px-3.5 rounded-xl border border-[#eddcc4]/80 bg-white/50 focus:bg-white/80 text-xs font-bold text-[#960112] placeholder:text-[#960112]/40 focus:border-[#960112] focus:outline-none transition-colors"
        />
      </div>

      {isFreshman ? (
        <div className="p-3 bg-[#FFF9EF]/80 border border-[#ecdac2] rounded-xl text-xs text-[#960112] font-bold flex items-start gap-2">
          <UserCheck className="w-4 h-4 text-[#960112] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-[#960112] mb-0.5">نظام الطالب المستجد:</p>
            <p className="text-[#960112]/90 text-[11.5px] font-bold leading-relaxed">
              سيتم اعتماد معدل الفصل الحالي كمعدل تراكمي لك، دون الحاجة لاحتساب ساعات سابقة.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Previous CGPA */}
          <div>
            <label className="block text-xs font-bold text-[#960112] mb-1.5 flex items-center justify-between">
              <span>المعدل التراكمي السابق (من 4.20)</span>
              <span className="text-[10px] text-[#960112]/70 font-bold">مثال: 3.15</span>
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
                placeholder="0.00 - 4.20"
                className={`w-full h-12 px-3.5 rounded-xl border text-sm font-bold transition-all outline-none text-[#960112] placeholder:text-[#960112]/40 ${
                  errors.previousGpa
                    ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500'
                    : 'border-[#eddcc4]/80 bg-white/50 hover:border-[#960112] focus:bg-white/80 focus:border-[#960112] focus:ring-1 focus:ring-[#960112]'
                }`}
              />
            </div>
            {errors.previousGpa && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-bold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.previousGpa}</span>
              </p>
            )}
          </div>

          {/* Previous Hours */}
          <div>
            <label className="block text-xs font-bold text-[#960112] mb-1.5 flex items-center justify-between">
              <span>الساعات المقطوعة والناجحة</span>
              <span className="text-[10px] text-[#960112]/70 font-bold">مثال: 45</span>
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
                placeholder="عدد الساعات المنجزة"
                className={`w-full h-12 px-3.5 rounded-xl border text-sm font-bold transition-all outline-none text-[#960112] placeholder:text-[#960112]/40 ${
                  errors.previousHours
                    ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500'
                    : 'border-[#eddcc4]/80 bg-white/50 hover:border-[#960112] focus:bg-white/80 focus:border-[#960112] focus:ring-1 focus:ring-[#960112]'
                }`}
              />
            </div>
            {errors.previousHours && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-bold">
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
