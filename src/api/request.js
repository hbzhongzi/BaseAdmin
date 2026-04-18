const BASE_URL = 'http://memory:1000';
export function getAuthToken() {
    return localStorage.getItem('authadmintoken');
}
export async function request(url, options = {}) {
    const { data, headers: headersOption, ...rest } = options;
    const headers = new Headers(headersOption ?? {});
    const token = getAuthToken();
    if (token) {
        headers.set('authadmintoken', token);
    }
    if (data !== undefined && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }
    const body = data !== undefined ? JSON.stringify(data) : rest.body;
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
//# sourceMappingURL=request.js.map