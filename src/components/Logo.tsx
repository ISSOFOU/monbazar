import React from 'react';
import { Heart } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  withTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  withTagline = false,
  className = '',
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-16 h-16',
    xl: 'w-28 h-28',
  }[size];

  const dotSize = {
    sm: 'w-2 h-2 -top-0.5 -right-0.5 border',
    md: 'w-2.5 h-2.5 -top-0.5 -right-0.5 border-[1.5px]',
    lg: 'w-4 h-4 -top-1 -right-1 border-2',
    xl: 'w-7 h-7 top-0 right-0 border-3',
  }[size];

  const textSize = {
    sm: 'text-base font-bold',
    md: 'text-xl font-bold',
    lg: 'text-3xl font-extrabold',
    xl: 'text-4xl font-extrabold tracking-tight',
  }[size];

  const subtextSize = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-base',
  }[size];

  return (
    <div id="mon-bazar-logo-container" className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Shopping Bag Icon with Notification Dot */}
      <div className="relative flex-shrink-0">
        <div
          className={`${iconDimensions} bg-emerald-700 rounded-2xl flex items-center justify-center shadow-md shadow-emerald-700/20 text-white transition-transform duration-200 hover:scale-105`}
        >
          {/* Custom SVG Shopping Bag Icon exactly as shown in screenshot */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3/5 h-3/5"
          >
            <path d="M6 9l1.5 11a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2L22 9H2z" fill="currentColor" fillOpacity="0.95" stroke="none" />
            <path d="M6 9l1.5 11a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2L22 9H2z" />
            <path d="M9 9V6a3 3 0 0 1 6 0v3" stroke="#047857" strokeWidth="2.4" />
            <path d="M9.5 14.5a2.7 2.7 0 0 0 5 0" stroke="#047857" strokeWidth="2" fill="none" />
          </svg>
        </div>
        {/* Coral heart accent badge */}
        <span
          className={`absolute ${dotSize} bg-[#FF6B47] border-white rounded-full shadow-xs flex items-center justify-center`}
        >
          <Heart className="w-[65%] h-[65%] text-white" fill="currentColor" strokeWidth={0} />
        </span>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className={`${textSize} leading-tight font-display`}>
            <span className="text-slate-800">Mon </span>
            <span className="text-emerald-700">Bazar</span>
          </div>
          {withTagline && (
            <span className={`${subtextSize} text-slate-500 font-medium tracking-normal mt-0.5`}>
              Achète & vends près de chez toi
            </span>
          )}
        </div>
      )}
    </div>
  );
};
