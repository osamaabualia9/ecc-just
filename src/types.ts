export interface GradeOption {
  symbol: string;
  points: number;
  label: string;
}

export interface Course {
  id: string;
  name: string;
  hours: number;
  grade: string; // symbol e.g. "A+", "B", ""
}

export interface CalculationResult {
  studentName?: string;
  semesterHours: number;
  semesterPoints: number;
  semesterGpa: number;
  semesterStanding: string;
  newCumulativeGpa: number;
  newCumulativeStanding: string;
  totalCumulativeHours: number;
  gpaChange: number | null;
  coursesBreakdown: {
    id: string;
    name: string;
    hours: number;
    gradeSymbol: string;
    gradePoints: number;
    totalPoints: number;
  }[];
  academicRemark: string;
  formattedDate: string;
  certificateId: string;
}

export interface FormErrors {
  previousGpa?: string;
  previousHours?: string;
  courseErrors?: Record<string, { hours?: string; grade?: string }>;
  general?: string;
}
