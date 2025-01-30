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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { errorMessage } = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    throw new Error(errorMessage);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return response.json(); // status 200-299
}
