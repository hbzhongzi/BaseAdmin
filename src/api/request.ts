const BASE_URL = 'http://memory:1000';

export interface RequestOptions extends RequestInit {
  data?: unknown;
}

export function getAuthToken(): string | null {
  return localStorage.getItem('authadmintoken');
}

export async function request<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers: headersOption, ...rest } = options;
  const headers = new Headers(headersOption ?? {});
  const token = getAuthToken();

  if (token) {
    headers.set('authadmintoken', token);
  }

  let body: BodyInit | null | undefined;

  if (data !== undefined) {
    if (data instanceof FormData) {
      // FormData 不需要设置 Content-Type，浏览器会自动设置 multipart/form-data
      body = data;
    } else {
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }
      body = JSON.stringify(data);
    }
  } else {
    body = rest.body;
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...rest,
    headers,
    body
  });

  if (!response.ok) {
    throw new Error(`请求失败：${response.status} ${response.statusText}`);
  }

  return response.json();
}
