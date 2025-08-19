import React from 'react';
import type { FabIconType } from '../../App';
import { ChatIcon, HelpIcon, InfoIcon } from './icons';

interface FloatingActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  icon: FabIconType;
}

const Icon: React.FC<{ icon: FabIconType, className: string }> = ({ icon, className }) => {
    switch (icon) {
        case 'help':
            return <HelpIcon className={className} />;
        case 'info':
            return <InfoIcon className={className} />;
        case 'chat':
        default:
            return <ChatIcon className={className} />;
    }
};

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick, disabled, icon }) => {
  return (
    <div className="group fixed bottom-6 right-6 z-40">
      <button
        onClick={onClick}
        disabled={disabled}
        className="flex items-center justify-center w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition-all duration-300"
        aria-label="Open AI Assistant"
      >
        <Icon icon={icon} className="w-7 h-7" />
      </button>
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 w-max px-3 py-1.5 bg-slate-700 text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        AI Assistant (เร็วๆ นี้)
        <div className="absolute top-full right-3 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-700"></div>
      </div>
    </div>
  );
};
