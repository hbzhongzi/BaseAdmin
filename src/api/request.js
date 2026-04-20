const BASE_URL = 'http://memory:1000';
export const AUTH_TOKEN_KEY = 'authadmintoken';
export function getAuthToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
}
export function removeAuthToken() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
}
function redirectToLogin() {
    removeAuthToken();
    if (typeof window !== 'undefined') {
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
    }
}
export async function request(url, options = {}) {
    const { data, headers: headersOption, ...rest } = options;
    const headers = new Headers(headersOption ?? {});
    const token = getAuthToken();
    if (token) {
        headers.set(AUTH_TOKEN_KEY, token);
    }
    let body;
    if (data !== undefined) {
        if (data instanceof FormData) {
            // FormData 不需要设置 Content-Type，浏览器会自动设置 multipart/form-data
            body = data;
        }
        else {
            if (!headers.has('Content-Type')) {
                headers.set('Content-Type', 'application/json');
            }
            body = JSON.stringify(data);
        }
    }
    else {
        body = rest.body;
    }
    const response = await fetch(`${BASE_URL}${url}`, {
        ...rest,
        headers,
        body
    });
    const responseText = await response.text();
    let responseBody = responseText;
    try {
        responseBody = responseText ? JSON.parse(responseText) : null;
    }
    catch {
        responseBody = responseText;
    }
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            redirectToLogin();
            throw new Error(responseBody?.message || '身份已过期，请重新登录');
        }
        throw new Error(responseBody?.message || `请求失败：${response.status} ${response.statusText}`);
    }
    if (responseBody &&
        typeof responseBody === 'object' &&
        (responseBody.code === 401 ||
            responseBody.code === 403 ||
            responseBody.status === 401 ||
            responseBody.status === 403)) {
        redirectToLogin();
        throw new Error(responseBody?.message || '身份已过期，请重新登录');
    }
    return responseBody;
}
//# sourceMappingURL=request.js.map