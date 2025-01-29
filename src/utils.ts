export async function fetchPost<T, R>({
  url,
  payload,
  headers = { "Content-Type": "application/json" },
}: {
  url: string;
  payload: T;
  headers?: HeadersInit;
}): Promise<R> {
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const { errorMessage } = await response.json();
    throw new Error(errorMessage);
  }
  return response.json(); // status 200-299
}
