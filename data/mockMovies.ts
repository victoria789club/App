
import type { Movie } from '../movieTypes';

export const mockMovies: Movie[] = [
  {
    id: 1,
    title: 'Inception',
    summary: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    posterPath: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    bookingUrl: '#',
    bookingButtonText: 'Book Now',
    isAnimated: false,
  },
  {
    id: 2,
    title: 'Dune: Part Two',
    summary: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    posterPath: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH25Ude5LQ6.jpg',
    bookingUrl: '#',
    bookingButtonText: 'Book Now',
    isAnimated: true,
  },
  {
    id: 3,
    title: 'The Shawshank Redemption',
    summary: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    posterPath: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    bookingUrl: '#',
    bookingButtonText: 'Book Now',
    isAnimated: false,
  },
  {
    id: 4,
    title: 'The Godfather',
    summary: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    posterPath: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    bookingUrl: '#',
    bookingButtonText: 'Book Now',
    isAnimated: false,
  },
];
