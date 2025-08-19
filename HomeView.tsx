
import React from 'react';
import type { Movie } from './movieTypes';
import { FeaturedMovie } from './FeaturedMovie';

interface HomeViewProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  announcement: string;
  featuredMovieId: number | null | string;
}

const AnnouncementBanner: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-indigo-600/80 border border-indigo-500 text-white p-4 rounded-lg mb-8 text-center shadow-lg">
    <p className="font-semibold">{message}</p>
  </div>
);

export const HomeView: React.FC<HomeViewProps> = ({ movies, onSelectMovie, announcement, featuredMovieId }) => {
  const featuredMovie = featuredMovieId ? movies.find(m => m.id.toString() === featuredMovieId.toString()) : null;
  const otherMovies = movies.filter(m => m.id.toString() !== featuredMovieId?.toString());

  return (
    <div className="animate-fade-in">
      {announcement && <AnnouncementBanner message={announcement} />}
      
      {featuredMovie && (
        <div className="mb-10">
          <FeaturedMovie movie={featuredMovie} onSelectMovie={onSelectMovie} />
        </div>
      )}
      
      {otherMovies.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-200">ภาพยนตร์ทั้งหมด</h2>
          </div>
        
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8 md:gap-x-6">
            {otherMovies.map((movie) => (
              <div key={movie.id} className="group cursor-pointer" onClick={() => onSelectMovie(movie)}>
                <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105 bg-slate-800">
                  <img src={movie.posterPath} alt={movie.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-white mt-2 text-sm font-semibold truncate group-hover:text-indigo-300">{movie.title}</h3>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const style = document.createElement('style');
style.innerHTML = `
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
`;
document.head.appendChild(style);
