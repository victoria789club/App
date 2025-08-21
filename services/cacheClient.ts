// services/cacheClient.ts

export function getFromCache(key: string): any {
  try {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

export function setToCache(key: string, data: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ไม่ต้องทำอะไรถ้าเขียน cache ไม่สำเร็จ
  }
}
