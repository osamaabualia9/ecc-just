import React, { useState } from 'react';
import {
  Download,
  Printer,
  Copy,
  CheckCircle2,
  ShieldCheck,
  Edit3,
  Image as ImageIcon,
} from 'lucide-react';
import { CalculationResult } from '../types';
import { formatResultShareText } from '../utils/calculator';
import { EngineeringLogo, LOGO_SVG_STRING } from './EngineeringLogo';

interface CertificateCardProps {
  result: CalculationResult;
  onUpdateStudentName?: (name: string) => void;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  result,
  onUpdateStudentName,
}) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(result.studentName || 'طالب كلية الهندسة');

  const handleCopy = async () => {
    try {
      const text = formatResultShareText(result);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {}
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveName = () => {
    setIsEditingName(false);
    if (onUpdateStudentName) {
      onUpdateStudentName(nameInput.trim() || 'طالب كلية الهندسة');
    }
  };

  // High-Resolution 2X Canvas Image Export with Engineering Committee Branding
  const handleDownloadImage = () => {
    setIsDownloading(true);

    const canvas = document.createElement('canvas');
    const width = 1200;
    const height = 820;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsDownloading(false);
      return;
    }

    // Warm parchment ivory background matching #FFF9EF
    ctx.fillStyle = '#FFF9EF';
    ctx.fillRect(0, 0, width, height);

    // Outer Maroon Border (#960112)
    ctx.strokeStyle = '#960112';
    ctx.lineWidth = 14;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    // Inner Gold Border (#EAA313)
    ctx.strokeStyle = '#EAA313';
    ctx.lineWidth = 3.5;
    ctx.strokeRect(34, 34, width - 68, height - 68);

    // Subtle hairline
    ctx.strokeStyle = '#eddcc4';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(42, 42, width - 84, height - 84);

    // Corner Ornaments
    const drawCorner = (x: number, y: number) => {
      ctx.strokeStyle = '#EAA313';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#960112';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCorner(42, 42);
    drawCorner(width - 42, 42);
    drawCorner(42, height - 42);
    drawCorner(width - 42, height - 42);

    // Load Engineering Logo Image to render onto the Canvas
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    logoImg.onload = () => {
      // Draw logo in the top center
      ctx.drawImage(logoImg, width / 2 - 50, 55, 100, 100);

      // Render Texts (RTL Arabic)
      ctx.direction = 'rtl';
      ctx.textAlign = 'center';

      // Header Text: "لجنة كلية الهندسة"
      ctx.fillStyle = '#960112';
      ctx.font = '900 32px Cairo, sans-serif';
      ctx.fillText('لجنة كلية الهندسة', width / 2, 195);

      // Divider Line
      ctx.strokeStyle = '#EAA313';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(320, 220);
      ctx.lineTo(width - 320, 220);
      ctx.stroke();

      // Certificate Title
      ctx.fillStyle = '#960112';
      ctx.font = 'bold 28px Cairo, sans-serif';
      ctx.fillText('كشف تقدير ومعدل الطالب', width / 2, 265);

      // Statement Text
      ctx.fillStyle = '#475569';
      ctx.font = '600 19px Cairo, sans-serif';
      ctx.fillText('يُفيد هذا الكشف الصادر عن لجنة كلية الهندسة بأن الطالب / الطالبة:', width / 2, 310);

      // Student Name Box
      const studentName = result.studentName || 'طالب كلية الهندسة';
      ctx.fillStyle = '#960112';
      ctx.font = '900 34px Cairo, sans-serif';
      ctx.fillText(studentName, width / 2, 355);

      ctx.fillStyle = '#64748B';
      ctx.font = '500 16px Cairo, sans-serif';
      ctx.fillText(
        'قد أنجز احتساب المعدل وفقاً لنظام النقاط المعتمد (من 4.20 نقطة):',
        width / 2,
        392
      );

      // Metrics Boxes
      const boxWidth = 320;
      const boxHeight = 135;
      const boxY = 425;

      const rightBoxX = width / 2 + 30;
      const leftBoxX = width / 2 - 350;

      // Right Box (Semester)
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#eddcc4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(rightBoxX, boxY, boxWidth, boxHeight, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#64748B';
      ctx.font = '600 16px Cairo, sans-serif';
      ctx.fillText('المعدل الفصلي', rightBoxX + boxWidth / 2, boxY + 30);

      ctx.fillStyle = '#960112';
      ctx.font = 'bold 44px Cairo, sans-serif';
      ctx.fillText(result.semesterGpa.toFixed(2), rightBoxX + boxWidth / 2, boxY + 76);

      ctx.fillStyle = '#0F766E';
      ctx.font = 'bold 15px Cairo, sans-serif';
      ctx.fillText(
        `التقدير: ${result.semesterStanding} (${result.semesterHours} ساعات)`,
        rightBoxX + boxWidth / 2,
        boxY + 110
      );

      // Left Box (Cumulative)
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#EAA313';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(leftBoxX, boxY, boxWidth, boxHeight, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#960112';
      ctx.font = '600 16px Cairo, sans-serif';
      ctx.fillText('المعدل التراكمي العام', leftBoxX + boxWidth / 2, boxY + 30);

      ctx.fillStyle = '#960112';
      ctx.font = 'bold 44px Cairo, sans-serif';
      ctx.fillText(result.newCumulativeGpa.toFixed(2), leftBoxX + boxWidth / 2, boxY + 76);

      ctx.fillStyle = '#B45309';
      ctx.font = 'bold 15px Cairo, sans-serif';
      ctx.fillText(
        `التقدير: ${result.newCumulativeStanding} (${result.totalCumulativeHours} ساعة إجمالية)`,
        leftBoxX + boxWidth / 2,
        boxY + 110
      );

      // Evaluation Remark
      ctx.fillStyle = '#334155';
      ctx.font = '500 16px Cairo, sans-serif';
      ctx.fillText(result.academicRemark, width / 2, 595);

      // Divider before footer
      ctx.strokeStyle = '#eddcc4';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(120, 630);
      ctx.lineTo(width - 120, 630);
      ctx.stroke();

      // Engineering Committee Verification Stamp
      const sealX = 220;
      const sealY = 715;
      ctx.strokeStyle = '#960112';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(sealX, sealY, 46, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#EAA313';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(sealX, sealY, 40, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#960112';
      ctx.font = 'bold 11px Cairo, sans-serif';
      ctx.fillText('لجنة كلية الهندسة', sealX, sealY - 14);
      ctx.font = 'bold 13px Cairo, sans-serif';
      ctx.fillText('معتمد رسمياً', sealX, sealY + 6);
      ctx.font = 'bold 10px Cairo, sans-serif';
      ctx.fillText('ENGINEERING COMMITTEE', sealX, sealY + 22);

      // Footer Information
      ctx.textAlign = 'right';
      ctx.fillStyle = '#64748B';
      ctx.font = '500 15px Cairo, sans-serif';
      ctx.fillText(`تاريخ الإصدار: ${result.formattedDate}`, width - 120, 685);
      ctx.fillText(`الرقم المرجعي: ${result.certificateId}`, width - 120, 715);
      ctx.fillText('صادر عن: لجنة كلية الهندسة', width - 120, 745);

      // Trigger Download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `شهادة_معدل_لجنة_كلية_الهندسة_${studentName.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
      setIsDownloading(false);
    };

    logoImg.src = `data:image/svg+xml;utf8,${encodeURIComponent(LOGO_SVG_STRING)}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-[#eddcc4] overflow-hidden mb-5">
      {/* Dedicated Download Certificate Banner (خانة تحميل الشهادة) */}
      <div className="bg-[#FFF9EF] border-b border-[#eddcc4] p-4 text-center sm:text-right flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#960112] to-[#b30b20] text-amber-300 flex items-center justify-center shrink-0 shadow-xs">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#960112]">
              خانة تحميل كشف وشهادة المعدل
            </h3>
            <p className="text-[11.5px] text-slate-600">
              يمكنك تصدير الشهادة كصورة كاملة (PNG) بجودة عالية للمشاركة أو الطباعة
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className="flex-1 sm:flex-initial h-11 px-4 rounded-xl bg-[#960112] hover:bg-[#7e010f] active:scale-95 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#960112]/20"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>{isDownloading ? 'جاري تجهيز الصورة...' : 'تحميل الشهادة (PNG)'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="h-11 px-3.5 rounded-xl border border-[#eddcc4] bg-white hover:bg-[#FFF9EF] text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="طباعة الشهادة مباشرة"
          >
            <Printer className="w-4 h-4 text-[#960112]" />
            <span>طباعة</span>
          </button>
        </div>
      </div>

      {/* Secondary Actions Strip */}
      <div className="bg-white px-4 py-3 border-b border-[#eddcc4] flex flex-wrap items-center justify-between gap-2.5 text-xs no-print">
        {/* Student Name */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">اسم الطالب:</span>
          {isEditingName ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="أدخل اسمك"
                className="h-8 px-2.5 rounded-md border border-[#eddcc4] text-xs font-bold text-slate-800 bg-[#FFF9EF] focus:outline-none focus:border-[#960112]"
                autoFocus
              />
              <button
                type="button"
                onClick={handleSaveName}
                className="h-8 px-2.5 rounded-md bg-[#960112] text-white text-[11px] font-bold cursor-pointer"
              >
                حفظ
              </button>
            </div>
          ) : (
            <span className="font-bold text-[#960112] bg-[#FFF9EF] px-2.5 py-1 rounded border border-[#eddcc4]">
              {result.studentName || 'طالب كلية الهندسة'}
            </span>
          )}

          {!isEditingName && (
            <button
              type="button"
              onClick={() => setIsEditingName(true)}
              className="text-[#960112] hover:underline font-bold text-[11px] cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 inline ml-0.5" />
              تعديل
            </button>
          )}
        </div>

        {/* Copy Button */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            className="h-9 px-3 rounded-lg border border-[#eddcc4] bg-[#FFF9EF] hover:bg-white text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-[#960112]" />
            )}
            <span>{copied ? 'تم النسخ' : 'نسخ النص'}</span>
          </button>
        </div>
      </div>

      {/* Visual Certificate Card (Print Area) */}
      <div className="p-4 sm:p-7 bg-[#FFF9EF]/80 overflow-x-auto print:p-0 print:bg-white">
        <div className="certificate-print-frame min-w-[340px] max-w-2xl mx-auto bg-[#FFFDF9] rounded-2xl p-5 sm:p-8 shadow-sm border-4 border-[#960112] relative overflow-hidden">
          {/* Internal Decorative Gold Border */}
          <div className="absolute inset-2 border-2 border-[#EAA313]/60 rounded-xl pointer-events-none" />

          {/* Faint Logo Watermark behind certificate */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none select-none">
            <div className="w-64 h-64">
              <EngineeringLogo className="w-full h-full" showText={false} />
            </div>
          </div>

          {/* Certificate Content */}
          <div className="relative z-10 text-center space-y-4">
            {/* Header Lockup with Engineering Committee Logo */}
            <div className="space-y-1 pb-3 border-b border-[#eddcc4] flex flex-col items-center">
              <div className="w-16 h-16 bg-[#FFF9EF] rounded-xl p-1.5 shadow-xs border border-[#eddcc4] mb-1">
                <EngineeringLogo className="w-full h-full" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#960112]">
                لجنة كلية الهندسة
              </h2>
            </div>

            {/* Document Title */}
            <div>
              <h1 className="text-base sm:text-lg font-black text-[#960112] tracking-tight">
                كشف تقدير ومعدل الطالب
              </h1>
              <p className="text-[11px] text-slate-500 mt-1">
                صادر وفق نظام احتساب النقاط المعتمد (من 4.20)
              </p>
            </div>

            {/* Student Endorsement */}
            <div className="py-1">
              <p className="text-xs text-slate-600 mb-1">يُفيد هذا الكشف بأن الطالب / الطالبة:</p>
              <div className="inline-block text-base sm:text-lg font-bold text-[#960112] border-b-2 border-[#EAA313] px-4 pb-0.5">
                {result.studentName || 'طالب كلية الهندسة'}
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-right">
              {/* Semester GPA Box */}
              <div className="bg-white border border-[#eddcc4] rounded-xl p-3.5 text-center shadow-xs">
                <span className="text-[11px] font-semibold text-slate-600 block mb-0.5">
                  المعدل الفصلي
                </span>
                <span className="text-2xl sm:text-3xl font-black text-[#960112] tabular-nums">
                  {result.semesterGpa.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 block mb-1">من 4.20</span>
                <div className="text-[11px] font-bold text-slate-800 bg-[#FFF9EF] border border-[#eddcc4] rounded-md py-0.5 px-2 inline-block">
                  التقدير: {result.semesterStanding}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  {result.semesterHours} ساعات معتمدة
                </p>
              </div>

              {/* Cumulative GPA Box */}
              <div className="bg-white border-2 border-[#EAA313] rounded-xl p-3.5 text-center shadow-xs">
                <span className="text-[11px] font-bold text-[#960112] block mb-0.5">
                  المعدل التراكمي العام
                </span>
                <span className="text-2xl sm:text-3xl font-black text-[#960112] tabular-nums">
                  {result.newCumulativeGpa.toFixed(2)}
                </span>
                <span className="text-[10px] text-amber-700 block mb-1">من 4.20</span>
                <div className="text-[11px] font-bold text-[#960112] bg-[#FFF9EF] border border-[#eddcc4] rounded-md py-0.5 px-2 inline-block">
                  التقدير: {result.newCumulativeStanding}
                </div>
                <p className="text-[10px] text-slate-600 mt-1">
                  {result.totalCumulativeHours} ساعة تراكمية
                </p>
              </div>
            </div>

            {/* Academic Remark Statement */}
            <div className="bg-white border border-[#eddcc4] rounded-xl p-3 text-xs text-slate-700 leading-relaxed text-right flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#960112] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block mb-0.5">التقييم الأكاديمي:</span>
                <span>{result.academicRemark}</span>
              </div>
            </div>

            {/* Certificate Footer with Verification Seal */}
            <div className="pt-3 border-t border-[#eddcc4] flex items-center justify-between text-right text-[11px] text-slate-500">
              <div className="space-y-0.5">
                <p>
                  تاريخ الحساب:{' '}
                  <span className="font-semibold text-slate-700">{result.formattedDate}</span>
                </p>
                <p>
                  الرقم المرجعي:{' '}
                  <span className="font-mono text-slate-700">{result.certificateId}</span>
                </p>
              </div>

              {/* Engineering Committee Stamp */}
              <div className="w-16 h-16 rounded-full border-2 border-[#960112] flex flex-col items-center justify-center p-1 text-[8px] font-bold text-[#960112] rotate-[-5deg] bg-white shadow-xs">
                <span>كلية الهندسة</span>
                <span className="text-[9px] text-[#EAA313]">معتمد</span>
                <span className="text-[7px] text-slate-400">ENG COMM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
