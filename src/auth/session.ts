import { computed, ref } from 'vue';

export const AUTH_TOKEN_KEY = 'authadmintoken';

export interface CurrentAdmin {
  id: number;
  username: string;
  permissions: string[];
}

function readToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

const token = ref<string | null>(readToken());
const currentAdmin = ref<CurrentAdmin | null>(null);

export const isAuthenticated = computed(() => Boolean(token.value));
export const currentUser = computed(() => currentAdmin.value);

export function getAuthToken(): string | null {
  return token.value;
}

export function setAuthToken(value: string): void {
  token.value = value;
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(AUTH_TOKEN_KEY, value);
  }
}

export function setCurrentAdmin(value: CurrentAdmin): void {
  currentAdmin.value = value;
}

export function clearCurrentAdmin(): void {
  currentAdmin.value = null;
}

export function hasPermission(permission: string): boolean {
  return Boolean(
    currentAdmin.value &&
      (currentAdmin.value.permissions.includes('*') ||
        currentAdmin.value.permissions.includes(permission)),
  );
}

export function removeAuthToken(): void {
  token.value = null;
  clearCurrentAdmin();
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}
