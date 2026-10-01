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
import { PreviousRecordCard } from './components/PreviousRecordCard';
import { SemesterCoursesCard } from './components/SemesterCoursesCard';
import { CertificateCard } from './components/CertificateCard';
import { ResultModal } from './components/ResultModal';
import { GradeScaleModal } from './components/GradeScaleModal';
import { TargetGpaModal } from './components/TargetGpaModal';
import { Course, FormErrors, CalculationResult } from './types';
import { DEFAULT_COURSES } from './constants';
import { validateInputs, calculateGpa } from './utils/calculator';
import { EngineeringLogo } from './components/EngineeringLogo';

const STORAGE_KEY = 'just_engineering_gpa_calc_v5';

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
  const [showGradeScaleModal, setShowGradeScaleModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);

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

  // Real Print Handler that works directly from anywhere
  const handlePrint = () => {
    let currentResult = result;
    if (!currentResult) {
      currentResult = computeGpaInternal();
    }

    if (!currentResult) {
      alert('يرجى تحديد الساعات والعلامات أولاً لاحتساب وطباعة الكشف.');
      return;
    }

    // Trigger browser print
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
    <div className="min-h-screen bg-[#FFF9EF] flex flex-col font-sans text-slate-800 relative selection:bg-[#960112] selection:text-white">
      {/* Enhanced visible background watermark preserving original committee colors */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden no-print">
        <div className="opacity-[0.16] w-[450px] h-[450px] sm:w-[620px] sm:h-[620px] max-w-[90vw] transition-opacity">
          <EngineeringLogo className="w-full h-full" showText={true} />
        </div>
      </div>

      {/* Sticky Header with Frosted Accents */}
      <Header
        activeTab={activeTab}
        onChangeTab={(tab) => {
          if (tab === 'gradeScale') {
            setShowGradeScaleModal(true);
          } else if (tab === 'targetPlanner') {
            setShowTargetModal(true);
          } else {
            setActiveTab(tab);
          }
        }}
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
                className="flex items-center gap-1.5 text-xs font-bold text-[#960112] hover:underline cursor-pointer"
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
              <div className="bg-white rounded-2xl p-7 text-center border border-[#eddcc4] shadow-xs space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF9EF] p-2 flex items-center justify-center mx-auto border border-[#eddcc4]">
                  <EngineeringLogo className="w-full h-full" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  لم يتم احتساب المعدل بعد
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  يرجى إدخال المساقات والعلامات أولاً في شاشة الحاسبة والضغط على زر "احسب المعدل" لإصدار كشف التقدير والشهادة المعتمدة من لجنة كلية الهندسة.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('calculator')}
                    className="h-10 px-5 rounded-xl bg-[#960112] text-white text-xs font-bold hover:bg-[#7e010f] transition-colors cursor-pointer"
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
              <div className="mb-4 p-3 bg-white border border-[#EAA313] rounded-xl flex items-center justify-between text-xs shadow-xs no-print">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <FileText className="w-4 h-4 text-[#960112]" />
                  <span>
                    المعدل المحسوب: {result.newCumulativeGpa.toFixed(2)} ({result.newCumulativeStanding})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('certificate')}
                  className="font-bold text-[#960112] hover:underline cursor-pointer bg-[#FFF9EF] px-2.5 py-1 rounded-md border border-[#eddcc4]"
                >
                  عرض الشهادة
                </button>
              </div>
            )}

            {/* Section 1: Previous Record */}
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

            {/* Section 2: Current Semester Courses (Hours 1, 2, 3 only) */}
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

            {/* Academic Notes */}
            <div className="bg-white border border-[#eddcc4] rounded-2xl p-3.5 text-xs text-slate-700 space-y-1.5 shadow-xs no-print">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Info className="w-4 h-4 text-[#960112]" />
                <span>تعليمات احتساب المعدل - لجنة كلية الهندسة:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11.5px] leading-relaxed text-slate-600 pr-1">
                <li>
                  العلامة <span className="font-bold text-slate-800">A+</span> تعادل <strong>4.20 نقطة</strong>، و <span className="font-bold text-slate-800">A</span> تعادل <strong>4.00</strong>.
                </li>
                <li>
                  الحد الأدنى للمعدل التراكمي للاستمرار دون إنذار أكاديمي هو <strong>2.00 نقطة</strong>.
                </li>
                <li>
                  ساعات المساقات المعتمدة متاحة للاحتساب (1، 2، 3 ساعات).
                </li>
              </ul>
            </div>
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

      {/* Sticky Bottom Actions Bar (Active on Calculator Tab) with Working Print Button */}
      {activeTab === 'calculator' && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFF9EF]/95 backdrop-blur-md border-t border-[#eddcc4] shadow-xl p-3 sm:p-4 no-print">
          <div className="max-w-xl mx-auto flex items-center gap-2">
            {/* Primary Action Button: Calculate */}
            <button
              type="button"
              onClick={handleCalculate}
              className="flex-1 h-12 sm:h-13 rounded-xl bg-gradient-to-r from-[#960112] to-[#b00c21] hover:from-[#7e010f] hover:to-[#960112] active:scale-[0.98] text-white text-sm sm:text-base font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#960112]/20"
            >
              <Calculator className="w-5 h-5 text-amber-300" />
              <span>احسب المعدل</span>
            </button>

            {/* Print Button Right in the Main Interface (زر الطباعة بالواجهة الأساسية) */}
            <button
              type="button"
              onClick={handlePrint}
              title="طباعة كشف ومعدل الطالب"
              className="h-12 sm:h-13 px-4 rounded-xl border border-[#eddcc4] bg-white hover:bg-[#FFFDF9] active:scale-95 text-[#960112] text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
            >
              <Printer className="w-4 h-4 text-[#960112]" />
              <span>طباعة</span>
            </button>

            {/* Secondary Action Button: Reset */}
            <button
              type="button"
              onClick={handleFullReset}
              title="تفريغ الحقول ومسح البيانات"
              className="h-12 sm:h-13 px-3.5 rounded-xl border border-[#eddcc4] bg-white hover:bg-[#FFFDF9] active:scale-95 text-slate-600 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer shrink-0"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
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

      {/* Grade Scale Modal */}
      <GradeScaleModal
        isOpen={showGradeScaleModal}
        onClose={() => setShowGradeScaleModal(false)}
      />

      {/* Target GPA Planner Modal */}
      <TargetGpaModal
        isOpen={showTargetModal}
        onClose={() => setShowTargetModal(false)}
        defaultCurrentGpa={previousGpa}
        defaultCompletedHours={previousHours}
      />
    </div>
  );
}
