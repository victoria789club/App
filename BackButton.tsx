
import React from 'react';
import { XIcon } from './components/icons';

interface BackButtonProps {
    onClick: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
    return (
        <button 
            onClick={onClick} 
            className="absolute top-4 right-4 z-20 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/70 rounded-full p-2 transition-all duration-200"
            aria-label="Close"
        >
            <XIcon className="w-6 h-6" />
        </button>
    );
};
