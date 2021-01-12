export default async function apiFetch(url, options, errorMessage) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const error = await res.json();
    error.message = errorMessage;
    throw error;
  }
  return res;
}
