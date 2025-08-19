export interface Movie {
  id: number;
  title: string;
  summary: string;
  posterPath: string; // Path to the movie poster image
  posterOverrideUrl?: string;
  videoOverrideUrl?: string;
  bookingUrl?: string;
  bookingButtonText?: string;
  isAnimated?: boolean;
}
