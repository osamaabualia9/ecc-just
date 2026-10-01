import React from 'react';
import { Calculator, Award, Target, FileText, Printer } from 'lucide-react';
import { EngineeringLogo } from './EngineeringLogo';

export type ActiveTab = 'calculator' | 'certificate' | 'gradeScale' | 'targetPlanner';

interface HeaderProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  hasResult: boolean;
  onPrint?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onChangeTab,
  hasResult,
  onPrint,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-[#8f0212] via-[#a80e22] to-[#8f0212] text-white shadow-md border-b border-white/15">
      <div className="max-w-xl mx-auto px-4 pt-3 pb-2.5">
        {/* Top Wordmark & Identity */}
        <div className="flex items-center justify-between pb-2.5">
          <div className="flex items-center gap-2.5">
            {/* Engineering Committee Logo with beige #FFF9EF background */}
            <div className="w-11 h-11 rounded-2xl bg-[#FFF9EF] p-1 border border-amber-300/70 shadow-sm flex items-center justify-center shrink-0">
              <EngineeringLogo className="w-full h-full object-contain" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight drop-shadow-xs">
                  حاسبة المعدل
                </h1>
                <span className="text-[10px] font-bold bg-white/20 text-amber-200 px-2 py-0.5 rounded-full border border-white/20 backdrop-blur-xs">
                  4.20
                </span>
              </div>
              <p className="text-[12.5px] text-amber-200 font-bold tracking-wide drop-shadow-xs">
                لجنة كلية الهندسة
              </p>
            </div>
          </div>

          {/* Quick Print Trigger in the Header */}
          {onPrint && (
            <button
              type="button"
              onClick={onPrint}
              aria-label="طباعة الكشف"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-white/15 hover:bg-white/25 active:scale-95 border border-white/25 backdrop-blur-sm transition-all cursor-pointer shadow-xs"
              title="طباعة كشف الدرجات"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" />
              <span>طباعة</span>
            </button>
          )}
        </div>

        {/* Navigation Tabs Bar with Frosted Glass Aesthetics */}
        <nav className="flex items-center gap-1 bg-black/20 backdrop-blur-sm p-1 rounded-xl text-xs font-semibold overflow-x-auto scrollbar-none border border-white/10">
          <button
            type="button"
            onClick={() => onChangeTab('calculator')}
            className={`flex-1 min-w-[70px] py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-[#FFF9EF] text-[#960112] shadow-sm font-bold'
                : 'text-amber-100 hover:text-white bg-white/5 hover:bg-white/15'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>الحاسبة</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeTab('certificate')}
            className={`flex-1 min-w-[85px] py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer relative ${
              activeTab === 'certificate'
                ? 'bg-amber-400 text-[#960112] shadow-sm font-bold'
                : 'text-amber-100 hover:text-white bg-white/5 hover:bg-white/15'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>الشهادة</span>
            {hasResult && activeTab !== 'certificate' && (
              <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onChangeTab('gradeScale')}
            className={`flex-1 min-w-[80px] py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'gradeScale'
                ? 'bg-[#FFF9EF] text-[#960112] shadow-sm font-bold'
                : 'text-amber-100 hover:text-white bg-white/5 hover:bg-white/15'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>سلم النقاط</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeTab('targetPlanner')}
            className={`flex-1 min-w-[85px] py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'targetPlanner'
                ? 'bg-[#FFF9EF] text-[#960112] shadow-sm font-bold'
                : 'text-amber-100 hover:text-white bg-white/5 hover:bg-white/15'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>هدف المعدل</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
