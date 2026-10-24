import {
  AUTH_TOKEN_KEY,
  getAuthToken,
  removeAuthToken,
  setAuthToken,
} from '../auth/session';

export { AUTH_TOKEN_KEY, getAuthToken, removeAuthToken, setAuthToken } from '../auth/session';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/').replace(/\/+$/, '');
const DEFAULT_TIMEOUT = 15_000;

export interface RequestOptions extends RequestInit {
  data?: unknown;
  timeoutMs?: number;
  /** 内部选项：刷新请求和重试请求不可再次触发刷新。 */
  skipRefresh?: boolean;
  retry?: boolean;
}

interface ParsedResponse {
  body: any;
  response: Response;
}

function redirectToLogin(): void {
  removeAuthToken();
  if (typeof window === 'undefined') return;

  const target = (import.meta.env.BASE_URL + 'login').replace(/\/+$/, '');
  const current = window.location.pathname.replace(/\/+$/, '') || '/';
  if (current !== target) window.location.href = target;
}

function messageOf(body: any, fallback: string): string {
  return body?.msg || body?.message || fallback;
}

function statusCode(response: Response, body: any): number {
  return Number(body?.code ?? body?.status ?? response.status);
}

function isUnauthenticated(response: Response, body: any): boolean {
  return response.status === 401 || statusCode(response, body) === 401;
}

function isForbidden(response: Response, body: any): boolean {
  return response.status === 403 || statusCode(response, body) === 403;
}

async function parseResponse(response: Response): Promise<ParsedResponse> {
  const responseText = await response.text();
  let body: any = responseText;
  try {
    body = responseText ? JSON.parse(responseText) : null;
  } catch {
    body = responseText;
  }
  return { body, response };
}

async function performRequest<T>(url: string, options: RequestOptions): Promise<T> {
  const {
    data,
    headers: headersOption,
    timeoutMs = DEFAULT_TIMEOUT,
    skipRefresh = false,
    retry = false,
    signal: externalSignal,
    ...rest
  } = options;
  const headers = new Headers(headersOption ?? {});
  const token = getAuthToken();

  if (token) headers.set(AUTH_TOKEN_KEY, token);

  let body: BodyInit | null | undefined;
  if (data !== undefined) {
    if (data instanceof FormData) {
      body = data;
    } else {
      if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
      body = JSON.stringify(data);
    }
  } else {
    body = rest.body;
  }

  const controller = new AbortController();
  const abortFromCaller = () => controller.abort();
  if (externalSignal) {
    if (externalSignal.aborted) controller.abort();
    else externalSignal.addEventListener('abort', abortFromCaller, { once: true });
  }
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const path = url.startsWith('/') ? url : `/${url}`;
    const parsed = await parseResponse(await fetch(`${BASE_URL}${path}`, {
      ...rest,
      headers,
      body,
      signal: controller.signal,
    }));

    if (isUnauthenticated(parsed.response, parsed.body)) {
      if (token && !skipRefresh && !retry && !url.endsWith('/auth/refresh')) {
        const refreshed = await refreshToken();
        if (refreshed) return performRequest<T>(url, { ...options, retry: true });
      }
      redirectToLogin();
      throw new Error(messageOf(parsed.body, '身份已过期，请重新登录'));
    }

    if (isForbidden(parsed.response, parsed.body)) {
      throw new Error(messageOf(parsed.body, '无权访问'));
    }

    if (!parsed.response.ok) {
      throw new Error(messageOf(
        parsed.body,
        `请求失败：${parsed.response.status} ${parsed.response.statusText}`,
      ));
    }

    if (
      parsed.body &&
      typeof parsed.body === 'object' &&
      'code' in parsed.body &&
      parsed.body.code !== 1
    ) {
      throw new Error(messageOf(parsed.body, '请求失败'));
    }

    return parsed.body as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(`请求超时或已取消（${timeoutMs}ms）`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
    externalSignal?.removeEventListener('abort', abortFromCaller);
  }
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshToken(): Promise<boolean> {
  if (!getAuthToken()) return false;
  if (!refreshPromise) {
    refreshPromise = performRequest<{ data?: { token?: string } }>(
      '/api/admin/auth/refresh',
      { method: 'POST', skipRefresh: true },
    )
      .then((result) => {
        const nextToken = result.data?.token;
        if (!nextToken) return false;
        setAuthToken(nextToken);
        return true;
      })
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export function request<T = unknown>(url: string, options: RequestOptions = {}): Promise<T> {
  return performRequest<T>(url, options);
}
