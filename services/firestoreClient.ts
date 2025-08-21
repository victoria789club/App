import { fetchFromFirestore } from './firestoreClient';

export async function loadMovieDetails(movieId: string) {
  try {
    const data = await fetchFromFirestore('movies', movieId);
    return data;
  } catch (err) {
    // คุณสามารถจัดการ fallback หรือ logging ที่นี่
    throw err;
  }
}
