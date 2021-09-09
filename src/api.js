export default async function apiFetch(url, options, errorMessage) {
  const res = await fetch(url, options);
  if (!res.ok) {
    let error = {};
    const errorText = await res.text();
    error.originalMessage = errorText;
    try {
      error.originalMessage = JSON.parse(errorText);
    } catch (error) {
    }

    error.message = errorMessage;
    throw error;
  }
  return res;
}
