/** 主题模块统一出口：预设清单 + 状态管理 */
export {
  LAYOUT_PRESETS,
  LAYOUT_PRESET_IDS,
  PRIMARY_PRESETS,
  PRIMARY_PRESET_IDS,
  type LayoutPreset,
  type LayoutPresetId,
  type PrimaryPreset,
  type PrimaryPresetId,
} from './presets';

export { useTheme, THEME_KEYS, type ThemeStore } from './useTheme';
