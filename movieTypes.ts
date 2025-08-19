
export interface Movie {
  id: number | string; // Can be number for mock, string for firestore
  title: string;
  summary: string;
  posterPath: string; // This will now be a permanent URL from Firebase Storage
  posterOverrideUrl?: string;
  bookingUrl?: string;
  bookingButtonText?: string;
  isAnimated?: boolean;
  order?: number; // Optional field for ordering movies
}
