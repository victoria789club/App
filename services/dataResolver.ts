import { fetchFromAPI } from "./apiClient";
import { fetchFromFirestore } from "./firestoreClient";
import { getFromCache, setToCache } from "./cacheClient";

export async function getData(): Promise<any> {
  const cacheKey = "yourDataKey";

  try {
    const apiData = await fetchFromAPI();
    setToCache(cacheKey, apiData);
    return apiData;
  } catch {
    try {
      const firestoreData = await fetchFromFirestore();
      setToCache(cacheKey, firestoreData);
      return firestoreData;
    } catch {
      const cachedData = getFromCache(cacheKey);
      return cachedData;
    }
  }
}
