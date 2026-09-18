import React from 'react';

export type BPWSubBrand = 
  | 'none'
  | 'main'
  | 'pump-mitra'
  | 'pumpmitra'
  | 'engineer'
  | 'e-market'
  | 'emarket'
  | 'jobs'
  | 'careers'
  | 'academy'
  | 'admin'
  | 'crm'
  | (string & {});

export interface BPWLogoProps {
  variant?: 'primary' | 'light-bg' | 'dark-bg' | 'emblem-only' | 'mobile';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  subBrand?: BPWSubBrand;
  customSubtitle?: string;
  showTagline?: boolean;
  className?: string;
}

export const BPWLogo: React.FC<BPWLogoProps> = ({
  variant = 'primary',
  size = 'md',
  subBrand = 'none',
  customSubtitle,
  showTagline = false,
  className = ''
}) => {
  const isDarkBg = variant === 'dark-bg';

  // Sub-brand metadata aligned with Bharat PetroWork Official Architecture
  const subBrandDetails: Record<string, { title: string; subtitle: string; tagBg: string; tagText: string; border: string }> = {
    'none': {
      title: 'BHARAT PETROWORK',
      subtitle: 'Building India’s Fuel Infrastructure with Precision & Trust',
      tagBg: 'bg-amber-500/10',
      tagText: 'text-amber-500',
      border: 'border-amber-500/30'
    },
    'pump-mitra': {
      title: 'PUMP MITRA',
      subtitle: 'Smart Infrastructure Maintenance',
      tagBg: 'bg-emerald-500/10',
      tagText: 'text-emerald-600',
      border: 'border-emerald-500/30'
    },
    'engineer': {
      title: 'ENGINEER APP',
      subtitle: 'Field Service & Technical Operations',
      tagBg: 'bg-amber-500/10',
      tagText: 'text-amber-600',
      border: 'border-amber-500/30'
    },
    'e-market': {
      title: 'E-MARKET',
      subtitle: 'Fuel Infrastructure Marketplace',
      tagBg: 'bg-blue-500/10',
      tagText: 'text-blue-600',
      border: 'border-blue-500/30'
    },
    'jobs': {
      title: 'JOBS & CAREER',
      subtitle: 'Petroleum Engineering Careers',
      tagBg: 'bg-sky-500/10',
      tagText: 'text-sky-600',
      border: 'border-sky-500/30'
    },
    'academy': {
      title: 'TECHNICAL ACADEMY',
      subtitle: 'Build Skills. Get Certified. Become Job Ready.',
      tagBg: 'bg-indigo-500/10',
      tagText: 'text-indigo-600',
      border: 'border-indigo-500/30'
    },
    'admin': {
      title: 'CONTROL CENTER',
      subtitle: 'Operations & Infrastructure Command',
      tagBg: 'bg-slate-700/20',
      tagText: isDarkBg ? 'text-slate-300' : 'text-slate-700',
      border: 'border-slate-500/30'
    }
  };

  // Normalization for aliases
  const normalizeSubBrandKey = (val?: string): string => {
    if (!val || val === 'none' || val === 'main') return 'none';
    if (val === 'emarket' || val === 'e-market') return 'e-market';
    if (val === 'careers' || val === 'jobs') return 'jobs';
    if (val === 'crm' || val === 'admin') return 'admin';
    if (val === 'pump-mitra' || val === 'pumpmitra') return 'pump-mitra';
    if (val === 'engineer') return 'engineer';
    if (val === 'academy') return 'academy';
    return val in subBrandDetails ? val : 'none';
  };

  const normalizedKey = normalizeSubBrandKey(subBrand);
  const isSubBrandActive = normalizedKey !== 'none';
  const currentSub = subBrandDetails[normalizedKey] || subBrandDetails['none'];

  // Sizing dimensions
  const iconSizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14'
  };

  const titleSizeMap = {
    sm: 'text-xs',
    md: 'text-sm font-extrabold',
    lg: 'text-base font-extrabold',
    xl: 'text-xl font-extrabold'
  };

  const subtitleSizeMap = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm'
  };

  // Official Emblem: Fuel Drop + Precision Gear + Shield + Flame
  const Emblem = (
    <div className={`relative ${iconSizeMap[size]} shrink-0 rounded-xl overflow-hidden shadow-sm flex items-center justify-center`}>
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="bpwNavyGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0F2B48" />
            <stop offset="100%" stopColor="#0A1C30" />
          </linearGradient>
          <linearGradient id="bpwFlameGrad" x1="16" y1="10" x2="32" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="60%" stopColor="#E55812" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
          <linearGradient id="bpwGoldGrad" x1="0" y1="0" x2="48" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        {/* Shield Outer Foundation */}
        <path
          d="M24 3L40 9V22C40 32.5 33.2 41.5 24 45C14.8 41.5 8 32.5 8 22V9L24 3Z"
          fill="url(#bpwNavyGrad)"
          stroke="#1E4E8C"
          strokeWidth="1.5"
        />

        {/* Precision Industrial Gear Teeth Elements (Behind Flame) */}
        <circle cx="24" cy="24" r="14" stroke="#1E4E8C" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        
        {/* Dynamic Petroleum Drop & Energy Flame */}
        <path
          d="M24 10C24 10 16 20 16 26.5C16 31 19.5 34.5 24 34.5C28.5 34.5 32 31 32 26.5C32 20 24 10 24 10Z"
          fill="url(#bpwFlameGrad)"
        />

        {/* Inner Luminous Energy Core & Nozzle Flow Arc */}
        <path
          d="M24 16C24 16 19 23.5 19 27C19 29.8 21.2 32 24 32C26.8 32 29 29.8 29 27C29 23.5 24 16 24 16Z"
          fill="#FFFBEB"
          opacity="0.9"
        />

        {/* Clean Fuel Nozzle Geometry */}
        <path
          d="M24 19V29M21.5 24H26.5"
          stroke="#0F2B48"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Trust Star Accent at Apex */}
        <circle cx="24" cy="6" r="1.5" fill="#FBBF24" />
      </svg>
    </div>
  );

  if (variant === 'emblem-only') {
    return <div className={`inline-flex ${className}`}>{Emblem}</div>;
  }

  // Text Styling based on dark / light background
  const primaryTextColor = isDarkBg ? 'text-white' : 'text-[#0F2B48]';
  const mutedTextColor = isDarkBg ? 'text-slate-400' : 'text-slate-500';

  if (variant === 'mobile') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {Emblem}
        <div className="flex flex-col">
          <span className={`font-extrabold tracking-tight leading-none text-xs ${primaryTextColor}`}>
            BHARAT PETROWORK
          </span>
          {isSubBrandActive ? (
            <span className={`text-[9px] font-bold tracking-wider uppercase mt-0.5 ${currentSub.tagText}`}>
              {currentSub.title}
            </span>
          ) : (
            <span className={`text-[8px] font-medium tracking-wide mt-0.5 ${mutedTextColor}`}>
              Fuel Infrastructure
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {Emblem}
      <div className="flex flex-col text-left">
        {/* Main Brand Title */}
        <div className="flex items-center gap-2">
          <span className={`${titleSizeMap[size]} font-extrabold tracking-tight leading-tight ${primaryTextColor}`}>
            BHARAT PETROWORK
          </span>

          {/* Sub-brand pill if designated */}
          {isSubBrandActive && (
            <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold tracking-wide uppercase border ${currentSub.tagBg} ${currentSub.tagText} ${currentSub.border}`}>
              {currentSub.title}
            </span>
          )}
        </div>

        {/* Subtitle / Tagline */}
        <div className={`${subtitleSizeMap[size]} ${mutedTextColor} font-medium leading-tight mt-0.5`}>
          {customSubtitle ? (
            customSubtitle
          ) : isSubBrandActive ? (
            currentSub.subtitle
          ) : showTagline ? (
            'Building India’s Fuel Infrastructure with Precision & Trust'
          ) : (
            'Fuel Infrastructure Engineering & Operations'
          )}
        </div>
      </div>
    </div>
  );
};
