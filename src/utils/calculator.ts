import { Course, CalculationResult, FormErrors } from '../types';
import { GRADE_MAP, getStanding, getAcademicRemark } from '../constants';

export interface CalculationInput {
  studentName?: string;
  previousGpa: string;
  previousHours: string;
  isFreshman: boolean;
  courses: Course[];
}

export function validateInputs(input: CalculationInput): { isValid: boolean; errors: FormErrors } {
  const errors: FormErrors = {};
  let isValid = true;
  const courseErrors: Record<string, { hours?: string; grade?: string }> = {};

  if (!input.isFreshman) {
    const hasPreviousGpa = input.previousGpa.trim() !== '';
    const hasPreviousHours = input.previousHours.trim() !== '';

    if (hasPreviousGpa || hasPreviousHours) {
      if (!hasPreviousGpa) {
        errors.previousGpa = 'يرجى إدخال المعدل التراكمي السابق أو اختيار طالب مستجد';
        isValid = false;
      } else {
        const gpaNum = parseFloat(input.previousGpa);
        if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4.20) {
          errors.previousGpa = 'المعدل التراكمي يجب أن يكون قيمة عددية بين 0.00 و 4.20';
          isValid = false;
        }
      }

      if (!hasPreviousHours) {
        errors.previousHours = 'يرجى إدخال الساعات المقطوعة والناجحة';
        isValid = false;
      } else {
        const hoursNum = parseInt(input.previousHours, 10);
        if (isNaN(hoursNum) || hoursNum < 0 || !Number.isInteger(Number(input.previousHours))) {
          errors.previousHours = 'الساعات المقطوعة يجب أن تكون عدداً صحيحاً موجباً';
          isValid = false;
        }
      }
    }
  }

  if (input.courses.length === 0) {
    errors.general = 'يجب إدراج مادة دراسية واحدة على الأقل لاحتساب المعدل';
    isValid = false;
  }

  input.courses.forEach((course) => {
    const itemError: { hours?: string; grade?: string } = {};

    if (!course.hours || course.hours < 1 || course.hours > 3) {
      itemError.hours = 'الساعات (1-3)';
      isValid = false;
    }

    if (!course.grade || !GRADE_MAP.hasOwnProperty(course.grade)) {
      itemError.grade = 'اختر العلامة المعتمدة';
      isValid = false;
    }

    if (itemError.hours || itemError.grade) {
      courseErrors[course.id] = itemError;
    }
  });

  if (Object.keys(courseErrors).length > 0) {
    errors.courseErrors = courseErrors;
  }

  return { isValid, errors };
}

export function calculateGpa(input: CalculationInput): CalculationResult {
  let semesterHours = 0;
  let semesterPoints = 0;

  const coursesBreakdown = input.courses.map((c, index) => {
    const gradePoints = GRADE_MAP[c.grade] ?? 0;
    const hours = Number(c.hours) || 0;
    const itemTotalPoints = hours * gradePoints;

    semesterHours += hours;
    semesterPoints += itemTotalPoints;

    return {
      id: c.id,
      name: c.name.trim() !== '' ? c.name.trim() : `مساق ${index + 1}`,
      hours,
      gradeSymbol: c.grade,
      gradePoints,
      totalPoints: itemTotalPoints,
    };
  });

  const semesterGpa = semesterHours > 0 ? semesterPoints / semesterHours : 0;
  const roundedSemesterGpa = Math.round(semesterGpa * 100) / 100;

  let newCumulativeGpa = roundedSemesterGpa;
  let totalCumulativeHours = semesterHours;
  let gpaChange: number | null = null;

  const prevGpaNum = parseFloat(input.previousGpa);
  const prevHoursNum = parseInt(input.previousHours, 10);

  const hasValidPrevious =
    !input.isFreshman &&
    !isNaN(prevGpaNum) &&
    prevGpaNum >= 0 &&
    !isNaN(prevHoursNum) &&
    prevHoursNum > 0;

  if (hasValidPrevious) {
    const previousPoints = prevGpaNum * prevHoursNum;
    const totalPoints = previousPoints + semesterPoints;
    totalCumulativeHours = prevHoursNum + semesterHours;
    newCumulativeGpa = totalCumulativeHours > 0 ? totalPoints / totalCumulativeHours : 0;
    newCumulativeGpa = Math.round(newCumulativeGpa * 100) / 100;
    gpaChange = Math.round((newCumulativeGpa - prevGpaNum) * 100) / 100;
  }

  const semesterStanding = getStanding(roundedSemesterGpa).title;
  const newCumulativeStanding = getStanding(newCumulativeGpa).title;
  const academicRemark = getAcademicRemark(newCumulativeGpa);

  const now = new Date();
  const formattedDate = now.toLocaleDateString('ar-JO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const certNumber = Math.floor(100000 + Math.random() * 900000);
  const certificateId = `JUST-${now.getFullYear()}-${certNumber}`;

  return {
    studentName: input.studentName?.trim() || 'طالب جامعي',
    semesterHours,
    semesterPoints: Math.round(semesterPoints * 100) / 100,
    semesterGpa: roundedSemesterGpa,
    semesterStanding,
    newCumulativeGpa,
    newCumulativeStanding,
    totalCumulativeHours,
    gpaChange,
    coursesBreakdown,
    academicRemark,
    formattedDate,
    certificateId,
  };
}

export interface TargetGpaInput {
  currentGpa: number;
  completedHours: number;
  desiredCgpa: number;
  upcomingHours: number;
}

export interface TargetGpaResult {
  requiredSemesterGpa: number;
  isPossible: boolean;
  message: string;
}

export function calculateRequiredSemesterGpa(input: TargetGpaInput): TargetGpaResult {
  const { currentGpa, completedHours, desiredCgpa, upcomingHours } = input;

  if (upcomingHours <= 0) {
    return {
      requiredSemesterGpa: 0,
      isPossible: false,
      message: 'عدد ساعات الفصل يجب أن يكون قيمة موجبة أكبر من صفر.',
    };
  }

  const currentPoints = currentGpa * completedHours;
  const totalTargetHours = completedHours + upcomingHours;
  const targetTotalPoints = desiredCgpa * totalTargetHours;
  const requiredPoints = targetTotalPoints - currentPoints;
  const requiredGpa = requiredPoints / upcomingHours;

  const rounded = Math.round(requiredGpa * 100) / 100;

  if (rounded > 4.20) {
    return {
      requiredSemesterGpa: rounded,
      isPossible: false,
      message: `المعدل الفصلي المطلوب (${rounded.toFixed(2)}) يتجاوز الحد الأعلى للعلامات في نظام الجامعة (4.20). يتطلب تحقيق هذا الهدف فصولاً دراسية إضافية أو تعديل الهدف.`,
    };
  }

  if (rounded <= 0) {
    return {
      requiredSemesterGpa: 0.0,
      isPossible: true,
      message: 'معدلك الحالي كافٍ لبلوغ هذا الهدف مع أي معدل فصلي مجتاز.',
    };
  }

  return {
    requiredSemesterGpa: rounded,
    isPossible: true,
    message: `يتطلب تحقيق المعدل المستهدف الحصول على معدل فصلي لا يقل عن ${rounded.toFixed(2)} من 4.20 في هذا الفصل.`,
  };
}

export function formatResultShareText(result: CalculationResult): string {
  const lines: string[] = [
    'جامعة العلوم والتكنولوجيا الأردنية',
    'لجنة كلية الهندسة',
    'كشف تقدير المعدل الأكاديمي',
    '----------------------------------------',
    `اسم الطالب: ${result.studentName || 'طالب جامعي'}`,
    `المعدل الفصلي: ${result.semesterGpa.toFixed(2)} من 4.20`,
    `تقدير الفصل: ${result.semesterStanding}`,
    `ساعات الفصل: ${result.semesterHours} ساعة معتمدة`,
    '----------------------------------------',
    `المعدل التراكمي الجديد: ${result.newCumulativeGpa.toFixed(2)} من 4.20`,
    `التقدير التراكمي العام: ${result.newCumulativeStanding}`,
    `إجمالي الساعات المقطوعة: ${result.totalCumulativeHours} ساعة معتمدة`,
  ];

  if (result.gpaChange !== null) {
    const sign = result.gpaChange >= 0 ? '+' : '';
    lines.push(`التغير في المعدل التراكمي: ${sign}${result.gpaChange.toFixed(2)}`);
  }

  lines.push('----------------------------------------');
  lines.push(`التاريخ: ${result.formattedDate}`);
  lines.push(`الرقم المرجعي: ${result.certificateId}`);
  lines.push('تم الاحتساب عبر: حاسبة المعدل لجامعة العلوم والتكنولوجيا - لجنة كلية الهندسة');

  return lines.join('\n');
}
