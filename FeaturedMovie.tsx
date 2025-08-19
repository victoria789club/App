
import React from 'react';
import type { Movie } from './movieTypes';
import { InfoIcon } from './components/icons';

interface FeaturedMovieProps {
  movie: Movie;
  onSelectMovie: (movie: Movie) => void;
}

export const FeaturedMovie: React.FC<FeaturedMovieProps> = ({ movie, onSelectMovie }) => {
  return (
    <div 
        className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl group animate-fade-in-slow cursor-pointer"
        onClick={() => onSelectMovie(movie)}
    >
      <img 
        src={movie.posterOverrideUrl || movie.posterPath} 
        alt={`Promotional image for ${movie.title}`}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>
          {movie.title}
        </h2>
        <p className="mt-2 text-slate-200 max-w-2xl line-clamp-2 drop-shadow-md" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
          {movie.summary}
        </p>
        <div className="mt-4">
          <button 
            onClick={(e) => {
                e.stopPropagation(); // Prevent the div's onClick from firing as well
                onSelectMovie(movie);
            }}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-2 px-5 rounded-full transition-all duration-300"
            aria-label={`View details for ${movie.title}`}
          >
            <InfoIcon className="w-5 h-5" />
            <span>รายละเอียดเพิ่มเติม</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Add keyframes for animation in a style tag
const style = document.createElement('style');
style.innerHTML = `
@keyframes fade-in-slow {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in-slow {
  animation: fade-in-slow 0.8s ease-out forwards;
}
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
`;
document.head.appendChild(style);
