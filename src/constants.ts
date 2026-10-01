import { Course, GradeOption } from './types';

// نظام علامات ونقاط جامعة العلوم والتكنولوجيا الأردنية (JUST) المعتمد رسمياً
export const JUST_GRADES: GradeOption[] = [
  { symbol: 'A+', points: 4.20, label: 'A+ (4.20)' },
  { symbol: 'A',  points: 4.00, label: 'A (4.00)' },
  { symbol: 'A-', points: 3.75, label: 'A- (3.75)' },
  { symbol: 'B+', points: 3.50, label: 'B+ (3.50)' },
  { symbol: 'B',  points: 3.25, label: 'B (3.25)' },
  { symbol: 'B-', points: 3.00, label: 'B- (3.00)' },
  { symbol: 'C+', points: 2.75, label: 'C+ (2.75)' },
  { symbol: 'C',  points: 2.50, label: 'C (2.50)' },
  { symbol: 'C-', points: 2.25, label: 'C- (2.25)' },
  { symbol: 'D+', points: 2.00, label: 'D+ (2.00)' },
  { symbol: 'D',  points: 1.75, label: 'D (1.75)' },
  { symbol: 'D-', points: 1.50, label: 'D- (1.50)' },
  { symbol: 'F',  points: 0.00, label: 'F (0.00) - راسب' },
];

export const GRADE_MAP: Record<string, number> = JUST_GRADES.reduce(
  (acc, g) => {
    acc[g.symbol] = g.points;
    return acc;
  },
  {} as Record<string, number>
);

export const DEFAULT_COURSES: Course[] = [
  { id: 'course-1', name: '', hours: 3, grade: '' },
  { id: 'course-2', name: '', hours: 3, grade: '' },
  { id: 'course-3', name: '', hours: 3, grade: '' },
  { id: 'course-4', name: '', hours: 3, grade: '' },
];

export const SAMPLE_COURSES: Course[] = [
  { id: 'course-1', name: 'تفاضل وتكامل 1', hours: 3, grade: 'A' },
  { id: 'course-2', name: 'فيزياء عامة 1', hours: 3, grade: 'B+' },
  { id: 'course-3', name: 'مهارات الحاسوب', hours: 3, grade: 'A+' },
  { id: 'course-4', name: 'لغة إنجليزية 1', hours: 3, grade: 'B' },
];

export interface StandingInfo {
  title: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  minGpa: number;
}

export const STANDINGS = {
  HONORS: {
    title: 'ممتاز (مرتبة الشرف)',
    badgeBg: 'bg-emerald-50 text-emerald-900 border-emerald-300',
    badgeText: 'text-emerald-800',
    borderColor: 'border-emerald-500',
    minGpa: 3.65,
  },
  VERY_GOOD: {
    title: 'جيد جداً',
    badgeBg: 'bg-blue-50 text-blue-900 border-blue-300',
    badgeText: 'text-blue-800',
    borderColor: 'border-blue-500',
    minGpa: 3.00,
  },
  GOOD: {
    title: 'جيد',
    badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
    badgeText: 'text-slate-800',
    borderColor: 'border-slate-400',
    minGpa: 2.50,
  },
  PASS: {
    title: 'مقبول',
    badgeBg: 'bg-amber-50 text-amber-900 border-amber-300',
    badgeText: 'text-amber-800',
    borderColor: 'border-amber-400',
    minGpa: 2.00,
  },
  WARNING: {
    title: 'ضعيف (إنذار أكاديمي)',
    badgeBg: 'bg-rose-50 text-rose-900 border-rose-300',
    badgeText: 'text-rose-800',
    borderColor: 'border-rose-400',
    minGpa: 0.0,
  },
};

export function getStanding(gpa: number) {
  if (gpa >= 3.65) return STANDINGS.HONORS;
  if (gpa >= 3.00) return STANDINGS.VERY_GOOD;
  if (gpa >= 2.50) return STANDINGS.GOOD;
  if (gpa >= 2.00) return STANDINGS.PASS;
  return STANDINGS.WARNING;
}

export function getAcademicRemark(gpa: number): string {
  if (gpa >= 3.65) {
    return 'أداء أكاديمي رفيع يطابق معايير مرتبة الشرف والامتياز المعتمدة في كلية الهندسة.';
  } else if (gpa >= 3.00) {
    return 'تحصيل علمي متقدم يعكس الاستيعاب الجيد للمساقات والالتزام الأكاديمي المنتظم.';
  } else if (gpa >= 2.50) {
    return 'مستوى أكاديمي جيد يفي بمتطلبات الخطة الدراسية، مع إمكانية تحسين التحصيل في الفصول اللاحقة.';
  } else if (gpa >= 2.00) {
    return 'المعدل ضمن الحد الأدنى للاستمرار الأكاديمي المنتظم، ويوصى بتركيز الجهد لرفع المعدل التراكمي.';
  } else {
    return 'تنبيه أكاديمي: المعدل دون الحد الأدنى المطلوب للاستمرار المنتظم (2.00)، ويخضع الطالب للوائح الإنذار الأكاديمي المنصوص عليها في تعليمات منح درجة البكالوريوس.';
  }
}
