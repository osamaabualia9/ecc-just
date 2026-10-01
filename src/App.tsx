import React, { useState, useEffect } from 'react';
import {
  Calculator,
  RotateCcw,
  Info,
  FileText,
  ArrowRight,
  Printer,
} from 'lucide-react';
import { Header, ActiveTab } from './components/Header';
import { SemesterCoursesCard } from './components/SemesterCoursesCard';
import { PreviousRecordCard } from './components/PreviousRecordCard';
import { CertificateCard } from './components/CertificateCard';
import { ResultModal } from './components/ResultModal';
import { Course, FormErrors, CalculationResult } from './types';
import { DEFAULT_COURSES } from './constants';
import { validateInputs, calculateGpa } from './utils/calculator';
import { EngineeringLogo } from './components/EngineeringLogo';

const STORAGE_KEY = 'just_engineering_gpa_calc_v7';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('calculator');

  const [studentName, setStudentName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.studentName ?? '';
      }
    } catch (e) {}
    return '';
  });

  const [previousGpa, setPreviousGpa] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.previousGpa ?? '';
      }
    } catch (e) {}
    return '';
  });

  const [previousHours, setPreviousHours] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.previousHours ?? '';
      }
    } catch (e) {}
    return '';
  });

  const [isFreshman, setIsFreshman] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Boolean(parsed.isFreshman);
      }
    } catch (e) {}
    return false;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.courses) && parsed.courses.length > 0) {
          return parsed.courses.map((c: Course) => ({
            ...c,
            hours: c.hours > 3 ? 3 : c.hours || 3,
          }));
        }
      }
    } catch (e) {}
    return DEFAULT_COURSES;
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<CalculationResult | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.result) {
          return parsed.result;
        }
      }
    } catch (e) {}
    return null;
  });

  const [showResultModal, setShowResultModal] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      const dataToSave = {
        studentName,
        previousGpa,
        previousHours,
        isFreshman,
        courses,
        result,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {}
  }, [studentName, previousGpa, previousHours, isFreshman, courses, result]);

  // Course handlers
  const handleAddCourse = () => {
    const newCourse: Course = {
      id: `course-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: '',
      hours: 3,
      grade: '',
    };
    setCourses((prev) => [...prev, newCourse]);
  };

  const handleRemoveCourse = (id: string) => {
    if (courses.length <= 1) return;
    setCourses((prev) => prev.filter((c) => c.id !== id));
    if (errors.courseErrors?.[id]) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        if (nextErrors.courseErrors) {
          const updated = { ...nextErrors.courseErrors };
          delete updated[id];
          nextErrors.courseErrors = updated;
        }
        return nextErrors;
      });
    }
  };

  const handleUpdateCourse = (id: string, field: keyof Course, value: any) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
    if (errors.courseErrors?.[id]) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        if (nextErrors.courseErrors?.[id]) {
          const updatedCourseErr = { ...nextErrors.courseErrors[id] };
          if (field === 'hours') delete updatedCourseErr.hours;
          if (field === 'grade') delete updatedCourseErr.grade;

          if (Object.keys(updatedCourseErr).length === 0) {
            const nextCourseErrors = { ...nextErrors.courseErrors };
            delete nextCourseErrors[id];
            nextErrors.courseErrors = nextCourseErrors;
          } else {
            nextErrors.courseErrors = {
              ...nextErrors.courseErrors,
              [id]: updatedCourseErr,
            };
          }
        }
        return nextErrors;
      });
    }
  };

  const handleResetCourses = () => {
    setCourses([
      { id: 'course-1', name: '', hours: 3, grade: '' },
      { id: 'course-2', name: '', hours: 3, grade: '' },
      { id: 'course-3', name: '', hours: 3, grade: '' },
      { id: 'course-4', name: '', hours: 3, grade: '' },
    ]);
    setErrors({});
  };

  const handleFullReset = () => {
    if (
      window.confirm(
        'هل ترغب في تفريغ كافة الحقول ومسح البيانات المحفوظة؟'
      )
    ) {
      setStudentName('');
      setPreviousGpa('');
      setPreviousHours('');
      setIsFreshman(false);
      setCourses([
        { id: 'course-1', name: '', hours: 3, grade: '' },
        { id: 'course-2', name: '', hours: 3, grade: '' },
        { id: 'course-3', name: '', hours: 3, grade: '' },
        { id: 'course-4', name: '', hours: 3, grade: '' },
      ]);
      setErrors({});
      setResult(null);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
    }
  };

  const computeGpaInternal = (): CalculationResult | null => {
    const validation = validateInputs({
      studentName,
      previousGpa,
      previousHours,
      isFreshman,
      courses,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return null;
    }

    setErrors({});
    const calcResult = calculateGpa({
      studentName,
      previousGpa,
      previousHours,
      isFreshman,
      courses,
    });

    setResult(calcResult);
    return calcResult;
  };

  const handleCalculate = () => {
    const calcResult = computeGpaInternal();
    if (calcResult) {
      setShowResultModal(true);
    }
  };

  const handlePrint = () => {
    let currentResult = result;
    if (!currentResult) {
      currentResult = computeGpaInternal();
    }

    if (!currentResult) {
      alert('يرجى تحديد الساعات والعلامات أولاً لاحتساب وطباعة الكشف.');
      return;
    }

    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleUpdateStudentNameInCertificate = (newName: string) => {
    setStudentName(newName);
    if (result) {
      setResult({
        ...result,
        studentName: newName,
      });
    }
  };

  const totalSemesterHours = courses.reduce(
    (acc, curr) => acc + (Number(curr.hours) || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#FFF9EF] flex flex-col font-sans text-[#960112] font-bold relative selection:bg-[#960112] selection:text-white">
      {/* ======================================================== */}
      {/* الشعار الموجود بالخلفية (BACKGROUND LOGO WATERMARK) */}
      {/* مكان تعديل الموقع: غيّر translate-x (يمين/يسار) أو translate-y (فوق/تحت) */}
      {/* لتعديل الشفافية: غيّر opacity-[0.38] */}
      {/* لتعديل الحجم: غيّر w-[480px] h-[480px] */}
      {/* ======================================================== */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden no-print">
        <div className="opacity-[0.38] w-[480px] h-[480px] sm:w-[640px] sm:h-[640px] max-w-[90vw] translate-x-3 sm:translate-x-12 drop-shadow-sm transition-transform">
          <EngineeringLogo className="w-full h-full" showText={true} />
        </div>
      </div>

      {/* Sticky Header */}
      <Header
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab)}
        hasResult={result !== null}
        onPrint={handlePrint}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-xl w-full mx-auto px-3.5 sm:px-4 py-4 pb-32 sm:pb-36 relative z-10">
        {/* Certificate View Tab */}
        {activeTab === 'certificate' ? (
          <div>
            <div className="flex items-center justify-between mb-3 no-print">
              <button
                type="button"
                onClick={() => setActiveTab('calculator')}
                className="flex items-center gap-1.5 text-xs font-bold text-[#960112] hover:underline cursor-pointer font-bukra"
              >
                <ArrowRight className="w-4 h-4" />
                <span>العودة إلى حاسبة المساقات</span>
              </button>
            </div>

            {result ? (
              <CertificateCard
                result={result}
                onUpdateStudentName={handleUpdateStudentNameInCertificate}
              />
            ) : (
              <div className="bg-white/45 backdrop-blur-md rounded-2xl p-7 text-center border border-[#eddcc4]/80 shadow-xs space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF9EF]/80 p-2 flex items-center justify-center mx-auto border border-[#eddcc4]">
                  <EngineeringLogo className="w-full h-full" />
                </div>
                <h3 className="text-base font-bold text-[#960112] font-bukra">
                  لم يتم احتساب المعدل بعد
                </h3>
                <p className="text-xs text-[#960112]/80 max-w-sm mx-auto leading-relaxed font-bold">
                  يرجى إدخال المساقات والعلامات أولاً في شاشة الحاسبة والضغط على زر "احسب المعدل" لإصدار كشف التقدير والشهادة المعتمدة من لجنة كلية الهندسة.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('calculator')}
                    className="h-10 px-5 rounded-xl bg-[#960112] text-white text-xs font-bold hover:bg-[#7e010f] transition-colors cursor-pointer font-bukra"
                  >
                    الانتقال للحاسبة
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Calculator View Tab (الواجهة الأساسية) */
          <div>
            {/* Quick Result Jump if already calculated */}
            {result && (
              <div className="mb-4 p-3 bg-white/60 backdrop-blur-xs border border-[#EAA313] rounded-xl flex items-center justify-between text-xs shadow-xs no-print">
                <div className="flex items-center gap-2 text-[#960112] font-bold">
                  <FileText className="w-4 h-4 text-[#960112]" />
                  <span>
                    المعدل المحسوب: {result.newCumulativeGpa.toFixed(2)} ({result.newCumulativeStanding})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('certificate')}
                  className="font-bold text-[#960112] hover:underline cursor-pointer bg-[#FFF9EF]/90 px-2.5 py-1 rounded-md border border-[#eddcc4] font-bukra"
                >
                  عرض الشهادة
                </button>
              </div>
            )}

            {/* SECTION 1: Current Semester Courses (مواد الفصل الحالي أولاً) */}
            <div className="no-print">
              <SemesterCoursesCard
                courses={courses}
                errors={errors}
                onAddCourse={handleAddCourse}
                onRemoveCourse={handleRemoveCourse}
                onUpdateCourse={handleUpdateCourse}
                onResetCourses={handleResetCourses}
                totalSemesterHours={totalSemesterHours}
              />
            </div>

            {/* SECTION 2: Previous Academic Record (البيانات الأكاديمية والتراكمية ثانياً) */}
            <div className="mb-4 no-print">
              <PreviousRecordCard
                studentName={studentName}
                previousGpa={previousGpa}
                previousHours={previousHours}
                isFreshman={isFreshman}
                errors={errors}
                onChangeStudentName={setStudentName}
                onChangePreviousGpa={(val) => {
                  setPreviousGpa(val);
                  if (errors.previousGpa) {
                    setErrors((prev) => ({ ...prev, previousGpa: undefined }));
                  }
                }}
                onChangePreviousHours={(val) => {
                  setPreviousHours(val);
                  if (errors.previousHours) {
                    setErrors((prev) => ({ ...prev, previousHours: undefined }));
                  }
                }}
                onToggleFreshman={(freshmanVal) => {
                  setIsFreshman(freshmanVal);
                  if (freshmanVal) {
                    setErrors((prev) => ({
                      ...prev,
                      previousGpa: undefined,
                      previousHours: undefined,
                    }));
                  }
                }}
              />
            </div>

            {/* Academic Notes */}
            <div className="bg-white/40 backdrop-blur-md border border-[#eddcc4]/80 rounded-2xl p-3.5 text-xs text-[#960112] space-y-1.5 shadow-xs no-print font-bold">
              <div className="flex items-center gap-1.5 font-bold text-[#960112] font-bukra">
                <Info className="w-4 h-4 text-[#960112]" />
                <span>تعليمات احتساب المعدل - لجنة كلية الهندسة:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11.5px] leading-relaxed text-[#960112]/85 pr-1 font-bold">
                <li>
                  العلامة A+ تعادل <strong>4.20 نقطة</strong>، و A تعادل <strong>4.00</strong>.
                </li>
                <li>
                  الحد الأدنى للمعدل التراكمي للاستمرار دون إنذار أكاديمي هو <strong>2.00 نقطة</strong>.
                </li>
                <li>
                  ساعات المساقات المعتمدة متاحة للاحتساب (1، 2، 3 ساعات).
                </li>
              </ul>
            </div>

            {/* Footer with Made By لجنة كلية الهندسة + Social Links */}
            <footer className="mt-6 pt-4 border-t border-[#eddcc4]/80 text-center space-y-3 no-print">
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/70 backdrop-blur-xs p-0.5 border border-[#eddcc4] shadow-xs flex items-center justify-center">
                  <EngineeringLogo className="w-full h-full" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#960112] font-bukra">
                  Made by لجنة كلية الهندسة
                </span>
              </div>

              {/* Social Media Buttons: Facebook & Instagram */}
              <div className="flex items-center justify-center gap-2.5 pt-1">
                {/* Facebook Button */}
                <a
                  href="https://www.facebook.com/share/1DnY6zHtTC/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/60 hover:bg-white/80 backdrop-blur-xs text-[#960112] border border-[#eddcc4] shadow-xs active:scale-95 transition-all text-xs font-bold font-bukra"
                  title="صفحة فيسبوك - لجنة كلية الهندسة"
                >
                  <svg className="w-4 h-4 fill-current text-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </a>

                {/* Instagram Button */}
                <a
                  href="https://www.instagram.com/engineering_committee?stkn=ZHdpMnp4ZXQ5amZu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/60 hover:bg-white/80 backdrop-blur-xs text-[#960112] border border-[#eddcc4] shadow-xs active:scale-95 transition-all text-xs font-bold font-bukra"
                  title="حساب إنستغرام - لجنة كلية الهندسة"
                >
                  <svg className="w-4 h-4 fill-current text-[#E4405F]" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Instagram</span>
                </a>
              </div>
            </footer>
          </div>
        )}

        {/* Dedicated Print Certificate Container (always active when printing) */}
        {result && (
          <div className="hidden print:block">
            <CertificateCard
              result={result}
              onUpdateStudentName={handleUpdateStudentNameInCertificate}
            />
          </div>
        )}
      </main>

      {/* Sticky Bottom Actions Bar (Active on Calculator Tab) */}
      {activeTab === 'calculator' && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFF9EF]/85 backdrop-blur-md border-t border-[#eddcc4]/80 shadow-xl p-3 sm:p-4 no-print">
          <div className="max-w-xl mx-auto flex items-center gap-2">
            {/* Primary Action Button: Calculate */}
            <button
              type="button"
              onClick={handleCalculate}
              className="flex-1 h-12 sm:h-13 rounded-xl bg-gradient-to-r from-[#960112] to-[#b00c21] hover:from-[#7e010f] hover:to-[#960112] active:scale-[0.98] text-white text-sm sm:text-base font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#960112]/20 font-bukra"
            >
              <Calculator className="w-5 h-5 text-amber-300" />
              <span>احسب المعدل</span>
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              title="طباعة كشف ومعدل الطالب"
              className="h-12 sm:h-13 px-4 rounded-xl border border-[#eddcc4] bg-white/70 hover:bg-white active:scale-95 text-[#960112] text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0 font-bukra"
            >
              <Printer className="w-4 h-4 text-[#960112]" />
              <span>طباعة</span>
            </button>

            {/* Secondary Action Button: Reset */}
            <button
              type="button"
              onClick={handleFullReset}
              title="تفريغ الحقول ومسح البيانات"
              className="h-12 sm:h-13 px-3.5 rounded-xl border border-[#eddcc4] bg-white/70 hover:bg-white active:scale-95 text-[#960112]/80 text-xs sm:text-sm font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shrink-0 font-bukra"
            >
              <RotateCcw className="w-4 h-4 text-[#960112]" />
              <span>تفريغ</span>
            </button>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {showResultModal && (
        <ResultModal
          result={result}
          onClose={() => setShowResultModal(false)}
          onViewCertificate={() => {
            setShowResultModal(false);
            setActiveTab('certificate');
          }}
          isFreshman={isFreshman}
        />
      )}
    </div>
  );
}
