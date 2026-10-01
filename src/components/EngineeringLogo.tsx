import React from 'react';

interface EngineeringLogoProps {
  className?: string;
  showText?: boolean;
}

export const EngineeringLogo: React.FC<EngineeringLogoProps> = ({
  className = 'w-10 h-10',
  showText = false,
}) => {
  return (
    <svg
      viewBox={showText ? '0 0 400 400' : '0 0 320 280'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="شعار لجنة كلية الهندسة"
    >
      <g transform="translate(0, 0)">
        {/* Yellow Hard Hat on Top */}
        <g id="hard-hat">
          {/* Hat Dome */}
          <path
            d="M90 85 C90 35 125 15 160 15 C195 15 230 35 230 85 Z"
            fill="#EAA313"
          />
          {/* Hat Center Ridge */}
          <path
            d="M152 16 L152 75 C152 78 168 78 168 75 L168 16 Z"
            fill="#D38C05"
          />
          {/* Hat Brim */}
          <rect x="75" y="80" width="170" height="15" rx="7.5" fill="#EAA313" />
        </g>

        {/* Maroon Gear / Cogwheel */}
        <g id="gear">
          {/* 10 Gear Teeth Around Outer Perimeter */}
          <path
            d="
              M 160 48
              L 172 48 L 175 62 L 188 66 L 198 56 L 209 63 L 206 77 L 217 84 L 230 78 L 238 89 L 229 100 L 236 112 L 250 112 L 253 126 L 241 135 L 244 148 L 257 154 L 253 168 L 239 169 L 236 182 L 246 193 L 238 204 L 224 200 L 216 211 L 222 224 L 210 231 L 200 221 L 188 228 L 188 242 L 174 245 L 169 232 L 151 232 L 146 245 L 132 242 L 132 228 L 120 221 L 110 231 L 98 224 L 104 211 L 96 200 L 82 204 L 74 193 L 84 182 L 81 169 L 67 168 L 63 154 L 76 148 L 79 135 L 67 126 L 70 112 L 84 112 L 91 100 L 82 89 L 90 78 L 103 84 L 114 77 L 111 63 L 122 56 L 132 66 L 145 62 L 148 48 Z
            "
            fill="#960112"
          />
          {/* Gear Inner Cutout */}
          <circle cx="160" cy="146" r="62" fill="#FFF9EF" />
        </g>

        {/* Golden Ruler / Triangle */}
        <g id="triangle-ruler">
          {/* Outer Triangle */}
          <polygon points="160,118 228,230 92,230" fill="#EAA313" />
          {/* Inner Cutout */}
          <polygon points="160,162 204,220 116,220" fill="#FFF9EF" />
          {/* Measurement Ticks on Hypotenuse */}
          <rect x="122" y="166" width="10" height="5" transform="rotate(58 122 166)" fill="#FFF9EF" />
          <rect x="110" y="186" width="10" height="5" transform="rotate(58 110 186)" fill="#FFF9EF" />
          <rect x="98" y="206" width="10" height="5" transform="rotate(58 98 206)" fill="#FFF9EF" />
        </g>

        {/* Drafting Compass (فرجار هندسي) */}
        <g id="compass">
          {/* Compass Top Pivot Ring */}
          <circle cx="160" cy="80" r="18" fill="#960112" />
          <circle cx="160" cy="80" r="9" fill="#FFF9EF" />
          <rect x="153" y="60" width="14" height="15" rx="4" fill="#960112" />

          {/* Left Compass Arm */}
          <g transform="rotate(28 160 80)">
            <rect x="154" y="90" width="12" height="142" rx="3" fill="#960112" />
            <rect x="152" y="150" width="16" height="8" rx="2" fill="#FFF9EF" stroke="#960112" strokeWidth="2" />
            {/* Needle Point */}
            <polygon points="154,232 166,232 160,256" fill="#960112" />
          </g>

          {/* Right Compass Arm */}
          <g transform="rotate(-28 160 80)">
            <rect x="154" y="90" width="12" height="142" rx="3" fill="#960112" />
            <rect x="152" y="150" width="16" height="8" rx="2" fill="#FFF9EF" stroke="#960112" strokeWidth="2" />
            {/* Pencil/Needle Point */}
            <polygon points="154,232 166,232 160,256" fill="#960112" />
          </g>
        </g>

        {/* Text "لجنة كلية الهندسة" (if showText is true) */}
        {showText && (
          <text
            x="200"
            y="350"
            textAnchor="middle"
            fill="#960112"
            fontFamily="Cairo, sans-serif"
            fontWeight="900"
            fontSize="36"
            letterSpacing="0"
          >
            لجنة كلية الهندسة
          </text>
        )}
      </g>
    </svg>
  );
};

// Data URL for HTML5 Canvas or img tags
export const LOGO_SVG_STRING = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <g>
    <!-- Hard Hat -->
    <path d="M120 100 C120 40 160 20 200 20 C240 20 280 40 280 100 Z" fill="#EAA313"/>
    <path d="M192 22 L192 90 C192 94 208 94 208 90 L208 22 Z" fill="#D38C05"/>
    <rect x="105" y="95" width="190" height="16" rx="8" fill="#EAA313"/>
    
    <!-- Gear -->
    <path d="M200 60 L212 60 L215 74 L228 78 L238 68 L249 75 L246 89 L257 96 L270 90 L278 101 L269 112 L276 124 L290 124 L293 138 L281 147 L284 160 L297 166 L293 180 L279 181 L276 194 L286 205 L278 216 L264 212 L256 223 L262 236 L250 243 L240 233 L228 240 L228 254 L214 257 L209 244 L191 244 L186 257 L172 254 L172 240 L160 233 L150 243 L138 236 L144 223 L136 212 L122 216 L114 205 L124 194 L121 181 L107 180 L103 166 L116 160 L119 147 L107 138 L110 124 L124 124 L131 112 L122 101 L130 90 L143 96 L154 89 L151 75 L162 68 L172 78 L185 74 L188 60 Z" fill="#960112"/>
    <circle cx="200" cy="158" r="66" fill="#FFF9EF"/>
    
    <!-- Triangle Ruler -->
    <polygon points="200,128 274,250 126,250" fill="#EAA313"/>
    <polygon points="200,174 248,238 152,238" fill="#FFF9EF"/>
    <rect x="156" y="180" width="12" height="6" transform="rotate(58 156 180)" fill="#FFF9EF"/>
    <rect x="142" y="202" width="12" height="6" transform="rotate(58 142 202)" fill="#FFF9EF"/>
    <rect x="128" y="224" width="12" height="6" transform="rotate(58 128 224)" fill="#FFF9EF"/>

    <!-- Compass -->
    <circle cx="200" cy="92" r="20" fill="#960112"/>
    <circle cx="200" cy="92" r="10" fill="#FFF9EF"/>
    <rect x="193" y="70" width="14" height="16" rx="4" fill="#960112"/>
    
    <g transform="rotate(28 200 92)">
      <rect x="193" y="102" width="14" height="154" rx="3" fill="#960112"/>
      <rect x="191" y="165" width="18" height="9" rx="2" fill="#FFF9EF" stroke="#960112" stroke-width="2"/>
      <polygon points="193,256 207,256 200,282" fill="#960112"/>
    </g>
    
    <g transform="rotate(-28 200 92)">
      <rect x="193" y="102" width="14" height="154" rx="3" fill="#960112"/>
      <rect x="191" y="165" width="18" height="9" rx="2" fill="#FFF9EF" stroke="#960112" stroke-width="2"/>
      <polygon points="193,256 207,256 200,282" fill="#960112"/>
    </g>

    <!-- Typography -->
    <text x="200" y="355" text-anchor="middle" fill="#960112" font-family="Cairo, sans-serif" font-weight="900" font-size="34">لجنة كلية الهندسة</text>
  </g>
</svg>`;

export const LOGO_DATA_URL = `data:image/svg+xml;utf8,${encodeURIComponent(LOGO_SVG_STRING)}`;
