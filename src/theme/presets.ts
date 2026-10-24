/**
 * 主题预设清单（三层主题模型第 2 层）
 * --------------------------------------------------------------------------
 * 布局与主色的唯一事实来源：TheLayout 按 id 挂 .layout-* class，
 * useTheme 按 id 读写 localStorage，tokens.css 按 id 定义变量。
 * 新增预设时同步更新：presets.ts（本文件）→ tokens.css（变量）→ doce/themes.md（文档）。
 */

export interface LayoutPreset {
  id: LayoutPresetId;
  /** 下拉菜单显示名 */
  label: string;
  /** 一句话特点说明 */
  description: string;
  /** 图标组件名（已在 main.ts 全局注册） */
  icon: string;
  /** 是否提供侧栏折叠（顶栏菜单 / 双栏混合布局不提供） */
  collapsible: boolean;
}

export const LAYOUT_PRESETS = [
  {
    id: 'classic-dark',
    label: '经典深色侧栏',
    description: '深色渐变侧栏 + 白色顶栏，默认风格',
    icon: 'HomeFilled',
    collapsible: true,
  },
  {
    id: 'classic-light',
    label: '经典浅色侧栏',
    description: '白色侧栏 + 主色指示条，明亮轻快',
    icon: 'School',
    collapsible: true,
  },
  {
    id: 'top-nav',
    label: '顶部横向菜单',
    description: '无侧栏，菜单收纳顶栏，内容全宽',
    icon: 'Menu',
    collapsible: false,
  },
  {
    id: 'hybrid-dual',
    label: '双栏混合',
    description: '图标轨 + 二级菜单，层级多时省空间',
    icon: 'Fold',
    collapsible: false,
  },
  {
    id: 'compact-card',
    label: '现代极简卡片风',
    description: '大圆角、柔和阴影、胶囊菜单项',
    icon: 'Postcard',
    collapsible: true,
  },
] as const;

export type LayoutPresetId = (typeof LAYOUT_PRESETS)[number]['id'];

export interface PrimaryPreset {
  id: PrimaryPresetId;
  label: string;
  /** 色板主色，用于选择器色点展示 */
  color: string;
}

export const PRIMARY_PRESETS = [
  { id: 'blue', label: '商务蓝', color: '#409eff' },
  { id: 'green', label: '生机绿', color: '#67c23a' },
  { id: 'orange', label: '活力橙', color: '#e6a23c' },
  { id: 'purple', label: '优雅紫', color: '#7c3aed' },
  { id: 'red', label: '中国红', color: '#f56c6c' },
] as const;

export type PrimaryPresetId = (typeof PRIMARY_PRESETS)[number]['id'];

export const LAYOUT_PRESET_IDS: readonly LayoutPresetId[] = LAYOUT_PRESETS.map((p) => p.id);
export const PRIMARY_PRESET_IDS: readonly PrimaryPresetId[] = PRIMARY_PRESETS.map((p) => p.id);
