import React from 'react';
import { BookOpen, Plus, Trash2, AlertCircle, Clock } from 'lucide-react';
import { Course, FormErrors } from '../types';
import { JUST_GRADES } from '../constants';

interface SemesterCoursesCardProps {
  courses: Course[];
  errors: FormErrors;
  onAddCourse: () => void;
  onRemoveCourse: (id: string) => void;
  onUpdateCourse: (id: string, field: keyof Course, value: any) => void;
  onResetCourses: () => void;
  totalSemesterHours: number;
}

export const SemesterCoursesCard: React.FC<SemesterCoursesCardProps> = ({
  courses,
  errors,
  onAddCourse,
  onRemoveCourse,
  onUpdateCourse,
  onResetCourses,
  totalSemesterHours,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-[#eddcc4] p-4 sm:p-5 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#f4e8d8] mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#960112]/10 text-[#960112] flex items-center justify-center font-bold">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 leading-tight">
                مساقات الفصل الحالي
              </h2>
              <span className="text-[11px] font-bold bg-[#FFF9EF] text-[#960112] px-2 py-0.5 rounded-md border border-[#ecdac2]">
                {courses.length} مساقات
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              الساعات المعتمدة والعلامة المتوقعة لكل مساق
            </p>
          </div>
        </div>

        {/* Total Semester Hours Indicator */}
        <div className="flex items-center gap-1 px-2.5 py-1 bg-[#FFF9EF] border border-[#eddcc4] rounded-lg text-xs font-bold text-[#960112]">
          <Clock className="w-3.5 h-3.5 text-[#960112]" />
          <span>{totalSemesterHours} س.م</span>
        </div>
      </div>

      {errors.general && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errors.general}</span>
        </div>
      )}

      {/* Courses List */}
      <div className="space-y-3">
        {courses.map((course, index) => {
          const itemErrors = errors.courseErrors?.[course.id];
          return (
            <div
              key={course.id}
              className="bg-[#FFFDF9] hover:bg-white border border-[#eddcc4] rounded-xl p-3 sm:p-3.5 transition-all focus-within:border-[#960112] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#960112]/20"
            >
              {/* Row 1: Course Name + Delete Button */}
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-md bg-white border border-[#eddcc4] text-[#960112] font-bold text-xs flex items-center justify-center shrink-0">
                  {index + 1}
                </span>

                <input
                  type="text"
                  value={course.name}
                  onChange={(e) => onUpdateCourse(course.id, 'name', e.target.value)}
                  placeholder={`اسم المساق ${index + 1} (مثال: تفاضل، استاتيكا)`}
                  className="flex-1 h-10 px-3 rounded-lg border border-[#eddcc4] bg-white text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#960112] transition-colors"
                />

                <button
                  type="button"
                  onClick={() => onRemoveCourse(course.id)}
                  disabled={courses.length <= 1}
                  aria-label={`حذف المساق ${index + 1}`}
                  title={courses.length <= 1 ? 'لا يمكن حذف المساق الأخير' : 'حذف المساق'}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    courses.length <= 1
                      ? 'text-slate-300 cursor-not-allowed bg-slate-100'
                      : 'text-[#960112] hover:text-white bg-rose-50 hover:bg-[#960112] border border-rose-200/60 active:scale-95 cursor-pointer'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Row 2: Credit Hours (Only 1, 2, 3 as requested) + Grade Select */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    الساعات المعتمدة
                  </label>
                  <select
                    value={course.hours}
                    onChange={(e) =>
                      onUpdateCourse(course.id, 'hours', parseInt(e.target.value, 10))
                    }
                    className={`w-full h-11 px-3 rounded-lg border text-xs font-bold bg-white text-slate-800 outline-none cursor-pointer ${
                      itemErrors?.hours
                        ? 'border-rose-400 bg-rose-50/40 text-rose-700'
                        : 'border-[#eddcc4] hover:border-[#960112] focus:border-[#960112]'
                    }`}
                  >
                    <option value={1}>1 ساعة</option>
                    <option value={2}>2 ساعة</option>
                    <option value={3}>3 ساعات</option>
                  </select>
                  {itemErrors?.hours && (
                    <p className="text-[10px] text-rose-600 mt-0.5 flex items-center gap-0.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{itemErrors.hours}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    العلامة المتوقعة
                  </label>
                  <select
                    value={course.grade}
                    onChange={(e) => onUpdateCourse(course.id, 'grade', e.target.value)}
                    className={`w-full h-11 px-3 rounded-lg border text-xs font-bold outline-none cursor-pointer ${
                      !course.grade
                        ? itemErrors?.grade
                          ? 'border-rose-400 bg-rose-50/50 text-rose-700'
                          : 'border-amber-300 bg-amber-50/30 text-amber-900'
                        : 'border-[#eddcc4] bg-white text-[#960112] hover:border-[#960112] focus:border-[#960112]'
                    }`}
                  >
                    <option value="" disabled>
                      اختر العلامة
                    </option>
                    {JUST_GRADES.map((g) => (
                      <option key={g.symbol} value={g.symbol}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                  {itemErrors?.grade && (
                    <p className="text-[10px] text-rose-600 mt-0.5 flex items-center gap-0.5">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{itemErrors.grade}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-[#f4e8d8] flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={onAddCourse}
          className="w-full h-12 rounded-xl bg-[#FFF9EF] hover:bg-[#f6ebd7] border border-[#ecdac2] text-[#960112] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4 text-[#960112]" />
          <span>إضافة مساق جديد (Add Course)</span>
        </button>

        {courses.length > 4 && (
          <button
            type="button"
            onClick={onResetCourses}
            className="sm:w-auto h-11 px-3 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-[#FFF9EF] text-xs font-medium transition-colors cursor-pointer shrink-0"
          >
            إعادة لـ 4 مساقات
          </button>
        )}
      </div>
    </div>
  );
};
