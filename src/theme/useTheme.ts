/**
 * 主题状态与切换（三层主题模型第 3 层）
 * --------------------------------------------------------------------------
 * - 状态为模块级单例，整个 SPA 共享；组件通过 useTheme() 读写；
 * - 用户偏好持久化到 localStorage，键名统一 memory-admin: 前缀；
 * - 未选择过时回落到构建期默认值（.env 的 VITE_DEFAULT_LAYOUT /
 *   VITE_DEFAULT_PRIMARY，见 doce/deployment.md「模板选择与配置」）；
 * - 布局 class 由 TheLayout 根节点按 layout 值绑定；本模块负责
 *   html 上的 data-primary（主色）与 dark class（Element Plus 暗色）。
 */
import { ref, watch } from 'vue';
import {
  LAYOUT_PRESET_IDS,
  PRIMARY_PRESET_IDS,
  type LayoutPresetId,
  type PrimaryPresetId,
} from './presets';

/** 本地存储键：统一 memory-admin: 前缀，与应用其他存储区分 */
export const THEME_KEYS = {
  layout: 'memory-admin:layout',
  primary: 'memory-admin:primary',
  dark: 'memory-admin:dark',
  sidebarCollapsed: 'memory-admin:sidebar-collapsed',
} as const;

function pickEnv<T extends string>(raw: string | undefined, valid: readonly T[], fallback: T): T {
  return raw && (valid as readonly string[]).includes(raw) ? (raw as T) : fallback;
}

function readStored<T extends string>(key: string, valid: readonly T[], fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const value = window.localStorage.getItem(key);
  return value && (valid as readonly string[]).includes(value) ? (value as T) : fallback;
}

function readBool(key: string, fallback = false): boolean {
  if (typeof window === 'undefined') return fallback;
  const value = window.localStorage.getItem(key);
  return value === null ? fallback : value === '1';
}

/** 构建期默认值（Vite env，非法值自动回落到内置默认） */
const DEFAULT_LAYOUT = pickEnv<LayoutPresetId>(
  import.meta.env.VITE_DEFAULT_LAYOUT,
  LAYOUT_PRESET_IDS,
  'classic-dark',
);
const DEFAULT_PRIMARY = pickEnv<PrimaryPresetId>(
  import.meta.env.VITE_DEFAULT_PRIMARY,
  PRIMARY_PRESET_IDS,
  'blue',
);

// ---- 模块级单例状态 ----
const layout = ref<LayoutPresetId>(readStored(THEME_KEYS.layout, LAYOUT_PRESET_IDS, DEFAULT_LAYOUT));
const primary = ref<PrimaryPresetId>(readStored(THEME_KEYS.primary, PRIMARY_PRESET_IDS, DEFAULT_PRIMARY));
const dark = ref<boolean>(readBool(THEME_KEYS.dark, false));
const sidebarCollapsed = ref<boolean>(readBool(THEME_KEYS.sidebarCollapsed, false));

function apply(): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.dataset.primary = primary.value;
  root.classList.toggle('dark', dark.value);
}

function persist(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(THEME_KEYS.layout, layout.value);
  window.localStorage.setItem(THEME_KEYS.primary, primary.value);
  window.localStorage.setItem(THEME_KEYS.dark, dark.value ? '1' : '0');
  window.localStorage.setItem(THEME_KEYS.sidebarCollapsed, sidebarCollapsed.value ? '1' : '0');
}

// 任一主题状态变化：应用到 DOM 并持久化（模块加载时注册一次）
watch([layout, primary, dark, sidebarCollapsed], () => {
  apply();
  persist();
});

// 模块加载即应用一次，避免刷新时主题闪烁
apply();

export interface ThemeStore {
  layout: typeof layout;
  primary: typeof primary;
  dark: typeof dark;
  sidebarCollapsed: typeof sidebarCollapsed;
  setLayout: (id: LayoutPresetId) => void;
  setPrimary: (id: PrimaryPresetId) => void;
  toggleDark: () => void;
  toggleSidebar: () => void;
  resetTheme: () => void;
}

export function useTheme(): ThemeStore {
  const setLayout = (id: LayoutPresetId): void => {
    if (LAYOUT_PRESET_IDS.includes(id)) layout.value = id;
  };

  const setPrimary = (id: PrimaryPresetId): void => {
    if (PRIMARY_PRESET_IDS.includes(id)) primary.value = id;
  };

  const toggleDark = (): void => {
    dark.value = !dark.value;
  };

  const toggleSidebar = (): void => {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  };

  /** 恢复构建期默认（清除用户偏好后刷新页面） */
  const resetTheme = (): void => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(THEME_KEYS.layout);
    window.localStorage.removeItem(THEME_KEYS.primary);
    window.localStorage.removeItem(THEME_KEYS.dark);
    window.localStorage.removeItem(THEME_KEYS.sidebarCollapsed);
    window.location.reload();
  };

  return {
    layout,
    primary,
    dark,
    sidebarCollapsed,
    setLayout,
    setPrimary,
    toggleDark,
    toggleSidebar,
    resetTheme,
  };
}
