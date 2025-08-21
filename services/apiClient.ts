export async function fetchFromAPI() {
  const res = await fetch("https://your-api-endpoint.com/data");
  if (!res.ok) throw new Error("API failed");
  return await res.json();
}

