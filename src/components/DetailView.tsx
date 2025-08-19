import React, { useEffect } from 'react';
import type { Movie } from '../types';
import { BackButton } from './BackButton';

interface DetailViewProps {
  movie: Movie;
  onBack: () => void;
}

export const DetailView: React.FC<DetailViewProps> = ({ movie, onBack }) => {
  // Handle Escape key press to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onBack]);

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-fade-in-fast"
        onClick={onBack}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-slate-800/80 backdrop-blur-lg border border-slate-700 rounded-2xl shadow-2xl overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <BackButton onClick={onBack} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 p-6 pt-10 md:p-8">
            <div className="md:col-span-1">
            <img 
                src={movie.posterPath} 
                alt={`Poster for ${movie.title}`}
                className="w-full h-auto object-cover rounded-lg shadow-lg aspect-[3/4]"
            />
            </div>
            <div className="md:col-span-2 flex flex-col">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">{movie.title}</h2>
              
              <div className="flex-grow">
                  <p className="text-slate-300 text-lg">
                    {movie.summary}
                  </p>
              </div>

              <div className="mt-auto pt-6">
                {movie.bookingUrl ? (
                  <a
                    href={movie.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 transition-all duration-300"
                  >
                    {movie.bookingButtonText || 'จองตั๋ว / ชมโปรโมชั่น'}
                  </a>
                ) : (
                  <button
                    disabled={true}
                    className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md disabled:bg-slate-600/50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {movie.bookingButtonText || 'จองตั๋ว (เร็วๆ นี้)'}
                  </button>
                )}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const style = document.createElement('style');
style.innerHTML = `
@keyframes fade-in-fast {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes scale-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in-fast {
  animation: fade-in-fast 0.3s ease-out forwards;
}
.animate-scale-in {
    animation: scale-in 0.3s ease-out forwards;
}
`;
document.head.appendChild(style);
